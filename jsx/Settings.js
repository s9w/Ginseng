var Settings = React.createClass({
    getInitialState() {
        return {
            settings: this.props.settings
        };
    },
    onSave(){
        var newReviewHistoryLength = _.parseInt(this.state.settings.reviewHistoryLength);
        var newSettings = JSON.parse( JSON.stringify( this.state.settings ));
        newSettings.reviewHistoryLength = newReviewHistoryLength>=1?
            newReviewHistoryLength:
            this.props.settings.reviewHistoryLength;
        this.props.updateSettings(newSettings);
    },
    onChange(event){
        var newSettings = JSON.parse( JSON.stringify( this.state.settings ));
        newSettings[event.target.name] = event.target.value;
        this.setState({settings: newSettings});
    },
    render() {

        return (
            <div className="Component">
                <span>Number of saved Reviews to keep. Higher Number will increase file size (around 0.1KB per review): </span>
                <input
                    onChange={this.onChange}
                    name="reviewHistoryLength"
                    type="number"
                    min="1"
                    step="1"
                    style={{maxWidth: "50px" }}
                    value={this.state.settings.reviewHistoryLength} />
                <button
                    onClick={this.onSave}>Save</button>
            </div>
        )
    }
});
