

class PolicyBasedAgent
{
    constructor()
    {
        console.log("Init PolicyBasedAgent");
        this.m_inputCount = 4;
        this.m_actionCount = 2;
        this.m_layers = [];
        this.softmaxLayer = null;
        this.m_policyOptimizer = tf.train.adam(g_settings.reinforcement.learningRate);

        // policy model
        this.m_model = this.createPolicyNeuralNetwork(this.m_inputCount, 
                                                        g_settings.reinforcement.units, 
                                                        g_settings.reinforcement.layers,
                                                        this.m_actionCount);
        
        this.m_valueModel = this.createValueModel(this.m_inputCount,
                                                        g_settings.valuemodel.units,
                                                        g_settings.valuemodel.layers);
        // Get a surface
        this.m_visualizationSurface = tfvis.visor().surface({ name: 'PolicyEntropy', tab: 'Charts' });
        this.m_visualizationPolicyData = [];
        this.m_visualizationPolicyIndex = 0;

        this.m_visualizationSurfaceValueModel = tfvis.visor().surface({ name: 'Value Model loss', tab: 'Charts' });
        this.m_visualizationValueModelLossData = [];
        this.m_visualizationValueModelLossIndex = 0;
    }

    discountAndNormalizeRewards(rewards, normalize, debug)
    {
        let discountedRewards = [];
        let size = rewards.length;
        let cumulative = 0.0;

        // compute discounted rewards
        for (let t = size - 1; t >= 0; t--)
        {
            cumulative = rewards[t] + (g_settings.reinforcement.gammaDiscountRate * cumulative);
            discountedRewards.push(cumulative);
        }
        discountedRewards = discountedRewards.reverse();

        // normalize
        if (normalize)
        {
            let mean = VectorUtils.mean(discountedRewards);
            //console.log("mean " + mean);
            let std = VectorUtils.std(discountedRewards) + 1e-10;
            //console.log("std " + std);
            discountedRewards = discountedRewards.map(function(value) {
                return (value - mean) / std;
            });
        }

        if (debug)
            console.log("disc rw " + discountedRewards);

        return discountedRewards;
    }

    // Policy model: state to action
    createPolicyNeuralNetwork(inputCount, unitCount, layerCount, actionCount)
    {
        let model = tf.sequential();

        // Add dense layers
        for (let i = 0; i < layerCount; i++)
        {
            let inputShapeInfo = (i == 0)? inputCount : unitCount;
            let layerCfg = {
                units: (i < layerCount - 1) ? unitCount : actionCount, 
                inputShape: [inputShapeInfo],
                kernelInitializer: 'glorotUniform'
            }

            // relu activation function except for the last layer
            if (i < layerCount - 1)
            {
                layerCfg.activation = 'relu';
            }

            let layer = tf.layers.dense(layerCfg);

            model.add(layer);
            this.m_layers.push(layer);
        }

        // Add softmax layer 
        let layerFinal = tf.layers.softmax();
        model.add(layerFinal);
        //this.m_layers.push(layerFinal);
        this.softmaxLayer = layerFinal;

        model.compile({loss: 'meanSquaredError', optimizer: this.m_policyOptimizer});

        // TODO:
        /**
         * try :
         *   - change state' so that its is the combination of several successive states (add time/velocity/movement)
         *   - try training the agent several times on the same Maze (ok)
         *   - http://amid.fish/reproducing-deep-rl
         *   - graph on mean rewards (ok)
         *   - improve reward function
         *      - https://medium.com/@BonsaiAI/deep-reinforcement-learning-models-tips-tricks-for-writing-reward-functions-a84fe525e8e0
         *      - https://bons.ai/blog/reward-functions-reinforcement-learning-video
         *         1 - (dist / dist_max) ^ 0.4
         *      - https://res.mdpi.com/sensors/sensors-18-03575/article_deploy/sensors-18-03575.pdf?filename=&attachment=1
         *      - https://medium.com/@joshpatterson_5192/deep-q-learning-for-self-driving-cars-c482f1a39367
         */

        return model;
    }

    // Value model : state to average reward (baseline) 
    createValueModel(inputCount, unitCount, layerCount)
    {
        let model = tf.sequential();
        let valueOptimizer = tf.train.adam(g_settings.valuemodel.learningRate);

        // Add dense layers
        for (let i = 0; i < layerCount; i++)
        {
            let inputShapeInfo = (i == 0)? inputCount : unitCount;
            let layerCfg = {
                units: (i < layerCount - 1) ? unitCount : 1, 
                inputShape: [inputShapeInfo],
                kernelInitializer: 'glorotUniform'
            }

            // activation function except for the last layer
            if (i < layerCount - 1)
            {
                layerCfg.activation = 'relu';
            }

            let layer = tf.layers.dense(layerCfg);

            model.add(layer);
        }

        model.compile({loss: 'meanSquaredError', optimizer: valueOptimizer});

        return model;
    }

    train(states, actions, discountedRewards, miniBatchSize, debug)
    {
        const datasetSize = states.shape[0];

        for (let epoch = 0; epoch < g_settings.reinforcement.epochsPerEpisode; epoch++)
        {
            // Use mini-batch gradient descent
            for (let start = 0; start < datasetSize; start += miniBatchSize)
            {
                // build the minibatch
                let end = (start + miniBatchSize < datasetSize) ?  miniBatchSize  : (datasetSize - start);
                const statesSlice = states.slice(start, end);
                const actionsSlice = actions.slice(start, end);
                const discountedRewardsSlice = discountedRewards.slice(start, end);

                //if (debug)
                //{
                //    console.log("About to handle \n\t" + statesSlice + "\n\t" + actionsSlice + "\n\t" + discountedRewardsSlice);
                //}

                // use the internal loss function to provide the loss to minimize
                // In fact this is the policy score function to maximize
                this.m_policyOptimizer.minimize(() => {

                    return tf.tidy(() => {
                        let predictionWithoutSoftmax = this.internalPredict(statesSlice, false);
                        let loss = this.internalLoss(predictionWithoutSoftmax, actionsSlice, discountedRewardsSlice, debug);

                        if (debug)
                        {
                            let policyEntropyTensor = this.internalPolicyEntropy(statesSlice);
                            let policyEntropy = policyEntropyTensor.dataSync()[0];
                            console.log("Epoch " + epoch + " - policy entropy = " + policyEntropy);

                            this.m_visualizationPolicyData.push(
                                { x: 1.0 * this.m_visualizationPolicyIndex++, 
                                y: policyEntropy 
                                }
                            );
                            policyEntropyTensor.dispose();
                        }
                        predictionWithoutSoftmax.dispose();

                        return loss;
                    });
                });

                // dispose tensors
                statesSlice.dispose();
                actionsSlice.dispose();
                discountedRewardsSlice.dispose();
            }
        }

        // Render policy entropy data
        //console.log(this.m_visualizationPolicyData);
        let series = { values : [ this.m_visualizationPolicyData] , series : ["PolicyEntropy"]};
        tfvis.render.linechart(this.m_visualizationSurface, series, {});
    }

    async trainValueModel(states, discountedRewards, miniBatchSize)
    {
        const history = await this.m_valueModel.fit(
            states, discountedRewards, {
            batchSize: miniBatchSize,
            epochs: g_settings.valuemodel.epochs
        });

        // render loss
        let loss = history.history.loss[0];
        this.m_visualizationValueModelLossData.push(
            { x: 1.0 * this.m_visualizationValueModelLossIndex++, 
            y: loss 
            }
        );
        let series = { values : [ this.m_visualizationValueModelLossData] , series : ["Value Model loss"]};
        tfvis.render.linechart(this.m_visualizationSurfaceValueModel, series, {});
    }

    // Internal function defining the Loss function
    // This is in fact the Policy score function to maximize
    // -log(p) * discounted_rewards
    internalLoss(predictedAction, actions, discounted_rewards, debug)
    {
        return tf.tidy(() => {

            /*
            // compute the action as a one hot encoded vector
            //console.log("actions " + this.m_actionCount + " " + actions);
            const one_hot = tf.oneHot(actions, this.m_actionCount);
            // compute log(p)
            const log_term = tf.log(tf.sum(tf.mul(softmaxs, one_hot.asType("float32")), 1));
            // compute -log(p) * discounted_rewards
            const loss = tf.mul(tf.scalar(-1), tf.sum(tf.mul(discounted_rewards, log_term)) );
            return loss;
            //*/

            // compute the action as a one hot encoded vector
            if (debug)
                console.log("actions " + this.m_actionCount + " " + actions);
            const choosen_actions_one_hot = tf.oneHot(actions, this.m_actionCount);

            // compute the negative likelihoods
            let neg_log_prob = tf.losses.softmaxCrossEntropy(choosen_actions_one_hot.asType("float32"), predictedAction);
            // compute the reduced mean of the weighted negative likelihoods (weighted by discounted rewards)
            let loss = tf.mean(tf.mul(neg_log_prob , discounted_rewards)); // reduce_mean (weighted_negative_likelihoods)

            // Other method 1 ???
            let probabilities = predictedAction.softmax();
            let good_probabilities = tf.sum(tf.mul(probabilities, choosen_actions_one_hot.asType("float32")), [1]); // log missing on prob ?
            // maximize the log probability
            let log_probabilities = tf.log(good_probabilities); // log done at wrong location ?
            let eligibility = tf.mul(log_probabilities ,discounted_rewards);
            let loss_v2 = tf.neg(tf.sum(eligibility));

            // Other method 2 ???
            let log_prob_v3 = tf.neg(tf.sum( tf.mul(choosen_actions_one_hot.asType("float32") , tf.log(probabilities)), [1]));
            let eligibilityV3 = tf.mul(log_prob_v3 ,discounted_rewards);
            let total_loss_v3 = tf.sum(eligibilityV3);

            if (debug)
            {


                //console.log("neglogprob = " + neg_log_prob.dataSync()[0] + " - loss =" + loss.dataSync()[0]);
                console.log("neglogprob = " + neg_log_prob.dataSync() + " - loss = " + loss.dataSync() + " logProbV2 = " + log_probabilities.dataSync() + " lossV2 = " + loss_v2.dataSync() );
                console.log("log_prob_v3 = " + log_prob_v3.dataSync() + " - loss_v3 = " + total_loss_v3.dataSync());
            
            }

            //return loss;
            return total_loss_v3;
        });
    }

    // internal prediction
    internalPredict(state, useSoftmax)
    {
        return tf.tidy(() => {
            // NB: We cannot use m_model.predict() as we do not want the softmax to be applied
            //return this.m_model.predict(state);

            let layerCount = this.m_layers.length;
            let data = state;

            // Apply dense layers
            for (let i = 0; i < layerCount; i++)
            {
                data = this.m_layers[i].apply(data);
            }

            // Apply softmax if required
            if (useSoftmax && this.softmaxLayer !== null)
            {
                data = this.softmaxLayer.apply(data);
            }

            return data;
        });
    }

    internalPolicyEntropy(statesSlice)
    {
        let entropy =  tf.tidy(() => {
            let predictionWithSoftmax = this.internalPredict(statesSlice, true);
            return tf.mul(tf.scalar(-1), tf.sum(tf.mul(tf.log(predictionWithSoftmax), predictionWithSoftmax)));
        });

        return entropy;
    }

}