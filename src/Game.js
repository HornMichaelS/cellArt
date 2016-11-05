import React from 'react';
import GameDisplay from './GameDisplay';
import Settings from './Settings';
import CellularAutomaton from './CellularAutomaton';
import './Game.css';

/**
  * A component containing the whole 'game' including controls, display,
  * and automaton simulator.
  */
class Game extends React.Component {

    /**
      * Establish initial settings for the game, and initialize the automaton.
      * @param {Object} props The props passed in to this component.
      */
    constructor(props) {
        super(props);
        this.automaton = new CellularAutomaton();
        this.maxSpeed = 10;
        this.state = {
            settings: {
                speed: 5,
                drawLiveCell: false,
                drawCellDeath: true,
                randomizeLifeColor: false,
                randomizeDeathColor: true,
                cellSize: 10,
            },
            changedCells: [],
            displayWidth: 100,
            displayHeight: 100,
        };
    }

    /**
      * Update state to reflect changes user made in the settings component.
      * @param {Object} newSettings A new settings object with updated settings.
      */
    handleSettingsChange(newSettings) {
        this.setState({
            settings: newSettings,
        });
    }

    /**
      * Change the state to reflect a change in the size of the user's browser
      * viewport, so that the display can grow and shrink accordingly.
      * @param {Function} callBack Optional function to run after state mutation
      */
    adjustDisplay(callBack) {
        let gameDisplayElem = document.getElementById('Game-display-container');
        let width = gameDisplayElem.clientWidth;
        let height = gameDisplayElem.clientHeight;

        this.setState({
            displayWidth: width.toString(),
            displayHeight: height.toString(),
        }, callBack);
    }

    /**
      * Run a single step of the simulation, and update the state to reflect
      * changes in the automaton.
      */
    updateCycle() {
        this.automaton.update();
        this.setState({
            updatedCells: this.automaton.updateQueue,
        });
    }

    /**
      * Start simulation with a few live cells (for testing purposes).
      */
    initializeGame() {
        let dWidth = this.state.displayWidth;
        let dHeight = this.state.displayHeight;
        let pixelSize = this.state.settings.cellSize;
        let lineWidth = Math.floor(dWidth / pixelSize);
        let lineHeight = Math.floor((dHeight / 2) / pixelSize);
        for (let i = 0; i < lineWidth; i++) {
            this.automaton.addCell(i, lineHeight);
            this.automaton.liveCells++;
        }
    }

    /**
      * The interval will halve with each increase in speed.
      * @return {Number} The calculated interval.
      */
    calculateIntervalFromSpeed() {
        let exponent = this.maxSpeed - this.state.settings.speed;
        let interval = Math.pow(2, exponent);
        return interval;
    }

    /**
      * Set the initial display size, setup a window size event listener,
      * and start the simulation.
      */
    componentDidMount() {
        this.adjustDisplay(this.initializeGame);

        window.onresize = this.adjustDisplay.bind(this, null);

        this.updateInterval =
            window.setInterval(
                this.updateCycle.bind(this),
                this.calculateIntervalFromSpeed()
            );
    }

    /**
      * If the speed setting changed in the last state update, reset the
      * interval to reflect the new speed.
      * @param {Object} prevProps Props from before update.
      * @param {Object} prevState State from before update.
      */
    componentDidUpdate(prevProps, prevState) {
        window.clearInterval(this.updateInterval);

        this.updateInterval =
            window.setInterval(
                this.updateCycle.bind(this),
                this.calculateIntervalFromSpeed()
            );
    }

    /**
      * Render component.
      * @return {Object} The rendered component
      */
    render() {
        return (
            <div id="Game-outer-container">
                <div id="Game-settings-container">
                    <Settings
                        onSettingsChange={this.handleSettingsChange.bind(this)}
                        currentSettings={this.state.settings}
                        maxSpeed={this.maxSpeed}
                    />
                </div>
                <div id="Game-display-container">
                    <GameDisplay settings={this.state.settings}
                                 updatedCells={this.state.updatedCells}
                                 displayWidth={this.state.displayWidth}
                                 displayHeight={this.state.displayHeight} />
                </div>
            </div>
        );
    }
}

export default Game;
