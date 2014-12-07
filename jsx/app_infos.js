var InfoEdit = React.createClass({
    getInitialState: function() {
        var infoNew = this.props.info;
        if (infoNew.fields === []){
            for (var index = 0;  index< this.props.info_types[this.props.default_iType_index].length; ++index) {
                infoNew.push("");
            }
        }
        return {
            info: infoNew,
            tagsStr: this.props.info.tags.join(", "),
            selectedTypeIndex: this.props.default_iType_index
        };
    },
    componentWillReceiveProps: function(nextProps) {
        console.log("InfoEdit new props");
    },
    change_infoType: function(infoType){
        this.setState({selectedTypeIndex: infoType});
        var newInfo = JSON.parse( JSON.stringify( this.state.info ));
        var size_new = this.props.info_types[infoType].fieldNames.length;
        var sizeDiff = size_new - this.state.info.fields.length;
        if( sizeDiff > 0 ){
            for(var i=0; i<sizeDiff; i++){
                newInfo.fields.push("");
            }
        } else if(sizeDiff < 0){
            newInfo = newInfo.fields.slice(0, size_new);
        }
        this.setState( {info: newInfo} );
    },
    onFieldEdit: function(fieldIndex, e) {
        var newInfo = JSON.parse( JSON.stringify( this.state.info ));
        newInfo.fields[fieldIndex] = e.target.value;
        this.setState( {info: newInfo} );
    },
    onTagsEdit: function(event) {
        this.setState( {tagsStr: event.target.value} );
    },
    onSave: function(){
        this.props.onSave(this.state.info.fields, this.state.tagsStr.replace(/ /g, "").split(","), this.state.selectedTypeIndex);
    },
    addUsedTag: function (nextTagStr) {
        var newTagStr = this.state.tagsStr;
        var separator;
        if(newTagStr === "")
            separator = "";
        else
            separator = ", ";
        newTagStr += separator + nextTagStr;
        this.setState({tagsStr: newTagStr});
    },
    render: function() {
        var data_elements = [];
        console.log("this.state.selectedTypeIndex: " + this.state.selectedTypeIndex);
        for (var i = 0; i < this.props.info_types[this.state.selectedTypeIndex].fieldNames.length; ++i) {
            var element_name = this.props.info_types[this.state.selectedTypeIndex].fieldNames[i];
            data_elements.push(
                <div key={i} className="editEntryElement">
                    <div className="grid_left">{element_name}</div>
                    <textarea rows={1} type="text" value={this.state.info.fields[i]} onChange={this.onFieldEdit.bind(this, i)} />
                </div>
            );
        }

        // used Tags
        var usedTagEls = [];
        var seperator = "";
        for (var index = 0; index < this.props.usedTags.length; ++index) {
            if(index === this.props.usedTags.length-1)
                seperator = "";
            else
                seperator = ", ";
            usedTagEls.push( <a key={index}  onClick={this.addUsedTag.bind(this, this.props.usedTags[index])} href="#">{this.props.usedTags[index] + seperator}</a> );
        }

        return (
            <div className="InfoEdit Component">
                <div className="editEntryContainer">
                    <ITypeSwitcher selected_iType={this.state.selectedTypeIndex} onTypeChange={this.change_infoType} info_types={this.props.info_types} />
                    {data_elements}
                    <div className="editEntryElement">
                        <div className="grid_left">Tags</div>
                        <textarea rows={1} type="text" value={this.state.tagsStr} onChange={this.onTagsEdit} />
                    </div>
                    <div className="editEntryElement">
                        <div className="grid_left"></div>
                        {usedTagEls}
                    </div>
                </div>
                <button onClick={this.onSave}>Save</button>
                <button onClick={this.props.cancelEdit}>Cancel</button>
                <button className={!(this.props.onDelete)?"invisible":""} onClick={this.props.onDelete}>Delete</button>
            </div>);
    }
});

var ITypeSwitcher = React.createClass({
    onTypeChange: function(e){
        this.props.onTypeChange(e.target.value);
    },
    onAddType: function(){
        var new_infoTypes = JSON.parse( JSON.stringify( this.props.info_types ));
        var newIType = {
            "name": "new info type",
            "fieldNames": ["first field", "second field"],
            "views": [
                {
                    "front": "{first field}",
                    "back": "{second field}",
                    "condition": ""
                },
                {
                    "front": "{second field}",
                    "back": "{first field}",
                    "condition": "tag: reverse"
                }
            ]
        };
        new_infoTypes.push(newIType);
        this.props.onAddType(new_infoTypes);
    },
    render: function() {
        var options = [];
        for (var j = 0; j < this.props.info_types.length; ++j) {
            options.push( <option key={j} value={j}>{this.props.info_types[j].name}</option> );
        }
        var buttonAddType = "";
        if(this.props.onAddType)
            buttonAddType = <span className="fa fa-plus-circle clickable" title="new type" onClick={this.onAddType}></span>;

        return (
            <div className="iTypeSwitcher editEntryElement">
                <div className="grid_left">Info type</div>
                <select size={this.props.info_types.length} value={this.props.selected_iType} ref="selector" onChange={this.onTypeChange}>
                    {options}
                </select>
                {buttonAddType}
            </div>);
    }
});


var InfoTypes = React.createClass({
    getInitialState: function() {
        return {
            selectedTypeIndex: 0
        };
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({
            selectedTypeIndex: nextProps.info_types.length-1
        });
    },
    onFieldNameEdit: function(fieldNameIndex, event) {
        this.props.onFieldNameEdit(this.state.selectedTypeIndex, fieldNameIndex, event.target.value);
    },
    onNameEdit: function(event) {
        this.props.onNameEdit(this.state.selectedTypeIndex, event.target.value);
    },
    onTypeChange: function(iTypeName){
        this.setState({selectedTypeIndex: iTypeName});
    },
    onFieldsResize: function(fieldNameIndex){
        this.props.onResize(this.state.selectedTypeIndex, fieldNameIndex)
    },
    render: function() {
        if(this.props.show) {
            var iType_elements = [];
            for (var i = 0; i < this.props.info_types[this.state.selectedTypeIndex].fieldNames.length; ++i) {
                var fieldName = this.props.info_types[this.state.selectedTypeIndex].fieldNames[i];
                iType_elements.push(
                    <div key={i} className="editEntryElement">
                        <span className="grid_left">Field {i}</span>
                        <input type="text" value={fieldName} onChange={this.onFieldNameEdit.bind(this, i)} />
                        <span className="fa fa-minus-circle clickable" title="delete field" onClick={this.onFieldsResize.bind(this, i)}></span>
                    </div>
                )
            }

            return (
                <div className="InfoTypes Component">
                    <div className="editEntryContainer">
                        <ITypeSwitcher selected_iType={this.state.selectedTypeIndex} onTypeChange={this.onTypeChange}
                            info_types={this.props.info_types} onAddType={this.props.onEdit}/>
                        <div className="editEntryElement">
                            <span className="grid_left">Type name</span>
                            <input className="grid_right" type="text" value={this.props.info_types[this.state.selectedTypeIndex].name} onChange={this.onNameEdit} />
                        </div>
                    </div>

                    <div className="editEntryContainer">
                        {iType_elements}
                    </div>
                    <button onClick={this.onFieldsResize.bind(this, -1)}>Add new field</button>
                </div>);
        }
        else{
            return ( <div className="InfoNew"></div> );
        }
    }
});