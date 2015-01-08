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
        if(event.target.name === "useCompression"){
            newSettings[event.target.name] = event.target.checked;
        }else{
            newSettings[event.target.name] = event.target.value;
        }

        this.setState({settings: newSettings});
    },
    render() {
        var isChanged = JSON.stringify(this.props.settings)!==JSON.stringify(this.state.settings);
        return (
            <div className="Component">
                <section>
                    <h3>Review Count</h3>
                    <div>
                        <span>Number of saved Reviews to keep. Higher Number will increase file size (around 0.1KB per review): </span>
                        <input
                            onChange={this.onChange}
                            name="reviewHistoryLength"
                            type="number"
                            min="1"
                            step="1"
                            style={{maxWidth: "50px" }}
                            value={this.state.settings.reviewHistoryLength}
                        />
                    </div>
                </section>

                <section>
                    <h3>Compression</h3>
                    <div>
                        <span>Compress the data file. This will shorten the upload time to a third and the download time a bit. But it will make the data file unreadable for humans.</span>
                        <input
                            onChange={this.onChange}
                            name="useCompression"
                            type="checkbox"
                            checked={this.state.settings.useCompression}
                        />
                    </div>
                </section>

                <button
                    className="buttonGood"
                    disabled={!isChanged}
                    onClick={this.onSave}>
                    Save
                </button>
            </div>
        )
    }
});
