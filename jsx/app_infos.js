var InfoEdit = React.createClass({
    getInitialState: function() {
        var infoNew = JSON.parse( JSON.stringify( this.props.info ));
        if(Object.getOwnPropertyNames(infoNew).length == 0){
            infoNew = this.createInfo(this.props.lastInfoTypeName);
        }
        return {
            info: infoNew
        };
    },
    createInfo: function(typeName){
        var newInfo = {};
        newInfo.type = typeName;
        var fields = [];
        var reviews = [];
        for (var index = 0; index < this.props.info_types[typeName].fieldNames.length; ++index) {
            fields.push("");
            reviews.push([]);
        }
        newInfo.fields = fields;
        newInfo.reviews = reviews;
        newInfo.tags = [];
        newInfo.creationDate = moment().format();
        return newInfo;
    },
    change_infoType: function(newTypeName){
        var newInfo = JSON.parse( JSON.stringify( this.state.info ));
        newInfo.type = newTypeName;
        var size_new = this.props.info_types.newTypeName.fieldNames.length;
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
        var newInfo = JSON.parse( JSON.stringify( this.state.info ));
        newInfo.tags = event.target.value.replace(/ /g, "").split(",");
        this.setState( {info: newInfo} );
    },
    onSave: function(){
        this.props.onSave(this.state.info);
    },
    addUsedTag: function (nextTagStr) {
        var newInfo = JSON.parse( JSON.stringify( this.state.info ));
        newInfo.tags .push(nextTagStr);
        this.setState( {info: newInfo} );
    },
    render: function() {
        var Label123 = ReactBootstrap.Label;
        var Input = ReactBootstrap.Input;
        var Grid = ReactBootstrap.Grid;
        var Row = ReactBootstrap.Row;

        var data_elements = [];
        console.log("this.state.info.type: " + this.state.info.type);
        console.log("this.props.info_types: " + JSON.stringify(this.props.info_types));
        for (var i = 0; i < this.props.info_types[this.state.info.type].fieldNames.length; ++i) {
            var element_name = this.props.info_types[this.state.info.type].fieldNames[i];
            data_elements.push(
                <Input
                    rows={(this.state.info.fields[i].match(/\n/g) || []).length+1}
                    type="textarea"
                    key={i}
                    label={element_name}
                    value={this.state.info.fields[i]}
                    onChange={this.onFieldEdit.bind(this, i)}
                />
            );
        }

        // used Tags
        var usedTagEls = [];
        var seperator = "";
        for (var index = 0; index < this.props.usedTags.length; ++index) {
            if( this.state.info.tags.indexOf(this.props.usedTags[index]) === -1 ){
                if(index === this.props.usedTags.length-1)
                    seperator = "";
                else
                    seperator = ", ";
                usedTagEls.push(
                    <a key={index} onClick={this.addUsedTag.bind(this, this.props.usedTags[index])} href="#">{this.props.usedTags[index] + seperator}</a>
                );
            }
        }

        var labelVariationInstance = (
            <div>
                <Label123 bsStyle="default">en</Label123>
                <Label123 bsStyle="default">language</Label123>
                <Label123 bsStyle="default">math</Label123>
                <Label123 bsStyle="primary">Primary</Label123>
                <Label123 bsStyle="success">Success</Label123>
                <Label123 bsStyle="info">Info</Label123>
                <Label123 bsStyle="warning">Warning</Label123>
                <Label123 bsStyle="danger">Danger</Label123>
            </div>
        );

        return (
            <div className="InfoEdit Component">
                <div className="editEntryContainer">
                    <ITypeSwitcher selected_iType={this.state.info.type} onTypeChange={this.change_infoType} info_types={this.props.info_types} />
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
                <button onClick={this.onSave}>Save</button>
                <button onClick={this.props.cancelEdit}>Cancel</button>
                <button className={!(this.props.onDelete)?"invisible":""} onClick={this.props.onDelete}>Delete</button>

                <div>
                {labelVariationInstance}
                </div>
            </div>);
    }
});

var DangerPopup = React.createClass({
    render: function() {
        return (
            <div className="DangerPopup">
                <div>Danger Will Robinson</div>
                <button onClick={this.action}>OK</button>
                <button onClick={this.props.cancelEdit}>Cancel</button>
            </div>);
    }
});

var ITypeSwitcher = React.createClass({
    onTypeChange: function(e){
        this.props.onTypeChange(e.target.value);
    },
    onAddType: function(){
        var new_infoTypes = JSON.parse( JSON.stringify( this.props.info_types ));
        new_infoTypes["new info type"] = {
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
        this.props.onAddType(new_infoTypes);
    },
    render: function() {
        var options = [];
        for(key in this.props.info_types){
        //for (var j = 0; j < this.props.info_types.length; ++j) {
            options.push( <option key={key} value={key}>{key}</option> );
        }
        var buttonAddType = "";
        if(this.props.onAddType)
            buttonAddType = <span className="fa fa-plus-circle clickable" title="new type" onClick={this.onAddType}></span>;

        return (
            <div className="iTypeSwitcher editEntryElement">
                <div className="grid_left">Info type</div>
                <select size={options.length} value={this.props.selected_iType} ref="selector" onChange={this.onTypeChange}>
                    {options}
                </select>
                {buttonAddType}
            </div>);
    }
});


var InfoTypes = React.createClass({
    getInitialState: function() {
        for (var first in this.props.info_types) break;
        return {
            selectedTypeName: first
        };
    },
    //componentWillReceiveProps: function(nextProps) {
    //    this.setState({
    //        selectedTypeName: nextProps.info_types.length-1
    //    });
    //},
    onFieldNameEdit: function(fieldNameIndex, event) {
        this.props.onFieldNameEdit(this.state.selectedTypeName, fieldNameIndex, event.target.value);
    },
    onNameEdit: function(event) {
        this.props.onNameEdit(this.state.selectedTypeName, event.target.value);
    },
    onTypeChange: function(iTypeName){
        this.setState({selectedTypeName: iTypeName});
    },
    onFieldsResize: function(fieldNameIndex){
        this.props.onResize(this.state.selectedTypeName, fieldNameIndex)
    },
    render: function() {
        if(this.props.show) {
            var iType_elements = [];
            for (var i = 0; i < this.props.info_types[this.state.selectedTypeName].fieldNames.length; ++i) {
                iType_elements.push(
                    <Input
                        type="text"
                        key={i}
                        bsSize="small"
                        addonBefore={"Label "+ i}
                        value={this.props.info_types[this.state.selectedTypeName].fieldNames[i]}
                        onChange={this.onFieldNameEdit.bind(this, i)}
                        buttonAfter={<Button bsStyle="danger" onClick={this.onFieldsResize.bind(this, i)}>delete!</Button>}
                    />
                )
            }

            return (
                <div className="InfoTypes Component">
                    <div className="editEntryContainer">
                        <ITypeSwitcher selected_iType={this.state.selectedTypeName} onTypeChange={this.onTypeChange}
                            info_types={this.props.info_types} onAddType={this.props.onEdit}/>
                        <Input
                            type="text"
                            bsSize="small"
                            addonBefore="Type name"
                            value={this.state.selectedTypeName}
                            onChange={this.onNameEdit}
                        />
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