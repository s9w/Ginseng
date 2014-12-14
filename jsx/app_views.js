var Views = React.createClass({
    getInitialState: function() {
        var firstIndex = 0;
        while(!(firstIndex in this.props.views)){
            firstIndex++;
        }
        return {
            selectedViewID: firstIndex.toString()
        };
    },
    selectView: function(e){
        this.setState({selectedViewID: e.target.value});
    },
    onViewChange: function(type, event){
        this.props.onViewChange(this.state.selectedViewID, type, event.target.value);
    },
    render: function(){
        var viewOptions = [];
        for(var viewID in this.props.views){
            viewOptions.push(
                <option
                    key={viewID}
                    value={viewID}>{viewID}
                </option>
            );
        }
        var returnEls = [];
        returnEls.push(
            <section key={0}>
                <h3>View</h3>
                <select
                    className="sectionContent"
                    size={viewOptions.length}
                    value={this.state.selectedViewID}
                    onChange={this.selectView}>
                        {viewOptions}
                </select>
            </section>
        );
        returnEls.push(
            <section key={1}>
                <h3>Front</h3>
                <textarea
                    className="sectionContent"
                    value={this.props.views[this.state.selectedViewID].front}
                    rows={(this.props.views[this.state.selectedViewID].front.match(/\n/g) || []).length+2}
                    onChange={this.onViewChange.bind(this, "front")}
                />
            </section>
        );
        returnEls.push(
            <section key={2}>
                <h3>Back</h3>
                <textarea
                    className="sectionContent"
                    value={this.props.views[this.state.selectedViewID].back}
                    rows={(this.props.views[this.state.selectedViewID].back.match(/\n/g) || []).length+2}
                    onChange={this.onViewChange.bind(this, "back")}
                />
            </section>
        );
        returnEls.push(
            <section key={3}>
                <h3>Filter</h3>
                <input
                    className="sectionContent"
                    value={this.props.views[this.state.selectedViewID].condition}
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