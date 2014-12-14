//function getITypeIndex(types, nameS){
//    for(var i = 0; i < types.length; i++) {
//        if(types[i].name === nameS) {
//            return i;
//        }
//    }
//}

var InfoEdit = React.createClass({
    getInitialState: function() {
        var infoNew = JSON.parse( JSON.stringify( this.props.info ));
        if(Object.keys(infoNew).length === 1){
            var fields = [];
            var reviews = {};
            for (var i = 0; i < this.props.types[this.props.info.typeID].fieldNames.length; ++i) {
                fields.push("");
                reviews[i] = [];
            }
            infoNew.fields = fields;
            infoNew.reviews = reviews;
            infoNew.tags = [];
            infoNew.creationDate = moment().format();
        }
        return {
            info: infoNew
        };
    },
    componentDidMount: function(){
        //this.refs.firstTextbox.getDOMNode().focus();
    },
    componentWillUpdate: function(nextProps, nextState){
        console.log("UPDATE");
    },
    onTypeChange: function(newTypeID){
        var newInfo = JSON.parse( JSON.stringify( this.state.info ));
        newInfo.typeID = newTypeID
        var newFieldsLength = this.props.types[newTypeID].fieldNames.length;
        var sizeDiff = newFieldsLength - this.state.info.fields.length;
        if( sizeDiff > 0 ){
            for(var i=0; i<sizeDiff; i++){
                newInfo.fields.push("");
            }
        } else if(sizeDiff < 0){
            newInfo.fields = newInfo.fields.slice(0, newFieldsLength);
        }
        this.setState({info: newInfo});
    },
    onFieldEdit: function(fieldIndex, e) {
        var newInfo = JSON.parse( JSON.stringify( this.state.info ));
        newInfo.fields[fieldIndex] = e.target.value;
        this.setState( {info: newInfo} );
    },
    onTagsEdit: function(event) {
        var newInfo = JSON.parse( JSON.stringify( this.state.info ));
        if(event.target.value === ""){
            newInfo.tags = [];
        }else{
            newInfo.tags = event.target.value.replace(/ /g, "").split(",");
        }
        this.setState( {info: newInfo} );
    },
    onSave: function(){ //inline?
        this.props.onSave(this.state.info);
    },
    addUsedTag: function (nextTagStr) {
        var newInfo = JSON.parse( JSON.stringify( this.state.info ));
        newInfo.tags .push(nextTagStr);
        this.setState( {info: newInfo} );
    },
    render: function() {
        var data_elements = [];
        //var typeIndex = this.props.typeNames.indexOf(this.state.info.type);
        for (var fieldIdx = 0; fieldIdx < this.state.info.fields.length; ++fieldIdx) {
            var element_name = this.props.types[this.state.info.typeID].fieldNames[fieldIdx];
            var refStr = false;
            if(fieldIdx===0){
                refStr="firstTextbox";
            }
            data_elements.push(
                <div key={fieldIdx}>
                    <div>{element_name}</div>
                    <textarea
                        value={this.state.info.fields[fieldIdx]}
                        ref={refStr}
                        onChange={this.onFieldEdit.bind(this, fieldIdx)}
                        rows={(this.state.info.fields[fieldIdx].match(/\n/g) || []).length+2}
                    />
                </div>
            );
        }

        // used Tags
        var usedTagEls = [];
        var seperator;
        for (var index = 0; index < this.props.usedTags.length; ++index) {
            if( this.state.info.tags.indexOf(this.props.usedTags[index]) === -1 ){
                if(usedTagEls.length===0)
                    seperator = "";
                else
                    seperator = ", ";
                usedTagEls.push(
                    <a key={index} onClick={this.addUsedTag.bind(this, this.props.usedTags[index])} href="#">{seperator+this.props.usedTags[index]}</a>
                );
            }
        }

        var isChanged = JSON.stringify(this.props.info)===JSON.stringify(this.state.info);
        return (
            <div className="InfoEdit Component">
                <div className="editEntryContainer">
                    <ITypeSwitcher
                        typeNames={this.props.typeNames}
                        selectedTypeID={this.state.info.typeID}
                        onTypeChange={this.onTypeChange}
                    />
                    {data_elements}
                    <div className="editEntryElement">
                        <div className="grid_left">Tags</div>
                        <textarea rows={1} type="text" value={this.state.info.tags.join(", ")} onChange={this.onTagsEdit} />
                    </div>
                    <div className="editEntryElement">
                        <div className="grid_left"></div>
                        {usedTagEls}
                    </div>
                </div>

                <div className="flexContHoriz">
                    <span
                        className={"button buttonGood "+ (isChanged?"disabled":"")}
                        onClick={this.onSave}>{this.props.saveButtonStr}
                    </span>
                    <span className="button" onClick={this.props.cancelEdit}>Cancel</span>
                    <span className={!(this.props.onDelete)?"invisible":"" + " button buttonDanger"} onClick={this.props.onDelete}>Delete</span>
                </div>

                <div>
                </div>
            </div>);
    }
});

var ITypeSwitcher = React.createClass({
    onTypeChange: function(e){
        this.props.onTypeChange(e.target.value);
    },
    //onAddType: function(){
    //    var new_infoTypes = JSON.parse( JSON.stringify( this.props.info_types ));
    //    new_infoTypes.push( {
    //        "name": "new info type",
    //        "fieldNames": ["first field", "second field"],
    //        "views": [
    //            {
    //                "front": "{first field}",
    //                "back": "{second field}",
    //                "condition": ""
    //            },
    //            {
    //                "front": "{second field}",
    //                "back": "{first field}",
    //                "condition": "tag: reverse"
    //            }
    //        ]
    //    });
    //    this.props.onAddType(new_infoTypes);
    //},
    render: function() {
        var typeNameOptions = new Array(this.props.typeNames.length);
        for(var typeID in this.props.typeNames){
        //for(var i=0; i<this.props.typeNames.length; i++){
            typeNameOptions.push( <option key={typeID} value={typeID}>{this.props.typeNames[typeID]}</option> );
        }
        var buttonAddType = false;
        if(this.props.onAddType)
            buttonAddType = <span className="button" title="new type" onClick={this.onAddType}></span>;

        return (
            <div className="iTypeSwitcher editEntryElement">
                <div className="grid_left">Info type</div>
                <select size={typeNameOptions.length} value={this.props.selectedTypeID} ref="selector" onChange={this.onTypeChange}>
                    {typeNameOptions}
                </select>
                {buttonAddType}
            </div>);
    }
});

var InfoTypes = React.createClass({
    getInitialState: function() {
        return {
            selectedTypeIndex: 0,
            newInfoTypes: this.props.infoTypes
        };
    },
    onFieldNameEdit: function(fieldNameIndex, event) {
        this.props.onFieldNameEdit(this.state.selectedTypeName, fieldNameIndex, event.target.value);
    },
    onNameEdit: function(event) {
        this.props.onNameEdit(this.state.selectedTypeName, event.target.value);
    },
    onTypeChange: function(newIndex){
        this.setState({selectedTypeIndex: newIndex});
    },
    onFieldsResize: function(fieldNameIndex){
        this.props.onResize(this.state.selectedTypeIndex, fieldNameIndex)
    },
    render: function() {
        var iType_elements = [];
        for (var i = 0; i < this.state.newInfoTypes[this.state.selectedTypeIndex].fieldNames.length; ++i) {
            iType_elements.push(
                <input
                    type="text"
                    key={i}
                    bsSize="small"
                    addonBefore={"Label "+ i}
                    value={this.state.newInfoTypes[this.state.selectedTypeIndex].fieldNames[i]}
                    onChange={this.onFieldNameEdit.bind(this, i)}
                    buttonAfter={<span className="button buttonDanger" onClick={this.onFieldsResize.bind(this, i)}>delete!</span>}
                />
            )
        }

        return (
            <div className="InfoTypes Component">
                <div className="editEntryContainer">
                    <ITypeSwitcher
                        typeNames={this.state.newInfoTypes.map(function(type){ return type.name;})}
                        selectedTypeIndex={this.state.selectedTypeIndex}
                        onTypeChange={this.onTypeChange}
                    />
                    <input
                        type="text"
                        bsSize="small"
                        addonBefore="Type name"
                        value={this.state.newInfoTypes[this.state.selectedTypeIndex].name}
                        onChange={this.onNameEdit}
                    />
                </div>

                <div className="editEntryContainer">
                    {iType_elements}
                </div>
                <button onClick={this.onFieldsResize.bind(this, -1)}>Add new field</button>
                <span onClick={this.onFieldsResize.bind(this, -1)}>Add new field</span>
            </div>);
    }
});