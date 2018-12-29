// Cartpole environment according to 
// https://github.com/openai/gym/blob/master/gym/envs/classic_control/cartpole.py

class CartPoleEnvironment
{
    constructor() 
    {
        // Initialize
        this.m_gravity = 9.8;
        this.m_massCart = 1.0;
        this.m_massPole = 0.1;
        this.m_totalMass = (this.m_massPole + this.m_massCart);
        this.m_length = 0.5; // Half of the pole's length
        this.m_polemassLength = (this.m_massPole * this.m_length);
        this.m_forceMag = 10.0;
        this.m_tau = 0.02;  // Seconds between state updates
        this.m_kinematicsIntegrator = "euler";

        // Beyond these trhesholds, episode is considered to be failed
        // Termination if:;
        //   - Pole Angle is more than +/- 12 degrees
        //   - Cart Position is more than +/- 2.4
        this.m_thetaThresholdRadians = 12 * 2 * Math.PI / 360; 
        this.m_xThreshold = 2.4;

        this.m_reward = 0;
        this.m_isDone = false;

        this.reset();
    }


    reset()
    {
        // Cart position, meters.
        this.m_x = Math.random() - 0.5;
        // Cart velocity.
        this.m_xDot = (Math.random() - 0.5) * 1;
        // Pole angle, radians.
        this.m_theta = (Math.random() - 0.5) * 2 * (6 / 360 * 2 * Math.PI);
        // Pole angle velocity.
        this.m_thetaDot = (Math.random() - 0.5) * 0.5;

        if (false)
        {
            this.m_xDot = 0;
            this.m_theta = 0.0;
            this.m_thetaDot = 0.0;
        }

        this.m_isDone = false;
        this.m_reward = 0;
    }

    getReward()
    {
        return this.m_reward;
    }

    isDone()
    {
        return Math.abs(this.m_x) > this.m_xThreshold ||
                Math.abs(this.m_theta) > this.m_thetaThresholdRadians;
    }

    getState()
    {
        return [this.m_x, this.m_xDot, this.m_theta, this.m_thetaDot];
    }

    getWorldWidth()
    {
        return this.m_xThreshold * 2;
    }

    getCartX()
    {
        return this.m_x;
    }

    getPoleLength()
    {
        return 2 * this.m_length;
    }

    getPoleTheta()
    {
        return this.m_theta;
    }

    step(action)
    {
        let force = 0.0;
        if (action == 1)
            force = this.m_forceMag;
        else if (action == 0)
            force = -this.m_forceMag;
        let costheta = Math.cos(this.m_theta);
        let sintheta = Math.sin(this.m_theta);

        // Compute accelerations
        let temp = (force + this.m_polemassLength * this.m_thetaDot * this.m_thetaDot * sintheta) / this.m_totalMass;
        let thetaacc = (this.m_gravity * sintheta - costheta * temp) / (this.m_length * (4.0 / 3.0 - this.m_massPole * costheta * costheta / this.m_totalMass));
        let xacc  = temp - this.m_polemassLength * thetaacc * costheta / this.m_totalMass;
        
        // Apply accelerations
        if (this.m_kinematicsIntegrator == "euler")
        {
            this.m_x = this.m_x + this.m_tau * this.m_xDot;
            this.m_xDot = this.m_xDot + this.m_tau * xacc;
            this.m_theta = this.m_theta + this.m_tau * this.m_thetaDot;
            this.m_thetaDot = this.m_thetaDot + this.m_tau * thetaacc;
        }
        else
        {
            // semi-implicit euler
            this.m_xDot = this.m_xDot + this.m_tau * xacc;
            this.m_x = this.m_x + this.m_tau * this.m_xDot;
            this.m_thetaDot = this.m_thetaDot + this.m_tau * thetaacc;
            this.m_theta = this.m_theta + this.m_tau * this.m_thetaDot;
        }

        // Check if episode is done
        let done = this.isDone();

        if (!done)
        {
            this.m_reward = 1.0;
        }
        else
        {
            this.m_reward = 0.0;
        }

        //console.log(this);
    }


}