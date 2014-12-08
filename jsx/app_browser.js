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
            var Table = ReactBootstrap.Table;

            return (
                <div className="InfoBrowser Component">
                    <div className="browseControls">
                        <input type="text" placeholder="Quick filter..." value={this.state.filterText}
                            onChange={this.onFilterChange}/>
                        <button onClick={this.props.onNew}>New info</button>
                    </div>
                    <Table responsive striped condensed hover>
                        <thead><tr>
                                <th>1st</th>
                                <th>2nd</th>
                                <th>Type</th>
                                <th>Tags</th>
                            </tr></thead>
                        <tbody>
                            {tableRows }
                        </tbody>
                    </Table>
                </div>
            );
        } else{
            return(<div></div>);
        }
    }
});