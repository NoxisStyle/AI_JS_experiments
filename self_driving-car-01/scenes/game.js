// window.ship_raw_dataset.data will contain the dataset rows
// [ cursorX , cursorY, rayCast center, rayscastLeft, rayscastRight]

const SHIP_TURN_NO = 0;
const SHIP_TURN_LEFT = 1;
const SHIP_TURN_RIGHT = 2;

class PlayGame extends Phaser.Scene {

    constructor (params)
    {
        super({key : 'PlayGame', active : false});

        this.m_mode = "USER";
        this.m_lineGraphic = null;
        this.m_controls = null;
        this.m_ship = new GameVehicle();
        this.m_ship2 = new GameVehicle();
        this.m_endOfZoneSensor = null;
        this.m_cursors = null;
        
        this.m_lastRaycastTime = -1;
        this.m_rayscastPeriod = 0; // 1000;
        this.m_lastStoreInDatasetTime = -1;
        this.m_storeInDatasetPeriod = Math.floor(g_settings.sensor.period * 1000); //500;
        this.m_blockSize = 0;

        this.m_reinforcementEnvironment = null;

        // Create dataset if required
        if (window.ship_raw_dataset === null || typeof window.ship_raw_dataset === 'undefined')
        {
            window.ship_raw_dataset = 
            {
                runs : 0, // number of runs
                cursorX : { // data to predict cursorX
                    x : [], // rayCast center, rayscastLeft, rayscastRight (N, 3)
                    y : []  // cursorX (N, 1)
                },
                cursorY : { // data to predict cursorX
                    x : [], // rayCast center, rayscastLeft, rayscastRight (N, 3)
                    y : []  // cursorY (N, 1)
                }
            };
        }

        // create reinforcement learning model
        window.ship_reinforcement_model = null;

        window.ship_reinforcement_info = 
        {
            episode : 0,        // current episode
            allRewards : []     // list of rewards of all episodes
        };
        
    }
     
    // function to be executed when the scene is loading
    preload(){
        //console.log("#####> preload <#####");
        // loading crate image
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
        
    }

    // function to be executed once the scene has been created
    create(params){
        //console.log("#####> create <#####");

        // ships velocity reset
        this.m_ship.reset();
        this.m_ship2.reset();

        if (params !== null && typeof params !== 'undefined')
        {
            this.m_mode = params.mode;
        }

        console.log("Scene launched in " + this.m_mode + " mode");

        // create reinforcement learning model if required
        if (this.m_mode == "RL_TRAIN" && (window.ship_reinforcement_model === null || typeof window.ship_reinforcement_model === 'undefined'))
        {
            window.ship_reinforcement_model = new PolicyBasedAgent();
        }

        // build random maze object
        let pathCount = g_settings.map.pathCount; // 3;
        let mazeCreationWidth = g_settings.map.width; //10;
        let mazeCreationHeight = g_settings.map.userHeight; //9; //129;
        if (this.m_mode == "AI")
        {
            mazeCreationHeight = g_settings.map.aiHeight; //129; //129;
        }
        let mazePaths = [];
        for (let i = 0; i < pathCount; i++)
        {
            let mazePath = createMazePath(mazeCreationWidth, mazeCreationHeight, g_settings.map.initialPeriod, g_settings.map.deltaFactor); //  8, 1.0
            mazePaths.push(mazePath);
        }
        let maze = buildMazeFormMazeFromPaths(mazePaths, mazeCreationWidth, mazeCreationHeight);
        drawMaze(maze);

        // build maze renderiong and physics with tilemap
        /*
        if (false)
        {
            let mazelayer = null;
            let textureWidth = 70; 
            let textureHeight = 70; 

            // Load tileset specifying the tileWidth and tileHeight
            const map = this.make.tilemap({ data: maze, tileWidth: textureWidth, tileHeight: textureHeight });
            const tiles = map.addTilesetImage("rock_tileset");
            mazelayer = map.createStaticLayer(0, tiles, 0, 0);
            mazelayer.setCollisionBetween(1, 5);

            // Add custom bodies
            // ref https://itnext.io/modular-game-worlds-in-phaser-3-tilemaps-4-meet-matter-js-abf4dfa65ca1
            //layer.forEachTile
            // this.matter.add.tileBody

            // Add matters physics
            this.matter.world.convertTilemapLayer(mazelayer);
        }//*/

        let positionStartX = 35;
        let positionStartY = 35;
        let textureWidth = 70;
        let textureHeight = 70;
        let height = maze.length;
        let width = maze[0].length;
        let endZoneHeight = textureHeight * 3;

        // Store block size
        this.m_blockSize = textureHeight;

        let mazeBoundingBox = {
            startX : positionStartX - textureWidth / 2,
            startY : positionStartY - textureHeight / 2 - endZoneHeight,
            endX : positionStartX + textureWidth * (width - 1) + textureWidth / 2,
            endY : positionStartY + textureHeight * height + textureHeight / 2
        };

        let shipStartPosition = {
            x : positionStartX + textureWidth * width / 2,
            y : positionStartY + textureHeight * height
        };

        let maxHorz = Math.max(game.config.width / 2, (mazeBoundingBox.endX - mazeBoundingBox.startX) / 2);
        let cameraBoundingBox = {
            startX : shipStartPosition.x - textureWidth / 2 - maxHorz,
            startY : positionStartY - textureHeight / 2 - endZoneHeight,
            endX :  shipStartPosition.x- textureWidth / 2 + maxHorz,
            endY : positionStartY + textureHeight * height + textureHeight / 2
        };

        let endZoneSensorPosition = {
            x : positionStartX + textureWidth * width / 2,
            y : positionStartY - 2 * textureHeight,
            width : textureWidth * (width + 1),
            height : textureHeight
        };

        // setting Matter world bounds
        this.matter.world.setBounds(mazeBoundingBox.startX, 
                                    mazeBoundingBox.startY, 
                                    mazeBoundingBox.endX - mazeBoundingBox.startX, 
                                    mazeBoundingBox.endY - mazeBoundingBox.startY);
        
        // Create a category for the environment
        if (g_settings.physics.environmentCategory < 0)
            g_settings.physics.environmentCategory = this.matter.world.nextCategory();


        // build bkg
        let backgroundCenter = this.add.tileSprite(mazeBoundingBox.startX + textureWidth + (mazeBoundingBox.endX - mazeBoundingBox.startX - 2 * textureWidth) / 2,
                                             mazeBoundingBox.startY +  (mazeBoundingBox.endY - mazeBoundingBox.startY) / 2,
                                             (mazeBoundingBox.endX - mazeBoundingBox.startX - 2 * textureWidth),
                                             (mazeBoundingBox.endY - mazeBoundingBox.startY ),
                                             'road_bkg_center');

        let smallBlockOffsetX = 20; // small offset to align with visual (hack)
        let backwardtextureWidth = 128;
        let backwardtextureHeight = 128;
        let backgroundLeft = this.add.tileSprite(mazeBoundingBox.startX + textureWidth/2 - smallBlockOffsetX/2,
                                                mazeBoundingBox.startY +  (mazeBoundingBox.endY - mazeBoundingBox.startY ) / 2,
                                                textureWidth + smallBlockOffsetX,
                                                (mazeBoundingBox.endY - mazeBoundingBox.startY ),
                                                'road_bkg_left');
        let backgroundRight = this.add.tileSprite(mazeBoundingBox.endX - textureWidth/2 + smallBlockOffsetX/2,
                                                    mazeBoundingBox.startY + (mazeBoundingBox.endY - mazeBoundingBox.startY) / 2,
                                                    textureWidth + smallBlockOffsetX,
                                                    (mazeBoundingBox.endY - mazeBoundingBox.startY),
                                                    'road_bkg_right');
        backgroundRight.tilePositionX = (backwardtextureWidth - (textureWidth + smallBlockOffsetX));

        let backgroundArrivalLeft = this.add.tileSprite(mazeBoundingBox.startX + textureWidth/2 - smallBlockOffsetX/2,
                                                        endZoneSensorPosition.y +  endZoneSensorPosition.height / 2,
                                                        textureWidth + smallBlockOffsetX,
                                                        backwardtextureHeight,
                                                        'road_bkg_arrival_left');
        let backgroundArrivalRight = this.add.tileSprite(mazeBoundingBox.endX - textureWidth/2 + smallBlockOffsetX/2,
                                                        endZoneSensorPosition.y +  endZoneSensorPosition.height / 2,
                                                        textureWidth + smallBlockOffsetX,
                                                        backwardtextureHeight,
                                                        'road_bkg_arrival_right');
        backgroundArrivalRight.tilePositionX = (backwardtextureWidth - (textureWidth + smallBlockOffsetX));
        let backgroundArrivalCenter = this.add.tileSprite(mazeBoundingBox.startX + textureWidth + (mazeBoundingBox.endX - mazeBoundingBox.startX - 2 * textureWidth) / 2,
                                                        endZoneSensorPosition.y +  endZoneSensorPosition.height / 2,
                                                        (mazeBoundingBox.endX - mazeBoundingBox.startX - 2 * textureWidth),
                                                        backwardtextureHeight,
                                                        'road_bkg_arrival_center');

        // Graphics object used to draw rays
        this.m_lineGraphic = this.add.graphics();
        this.m_lineGraphic.lineStyle(1, 0xFF00FF, 0.25); // width, color, alpha

        // build maze rendering and physics manually
        if (true)
        {
            for (let y = 0; y < height; y ++)
            {
                
                for (let x = 0; x < width; x++)
                {
                    // NB: center of mass of the triangle: (2 * length /3 , 2 * length /3)
                    // http://wwwf.imperial.ac.uk/metric/metric_public/mechanics/centres_of_mass/centres_of_mass.html
                    let triangleCenterofmassOffset = 0; //(2 /* * textureWidth */) / 3.0;

                    if (maze[y][x] == CELL_FULL)
                    {
                        var part = this.matter.add.image(
                            positionStartX + textureWidth * x, 
                            positionStartY + textureHeight * y, 
                            "rock_full", null,
                            {
                                shape: { type: 'fromVerts',  
                                        verts:  [
                                        { x: 0, y: 0 },
                                        { x: 0, y: textureHeight },
                                        { x: textureWidth, y: textureHeight },
                                        { x: textureWidth, y: 0 }]
                                }
                        });
                        part.setStatic(true);
                        part.setCollisionCategory(g_settings.physics.environmentCategory);
                    }
                    else if (maze[y][x] == CELL_LEFT_LEFT)
                    {

                        var shapeTriangle = [
                                        { x: 0, y: 0 },
                                        { x: 0, y: textureHeight },
                                        { x: textureWidth, y: textureHeight }];
                        var center = Phaser.Physics.Matter.Matter.Vertices.centre(shapeTriangle);
                        let correction = {
                             x: center.x - textureWidth/2,
                             y: center.y - textureHeight/2,
                        }

                        var part = this.matter.add.sprite(
                            positionStartX + textureWidth * x + correction.x, 
                            positionStartY + textureHeight * y + correction.y, 
                            "rock_left_left", null,
                            {
                                shape: { type: 'fromVerts',  
                                        verts:  shapeTriangle
                                }
                        });
                        part.setStatic(true);
                        part.setCollisionCategory(g_settings.physics.environmentCategory);
                    }
                    else if (maze[y][x] == CELL_LEFT_RIGHT)
                    {
                        var shapeTriangle = [
                                { x: 0, y: 0 },
                                { x: textureWidth, y: textureHeight },
                                { x: textureWidth, y: 0 }];
                        var center = Phaser.Physics.Matter.Matter.Vertices.centre(shapeTriangle);
                        let correction = {
                             x: center.x - textureWidth/2,
                             y: center.y - textureHeight/2,
                        }

                        var part = this.matter.add.image(
                            positionStartX + textureWidth * x + correction.x,
                            positionStartY + textureHeight * y + correction.y,
                            "rock_left_right", null,
                            {
                                shape: { type: 'fromVerts',  
                                        verts:  shapeTriangle
                                }
                            }
                        );
                        part.setStatic(true);
                        part.setCollisionCategory(g_settings.physics.environmentCategory);
                    }
                    else if (maze[y][x] == CELL_RIGHT_RIGHT)
                    {
                        var shapeTriangle = [
                                { x: 0, y: textureHeight},
                                { x: textureWidth, y: textureHeight },
                                { x: textureWidth, y: 0 }];
                        var center = Phaser.Physics.Matter.Matter.Vertices.centre(shapeTriangle);
                        let correction = {
                             x: center.x - textureWidth/2,
                             y: center.y - textureHeight/2,
                        }

                        var part = this.matter.add.image(
                            positionStartX + textureWidth * x + correction.x,
                            positionStartY + textureHeight * y + correction.y,
                            "rock_right_right", null,
                            {
                                shape: { type: 'fromVerts',  
                                        verts:  shapeTriangle
                                }
                            }
                        );
                        part.setStatic(true);
                        part.setCollisionCategory(g_settings.physics.environmentCategory);
                    }
                    else if (maze[y][x] == CELL_RIGHT_LEFT)
                    {
                        var shapeTriangle = [
                                { x: 0, y: 0},
                                { x: 0, y: textureHeight },
                                { x: textureWidth, y: 0 }];
                        var center = Phaser.Physics.Matter.Matter.Vertices.centre(shapeTriangle);
                        let correction = {
                             x: center.x - textureWidth/2,
                             y: center.y - textureHeight/2,
                        }

                        var part = this.matter.add.image(
                            positionStartX + textureWidth * x + correction.x,
                            positionStartY + textureHeight * y + correction.y,
                            "rock_right_left", null,
                            {
                                shape: { type: 'fromVerts',  
                                        verts:  shapeTriangle
                                }
                            }
                        );
                        part.setStatic(true);
                        part.setCollisionCategory(g_settings.physics.environmentCategory);
                    }
                }
            }
        }

        // Add wheel traces
        this.m_ship.wheelTraces = new WheelTrace(this, 0x000000, 0.2, 2, 2000);
        this.m_ship2.wheelTraces = new WheelTrace(this, 0x000000, 0.2, 2, 2000);

        // Create a category for the vehicles
        if (g_settings.physics.vehiclesCategory < 0)
            g_settings.physics.vehiclesCategory = this.matter.world.nextCategory();

        // Add vehicle
        this.m_ship.gameobject = this.matter.add.image(shipStartPosition.x - textureWidth/2, shipStartPosition.y, "car");
        this.m_ship.gameobject.setScale(g_settings.vehicle.scale, g_settings.vehicle.scale);
        //this.m_ship.gameobject.setFixedRotation();
        //this.m_ship.gameobject.setAngle(270);
        this.m_ship.gameobject.setFrictionAir(0.05);
        this.m_ship.gameobject.setMass(30);
        this.m_ship.gameobject.setCollisionCategory(g_settings.physics.vehiclesCategory);
        //this.m_ship.gameobject.setCollidesWith([ 1 , g_settings.physics.environmentCategory ]);

        // Add vehicle
        this.m_ship2.gameobject = this.matter.add.image(shipStartPosition.x + textureWidth/2, shipStartPosition.y, "car2");
        this.m_ship2.gameobject.setScale(g_settings.vehicle.scale, g_settings.vehicle.scale);
        //this.m_ship.gameobject.setFixedRotation();
        //this.m_ship.gameobject.setAngle(270);
        this.m_ship2.gameobject.setFrictionAir(0.05);
        this.m_ship2.gameobject.setMass(30);
        this.m_ship2.gameobject.setCollisionCategory(g_settings.physics.vehiclesCategory);
        //this.m_ship2.gameobject.setCollidesWith([ 1 , g_settings.physics.environmentCategory ]);

        // load the models
        if (this.m_mode == "AI")
        {
            // reset
            this.m_ship.cursorXModel = null;
            this.m_ship.cursorYModel = null;
            this.m_ship2.cursorXModel = null;
            this.m_ship2.cursorYModel = null;

            if (g_settings.versus.opponent0 == OPPONENT_CURRENT_AI)
            {
                // current model if any
                if ( window.ship_cursors_models !== null && typeof  window.ship_cursors_models !== 'undefined'
                    &&  window.ship_cursors_models.length == 2)
                {
                    this.m_ship.cursorXModel = window.ship_cursors_models[0].model;
                    this.m_ship.cursorYModel = window.ship_cursors_models[1].model;
                }
                else
                {
                    console.log("Error: No current AI !");
                }
            }
            else if (g_settings.versus.opponent0 > OPPONENT_CURRENT_AI)
            {
                // load model from slot
                this.m_ship.cursorXModel = g_settings.versus.storedModels.opponent0_cursorX;
                this.m_ship.cursorYModel = g_settings.versus.storedModels.opponent0_cursorY;
            }

            if (g_settings.versus.opponent1 == OPPONENT_CURRENT_AI)
            {
                // current model if any
                if ( window.ship_cursors_models !== null && typeof  window.ship_cursors_models !== 'undefined'
                    &&  window.ship_cursors_models.length == 2)
                {
                    this.m_ship2.cursorXModel = window.ship_cursors_models[0].model;
                    this.m_ship2.cursorYModel = window.ship_cursors_models[1].model;
                }
                else
                {
                    console.log("Error: No current AI !");
                }
            }
            else if (g_settings.versus.opponent1 > OPPONENT_CURRENT_AI)
            {
                // load model from slot
                this.m_ship2.cursorXModel = g_settings.versus.storedModels.opponent1_cursorX;
                this.m_ship2.cursorYModel = g_settings.versus.storedModels.opponent1_cursorY;
            }
        }

        // Add the end sensor
        this.m_endOfZoneSensor = this.matter.add.rectangle(
            endZoneSensorPosition.x, 
            endZoneSensorPosition.y, 
            endZoneSensorPosition.width,
            endZoneSensorPosition.height, 
            { 
                isStatic: true
                ,isSensor: true
             });

        // Create reinforcement learning environment
        this.m_reinforcementEnvironment = new GameReinforcementLearningEnvironment(
            g_settings.physics.environmentCategory,
            g_settings.physics.vehiclesCategory,
            this.m_endOfZoneSensor,
            this.m_ship,
            this.m_ship2,
            this.m_mode
        );

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
        //*/
        camera.setBounds(   cameraBoundingBox.startX,
            cameraBoundingBox.startY, 
            cameraBoundingBox.endX - cameraBoundingBox.startX, 
            cameraBoundingBox.endY - cameraBoundingBox.startY);
        
        //camera.setPosition( mazeBoundingBox.startX + (mazeBoundingBox.endX - mazeBoundingBox.startX)/2);
        // Start following ship
        camera.startFollow(this.m_ship.gameobject);

        // Set up the arrows to control the ship
        this.m_cursors = this.input.keyboard.createCursorKeys();
        /*
        // move camera
        this.m_controls = new Phaser.Cameras.Controls.FixedKeyControl({
            camera: camera,
            left: this.m_cursors.left,
            right: this.m_cursors.right,
            up: this.m_cursors.up,
            down: this.m_cursors.down,
            speed: 0.5
        });//*/

        // Add button to quit training 
        this.add.existing(new TextButton(this, game.config.width, 30, 'Quit...', g_settings.style.buttonStyles, () => this.endGame())
                                .setOrigin(1.0)
                                .setScrollFactor(0));
        

        // Handle collisions
        this.matter.world.on('collisionstart', function (event) {

            for (var i = 0; i < event.pairs.length; i++)
            {
                var bodyA = event.pairs[i].bodyA;
                var bodyB = event.pairs[i].bodyB;
                let gameOver = false;

                // let environment handle collisions
                //this.m_reinforcementEnvironment.onCollisionStart(bodyA, bodyB);

                // Check if user of AI win
                if ((bodyA === this.m_ship.gameobject.body && bodyB === this.m_endOfZoneSensor) ||
                    (bodyA === this.m_endOfZoneSensor && bodyB === this.m_ship.gameobject.body))
                {

                    console.log("##### USER WINS #####");
                    gameOver = true;

                    if (this.m_mode == "USER")
                    {
                        window.ship_raw_dataset.runs += 1;
                        console.log(window.ship_raw_dataset);
                    }
                }
                if ((bodyA === this.m_ship2.gameobject.body && bodyB === this.m_endOfZoneSensor) ||
                    (bodyA === this.m_endOfZoneSensor && bodyB === this.m_ship2.gameobject.body))
                {

                    console.log("##### AI WINS #####");
                    gameOver = true;
                }

                // Handle gameover
                // > shake screen and then restart the scene
                if (gameOver)
                {
                    // Camera effect
                    //this.cameras.main.fade(500, 0, 0, 0);
                    this.cameras.main.shake(250, 0.01);

                    this.time.addEvent({
                        delay: 500,
                        callback: function ()
                        {
                            this.cameras.main.resetFX();
                            //this.scene.stop();
                            //this.scene.start('PlayGame');
                            this.scene.restart({ mode : this.m_mode});
                        },
                        callbackScope: this
                    });
                }
            }
        }, this);

        //*
        this.matter.world.on('collisionactive', function (event) {
            // reset collision counts
            this.m_reinforcementEnvironment.resetCollisions();

            // let environment count collisions
            for (var i = 0; i < event.pairs.length; i++)
            {
                var bodyA = event.pairs[i].bodyA;
                var bodyB = event.pairs[i].bodyB;

                // let environment handle collisions
                this.m_reinforcementEnvironment.onCollisionActive(bodyA, bodyB);
            }
        }, this);
        //*/

        /*
        this.matter.world.on("collisionend", function (event) {

            for (var i = 0; i < event.pairs.length; i++)
            {
                var bodyA = event.pairs[i].bodyA;
                var bodyB = event.pairs[i].bodyB;

                // let environment handle collisions
                //this.m_reinforcementEnvironment.onCollisionEnd(bodyA, bodyB);
            }
        }, this);
        //*/
    }
    

    update(time, delta)
    {
        // Apply the controls to the camera each update tick of the game
        if (this.m_controls !== null)
            this.m_controls.update(delta);
        
        let cursorX = 0.0;
        let cursorY = 0.0;

        // Update vehicle with user control
        if (this.m_mode == "USER" || g_settings.versus.opponent0 == OPPONENT_USER)
        {
            if (this.m_cursors.up.isDown)
            {
                // Acceleration
                if (this.m_ship.velocity < g_settings.vehicle.maxVelocity)
                    this.m_ship.velocity += g_settings.vehicle.velocityIncrement;
                cursorY = 1.0;
            }
            else if (this.m_cursors.down.isDown)
            {
                // backward/brake
                if (this.m_ship.velocity > -g_settings.vehicle.maxVelocity)
                    this.m_ship.velocity -= g_settings.vehicle.velocityIncrement;
                cursorY = -1.0;
            }
            else {
                this.m_ship.velocity *= g_settings.vehicle.velocityAttenuation;
            }
            
            // NB: PI / 180 = 0.01745
            this.m_ship.gameobject.setVelocity(this.m_ship.velocity * Math.cos((this.m_ship.gameobject.angle - 90) * 0.01745),
                                    this.m_ship.velocity * Math.sin((this.m_ship.gameobject.angle - 90) * 0.01745));
            
            if (this.m_cursors.left.isDown)
            {
                this.m_ship.gameobject.setAngularVelocity(-g_settings.vehicle.angularVelocity * (this.m_ship.velocity/g_settings.vehicle.maxVelocity));

                // handle ship turn and wheel traces
                if (this.m_ship.turn != SHIP_TURN_LEFT || this.m_ship.turnStart < 0)
                {
                    this.m_ship.turn = SHIP_TURN_LEFT;
                    this.m_ship.turnStart = time;
                }

                this.m_ship.hasWheelTrace = (this.m_ship.velocity >= 0.5 * g_settings.vehicle.maxVelocity && (time - this.m_ship.turnStart) >= g_settings.vehicle.delayForTraces );
                cursorX = -1.0;
            }
            else if (this.m_cursors.right.isDown)
            {
                this.m_ship.gameobject.setAngularVelocity(g_settings.vehicle.angularVelocity * (this.m_ship.velocity/g_settings.vehicle.maxVelocity));

                // handle ship turn and wheel traces
                if (this.m_ship.turn != SHIP_TURN_RIGHT || this.m_ship.turnStart < 0)
                {
                    this.m_ship.turn = SHIP_TURN_RIGHT;
                    this.m_ship.turnStart = time;
                }

                this.m_ship.hasWheelTrace = (this.m_ship.velocity >= 0.5 * g_settings.vehicle.maxVelocity && (time - this.m_ship.turnStart) >= g_settings.vehicle.delayForTraces );
                cursorX = 1.0;
            }
            else
            {
                this.m_ship.gameobject.setAngularVelocity(0);

                this.m_ship.turn = SHIP_TURN_NO;
                this.m_ship.turnStart = -1;
                this.m_ship.hasWheelTrace = false;
            }
        }

        if (this.m_lastRaycastTime < 0 || time - this.m_lastRaycastTime > this.m_rayscastPeriod)
        {
            // Clear the lines
            this.m_lineGraphic.clear();
            this.m_lineGraphic.lineStyle(1, 0xFF00FF, 0.25); // width, color, alpha

            // In user mode, store data for learning
            if (this.m_mode == "USER")
            {
                let newRaycast = this.castRays(this.m_ship.gameobject); // [centerRayLengthNormalized, leftRayLengthNormalized, rightRayLengthNormalized, vehicleSpeedFactor];

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

            // let environment compute rewards
            this.m_reinforcementEnvironment.updateRewards(this.m_ship, false);
            this.m_reinforcementEnvironment.updateRewards(this.m_ship2, false);

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
    }

    castRays(ship)
    {
        let maxRayLength = this.m_blockSize * g_settings.sensor.distanceInBlocks * 1.0;

        // front
        // compute the size of the vector projected on vectors X and Y
        let angleRad = ((ship.angle - 90) * Math.PI) / 180.0;
        let normX = Math.cos(angleRad); //Math.sqrt(0.5);
        let normY = Math.sin(angleRad);
        let startPoint =  { x : ship.body.position.x , y :  ship.body.position.y};
        let endPoint = { x: startPoint.x + normX * maxRayLength, y: startPoint.y + normY * maxRayLength };
        let centerRayLengthNormalized = this.castRay(startPoint, endPoint, this.matter.world.localWorld.bodies, ship.body, maxRayLength);
        centerRayLengthNormalized = Math.round(centerRayLengthNormalized * 1000) / 1000.0; // remove precision

        // left
        angleRad = ((ship.angle - 90 - g_settings.sensor.angle) * Math.PI) / 180.0;
        normX = Math.cos(angleRad); //Math.sqrt(0.5);
        normY = Math.sin(angleRad);
        endPoint = { x: startPoint.x + normX * maxRayLength, y: startPoint.y + normY * maxRayLength };
        let leftRayLengthNormalized = this.castRay(startPoint, endPoint, this.matter.world.localWorld.bodies, ship.body, maxRayLength);
        leftRayLengthNormalized = Math.round(leftRayLengthNormalized * 1000) / 1000.0; // remove precision

        // right
        angleRad = ((ship.angle - 90 + g_settings.sensor.angle) * Math.PI) / 180.0;
        normX = Math.cos(angleRad); //Math.sqrt(0.5);
        normY = Math.sin(angleRad);
        endPoint = { x: startPoint.x + normX * maxRayLength, y: startPoint.y + normY * maxRayLength };
        let rightRayLengthNormalized = this.castRay(startPoint, endPoint, this.matter.world.localWorld.bodies, ship.body, maxRayLength);
        rightRayLengthNormalized = Math.round(rightRayLengthNormalized * 1000) / 1000.0; // remove precision

        return [centerRayLengthNormalized, leftRayLengthNormalized, rightRayLengthNormalized];
    }

    castRay(start, end, bodies, excludedBody, normalizationFactor)
    {
        let collisions = raycast(bodies, start, end, true);
        for (let i = 0; i < collisions.length; i++) 
        {
            let collision = collisions[i];
            if (typeof collision.body !== 'undefined' &&
                    collision.body !== null &&
                    collision.body !== excludedBody)
            {
                this.m_lineGraphic.beginPath();
                this.m_lineGraphic.moveTo(start.x, start.y);
                this.m_lineGraphic.lineTo(collision.point.x, collision.point.y);
                this.m_lineGraphic.closePath();
                this.m_lineGraphic.strokePath();

                let length = Math.sqrt(
                    Math.pow(collision.point.x - start.x, 2) +
                    Math.pow(collision.point.y - start.y, 2));

                // Only consider the first non-excluded body.
                // NB: the bodies are sorted
                return length / normalizationFactor;
            }
        }
        

        let length = Math.sqrt(
            Math.pow(end.x - start.x, 2) +
            Math.pow(end.y - start.y, 2));
        return length / normalizationFactor;
    }

    controlShipWithAI(ship, time)
    {
        let newRaycast = this.castRays(ship.gameobject); // [centerRayLengthNormalized, leftRayLengthNormalized, rightRayLengthNormalized, vehicleSpeedFactor];
        let predictedCursorX = 0.0;
        let predictedCursorY = 0.0;

        if (ship.cursorXModel !== null && 
            ship.cursorYModel !== null )
        {
            let vehicleSpeedFactor = (ship.velocity/g_settings.vehicle.maxVelocity);
            newRaycast.push(vehicleSpeedFactor);

            if (false)
            {
                const rays = tf.tensor2d(newRaycast, [1, 4]);
                predictedCursorX = ship.cursorXModel.predict(rays).dataSync()[0];
                predictedCursorY = ship.cursorYModel.predict(rays).dataSync()[0];
            }
            else
            {
                tf.tidy(() => {
                    // tf.tidy will clean up all the GPU memory used by tensors inside
                    // this function, other than the tensor that is returned.

                    const rays = tf.tensor2d(newRaycast, [1, 4]);
                    predictedCursorX = ship.cursorXModel.predict(rays).dataSync()[0];
                    predictedCursorY = ship.cursorYModel.predict(rays).dataSync()[0];
                });
            }
        }
        else
        {
            console.log("No AI !!!");
            predictedCursorX = 1.0;
            predictedCursorY = 1.0;
        }

        if (predictedCursorY > g_settings.neuralnetwork.predictionThreshold && ship.velocity < g_settings.vehicle.maxVelocity)
        {
            // Acceleration
            ship.velocity += g_settings.vehicle.velocityIncrement;
        }
        else if (predictedCursorY < -g_settings.neuralnetwork.predictionThreshold && ship.velocity > -g_settings.vehicle.maxVelocity)
        {
            // backward/brake
            ship.velocity -= g_settings.vehicle.velocityIncrement;
        }
        else {
            ship.velocity *= g_settings.vehicle.velocityAttenuation;
        }
        
        // NB: PI / 180 = 0.01745
        ship.gameobject.setVelocity(ship.velocity * Math.cos((ship.gameobject.angle - 90) * 0.01745),
                                    ship.velocity * Math.sin((ship.gameobject.angle - 90) * 0.01745));
        
        if (predictedCursorX < -g_settings.neuralnetwork.predictionThreshold)
        {
            ship.gameobject.setAngularVelocity(-g_settings.vehicle.angularVelocity * (ship.velocity/g_settings.vehicle.maxVelocity));

            // handle ship turn and wheel traces
            if (ship.turn != SHIP_TURN_LEFT || ship.turnStart < 0)
            {
                ship.turn = SHIP_TURN_LEFT;
                ship.turnStart = time;
            }

            ship.hasWheelTrace = (ship.velocity >= 0.5 * g_settings.vehicle.maxVelocity && (time - ship.turnStart) >= g_settings.vehicle.delayForTraces );
        }
        else if (predictedCursorX > g_settings.neuralnetwork.predictionThreshold)
        {
            ship.gameobject.setAngularVelocity(g_settings.vehicle.angularVelocity * (ship.velocity/g_settings.vehicle.maxVelocity));

            // handle ship turn and wheel traces
            if (ship.turn != SHIP_TURN_RIGHT || ship.turnStart < 0)
            {
                ship.turn = SHIP_TURN_RIGHT;
                ship.turnStart = time;
            }

            ship.hasWheelTrace = (ship.velocity >= 0.5 * g_settings.vehicle.maxVelocity && (time - ship.turnStart) >= g_settings.vehicle.delayForTraces );
        }
        else
        {
            ship.gameobject.setAngularVelocity(0);
            ship.turn = SHIP_TURN_NO;
            ship.turnStart = -1;
            ship.hasWheelTrace = false;
        }
        
    }


    handleReinforcementLearning(time, ship, debug)
    {
        // current reward correspond to previous action and state

        let newRaycast = this.castRays(ship.gameobject);
        let vehicleSpeedFactor = (ship.velocity / g_settings.vehicle.maxVelocity);
        newRaycast.push(vehicleSpeedFactor);

        // store reward corresponding to action and state choosen and computed at the previous update()
        if (ship.episodeRewards.length > 0)
        {
            ship.episodeRewards[ship.episodeRewards.length - 1] = ship.rewards;
        }

        // predict the action to make
        //  > compute action probability
        //  > choose action based on probability
        let predictedActionSoftmax = tf.tidy(() => {
            // NB: tf.tidy will clean up all the GPU memory used by tensors inside
            // this function, other than the tensor that is returned.

            const rays = tf.tensor2d(newRaycast, [1, 4]);
            let prediction = window.ship_reinforcement_model.m_model.predict(rays).dataSync(); // .dataSync()[0];
            return prediction;
        });
        //if (debug)
        //    console.log("RL predicted softmax" + predictedActionSoftmax);

        // Compute choice based on action using softmax result as probabilities
        let action = window.ship_reinforcement_model.randomChoice(predictedActionSoftmax);
        ship.episodeActions.push(action);
        //if (debug)
        //    console.log("RL predicted " + action);

        // Apply the action
        this.applyReinforcementAction(ship, time, action);

        // Compute the state
        ship.episodeStates.push(newRaycast);

        // Temporaly push the current reward
        // this reward will be overwritten by the value computed at the next update()
        //  (corresponding to the result of the choosen action)
        ship.episodeRewards.push(ship.rewards);

        // check if the episode should end
        if (ship.collisions.endOfZone || (g_settings.reinforcement.maxSteps > 0 && ship.episodeUpdateSteps >=  g_settings.reinforcement.maxSteps))
        {
            // episode is over
            if (debug)
                console.log("Episode over -- about to learn");

            //if (debug)
            //    console.log("episode rewards " + ship.episodeRewards);

            // compute discounted episode rewards
            ship.discountedEpisodeRewards = window.ship_reinforcement_model.discountAndNormalizeRewards(ship.episodeRewards);
            //if (debug)
            //    console.log("discounted rewards " + ship.discountedEpisodeRewards);

            // train neural network
            tf.tidy(() => {
                // NB: tf.tidy will clean up all the GPU memory used by tensors inside
                // this function, other than the tensor that is returned.
    
                //if (debug)
                //    console.log("build tensors");

                let miniBatchSize = g_settings.reinforcement.miniBatchSize;
                if (miniBatchSize > ship.episodeStates.length)
                    miniBatchSize = ship.episodeStates.length;
                let states = tf.tensor2d(ship.episodeStates, [ship.episodeStates.length, ship.episodeStates[0].length]);
                let actions = tf.tensor1d(ship.episodeActions, 'int32');
                let discountedRewards = tf.tensor1d(ship.discountedEpisodeRewards);
                
                if (debug)
                    console.log("train after actions " + ship.episodeActions);
                
                // train
                window.ship_reinforcement_model.train(states, actions, discountedRewards, miniBatchSize, debug);
            });

            // Store/display stats
            // compute the episode total reward
            let episodeRewardsSum = window.ship_reinforcement_model.sum(ship.episodeRewards);

            // Add to the list of epidode rewards
            window.ship_reinforcement_info.allRewards.push(episodeRewardsSum);

            // Compute the mean of all the episode rewards (it should increase)
            let meanReward = window.ship_reinforcement_model.mean( window.ship_reinforcement_info.allRewards)
            let maxReward = window.ship_reinforcement_model.max( window.ship_reinforcement_info.allRewards)

            if (debug)
            {
                console.log("======================");
                console.log("Episode " + window.ship_reinforcement_info.episode);
                console.log("  episode reward : " + episodeRewardsSum);
                console.log("  mean reward    : " + meanReward);
                console.log("  max reward    : " + maxReward);
                console.log("======================");
            }

            // move to next episode
            window.ship_reinforcement_info.episode++;

            this.scene.restart({ mode : this.m_mode});
        }

    }

    applyReinforcementAction(ship, time, action)
    {
        let predictedCursorX = 0.0;
        let predictedCursorY = 0.0;

        // compute direction based on action
        if (action == REINFORCEMENT_ACTION_LEFT ||
            action == REINFORCEMENT_ACTION_LEFT_UP ||
            action == REINFORCEMENT_ACTION_LEFT_DOWN)
        {
            predictedCursorX = -1;
        }
        else if (action == REINFORCEMENT_ACTION_RIGHT ||
                action == REINFORCEMENT_ACTION_RIGHT_UP ||
                action == REINFORCEMENT_ACTION_RIGHT_DOWN)
        {
            predictedCursorX = 1;
        }
        if (action == REINFORCEMENT_ACTION_LEFT_UP ||
            action == REINFORCEMENT_ACTION_UP ||
            action == REINFORCEMENT_ACTION_RIGHT_UP)
        {
            predictedCursorY = 1;
        }
        else if (action == REINFORCEMENT_ACTION_RIGHT_DOWN ||
                action == REINFORCEMENT_ACTION_DOWN ||
                action == REINFORCEMENT_ACTION_LEFT_DOWN)
        {
            predictedCursorY = -1;
        }

        if (predictedCursorY > g_settings.neuralnetwork.predictionThreshold && ship.velocity < g_settings.vehicle.maxVelocity)
        {
            // Acceleration
            ship.velocity += g_settings.vehicle.velocityIncrement;
        }
        else if (predictedCursorY < -g_settings.neuralnetwork.predictionThreshold && ship.velocity > -g_settings.vehicle.maxVelocity)
        {
            // backward/brake
            ship.velocity -= g_settings.vehicle.velocityIncrement;
        }
        else {
            ship.velocity *= g_settings.vehicle.velocityAttenuation;
        }
        
        // NB: PI / 180 = 0.01745
        ship.gameobject.setVelocity(ship.velocity * Math.cos((ship.gameobject.angle - 90) * 0.01745),
                                    ship.velocity * Math.sin((ship.gameobject.angle - 90) * 0.01745));
        
        if (predictedCursorX < -g_settings.neuralnetwork.predictionThreshold)
        {
            ship.gameobject.setAngularVelocity(-g_settings.vehicle.angularVelocity * (ship.velocity/g_settings.vehicle.maxVelocity));

            // handle ship turn and wheel traces
            if (ship.turn != SHIP_TURN_LEFT || ship.turnStart < 0)
            {
                ship.turn = SHIP_TURN_LEFT;
                ship.turnStart = time;
            }

            ship.hasWheelTrace = (ship.velocity >= 0.5 * g_settings.vehicle.maxVelocity && (time - ship.turnStart) >= g_settings.vehicle.delayForTraces );
        }
        else if (predictedCursorX > g_settings.neuralnetwork.predictionThreshold)
        {
            ship.gameobject.setAngularVelocity(g_settings.vehicle.angularVelocity * (ship.velocity/g_settings.vehicle.maxVelocity));

            // handle ship turn and wheel traces
            if (ship.turn != SHIP_TURN_RIGHT || ship.turnStart < 0)
            {
                ship.turn = SHIP_TURN_RIGHT;
                ship.turnStart = time;
            }

            ship.hasWheelTrace = (ship.velocity >= 0.5 * g_settings.vehicle.maxVelocity && (time - ship.turnStart) >= g_settings.vehicle.delayForTraces );
        }
        else
        {
            ship.gameobject.setAngularVelocity(0);
            ship.turn = SHIP_TURN_NO;
            ship.turnStart = -1;
            ship.hasWheelTrace = false;
        }
        
    }

    handleShipWheelTraces(time, ship)
    {
        let textureWidth = 70;
        let textureHeight = 121;
        let wheelPosRatio = 0.8;

        let angleRad = ((ship.gameobject.angle) * Math.PI) / 180.0;
        let cosAngle = Math.cos(angleRad);
        let sinAngle = Math.sin(angleRad);

        let leftOriginalX = -0.5 * (textureWidth * wheelPosRatio) * g_settings.vehicle.scale;
        let leftOriginalY = 0.5 * (textureHeight * wheelPosRatio) * g_settings.vehicle.scale;
        let leftX = leftOriginalX * cosAngle - leftOriginalY * sinAngle;
        let leftY = leftOriginalX * sinAngle + leftOriginalY * cosAngle;
        //leftOrig = new Phaser.Geom.Point(leftOriginalX, leftOriginalY);
        //leftTransformed = Phaser.Math.Rotate(leftOrig, )

        let rightOriginalX = -leftOriginalX;
        let rightOriginalY = leftOriginalY;
        let rightX = rightOriginalX * cosAngle - rightOriginalY * sinAngle;
        let rightY = rightOriginalX * sinAngle + rightOriginalY * cosAngle;

        // End current section depending on angular velocity
        if (!ship.hasWheelTrace && ship.wheelTraces.isInSection())
            ship.wheelTraces.endCurrentSection();

        // Add point to current or new section
        ship.wheelTraces.addPointsToCurrentSection(time, ship.gameobject.x + leftX, ship.gameobject.y + leftY, 
                                                                ship.gameobject.x + rightX, ship.gameobject.y + rightY);

        // remove old sections
        ship.wheelTraces.removeOldSections(time);

        // draw wheel sections
        ship.wheelTraces.draw();
    }


    endGame()
    {
        // return to title screen
        this.scene.stop();
        this.scene.start('Title');
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