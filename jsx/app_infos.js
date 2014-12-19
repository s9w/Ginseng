var InfoEdit = React.createClass({
    getInitialState: function() {
        var infoNew;
        if(!("info" in this.props)){
            var firstTypeID = "0";
            while(!(firstTypeID in this.props.types)){
                firstTypeID = (parseInt(firstTypeID, 10)+1).toString();
            }
            infoNew = this.getNewInfo(firstTypeID);
        }else{
            infoNew = JSON.parse( JSON.stringify( this.props.info ));
        }
        return {
            info: infoNew,
            previewID: false
        };
    },
    componentDidMount: function(){
        // Only focus first text field with new infos. Otherwise confusing/unwanted, especially on mobile
        if(!("info" in this.props)) {
            this.refs.firstTextbox.getDOMNode().focus();
        }
    },
    componentWillReceiveProps: function(nextProps){
        // Should always be "new"
        if(!("info" in nextProps)){
            var firstTypeID = "0";
            while(!(firstTypeID in this.props.types)){
                firstTypeID = (parseInt(firstTypeID, 10)+1).toString();
            }
            this.setState({info: this.getNewInfo(firstTypeID)});
        }
    },
    getNewInfo: function(typeID){
        var infoNew = {typeID: typeID};
        var fields = [];
        var reviews = {};
        for (var i = 0; i < this.props.types[typeID].fieldNames.length; ++i) {
            fields.push("");
            reviews[i] = [];
        }
        infoNew.fields = fields;
        infoNew.reviews = reviews;
        infoNew.tags = [];
        infoNew.creationDate = moment().format();
        return infoNew;
    },
    onTypeChange: function(newTypeID){
        var newInfo = JSON.parse( JSON.stringify( this.state.info ));
        newInfo.typeID = newTypeID;
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
    onSave: function(){
        this.props.onSave(this.state.info);
    },
    addUsedTag: function (nextTagStr) {
        var newInfo = JSON.parse( JSON.stringify( this.state.info ));
        newInfo.tags .push(nextTagStr);
        this.setState( {info: newInfo} );
    },
    editType: function(){
        this.props.editType(this.state.info.typeID)
    },
    setPreview: function(newPreview){
        this.setState({previewID: newPreview});
    },
    render: function() {
        var data_elements = [];
        for (var fieldIdx = 0; fieldIdx < this.state.info.fields.length; ++fieldIdx) {
            var element_name = this.props.types[this.state.info.typeID].fieldNames[fieldIdx];
            var refString = false;
            if(fieldIdx===0){
                refString = "firstTextbox";
            }
            data_elements.push(
                <section key={fieldIdx}>
                    <h3>Entry: {element_name}</h3>
                    <textarea
                        className="sectionContent"
                        ref={refString}
                        value={this.state.info.fields[fieldIdx]}
                        onChange={this.onFieldEdit.bind(this, fieldIdx)}
                        rows={(this.state.info.fields[fieldIdx].match(/\n/g) || []).length+1}
                    />
                </section>
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

        var deleteButton = false, saveButtonStr = "add";
        if("onDelete" in this.props){
            deleteButton = <span className="button buttonDanger" onClick={this.props.onDelete}>Delete</span>;
            saveButtonStr = "save";
        }

        var infoTypeSection;
        if("info" in this.props){ //edit
            infoTypeSection =
                <section>
                    <h3>Info Type</h3>
                    <div className="sectionContent">
                        <a
                            onClick={this.editType}
                            href="#">{this.props.types[this.state.info.typeID].name}</a>
                    </div>
                </section>;
        }else{ // new
            infoTypeSection = <ITypeSwitcher
                types={this.props.types}
                selectedTypeID={this.state.info.typeID}
                onTypeChange={this.onTypeChange}
            />
        }

        var viewButtons = [];
        viewButtons.push(
            <button
                key={"none"}
                className={"flexElemContHoriz button " + (this.state.previewID ? "" : "buttonGood")}
                onClick={this.setPreview.bind(this, false)}>{"None"}
            </button>
        );
        for (var viewID in this.props.types[this.state.info.typeID].views) {
            viewButtons.push(
                <button
                    key={viewID}
                    className={"flexElemContHoriz button " + (this.state.previewID && this.state.previewID === viewID ? "buttonGood" : "")}
                    onClick={this.setPreview.bind(this, viewID)}>{"View " + viewID}
                </button>
            );
        }
        var previewEl = false;
        if(this.state.previewID){
            previewEl = <ReviewDisplay
                type={this.props.types[this.state.info.typeID]}
                viewID={this.state.previewID}
                info={this.state.info}
                progressState="backSide"
            />;
        }

        return (
            <div className="InfoEdit Component">
                <div className="sectionContainer">
                    {infoTypeSection}
                    {data_elements}
                    <section>
                        <h3>Tags</h3>
                        <textarea
                            className="sectionContent"
                            rows={1}
                            type="text"
                            value={this.state.info.tags.join(", ")}
                            onChange={this.onTagsEdit}
                        />
                        <div className="sectionContent">
                            used: {usedTagEls}
                        </div>
                    </section>
                </div>

                <section>
                    <h3>Preview</h3>
                    <div className="sectionContent tabContainer">
                        {viewButtons}
                    </div>
                </section>

                {previewEl}

                <div className="flexContHoriz">
                    <span
                        className={"button buttonGood "+ (isChanged?"disabled":"")}
                        onClick={this.onSave}>{saveButtonStr}
                    </span>
                    <span className="button" onClick={this.props.cancelEdit}>Cancel</span>
                    {deleteButton}
                </div>
            </div>);
    }
});

var Popup = React.createClass({
    render: function() {
        return (
            <div
                className="popup">
                <p>{this.props.text}</p>
                {this.props.buttonContainer}
            </div>);
    }
});

var ITypeSwitcher = React.createClass({
    onTypeChange: function(typeID){
        this.props.onTypeChange(typeID);
    },
    render: function() {
        var typeNameOptions = [];
        for(var typeID in this.props.types){
            typeNameOptions.push(
                <div
                    key={typeID}
                    style={{margin: "1px"}}
                    className="CombiButton">
                    <button
                        className={"button"+(this.props.selectedTypeID===typeID?" buttonGood":"")}
                        onClick={this.onTypeChange.bind(this, typeID)}>{this.props.types[typeID].name}</button>
                </div>
            );
        }
        if(this.props.onAddType) {
            typeNameOptions.push(
                <button
                    className="button"
                    key="new"
                    onClick={this.props.onAddType}>New..</button>
            );
        }

        return (
            <section>
                <h3>Info type</h3>
                <div className="sectionContent wrap">
                    {typeNameOptions}
                </div>
            </section>);
    }
});
