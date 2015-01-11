var TemplateDetails = React.createClass({
    onViewChange(type, value){
        if(type === "condition"){
            this.props.onViewChange(type, value["condition"]);
        }else{
            this.props.onViewChange(type, value);
        }

    },
    render(){
        var isTemplateLegal = _(this.props.template).pick("front", "back").mapValues(
                value=>value.match(/{(\w*)}/g).every(
                    entryName => _(this.props.entryNames).contains(entryName.slice(1, -1))
                )
            ).value();
        return (
            <div>
                <section>
                    <h3>Front</h3>
                    <Textarea
                        isLegal={isTemplateLegal.front}
                        value={this.props.template.front}
                        placeholder="Front template"
                        onEntryEdit={this.onViewChange.bind(this, "front")}
                    />
                </section>

                <section>
                    <h3>Back</h3>
                    <Textarea
                        isLegal={isTemplateLegal.back}
                        value={this.props.template.back}
                        placeholder="Front template"
                        onEntryEdit={this.onViewChange.bind(this, "back")}
                    />
                </section>

                <Editor
                    path={this.props.template}
                    objects={[
                        {
                            displayName: "Filter",
                            key: "condition",
                            displayType: "input",
                            placeholder: "Empty condition matches all"
                        }
                    ]}
                    onUpdate={this.onViewChange.bind(null, "condition")}
                />

                <section>
                    <h3>Delete</h3>
                    <div>
                        <button
                            className="buttonDanger"
                            onClick={this.props.delete}>
                            Delete this Template
                        </button>
                    </div>
                </section>

            </div>
        );
    }
});