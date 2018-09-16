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

    vehicle:{
        scale : 0.3,
        maxThrust : 0.02
    },

    sensor :{
        angle : 45,
        distanceInBlocks : 11.0,
        period : 0.5
    },

    neuralnetwork:{
        epochs : 100,
        layers : 5,
        units : 10
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
    html += "Max thrust (> 0 )";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.vehicle.maxThrust' value='" + g_settings.vehicle.maxThrust + "'/><br/>";

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
    html += "<h1>Neural network</h1>";
    html += "Number of epochs:";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.neuralnetwork.epochs' value='" + g_settings.neuralnetwork.epochs + "'/><br/>";
    html += "Number of layers:";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.neuralnetwork.layers' value='" + g_settings.neuralnetwork.layers + "'/><br/>";
    html += "Number of units per layer:";
    html += "<input type='text' style='position:absolute;right:0px;' id='settings.neuralnetwork.units' value='" + g_settings.neuralnetwork.units + "'/><br/>";

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
        g_settings.vehicle.maxThrust = getElementValue("settings.vehicle.maxThrust", parseFloat, 0.0, false, 1.0, true);

        g_settings.sensor.angle = getElementValue("settings.sensor.angle", parseInt, -90, true, 90, true);
        g_settings.sensor.distanceInBlocks = getElementValue("settings.sensor.distanceInBlocks", parseFloat, 0.0, false, 20, true);
        g_settings.sensor.period = getElementValue("settings.sensor.period", parseFloat, 0.0, true, 5.0, true);

        g_settings.neuralnetwork.epochs = getElementValue("settings.neuralnetwork.epochs", parseInt, 1, true, 65535, true);
        g_settings.neuralnetwork.layers = getElementValue("settings.neuralnetwork.layers", parseInt, 1, true, 65535, true);
        g_settings.neuralnetwork.units = getElementValue("settings.neuralnetwork.units", parseInt, 1, true, 65535, true);
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