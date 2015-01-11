var InfoEdit = React.createClass({
    getInitialState() {
        return {
            info: _.cloneDeep( this.props.info ),
            previewID: false,
            newTagValue: ""
        };
    },
    onTypeChange(newTypeID){
        var newInfo = _.cloneDeep( this.state.info );
        newInfo.typeID = newTypeID;
        var newEntriesLength = this.props.types[newTypeID].entryNames.length;
        var sizeDiff = newEntriesLength - this.state.info.entries.length;
        if( sizeDiff > 0 ){
            newInfo.entries = newInfo.entries.concat(_.times(sizeDiff, x => ""));
        } else if(sizeDiff < 0){
            newInfo.entries = newInfo.entries.slice(0, newEntriesLength);
        }
        this.setState({info: newInfo});
    },
    toggleTag(toggledTag){
        var newInfo = _.cloneDeep( this.state.info );
        if(_.contains(newInfo.tags, toggledTag)){
            newInfo.tags.splice(newInfo.tags.indexOf(toggledTag), 1);
        }else{
            newInfo.tags.push(toggledTag);
            newInfo.tags = newInfo.tags.sort( (a,b) => a.localeCompare(b));
        }
        this.setState( {info: newInfo, newTagValue: ""} );
    },

    setPreview(newPreview){
        this.setState({previewID: newPreview});
    },
    onEntryEdit(entryIndex, entryValue){
        var newInfo = _.cloneDeep( this.state.info );
        newInfo.entries[entryIndex] = entryValue;
        this.setState({
            info: newInfo
        });
    },
    handleNewTagChange(e){
        this.setState({newTagValue: e.target.value})
    },
    render() {
        return (
            <div className="InfoEdit Component">
                <section>
                    <h3>Info Type</h3>
                    {_(this.props.types).keys().value().length>1?
                        <DictSelector
                            dict={this.props.types}
                            selectedID={this.state.info.typeID}
                            onSelectionChange={this.onTypeChange}
                        />:
                        <span>
                            {this.props.types[this.state.info.typeID].name}
                        </span>
                    }
                </section>

                <section>
                    <h3>Entries</h3>
                    {this.state.info.entries.map((entry, entryIdx) =>
                        <Textarea
                            key={entryIdx}
                            value={entry}
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
                                onClick={this.toggleTag.bind(this, tag)}>
                                {tag}
                            </button>
                        )}
                    </div>
                    <div>
                        <input
                            value={this.state.newTagValue}
                            size={8}
                            placeholder="New tag"
                            onChange={this.handleNewTagChange}
                        />
                        <button onClick={this.toggleTag.bind(this, this.state.newTagValue)}>Add</button>
                    </div>
                </section>

                <section>
                    <h3>Preview</h3>
                    <div>
                        <button
                            key={"none"}
                            className={(this.state.previewID ? "" : "buttonGood")}
                            onClick={this.setPreview.bind(this, false)}>
                        {"None"}
                        </button>
                        {_(this.props.types[this.state.info.typeID].templates).keys().value().map( templateID =>
                            <button
                                key={templateID}
                                className={(this.state.previewID === templateID ? "buttonGood" : "")}
                                onClick={this.setPreview.bind(this, templateID)}>
                                {"Templ. " + templateID}
                            </button>
                        )}
                    </div>
                </section>

                {this.state.previewID &&
                    <div>
                        <span>Due {moment(_.last(this.state.info.reviews[this.state.previewID]).dueTime).fromNow()}</span>
                        <ReviewDisplay
                            template={this.props.types[this.state.info.typeID].templates[this.state.previewID]}
                            templateData={_.zipObject(this.props.types[this.state.info.typeID].entryNames, this.state.info.entries)}
                        />
                    </div>
                }

                <div className="flexContHoriz">
                    <button
                        disabled={JSON.stringify(this.props.info) === JSON.stringify(this.state.info)}
                        className="buttonGood"
                        onClick={this.props.onSave.bind(null, this.state.info)}>
                        {this.props.onDelete?"Save":"Add"}
                    </button>

                    <button onClick={this.props.cancelEdit}>Cancel</button>

                    {this.props.onDelete &&
                        <button
                            className="buttonDanger"
                            onClick={this.props.onDelete}>
                            Delete
                        </button>
                    }
                </div>
            </div>
        );
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
                {..._(this.props).pick(["value", "placeholder"]).value() }
                onChange={this.onEntryEdit}
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

