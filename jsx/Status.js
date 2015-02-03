var Status = React.createClass({
    getInitialState() {
        return {
            showOverwriteWarning: false,
            now: moment()
        };
    },
    componentDidMount: function() {
        this.interval = setInterval(this.tick, 1000);
    },
    componentWillUnmount: function() {
        clearInterval(this.interval);
    },
    tick: function() {
        this.setState({now: moment()});
    },
    componentWillReceiveProps(){
        this.setState({showOverwriteWarning: false});
    },
    onSaveClick(){
        if(this.props.lastLoadedStr === "never"){
            this.setState({showOverwriteWarning: true});
        }else{
            this.props.onDbSave();
        }
    },
    onCancelOverwrite(){
        this.setState({showOverwriteWarning: false});
    },
    render() {
        var lastSavedStr  = this.props.meta.lastSaved;
        var lastLoadedStr = this.props.lastLoadedStr;
        if(this.props.meta.lastSaved !== "never"){
            lastSavedStr = moment(this.props.meta.lastSaved).from(this.state.now);
        }
        if(this.props.lastLoadedStr !== "never"){
            lastLoadedStr = moment(this.props.lastLoadedStr).from(this.state.now);
        }
        if(this.props.dropBoxStatus === "loading" ){
            lastSavedStr = "...";
            lastLoadedStr = "...";
        }
        if( this.props.dropBoxStatus === "saving"){
            lastSavedStr = "...";
        }

        var popupOverwrite = false;
        if(this.state.showOverwriteWarning) {
            var buttonContainer =
                <div className="flexRowDistribute" >
                    <button
                        onClick={this.props.onDbSave}
                        className="button buttonGood">Yes</button>
                    <button
                        onClick={this.onCancelOverwrite}
                        className="button buttonGood">Oh god no</button>
                </div>;
            popupOverwrite = <Popup
                text="You're about to save to your Dropbox without loading first. This will overwrite previous data in your Dropbox! Continue?"
                buttonContainer={buttonContainer}
            />
        }

        return (
            <div className="Status Component">
                {popupOverwrite}

                <section>
                    <h3>Documentation</h3>
                    <span>Documentation can be found on the <a target="_blank" href="https://github.com/s9w/Ginseng#ginseng">Github Repository</a>.</span>
                </section>

                <section>
                    <h3>Infos</h3>
                    <div>Infos loaded: {this.props.dropBoxStatus === "loading"?"loading":this.props.infoCount}</div>
                </section>

                <section>
                    <h3>Dropbox</h3>
                    {this.props.dropBoxStatus !== "initial" &&
                        <div>{"Last save: " + lastSavedStr}</div>
                    }
                    {this.props.dropBoxStatus !== "initial" &&
                        <div>{"Last load: " + lastLoadedStr}</div>
                    }
                    <div>
                        {this.props.dropBoxStatus === "initial" &&
                            <button
                                className="buttonGood"
                                onClick={this.props.onDBAuth}>
                                Login
                            </button>
                        }
                        {this.props.dropBoxStatus !== "initial" &&
                            <button
                                className="buttonGood"
                                disabled={this.props.dropBoxStatus !== "loggedIn"}
                                onClick={this.props.onDbLoad}>
                                Load
                            </button>
                        }
                        {this.props.dropBoxStatus !== "initial" &&
                            <button
                                className="buttonGood"
                                disabled={this.props.dropBoxStatus !== "loggedIn"}
                                onClick={this.onSaveClick}>
                                Save
                            </button>
                        }
                    </div>
                </section>

                <section>
                    <h3>Browser Storage</h3>
                    <div>
                        <button
                            disabled={!this.props.onLocalLoad}
                            className="buttonGood"
                            onClick={this.props.onLocalLoad}>
                            Load
                        </button>
                        <button
                            className="buttonGood"
                            onClick={this.props.onLocalSave}>
                            Save
                        </button>
                    </div>
                </section>
            </div>
        )
    }
});
