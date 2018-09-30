const REINFORCEMENT_ACTION_LEFT         = 0;
const REINFORCEMENT_ACTION_LEFT_UP      = 1;
const REINFORCEMENT_ACTION_UP           = 2;
const REINFORCEMENT_ACTION_RIGHT_UP     = 3;
const REINFORCEMENT_ACTION_RIGHT        = 4;
const REINFORCEMENT_ACTION_RIGHT_DOWN   = 5;
const REINFORCEMENT_ACTION_DOWN         = 6;
const REINFORCEMENT_ACTION_LEFT_DOWN    = 7;

class PolicyBasedAgent
{
    constructor()
    {
        this.m_inputCount = 4;
        this.m_actionCount = 8;
        this.m_layers = [];
        this.m_policyOptimizer = tf.train.adam(g_settings.reinforcement.learningRate);

        this.m_model = this.createPolicyNeuralNetwork(this.m_inputCount, 
                                                        g_settings.reinforcement.units, 
                                                        g_settings.reinforcement.layers,
                                                        this.m_actionCount);

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
        let std = this.std(discountedRewards);
        //console.log("std " + std);
        discountedRewards = discountedRewards.map(function(value) {
            return (value - mean) / std;
        });
        //console.log("disc rw " + discountedRewards);

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

        model.compile({loss: 'meanSquaredError', optimizer: this.m_policyOptimizer});

        // TODO:
        /**
         * try :
         *   https://medium.com/@jonathan_hui/rl-policy-gradients-explained-9b13b688b146
         *   https://gist.github.com/simoninithomas/7a3357966eaebd58dddb6166c9135930#file-cartpole-reinforce-monte-carlo-policy-gradients-ipynb
         *   - no activation on the last dense layer (If unspecified, no activation is applied. Optional ) => (OK)
         *   - separate softmax activation in separate layer : tf.layers.softmax => (OK) 
         *   - internalPredict without softmax layer => (OK)
         *   - compute the loss with :
         *     - tf.losses.softmaxCrossEntropy()
         *     - tf.mean
         */

        return model;
    }

    train(states, actions, discountedRewards, miniBatchSize, debug)
    {
        const datasetSize = states.shape[0];

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
                let softmaxPredictions = this.internalPredictWithoutSoftmax(statesSlice);
                let loss = this.internalLoss(softmaxPredictions, actionsSlice, discountedRewardsSlice);
                if (debug)
                    console.log(loss.dataSync());
                return loss;
            });

            // dispose tensors
            statesSlice.dispose();
            actionsSlice.dispose();
            discountedRewardsSlice.dispose();
        }
    }


    // Internal function defining the Loss function
    // This is in fact the Policy score function to maximize
    // -log(p) * discounted_rewards
    internalLoss(predictedAction, actions, discounted_rewards)
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

            return loss;
        });
    }

    // internal prediction
    internalPredictWithoutSoftmax(state)
    {
        return tf.tidy(() => {
            // NB: We cannot use m_model.predict() as we do not want the softmax to be applied
            //return this.m_model.predict(state);

            let layerCount = this.m_layers.length;
            let data = state;

            for (let i = 0; i < layerCount; i++)
            {
                data = this.m_layers[i].apply(data);
            }
            return data;
        });
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