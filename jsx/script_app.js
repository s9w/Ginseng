var client = new Dropbox.Client({ key: "ob9346e5yc509q2" });
client.authDriver(new Dropbox.AuthDriver.Popup({receiverUrl: "https://s9w.github.io/ginseng/dropbox_receiver.html"}));
//client.authDriver(new Dropbox.AuthDriver.Popup({receiverUrl: "https://leastaction.org/ginseng/dropbox_receiver.html"}));


var App = React.createClass({
    getInitialState() {
        return {
            infos: init_data.infos,
            infoTypes: init_data.infoTypes,
            settings: init_data.settings,
            meta: init_data.meta,
            activeMode: "status",
            selectedInfoIndex: false,
            reviewProfiles: init_data.reviewProfiles,

            dropBoxStatus: "initial",
            lastLoadedStr: "never",
            isChanged: false
        };
    },
    clickNav(mode) {
        this.setState({activeMode: mode});
    },
    authDB(){
        this.setState({dropBoxStatus: "logging in..."});
        var thisApp = this;
        client.authenticate(function (error) {
            if (error) {
                thisApp.setState({dropBoxStatus: "ERROR"});
            }
            else {
                thisApp.setState({dropBoxStatus: "loggedIn"});
            }
        });
    },
    saveDB(){
        this.setState({
            dropBoxStatus: "saving"
        });
        var thisApp = this;
        var newMeta = JSON.parse( JSON.stringify( this.state.meta));
        newMeta.lastSaved = moment().format();
        var writeInfos = JSON.parse( JSON.stringify( this.state.infos));
        for(var i=0; i<writeInfos.length; i++){
            var info = writeInfos[i];
            for(var reviewKey in info.reviews)
            if(info.reviews[reviewKey].length > this.state.settings.reviewHistoryLength){
                info.reviews[reviewKey] = info.reviews[reviewKey].slice(-2);
            }
        }
        var writeDataObj = {
            infos: writeInfos,
            infoTypes: this.state.infoTypes,
            reviewProfiles: this.state.reviewProfiles,
            settings: this.state.settings,
            meta: newMeta
        };
        var writeDataString;
        if(this.state.settings.useCompression){
            writeDataString = LZString.compressToUTF16 (JSON.stringify(writeDataObj));
        }else{
            writeDataString = JSON.stringify(writeDataObj, null, '\t');
        }
        client.writeFile("ginseng_data.txt", writeDataString, function(error) {
            if (error) {
                console.log("error: " + error);
            }
            thisApp.setState({
                meta: newMeta,
                dropBoxStatus: "loggedIn",
                isChanged: false
            });
        });
    },
    loadDB() {
        this.setState({dropBoxStatus: "loading"});
        var thisApp = this;
        client.readFile("ginseng_data.txt", function (error, data) {
            if (error) {
                console.log("ERROR: " + error);
            }
            var parsedData;
            try{
                parsedData = JSON.parse(data);
            }catch(e){
                parsedData = JSON.parse(LZString.decompressFromUTF16(data));
            }

            thisApp.setState({
                infos: parsedData.infos,
                infoTypes: parsedData.infoTypes,
                settings: _(thisApp.state.settings).extend(parsedData.settings).value(),
                reviewProfiles: parsedData.reviewProfiles || thisApp.state.reviewProfiles,
                meta: parsedData.meta,
                lastLoadedStr: moment().format(),
                dropBoxStatus: "loggedIn",
                isChanged: false
            });
        });
    },
    gotoEdit(infoIndex){
        this.setState({
            selectedInfoIndex: infoIndex,
            activeMode: "edit"
        })
    },
    onInfoEdit(newInfo) {
        var newInfos = this.state.infos.slice();
        if(this.state.activeMode === "edit") {
            newInfos[this.state.selectedInfoIndex] = newInfo;
        }else{
            newInfos.push(newInfo);
        }
        this.setState({
            infos: newInfos,
            activeMode: "browse",
            isChanged: true
        } );
    },
    onInfoDelete(){
        var newInfos = JSON.parse( JSON.stringify( this.state.infos ));
        console.log("ondelete, this.state.selectedInfoIndex: " + this.state.selectedInfoIndex);
        newInfos.splice(this.state.selectedInfoIndex, 1);
        this.setState({
            infos: newInfos,
            activeMode: "browse"
        } );
    },
    onTypesEdit(newTypes, changes){
        var newTypes_copy = JSON.parse( JSON.stringify( newTypes ));
        var new_infos = JSON.parse( JSON.stringify( this.state.infos ));

        for (var infoIdx = 0; infoIdx < new_infos.length; ++infoIdx) {
            for (var resizeIdx = 0; resizeIdx < changes.typeResizes.length; ++resizeIdx) {
                if(new_infos[infoIdx].typeID === changes.typeResizes[resizeIdx].id){
                    var fieldNameIndex = changes.typeResizes[resizeIdx].fieldNameIndex;
                    if(fieldNameIndex === "add"){
                        new_infos[infoIdx].entries.push("");
                    }else{
                        new_infos[infoIdx].entries.splice(fieldNameIndex, 1);
                    }
                }
            }
        }

        this.setState({
            infoTypes: newTypes_copy,
            infos: new_infos,
            isChanged: true
        });
    },
    applyInterval(infoIndex, reviewKey, newInterval){
        var newInfos = JSON.parse( JSON.stringify( this.state.infos ));
        newInfos[infoIndex].reviews[reviewKey].push({
            "reviewTime": moment().format(),
            "dueTime": moment().add(moment.duration(newInterval)).format()
        });
        this.setState({
            infos: newInfos,
            isChanged: true
        });
    },
    getNewInfo(){
        var firstTypeID = _.min(_.keys(this.state.infoTypes));
        var entries = _.times(this.state.infoTypes[firstTypeID].entryNames.length, function(){return ""});
        var reviews = {};
        for (let i = 0; i < this.state.infoTypes[firstTypeID].entryNames.length; ++i) {
            reviews[i] = [];
        }
        return {
            typeID: firstTypeID,
            entries: entries,
            reviews: reviews,
            tags: [],
            creationDate: moment().format()
        }
    },
    updateGeneric(name, value){
        var newState = {
            isChanged: true
        };
        newState[name] = value;
        this.setState(newState);
    },
    render: function () {
        return (
            <div className="app">
                <NavBar
                    activeMode={this.state.activeMode}
                    isChanged={this.state.isChanged}
                    clickNav={this.clickNav}
                />
                {this.state.activeMode === "status" &&
                    <Status
                        infoCount={this.state.infos.length}
                        dropBoxStatus={this.state.dropBoxStatus}
                        onDBAuth={this.authDB}
                        onDbSave={this.saveDB}
                        meta={this.state.meta}
                        lastLoadedStr={this.state.lastLoadedStr}
                        onDbLoad={this.loadDB}
                        isChanged={this.state.isChanged}
                    />
                }

                {this.state.activeMode === "settings" &&
                    <Settings
                        settings={this.state.settings}
                        updateSettings={this.updateGeneric.bind(this, "settings")}
                    />
                }

                {_.contains(["new", "edit"], this.state.activeMode) &&
                    <InfoEdit
                        info={this.state.activeMode === "new"?this.getNewInfo():this.state.infos[this.state.selectedInfoIndex]}
                        onDelete={this.state.activeMode === "edit"?this.onInfoDelete:false}
                        types={this.state.infoTypes}
                        usedTags={_(this.state.infos).pluck('tags').flatten().union().value()}
                        onSave={this.onInfoEdit}
                        cancelEdit={this.clickNav.bind(this, "browse")}
                    />
                }

                {this.state.activeMode === "browse" &&
                    <InfoBrowser
                        infos={this.state.infos}
                        types={this.state.infoTypes}
                        onRowSelect={this.gotoEdit}
                        onNew={this.clickNav.bind(this, "new")}
                        selections={this.state.ginseng_selections}
                    />
                }

                {this.state.activeMode==="types" &&
                    <InfoTypes
                        types={this.state.infoTypes}
                        cancelEdit={this.clickNav.bind(this, "browse")}
                        onSave={this.onTypesEdit}
                    />
                }

                {this.state.activeMode === "profiles" &&
                    <Profiles
                        reviewProfiles={this.state.reviewProfiles}
                        updateProfiles={this.updateGeneric.bind(this, "reviewProfiles")}
                        onCancel={this.clickNav.bind(this, "browse")}
                    />
                }

                { this.state.activeMode === "review" &&
                    <Review
                        infos={this.state.infos}
                        types={this.state.infoTypes}
                        applyInterval={this.applyInterval}
                        timeIntervalChoices={this.state.settings.timeIntervalChoices}
                        gotoEdit={this.gotoEdit}
                        profiles={this.state.reviewProfiles}
                    />
                }

            </div>
        );
    }
});

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
                <div className="flexContHoriz" >
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
                <div>Infos loaded: {this.props.dropBoxStatus === "loading"?"loading":this.props.infoCount}</div>
                <div>{"Last save: " + lastSavedStr}</div>
                <div>{"Last load: " + lastLoadedStr}</div>

                <div className={"flexContHoriz"}>
                    <button
                        disabled={this.props.dropBoxStatus !== "initial"}
                        className="buttonGood"
                        onClick={this.props.onDBAuth}>Log into Dropbox</button>
                    <button
                        disabled={this.props.dropBoxStatus !== "loggedIn"}
                        onClick={this.props.onDbLoad}>Load from Dropbox</button>
                    <button
                        disabled={this.props.dropBoxStatus !== "loggedIn" || !this.props.isChanged}
                        onClick={this.onSaveClick}>Save to Dropbox</button>
                </div>
            </div>
        )
    }
});


var Editor = React.createClass({
    onChange(event){
        var newDict = _.pick(this.props.path, _.pluck(this.props.objects, "key"));
        newDict[event.target.name] = event.target.value;
        this.props.onUpdate(newDict);
    },
    render() {
        var innerHtml;
        var thisOuter = this;
        return (
            <div>
                {this.props.objects.map(function (object) {
                    if (object.displayType === "label") {
                        innerHtml = <span>{thisOuter.props.path[object.key]}</span>;
                    } else if (object.displayType === "input") {
                        innerHtml = <input
                            type="text"
                            name={object.key}
                            onChange={thisOuter.onChange}
                            value={thisOuter.props.path[object.key]}
                            placeholder={object.placeholder}
                        />
                    }
                    return (
                        <section key={object.key}>
                            <h3>{object.displayName}</h3>
                            {innerHtml}
                        </section>
                    );

                })}
            </div>
        )
    }
});

React.render(
    <App />, document.getElementById('content')
);