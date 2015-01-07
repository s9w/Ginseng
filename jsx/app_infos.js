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
                <Editor
                    path={this.props.types[this.state.info.typeID]}
                    objects={[
                        {
                            displayName: "Info Type",
                            key: "name",
                            displayType: "label"
                        }
                    ]}

                />

        } else { // new
            infoTypeSection =
                <section>
                    <h3>Info Type</h3>
                    <DictSelector
                        dict={this.props.types}
                        selectedID={this.state.info.typeID}
                        onSelectionChange={this.onTypeChange}
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

var DictSelector = React.createClass({
    onSelectionChange(event){
        this.props.onSelectionChange(event.target.value);
    },
    render() {
        return (
            <div className="flexRow">
                <select
                    size={_.max([_.keys(this.props.dict).length, 2])}
                    onChange={this.onSelectionChange}
                    style={{overflow:"hidden", minWidth: "100px"}}
                    value={this.props.selectedID}>
                        {_.map(this.props.dict, (element, key) =>
                            <option
                                key={key}
                                value={key}>{element.name}</option>
                        )}
                </select>
                {"onDeleteElement" in this.props &&
                    <div>
                        <button onClick={this.props.onAddElement}>New</button>
                        <button
                            className="buttonDanger"
                            disabled={!this.props.onDeleteElement}
                            onClick={this.props.onDeleteElement}>Delete</button>
                    </div>
                }
            </div>
        );
    }
});
