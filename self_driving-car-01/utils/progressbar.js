

class ProgressBar
{
    constructor(scene, x, y, width, height, borderSize, borderColor, internalColor) 
    {
        this.m_scene = scene;
        this.m_rect = {
            x : x,
            y : y,
            width : width,
            height : height
        };
        this.m_internalRect = {
            x : x + borderSize,
            y : y + borderSize,
            width : width - 2 * borderSize,
            height : height - 2 * borderSize
        };
        this.m_internalColor = internalColor;
        this.m_background = this.m_scene.add.graphics();
        this.m_background.fillStyle(borderColor, 1.0);
        this.m_background.fillRect(this.m_rect.x, this.m_rect.y, this.m_rect.width, this.m_rect.height);
        this.m_foreground = this.m_scene.add.graphics();
        this.m_foreground.fillStyle(internalColor, 1.0);
        this.m_foreground.fillRect(this.m_internalRect.x, this.m_internalRect.y, this.m_internalRect.width, this.m_internalRect.height);
    }

    update(percentFactor)
    {
        this.m_foreground.clear();
        this.m_foreground.fillStyle(this.m_internalColor, 1.0);
        this.m_foreground.fillRect(this.m_internalRect.x, this.m_internalRect.y, this.m_internalRect.width * percentFactor, this.m_internalRect.height);
    }

}