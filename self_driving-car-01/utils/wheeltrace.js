class WheelTraceSection
{
    constructor() 
    {
        this.m_lastTime = -1;
        this.m_pointsRearRightPoints = [];
        this.m_pointsRearLeftPoints = [];
    }

    addPoints(time, rear_right_x, rear_right_y, rear_left_x, rear_left_y)
    {
        // Add point
        this.m_lastTime = time;
        this.m_pointsRearRightPoints.push(new Phaser.Geom.Point(rear_right_x, rear_right_y));
        this.m_pointsRearLeftPoints.push(new Phaser.Geom.Point(rear_left_x, rear_left_y));
    }
}

class WheelTrace
{
    constructor(scene, color, alpha, wheelWidth, traceTimeout) 
    {
        this.m_scene = scene;
        this.m_wheelWidth = wheelWidth;
        this.m_color = color;
        this.m_alpha = alpha;
        this.m_traceTimeout = traceTimeout;

        this.m_traceSections = [];
        this.m_currentSection = null;

        this.m_line = this.m_scene.add.graphics();
    }

    reset()
    {
        this.m_line.clear();
        this.m_traceSections = [];
    }


    addPointsToCurrentSection(time, rear_right_x, rear_right_y, rear_left_x, rear_left_y)
    {
        // Create a new section if required
        if (this.m_currentSection == null)
        {
            this.m_currentSection = new WheelTraceSection(time);
            this.m_traceSections.push(this.m_currentSection);
        }

        // Add a point to the current section
        this.m_currentSection.addPoints(time, rear_right_x, rear_right_y, rear_left_x, rear_left_y);
    }

    isInSection()
    {
        return (this.m_currentSection != null);
    }

    endCurrentSection()
    {
        this.m_currentSection = null;
    }

    removeOldSections(time)
    {
        // remove old sections
        for (let i = 0; i < this.m_traceSections.length; i++)
        {
            if (time - this.m_traceSections[i].m_lastTime > this.m_traceTimeout )
            {
                // section is too old, remove it.
                this.m_traceSections.splice(i, 1);
            }
        }

        if (this.m_traceSections.length == 0)
            this.m_currentSection = null;
    }

    draw()
    {
        this.m_line.clear();
        this.m_line.lineStyle(this.m_wheelWidth, this.m_color, this.m_alpha);

        // Draw each section
        for (let i = 0; i < this.m_traceSections.length; i++)
        {
            let section = this.m_traceSections[i];

            if (section.m_pointsRearRightPoints.length > 1)
                this.m_line.strokePoints(section.m_pointsRearRightPoints);
            if (section.m_pointsRearLeftPoints.length > 1)
                this.m_line.strokePoints(section.m_pointsRearLeftPoints);
        }
    }

}