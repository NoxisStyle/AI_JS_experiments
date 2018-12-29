

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

        this.m_model = this.createPolicyNeuralNetwork(this.m_inputCount, 
                                                        g_settings.reinforcement.units, 
                                                        g_settings.reinforcement.layers,
                                                        this.m_actionCount);

        // Get a surface
        this.m_visualizationSurface = tfvis.visor().surface({ name: 'PolicyEntropy', tab: 'Charts' });
        this.m_visualizationPolicyData = [];
        this.m_visualizationPolicyIndex = 0;
    }

    discountAndNormalizeRewards(rewards)
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
        let mean = this.mean(discountedRewards);
        //console.log("mean " + mean);
        let std = this.std(discountedRewards) + 1e-10;
        //console.log("std " + std);
        discountedRewards = discountedRewards.map(function(value) {
            return (value - mean) / std;
        });
        console.log("disc rw " + discountedRewards);

        return discountedRewards;
    }

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

                // use the internal loss function to provide the loss to minimize
                // In fact this is the policy score function to maximize
                this.m_policyOptimizer.minimize(() => {
                    let predictionWithoutSoftmax = this.internalPredictWithoutSoftmax(statesSlice, false);
                    let loss = this.internalLoss(predictionWithoutSoftmax, actionsSlice, discountedRewardsSlice, debug);

                    if (debug)
                    {
                        let policyEntropy = this.internalPolicyEntropy(statesSlice).dataSync()[0];
                        console.log("Epoch " + epoch + " - policy entropy = " + policyEntropy);

                        this.m_visualizationPolicyData.push(
                            { x: 1.0 * this.m_visualizationPolicyIndex++, 
                            y: policyEntropy 
                            }
                        );

                    }

                    return loss;
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
        tfvis.render.linechart(series, this.m_visualizationSurface, {});
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
            //console.log("actions " + this.m_actionCount + " " + actions);
            const one_hot = tf.oneHot(actions, this.m_actionCount);

            // compute the negative likelihoods
            let neg_log_prob = tf.losses.softmaxCrossEntropy(one_hot.asType("float32"), predictedAction);
            // compute the reduced mean of the weighted negative likelihoods (weighted by discounted rewards)
            let loss = tf.mean(tf.mul(neg_log_prob , discounted_rewards)); // reduce_mean (weighted_negative_likelihoods)

            if (debug)
            {
                console.log("neglogprob = " + neg_log_prob.dataSync()[0] + " - loss =" + loss.dataSync()[0]);
            }

            return loss;
        });
    }

    // internal prediction
    internalPredictWithoutSoftmax(state, useSoftmax)
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
            let predictionWithSoftmax = this.internalPredictWithoutSoftmax(statesSlice, true);
            return tf.mul(tf.scalar(-1), tf.sum(tf.mul(tf.log(predictionWithSoftmax), predictionWithSoftmax)));
        });

        return entropy;
    }

    

    // function to make a random choice
    // equivalent of numpy.random.choice()
    // The probabilities associated with each entry in p
    randomChoice(p) 
    {
        let rnd = p.reduce( (a, b) => a + b ) * Math.random();
        return p.findIndex( a => (rnd -= a) < 0 );
    }

    // compute the sum
    sum(values)
    {
        let sum = values.reduce(function(a, b) { return a + b; });
        return sum;
    }

    max(values)
    {
        let max = values.reduce(function(a, b) { return ((a > b)?a : b); });
        return max;
    }

    // Compute the mean of the array
    mean(values)
    {
        if (values.length == 0)
            return 0;
        let sum = values.reduce(function(a, b) { return a + b; });
        let average = sum / values.length;
        return average;
    }

    // compute the standard deviation
    std(values)
    {
        let avg = this.mean(values);
        
        let squareDiffs = values.map(function(value){
            let diff = value - avg;
            return (diff * diff);
        });
        
        let avgSquareDiff = this.mean(squareDiffs);
        
        let stdDev = Math.sqrt(avgSquareDiff);
        return stdDev;
    }
      
    
}