// window.ship_raw_dataset.data will contain the dataset rows
// [ cursorX , cursorY, rayCast center, rayscastLeft, rayscastRight]

    
class PlayGame extends Phaser.Scene {

    constructor (params)
    {
        super({key : 'PlayGame', active : false});

        this.m_mode = "USER";
        this.m_lineGraphic = null;
        this.m_controls = null;
        this.m_ship = null;
        this.m_endOfZoneSensor = null;
        this.m_cursors = null;
        this.m_shipMaxThrust = g_settings.vehicle.maxThrust;
        this.m_lastRaycastTime = -1;
        this.m_rayscastPeriod = 0; // 1000;
        this.m_lastStoreInDatasetTime = -1;
        this.m_storeInDatasetPeriod = Math.floor(g_settings.sensor.period * 1000); //500;
        this.m_blockSize = 0;

        this.m_predictedCursorX = 0;
        this.m_predictedCursorY = 0;
        this.m_predictionThreshold = 0.1;

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
        
    }
     
    // function to be executed when the scene is loading
    preload(){
        console.log("#####> preload <#####");
        // loading crate image
        this.load.image("crate", "crate.png");

        this.load.image("rock_full", "data/rock_full.png");
        this.load.image("rock_left_right", "data/rock_left_right.png");
        this.load.image("rock_left_left", "data/rock_left_left.png");
        this.load.image("rock_right_right", "data/rock_right_right.png");
        this.load.image("rock_right_left", "data/rock_right_left.png");

        this.load.image("rock_tileset", "data/rock_map.png");

        this.load.image("spaceship", "data/spaceShips_007.png");
    }
    

     
    // function to be executed once the scene has been created
    create(params){
        console.log("#####> create <#####");

        this.m_shipMaxThrust = g_settings.vehicle.maxThrust;

        if (params !== null && typeof params !== 'undefined')
        {
            this.m_mode = params.mode;
        }

        console.log("Scene launched in " + this.m_mode + " mode");

        // Graphics object used to draw lines
        this.m_lineGraphic = this.add.graphics();
        this.m_lineGraphic.lineStyle(1, 0xFF00FF, 0.25); // width, color, alpha

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
 

        // build maze renderiong and physics manually
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
                    }
                }
            }
        }

        // Add spaceship
        this.m_ship = this.matter.add.image(shipStartPosition.x, shipStartPosition.y, 'spaceship');
        this.m_ship.setScale(g_settings.vehicle.scale, g_settings.vehicle.scale);
        this.m_ship.setFixedRotation();
        this.m_ship.setAngle(270);
        this.m_ship.setFrictionAir(0.05);
        this.m_ship.setMass(30);

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
        camera.startFollow(this.m_ship);

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
                if ((bodyA === this.m_ship.body && bodyB === this.m_endOfZoneSensor) ||
                    (bodyA === this.m_endOfZoneSensor.body && bodyB === this.m_ship))
                {

                    console.log("##### END #####");

                    if (this.m_mode == "USER")
                    {
                        window.ship_raw_dataset.runs += 1;
                        console.log(window.ship_raw_dataset);

                        // debug
                        //const xs = tf.tensor2d(window.ship_raw_dataset.cursorX.x, [window.ship_raw_dataset.cursorX.x.length, 3]);
                        //const ys = tf.tensor2d(window.ship_raw_dataset.cursorX.y, [window.ship_raw_dataset.cursorX.y.length, 1]);
                        //console.log(xs);
                        //console.log(ys);
                    }


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
    }
    

    update(time, delta)
    {
        // Apply the controls to the camera each update tick of the game
        if (this.m_controls !== null)
            this.m_controls.update(delta);
        
        let cursorX = 0.0;
        let cursorY = 0.0;

        // Update ship thrust
        if (this.m_mode == "USER")
        {
            if (this.m_cursors.left.isDown)
            {
                this.m_ship.thrustLeft(this.m_shipMaxThrust);
                cursorX = -1.0;
            }
            else if (this.m_cursors.right.isDown)
            {
                this.m_ship.thrustRight(this.m_shipMaxThrust);
                cursorX = 1.0;
            }

            if (this.m_cursors.up.isDown)
            {
                this.m_ship.thrust(this.m_shipMaxThrust);
                cursorY = 1.0;
            }
            else if (this.m_cursors.down.isDown)
            {
                this.m_ship.thrustBack(this.m_shipMaxThrust);
                cursorY = -1.0;
            }
        }
        else
        {
            //console.log("No control in " + this.m_mode + " mode");
        }

        if (this.m_lastRaycastTime < 0 || time - this.m_lastRaycastTime > this.m_rayscastPeriod)
        {
            let maxRayLength = this.m_blockSize * g_settings.sensor.distanceInBlocks * 1.0; // 800.0;

            // Clear the lines
            this.m_lineGraphic.clear();
            this.m_lineGraphic.lineStyle(1, 0xFF00FF, 0.25); // width, color, alpha

            // front
            let startPoint =  { x : this.m_ship.body.position.x , y :  this.m_ship.body.position.y};
            let endPoint = { x: startPoint.x, y: startPoint.y - maxRayLength };
            let centerRayLengthNormalized = this.castRay(startPoint, endPoint, this.matter.world.localWorld.bodies, this.m_ship.body, maxRayLength);
            centerRayLengthNormalized = Math.round(centerRayLengthNormalized * 1000) / 1000.0; // remove precision

            // compute the size of the Pi/4 vector projected on vectors X and Y
            let angleRad = (g_settings.sensor.angle * Math.PI) / 180.0;
            let normX = Math.cos(angleRad); //Math.sqrt(0.5);
            let normY = Math.sin(angleRad);

            // left
            endPoint = { x: startPoint.x - normX * maxRayLength, y: startPoint.y - normY * maxRayLength };
            let leftRayLengthNormalized = this.castRay(startPoint, endPoint, this.matter.world.localWorld.bodies, this.m_ship.body, maxRayLength);
            leftRayLengthNormalized = Math.round(leftRayLengthNormalized * 1000) / 1000.0; // remove precision

            // right
            endPoint = { x: startPoint.x + normX * maxRayLength, y: startPoint.y - normY * maxRayLength };
            let rightRayLengthNormalized = this.castRay(startPoint, endPoint, this.matter.world.localWorld.bodies, this.m_ship.body, maxRayLength);
            rightRayLengthNormalized = Math.round(rightRayLengthNormalized * 1000) / 1000.0; // remove precision

            if (this.m_mode == "USER")
            {
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
                    let newRaycast = [centerRayLengthNormalized, leftRayLengthNormalized, rightRayLengthNormalized];
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
                        window.ship_raw_dataset.cursorX.x.push([centerRayLengthNormalized, leftRayLengthNormalized, rightRayLengthNormalized]);
                        window.ship_raw_dataset.cursorX.y.push(cursorX);
                    }

                    if (lastCursorY_x != null && arraysIdentical(lastCursorY_x, newRaycast) &&
                        lastCursorY_y === cursorY)
                    {
                        //console.log("ignore same cursorY")
                    }
                    else
                    {
                        window.ship_raw_dataset.cursorY.x.push([centerRayLengthNormalized, leftRayLengthNormalized, rightRayLengthNormalized]);
                        window.ship_raw_dataset.cursorY.y.push(cursorY);
                    }

                    this.m_lastStoreInDatasetTime = time;
                }
            }
            else if (this.m_mode == "AI")
            {

                if ( window.ship_cursors_models !== null && typeof  window.ship_cursors_models !== 'undefined'
                    &&  window.ship_cursors_models.length == 2)
                {
                    let cursorXModel = window.ship_cursors_models[0].model;
                    let cursorYModel = window.ship_cursors_models[1].model;

                    let newRaycast = [centerRayLengthNormalized, leftRayLengthNormalized, rightRayLengthNormalized];
                    const rays = tf.tensor2d(newRaycast, [1, 3]);
                    this.m_predictedCursorX = cursorXModel.predict(rays).dataSync()[0];
                    this.m_predictedCursorY = cursorYModel.predict(rays).dataSync()[0];

                    console.log("predicted " + this.m_predictedCursorX + "   " + this.m_predictedCursorY);
                    if (this.m_predictedCursorX < -this.m_predictionThreshold)
                    {
                        this.m_ship.thrustLeft(this.m_shipMaxThrust);
                    }
                    else if (this.m_predictedCursorX > this.m_predictionThreshold)
                    {
                        this.m_ship.thrustRight(this.m_shipMaxThrust);
                    }
        
                    if (this.m_predictedCursorY > this.m_predictionThreshold)
                    {
                        this.m_ship.thrust(this.m_shipMaxThrust);
                    }
                    else if (this.m_predictedCursorY < -this.m_predictionThreshold)
                    {
                        this.m_ship.thrustBack(this.m_shipMaxThrust);
                    }
                }
            }
            

            this.m_lastRaycastTime = time;
        }
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