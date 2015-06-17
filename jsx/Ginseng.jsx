var client = new Dropbox.Client({ key: "ob9346e5yc509q2" });
client.authDriver(new Dropbox.AuthDriver.Popup({receiverUrl: "https://s9w.github.io/dropbox_receiver.html"}));

//var React = require('react')
var DictSelector = require('./DictSelector.jsx');
var Guessing = require('./Guessing.jsx');
var InfoBrowser = require('./InfoBrowser.jsx');
var InfoEdit = require('./InfoEdit.jsx');
var InfoTypes = require('./InfoTypes.jsx');
var NavBar = require('./NavBar.jsx');
var Profiles = require('./Profiles.jsx');
var ReviewInterface = require('./ReviewInterface.jsx');
var Status = require('./Status.jsx');
var Settings = require('./Settings.jsx');

var helpers = require('./helpers.jsx');
var filterInfo = helpers.filterInfo;


var Ginseng = React.createClass({
    getInitialState() {
        return {
            infos: this.getPrecompInfos(init_data.infos, init_data.infoTypes, init_data.reviewProfiles),
            infoTypes: init_data.infoTypes,
            settings: init_data.settings,
            reviewProfiles: init_data.reviewProfiles,
            meta: init_data.meta,

            activeMode: "status",
            selectedInfoIndex: false,

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
            }else {
                thisApp.setState({dropBoxStatus: "loggedIn"});
            }
        });
    },
    getWriteDate(useCompression=true){
        var newMeta = _.clone(this.state.meta);
        newMeta.lastSaved = moment().format();
        var writeInfos = this.state.infos.slice();

        // Cut off old review data + precomputed values
        for(var i=0; i<writeInfos.length; i++){
            var infoReviews = writeInfos[i].reviews;
            for(var reviewKey in infoReviews) {
                if (infoReviews[reviewKey].length > this.state.settings.reviewHistoryLength) {
                    infoReviews[reviewKey] = infoReviews[reviewKey].slice(-this.state.settings.reviewHistoryLength);
                }
            }
            writeInfos[i] = _.omit(writeInfos[i], "templateConditions", "profileConditions", "plannedIntervals");
        }
        var writeDataObj = {
            infos: writeInfos,
            infoTypes: this.state.infoTypes,
            reviewProfiles: this.state.reviewProfiles,
            settings: this.state.settings,
            meta: newMeta
        };
        var writeDataString;
        if(useCompression){
            writeDataString = LZString.compressToUTF16(JSON.stringify(writeDataObj));
        }else{
            writeDataString = JSON.stringify(writeDataObj, null, '\t');
        }
        return writeDataString;
    },
    saveLocalStorage(){
        var writeDataString = this.getWriteDate();
        localStorage.setItem("ginseng_data", writeDataString);
        var newMeta = _.clone( this.state.meta);
        newMeta.lastSaved = moment().format();
        this.setState({
            meta: newMeta,
            isChanged: false
        });
    },
    loadLocalStorage(){
        var parsedData;
        try{
            parsedData = JSON.parse(localStorage.getItem('ginseng_data'));
        }catch(e){
            parsedData = JSON.parse(LZString.decompressFromUTF16(localStorage.getItem('ginseng_data')));
        }
        this.setState({
            infos: this.getPrecompInfos(parsedData.infos, parsedData.infoTypes, parsedData.reviewProfiles || this.state.reviewProfiles),
            infoTypes: parsedData.infoTypes,
            settings: _(this.state.settings).extend(parsedData.settings).value(),
            reviewProfiles: parsedData.reviewProfiles || this.state.reviewProfiles,
            meta: parsedData.meta,
            isChanged: false
        });
    },
    getPrecompInfo(info, types=this.state.infoTypes, profiles=this.state.reviewProfiles){
        var typeName = types[info.typeID].name;
        info["templateConditions"] = _.mapValues(types[info.typeID].templates, templ => filterInfo(templ.condition, info, typeName));
        info["profileConditions"] = _.mapValues(profiles, profile => filterInfo(profile.condition, info, typeName));
        info["plannedIntervals"] = _.mapValues(info.reviews,
            review => {
                if(review.length > 0){
                    var lastReview = _.last(review);
                    return moment(lastReview.dueTime).diff(moment(lastReview.reviewTime));
                }
            }
        );
        return info;
    },
    getPrecompInfos(infos, types=this.state.infoTypes, profiles=this.state.reviewProfiles){
        var newInfos = infos.slice();
        for (var i=0; i < newInfos.length; i++) {
            var info = newInfos[i];
            var typeName = types[info.typeID].name;
            info["templateConditions"] = _.mapValues(types[info.typeID].templates, templ => filterInfo(templ.condition, info, typeName));
            info["profileConditions"] = _.mapValues(profiles, profile => filterInfo(profile.condition, info, typeName));
            info["plannedIntervals"] = _.mapValues(info.reviews,
                review => {
                    if(review.length > 0){
                        var lastReview = _.last(review);
                        return moment(lastReview.dueTime).diff(moment(lastReview.reviewTime));
                    }
                }
            );
        }
        return newInfos;
    },
    saveDB(){
        this.setState({
            dropBoxStatus: "saving"
        });
        var writeDataString = this.getWriteDate(this.state.settings.useCompression);
        var newMeta = _.clone( this.state.meta);
        newMeta.lastSaved = moment().format();
        client.writeFile("ginseng_data.txt", writeDataString, error => {
            if (error) {
                console.log("Dropbox write error: " + error);
            }
            this.setState({
                meta: newMeta,
                dropBoxStatus: "loggedIn",
                isChanged: false
            });
        });
    },
    loadDB() {
        this.setState({dropBoxStatus: "loading"});
        client.readFile("ginseng_data.txt", (error, data) => {
            if (error) {
                console.log("Dropbox load error: " + error);
            }
            var parsedData;
            try{
                parsedData = JSON.parse(data);
            }catch(e){
                parsedData = JSON.parse(LZString.decompressFromUTF16(data));
            }

            this.setState({
                infos: this.getPrecompInfos(parsedData.infos, parsedData.infoTypes, parsedData.reviewProfiles || this.state.reviewProfiles),
                infoTypes: parsedData.infoTypes,
                settings: _(this.state.settings).extend(parsedData.settings).value(),
                reviewProfiles: parsedData.reviewProfiles || this.state.reviewProfiles,
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
            newInfos[this.state.selectedInfoIndex] = this.getPrecompInfo(newInfo);
        }else{ // new
            newInfos.push(this.getPrecompInfo(newInfo));
        }
        this.setState({
            infos: newInfos,
            activeMode: "browse",
            isChanged: true
        } );
    },
    onInfoDelete(){
        var newInfos = this.state.infos.slice();
        newInfos.splice(this.state.selectedInfoIndex, 1);
        this.setState({
            infos: newInfos,
            activeMode: "browse"
        } );
    },
    onTypesEdit(types, typeChanges){
        var newTypes = _.clone( types );
        var newInfos = this.state.infos.slice();

        if(_.keys(typeChanges).length >= 0){
            for (var infoIdx = 0; infoIdx < newInfos.length; ++infoIdx) {
                var typeID = newInfos[infoIdx].typeID;
                if(typeID in typeChanges){
                    if("entryLengthDiff" in typeChanges[typeID]){
                        if(typeChanges[typeID].entryLengthDiff > 0){
                            newInfos[infoIdx].entries = newInfos[infoIdx].entries.concat(_.times(typeChanges[typeID].entryLengthDiff, x=>""));
                        }else{
                            newInfos[infoIdx].entries.splice(newInfos[infoIdx].entries.length - Math.abs(typeChanges[typeID].entryLengthDiff), Math.abs(typeChanges[typeID].entryLengthDiff));
                        }
                    }
                    if("reviewDiff" in typeChanges[typeID]){
                        if(typeChanges[typeID].reviewDiff > 0){
                            newInfos[infoIdx].reviews = _(newTypes[typeID].templates).mapValues(x=> []).extend(newInfos[infoIdx].reviews).value();
                        }
                        else{
                            newInfos[infoIdx].reviews = _.pick(newInfos[infoIdx].reviews, _.intersection(_.keys(newInfos[infoIdx].reviews), _.keys(newTypes[typeID].templates)));
                        }
                    }
                }
            }
        }

        this.setState({
            infoTypes: newTypes,
            infos: this.getPrecompInfos(newInfos),
            isChanged: true
        });
    },
    applyInterval(infoIndex, reviewKey, newInterval){
        var newInfos = this.state.infos.slice();
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
        return {
            typeID: firstTypeID,
            entries: _.times(this.state.infoTypes[firstTypeID].entryNames.length, function(){return ""}),
            reviews: _(this.state.infoTypes[firstTypeID].templates).mapValues(template => []).value(),
            tags: [],
            creationDate: moment().format()
        }
    },
    updateGeneric(stateKey, stateValue){
        var newState = {
            isChanged: true
        };
        if(stateKey==="reviewProfiles"){
            newState["infos"] = this.getPrecompInfos(this.state.infos.slice(), this.state.infoTypes, stateValue);
        }
        newState[stateKey] = stateValue;
        this.setState(newState);
    },
    render: function () {
        var infosPerType = _(this.state.infoTypes).mapValues(type => 0).value();
        for(let i=0; i<this.state.infos.length; i++){
            infosPerType[this.state.infos[i].typeID] += 1;
        }

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
                        onLocalSave={this.saveLocalStorage}
                        onLocalLoad={localStorage.getItem('ginseng_data')?this.loadLocalStorage:false}
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
                        usedTags={_(this.state.infos).pluck('tags').flatten().union().value()}
                    />
                }

                {this.state.activeMode==="types" &&
                    <InfoTypes
                        types={this.state.infoTypes}
                        cancelEdit={this.clickNav.bind(this, "browse")}
                        onSave={this.onTypesEdit}
                        infosPerType={infosPerType}
                        infoCount={this.state.infos.length}
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
                    <ReviewInterface
                        infos={this.state.infos}
                        types={this.state.infoTypes}
                        applyInterval={this.applyInterval}
                        timeIntervalChoices={this.state.settings.timeIntervalChoices}
                        gotoEdit={this.gotoEdit}
                        profiles={this.state.reviewProfiles}
                        useGuess={this.state.settings.useGuess}
                        rememberModType={this.state.settings.rememberModType}
                    />
                }

            </div>
        );
    }
});


React.render(
    <Ginseng />, document.getElementById('content')
);
