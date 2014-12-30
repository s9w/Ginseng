var InfoEdit = React.createClass({
    getInitialState() {
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
            previewID: false,
            scrollHeights: {}
        };
    },
    componentDidMount(){
        //Only focus first text field with new infos. Otherwise confusing/unwanted, especially on mobile
        if(!("info" in this.props)) {
            this.refs[0].getDOMNode().focus();
        }
    },
    componentWillReceiveProps(nextProps){
        // Should always be "new"
        if(!("info" in nextProps)){
            var firstTypeID = "0";
            while(!(firstTypeID in this.props.types)){
                firstTypeID = (parseInt(firstTypeID, 10)+1).toString();
            }
            this.setState({info: this.getNewInfo(firstTypeID)});
        }
    },
    getNewInfo(typeID){
        var infoNew = {typeID: typeID};
        var entries = [];
        var reviews = {};
        for (var i = 0; i < this.props.types[typeID].entryNames.length; ++i) {
            entries.push("");
            reviews[i] = [];
        }
        infoNew.entries = entries;
        infoNew.reviews = reviews;
        infoNew.tags = [];
        infoNew.creationDate = moment().format();
        return infoNew;
    },
    onTypeChange(newTypeID){
        var newInfo = JSON.parse( JSON.stringify( this.state.info ));
        newInfo.typeID = newTypeID;
        var newEntriesLength = this.props.types[newTypeID].entryNames.length;
        var sizeDiff = newEntriesLength - this.state.info.entries.length;
        if( sizeDiff > 0 ){
            for(var i=0; i<sizeDiff; i++){
                newInfo.entries.push("");
            }
        } else if(sizeDiff < 0){
            newInfo.entries = newInfo.entries.slice(0, newEntriesLength);
        }
        this.setState({info: newInfo});
    },
    onEntryEdit(entryIndex, event) {
        var newInfo = JSON.parse( JSON.stringify( this.state.info ));
        var scrollHeights = JSON.parse( JSON.stringify( this.state.scrollHeights ));
        scrollHeights[entryIndex] = this.refs[entryIndex].getDOMNode().scrollHeight;
        newInfo.entries[entryIndex] = event.target.value;
        this.setState({
            info: newInfo,
            scrollHeights: scrollHeights
        });
    },
    onTagsEdit(event) {
        var newInfo = JSON.parse( JSON.stringify( this.state.info ));
        if(event.target.value === ""){
            newInfo.tags = [];
        }else{
            newInfo.tags = event.target.value.replace(/ /g, "").split(",");
        }
        this.setState( {info: newInfo} );
    },
    addUsedTag(nextTagStr) {
        var newInfo = JSON.parse( JSON.stringify( this.state.info ));
        newInfo.tags .push(nextTagStr);
        this.setState( {info: newInfo} );
    },
    editType(){
        this.props.editType(this.state.info.typeID)
    },
    setPreview(newPreview){
        this.setState({previewID: newPreview});
    },
    render() {
        // Typename
        var infoTypeSection;
        if("info" in this.props){ //edit
            infoTypeSection =
                <section>
                    <h3>Info Type</h3>
                    <span className="sectionContent">{this.props.types[this.state.info.typeID].name}</span>
                </section>;
        }else{ // new
            infoTypeSection =
                <section>
                    <h3>Info Type</h3>
                    <ITypeSwitcher
                        className="sectionContent"
                        types={this.props.types}
                        selectedTypeID={this.state.info.typeID}
                        onTypeChange={this.onTypeChange}
                    />
                </section>;
        }

        // the entries
        var entrySections = [];
        for (var entryIdx = 0; entryIdx < this.state.info.entries.length; ++entryIdx) {
            var ss = {"overflow": "hidden"};
            if(entryIdx in this.state.scrollHeights){
                ss = {"overflow": "hidden", "height": this.state.scrollHeights[entryIdx]-4+"px"}
            }
            entrySections.push(
                <textarea
                    key={entryIdx}
                    value = {this.state.info.entries[entryIdx]}
                    placeholder={this.props.types[this.state.info.typeID].entryNames[entryIdx]}
                    className= "sectionContent"
                    style={ss}
                    onChange={this.onEntryEdit.bind(this, entryIdx)}
                    ref={entryIdx}
                />
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
                    <a key={index}
                        onClick={this.addUsedTag.bind(this, this.props.usedTags[index])}
                        href="#">{seperator + this.props.usedTags[index]}</a>
                );
            }
        }

        var deleteButton = false;
        var saveButtonStr = "add";
        if("onDelete" in this.props){
            deleteButton = <button className="buttonDanger" onClick={this.props.onDelete}>Delete</button>;
            saveButtonStr = "save";
        }

        var templateButtons = [];
        templateButtons.push(
            <button
                key={"none"}
                className={"flexElemContHoriz button " + (this.state.previewID ? "" : "buttonGood")}
                onClick={this.setPreview.bind(this, false)}>{"None"}
            </button>
        );
        for (var templateID in this.props.types[this.state.info.typeID].templates) {
            templateButtons.push(
                <button
                    key={templateID}
                    className={"flexElemContHoriz button " + (this.state.previewID && this.state.previewID === templateID ? "buttonGood" : "")}
                    onClick={this.setPreview.bind(this, templateID)}>{"Template " + templateID}
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

        var isChanged = JSON.stringify(this.props.info)!==JSON.stringify(this.state.info);

        return (
            <div className="InfoEdit Component">
                {infoTypeSection}
                <section>
                    <h3>Entries</h3>
                    {entrySections}
                </section>

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

                <section>
                    <h3>Preview</h3>
                    <div className="sectionContent tabContainer">
                        {templateButtons}
                    </div>
                </section>

                {previewEl}

                <div className="flexContHoriz">
                    <button
                        disabled={!isChanged}
                        className="buttonGood"
                        onClick={this.props.onSave.bind(null, this.state.info)}>{saveButtonStr}</button>
                    <button onClick={this.props.cancelEdit}>Cancel</button>
                    {deleteButton}
                </div>
            </div>);
    }
});

var Popup = React.createClass({
    render() {
        return (
            <div
                className="popup">
                <p>{this.props.text}</p>
                {this.props.buttonContainer}
            </div>);
    }
});

var ITypeSwitcher = React.createClass({
    onTypeChange(typeID){
        this.props.onTypeChange(typeID);
    },
    render() {
        var typeNameOptions = [];
        for(var typeID in this.props.types){
            typeNameOptions.push(
                <button
                    key={typeID}
                    className={"button"+(this.props.selectedTypeID===typeID?" buttonGood":"")}
                    onClick={this.onTypeChange.bind(this, typeID)}>{this.props.types[typeID].name}</button>
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
            <div className="sectionContent wrap">
                {typeNameOptions}
            </div>
        );
    }
});
