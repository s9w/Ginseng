var TemplateDetails = React.createClass({
    onViewChange: function(type, event){
        this.props.onViewChange(type, event.target.value);
    },
    render: function(){
        return(
            <div>
                <section>
                    <h3>Front</h3>
                    <textarea
                        className="sectionContent"
                        value={this.props.view.front}
                        rows={(this.props.view.front.match(/\n/g) || []).length+1}
                        onChange={this.onViewChange.bind(this, "front")}
                    />
                </section>

                <section>
                    <h3>Back</h3>
                    <textarea
                        className="sectionContent"
                        value={this.props.view.back}
                        rows={(this.props.view.back.match(/\n/g) || []).length+1}
                        onChange={this.onViewChange.bind(this, "back")}
                    />
                </section>

                <section>
                    <h3>Filter</h3>
                    <input
                        className="sectionContent"
                        value={this.props.view.condition}
                        onChange={this.onViewChange.bind(this, "condition")}
                    />
                </section>
            </div>
        );
    }
});