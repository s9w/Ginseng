var InfoTypes = React.createClass({
    getInitialState() {
        var chosenTypeID = this.props.selectedTypeID || _.min(_.keys(this.props.types));
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
    onAddType(){
        var newTypes = JSON.parse( JSON.stringify( this.state.types ));
        var nextTypeID =  _.parseInt(_.max(_.keys(this.state.types)))+1;

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
            selectedTypeID: nextTypeID,
            mode: "main"
        });
    },
    onDeleteType(){
        var newTypes = JSON.parse( JSON.stringify( this.state.types ));
        delete newTypes[this.state.selectedTypeID];
        this.setState({
            types: newTypes,
            selectedTypeID: _.parseInt(_.max(_.keys(newTypes)))
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
    onAddTemplate(){
        var newTypes = JSON.parse( JSON.stringify( this.state.types ));
        var nextTemplateID =  _.parseInt(_.max( _.keys(newTypes[this.state.selectedTypeID].templates) ))+1;
        newTypes[this.state.selectedTypeID].templates[nextTemplateID] = {
            "front": "{front}",
            "back": "{back}",
            "condition": ""
        };
        this.setState({
            types: newTypes,
            mode: nextTemplateID.toString()
        });
    },
    onDeleteTemplate(){
        var newTypes = JSON.parse( JSON.stringify( this.state.types ));
        delete newTypes[this.state.selectedTypeID].templates[this.state.mode];
        this.setState({
            types: newTypes,
            mode: _(newTypes[this.state.selectedTypeID].templates).keys().max().toString()
        });
    },
    render() {
        var selectedType = this.state.types[this.state.selectedTypeID];

        var mainSection;
        if (this.state.mode !== "main") {
            mainSection =
                <TemplateDetails
                    view={selectedType.templates[this.state.mode]}
                    onViewChange={this.onViewChange}
                    delete={this.onDeleteTemplate}
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
                        <div className="flexRow" key={i}>
                            <input
                                className="sectionContentEl"
                                value={entryName}
                                onChange={this.onFieldNameEdit.bind(this, i)}
                            />
                            <button
                                className={"buttonDanger microbutton sectionContentElFixed" + (selectedType.entryNames.length <= 2 ? " invisible" : "")}
                                onClick={this.onFieldsResize.bind(this, i)}>
                                ✖
                            </button>
                        </div>
                    )}
                    <div
                        className="sectionContent">
                        <button
                            className="buttonGood"
                            onClick={this.onFieldsResize.bind(this, "add")}>
                            Add entry
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
                    <DictSelector
                        dict={this.state.types}
                        selectedID={this.state.selectedTypeID}
                        onSelectionChange={this.selectType}
                        onAddElement={this.onAddType}
                        onDeleteElement={_.keys(this.state.types).length<=1?false:this.onDeleteType}
                    />
                </section>

                <div className="sectionContent tabContainer">
                    <button
                        className={this.state.mode==="main"?"buttonGood":""}
                        onClick={this.setMode.bind(this, "main")}>Properties
                    </button>

                    {Object.keys(selectedType.templates).map(templateID =>
                        <button
                            key={templateID}
                            className={"flexElemContHoriz"+(this.state.mode===templateID?" buttonGood":"")}
                            onClick={this.setMode.bind(this, templateID)}>{"Template "+templateID}
                        </button>
                    )}

                    <button
                        onClick={this.onAddTemplate}>
                        Add...
                    </button>
                </div>

                {mainSection}

                <div className="flexContHoriz">
                    <button
                        disabled={!isChanged}
                        className="buttonGood"
                        onClick={this.props.onSave.bind(null, this.state.types, this.state.changes)}>
                        Save
                    </button>
                    <button onClick={this.props.cancelEdit}>Cancel</button>
                </div>
            </div>
        );
    }
});

