

class GameVehicle
{
    constructor() 
    {
        this.gameobject = null;
        this.velocity = 0.0;
        this.cursorXModel = null;
        this.cursorYModel = null;
        this.wheelTraces  = null;
        this.hasWheelTrace  = false;
        this.turn  = SHIP_TURN_NO;
        this.turnStart  = -1;
        this.rewards  = 0;
        this.collisions = {
            environment : 0,
            endOfZone : false
        }

        this.m_reinforcementModel = null;
        this.episodeUpdateSteps = 0;
        this.episodeRewards = [];
        this.episodeActions = [];
        this.episodeStates = [];
        this.discountedEpisodeRewards = [];

    }

    reset()
    {
        this.velocity = 0;
        this.rewards =  0;
        this.collisions.environment = 0;
        this.collisions.endOfZone = false;

        this.episodeUpdateSteps = 0;
        this.episodeRewards = [];
        this.episodeActions = [];
        this.episodeStates = [];
        this.discountedEpisodeRewards = [];
    }
}