var InfoBrowser = React.createClass({
    getInitialState: function() {
        return {
            filterText: "",
            sortOrder: "1"
        };
    },
    onFilterChange: function(event) {
        this.setState({filterText: event.target.value});
    },
    onRowSelect: function(index){
        this.props.onRowSelect(index);
    },
    changeSortOrder: function(order){
        var newOrder = order;
        if(this.state.sortOrder === order){
            newOrder += "r";
        }
        this.setState({sortOrder: newOrder})
    },
    render: function(){
        // sort
        var thisBrowser = this;
        var sortedInfos = this.props.infos.sort(function(a, b){
            switch (thisBrowser.state.sortOrder) {
                case "1":
                    return a.fields[0].localeCompare(b.fields[0]);
                    break;
                case "1r":
                    return -(a.fields[0].localeCompare(b.fields[0]));
                    break;
                case "2":
                    return a.fields[1].localeCompare(b.fields[1]);
                    break;
                case "2r":
                    return -(a.fields[1].localeCompare(b.fields[1]));
                    break;
            }
        });

        // generate trs
        var tableRows = [];
        for (var i = 0; i < sortedInfos.length; ++i) {
            if( sortedInfos[i].fields[0].toLowerCase().indexOf(this.state.filterText.toLowerCase()) !== -1 ||
                sortedInfos[i].fields[1].toLowerCase().indexOf(this.state.filterText.toLowerCase()) !== -1) {
                var ds=[];
                var thData = [sortedInfos[i].fields[0], sortedInfos[i].fields[1],
                    this.props.typeNames[sortedInfos[i].typeID], sortedInfos[i].tags.join(", ")];
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

        // Table headers based on sort order
        var th_1 = "1st";
        var th_2 = "2nd";
        switch (this.state.sortOrder) {
            case "1":
                th_1 += "↓";
                break;
            case "1r":
                th_1 += "↑";
                break;
            case "2":
                th_2 += "↓";
                break;
            case "2r":
                th_2 += "↑";
                break;
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
                            <th onClick={this.changeSortOrder.bind(this, "1")}>{th_1}</th>
                            <th onClick={this.changeSortOrder.bind(this, "2")}>{th_2}</th>
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