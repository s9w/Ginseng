var InfoEdit = React.createClass({
    getInitialState() {
        return {
            info: JSON.parse( JSON.stringify( this.props.info )),
            previewID: false,
            newTagValue: ""
        };
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
    onEntryEdit(entryIdx, value){
        var newInfo = JSON.parse( JSON.stringify( this.state.info ));
        newInfo.entries[entryIdx] = value;
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
                    <TypeSwitcher
                        className="sectionContent"
                        types={this.props.types}
                        selectedTypeID={this.state.info.typeID}
                        onTypeChange={this.onTypeChange}
                    />
                </section>;
        }
        return (
            <div className="InfoEdit Component">
                {infoTypeSection}

                <section>
                    <h3>Entries</h3>
                    {this.state.info.entries.map((entry, entryIdx) =>
                        <Textarea
                            key={entryIdx}
                            value = {entry}
                            placeholder={this.props.types[this.state.info.typeID].entryNames[entryIdx]}
                            onEntryEdit={this.onEntryEdit.bind(this, entryIdx)}
                        />
                    )}
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
                            size={8}
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

var Textarea = React.createClass({
    componentDidMount(){
        this.getDOMNode().style.height = this.getDOMNode().scrollHeight-4+"px";
    },
    onEntryEdit(){
        this.getDOMNode().style.height = 'auto';
        this.getDOMNode().style.height = this.getDOMNode().scrollHeight-4+"px";
        this.props.onEntryEdit(this.getDOMNode().value);
    },
    render() {
        return (
            <textarea
                value = {this.props.value}
                placeholder={this.props.placeholder}
                onChange={this.onEntryEdit}
                style={{"overflow": "hidden"}}
            />
        );
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

var TypeSwitcher = React.createClass({
    onTypeChange(event){
        this.props.onTypeChange(event.target.value);
    },
    render() {
        return (
            <div className="flexRow">
                <select
                    size={_.max([_.keys(this.props.types).length, 2])}
                    onChange={this.onTypeChange}
                    style={{overflow:"hidden"}}
                    value={this.props.selectedTypeID}>
                        {_.map(this.props.types, (type, typeID) =>
                            <option
                                key={typeID}
                                value={typeID}>{type.name}</option>
                        )}
                </select>
                {"onDeleteType" in this.props &&
                    <div>
                        <button onClick={this.props.onAddType}>New</button>
                        <button
                            className="buttonDanger"
                            disabled={!this.props.onDeleteType}
                            onClick={this.props.onDeleteType}>Delete</button>
                    </div>
                }
            </div>
        );
    }
});
