var InfoTypes = React.createClass({
    getInitialState() {
        var chosenTypeID = this.props.selectedTypeID || _.min(_.keys(this.props.types));
        return {
            selectedTypeID: chosenTypeID.toString(),
            types: this.props.types,
            changes: {
                "entryNameResizes": []
            },
            mode: "main"
        };
    },
    onFieldNameEdit(entryNameIndex, event) {
        var newTypes = JSON.parse( JSON.stringify( this.state.types ));
        newTypes[this.state.selectedTypeID].entryNames[entryNameIndex] = event.target.value;
        this.setState({
            types: newTypes
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
        this.setState({
            types: newTypes
        });
    },
    onFieldsResize(entryIndex){
        // resize the type
        var newTypes = JSON.parse( JSON.stringify( this.state.types ));
        if(entryIndex === "add"){
            newTypes[this.state.selectedTypeID].entryNames.push("");
        }else{
            newTypes[this.state.selectedTypeID].entryNames.splice(entryIndex, 1);
        }

        // set changes
        var newchanges = JSON.parse( JSON.stringify( this.state.changes ));
        newchanges.entryNameResizes.push( {typeID: this.state.selectedTypeID, entryNameIndex: entryIndex} );

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
            "front": "",
            "back": "",
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
    onSave(){
        var typeChanges = _(this.props.types).mapValues(x => new Object()).value();
        for(let oldTypeID in this.props.types){
            var entryNamesLengthDiff = this.state.types[oldTypeID].entryNames.length - this.props.types[oldTypeID].entryNames.length;
            if(entryNamesLengthDiff !== 0){
                typeChanges[oldTypeID]["entryLengthDiff"] = entryNamesLengthDiff;
            }
            var templateCountDiff = _.keys(this.state.types[oldTypeID].templates).length - _.keys(this.props.types[oldTypeID].templates).length;
            if(templateCountDiff !== 0){
                typeChanges[oldTypeID]["reviewDiff"] = templateCountDiff;
            }
        }
        typeChanges = _.omit(typeChanges, val => _.keys(val).length===0);
        //console.log("types onSave. typeChanges: " + JSON.stringify(typeChanges));
        this.props.onSave(this.state.types, typeChanges);
    },
    render() {
        var selectedType = this.state.types[this.state.selectedTypeID];
        var infosPerType = _(this.state.types).mapValues(type => 0).extend(this.props.infosPerType).value();

        var mainSection;
        if (this.state.mode !== "main") {
            mainSection =
                <TemplateDetails
                    template={selectedType.templates[this.state.mode]}
                    entryNames={selectedType.entryNames}
                    onViewChange={this.onViewChange}
                    delete={(_(selectedType.templates).keys().value().length > 1)?this.onDeleteTemplate: false}
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
                        <div className="flexRowStacked" key={i}>
                            <input
                                className="flexContentVariable"
                                value={entryName}
                                onChange={this.onFieldNameEdit.bind(this, i)}
                            />
                            <button
                                className={"buttonDanger microbutton flexContentFixed" + (selectedType.entryNames.length <= 2 ? " invisible" : "")}
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
                    <span>Infos with this type: {infosPerType[this.state.selectedTypeID]} ({(100.0*infosPerType[this.state.selectedTypeID]/this.props.infoCount).toFixed()}%)</span>
                </section>

                <div className="flexRowStacked flexRowDistribute">
                    <button
                        className={this.state.mode==="main"?"buttonGood":""}
                        onClick={this.setMode.bind(this, "main")}>
                        Properties
                    </button>

                    {Object.keys(selectedType.templates).map(templateID =>
                        <button
                            key={templateID}
                            className={this.state.mode===templateID?"buttonGood":""}
                            onClick={this.setMode.bind(this, templateID)}>
                            {"Template "+templateID}
                        </button>
                    )}

                    <button
                        onClick={this.onAddTemplate}>
                        Add...
                    </button>
                </div>

                {mainSection}

                <div className="flexRowDistribute">
                    <button
                        disabled={!isChanged}
                        className="buttonGood"
                        onClick={this.onSave}>
                        Save
                    </button>
                    <button onClick={this.props.cancelEdit}>Cancel</button>
                </div>
            </div>
        );
    }
});

