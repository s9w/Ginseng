var client = new Dropbox.Client({ key: "ob9346e5yc509q2" });
//client.authDriver(new Dropbox.AuthDriver.Popup({receiverUrl: "https://s9w.github.io/ginseng/dropbox_receiver.html"}));
client.authDriver(new Dropbox.AuthDriver.Popup({receiverUrl: "https://leastaction.org/ginseng/dropbox_receiver.html"}));

var App = React.createClass({
    getInitialState: function() {
        return {
            ginseng_infos:[],
            ginseng_infoTypes:[{
                "name": "Front and back",
                "fieldNames": ["front", "back"],
                "views": [
                    {
                        "front": "Hier ist front: {front}",
                        "back": "Hier ist back: {back}. Und hier noch **bold** uuh\nund nächste zeile",
                        "condition": ""
                    },
                    {
                        "front": "Und andersrum. Hier ist back: {back}",
                        "back": "Hier ist front: {front}. Und hier noch **bold** uuh\nund nächste zeile",
                        "condition": "tag: reverse"
                    }
                ]
            }],
            ginseng_settings:{
                lastInfoType: "Front and back"
            },
            "intervalModifiers": {
                "set_dueTime":{
                    "parameters": ["time"]
                },
                "setInterval": {
                    "parameters": ["months", "weeks", "days", "hours", "minutes"]
                },
                "modIntervalRelative": {
                    "parameters": ["percent"]
                },
                "modIntervalAbsolutely": {
                    "parameters": ["months", "weeks", "days", "hours", "minutes"]
                }
            },
            activeMode: "status",
            selectedInfoIndex: 0,
            usedTags: [],
            dropBoxStatus: "off",
            lastSaved: "never"
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
            else
                thisApp.setState({dropBoxStatus: "logged in!"});
        });
    },
    saveDB: function(){
        var thisApp = this;
        var writeData = {
            infos: this.state.ginseng_infos,
            infoTypes: this.state.ginseng_infoTypes,
            settings: this.state.ginseng_settings
        };
        client.writeFile("ginseng_data.txt", JSON.stringify(writeData, null, '\t'), function(error, stat) {
            if (error) {
                console.log("error: " + error);
            }
            else {
                console.log("file saved with revision " + stat.versionTag);
                thisApp.setState({lastSaved: moment().format("LT")});
            }
        });
    },
    loadDB: function() {
        var thisApp = this;
        client.readFile("ginseng_data.txt", function (error, data) {
            if (error) {
                return showError(error);  // Something went wrong.
            }
            var js = JSON.parse(data);
            thisApp.setState({
                ginseng_infos: js.infos,
                ginseng_infoTypes: js.infoTypes,
                ginseng_settings: js.settings
            });
            thisApp.updateUsedTags(js.infos);
        });
    },
    getSortedInfos: function(infos, sortField){
        // Sort infos based on value of first entry.
        var infos_sorted = JSON.parse( JSON.stringify( infos ));
        infos_sorted = infos_sorted.sort(function(a, b){
            return a.fields[0].localeCompare(b.fields[0])
        });
        return infos_sorted;
    },
    updateUsedTags: function(infos){
        var newUsedTagsObj = {};
        for (var i = 0; i < infos.length; ++i) {
            for (var j = 0; j < infos[i].tags.length; ++j) {
                newUsedTagsObj[infos[i].tags[j]] = 1;
            }
        }
        var newUsedTags = [];
        for(key in newUsedTagsObj){
            newUsedTags.push(key);
        }
        this.setState({usedTags: newUsedTags});
    },
    //loadDefault: function(){
    //    this.setState( {
    //        ginseng_infos: this.getSortedInfos(init_data.infos),
    //        ginseng_infoTypes: init_data.infoTypes,
    //        ginseng_selections: init_data.selections,
    //        ginseng_settings: init_data.settings
    //    });
    //    this.updateUsedTags(init_data.infos); // not fast enough if called on own state. setstate too slow :(
    //},
    onRowSelect: function(index_selected) {
        console.log("selected row " + index_selected);
        this.setState({
            selectedInfoIndex: index_selected,
            activeMode: "edit"
        });
    },


    onInfoEdit: function(newData, newTags, newTypeIndex) {
        var newInfos = JSON.parse( JSON.stringify( this.state.ginseng_infos ));
        newInfos[this.state.selectedInfoIndex].fields = newData;
        newInfos[this.state.selectedInfoIndex].tags = newTags;
        newInfos[this.state.selectedInfoIndex].type = this.state.ginseng_infoTypes[newTypeIndex].name;
        this.setState({
            ginseng_infos: newInfos,
            activeMode: "browse"
        } );
        this.updateUsedTags(newInfos); // not fast enough if called on own state. setstate too slow :(
    },
    onInfoDelete: function(){
        var newInfos = JSON.parse( JSON.stringify( this.state.ginseng_infos ));
        console.log("ondelete, this.state.selectedInfoIndex: " + this.state.selectedInfoIndex);
        newInfos.splice(this.state.selectedInfoIndex, 1);
        this.setState({
            ginseng_infos: newInfos,
            activeMode: "browse"
        } );
    },
    addInfo: function(newFields, newTags, newTypeIndex){
        console.log("addInfo. fields: " + newFields + ", tags: " + newTags);
        var newInfo = this.getSanitizedInfo({
            type: this.state.ginseng_infoTypes[newTypeIndex].name,
            fields: newFields,
            tags: newTags
        }, newTypeIndex);

        var newInfos = JSON.parse( JSON.stringify( this.state.ginseng_infos ));
        newInfos.push(newInfo);

        var new_settings = JSON.parse( JSON.stringify( this.state.ginseng_settings ));
        new_settings.lastInfoType = this.state.ginseng_infoTypes[newTypeIndex].name;
        this.setState( {
            ginseng_infos: newInfos,
            ginseng_settings: new_settings,
            activeMode: "browse"
        } );
        this.updateUsedTags(newInfos); // not fast enough if called on own state. setstate too slow :(
    },
    onNew: function(){
        this.setState({activeMode: "new"})
    },
    cancelEdit: function() {
        this.setState({
            activeMode: "browse"
        } );
    },
    getSanitizedInfo: function(info, typeIndex){
        var newInfo = JSON.parse( JSON.stringify( info ));
        if(!("creationDate" in newInfo)) {
            newInfo.creationDate = moment().format();
        }
        if(!("reviews" in newInfo)){
            var reviews = [];
            for (var index = 0; index < this.state.ginseng_infoTypes[typeIndex].fieldNames.length; ++index) {
                reviews.push([]);
            }
            newInfo.reviews = reviews;
        }
        return newInfo;
    },

    onTypesEdit: function(newTypes){
        this.setState({ginseng_infoTypes: newTypes} );
    },
    onTypeResize: function(typeIndex, fieldNameIndex){
        var new_infos = JSON.parse( JSON.stringify( this.state.ginseng_infos ));
        console.log("resizing");
        for (var index = 0; index < new_infos.length; ++index) {
            if(new_infos[index].type === this.state.ginseng_infoTypes[typeIndex].name){
                if(fieldNameIndex === -1){
                    new_infos[index].fields.push("");
                }else{
                    new_infos[index].fields.splice(fieldNameIndex, 1);
                }
            }
        }
        var new_types = JSON.parse( JSON.stringify( this.state.ginseng_infoTypes ));
        if(fieldNameIndex === -1){
            new_types[typeIndex].fieldNames.push("");
        }else{
            new_types[typeIndex].fieldNames.splice(fieldNameIndex, 1);
        }

        this.setState({
            ginseng_infos: new_infos,
            ginseng_infoTypes: new_types
        });
    },
    onTypeFieldnameEdit: function(typeIndex, fieldNameIndex, newFieldName){
        var newInfoTypes = JSON.parse( JSON.stringify( this.state.ginseng_infoTypes ));
        newInfoTypes[typeIndex].fieldNames[fieldNameIndex] = newFieldName;
        this.setState({ginseng_infoTypes: newInfoTypes} );
    },
    onTypeNameEdit: function(typeIndex, newTypeName){
        for (var index = 0; index < this.state.ginseng_infos.length; ++index) {
            if(this.state.ginseng_infos[index].type === this.state.ginseng_infoTypes[typeIndex].name){
                this.state.ginseng_infos[index].type = newTypeName;
            }
        }
        var newInfoTypes = JSON.parse( JSON.stringify( this.state.ginseng_infoTypes ));
        newInfoTypes[typeIndex].name = newTypeName;
        this.setState({ginseng_infoTypes: newInfoTypes} );
    },
    render: function () {
        var iTypeIdxLookup = {};
        for (var index = 0; index < this.state.ginseng_infoTypes.length; ++index) {
            iTypeIdxLookup[this.state.ginseng_infoTypes[index].name] = index;
        }

        var comp_new = <div/>;
        var comp_edit = <div/>;

        if(["new", "edit"].indexOf(this.state.activeMode) !== -1){
            var default_iType_index, editInfo, onSave, onDelete;
            if (this.state.activeMode == "new") {
                default_iType_index = iTypeIdxLookup[this.state.ginseng_settings.lastInfoType];
                editInfo = {tags: [], fields: []};
                onSave = this.addInfo;
                onDelete = false;
            }
            else {
                default_iType_index = iTypeIdxLookup[ this.state.ginseng_infos[this.state.selectedInfoIndex].type ];
                editInfo = this.state.ginseng_infos[this.state.selectedInfoIndex];
                onSave = this.onInfoEdit;
                onDelete = this.onInfoDelete;
            }
            comp_new = <InfoEdit info_types={this.state.ginseng_infoTypes} info={editInfo} usedTags={this.state.usedTags}
                default_iType_index={default_iType_index} onSave={onSave} cancelEdit={this.cancelEdit} onDelete={onDelete} />
        }
        var comp_review = <div/>;
        if(this.state.activeMode === "review")
            comp_review = <Review
                infos={this.state.ginseng_infos}
                info_types={this.state.ginseng_infoTypes}
                iTypeIdxLookup={iTypeIdxLookup}
            />;

        // Info-nav string
        var var_browse_el;
        if(this.state.activeMode=="edit")
            var_browse_el = <span className="navInfoStr">Infos: Edit</span>;
        else if(this.state.activeMode=="new")
            var_browse_el = <span className="navInfoStr">Infos: New</span>;
        else
            var_browse_el = <span className="navInfoStr">Infos</span>;

        return (
            <div className="app">
                <div className="nav-site">
                    <span className={this.state.activeMode=="status"?"active":"inactive"}>
                        <span onClick={this.clickNav.bind(this, "status")}>Status</span></span>
                    <span className={ ["browse", "edit", "new"].indexOf(this.state.activeMode) !== -1?"active":"inactive" }
                        onClick={this.clickNav.bind(this, "browse")}>{var_browse_el}</span>
                    <span className={this.state.activeMode=="types"? "active":"inactive"}>
                        <span onClick={this.clickNav.bind(this, "types" )}>Types</span> </span>
                    <span className={this.state.activeMode=="review"? "active":"inactive"}>
                        <span onClick={this.clickNav.bind(this, "review" )}>Review</span> </span>
                </div>

                {comp_new}
                {comp_edit}
                <Status      show={this.state.activeMode=="status"}
                    infoCount={this.state.ginseng_infos.length} dropBoxStatus={this.state.dropBoxStatus} onDBAuth={this.authDB}
                    onDbSave={this.saveDB} lastSaved={this.state.lastSaved} onDbLoad={this.loadDB}/>
                <InfoBrowser show={this.state.activeMode=="browse"} infos={this.state.ginseng_infos}
                    onRowSelect={this.onRowSelect} onNew={this.onNew} selections={this.state.ginseng_selections} />
                <InfoTypes   show={this.state.activeMode=="types"} info_types={this.state.ginseng_infoTypes}
                    onFieldNameEdit={this.onTypeFieldnameEdit} onNameEdit={this.onTypeNameEdit}
                    onEdit={this.onTypesEdit} onResize={this.onTypeResize}/>
                {comp_review}

            </div>);}
});

var Status = React.createClass({
    render: function() {
        if(this.props.show) {
//            var blob = new Blob([JSON.stringify(this.props.gData, null, '\t')], {type: "application/json"});
//            var url  = URL.createObjectURL(blob);
////...
//            <a download="ginseng.json" href={url}>download JSON</a>

            return (
                <div className="Status Component">
                    <div>Infos loaded: {this.props.infoCount}</div>
                    <div>Dropbox Status: {this.props.dropBoxStatus}</div>
                    <div>Last save: {this.props.lastSaved}</div>

                    <div>
                        <button disabled={this.props.dropBoxStatus==="logged in!"?"invisible":""} onClick={this.props.onDBAuth}>auth Dropbox</button>
                    </div>
                    <div>
                        <button disabled={this.props.dropBoxStatus!=="logged in!"} onClick={this.props.onDbLoad}>load from Dropbox</button>
                        <button disabled={this.props.dropBoxStatus!=="logged in!"} onClick={this.props.onDbSave}>save to Dropbox</button>
                    </div>
                </div>
            ) } else{
            return(
                <div className="Status Component"></div>
        )} } });


React.render(
    <App />, document.getElementById('content')
);