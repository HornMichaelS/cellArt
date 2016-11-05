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

    /**
      * Render the settings component.
      * @return {Object} The rendered component.
      */
    render() {
        const {speed} = this.props.currentSettings;
        const onSpeedChange = this.onSpeedChange.bind(this);
        return (
            <div className="Settings-speed-range">
                <div className="Settings-label">Speed</div>
                <input type="range"
                       name="interval"
                       min="0"
                       max={this.props.maxSpeed}
                       value={speed}
                       onChange={onSpeedChange}></input>
            </div>
        );
    }
}

export default Settings;
