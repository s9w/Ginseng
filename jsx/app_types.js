var InfoTypes = React.createClass({
    getInitialState() {
        var chosenTypeID = 0;
        while(!(chosenTypeID in this.props.types)){
            chosenTypeID++;
        }
        if(this.props.selectedTypeID){
            chosenTypeID = this.props.selectedTypeID;
        }
        return {
            selectedTypeID: chosenTypeID.toString(),
            types: this.props.types,
            changes: {
                "renames": "",
                "typeResizes": []
            },
            mode: "main"
        };
    },
    onFieldNameEdit(fieldNameIndex, event) {
        var newTypes = JSON.parse( JSON.stringify( this.state.types ));
        newTypes[this.state.selectedTypeID].entryNames[fieldNameIndex] = event.target.value;
        var newchanges = JSON.parse( JSON.stringify( this.state.changes ));
        newchanges.renames = "renamed";
        this.setState({
            types: newTypes,
            changes: newchanges
        });
    },
    selectType(newID){
        this.setState({
            selectedTypeID: newID,
            mode: "main"
        });
    },
    onNameEdit(event) {
        var newTypes = JSON.parse( JSON.stringify( this.state.types ));
        newTypes[this.state.selectedTypeID].name = event.target.value;
        var newchanges = JSON.parse( JSON.stringify( this.state.changes ));
        newchanges.renames = "renamed";
        this.setState({
            types: newTypes,
            changes: newchanges
        });
    },
    onFieldsResize(fieldNameIndex){
        // resize the type
        var newTypes = JSON.parse( JSON.stringify( this.state.types ));
        if(fieldNameIndex === "add"){
            newTypes[this.state.selectedTypeID].entryNames.push("");
        }else{
            newTypes[this.state.selectedTypeID].entryNames.splice(fieldNameIndex, 1);
        }

        // set changes
        var newchanges = JSON.parse( JSON.stringify( this.state.changes ));
        newchanges.typeResizes.push( {id: this.state.selectedTypeID, fieldNameIndex: fieldNameIndex} );

        this.setState({
            types: newTypes,
            changes: newchanges
        });
    },
    componentDidUpdate : function(){
        if(this.state.types[this.state.selectedTypeID].name === "New info type"){
            this.refs.nameRef.getDOMNode().focus();
        }
    },
    onAddType(){
        var newTypes = JSON.parse( JSON.stringify( this.state.types ));
        // get next type ID
        var nextTypeID = "0";
        for(var typeID in newTypes){
            if(parseInt(typeID, 10) > parseInt(nextTypeID, 10)){
                nextTypeID = typeID;
            }
        }
        nextTypeID = (parseInt(nextTypeID, 10)+1).toString();

        newTypes[nextTypeID] = {
            "name": "New info type",
            "entryNames": ["first field", "second field"],
            "templates": {
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
        this.setState({
            types: newTypes,
            selectedTypeID: nextTypeID
        });
    },
    setMode(modeStr){
        this.setState({mode: modeStr});
    },
    onViewChange(type, newContent){
        var newTypes = JSON.parse( JSON.stringify( this.state.types ));
        newTypes[this.state.selectedTypeID].templates[this.state.mode][type] = newContent;
        this.setState({types: newTypes});
    },
    render() {
        console.log("render types");
        var selectedType = this.state.types[this.state.selectedTypeID];

        var mainSection;
        if (this.state.mode !== "main") {
            mainSection =
                <TemplateDetails
                    view={selectedType.templates[this.state.mode]}
                    onViewChange={this.onViewChange}
                />
        } else {
            mainSection=[
                <section key={0}>
                    <h3>Name</h3>
                    <input
                        className="sectionContent"
                        type="text"
                        ref="nameRef"
                        id="typeName"
                        value={selectedType.name}
                        onChange={this.onNameEdit}
                    />
                </section>,
                <section key={1}>
                    <h3>Entries</h3>
                    {selectedType.entryNames.map((entryName, i) =>
                        <div key={i} className="sectionContent">
                            <input
                                className="sectionContentEl"
                                value={entryName}
                                onChange={this.onFieldNameEdit.bind(this, i)}
                            />
                            <button
                                className={"buttonDanger microbutton sectionContentElFixed" + (selectedType.entryNames.length <= 2 ? " invisible" : "")}
                                onClick={this.onFieldsResize.bind(this, i)}>✖
                            </button>
                        </div>
                    )}
                    <div
                        className="sectionContent">
                        <button
                            className="buttonGood"
                            onClick={this.onFieldsResize.bind(this, "add")}>Add entry
                        </button>
                    </div>
                </section>
            ]
        }

        var isChanged = JSON.stringify(this.props.types)!==JSON.stringify(this.state.types);
        return (
            <div className="Component">
                <section>
                    <h3>Info Type</h3>
                    <ITypeSwitcher
                        className="sectionContent"
                        types={this.state.types}
                        selectedTypeID={this.state.selectedTypeID}
                        onTypeChange={this.selectType}
                        onAddType={this.onAddType}
                    />
                </section>

                <div className="sectionContent tabContainer">
                    <button
                        className={this.state.mode==="main"?"buttonGood":""}
                        onClick={this.setMode.bind(this, "main")}>Type
                    </button>

                    {Object.keys(selectedType.templates).map(templateID =>
                        <button
                            key={templateID}
                            className={"flexElemContHoriz button "+(this.state.mode===templateID?"buttonGood":"")}
                            onClick={this.setMode.bind(this, templateID)}>{"Template "+templateID}
                        </button>
                    )}
                </div>

                {mainSection}

                <div className="flexContHoriz">
                    <button
                        disabled={!isChanged}
                        className="buttonGood"
                        onClick={this.props.onSave.bind(null, this.state.types, this.state.changes)}>Save
                    </button>
                    <button onClick={this.props.cancelEdit}>Cancel</button>
                </div>
            </div>
        );
    }
});

