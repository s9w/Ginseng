var Profiles = React.createClass({
    getInitialState() {
        return {
            reviewProfiles: this.props.reviewProfiles,
            selectedProfileID: _.min(_.keys(this.props.reviewProfiles)).toString()
        };
    },
    addProfile(){
        var nextProfileID =  _.parseInt(_.max(_.keys(this.state.reviewProfiles)))+1;
        var newProfiles = _.cloneDeep( this.state.reviewProfiles );
        newProfiles[nextProfileID] = {
            "name": "New Profile",
            "condition": "",
            "urgencyThreshold": 1.0
        };

        this.setState({
            reviewProfiles: newProfiles,
            selectedProfileID: nextProfileID
        });
    },
    deleteProfile(){
        var newProfiles = _.cloneDeep( this.state.reviewProfiles );
        delete newProfiles[this.state.selectedProfileID];
        this.setState({
            reviewProfiles: newProfiles,
            selectedProfileID: _.parseInt(_.max(_.keys(newProfiles)))
        });
    },
    updateprofiles(param){
        console.log("param: " + JSON.stringify(param));
        var newProfiles = _.cloneDeep( this.state.reviewProfiles) ;
        _.extend( newProfiles[this.state.selectedProfileID], param);
        this.setState({reviewProfiles: newProfiles});
    },
    selectProfile(ID){
        this.setState({selectedProfileID: ID})
    },
    render() {
        var isChanged = JSON.stringify(this.props.reviewProfiles)!==JSON.stringify(this.state.reviewProfiles);

        return (
            <div className="Component">
                <section>
                    <h3>Review Profiles</h3>
                    <DictSelector
                        dict={this.state.reviewProfiles}
                        selectedID={this.state.selectedProfileID}
                        onSelectionChange={this.selectProfile}
                        onAddElement={this.addProfile}
                        onDeleteElement={_.keys(this.state.reviewProfiles).length<=1?false:this.deleteProfile}
                    />
                </section>

                <Editor
                    path={this.state.reviewProfiles[this.state.selectedProfileID]}
                    objects={[
                        {
                            displayName: "Name",
                            key: "name",
                            displayType: "input"
                        },
                        {
                            displayName: "Condition",
                            key: "condition",
                            displayType: "input"
                        },
                        {
                            displayName: "Urgency Threshold",
                            key: "urgencyThreshold",
                            displayType: "input"
                        }
                    ]}
                    onUpdate={this.updateprofiles}
                />

                <div className="flexContHoriz">
                    <button
                        disabled={!isChanged}
                        className="buttonGood"
                        onClick={this.props.updateProfiles.bind(null, this.state.reviewProfiles)}>Save
                    </button>
                    <button onClick={this.props.onCancel}>Cancel</button>
                </div>
            </div>
        )
    }
});
