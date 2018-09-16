
class Train extends Phaser.Scene {

    constructor (params)
    {
        super({key : 'Train', active : false});

    }
     
    // function to be executed when the scene is loading
    preload(){
        console.log("#####> preload <#####");
    }
     
    // function to be executed once the scene has been created
    create(params){
        console.log("#####> create <#####");

        this.m_epochs = g_settings.neuralnetwork.epochs;
        this.m_units = g_settings.neuralnetwork.units;
        this.m_layers = g_settings.neuralnetwork.layers;
        this.m_isTraining = false;

        // Add button to quit training 
        this.add.existing(new TextButton(this, game.config.width, 30, 'Quit...', g_settings.style.buttonStyles, () => this.endGame())
                                .setOrigin(1.0)
                                .setScrollFactor(0));
        this.add.existing(new TextButton(this, 10, 30, 'Train again', g_settings.style.buttonStyles, () => this.train())
                                .setOrigin(0.0)
                                .setScrollFactor(0));

        this.m_trainingText = this.add.text(10, 50, 'Training...', g_settings.style.textStyle1).setOrigin(0);

        // Add learning progress bar
        this.m_learningProgressBar = new ProgressBar(this, 10, 100, game.config.width - 20, 50, 2, g_settings.style.progressbar.borderColor, g_settings.style.progressbar.internalColor);

        // Add loss text
        this.m_lossText = this.add.text(10, 175, 'Loss...', g_settings.style.textStyle1).setOrigin(0);

        // Add loss graph
        this.m_graphBoundingBox = {
            x : 10,
            y : 200,
            width : game.config.width - 20,
            height : game.config.height - 200 - 10
        };
        this.m_graph = new Graph(this, this.m_graphBoundingBox.x, 
                                        this.m_graphBoundingBox.y, 
                                        this.m_graphBoundingBox.width, 
                                        this.m_graphBoundingBox.height, 
                                        g_settings.style.graph.backgroundColor, 
                                        g_settings.style.graph.lineColor, 
                                        g_settings.style.graph.lineWidth);

        if (window.ship_raw_dataset !== null && typeof window.ship_raw_dataset !== 'undefined' && window.ship_raw_dataset.runs > 0)
        {
            console.log("About to train with " + window.ship_raw_dataset.runs + " runs");
                                
            let cursorXTraining = {
                name: "cursorX",
                model: this.createBasicDNNRegressorModel(this.m_units, this.m_layers),
                xs: tf.tensor2d(window.ship_raw_dataset.cursorX.x, [window.ship_raw_dataset.cursorX.x.length, 4]),
                ys: tf.tensor2d(window.ship_raw_dataset.cursorX.y, [window.ship_raw_dataset.cursorX.y.length, 1]),
                lastEpoch : 0
            }
            let cursorYTraining = {
                name: "cursorY",
                model: this.createBasicDNNRegressorModel(this.m_units, this.m_layers),
                xs: tf.tensor2d(window.ship_raw_dataset.cursorY.x, [window.ship_raw_dataset.cursorY.x.length, 4]),
                ys: tf.tensor2d(window.ship_raw_dataset.cursorY.y, [window.ship_raw_dataset.cursorY.y.length, 1]),
                lastEpoch : 0
            }
        
            window.ship_cursors_models = [];
            window.ship_cursors_models.push(cursorXTraining);
            window.ship_cursors_models.push(cursorYTraining);
            
            // train
            this.train();
        }
        else
        {
            console.log("No runs available!");
        }

    }

    createBasicDNNRegressorModel(unitCount, layerCount)
    {
        let model = tf.sequential();
        // Add dense layers
        for (let i = 0; i < layerCount; i++)
        {
            let inputShapeInfo = (i == 0)? 4 : unitCount;
            model.add(tf.layers.dense({units: unitCount, activation: 'relu', inputShape: [inputShapeInfo]}));
        }

        // Add linear layer 
        model.add(tf.layers.dense({units: 1, activation: 'linear'}));

        model.compile({loss: 'meanSquaredError', optimizer: 'adagrad'});

        return model;
    }
    

    update(time, delta)
    {

    }

    endGame()
    {
        // return to title screen
        this.scene.stop();
        this.scene.start('Title');
    }

    train()
    {
        if (this.m_isTraining)
        {
            console.log("Already training");
            return;
        }

        if (window.ship_raw_dataset !== null && typeof window.ship_raw_dataset !== 'undefined' && window.ship_raw_dataset.runs > 0)
        {
            console.log("About to train with " + window.ship_raw_dataset.runs + " runs");

            /*
            let cursorXTraining = {
                name: "cursorX",
                model: this.createBasicDNNRegressorModel(this.m_units, this.m_layers),
                xs: tf.tensor2d(window.ship_raw_dataset.cursorX.x, [window.ship_raw_dataset.cursorX.x.length, 3]),
                ys: tf.tensor2d(window.ship_raw_dataset.cursorX.y, [window.ship_raw_dataset.cursorX.y.length, 1]),
                lastEpoch : 0
            }
            let cursorYTraining = {
                name: "cursorY",
                model: this.createBasicDNNRegressorModel(this.m_units, this.m_layers),
                xs: tf.tensor2d(window.ship_raw_dataset.cursorY.x, [window.ship_raw_dataset.cursorY.x.length, 3]),
                ys: tf.tensor2d(window.ship_raw_dataset.cursorY.y, [window.ship_raw_dataset.cursorY.y.length, 1]),
                lastEpoch : 0
            }

            window.ship_cursors_models = [];
            window.ship_cursors_models.push(cursorXTraining);
            window.ship_cursors_models.push(cursorYTraining);
            //*/

            if (window.ship_cursors_models !== null && typeof window.ship_cursors_models !== 'undefined' && window.ship_cursors_models.length == 2)
            {
                // train models iteratively
                this.m_isTraining = true;
                this.trainModels(window.ship_cursors_models, 0);
            }

        }
        else
        {
            console.log("No runs available!");
        }
    }

    trainModels(models, currentIndex)
    {
        if (models === null || typeof models === 'undefined')
        {
            console.log("No models to handle");
            return;
        }

        if (currentIndex < models.length)
        {
            // Handle model
            let training = models[currentIndex];
            let initialEpoch = training.lastEpoch + 1;

            // Train the model using the data.
            console.log("Fit model " + training.name);
            this.m_trainingText.setText("Training " + training.name + "...");
            training.model.fit(training.xs, training.ys, 
                {
                    epochs: this.m_epochs + initialEpoch,
                    initialEpoch : initialEpoch,
                    callbacks : {
                        onEpochEnd: async (epoch, log) => {
                            //console.log('Epoch: ' + epoch + ' - loss = ' + log.loss);
                            this.m_lossText.setText('Epoch: ' + epoch + ' - loss:' + Math.floor(log.loss * 1000)/ 1000.0);
                            if (epoch - initialEpoch <= 0)
                            {
                                console.log("reset graph");
                                this.m_graphMax = log.loss;
                                this.m_graph.reset();
                            }

                            let xFactor = (epoch - initialEpoch) / (1.0 * this.m_epochs);
                            let yFactor = log.loss / this.m_graphMax;

                            // update progress bar
                            this.m_learningProgressBar.update(xFactor);

                            // Update graph
                            this.m_graph.addPointWithFactors(xFactor, yFactor);

                            // store last epoch
                            training.lastEpoch = epoch;
                        }
                    }
                }).then(() => 
            {
                console.log("Training of " + training.name + " over!!!");

                // save model
                // https://js.tensorflow.org/api/0.12.5/#loadModel

                // train next model (if any)
                this.trainModels(models, currentIndex + 1);
            });
        }
        else
        {
            console.log("No more models to train");
            this.m_isTraining = false;
        }

    }
}
