var Settings = React.createClass({
    getInitialState() {
        return {
            settings: this.props.settings
        };
    },
    onSave(){
        var newReviewHistoryLength = _.parseInt(this.state.settings.reviewHistoryLength);
        var newSettings = _.cloneDeep(this.state.settings );
        newSettings.reviewHistoryLength = newReviewHistoryLength>=1?
            newReviewHistoryLength:
            this.props.settings.reviewHistoryLength;
        this.props.updateSettings(newSettings);
    },
    onChange(event){
        var newSettings = _.cloneDeep(this.state.settings );
        if( _(["useCompression", "useGuess", "rememberModType"]).contains(event.target.name) ){
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
                    <h3>Guess Field</h3>
                    <div>
                        <span>During review, show a text field where you can enter a "guess" that will be compared to the solution.</span>
                        <input
                            onChange={this.onChange}
                            name="useGuess"
                            type="checkbox"
                            checked={this.state.settings.useGuess}
                        />
                    </div>
                </section>

                <section>
                    <h3>Compression</h3>
                    <div>
                        <span>Compress the data file. This will reduce the upload time to a third and the download time a bit. But it will make the data file unreadable for humans.</span>
                        <input
                            onChange={this.onChange}
                            name="useCompression"
                            type="checkbox"
                            checked={this.state.settings.useCompression}
                        />
                    </div>
                </section>

                <section>
                    <h3>Modify Type</h3>
                    <div>
                        <span>Remember the last choice of interval modification (change/set).</span>
                        <input
                            onChange={this.onChange}
                            name="rememberModType"
                            type="checkbox"
                            checked={this.state.settings.rememberModType}
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
