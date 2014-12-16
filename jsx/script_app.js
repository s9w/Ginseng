var client = new Dropbox.Client({ key: "ob9346e5yc509q2" });
//client.authDriver(new Dropbox.AuthDriver.Popup({receiverUrl: "https://s9w.github.io/ginseng/dropbox_receiver.html"}));
client.authDriver(new Dropbox.AuthDriver.Popup({receiverUrl: "https://leastaction.org/ginseng/dropbox_receiver.html"}));


var App = React.createClass({
    getInitialState: function() {
        return {
            infos: init_data.infos,
            infoTypes: init_data.infoTypes,
            ginseng_settings: init_data.settings,
            activeMode: "status",
            selectedTypeID: false,
            selectedInfoIndex: 0,
            dropBoxStatus: "off",
            lastLoadedStr: "never",
            lastSavedStr: "never"
        };
    },
    clickNav: function(mode) {
        this.setState({activeMode: mode});
    },
    authDB: function(){
        var thisApp = this;
        client.authenticate(function (error) {
            if (error) {
                thisApp.setState({dropBoxStatus: "ERROR"});
            }
            else {
                thisApp.setState({dropBoxStatus: "logged in!"});
            }
        });
    },
    saveDB: function(){
        this.setState({lastSavedStr: "saving"});
        var thisApp = this;
        var writeData = {
            infos: this.state.infos,
            infoTypes: this.state.infoTypes,
            settings: this.state.ginseng_settings
        };
        client.writeFile("ginseng_data.txt", JSON.stringify(writeData, null, '\t'), function(error, stat) {
            if (error) {
                console.log("error: " + error);
            }
            else {
                console.log("file saved with revision " + stat.versionTag);
                thisApp.setState({
                    lastSavedStr: moment().format("LTS")
                });
            }
        });
    },
    loadDB: function() {
        this.setState({lastLoadedStr: "loading"});
        var thisApp = this;
        client.readFile("ginseng_data.txt", function (error, data) {
            if (error) {
                return showError(error);
            }
            var js = JSON.parse(data);
            thisApp.setState({
                infos: js.infos,
                infoTypes: js.infoTypes,
                ginseng_settings: js.settings,
                lastLoadedStr: moment().format("LTS")
            });
        });
    },
    gotoEdit: function(infoIndex){
        this.setState({
            selectedInfoIndex: infoIndex,
            activeMode: "edit"
        })
    },

    onInfoEdit: function(newInfo) {
        var newInfos = this.state.infos.slice();
        newInfos[this.state.selectedInfoIndex] = newInfo;

        //var updIndex = 0;
        //var newInfos = React.addons.update(this.state.infos, {
        //    updIndex: {$set: newInfo}
        //});
        this.setState({
            infos: newInfos,
            activeMode: "browse"
        } );
    },
    onInfoDelete: function(){
        var newInfos = JSON.parse( JSON.stringify( this.state.infos ));
        console.log("ondelete, this.state.selectedInfoIndex: " + this.state.selectedInfoIndex);
        newInfos.splice(this.state.selectedInfoIndex, 1);
        this.setState({
            infos: newInfos,
            activeMode: "browse"
        } );
    },
    addInfo: function(newInfo){
        var newInfo_copy = JSON.parse( JSON.stringify( newInfo ));
        var newInfos = JSON.parse( JSON.stringify( this.state.infos ));
        newInfos.push(newInfo_copy);

        this.setState( {
            infos: newInfos,
            activeMode: "new"
        } );
    },
    onTypesEdit: function(newTypes, changes){
        var newTypes_copy = JSON.parse( JSON.stringify( newTypes ));
        var new_infos = JSON.parse( JSON.stringify( this.state.infos ));

        for (var infoIdx = 0; infoIdx < new_infos.length; ++infoIdx) {
            for (var resizeIdx = 0; resizeIdx < changes.typeResizes.length; ++resizeIdx) {
                if(new_infos[infoIdx].typeID === changes.typeResizes[resizeIdx].id){
                    var fieldNameIndex = changes.typeResizes[resizeIdx].fieldNameIndex;
                    if(fieldNameIndex === -1){
                        new_infos[infoIdx].fields.push("");
                    }else{
                        new_infos[infoIdx].fields.splice(fieldNameIndex, 1);
                    }
                }
            }
        }

        this.setState({
            infoTypes: newTypes_copy,
            infos: new_infos,
            activeMode: "browse"
        });
    },
    applyInterval: function(infoIndex, reviewKey, newInterval){
        var newInfos = JSON.parse( JSON.stringify( this.state.infos ));
        newInfos[infoIndex].reviews[reviewKey].push({
            "reviewTime": moment().format(),
            "dueTime": moment().add(moment.duration(newInterval)).format()
        });
        this.setState({
            infos: newInfos
        });
    },

    editType: function(typeID){
        this.setState({
            activeMode: "types",
            selectedTypeID: typeID
        })
    },
    render: function () {
        //React.addons.Perf.start();

        // get used Tags
        var usedTags = [];
        for (var i = 0; i < this.state.infos.length; ++i) {
            for (var j = 0; j < this.state.infos[i].tags.length; ++j) {
                if(usedTags.indexOf(this.state.infos[i].tags[j]) === -1){
                    usedTags.push( this.state.infos[i].tags[j] );
                }
            }
        }

        // Edit / New
        var compEdit = <div/>;
        if (this.state.activeMode == "new") {
            compEdit = <InfoEdit
                types={this.state.infoTypes}
                usedTags={usedTags}
                onSave={this.addInfo}
                cancelEdit={this.clickNav.bind(this, "browse")}
                editType={this.editType}
            />
        }
        else if (this.state.activeMode == "edit"){
            compEdit = <InfoEdit
                info={this.state.infos[this.state.selectedInfoIndex]}
                onDelete={this.onInfoDelete}

                types={this.state.infoTypes}
                usedTags={usedTags}
                onSave={this.onInfoEdit}
                cancelEdit={this.clickNav.bind(this, "browse")}
                editType={this.editType}
            />
        }

        // Info browser
        var compBrowser = <div/>;
        if(this.state.activeMode === "browse"){
            compBrowser = <InfoBrowser
                infos={this.state.infos}
                types={this.state.infoTypes}
                onRowSelect={this.gotoEdit}
                onNew={this.clickNav.bind(this, "new")}
                selections={this.state.ginseng_selections}
            />
        }

        // Review
        var comp_review = <div/>;
        if(this.state.activeMode === "review") {
            comp_review = <Review
                infos={this.state.infos}
                types={this.state.infoTypes}
                applyInterval={this.applyInterval}
                timeIntervalChoices={this.state.ginseng_settings.timeIntervalChoices}
                gotoEdit={this.gotoEdit}
            />;
        }

        // Types
        var compTypes = false;
        if(this.state.activeMode=="types"){
            compTypes = <InfoTypes
                types={this.state.infoTypes}
                cancelEdit={this.clickNav.bind(this, "browse")}
                onSave={this.onTypesEdit}
                selectedTypeID={this.state.selectedTypeID}
            />;
        }

        //React.addons.Perf.stop();
        //React.addons.Perf.printInclusive();
        return (
            <div className="app">
                <div className="navBar unselectable">
                    <div
                        className={this.state.activeMode == "status" ? "active" : "inactive"}
                        onClick={this.clickNav.bind(this, "status")}>Status
                    </div>
                    <div className={this.state.activeMode === "browse" ? "active" : "inactive" }
                        onClick={this.clickNav.bind(this, "browse")}>Infos
                    </div>
                    <div className={this.state.activeMode == "types" ? "active" : "inactive"}
                        onClick={this.clickNav.bind(this, "types")}>Types
                    </div>
                    <div className={this.state.activeMode == "review" ? "active" : "inactive"}
                        onClick={this.clickNav.bind(this, "review")}>Review
                    </div>
                </div>

                <Status
                    show={this.state.activeMode=="status"}
                    infoCount={this.state.infos.length}
                    dropBoxStatus={this.state.dropBoxStatus}
                    onDBAuth={this.authDB}
                    onDbSave={this.saveDB}
                    lastSavedStr={this.state.lastSavedStr}
                    lastLoadedStr={this.state.lastLoadedStr}
                    onDbLoad={this.loadDB}/>
                {compEdit}
                {compBrowser}
                {compTypes}
                {comp_review}

            </div>);
            }
});

var Status = React.createClass({
    render: function() {
        if(this.props.show) {
//            var blob = new Blob([JSON.stringify(this.props.gData, null, '\t')], {type: "application/json"});
//            var url  = URL.createObjectURL(blob);
////...
//            <a download="ginseng.json" href={url}>download JSON</a>

            var loadButtonClassName, saveButtonClassName;
            loadButtonClassName = saveButtonClassName = "button";
            if(this.props.dropBoxStatus === "logged in!"){
                loadButtonClassName += " invisible;";
                saveButtonClassName += " invisible;"
            }
            if(this.props.lastLoadedStr === "loading"){
                loadButtonClassName += " disabled";
            }
            if(this.props.lastSavedStr === "loading"){
                saveButtonClassName += " disabled";
            }
            return (
                <div className="Status Component">
                    <div>Infos loaded: {this.props.lastLoadedStr === "loading"?"loading":this.props.infoCount}</div>
                    <div>Dropbox Status: {this.props.dropBoxStatus}</div>
                    <div>Last save: {this.props.lastSavedStr}</div>
                    <div>Last load: {this.props.lastLoadedStr}</div>

                    <div className={"flexContHoriz"}>
                        <button
                            className={"button buttonGood "+(this.props.dropBoxStatus === "logged in!"?"disabled":"")}
                            onClick={this.props.onDBAuth}>auth Dropbox</button>
                        <button
                            className={loadButtonClassName}
                            onClick={this.props.onDbLoad}>load from Dropbox</button>
                        <button
                            className={saveButtonClassName}
                            onClick={this.props.onDbSave}>save to Dropbox</button>
                    </div>
                </div>
            )
        } else{
            return(<div className="Status Component"></div>)
        }
    }
});

React.render(
    <App />, document.getElementById('content')
);