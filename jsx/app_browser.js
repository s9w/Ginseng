var InfoBrowser = React.createClass({
    getInitialState: function() {
        return {
            filterText: ""
        };
    },
    onFilterChange: function(event) {
        this.setState({filterText: event.target.value});
    },
    onRowSelect: function(index){
        this.props.onRowSelect(index);
    },
    render: function() {
        // generate filtered table rows
        var tableRows = [];
        for (var i = 0; i < this.props.infos.length; ++i) {
            if( this.props.infos[i].fields[0].toLowerCase().indexOf(this.state.filterText.toLowerCase()) !== -1 ||
                this.props.infos[i].fields[1].toLowerCase().indexOf(this.state.filterText.toLowerCase()) !== -1) {
                var ds=[];
                var thData = [this.props.infos[i].fields[0], this.props.infos[i].fields[1],
                    this.props.typeNames[this.props.infos[i].typeID], this.props.infos[i].tags.join(", ")];
                for (var j = 0; j < thData.length; ++j) {
                    var content;
                    var shortenLen = (j===2?5:15);
                    if(thData[j].length > shortenLen){
                        content= thData[j].slice(0,shortenLen)+"...";
                    }else{
                        content= thData[j];
                    }
                    ds.push(<td key={j}>{content}</td>);
                }
                tableRows.push(
                    <tr key={i} onClick={this.onRowSelect.bind(this, i)}>
                        {ds}
                    </tr>
                );
            }
        }

        return (
            <div className="InfoBrowser Component">
                <div className="browseControls">
                    <input type="text" placeholder="Quick filter..." value={this.state.filterText}
                        onChange={this.onFilterChange}/>
                    <span className="button buttonGood" onClick={this.props.onNew}>New info</span>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>1st</th>
                            <th>2nd</th>
                            <th>Type</th>
                            <th>Tags</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows }
                    </tbody>
                </table>
            </div>
        );
    }
});