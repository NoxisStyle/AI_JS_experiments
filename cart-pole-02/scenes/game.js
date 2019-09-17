

class PlayGame extends Phaser.Scene {

    constructor (params)
    {
        super({key : 'PlayGame', active : false});

        this.m_mode = "USER";
        this.m_lineGraphic = null;
        this.m_cartGraphics = null;
        this.m_poleGraphics = null;
        this.m_controls = null;
        this.m_cursors = null;
        

        this.m_reinforcementEnvironment = null;

        // create reinforcement learning model
        window.reinforcement_model = null;
        window.aiModeInitialized = false;

        window.reinforcement_info = 
        {
            episode : 0,        // current episode
            allRewards : [],     // list of rewards of all episodes
            tmpNStepReward : 0
        };

        this.m_visualizationSurface = tfvis.visor().surface({ name: 'Rewards', tab: 'Charts' });
        this.m_actionSurface = tfvis.visor().surface({ name: 'Actions', tab: 'Charts' });
        this.m_visualizationRewardData = [];

        this.m_cartPoleInfo = new EpisodeInfo();

        this.m_scoreText = null;

        this.m_debugMemory = false;

        this.m_waitRestart = false;
        
    }
     
    // function to be executed when the scene is loading
    preload(){
        //console.log("#####> preload <#####");

        /*
        this.load.image("crate", "crate.png");

        this.load.image("rock_full", "data/rock_full.png");
        this.load.image("rock_left_right", "data/rock_left_right.png");
        this.load.image("rock_left_left", "data/rock_left_left.png");
        this.load.image("rock_right_right", "data/rock_right_right.png");
        this.load.image("rock_right_left", "data/rock_right_left.png");

        this.load.image("rock_tileset", "data/rock_map.png");

        this.load.image("car", "data/car_blue_5.png");
        this.load.image("car2", "data/car_red_5.png");

        this.load.image('road_bkg_center', 'data/road_sand18.png');
        this.load.image('road_bkg_left', 'data/road_sand17.png');
        this.load.image('road_bkg_right', 'data/road_sand19.png');

        this.load.image('road_bkg_arrival_left', 'data/road_sand65.png');
        this.load.image('road_bkg_arrival_center', 'data/road_sand66.png');
        this.load.image('road_bkg_arrival_right', 'data/road_sand67.png');
        //*/
        
    }

    // function to be executed once the scene has been created
    create(params)
    {
        //console.log("#####> create <#####");

        if (params !== null && typeof params !== 'undefined')
        {
            this.m_mode = params.mode;
        }

        console.log("Scene launched in " + this.m_mode + " mode");
        console.log(tf.memory());

        // create reinforcement learning model if required
        window.reinforcement_info.tmpNStepReward = 0;
        let reinforcementModelJustCreated = false;
        if (this.m_mode == "RL_TRAIN" && (window.reinforcement_model === null || typeof window.reinforcement_model === 'undefined'))
        {
            window.reinforcement_model = new PolicyBasedAgent();
            window.reinforcement_info.episode = 0;
            window.reinforcement_info.allRewards = [];
            window.aiModeInitialized = false;
            this.m_visualizationRewardData = [];
            reinforcementModelJustCreated = true;
        }
        else if (this.m_mode == "AI" && window.aiModeInitialized == false)
        {
            window.aiModeInitialized = true;
            window.reinforcement_info.episode = 0;
            window.reinforcement_info.allRewards = [];
            this.m_visualizationRewardData = [];
        }
        else if (this.m_mode == "USER")
        {
            window.aiModeInitialized = false;
        }

        // reset restart variable
        this.m_waitRestart = false;

        // Create the environment

        // Create reinforcement learning environment
        this.m_reinforcementEnvironment = new CartPoleEnvironment();

        // reset episode info
        // In Actor Critic n-step we should not reset everything as
        // we may not have a complete n-step
        let resetingDuringNStep = (this.m_mode == "RL_TRAIN" && window.reinforcement_model !== null && window.reinforcement_model.hasNSteps() && !reinforcementModelJustCreated);
        this.m_cartPoleInfo.reset(resetingDuringNStep);
        

        let world_width = this.m_reinforcementEnvironment.getWorldWidth();
        let scale = game.config.width / world_width;

        // setting Matter world bounds
        /*
        this.matter.world.setBounds(mazeBoundingBox.startX, 
                                    mazeBoundingBox.startY, 
                                    mazeBoundingBox.endX - mazeBoundingBox.startX, 
                                    mazeBoundingBox.endY - mazeBoundingBox.startY);
        //*/

        // Graphics object used to draw rays
        this.m_lineGraphic = this.add.graphics();
        this.m_lineGraphic.lineStyle(1, 0xFF00FF, 0.25); // width, color, alpha

        this.m_cartGraphics = this.add.graphics();
        this.m_cartGraphics.fillStyle(0xFF0000, 1.0); // color, alpha
        this.m_poleGraphics  = this.add.graphics();
        this.m_poleGraphics.lineStyle(10, 0x0000FF, 1.0); // width, color, alpha

        // Configure the camera
        const camera = this.cameras.main;
        // Constrain the camera so that it isn't allowed to move outside the maze bounding box
        /*
        camera.setBounds(   mazeBoundingBox.startX,
                            mazeBoundingBox.startY, 
                            mazeBoundingBox.endX - mazeBoundingBox.startX, 
                            mazeBoundingBox.endY - mazeBoundingBox.startY);
        // center the camera
        camera.scrollX = mazeBoundingBox.startX + (mazeBoundingBox.endX - mazeBoundingBox.startX)/2;
        
        camera.setBounds(   cameraBoundingBox.startX,
            cameraBoundingBox.startY, 
            cameraBoundingBox.endX - cameraBoundingBox.startX, 
            cameraBoundingBox.endY - cameraBoundingBox.startY);
        
        
        //camera.setPosition( mazeBoundingBox.startX + (mazeBoundingBox.endX - mazeBoundingBox.startX)/2);
        // Start following ship
        camera.startFollow(this.m_ship.gameobject);
        //*/

        // Set up the arrows to control the cart
        this.m_cursors = this.input.keyboard.createCursorKeys();


        // Add button to quit training 
        this.add.existing(new TextButton(this, game.config.width, 30, 'Quit...', g_settings.style.buttonStyles, () => this.endGame())
                                .setOrigin(1.0)
                                .setScrollFactor(0));
        
        if (window.reinforcement_info.episode <= 0)
            this.m_scoreText = this.add.text(10, 10, 'Episode: 0 - Last/Mean Reward: 0 / 0', g_settings.style.textStyle1).setOrigin(0.0);
        else
        {
            let meanReward = VectorUtils.mean( window.reinforcement_info.allRewards);
            let lastReward = window.reinforcement_info.allRewards[window.reinforcement_info.allRewards.length - 1];

            this.m_scoreText = this.add.text(10, 10, 'Episode: ' +  window.reinforcement_info.episode + ' - Last/Mean Reward: ' + lastReward + ' / ' + meanReward,
                 g_settings.style.textStyle1).setOrigin(0.0);
        }

    }
    

    update(time, delta)
    {
        if (this.m_waitRestart)
            return;

        // Apply the controls to the camera each update tick of the game
        if (this.m_controls !== null)
            this.m_controls.update(delta);
        
        let cursorX = 0.0;
        let cursorY = 0.0;


        // Update vehicle with user control
        if (this.m_mode == "USER" ||
            (this.m_mode == "AI" && g_settings.versus.opponent0 == OPPONENT_USER))
        {
            let action = -1;
            if (this.m_cursors.left.isDown)
            {
                action = 0;
            }
            else if (this.m_cursors.right.isDown)
            {
                action = 1;
            }

            // Update environment
            this.m_reinforcementEnvironment.step(action);

            // Check if game is done
            if (this.m_reinforcementEnvironment.isDone())
            {
                // restart
                this.scene.restart({ mode : this.m_mode});
            }
        }
        else if (this.m_mode == "RL_TRAIN")
        {
            // Handle reinfoircement learning
            // store reward, action, ...
            this.handleReinforcementLearning(time, true);
        }
        else if (this.m_mode == "AI")
        {
            // Control with stored model
            this.controlWithAI(time, true);
        }

        // render
    
        // Clear the lines
        //this.m_lineGraphic.clear();
        //this.m_lineGraphic.lineStyle(1, 0xFF00FF, 0.25); // width, color, alpha

        let world_width = this.m_reinforcementEnvironment.getWorldWidth();
        let scale = game.config.width / (1.0 * world_width);
        let poleWidth = 100;
        let poleY = 500;
        let poleHeight = 100;

        let cartRect = {
            x : game.config.width / 2 + this.m_reinforcementEnvironment.getCartX() * scale - poleWidth/2,
            y : poleY,
            width : poleWidth,
            height : poleHeight
        }

        let polePosition = {
            x1 : game.config.width / 2 + this.m_reinforcementEnvironment.getCartX() * scale,
            y1: poleY,
            x2: 0,
            y2: 0
        }
        //polePosition.x2 = polePosition.x1 + this.m_reinforcementEnvironment.getPoleLength() * scale * Math.cos(Math.PI/2 + this.m_reinforcementEnvironment.getPoleTheta());
        //polePosition.y2 = polePosition.y1 - this.m_reinforcementEnvironment.getPoleLength() * scale * Math.sin(Math.PI/2 + this.m_reinforcementEnvironment.getPoleTheta());
        polePosition.x2 = polePosition.x1 + this.m_reinforcementEnvironment.getPoleLength() * scale * Math.cos(-Math.PI/2 + this.m_reinforcementEnvironment.getPoleTheta());
        polePosition.y2 = polePosition.y1 + this.m_reinforcementEnvironment.getPoleLength() * scale * Math.sin(-Math.PI/2 + this.m_reinforcementEnvironment.getPoleTheta());

        // Draw cart
        this.m_cartGraphics.clear();
        this.m_cartGraphics.fillStyle(0xFF0000, 1.0); // color, alpha
        this.m_cartGraphics.fillRect(cartRect.x, cartRect.y, cartRect.width, cartRect.height);

        // Draw pole
        this.m_poleGraphics.clear();
        this.m_poleGraphics.lineStyle(10, 0x0000FF, 1.0); // width, color, alpha
        this.m_poleGraphics.beginPath();
        this.m_poleGraphics.moveTo(polePosition.x1, polePosition.y1);
        this.m_poleGraphics.lineTo(polePosition.x2, polePosition.y2);
        this.m_poleGraphics.closePath();
        this.m_poleGraphics.strokePath();

        //console.log(cartRect);




        /*
        if (this.m_lastRaycastTime < 0 || time - this.m_lastRaycastTime > this.m_rayscastPeriod)
        {
            // Clear the lines
            this.m_lineGraphic.clear();
            this.m_lineGraphic.lineStyle(1, 0xFF00FF, 0.25); // width, color, alpha

            // In user mode, store data for learning
            if (this.m_mode == "USER")
            {
                let newRaycast = this.castRays(this.m_ship.gameobject); // [centerRayLengthNormalized, leftRayLengthNormalized, rightRayLengthNormalized, vehicleSpeedFactor];
                this.m_ship.lastRays = newRaycast.slice(0);

                // Check if results must be stored in the dataset
                if (this.m_lastStoreInDatasetTime < 0 || time - this.m_lastStoreInDatasetTime > this.m_storeInDatasetPeriod)
                {
                    // store data in dataset
                    // [ cursorX , cursorY, rayCast center, rayscastLeft, rayscastRight]
                    let row = [];

                    let lastCursorX_x = null;
                    let lastCursorX_y = null;
                    let lastCursorY_x = null;
                    let lastCursorY_y = null;
                    let vehicleSpeedFactor = (this.m_ship.velocity/g_settings.vehicle.maxVelocity);
                    newRaycast.push(vehicleSpeedFactor);
                    if (window.ship_raw_dataset.cursorX.x.length > 0)
                    {
                        lastCursorX_x = window.ship_raw_dataset.cursorX.x[window.ship_raw_dataset.cursorX.x.length - 1];
                        lastCursorX_y = window.ship_raw_dataset.cursorX.y[window.ship_raw_dataset.cursorX.x.length - 1];
                    }
                    if (window.ship_raw_dataset.cursorY.x.length > 0)
                    {
                        lastCursorY_x = window.ship_raw_dataset.cursorY.x[window.ship_raw_dataset.cursorY.x.length - 1];
                        lastCursorY_y = window.ship_raw_dataset.cursorY.y[window.ship_raw_dataset.cursorY.x.length - 1];
                    }

                    if (lastCursorX_x != null && arraysIdentical(lastCursorX_x, newRaycast) &&
                        lastCursorX_y === cursorX)
                    {
                        //console.log("ignore same cursorX")
                    }
                    else
                    {
                        window.ship_raw_dataset.cursorX.x.push(newRaycast);
                        window.ship_raw_dataset.cursorX.y.push(cursorX);
                    }

                    if (lastCursorY_x != null && arraysIdentical(lastCursorY_x, newRaycast) &&
                        lastCursorY_y === cursorY)
                    {
                        //console.log("ignore same cursorY")
                    }
                    else
                    {
                        window.ship_raw_dataset.cursorY.x.push(newRaycast);
                        window.ship_raw_dataset.cursorY.y.push(cursorY);
                    }

                    this.m_lastStoreInDatasetTime = time;
                }
            }

            
            // TODO : do the same with ship1
            if (this.m_mode == "AI")
            {
                // Control vehicle 1
                if (g_settings.versus.opponent0 > OPPONENT_USER)
                    this.controlShipWithAI(this.m_ship, time);

                // Control vehicle 2
                if (g_settings.versus.opponent1 > OPPONENT_USER)
                    this.controlShipWithAI(this.m_ship2, time);
            }

            // Compute rays needed for environment rewards if not computed yet
            // (RL case)
            if (this.m_ship.lastRays === null)
            {
                this.m_ship.lastRays = this.castRays(this.m_ship.gameobject);
            }
            if (this.m_ship2.lastRays === null)
            {
                this.m_ship2.lastRays = this.castRays(this.m_ship2.gameobject);
            }

            // let environment compute rewards
            this.m_reinforcementEnvironment.updateRewards(this.m_ship, this.m_debugRewards1);
            this.m_reinforcementEnvironment.updateRewards(this.m_ship2, this.m_debugRewards2);

            if (this.m_mode == "RL_TRAIN")
            {
                // Handlke reinfoircement learning on ship 1
                // store reward, action, ...
                this.handleReinforcementLearning(time, this.m_ship, true);
            
            }

            this.m_lastRaycastTime = time;
        }



        // handle ship wheel traces
        this.handleShipWheelTraces(time, this.m_ship);
        this.handleShipWheelTraces(time, this.m_ship2);
        
        // reset collision counts
        this.m_reinforcementEnvironment.resetCollisions();
        //*/
    }


    
    controlWithAI(time, debug)
    {
        // retrieve model
        let model = null;
        if (g_settings.versus.opponent0 == OPPONENT_CURRENT_AI)
        {
            if (window.reinforcement_model !== null)
                model = window.reinforcement_model.m_model;
            
            // current model if any
            if (model === null)
            {
                console.log("Error: No current AI !");
            }
        }
        else if (g_settings.versus.opponent0 > OPPONENT_CURRENT_AI)
        {
            // load model from slot
            model = g_settings.versus.storedModels.opponent0;
            if (model === null)
            {
                console.log("Error: No stored AI !");
            }
        }
        
        if (model === null)
            return;

        // Compute current state
        let newState = this.m_reinforcementEnvironment.getState();

        // predict the action to make with Policy model
        //  > compute action probability
        //  > choose action based on probability
        let predictedActionSoftmax = tf.tidy(() => {
            // NB: tf.tidy will clean up all the GPU memory used by tensors inside
            // this function, other than the tensor that is returned.

            const stateTensor = tf.tensor2d(newState, [1, newState.length]);
            let prediction = model.predict(stateTensor).dataSync(); 
            return prediction;
        });
        
        // Compute choice based on action using softmax result as probabilities
        // let action = VectorUtils.randomChoice(predictedActionSoftmax);
        let action = predictedActionSoftmax.indexOf(Math.max(...predictedActionSoftmax));
        this.m_cartPoleInfo.episodeActions.push(action);
        //if (debug)
        //    console.log("RL predicted " + action);

        // Apply the action
        this.applyReinforcementAction(time, action);

        // Compute the state
        this.m_cartPoleInfo.episodeStates.push(newState);

        // Temporaly push the current reward
        // this reward will be overwritten by the value computed at the next update()
        //  (corresponding to the result of the choosen action)
        this.m_cartPoleInfo.episodeRewards.push(this.m_reinforcementEnvironment.getReward());

        // check if the episode should end
        if (this.m_reinforcementEnvironment.isDone() || (g_settings.reinforcement.maxSteps > 0 && this.m_cartPoleInfo.episodeUpdateSteps >=  g_settings.reinforcement.maxSteps))
        {
            // episode is over
            if (debug)
                console.log("Episode over");

            tfvis.render.histogram(this.m_actionSurface, this.m_cartPoleInfo.episodeActions, {});
                
            // Store/display stats
            // compute the episode total reward
            let episodeRewardsSum = VectorUtils.sum(this.m_cartPoleInfo.episodeRewards);

            // Add to the list of epidode rewards
            window.reinforcement_info.allRewards.push(episodeRewardsSum);

            // Compute the mean of all the episode rewards (it should increase)
            let meanReward = VectorUtils.mean( window.reinforcement_info.allRewards);
            let maxReward = VectorUtils.max( window.reinforcement_info.allRewards);

            if (debug)
            {
                console.log("======================");
                console.log("Episode " + window.reinforcement_info.episode);
                console.log("  episode reward : " + episodeRewardsSum);
                console.log("  mean reward    : " + meanReward);
                console.log("  max reward    : " + maxReward);
                console.log("======================");
            }

            // write the score
            //this.m_scoreText.setText('Episode: ' +  window.reinforcement_info.episode + ' - Last/Mean Reward: ' + episodeRewardsSum + ' / ' + meanReward);

            // Add mean reward to visualization
            this.m_visualizationRewardData.push(
                { x: 1.0 *  window.reinforcement_info.episode, 
                  y: meanReward 
                }
            );
            let series = { values : [ this.m_visualizationRewardData] , series : ["MeanRewards"]};
            tfvis.render.linechart(this.m_visualizationSurface, series, {});

            // move to next episode
            window.reinforcement_info.episode++;

            this.scene.restart({ mode : this.m_mode});
        }
    }

    handleReinforcementLearning(time, debug)
    {
        // current reward correspond to previous action and state

        // Compute current state
        let newState = this.m_reinforcementEnvironment.getState();

        // store reward corresponding to action and state choosen and computed at the previous update()
        //if (this.m_cartPoleInfo.episodeRewards.length > 0)
        //{
        //    this.m_cartPoleInfo.episodeRewards[this.m_cartPoleInfo.episodeRewards.length - 1] = this.m_reinforcementEnvironment.getReward();
        //}
        
        // predict reward with Value model
        if (window.reinforcement_model.hasValueModel())
        {
            this.logMemory("before value model predict");

            let predictedValueReward = tf.tidy(() => {

                const stateTensor = tf.tensor2d(newState, [1, newState.length]);
                let prediction = window.reinforcement_model.m_valueModel.predict(stateTensor).dataSync(); 
                //let prediction = window.reinforcement_model.internalPredict(stateTensor, true).dataSync(); // same result
                return prediction;
            });
            this.m_cartPoleInfo.episodeStateValues.push(predictedValueReward);
        }

        // Check if algorithm works on n-steps (e.g. A2C)
        if (window.reinforcement_model.hasNSteps())
        {
            if (this.m_cartPoleInfo.isEndOfNStep())
            {
                console.log("###### n-step " + this.m_cartPoleInfo.episodeNStep + " step=" + this.m_cartPoleInfo.episodeUpdateSteps);
                this.logMemory("before train (n-step)");

                // End the line
                // NB: All the info will be cleared for the next n-steps (the same state will be retrieved again)
                this.m_cartPoleInfo.episodeActions.push(0);         // fake action
                this.m_cartPoleInfo.episodeStates.push(newState);   // new state
                this.m_cartPoleInfo.episodeRewards.push(0);         // fake reward
                this.m_cartPoleInfo.episodeDones.push(0.0);           // fake done
                //this.m_cartPoleInfo.episodeStateValues            // Already pushed

                // Train the value and policy models
                this.m_waitRestart = true;
                window.reinforcement_model.trainModels(this.m_cartPoleInfo, false, debug)
                .then(
                    onTrainingNStepOverCallback.bind( { game : this, debug : debug})
                );

                // leave function now
                return;
            }
            else
            {
                console.log(">>>> step " + this.m_cartPoleInfo.episodeUpdateSteps);
            }
        }

        this.logMemory("before policy model predict");

        // predict the action to make with Policy model
        //  > compute action probability
        //  > choose action based on probability
        let predictedActionSoftmax = tf.tidy(() => {
            // NB: tf.tidy will clean up all the GPU memory used by tensors inside
            // this function, other than the tensor that is returned.

            const stateTensor = tf.tensor2d(newState, [1, newState.length]);
            let prediction = window.reinforcement_model.m_model.predict(stateTensor).dataSync(); 
            //let prediction = window.reinforcement_model.internalPredict(stateTensor, true).dataSync(); // same result
            return prediction;
        });
        //if (debug)
        //    console.log("RL predicted softmax" + predictedActionSoftmax);

        this.logMemory("after policy model predict");

        // Compute choice based on action using softmax result as probabilities
        let action = VectorUtils.randomChoice(predictedActionSoftmax);
        this.m_cartPoleInfo.episodeActions.push(action);
        //if (debug)
        //    console.log("RL predicted " + action);

        // Apply the action
        this.applyReinforcementAction(time, action);

        // Compute the state
        this.m_cartPoleInfo.episodeStates.push(newState);

        // Push the current reward
        this.m_cartPoleInfo.episodeRewards.push(this.m_reinforcementEnvironment.getReward());

        // Push done state
        let episodeDone = (this.m_reinforcementEnvironment.isDone() ||
                            (g_settings.reinforcement.maxSteps > 0 && this.m_cartPoleInfo.episodeUpdateSteps >=  g_settings.reinforcement.maxSteps));
        this.m_cartPoleInfo.episodeDones.push((episodeDone ? 1.0 : 0.0));

        // check if the episode should end
        if (episodeDone)
        {
            // episode is over
            if (debug)
                console.log("Episode over -- about to learn");

            this.logMemory("before train");

            if (window.reinforcement_model.hasNSteps())
            {
                // if the algorithm works on n-steps (e.g. A2C) we do not train the models yet.
                // We only restart the game
                this.m_waitRestart = true;
                this.onTrainingOver(debug);
            }
            else
            {
                // Train the value and policy models
                this.m_waitRestart = true;
                window.reinforcement_model.trainModels(this.m_cartPoleInfo, true, debug)
                .then(
                    onTrainingOverCallback.bind( { game : this, debug : debug})
                );
            }


        }

    }

    applyReinforcementAction(time, action)
    {
        // Update environment
        this.m_reinforcementEnvironment.step(action);
        this.m_cartPoleInfo.onStep();
    }

    logMemory(msg)
    {
        if (this.m_debugMemory)
        {
            console.log(msg);
            console.log(tf.memory());
        }
    }

    endGame()
    {
        // return to title screen
        this.scene.stop();
        this.scene.start('Title');
    }

    onTrainingOver(debug)
    {
        // Display histogram with chosen actions
        tfvis.render.histogram(this.m_actionSurface, this.m_cartPoleInfo.episodeActions, {});

        this.logMemory("after train");

        // Store/display stats
        // compute the episode total reward
        let episodeRewardsSum = VectorUtils.sum(this.m_cartPoleInfo.episodeRewards) 
                                + window.reinforcement_info.tmpNStepReward;

        // Add to the list of epidode rewards
        window.reinforcement_info.allRewards.push(episodeRewardsSum);

        // Compute the mean of all the episode rewards (it should increase)
        let meanReward = VectorUtils.mean( window.reinforcement_info.allRewards);
        let maxReward = VectorUtils.max( window.reinforcement_info.allRewards);

        if (debug)
        {
            console.log("======================");
            console.log("Episode " + window.reinforcement_info.episode);
            console.log("  episode reward : " + episodeRewardsSum);
            console.log("  mean reward    : " + meanReward);
            console.log("  max reward    : " + maxReward);
            console.log("======================");
        }

        // write the score
        //this.m_scoreText.setText('Episode: ' +  window.reinforcement_info.episode + ' - Last/Mean Reward: ' + episodeRewardsSum + ' / ' + meanReward);

        // Add mean reward to visualization
        this.m_visualizationRewardData.push(
            { x: 1.0 *  window.reinforcement_info.episode, 
            y: meanReward 
            }
        );
        let series = { values : [ this.m_visualizationRewardData] , series : ["MeanRewards"]};
        tfvis.render.linechart(this.m_visualizationSurface, series, {});

        // move to next episode
        window.reinforcement_info.episode++;

        this.scene.restart({ mode : this.m_mode});
           
    }

    onTrainingNStepOver(debug)
    {
        // Display histogram with chosen actions
        //tfvis.render.histogram(this.m_actionSurface, this.m_cartPoleInfo.episodeActions, {});

        this.logMemory("after train n-step");

        // Store/display stats
        // compute the episode total reward
        let episodeRewardsSum = VectorUtils.sum(this.m_cartPoleInfo.episodeRewards);

        // Add to the list of epidode rewards
        window.reinforcement_info.tmpNStepReward += episodeRewardsSum;

        if (debug)
        {
            console.log("------ n-step over with rw=" + episodeRewardsSum + 
                        " (sum =" + window.reinforcement_info.tmpNStepReward+ ") ------");
        }

        // Move to next n-step
        this.m_cartPoleInfo.onNewNStep();

        //this.scene.restart({ mode : this.m_mode});
        this.m_waitRestart = false;
           
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

}

function arraysIdentical(a, b) {
    var i = a.length;
    if (i != b.length) return false;
    while (i--) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};

function onTrainingOverCallback()
{
    this.game.onTrainingOver(this.debug);
}

function onTrainingNStepOverCallback()
{
    this.game.onTrainingNStepOver(this.debug);
}
