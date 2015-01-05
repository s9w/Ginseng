var InfoEdit = React.createClass({
    getInitialState() {
        return {
            info: JSON.parse( JSON.stringify( this.props.info )),
            previewID: false,
            newTagValue: ""
        };
    },
    componentDidMount(){
        console.log("componentDidMount");
        for (let entryIdx = 0; entryIdx < this.state.info.entries.length; ++entryIdx) {
            this.refs[entryIdx].getDOMNode().style.height = this.refs[entryIdx].getDOMNode().scrollHeight-4+"px";
        }
    //    //Only focus first text field with new infos. Otherwise confusing/unwanted, especially on mobile
    //    if(!("info" in this.props)) {
    //        this.refs[0].getDOMNode().focus();
    //    }
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
    toggleTag(tagStr){
        var newInfo = JSON.parse( JSON.stringify( this.state.info ));
        if(_.contains(newInfo.tags, tagStr)){
            newInfo.tags.splice(newInfo.tags.indexOf(tagStr), 1);
        }else{
            newInfo.tags.push(tagStr);
        }
        this.setState( {info: newInfo, newTagValue: ""} );
    },

    setPreview(newPreview){
        this.setState({previewID: newPreview});
    },
    onEntryEdit(event){
        var newInfo = JSON.parse( JSON.stringify( this.state.info ));
        var node = this.refs[event.target.name].getDOMNode();
        node.style.height = 'auto';
        node.style.height = node.scrollHeight-4+"px";
        newInfo.entries[event.target.name] = event.target.value;
        this.setState({
            info: newInfo
        });
    },
    handleNewTagChange(e){
        this.setState({newTagValue: e.target.value})
    },
    render() {
        var infoTypeSection;
        if(this.props.info.entries[0]!==""){ //edit
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
        for (let entryIdx = 0; entryIdx < this.state.info.entries.length; ++entryIdx) {
            entrySections.push(
                <textarea
                    key={entryIdx}
                    value = {this.state.info.entries[entryIdx]}
                    placeholder={this.props.types[this.state.info.typeID].entryNames[entryIdx]}
                    onChange={this.onEntryEdit}
                    style={{"overflow": "hidden"}}
                    name={entryIdx}
                    ref={entryIdx}
                />
            );
        }

        return (
            <div className="InfoEdit Component">
                {infoTypeSection}

                <section>
                    <h3>Entries</h3>
                    {entrySections}
                </section>

                <section>
                    <h3>Tags</h3>
                    <div>
                        {_.union(this.props.usedTags, this.state.info.tags).map(tag =>
                            <button
                                key={tag}
                                className={_.contains(this.state.info.tags, tag)?"buttonGood":""}
                                onClick={this.toggleTag.bind(this, tag)}
                                >{tag}</button>
                        )}
                        <input
                            value={this.state.newTagValue}
                            placeholder="new tag"
                            onChange={this.handleNewTagChange}
                        />
                        <button onClick={this.toggleTag.bind(this, this.state.newTagValue)}>+</button>
                    </div>
                </section>

                <section>
                    <h3>Preview</h3>
                    <div>
                        <button
                            key={"none"}
                            className={(this.state.previewID ? "" : "buttonGood")}
                            onClick={this.setPreview.bind(this, false)}>{"None"}
                        </button>
                        {_.keys(this.props.types[this.state.info.typeID].templates).map( templateID =>
                            <button
                                key={templateID}
                                className={(this.state.previewID === templateID ? "buttonGood" : "")}
                                onClick={this.setPreview.bind(this, templateID)}>{"Templ. " + templateID}
                            </button>
                        )}
                    </div>
                </section>

                {this.state.previewID &&
                    <ReviewDisplay
                        type={this.props.types[this.state.info.typeID]}
                        templateID={this.state.previewID}
                        info={this.state.info}
                        progressState="backSide"
                    />
                }

                <div className="flexContHoriz">
                    <button
                        disabled={JSON.stringify(this.props.info) === JSON.stringify(this.state.info)}
                        className="buttonGood"
                        onClick={this.props.onSave.bind(null, this.state.info)}>{this.props.onDelete?"save":"add"}</button>

                    <button onClick={this.props.cancelEdit}>Cancel</button>

                    {this.props.onDelete &&
                        <button className="buttonDanger" onClick={this.props.onDelete}>Delete</button>
                    }
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
