var InfoTypes = React.createClass({
    getInitialState: function() {
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
    onFieldNameEdit: function(fieldNameIndex, event) {
        var newTypes = JSON.parse( JSON.stringify( this.state.types ));
        newTypes[this.state.selectedTypeID].entryNames[fieldNameIndex] = event.target.value;
        var newchanges = JSON.parse( JSON.stringify( this.state.changes ));
        newchanges.renames = "renamed";
        this.setState({
            types: newTypes,
            changes: newchanges
        });
    },
    selectType: function(newID){
        this.setState({
            selectedTypeID: newID,
            mode: "main"
        });
    },
    onNameEdit: function(event) {
        var newTypes = JSON.parse( JSON.stringify( this.state.types ));
        newTypes[this.state.selectedTypeID].name = event.target.value;
        var newchanges = JSON.parse( JSON.stringify( this.state.changes ));
        newchanges.renames = "renamed";
        this.setState({
            types: newTypes,
            changes: newchanges
        });
    },
    onFieldsResize: function(fieldNameIndex){
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
    onSave: function(){
        this.props.onSave(this.state.types, this.state.changes);
    },
    componentDidUpdate : function(){
        if(this.state.types[this.state.selectedTypeID].name === "new info type"){
            this.refs.nameRef.getDOMNode().focus();
        }
    },
    onAddType: function(){
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
            "name": "new info type",
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
    setMode: function(modeStr){
        this.setState({mode: modeStr});
    },
    onViewChange: function(type, newContent){
        var newTypes = JSON.parse( JSON.stringify( this.state.types ));
        newTypes[this.state.selectedTypeID].templates[this.state.mode][type] = newContent;
        this.setState({types: newTypes});
    },
    render: function() {
        var selectedType = this.state.types[this.state.selectedTypeID];

        // render the typenames
        var entrynameRows = [];
        for (var i = 0; i < selectedType.entryNames.length; ++i) {
            entrynameRows.push(
                <div key={i} className="sectionContent">
                    <input
                        className="sectionContentEl"
                        value={selectedType.entryNames[i]}
                        onChange={this.onFieldNameEdit.bind(this, i)}
                    />
                    <button
                        className={"buttonDanger microbutton sectionContentElFixed"+(selectedType.entryNames.length<=2?" invisible":"")}
                        onClick={this.onFieldsResize.bind(this, i)
                            }>✖</button>
                </div>
            )
        }
        entrynameRows.push(
            <div
                key="add"
                className="sectionContent">
                <button
                    className="buttonGood"
                    onClick={this.onFieldsResize.bind(this, "add")}>Add entry</button>
            </div>
        );

        var mainSection = [];
        if (this.state.mode !== "main") {
            mainSection =
                <TemplateDetails
                    view={selectedType.templates[this.state.mode]}
                    onViewChange={this.onViewChange}
                />
        } else {
            mainSection.push(
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
                </section>
            );
            mainSection.push(
                <section key={1}>
                    <h3>Entries</h3>
                    {entrynameRows}
                </section>
            );
        }

        var viewButtons = [];
        for(var templateID in selectedType.templates){
            viewButtons.push(
                <button
                    key={templateID}
                    className={"flexElemContHoriz button "+(this.state.mode===templateID?"buttonGood":"")}
                    onClick={this.setMode.bind(this, templateID)}>{"Template "+templateID}
                </button>
            );
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

                <section className="sectionContent tabContainer">
                    <button
                        className={"button "+(this.state.mode==="main"?"buttonGood":"")}
                        onClick={this.setMode.bind(this, "main")}>Details
                    </button>
                    {viewButtons}
                </section>

                {mainSection}

                <section className="sectionContent flexContHoriz">
                    <button
                        disabled={!isChanged}
                        className="flexElemContHoriz buttonGood"
                        onClick={this.onSave}>Save
                    </button>
                    <button className="flexElemContHoriz" onClick={this.props.cancelEdit}>Cancel</button>
                </section>
            </div>
        );
    }
});

