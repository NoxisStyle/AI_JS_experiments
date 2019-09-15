
class EpisodeInfo
{
    constructor() 
    {
        this.globalStep = 0;
        this.episodeUpdateSteps = 0;
        this.episodeNStep = 0;
        this.episodeRewards = [];
        this.episodeActions = [];
        this.episodeStates = [];
        this.episodeStateValues = [];
        //this.episodeConcatStates = [];
        this.discountedEpisodeRewards = [];
        this.episodeAdvantages = [];
        this.episodeDones = [];
    }

    reset(resetingDuringNStep)
    {
        // Reset update step
        this.episodeUpdateSteps = 0;

        // Only reset those params if we are not
        // in n-step mode
        if (!resetingDuringNStep)
        {
            this.globalStep = 0;
            this.episodeNStep = 0;
            this.episodeRewards = [];
            this.episodeActions = [];
            this.episodeStates = [];
            this.episodeStateValues = [];
            //this.episodeConcatStates = [];
            this.discountedEpisodeRewards = [];
            this.episodeAdvantages = [];
            this.episodeDones = [];
        }
    }

    onStep()
    {
        this.globalStep++;
        this.episodeUpdateSteps++;
    }

    onNewNStep()
    {
        // Do not reset the update step
        //this.episodeUpdateSteps = 0; 
        this.episodeNStep = Math.floor((this.globalStep + 1)  / g_settings.agent.nSteps);

        // reset everything else
        this.episodeRewards = [];
        this.episodeActions = [];
        this.episodeStates = [];
        this.episodeStateValues = [];
        //this.episodeConcatStates = [];
        this.discountedEpisodeRewards = [];
        this.episodeAdvantages = [];
        this.episodeDones = [];
    }

    isEndOfNStep()
    {
        if (this.globalStep > 0 && 
            (this.globalStep + 1) %  g_settings.agent.nSteps == 0)
        {
            // current step is a multiple of the n-step

            console.log("@@@@@ " + this.episodeNStep + "  " + Math.floor(this.globalStep / g_settings.agent.nSteps));

            // Check if n-step already handled
            if (this.episodeNStep < Math.floor((this.globalStep + 1)  / g_settings.agent.nSteps))
                return true;
        }

        return false;
    }
}

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
        //this.m_policyOptimizer = tf.train.adam(g_settings.reinforcement.learningRate, undefined, undefined, 0.1);

        // NB: adam(learningRate = 0.001, beta1 = 0.9, beta2 = 0.999, epsilon: number = null)
        //this.m_policyOptimizer = tf.train.sgd(g_settings.reinforcement.learningRate);

        this.m_algorithm = g_settings.agent.algorithm;

        // policy model
        this.m_model = this.createPolicyNeuralNetwork(this.m_inputCount, 
                                                        g_settings.reinforcement.units, 
                                                        g_settings.reinforcement.layers,
                                                        this.m_actionCount);
        
        // value model
        if (this.hasValueModel())
        {
            this.m_valueModel = this.createValueModel(this.m_inputCount,
                                                            g_settings.valuemodel.units,
                                                            g_settings.valuemodel.layers);
        }
        else
        {
            this.m_valueModel = null;
        }

        // Get a surface
        this.m_visualizationSurface = tfvis.visor().surface({ name: 'PolicyEntropy', tab: 'Charts' });
        this.m_visualizationPolicyData = [];
        this.m_visualizationPolicyIndex = 0;

        this.m_visualizationSurfaceValueModel = tfvis.visor().surface({ name: 'Value Model loss', tab: 'Charts' });
        this.m_visualizationValueModelLossData = [];
        this.m_visualizationValueModelLossIndex = 0;
    }

    hasValueModel()
    {
        if (this.m_algorithm === "REINFORCE")
            return false;
        
        return true;
    }

    hasNSteps()
    {
        if (this.m_algorithm === "A2C")
            return true;
        
        return false;
    }

    shallNormalizeDiscountedReward()
    {
        // Only normalize HERE for the reinforce algorithm
        if (this.m_algorithm === "REINFORCE")
            return g_settings.reinforcement.normalizeAdvantage;
        
        return false;
    }

    discountAndNormalizeRewards(rewards, dones, normalize, debug)
    {
        let discountedRewards = [];
        let size = rewards.length;
        let cumulative = 0.0;

        // compute discounted rewards
        for (let t = size - 1; t >= 0; t--)
        {
            cumulative = rewards[t] + (g_settings.reinforcement.gammaDiscountRate * cumulative) * (1.0 - dones[t]);
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

    async trainModels(episodesInfo, done, debug)
    {
        let episodeRewards = episodesInfo.episodeRewards;
        let removeLastFakeValues = false;

        console.log("trainModels done=" + (done?"y":"n") + " size=" + episodesInfo.episodeRewards.length )

        // With n-step algorithms, the training is done while the episode
        // is not yet over. As a result, the last reward value is estimated from 
        // the state value model.
        // The episodeinfo contains an incomplete line, therefore the value need to
        // be removed once the discounted reward is computed.
        if (this.hasNSteps() && this.hasValueModel() && !done)
        {
            // Use the value model to estimate the last reward (currently a fake value is used)
            episodesInfo.episodeRewards[episodesInfo.episodeRewards.length - 1]
               = episodesInfo.episodeStateValues[episodesInfo.episodeRewards.length - 1];
            episodesInfo.episodeDones[episodesInfo.episodeDones.length - 1] = 1.0;
            
            removeLastFakeValues = true;
        }

        // compute discounted episode rewards
        episodesInfo.discountedEpisodeRewards = this.discountAndNormalizeRewards(
            episodesInfo.episodeRewards,
            episodesInfo.episodeDones,
            this.shallNormalizeDiscountedReward(), // normalize
            debug); // debug
        
        if (removeLastFakeValues)
        {
            episodesInfo.episodeActions.pop();
            episodesInfo.episodeStates.pop();
            episodesInfo.episodeRewards.pop();
            episodesInfo.episodeStateValues.pop();
            episodesInfo.discountedEpisodeRewards.pop();
            episodesInfo.episodeDones.pop();
        }
            
        if (debug)
        {
            console.log("trainModels: actions " + episodesInfo.episodeActions);
            console.log("trainModels: states " + episodesInfo.episodeStates);
            console.log("trainModels: rewards " + episodesInfo.episodeRewards);
            console.log("trainModels: state values " + episodesInfo.episodeStateValues);
            console.log("trainModels: dones " + episodesInfo.episodeDones);
            console.log("trainModels: disc rw " + episodesInfo.discountedEpisodeRewards);
        }
            
        // Compute advantages with discounted rewards - value model predictions (baseline)
        episodesInfo.episodeAdvantages = [];
        if (this.m_algorithm === "REINFORCE_BASELINE" ||
                this.m_algorithm === "A2C")
        {
            for (let i = 0; i < episodesInfo.discountedEpisodeRewards.length; i++)
            {
                episodesInfo.episodeAdvantages.push(episodesInfo.discountedEpisodeRewards[i] - episodesInfo.episodeStateValues[i]);
            }

            if (debug)
                console.log("advantages " + episodesInfo.episodeAdvantages);

            if (g_settings.reinforcement.normalizeAdvantage)
            {
                let std = VectorUtils.std(episodesInfo.discountedEpisodeRewards) + 1e-10;
                console.log("std " + std);
                episodesInfo.episodeAdvantages = episodesInfo.episodeAdvantages.map(function(value) {
                    return value / std;
                });

                if (debug)
                    console.log("normalized advantages " + episodesInfo.episodeAdvantages);
            }
        }
        else
        {
            episodesInfo.episodeAdvantages = episodesInfo.discountedEpisodeRewards;
        }
            
        //if (debug)
        //    console.log("discounted rewards " + ship.discountedEpisodeRewards);
    
        // train neural network
        //tf.tidy(() => {

            this.logMemory("train A");

            // Compute mini batch size for the policy and value models
            let miniBatchSize = g_settings.reinforcement.miniBatchSize;
            if (miniBatchSize > episodesInfo.episodeStates.length)
                miniBatchSize = episodesInfo.episodeStates.length;
            
            let miniBatchSizeVM = g_settings.valuemodel.miniBatchSize;
            if (miniBatchSizeVM > episodesInfo.episodeStates.length)
                miniBatchSizeVM = episodesInfo.episodeStates.length;

            let states = tf.tensor2d(episodesInfo.episodeStates, [episodesInfo.episodeStates.length, episodesInfo.episodeStates[0].length]);
            let actions = tf.tensor1d(episodesInfo.episodeActions, 'int32');
            let advantages = tf.tensor1d(episodesInfo.episodeAdvantages);
                
            this.logMemory("train B");

            if (debug)
                console.log("train after actions " + episodesInfo.episodeActions);   

            // train value model
            if (this.hasValueModel())
            {
                let discountedRewards = tf.tensor1d(episodesInfo.discountedEpisodeRewards);
                await this.trainValueModel(states, discountedRewards, miniBatchSizeVM);
            }

            this.logMemory("train C");
                
            // train policy model with advantages
            this.trainPolicyModel(states, actions, advantages, miniBatchSize, debug);

            states.dispose();
            actions.dispose();
            advantages.dispose();

            this.logMemory("train D");
                
        //});
    }

    trainPolicyModel(states, actions, discountedRewards, miniBatchSize, debug)
    {
        const datasetSize = states.shape[0];

        console.log("About to train Policy model ");

        if (debug)
            this.printPolicyModelWeights();

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
                //    console.log("About tos handle \n\t" + statesSlice + "\n\t" + actionsSlice + "\n\t" + discountedRewardsSlice);
                //}

                // use the internal loss function to provide the loss to minimize
                // In fact this is the policy score function to maximize
                /*
                console.log("Train policy - batch size = " + (end - start));
                let debugGradients = this.m_policyOptimizer.computeGradients(() => {

                    return tf.tidy(() => {
                        let predictionWithoutSoftmax = this.internalPredict(statesSlice, false);
                        console.log("predictionWithoutSoftmax " + predictionWithoutSoftmax.dataSync());
                        let loss = this.internalLoss(predictionWithoutSoftmax, actionsSlice, discountedRewardsSlice, debug);

                        predictionWithoutSoftmax.dispose();

                        return loss;
                    });
                }); 
                console.log(debugGradients);
                for (let key in debugGradients.grads) {
                    console.log("grad " + key + " : " + debugGradients.grads[key].dataSync());
                }
                console.log("grad value : " + debugGradients.value.dataSync());
                //*/


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

                if (debug)
                    this.printPolicyModelWeights();

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
        console.log("About to train value model " + this.m_visualizationValueModelLossIndex);
        //console.log("rewards: " + discountedRewards);
        //console.log("states: " + states);

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

        //console.log("XXXXXXXXXXXXXX " + this.m_visualizationValueModelLossIndex + " " + this.m_visualizationValueModelLossData.length);
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

            let probabilities = predictedAction.softmax();

            // compute the negative likelihoods
            //let neg_log_prob = tf.losses.softmaxCrossEntropy(choosen_actions_one_hot.asType("float32"), predictedAction);
            // compute the reduced mean of the weighted negative likelihoods (weighted by discounted rewards)
            //let loss = tf.mean(tf.mul(neg_log_prob , discounted_rewards)); // reduce_mean (weighted_negative_likelihoods)

            //let neg_log_prob = tf.losses.softmaxCrossEntropy(choosen_actions_one_hot.asType("float32"), probabilities);
            // compute the reduced mean of the weighted negative likelihoods (weighted by discounted rewards)
            //let loss = tf.sum(tf.mul(neg_log_prob , discounted_rewards)); // reduce_mean (weighted_negative_likelihoods)

            /*
            // Other method 1 ???
            let good_probabilities = tf.sum(tf.mul(probabilities, choosen_actions_one_hot.asType("float32")), [1]); // log missing on prob ?
            // maximize the log probability
            let log_probabilities = tf.log(good_probabilities); // log done at wrong location ?
            let eligibility = tf.mul(log_probabilities ,discounted_rewards);
            let loss_v2 = tf.neg(tf.sum(eligibility));

            // Other method 2 ???
            let log_prob_v3 = tf.neg(tf.sum( tf.mul(choosen_actions_one_hot.asType("float32") , tf.log(probabilities)), [1]));
            let eligibilityV3 = tf.mul(log_prob_v3 ,discounted_rewards);
            let total_loss_v3 = tf.sum(eligibilityV3);

            //*/

            // Other method 3 ???
            /*
            let log_prob_v4 = tf.neg(tf.sum( tf.mul(choosen_actions_one_hot.asType("float32") , tf.logSoftmax(predictedAction)), [1]));
            let eligibilityV4 = tf.mul(log_prob_v4 ,discounted_rewards);
            let total_loss_v4 = tf.sum(eligibilityV4);
            //*/

            let log_prob_v4 = tf.neg(tf.sum( tf.mul(choosen_actions_one_hot.asType("float32") , 
                                                    tf.log(tf.clipByValue(probabilities, 1e-5, 1.0 ))), [1]));
            let eligibilityV4 = tf.mul(log_prob_v4 ,discounted_rewards);
            let total_loss_v4 = tf.sum(eligibilityV4);           

            if (debug)
            {


                //console.log("neglogprob = " + neg_log_prob.dataSync() + " - loss =" + loss.dataSync());
                //console.log("logProbV2 = " + log_probabilities.dataSync() + " lossV2 = " + loss_v2.dataSync() );
                //console.log("log_prob_v3 = " + log_prob_v3.dataSync() + " - loss_v3 = " + total_loss_v3.dataSync());
                console.log("log_prob_v4 = " + log_prob_v4.dataSync() + " - loss_v4 = " + total_loss_v4.dataSync());
                total_loss_v4.print();
            }

            //return loss;
            return total_loss_v4;
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

    // print weights and bias
    printPolicyModelWeights()
    {
        let layerCount = this.m_layers.length;
        // Apply dense layers
        for (let i = 0; i < layerCount; i++)
        {
            // kernel:
            console.log("Layer " + i + " weights");
            this.m_layers[i].getWeights()[0].print();
            // bias:
            console.log("Layer " + i + " biases");
            this.m_layers[i].getWeights()[1].print();
        }
    }

    internalPolicyEntropy(statesSlice)
    {
        let entropy =  tf.tidy(() => {
            let predictionWithSoftmax = this.internalPredict(statesSlice, true);
            return tf.mul(tf.scalar(-1), tf.sum(tf.mul(tf.log(predictionWithSoftmax), predictionWithSoftmax)));
        });

        return entropy;
    }

    logMemory(msg)
    {
        if (this.m_debugMemory)
        {
            console.log(msg);
            console.log(tf.memory());
        }
    }
}