import React from 'react';
import './GameDisplay.css';

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
        let shouldIncrement = Math.floor(Math.random() * 2) === 0;

        /**
          * If color will change, either decrement or increment the chosen
          * channel, according to the modulus 2 of the value chosen
          * previously.
          */
        if (shouldIncrement && color[channel] < 246) {
            color[channel] += 5;
        } else if (color[channel] > 9) {
            color[channel] -= 5;
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

    colorToString(color) {
      return 'rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')';
    }

    /**
      * Render the game world onto the back canvas, then transfer the image
      * to the front canvas
      */
    drawWorld() {
        const updatedCells = this.props.updatedCells;

        const {randomizeDeathColor,
                   randomizeLifeColor,
                   drawLiveCell,
                   drawCellDeath} = this.props.settings;

        if (randomizeDeathColor) {
            this.mutateColor(this.deathColor);
        }

        if (randomizeLifeColor) {
            this.mutateColor(this.lifeColor);
        }

        let lifeColorString = this.colorToString(this.lifeColor);
        let deathColorString = this.colorToString(this.deathColor);

        /**
          * Iterate through the cells which were updated in the last cycle,
          * and draw them to the canvas in their new state.
          */
        for (let i = 0; i < updatedCells.length; i++) {
            let cell = updatedCells[i];

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
      * When state changes, rerender the display.
      */
    componentDidUpdate() {
        if (this.props.updatedCells) {
            this.drawWorld();
        }
    }

    /**
      * Render the react component.
      * @return {Object} A React component containing the canvas element
      *                  where the game world is rendered.
      */
    render() {
        return (
            <canvas ref="canvas"
                    className="GameDisplay-canvas"
                    width={this.props.displayWidth}
                    height={this.props.displayHeight}>

                Sorry, your browser does not support html5 canvas.
            </canvas>
        );
    };
}

export default GameDisplay;
