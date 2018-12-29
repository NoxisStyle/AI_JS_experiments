

class Graph
{
    constructor(scene, x, y, width, height, backgroundColor, lineColor, lineWidth) 
    {
        this.m_scene = scene;
        this.m_rect = {
            x : x,
            y : y,
            width : width,
            height : height
        };

        this.m_lineColor = lineColor;
        this.m_lineWidth = lineWidth;
        this.m_points = [];
        //this.m_linePolygon = new Phaser.Geom.Polygon();

        this.m_background = this.m_scene.add.graphics();
        this.m_background.fillStyle(backgroundColor, 1.0);
        this.m_background.fillRect(this.m_rect.x, this.m_rect.y, this.m_rect.width, this.m_rect.height);

        this.m_line = this.m_scene.add.graphics();
    }

    reset()
    {
        this.m_line.clear();
        this.m_points = [];
    }

    addPointWithFactors(xFactor, yFactor)
    {
        // Add point
        let x = Math.floor(this.m_rect.x + xFactor * this.m_rect.width);
        let y = Math.floor(this.m_rect.y + this.m_rect.height * (1.0 - yFactor));
        this.m_points.push(new Phaser.Geom.Point(x, y));

        // draw
        if (this.m_points.length > 1)
        {
            this.m_line.clear();
            this.m_line.lineStyle(this.m_lineWidth, this.m_lineColor, 1.0);
            //this.m_linePolygon.setTo(this.m_points);
            this.m_line.strokePoints(this.m_points);
        }
    }

}