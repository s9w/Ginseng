var Views = React.createClass({
    //getInitialState: function() {
    //    var firstIndex = 0;
    //    while(!(firstIndex in this.props.views)){
    //        firstIndex++;
    //    }
    //    return {
    //        selectedViewID: firstIndex.toString()
    //    };
    //},
    //selectView: function(e){
    //    this.setState({selectedViewID: e.target.value});
    //},
    onViewChange: function(type, event){
        this.props.onViewChange(type, event.target.value);
    },
    render: function(){
        var returnEls = [];
        returnEls.push(
            <section key={1}>
                <h3>Front</h3>
                <textarea
                    className="sectionContent"
                    value={this.props.view.front}
                    rows={(this.props.view.front.match(/\n/g) || []).length+1}
                    onChange={this.onViewChange.bind(this, "front")}
                />
            </section>
        );
        returnEls.push(
            <section key={2}>
                <h3>Back</h3>
                <textarea
                    className="sectionContent"
                    value={this.props.view.back}
                    rows={(this.props.view.back.match(/\n/g) || []).length+1}
                    onChange={this.onViewChange.bind(this, "back")}
                />
            </section>
        );
        returnEls.push(
            <section key={3}>
                <h3>Filter</h3>
                <input
                    className="sectionContent"
                    value={this.props.view.condition}
                    onChange={this.onViewChange.bind(this, "condition")}
                />
            </section>
        );
        return(
            <div>
                {returnEls}
            </div>
        );
    }
});