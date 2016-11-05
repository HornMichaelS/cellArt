import React from 'react';
import './App.css';
import Game from './Game';

class App extends React.Component {

    render() {
        return (
            <div id="App-game-container">
                <div className="App-header">
                    <span className="App-cell-text">Cell</span>
                    <span className="App-Art-text">Art</span>
                </div>
                <Game />
            </div>
        );
    }
}

export default App;
