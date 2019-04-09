
class DirectionRewardView
{
    constructor(scene, color, alpha, width, defaultRadius, sections) 
    {
        this.m_scene = scene;
        this.m_width = width;
        this.m_color = color;
        this.m_alpha = alpha;
        this.m_defaultRadius = defaultRadius;
        this.m_sections = sections;

        this.m_points = [];
        this.m_line = this.m_scene.add.graphics();
    }

    reset()
    {
        this.m_line.clear();
        this.m_points = [];
    }


    update(x, y)
    {
        // Reset
        this.reset();

        // build new path
        for (let i = 0; i < this.m_sections; i++)
        {
            let angle = (i * 2 * Math.PI ) / this.m_sections;
            
            let radius = g_settings.reinforcement.angleUpReward;
            if (angle > Math.PI)
                radius = g_settings.reinforcement.angleDownReward;
            
            let rewardRadius = this.m_defaultRadius * radius * Math.sin(angle);

            let pX = x + rewardRadius * Math.cos(angle);
            let pY = y - rewardRadius * Math.sin(angle);

            this.m_points.push(new Phaser.Geom.Point(pX, pY));
        }
    }

    draw()
    {
        this.m_line.clear();
        this.m_line.lineStyle(this.m_width, this.m_color, this.m_alpha);

        this.m_line.strokePoints(this.m_points);
    }

}