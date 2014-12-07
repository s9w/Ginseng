function getSelected(infos, selectionStr){
    if(selectionStr === "")
        return infos;

    console.log("selectionStr: " + selectionStr);
    var selectedInfos = [];

    var selectionStr_new = selectionStr.replace(/ /g, "");
    selectionStr_new = selectionStr_new.split(" OR ").map(function(el){
        return el.split(",").map(function(fc){
            fc = fc.replace(/tag:(\w+)/, 'infos[i].tags.indexOf("$1") !== -1');
            return fc;
        }).join(" && ")
    }).join(" || ");
    console.log("selectionStr_new: " + selectionStr_new);

    for (var i = 0; i < infos.length; ++i) {
        if( eval(selectionStr_new) ){
            selectedInfos.push(infos[i]);
        }
    }
    console.log("selectedInfos: " + JSON.stringify( selectedInfos) );
    return selectedInfos;
}

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
        if(this.props.show) {
            // generate filtered table rows
            var tableRows = [];
            for (var i = 0; i < this.props.infos.length; ++i) {
                if( this.props.infos[i].fields[0].toLowerCase().indexOf(this.state.filterText.toLowerCase()) !== -1 ||
                    this.props.infos[i].fields[1].toLowerCase().indexOf(this.state.filterText.toLowerCase()) !== -1) {
                    tableRows.push(
                        <tr key={i} onClick={this.onRowSelect.bind(this, i)}>
                            <td>{this.props.infos[i].fields[0]}</td>
                            <td>{this.props.infos[i].fields[1]}</td>
                            <td>{this.props.infos[i].type}</td>
                            <td>{this.props.infos[i].tags.join(", ")}</td>
                        </tr>
                    );
                }
            }

            return (
                <div className="InfoBrowser Component">
                    <input type="text" placeholder="Quick filter..." value={this.state.filterText}
                        onChange={this.onFilterChange}/><button onClick={this.props.onNew}>New</button>
                    <table>
                        <thead><tr>
                                <th>1st</th>
                                <th>2nd</th>
                                <th>Type</th>
                                <th>Tags</th>
                            </tr></thead>
                        <tbody>
                            {tableRows }
                        </tbody>
                    </table>
                </div>
            );
        } else{
            return(<div></div>);
        }
    }
});