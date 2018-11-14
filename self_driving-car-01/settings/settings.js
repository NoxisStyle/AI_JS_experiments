const OPPONENT_USER = -1;
const OPPONENT_CURRENT_AI = 0;

let g_settings = 
{
    style :{
        titleStyleH1 : { fontFamily: 'Arial', fontSize: 64, color: '#ffff00' },
        titleStyleH2 : { fontFamily: 'Arial', fontSize: 32, color: '#ffffff' },
        textStyle1 : { fontFamily: 'Arial', fontSize: 16, color: '#ffffff' },
        buttonStyles: {
            rest : { fontFamily: 'Arial', fontSize: 16, color: '#ffffff'},
            hover : { fontFamily: 'Arial', fontSize: 24, color: '#ffff00'},
            active : { fontFamily: 'Arial', fontSize: 24, color: '#ff0000'},
        },
        progressbar :{
            borderColor : 0xFFFFFF, 
            internalColor : 0x000000
        },
        graph :{
            backgroundColor : 0xFFFFFF,
            lineColor : 0xFF00FF,
            lineWidth : 1
        }
    },

    map:{
        width: 10,
        userHeight: 9, // power of 2 + 1
        aiHeight : 129, // power of 2 + 1
        pathCount: 3,
        initialPeriod : 8, // power of 2
        deltaFactor : 1.0
    },

    physics:{
        environmentCategory : -1,
        vehiclesCategory : -1
    },

    vehicle:{
        scale : 0.3,
        maxVelocity : 3.0,
        velocityAttenuation : 0.99,
        velocityIncrement : 0.02,
        angularVelocity : Math.PI/4 / 50,
        delayForTraces : 500
    },

    sensor :{
        angle : 45,
        distanceInBlocks : 11.0,
        period : 0.5
    },

    neuralnetwork:{
        epochs : 100,
        layers : 5,
        units : 10,
        predictionThreshold : 0.1,
        slotCount : 10
    },

    reinforcement:{
        environmentCollisionReward : -10,
        endZoneCollisionReward : 100,
        notMovingReward : -2,
        goingDownReward : -1,
        goingUpReward : 1,
        distanceReward : 0,
        distanceRewardPower : 0.4,
        raysRewardFactorC : 1.0,
        raysRewardFactorLR : 1.0, // -0.4,

        repeatSameMazeCount : 5,
        maxSteps : 1800,
        miniBatchSize : 200,
        epochsPerEpisode : 1,
        layers : 5,
        units : 64,
        learningRate : 0.005,
        gammaDiscountRate : 0.95
    },

    versus:{
        // -1 = user, 0 = current model, 1 .. 10 : stored slots
        opponent0 : -1,
        opponent1 : 0,

        storedModels:
        {
            opponent0_cursorX : null,
            opponent0_cursorY : null,
            opponent1_cursorX : null,
            opponent1_cursorY : null
        }
    }

};

function buildSettings()
{
    let html = "";

    // Sensors
    //   - angle / factor
    //   - max distance
    // Training
    //   - number of epochs
    //   - number of layers
    //   - number of units

    // Add button to close settings overlay
    html += "<button class='close' onclick='saveSettings()'>[X]</button>";

    // Map parameters
    html += "<h1>Map</h1>";
    html += "<p><i>The map is the environment in which the vehicle moves. It is created randomly and some of the parameters are exposed.";
    html += "The unit of the map is in <b>blocks</b>.";
    html += "The height of the map may differ for the user and for the AI (generally shorter for the user and bigger for the AI).</i></p><br/>";
    html += "Width of the map in blocks (>= 4):";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.map.width' value='" + g_settings.map.width + "'/><br/>";
    html += "Height of the map in blocks for the user (height - 1 must be a multiple of the map generation initial period):";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.map.userHeight' value='" + g_settings.map.userHeight + "'/><br/>";
    html += "Height of the map in blocks for the AI (height - 1 must be a multiple of the map generation initial period):";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.map.aiHeight' value='" + g_settings.map.aiHeight + "'/><br/>";
    html += "Number of paths (> 1):";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.map.pathCount' value='" + g_settings.map.pathCount + "'/><br/>";
    html += "Map generation initial period (Power of two - There is no need to tweek this advanced parameter):";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.map.initialPeriod' value='" + g_settings.map.initialPeriod + "'/><br/>";
    html += "Map generation delta factor (between 0.0 and 1.0 ; 0 => mostly linear, 1.0 moslty irregular):";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.map.deltaFactor' value='" + g_settings.map.deltaFactor + "'/><br/>";

    // vehicle parameters
    html += "<h1>Vehicle</h1>";
    html += "Scale of the vehicle compared to its default size (> 0 )";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.vehicle.scale' value='" + g_settings.vehicle.scale + "'/><br/>";
    html += "Max velocity (> 0 )";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.vehicle.maxVelocity' value='" + g_settings.vehicle.maxVelocity + "'/><br/>";
    html += "Velocity attenuation (between 0.0 and 1.0 )";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.vehicle.velocityAttenuation' value='" + g_settings.vehicle.velocityAttenuation + "'/><br/>";
    html += "Velocity increment (> 0 )";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.vehicle.velocityIncrement' value='" + g_settings.vehicle.velocityIncrement + "'/><br/>";
    html += "Steering angular velocity (> 0 )";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.vehicle.angularVelocity' value='" + g_settings.vehicle.angularVelocity + "'/><br/>";

    // sensors parameters
    html += "<h1>Sensors</h1>";
    html += "<p><i>The AI uses 3 distance sensors in order to learn the user's behavior. The first sensor faces the front of the vehicle (90 degree).";
    html += "The measurements are made at a configurable frequency (period)."
    html += "You can select: <ul><li>the angle of the two other sensors</li><li>the maximum detection distance of the sensors</li></ul></i></p><br/>";
    html += "Sensor angle in degree [-90 90]:";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.sensor.angle' value='" + g_settings.sensor.angle + "'/><br/>";
    html += "Sensor max detection distance in Blocks (unit of the map):";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.sensor.distanceInBlocks' value='" + g_settings.sensor.distanceInBlocks + "'/><br/>";
    html += "Measurement period (seconds):";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.sensor.period' value='" + g_settings.sensor.period + "'/><br/>";

    // neural network parameters
    html += "<h1>Supervised learning method</h1>";
    html += "Number of epochs:";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.neuralnetwork.epochs' value='" + g_settings.neuralnetwork.epochs + "'/><br/>";
    html += "Number of layers:";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.neuralnetwork.layers' value='" + g_settings.neuralnetwork.layers + "'/><br/>";
    html += "Number of units per layer:";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.neuralnetwork.units' value='" + g_settings.neuralnetwork.units + "'/><br/>";
    html += "Prediction threshold; used to decide if AI should go left right (> th => right; < th => left):";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.neuralnetwork.predictionThreshold' value='" + g_settings.neuralnetwork.predictionThreshold + "'/><br/>";
    html += "<br/><br/>";
    html += "Stored models:<br/>";
    html += "<div id='neuralnetwork.storedmodels'></div>";
    html += "Save current models:<br/>";
    html += "<i>The models will be stored in the browser indexedDB database. If supported they will also be downloaded (use Chrome for instance).</i><br/>";
    html += "Slot : <select id='exportModelSlot'>";
    for (let i = 1; i <= g_settings.neuralnetwork.slotCount; i++)
    {
        html +=  "<option value='" + i + "'>" + i + "</option>";
    }
    html +=  "</select>";
    if ( window.ship_cursors_models !== null && typeof  window.ship_cursors_models !== 'undefined'
        &&  window.ship_cursors_models.length == 2)
    {
        html += "<button style='position:absolute;right:0px;' id='settings.neuralnetwork.export' onclick='exportModels()'>Export neural networks</button><br/>";
    }
    else
    {
        html += "<button style='position:absolute;right:0px;' id='settings.neuralnetwork.export' disabled >Export neural networks</button><br/>";
    }

    html += "<h1>Reinforcement learning method</h1>";
    html += "Env collision reward:";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.reinforcement.environmentCollisionReward' value='" + g_settings.reinforcement.environmentCollisionReward + "'/><br/>";
    html += "End-zone collision reward:";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.reinforcement.endZoneCollisionReward' value='" + g_settings.reinforcement.endZoneCollisionReward + "'/><br/>";
    html += "Not moving reward:";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.reinforcement.notMovingReward' value='" + g_settings.reinforcement.notMovingReward + "'/><br/>";
    html += "Going down reward:";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.reinforcement.goingDownReward' value='" + g_settings.reinforcement.goingDownReward + "'/><br/>";
    html += "Going up reward:";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.reinforcement.goingUpReward' value='" + g_settings.reinforcement.goingUpReward + "'/><br/>";
  
    html += "<p><i>The distance reward will be distanceReward * (distance ^ distanceRewardpower) <br/>Where distance is normalized and belongs to [0 1].</i></p><br/>";
    html += "Distance reward:";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.reinforcement.distanceReward' value='" + g_settings.reinforcement.distanceReward + "'/><br/>";
    html += "Distance reward power:";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.reinforcement.distanceRewardPower' value='" + g_settings.reinforcement.distanceRewardPower + "'/><br/>";

    html += "Repeat same maze count:";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.reinforcement.repeatSameMazeCount' value='" + g_settings.reinforcement.repeatSameMazeCount + "'/><br/>";
    html += "Max steps per episode:";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.reinforcement.maxSteps' value='" + g_settings.reinforcement.maxSteps + "'/><br/>";
    html += "Mini batch-size:";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.reinforcement.miniBatchSize' value='" + g_settings.reinforcement.miniBatchSize + "'/><br/>";
    html += "Epochs per episode:";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.reinforcement.epochsPerEpisode' value='" + g_settings.reinforcement.epochsPerEpisode + "'/><br/>";
    html += "Number of layers:";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.reinforcement.layers' value='" + g_settings.reinforcement.layers + "'/><br/>";
    html += "Number of units per layer:";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.reinforcement.units' value='" + g_settings.reinforcement.units + "'/><br/>";
    html += "Learning rate:";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.reinforcement.learningRate' value='" + g_settings.reinforcement.learningRate + "'/><br/>";
    html += "Discount rate (gamma):";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.reinforcement.gammaDiscountRate' value='" + g_settings.reinforcement.gammaDiscountRate + "'/><br/>";


    html += "<h1>Versus</h1>";
    html += "<div id='versus.opponents'></div>";

    // display the stored models
    displayModels();

    return html;
}

function getElementValue(elementId, parseFunction, minValue, minIncluded, maxValue, maxIncluded)
{
    let value = document.getElementById(elementId).value;
    let parsedValue = parseFunction(value);
    if (isNaN(value))
        throw value + " is not a valid value for " + elementId;

    if (minIncluded && parsedValue < minValue)
        throw "Value for " + elementId + " (" + parsedValue + ") must be greater or equal than " + minValue;
    else if (!minIncluded && parsedValue <= minValue)
        throw "Value for " + elementId + " (" + parsedValue + ") must be greater than " + minValue;
    
    if (maxIncluded && parsedValue > maxValue)
        throw "Value for " + elementId + " (" + parsedValue + ") must be lower or equal to " + maxValue;
    else if (!maxIncluded && parsedValue >= maxValue)
        throw "Value for " + elementId + " (" + parsedValue + ") must be lower than " + maxValue;

    return parsedValue;
}

function saveSettings()
{
    // save settings

    try
    {
        g_settings.map.width = getElementValue("settings.map.width", parseInt, 4, true, 50, true);
        g_settings.map.userHeight = getElementValue("settings.map.userHeight", parseInt, 9, true, 1025, true);
        g_settings.map.aiHeight = getElementValue("settings.map.aiHeight", parseInt, 9, true, 1025, true);
        g_settings.map.pathCount = getElementValue("settings.map.pathCount", parseInt, 1, true, 20, true);
        g_settings.map.initialPeriod = getElementValue("settings.map.initialPeriod", parseInt, 2, true, 32, true);
        if (!isPowerOfTwo(g_settings.map.initialPeriod))
            throw "Value for settings.map.initialPeriod must be a power of two";
        if ((g_settings.map.userHeight - 1) % g_settings.map.initialPeriod != 0)
            throw "settings.map.userHeight - 1 must be a multiple of settings.map.initialPeriod";
        if ((g_settings.map.aiHeight - 1) % g_settings.map.initialPeriod != 0)
            throw "settings.map.aiHeight - 1 must be a multiple of settings.map.initialPeriod";
        g_settings.map.deltaFactor = getElementValue("settings.map.deltaFactor", parseFloat, 0.0, true, 1.0, true);

        g_settings.vehicle.scale = getElementValue("settings.vehicle.scale", parseFloat, 0.0, false, 1.0, true);
        g_settings.vehicle.maxVelocity = getElementValue("settings.vehicle.maxVelocity", parseFloat, 0.0, false, 10.0, true);
        g_settings.vehicle.velocityAttenuation = getElementValue("settings.vehicle.velocityAttenuation", parseFloat, 0.0, true, 1.0, true);
        g_settings.vehicle.velocityIncrement = getElementValue("settings.vehicle.velocityIncrement", parseFloat, 0.0, false, 10.0, true);
        g_settings.vehicle.angularVelocity = getElementValue("settings.vehicle.angularVelocity", parseFloat, 0.0, false, Math.PI, true);

        g_settings.sensor.angle = getElementValue("settings.sensor.angle", parseInt, -90, true, 90, true);
        g_settings.sensor.distanceInBlocks = getElementValue("settings.sensor.distanceInBlocks", parseFloat, 0.0, false, 20, true);
        g_settings.sensor.period = getElementValue("settings.sensor.period", parseFloat, 0.0, true, 5.0, true);

        g_settings.neuralnetwork.epochs = getElementValue("settings.neuralnetwork.epochs", parseInt, 1, true, 65535, true);
        g_settings.neuralnetwork.layers = getElementValue("settings.neuralnetwork.layers", parseInt, 1, true, 65535, true);
        g_settings.neuralnetwork.units = getElementValue("settings.neuralnetwork.units", parseInt, 1, true, 65535, true);
        g_settings.neuralnetwork.predictionThreshold = getElementValue("settings.neuralnetwork.predictionThreshold", parseFloat, 0.0, true, 1.0, true);

        g_settings.reinforcement.environmentCollisionReward = getElementValue("settings.reinforcement.environmentCollisionReward", parseInt, -1000, true, 1000, true);
        g_settings.reinforcement.endZoneCollisionReward = getElementValue("settings.reinforcement.endZoneCollisionReward", parseInt, -1000, true, 1000, true);
        g_settings.reinforcement.notMovingReward = getElementValue("settings.reinforcement.notMovingReward", parseInt,  -1000, true, 1000, true);
        g_settings.reinforcement.goingDownReward = getElementValue("settings.reinforcement.goingDownReward", parseInt, -1000, true, 1000, true);
        g_settings.reinforcement.goingUpReward = getElementValue("settings.reinforcement.goingUpReward", parseInt, -1000, true, 1000, true);

        g_settings.reinforcement.distanceReward = getElementValue("settings.reinforcement.distanceReward", parseInt, -1000, true, 1000, true);
        g_settings.reinforcement.distanceRewardPower = getElementValue("settings.reinforcement.distanceRewardPower", parseFloat, 0, false, 10, true);

        g_settings.reinforcement.repeatSameMazeCount = getElementValue("settings.reinforcement.repeatSameMazeCount", parseInt, 1, true, 65535, true);
        g_settings.reinforcement.maxSteps = getElementValue("settings.reinforcement.maxSteps", parseInt, 1, true, 65535, true);
        g_settings.reinforcement.miniBatchSize = getElementValue("settings.reinforcement.miniBatchSize", parseInt, 1, true, 65535, true);
        g_settings.reinforcement.epochsPerEpisode = getElementValue("settings.reinforcement.epochsPerEpisode", parseInt, 1, true, 65535, true);
        g_settings.reinforcement.layers = getElementValue("settings.reinforcement.layers", parseInt, 1, true, 65535, true);
        g_settings.reinforcement.units = getElementValue("settings.reinforcement.units", parseInt, 1, true, 65535, true);
        g_settings.reinforcement.learningRate = getElementValue("settings.reinforcement.learningRate", parseFloat, 0.0, false, 1.0, true);
        g_settings.reinforcement.gammaDiscountRate = getElementValue("settings.reinforcement.gammaDiscountRate", parseFloat, 0.0, true, 1.0, true);


        g_settings.versus.opponent0 = getElementValue("settings.versus.opponent0", parseInt, -1, true, 20, true);
        g_settings.versus.opponent1 = getElementValue("settings.versus.opponent1", parseInt, -1, true, 20, true);
        
        // load the oponenents stored models
        loadUsedSoredModels();

    }
    catch (error)
    {
        alert("Error : " + error);
        return;
    }
    

    // Settings updated
    console.log(g_settings);

    // hide settings overlay
    overlay();
}

async function exportModels()
{
    if ( window.ship_cursors_models !== null && typeof  window.ship_cursors_models !== 'undefined'
        &&  window.ship_cursors_models.length == 2)
    {
        let cursorXModel = window.ship_cursors_models[0].model;
        let cursorYModel = window.ship_cursors_models[1].model;
        let slot = document.getElementById("exportModelSlot").value;

        // save to indexeddb
        await cursorXModel.save('indexeddb://horizontal_DNN-' + slot);
        await cursorYModel.save('indexeddb://vertical_DNN-' + slot);

        // save to file (may not work)
        await cursorXModel.save('downloads://horizontal_DNN-' + slot);
        await cursorYModel.save('downloads://vertical_DNN-' + slot);

        // Update the displayed models
        displayModels()
    }
}

async function displayModels()
{
    // retrieve all the stored model
    let storedModels = await tf.io.listModels();
    let html = "<ul>";
    let hasStoredModel = [];

    // update slot info
    if (storedModels != null)
    {
        for (let i = 1; i <= g_settings.neuralnetwork.slotCount; i++)
        {
            let name = "indexeddb://horizontal_DNN-" + i;
            if (storedModels[name] !== null && typeof storedModels[name] !== 'undefined')
            {
                // found a model
                let date = storedModels[name].dateSaved;
                html += "<li>Slot " + i + ": Full (" + date + ")</li>";
                hasStoredModel.push(true);
            }
            else
            {
                html += "<li>Slot " + i + ": <i>empty</i></li>";
                hasStoredModel.push(false);
            }
        }
    }
    html += "</ul>";
    let storedModelsEl = document.getElementById("neuralnetwork.storedmodels");
    storedModelsEl.innerHTML = html;

    // update opponent selection info
    html = "";
    html += "Choose the first opponent<br/>";
    html += "Slot : <select id='settings.versus.opponent0'>";
    html +=  "<option value='-1' " + ((g_settings.versus.opponent0 == -1)?"selected='selected'":"") + ">User</option>";
    html +=  "<option value='0' " + ((g_settings.versus.opponent0 == 0)?"selected='selected'":"") + ">Current AI</option>";
    if (storedModels != null)
    {
        for (let i = 1; i <= g_settings.neuralnetwork.slotCount; i++)
        {
            if (hasStoredModel[i - 1])
                html +=  "<option value='" + i + "' " + ((g_settings.versus.opponent0 == i)?"selected='selected'":"") + ">Slot " + i + "</option>";
        }
    }
    html +=  "</select><br/>";
    html += "Choose the second opponent<br/>";
    html += "Slot : <select id='settings.versus.opponent1'>";
    html +=  "<option value='0' " + ((g_settings.versus.opponent1 == 0)?"selected='selected'":"") + ">Current AI</option>";
    if (storedModels != null)
    {
        for (let i = 1; i <= g_settings.neuralnetwork.slotCount; i++)
        {
            if (hasStoredModel[i - 1])
                html +=  "<option value='" + i + "' " + ((g_settings.versus.opponent1 == i)?"selected='selected'":"") + ">Slot " + i + "</option>";
        }
    }
    html +=  "</select><br/>";
    let opponentsEl = document.getElementById("versus.opponents");
    opponentsEl.innerHTML = html;
}

async function loadUsedSoredModels()
{
    if (g_settings.versus.opponent0 > OPPONENT_CURRENT_AI)
    {
        console.log("Loading models indexeddb://horizontal_DNN-" + g_settings.versus.opponent0);
        g_settings.versus.storedModels.opponent0_cursorX = await tf.loadModel("indexeddb://horizontal_DNN-" + g_settings.versus.opponent0);
        g_settings.versus.storedModels.opponent0_cursorY = await tf.loadModel("indexeddb://vertical_DNN-" + g_settings.versus.opponent0);
    }
    else
    {
        g_settings.versus.storedModels.opponent0_cursorX = null;
        g_settings.versus.storedModels.opponent0_cursorY = null;
    }

    if (g_settings.versus.opponent1 > OPPONENT_CURRENT_AI)
    {
        console.log("Loading models indexeddb://horizontal_DNN-" + g_settings.versus.opponent1);
        g_settings.versus.storedModels.opponent1_cursorX = await tf.loadModel("indexeddb://horizontal_DNN-" + g_settings.versus.opponent1);
        g_settings.versus.storedModels.opponent1_cursorY = await tf.loadModel("indexeddb://vertical_DNN-" + g_settings.versus.opponent1);
    }
    else
    {
        g_settings.versus.storedModels.opponent1_cursorX = null;
        g_settings.versus.storedModels.opponent1_cursorY = null;
    }
}