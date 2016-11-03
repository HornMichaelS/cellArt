import React from 'react';
import './App.css';
import Game from './Game';
import Settings from './Settings';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            settings: {
                speed: 800,
                drawLiveCell: false,
                drawCellDeath: true,
                randomizeLifeColor: false,
                randomizeDeathColor: true,
            },
        };
    }

    changeSettings(newSettings) {
        this.setState({
            settings: newSettings,
        });
    }

    render() {
        let gameLayout = {
            width: '100%',
            height: window.innerHeight * 0.8,
            display: 'block',
            marginTop: 75,
        };

        return (
            <div>
                <div id="gameContainer" style={gameLayout}>
                    <Game settings={this.state.settings} />
                </div>
                <Settings onSettingsChange={this.changeSettings.bind(this)}
                          currentSettings={this.state.settings} />
            </div>
        );
    }
}

export default App;
