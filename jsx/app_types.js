var InfoTypes = React.createClass({
    getInitialState: function() {
        var firstTypeID = 0;
        while(!(firstTypeID in this.props.infoTypes)){
            firstTypeID++;
        }
        return {
            selectedTypeID: firstTypeID.toString(),
            newInfoTypes: this.props.infoTypes,
            changes: {
                "renames": "",
                "typeResizes": []
            },
            mode: "main"
        };
    },
    onFieldNameEdit: function(fieldNameIndex, event) {
        var newTypes = JSON.parse( JSON.stringify( this.state.newInfoTypes ));
        newTypes[this.state.selectedTypeID].fieldNames[fieldNameIndex] = event.target.value;
        var newchanges = JSON.parse( JSON.stringify( this.state.changes ));
        newchanges.renames = "renamed";
        this.setState({
            newInfoTypes: newTypes,
            changes: newchanges
        });
    },
    selectType: function(newID){
        this.setState({selectedTypeID: newID});
    },
    onNameEdit: function(event) {
        var newTypes = JSON.parse( JSON.stringify( this.state.newInfoTypes ));
        newTypes[this.state.selectedTypeID].name = event.target.value;
        var newchanges = JSON.parse( JSON.stringify( this.state.changes ));
        newchanges.renames = "renamed";
        this.setState({
            newInfoTypes: newTypes,
            changes: newchanges
        });
    },
    onFieldsResize: function(fieldNameIndex){
        // resize the type
        var newTypes = JSON.parse( JSON.stringify( this.state.newInfoTypes ));
        if(fieldNameIndex === -1){
            newTypes[this.state.selectedTypeID].fieldNames.push("");
        }else{
            newTypes[this.state.selectedTypeID].fieldNames.splice(fieldNameIndex, 1);
        }

        // set changes
        var newchanges = JSON.parse( JSON.stringify( this.state.changes ));
        newchanges.typeResizes.push( {id: this.state.selectedTypeID, fieldNameIndex: fieldNameIndex} );

        this.setState({
            newInfoTypes: newTypes,
            changes: newchanges
        });
    },
    onSave: function(){
        this.props.onSave(this.state.newInfoTypes, this.state.changes);
    },
    onAddType: function(){
        var new_infoTypes = JSON.parse( JSON.stringify( this.state.newInfoTypes ));
        // get next type ID
        var nextTypeID = 0;
        while(nextTypeID.toString() in new_infoTypes){
            nextTypeID++;
        }
        nextTypeID = nextTypeID.toString();
        console.log("nextTypeID: " + nextTypeID);

        new_infoTypes[nextTypeID] = {
            "name": "new info type",
            "fieldNames": ["first field", "second field"],
            "views": {
                "0": {
                    "front": "{front}",
                    "back": "{back}",
                    "condition": ""
                },
                "1": {
                    "front": "{back}",
                    "back": "{front}",
                    "condition": "tag: reverse"
                }
            }
        };
        this.setState({newInfoTypes: new_infoTypes});
    },
    setMode: function(modeStr){
        this.setState({mode: modeStr});
    },
    onViewChange: function(type, newContent){
        var new_infoTypes = JSON.parse( JSON.stringify( this.state.newInfoTypes ));
        new_infoTypes[this.state.selectedTypeID].views[this.state.mode][type] = newContent;
        this.setState({newInfoTypes: new_infoTypes});
    },
    render: function() {
        var iType_elements = [];
        var selectedType = this.state.newInfoTypes[this.state.selectedTypeID];
        for (var i = 0; i < selectedType.fieldNames.length; ++i) {
            iType_elements.push(
                <div key={i} className="sectionContent">
                    <input
                        className="sectionContentEl"
                        value={selectedType.fieldNames[i]}
                        onChange={this.onFieldNameEdit.bind(this, i)}
                    />
                    <span
                        className={"fa fa-trash-o button buttonDanger sectionContentElFixed"+(selectedType.fieldNames.length<=2?" invisible":"")}
                        onClick={this.onFieldsResize.bind(this, i)
                            }></span>
                </div>
            )
        }

        var mainSection = [];
        if (this.state.mode !== "main") {
            mainSection =
                <Views
                    view={selectedType.views[this.state.mode]}
                    onViewChange={this.onViewChange}
                />
        } else {
            mainSection.push(
                <section key={0}>
                    <h3>Name</h3>
                    <input
                        className="sectionContent"
                        type="text"
                        id="typeName"
                        value={selectedType.name}
                        onChange={this.onNameEdit}
                    />
                </section>
            );
            mainSection.push(
                <section key={1}>
                    <h3>Entries
                        <span className="microbutton fa fa-plus-square" onClick={this.onFieldsResize.bind(this, -1)}></span>
                    </h3>
                    {iType_elements}
                </section>
            );
        }

        var typeNames = {}; // = this.state.infoTypes.map(function(type){ return type.name;});
        for(var key in this.state.newInfoTypes){
            typeNames[key] = this.state.newInfoTypes[key].name;
        }

        var viewButtons = [];
        for(var viewID in selectedType.views){
            viewButtons.push(
                <span
                    key={viewID}
                    className={"flexElemContHoriz button "+(this.state.mode===viewID?"buttonGood":"")}
                    onClick={this.setMode.bind(this, viewID)}>{"View "+viewID}
                </span>
            );
        }

        var isChanged = JSON.stringify(this.props.infoTypes)===JSON.stringify(this.state.newInfoTypes);
        return (
            <div className="InfoTypes Component">
                <div className="sectionContainer">
                    <ITypeSwitcher
                        typeNames={typeNames}
                        selectedTypeID={this.state.selectedTypeID}
                        onTypeChange={this.selectType}
                        onAddType={this.onAddType}
                    />

                    <section className="sectionContent tabContainer">
                        <span
                            className={"button "+(this.state.mode==="main"?"buttonGood":"")}
                            onClick={this.setMode.bind(this, "main")}>Main
                        </span>
                        {viewButtons}
                    </section>


                    {mainSection}

                    <section className="sectionContent flexContHoriz">
                        <span
                            className={"flexElemContHoriz button buttonGood "+ (isChanged?"disabled":"")}
                            onClick={this.onSave}>Save
                        </span>
                        <span className="flexElemContHoriz button" onClick={this.props.cancelEdit}>Cancel</span>
                    </section>


                </div>
            </div>);
    }
});

