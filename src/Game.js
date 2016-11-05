import React from 'react';
import GameDisplay from './GameDisplay';
import Settings from './Settings';
import CellularAutomaton from './CellularAutomaton';
import './Game.css';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.automaton = new CellularAutomaton();
        this.state = {
            settings: {
                speed: 1,
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

    changeSettings(newSettings) {
        this.setState({
            settings: newSettings,
        });
    }

    /**
      * Change the state to reflect a change in the size of the user's browser
      * viewport.
      * @param {Function} callBack Optional function to run after state mutation
      */
    adjustCanvas(callBack) {
        let width = document.getElementById('Game-display-container').clientWidth;
        let height = document.getElementById('Game-display-container').clientHeight;

        this.setState({
            displayWidth: width.toString(),
            displayHeight: height.toString(),
        }, callBack);
    }

    updateCycle() {
        this.automaton.update();
        this.setState({
            changedCells: this.automaton.changedQueue,
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

    componentDidMount() {
        this.adjustCanvas(this.initializeGame);

        window.onresize = this.adjustCanvas.bind(this, null);

        this.intervalHandle = window.setInterval(this.updateCycle.bind(this),
            1025-(1025 - Math.pow(2, 10 - this.state.settings.speed)));
    }

    componentDidUpdate(prevProps, prevState) {
        window.clearInterval(this.intervalHandle);
        this.intervalHandle = window.setInterval(this.updateCycle.bind(this),
            1025-(1025 - Math.pow(2, 10 - this.state.settings.speed)));
    }

    render() {

        return (
            <div id="Game-outer-container">
                <div id="Game-settings-container">
                    <Settings onSettingsChange={this.changeSettings.bind(this)}
                              currentSettings={this.state.settings} />
                </div>
                <div id="Game-display-container">
                    <GameDisplay settings={this.state.settings}
                                 changedCells={this.state.changedCells}
                                 displayWidth={this.state.displayWidth}
                                 displayHeight={this.state.displayHeight} />
                </div>
            </div>
        );
    }
}

export default Game;
