import React from 'react';
import './Settings.css';

/**
  * A component containing 'game' controls and settings.
  */
class Settings extends React.Component {
    /**
      * Handle speed setting change.
      * @param {Object} event The event sent from the speed slider input.
      */
    onSpeedChange(event) {
        let {currentSettings} = this.props;
        currentSettings.speed = parseInt(event.target.value, 10);
        this.props.onSettingsChange(currentSettings);
    }

    toggleDrawLive(event) {
        let {currentSettings} = this.props;
        currentSettings.drawLiveCell = !currentSettings.drawLiveCell;
        this.props.onSettingsChange(currentSettings);
    }

    toggleDrawTrail(event) {
        let {currentSettings} = this.props;
        currentSettings.drawCellDeath = !currentSettings.drawCellDeath;
        this.props.onSettingsChange(currentSettings);
    }

    stringifyBoolean(value) {
        if (value === true) {
            return 'on';
        } else {
            return 'off';
        }
    }

    /**
      * Render the settings component.
      * @return {Object} The rendered component.
      */
    render() {
        const {speed, drawLiveCell, drawCellDeath} = this.props.currentSettings;
        const onSpeedChange = this.onSpeedChange.bind(this);

        return (
            <div className="Settings-sub-container">
                <div className="Settings-speed-range">
                    <div className="Settings-label">Speed</div>
                    <input type="range"
                           name="interval"
                           min="0"
                           max={this.props.maxSpeed}
                           value={speed}
                           onChange={onSpeedChange}></input>
                </div>
                <div className="Settings-play-pause-container">
                    <ul className="Settings-play-pause-buttons">
                        <li >
                            <button className="Settings-play-button" onClick={this.props.handlePlay}>
                                <img src="1478395686_play-triangle-media-shape.png" alt=""/>
                            </button>
                        </li>
                        <li>
                            <button className="Settings-pause-button" onClick={this.props.handlePause}>
                                <img src="white-pause-48.png" alt=""/>
                            </button>
                        </li>
                        <li>
                            <button className="Settings-step-button" onClick={this.props.handleStep}>
                                <img src="forward-media-step.png" alt=""/>
                            </button>
                        </li>
                    </ul>
                </div>
                <ul className="Settings-draw-options">
                    <li >
                        Draw live cells:
                        <input type="checkbox"
                               checked={drawLiveCell}
                               onChange={this.toggleDrawLive.bind(this)}></input>
                    </li>
                    <li>
                        Draw trails:
                        <input type="checkbox"
                               checked={!drawCellDeath}
                               onChange={this.toggleDrawTrail.bind(this)}></input>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Settings;
