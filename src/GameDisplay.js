import React from 'react';

/**
 * A component which renders a representation of a cellular
 * automaton using html5 canvas.
 */
class GameDisplay extends React.Component {
    /**
      * Declare properties front and back canvas (corresponding to
      * back and front buffers for rendering the game world).
      * @param {Object} props Required to properly construct the component.
      */
    constructor(props) {
        super(props);

        this.cellPixelSize = 5;

        // Property to track the current drawing color
        this.lifeColor = [0, 0, 0];
        this.deathColor = [255, 255, 255];
        this.backgroundColor = [255, 255, 255];

        this.state = {
            gameWidth: 5,
            gameHeight: 5,
        };
    }

    /**
      * Mutate a color, given as an array of 3 8bit channels, by incrementing
      * or decrementing one of the channels randomly. Mutation will occur
      * only with the probability given as 'probability'
      * @param {Array} color The color to mutate. Given as an array of three
      *     byte values representing red, green, and blue.
      * @param {Number} probability The probability that the color will actually
      *     mutate.
      */
    mutateColor(color, probability) {
        let channel = Math.floor(Math.random() * 3);
        let randomValue = Math.floor(Math.random() * 100);
        let colorShouldChange = randomValue < 2;

        /**
          * If color will change, either decrement or increment the chosen
          * channel, according to the modulus 2 of the value chosen
          * previously.
          */
        if (colorShouldChange) {
            let shouldIncrement = randomValue === 0;
            if (shouldIncrement && color[channel] < 255) {
                color[channel]++;
            } else if (color[channel] > 0) {
                color[channel]--;
            }
        }
    }

    /**
      * Render an individual cell to the canvas
      * @param {Number} x The x coordinate of the cell to draw.
      * @param {Number} y The y coordinate of the cell to draw.
      */
    drawCell(x, y) {
        // Translate from gameworld coordinates to canvas coordinates.
        let renderX = x * this.props.settings.cellSize;
        let renderY = y * this.props.settings.cellSize;

        this.backContext.fillRect(renderX, renderY,
            this.props.settings.cellSize, this.props.settings.cellSize);
    }

    /**
      * Render the game world onto the back canvas, then transfer the image
      * to the front canvas
      */
    drawWorld() {
        const changedCells = this.props.changedCells;

        /**
          * Iterate through the cells which were updated in the last cycle,
          * and draw them to the canvas in their new state.
          */
        for (let i = 0; i < changedCells.length; i++) {
            let cell = changedCells[i];

            const {randomizeDeathColor,
                   randomizeLifeColor,
                   drawLiveCell,
                   drawCellDeath} = this.props.settings;

            if (randomizeDeathColor) {
                this.mutateColor(this.deathColor, 0.01);
            }

            if (randomizeLifeColor) {
                this.mutateColor(this.lifeColor, 0.01);
            }

            let lifeColorString = 'rgb(' + this.lifeColor[0] + ',' +
                    this.lifeColor[1] + ',' + this.lifeColor[2] + ')';

            let deathColorString = 'rgb(' + this.deathColor[0] + ',' +
                    this.deathColor[1] + ',' + this.deathColor[2] + ')';

            if (cell.alive && drawLiveCell) {
                this.backContext.fillStyle = lifeColorString;
                this.drawCell(cell.x, cell.y);
            } else if (drawCellDeath) {
                this.backContext.fillStyle = deathColorString;
                this.drawCell(cell.x, cell.y);
            }
        }

        this.frontContext.drawImage(this.backCanvas, 0, 0);
    }



    /**
      * Initialize the canvas here, since they must be attached to the newly
      * created canvas DOM element. This is also where the canvas render cycle
      * is initialized, since it makes no sense to run render cycles before
      * the componenet mounts.
      */
    componentDidMount() {
        this.backCanvas = document.createElement('canvas');
        this.backCanvas.width = 4096;
        this.backCanvas.height = 2048;
        this.backContext = this.backCanvas.getContext('2d');
        this.frontCanvas = this.refs.canvas;
        this.frontContext = this.frontCanvas.getContext('2d');
    }

    /**
      * This is where 
      */
    componentDidUpdate() {
        this.drawWorld();
    }

    /**
      * Render the react component.
      * @return {Object} A React component containing the canvas element
      *                  where the game world is rendered.
      */
    render() {
        let canvasStyle = {
            borderTop: 'solid black 1px',
            borderBottom: 'solid black 1px',
            backgroundColor: 'white',
        };

        return (
            <canvas ref="canvas"
                    style={canvasStyle}
                    width={this.props.displayWidth}
                    height={this.props.displayHeight}>

                Sorry, your browser does not support html5 canvas.
            </canvas>
        );
    };
}

export default GameDisplay;