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

    reinforcement:{

        maxSteps : 1800,
        miniBatchSize : 200,
        epochsPerEpisode : 1,
        layers : 3,
        units : 10,
        learningRate : 0.01, // 0.005,
        gammaDiscountRate : 0.95,

        slotCount : 10
    },

    versus:{
        // -1 = user, 0 = current model, 1 .. 10 : stored slots
        opponent0 : 0,

        storedModels:
        {
            opponent0 : null
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

    html += "<h1>Reinforcement learning method</h1>";
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

    html += "<br/><br/>";
    html += "Stored models:<br/>";
    html += "<div id='reinforcement.storedmodels'></div>";
    html += "Save current models:<br/>";
    html += "<i>The models will be stored in the browser indexedDB database. If supported they will also be downloaded (use Chrome for instance).</i><br/>";
    html += "Slot : <select id='reinforcement.exportModelSlot'>";
    for (let i = 1; i <= g_settings.reinforcement.slotCount; i++)
    {
        html +=  "<option value='" + i + "'>" + i + "</option>";
    }
    html +=  "</select>";
    if (window.reinforcement_model !== null && typeof window.reinforcement_model !== 'undefined')
    {
        html += "<button style='position:absolute;right:0px;' id='settings.reinforcement.export' onclick='exportModels()'>Export neural networks</button><br/>";
    }
    else
    {
        html += "<button style='position:absolute;right:0px;' id='settings.reinforcement.export' disabled >Export neural networks</button><br/>";
    }

    html += "<h1>Trained model demonstration</h1>";
    html += "<div id='versus.opponents'></div>";

    // display the stored models
    displayModels();

    return html;
}

function getElementValue(elementId, parseFunction, minValue, minIncluded, maxValue, maxIncluded)
{
    console.log(elementId);
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

        g_settings.reinforcement.maxSteps = getElementValue("settings.reinforcement.maxSteps", parseInt, 1, true, 65535, true);
        g_settings.reinforcement.miniBatchSize = getElementValue("settings.reinforcement.miniBatchSize", parseInt, 1, true, 65535, true);
        g_settings.reinforcement.epochsPerEpisode = getElementValue("settings.reinforcement.epochsPerEpisode", parseInt, 1, true, 65535, true);
        g_settings.reinforcement.layers = getElementValue("settings.reinforcement.layers", parseInt, 1, true, 65535, true);
        g_settings.reinforcement.units = getElementValue("settings.reinforcement.units", parseInt, 1, true, 65535, true);
        g_settings.reinforcement.learningRate = getElementValue("settings.reinforcement.learningRate", parseFloat, 0.0, false, 1.0, true);
        g_settings.reinforcement.gammaDiscountRate = getElementValue("settings.reinforcement.gammaDiscountRate", parseFloat, 0.0, true, 1.0, true);

        g_settings.versus.opponent0 = getElementValue("settings.versus.opponent0", parseInt, -1, true, 20, true);

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
    if (window.reinforcement_model !== null && typeof window.reinforcement_model !== 'undefined'
        && window.reinforcement_model.m_model !== null)
    {
        let policyGradientModel = window.reinforcement_model.m_model;
        let slot = document.getElementById("reinforcement.exportModelSlot").value;

        // save to indexeddb
        await policyGradientModel.save('indexeddb://cartpole_reinforcement_policygradient-' + slot);

        // save to file (may not work)
        await policyGradientModel.save('downloads://cartpole_reinforcement_policygradient-' + slot);

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
        for (let i = 1; i <= g_settings.reinforcement.slotCount; i++)
        {
            let name = 'indexeddb://cartpole_reinforcement_policygradient-' + i;
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
    let storedModelsEl = document.getElementById("reinforcement.storedmodels");
    storedModelsEl.innerHTML = html;

    // update opponent selection info
    html = "";
    html += "Choose the AI model<br/>";
    html += "Slot : <select id='settings.versus.opponent0'>";
    //html +=  "<option value='-1' " + ((g_settings.versus.opponent0 == -1)?"selected='selected'":"") + ">User</option>";
    html +=  "<option value='0' " + ((g_settings.versus.opponent0 == 0)?"selected='selected'":"") + ">Current AI</option>";
    if (storedModels != null)
    {
        for (let i = 1; i <= g_settings.reinforcement.slotCount; i++)
        {
            if (hasStoredModel[i - 1])
                html +=  "<option value='" + i + "' " + ((g_settings.versus.opponent0 == i)?"selected='selected'":"") + ">Slot " + i + "</option>";
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
        console.log("Loading models indexeddb://cartpole_reinforcement_policygradient-" + g_settings.versus.opponent0);
        g_settings.versus.storedModels.opponent0 = await tf.loadLayersModel ('indexeddb://cartpole_reinforcement_policygradient-' + g_settings.versus.opponent0);

        console.log("Loaded");
    }
    else
    {
        g_settings.versus.storedModels.opponent0 = null;
    }

}