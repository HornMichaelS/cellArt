import React from 'react';

class Settings extends React.Component {
    onSpeedChange(event) {
        let {currentSettings} = this.props;
        currentSettings.speed = event.target.value;
        this.props.onSettingsChange(currentSettings);
    }

    render() {
        const {speed} = this.props.currentSettings;
        const onSpeedChange = this.onSpeedChange.bind(this);
        return (
            <div className="speed-range">
                Speed: <input type="range"
                                 name="interval"
                                 min="0"
                                 max="8"
                                 value={speed}
                                 onChange={onSpeedChange}></input>
            </div>
        );
    }
}

export default Settings;
