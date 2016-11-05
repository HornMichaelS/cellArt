import React from 'react';
import CellularAutomaton from './CellularAutomaton';

/**
 * A component which renders a representation of a cellular
 * automaton using html5 canvas.
 */
class Game extends React.Component {
    /**
      * Declare properties front and back canvas (corresponding to
      * back and front buffers for rendering the game world).
      * @param {Object} props Required to properly construct the component.
      */
    constructor(props) {
        super(props);

        this.automaton = new CellularAutomaton();
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
        let renderX = x * this.cellPixelSize;
        let renderY = y * this.cellPixelSize;

        this.backContext.fillRect(renderX, renderY,
            this.cellPixelSize, this.cellPixelSize);
    }

    /**
      * Render the game world onto the back canvas, then transfer the image
      * to the front canvas
      */
    drawWorld() {
        /**
          * Iterate through the cells which were updated in the last cycle,
          * and draw them to the canvas in their new state.
          */
        for (let i = 0; i < this.automaton.changedQueue.length; i++) {
            let cell = this.automaton.changedQueue[i];

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
      * Run a render cycle, which consists of rendering the gameworld in its
      * current state, then stepping to the next state in the simulation.
      */
    renderCycle() {
        this.drawWorld();
        this.automaton.update();
    }

    /**
      * Change the state to reflect a change in the size of the user's browser
      * viewport.
      * @param {Function} callBack Optional function to run after state mutation
      */
    adjustCanvas(callBack) {
        let width = document.getElementById('gameContainer').clientWidth;

        this.setState({
            gameWidth: width.toString(),
            gameHeight: Math.floor(window.innerHeight * 0.8).toString(),
        }, callBack);
    }

    /**
      * Start simulation with a few live cells (for testing purposes).
      */
    initializeGame() {
        let lineSize = Math.floor(this.state.gameWidth /
            (this.cellPixelSize));
        let hMid = Math.floor((this.state.gameWidth / 2) / this.cellPixelSize);
        let vMid = Math.floor((this.state.gameHeight / 2) / this.cellPixelSize);
        for (let i = Math.floor(hMid - lineSize / 2); i < Math.floor(hMid + lineSize / 2); i++) {
            this.automaton.addCell(i, vMid);
            this.automaton.liveCells++;
        }
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

        window.onresize = this.adjustCanvas.bind(this, null);

        this.adjustCanvas(this.initializeGame);

        this.intervalHandle = window.setInterval(this.renderCycle.bind(this),
            1025-(1025 - Math.pow(2, 10 - this.props.settings.speed)));
    }

    componentDidUpdate() {
        window.clearInterval(this.intervalHandle);
        this.intervalHandle = window.setInterval(this.renderCycle.bind(this),
            1025-(1025 - Math.pow(2, 10 - this.props.settings.speed)));
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
                    width={this.state.gameWidth}
                    height={this.state.gameHeight}>

                Sorry, your browser does not support html5 canvas.
            </canvas>
        );
    };
}

export default Game;
