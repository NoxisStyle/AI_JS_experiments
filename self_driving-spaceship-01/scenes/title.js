

class Title extends Phaser.Scene {

    constructor ()
    {
        super('Title');
    }
     
    // function to be executed when the scene is loading
    preload(){

    }

    create()
    {
        //  Pass in a basic style object with the constructor
        this.add.text(400, 200, 'AI experiments', g_settings.style.titleStyleH1).setOrigin(0.5);

        this.add.text(400, 300, 'train a self-driving spaceship', g_settings.style.titleStyleH2).setOrigin(0.5);

        let userRunCount = 0;
        if (window.ship_raw_dataset !== null || typeof window.ship_raw_dataset !== 'undefined')
        {
            userRunCount = window.ship_raw_dataset.runs;
        }

        this.add.existing(new TextButton(this, 400, 350, 'Settings' , g_settings.style.buttonStyles, () => this.startSettings()).setOrigin(0.5));;

        this.add.existing(new TextButton(this, 400, 400, 'Show the AI how to drive (' + userRunCount + ' runs already)' , g_settings.style.buttonStyles, () => this.startUserPractice()).setOrigin(0.5));;

        this.add.existing(new TextButton(this, 400, 450, 'Train the AI', g_settings.style.buttonStyles, () => this.trainNeuralNetwork()).setOrigin(0.5));

        this.add.existing(new TextButton(this, 400, 500, 'Let the AI drive', g_settings.style.buttonStyles, () => this.startAIDemonstration()).setOrigin(0.5));

        // Handle click
        /*
        this.input.on("pointerdown", function(pointer){
            this.scene.start('PlayGame', {mode : "USER"});
        }, this);
        */
    }

    startSettings()
    {
        let el = document.getElementById("settingsContent");

        // Update content
        let html = buildSettings();
        el.innerHTML = html;
        
        overlay();
    }

    startUserPractice()
    {
        // reset training
        // NB: we may decide to append to previous training 
        // and have an explicit reset button
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

        // start scene as a user
        this.scene.start('PlayGame', {mode : "USER"});
    }

    trainNeuralNetwork()
    {
        this.scene.start('Train');
    }

    startAIDemonstration()
    {
        this.scene.start('PlayGame', {mode : "AI"});
    }
}

function overlay() 
{
    el = document.getElementById("overlay");
    el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
    window.scrollTo(0, 0);
}
