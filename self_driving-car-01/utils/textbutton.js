
// default style
const DEFAULT_STYLE = {
    rest : { fill: '#0f0'},
    hover : { fill: '#ff0'},
    active : { fill: '#0ff' }
};

class TextButton extends Phaser.GameObjects.Text 
{
    constructor(scene, x, y, text, styles, callback) 
    {
        super(scene, x, y, text, styles.rest);

        // store styles
        this.m_styles = styles;
        
        // Set as interactive with callbacks
        this.setInteractive({ useHandCursor: true })
            .on('pointerover', () => this.onHover() )
            .on('pointerout', () => this.onRest() )
            .on('pointerdown', () => this.onActive() )
            .on('pointerup', () => {
                this.onHover();
                callback();
            });
    }
  
    onHover()
    {
      this.setStyle(this.m_styles.hover);
    }
  
    onRest() 
    {
      this.setStyle(this.m_styles.rest);
    }
  
    onActive() 
    {
      this.setStyle(this.m_styles.active);
    }
  }
  