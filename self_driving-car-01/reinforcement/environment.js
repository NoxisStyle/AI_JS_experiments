
class GameReinforcementLearningEnvironment
{
    constructor(environmentCategory, vehiclesCategory, endOfZoneSensor, ship1, ship2, mode, startPosY, endPosY) 
    {
        // Initialize
        this.m_ship1 = ship1;
        this.m_ship2 = ship2;
        this.m_environmentCategory = environmentCategory;
        this.m_vehiclesCategory = vehiclesCategory;
        this.m_endOfZoneSensor = endOfZoneSensor;
        this.m_mode = mode;
        this.m_startPosY = startPosY;
        this.m_endPosY = endPosY;
    }

    resetRewards()
    {
        this.m_ship1.rewards = 0;
        this.m_ship2.rewards = 0;
    }

    resetCollisions()
    {
        this.m_ship1.collisions.endOfZone = false;
        this.m_ship2.collisions.endOfZone = false;
        this.m_ship1.collisions.environment = 0;
        this.m_ship2.collisions.environment = 0;
    }

    /*
    shouldStoreRewardList()
    {
        return (this.m_mode == "RL_TRAIN");
    }
    //*/

    /*
    onCollisionStart(bodyA, bodyB)
    {
        // negative reward if collision with environment
        // positive reward if collision with endZone

        if ((bodyA === this.m_ship1.gameobject.body && bodyB === this.m_endOfZoneSensor) ||
        (bodyA === this.m_endOfZoneSensor && bodyB === this.m_ship1.gameobject.body))
        {
            // collision with end zone
            //this.m_ship1.rewards += g_settings.reinforcement.endZoneCollisionReward;
            this.m_ship1.collisions.endOfZone = true;
        }
        else if ((bodyA === this.m_ship2.gameobject.body && bodyB === this.m_endOfZoneSensor) ||
        (bodyA === this.m_endOfZoneSensor && bodyB === this.m_ship2.gameobject.body))
        {
            // collision with end zone
            //this.m_ship2.rewards += g_settings.reinforcement.endZoneCollisionReward;
            this.m_ship2.collisions.endOfZone = true;
        }
        else if ((bodyA === this.m_ship1.gameobject.body && bodyB.collisionFilter.category == this.m_environmentCategory) ||
        (bodyA.collisionFilter.category == this.m_environmentCategory && bodyB === this.m_ship1.gameobject.body))
        {
            // collision with environment
            //this.m_ship1.rewards += g_settings.reinforcement.environmentCollisionReward;
            this.m_ship1.collisions.environment++;
            console.log("###BOUM##" + this.m_ship1.collisions.environment);
        }
        else if ((bodyA === this.m_ship2.gameobject.body && bodyB.collisionFilter.category == this.m_environmentCategory) ||
        (bodyA.collisionFilter.category == this.m_environmentCategory && bodyB === this.m_ship2.gameobject.body))
        {
            // collision with environment
            //this.m_ship2.rewards += g_settings.reinforcement.environmentCollisionReward;
            this.m_ship2.collisions.environment++;
            console.log("###BOUM##" + this.m_ship1.collisions.environment);
        }
    }

    onCollisionEnd(bodyA, bodyB)
    {
        // negative reward if collision with environment
        // positive reward if collision with endZone

        if ((bodyA === this.m_ship1.gameobject.body && bodyB === this.m_endOfZoneSensor) ||
        (bodyA === this.m_endOfZoneSensor && bodyB === this.m_ship1.gameobject.body))
        {
            // collision with end zone
            this.m_ship1.collisions.endOfZone = false;
        }
        else if ((bodyA === this.m_ship2.gameobject.body && bodyB === this.m_endOfZoneSensor) ||
        (bodyA === this.m_endOfZoneSensor && bodyB === this.m_ship2.gameobject.body))
        {
            // collision with end zone
            this.m_ship2.collisions.endOfZone = false;
        }
        else if ((bodyA === this.m_ship1.gameobject.body && bodyB.collisionFilter.category == this.m_environmentCategory) ||
        (bodyA.collisionFilter.category == this.m_environmentCategory && bodyB === this.m_ship1.gameobject.body))
        {
            // collision with environment
            this.m_ship1.collisions.environment--;
            console.log("---------" + this.m_ship1.collisions.environment);
        }
        else if ((bodyA === this.m_ship2.gameobject.body && bodyB.collisionFilter.category == this.m_environmentCategory) ||
        (bodyA.collisionFilter.category == this.m_environmentCategory && bodyB === this.m_ship2.gameobject.body))
        {
            // collision with environment
            this.m_ship2.collisions.environment--;
            console.log("---------" + this.m_ship1.collisions.environment);
        }
    }
    //*/

    onCollisionActive(bodyA, bodyB)
    {
        // negative reward if collision with environment
        // positive reward if collision with endZone

        if ((bodyA === this.m_ship1.gameobject.body && bodyB === this.m_endOfZoneSensor) ||
        (bodyA === this.m_endOfZoneSensor && bodyB === this.m_ship1.gameobject.body))
        {
            // collision with end zone
            //this.m_ship1.rewards += g_settings.reinforcement.endZoneCollisionReward;
            this.m_ship1.collisions.endOfZone = true;
        }
        else if ((bodyA === this.m_ship2.gameobject.body && bodyB === this.m_endOfZoneSensor) ||
        (bodyA === this.m_endOfZoneSensor && bodyB === this.m_ship2.gameobject.body))
        {
            // collision with end zone
            //this.m_ship2.rewards += g_settings.reinforcement.endZoneCollisionReward;
            this.m_ship2.collisions.endOfZone = true;
        }
        else if ((bodyA === this.m_ship1.gameobject.body && bodyB.collisionFilter.category == this.m_environmentCategory) ||
        (bodyA.collisionFilter.category == this.m_environmentCategory && bodyB === this.m_ship1.gameobject.body))
        {
            // collision with environment
            //this.m_ship1.rewards += g_settings.reinforcement.environmentCollisionReward;
            this.m_ship1.collisions.environment++;
        }
        else if ((bodyA === this.m_ship2.gameobject.body && bodyB.collisionFilter.category == this.m_environmentCategory) ||
        (bodyA.collisionFilter.category == this.m_environmentCategory && bodyB === this.m_ship2.gameobject.body))
        {
            // collision with environment
            //this.m_ship2.rewards += g_settings.reinforcement.environmentCollisionReward;
            this.m_ship2.collisions.environment++;
        }
    }

    updateRewards(ship, debug)
    {
        // negative reward if not moving
        // 0 reward if going down
        // positive reward if going up

        ship.rewards = 0;
        ship.episodeUpdateSteps++;

        // compute the distance factor.
        // It needs to be > 0 for power < 1, oitherwise return will be nan
        let distance = Math.max( (ship.gameobject.y - this.m_startPosY) / (this.m_endPosY - this.m_startPosY), 0);
        if (debug)
            console.log('dist factor ' + distance);

        // Compute end of zone reward
        if (ship.collisions.endOfZone)
        {
            ship.rewards += g_settings.reinforcement.endZoneCollisionReward;
            if (debug)
                console.log("EOZ reward of " + g_settings.reinforcement.endZoneCollisionReward);
        }

        // compute environment collision rewards
        let environmentCollisionReward = ship.collisions.environment * g_settings.reinforcement.environmentCollisionReward;
        ship.rewards += environmentCollisionReward;
        if (debug)
            console.log("Environment collision reward of " + environmentCollisionReward + " (" + ship.collisions.environment + " collisions)");

        /*
        if (ship.gameobject.body.velocity.y < 0)
        {
            ship.rewards += g_settings.reinforcement.goingUpReward;
            if (debug)
                console.log("Environment going up reward " + g_settings.reinforcement.goingUpReward);
        }
        else if (ship.gameobject.body.velocity.y > 0)
        {
            ship.rewards += g_settings.reinforcement.goingDownReward;
            if (debug)
                console.log("Environment going down reward " + g_settings.reinforcement.goingDownReward);
        }
        else
        {
            ship.rewards += g_settings.reinforcement.notMovingReward;
            if (debug)
                console.log("Environment not moving reward " + g_settings.reinforcement.notMovingReward);
        }
        //*/

        // Compute distance reward
        let distanceReward = g_settings.reinforcement.distanceReward * Math.pow(distance, g_settings.reinforcement.distanceRewardPower);
        ship.rewards += distanceReward;
        if (debug)
            console.log("Environment distance reward " + distanceReward);

        // Direction reward
        let angle = ((ship.gameobject.angle - 90) * Math.PI) / 180.0;
        //console.log(ship.gameobject.angle + " " + angle);
        let radius = g_settings.reinforcement.goingUpReward;
        if (angle > Math.PI)
            radius = g_settings.reinforcement.goingDownReward;    
        let directionReward = radius * Math.sin(angle);
        ship.rewards += directionReward;
        if (debug)
            console.log("Direction reward " + directionReward);

        // Compute rays rewards
        if (ship.lastRays !== null)
        {
            let raysReward = g_settings.reinforcement.raysRewardFactorC * ship.lastRays[0]
                                + g_settings.reinforcement.raysRewardFactorLR * (ship.lastRays[1] + ship.lastRays[2]);
            ship.rewards += raysReward;
            if (debug)
                console.log("rays reward " + raysReward);
        }

        if (debug)
            console.log("### Total rewards " + ship.rewards);
        
        // Push the reward in the episode reward list
        //if (shouldStoreRewardList())
        //    this.episodeRewards.push(ship.rewards);
    }
}