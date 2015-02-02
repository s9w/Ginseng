function getPreciseIntervalStr(interval){
    var duration = moment.duration(interval);
    if(duration.asMinutes()<=1)
        return "<1 min";
    if(duration.asYears() >= 1)
        return (Math.round(duration.asYears() * 10)/10)+" years";
    if(duration.asMonths() >= 1)
        return (Math.round(duration.asMonths() * 10)/10)+" months";
    if(duration.asWeeks() >= 1)
        return (Math.round(duration.asWeeks() * 10)/10)+" weeks";
    if(duration.asDays() >= 1)
        return (Math.round(duration.asDays() * 10)/10)+" days";
    if(duration.asHours() >= 1)
        return (Math.round(duration.asHours() * 10)/10)+" hours";
    if(duration.asMinutes() >= 1)
        return (Math.round(duration.asMinutes() * 10)/10)+" minutes";
}

function getShortPreciseIntervalStr(interval){
    var duration = moment.duration(interval);
    if(duration.asMinutes()<=1)
        return "<1 min";
    if(duration.asYears() >= 1)
        return (Math.round(duration.asYears() * 10)/10)+" y";
    if(duration.asMonths() >= 1)
        return (Math.round(duration.asMonths() * 10)/10)+" m";
    if(duration.asWeeks() >= 1)
        return (Math.round(duration.asWeeks() * 10)/10)+" w";
    if(duration.asDays() >= 1)
        return (Math.round(duration.asDays() * 10)/10)+" d";
    if(duration.asHours() >= 1)
        return (Math.round(duration.asHours() * 10)/10)+" h";
    if(duration.asMinutes() >= 1)
        return (Math.round(duration.asMinutes() * 10)/10)+" m";
}

var InfoBrowser = React.createClass({
    getInitialState() {
        return {
            filterText: "",
            tagFilterText: "",
            sortOrder: "1"
        };
    },
    onFilterChange(event) {
        this.setState({filterText: event.target.value});
    },
    onTagFilterChange(event) {
        this.setState({tagFilterText: event.target.value});
    },
    changeSortOrder(order){
        var newOrder = order;
        if(this.state.sortOrder === order){
            newOrder += "r";
        }
        this.setState({sortOrder: newOrder})
    },
    render(){
        // sort
        var thisBrowser = this;
        var sortedInfos = this.props.infos.sort(function(a, b){
            switch (thisBrowser.state.sortOrder) {
                case "1":
                    return a.entries[0].localeCompare(b.entries[0]);
                    break;
                case "1r":
                    return -(a.entries[0].localeCompare(b.entries[0]));
                    break;
                case "2":
                    return a.entries[1].localeCompare(b.entries[1]);
                    break;
                case "2r":
                    return -(a.entries[1].localeCompare(b.entries[1]));
                    break;
                case "age":
                    return (moment(a.creationDate).isBefore(b.creationDate))?1:-1;
                    break;
                case "ager":
                    return (moment(a.creationDate).isBefore(b.creationDate))?-1:1;
                    break;
            }
        });

        var activeTags = _.filter(this.props.usedTags, s => s.indexOf( this.state.tagFilterText ) !== -1 );

        // generate trs
        var tableRows = [];
        var thData;
        for (let i = 0; i < sortedInfos.length; ++i) {
            var entry0InSelection = sortedInfos[i].entries[0].toLowerCase().indexOf(this.state.filterText.toLowerCase()) !== -1;
            var entry1InSelection = sortedInfos[i].entries[1].toLowerCase().indexOf(this.state.filterText.toLowerCase()) !== -1;
            var tagsInSelection = sortedInfos[i].tags.length===0 || !( _.isEmpty(_.intersection(sortedInfos[i].tags, activeTags)) );
            if( (entry0InSelection || entry1InSelection) && tagsInSelection ) {
                var ds=[];
                thData = [
                    sortedInfos[i].entries[0],
                    sortedInfos[i].entries[1],
                    this.props.types[sortedInfos[i].typeID].name,
                    sortedInfos[i].tags.join(", "),
                    getShortPreciseIntervalStr(moment().diff(moment(sortedInfos[i].creationDate)))
                ];
                for (let j = 0; j < thData.length; ++j) {
                    var content = thData[j];
                    ds.push(
                        <td key={j}>{content}</td>
                    );
                }
                tableRows.push(
                    <tr key={i} onClick={this.props.onRowSelect.bind(null, i)}>
                        {ds}
                    </tr>
                );
            }
        }

        // Table headers based on sort order
        var th_1 = "1st";
        var th_2 = "2nd";
        var th_age = "Age";
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
            case "age":
                th_age += "↓";
                break;
            case "ager":
                th_age += "↑";
                break;
        }

        return (
            <div className="InfoBrowser Component">
                <section>
                    <h3>Info Browser</h3>
                    <div className="flexRowDistribute">
                        <button className="button buttonGood" onClick={this.props.onNew}>New info</button>
                        <input
                            className="flexContentVariable"
                            type="text"
                            placeholder="Entry filter"
                            value={this.state.filterText}
                            onChange={this.onFilterChange}
                        />
                        <input
                            className="flexContentVariable"
                            type="text"
                            placeholder="Tag filter"
                            value={this.state.tagFilterText}
                            onChange={this.onTagFilterChange}
                        />
                    </div>
                    <table className="infoTable">
                        <colgroup>
                            <col width="20%" />
                            <col width="20%" />
                            <col width="20%" />
                            <col width="20%" />
                            <col width="10%" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th className="clickable" onClick={this.changeSortOrder.bind(this, "1")}>{th_1}</th>
                                <th className="clickable" onClick={this.changeSortOrder.bind(this, "2")}>{th_2}</th>
                                <th>Type</th>
                                <th>Tags</th>
                                <th className="clickable" onClick={this.changeSortOrder.bind(this, "age")}>{th_age}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableRows }
                        </tbody>
                    </table>
                </section>
            </div>
        );
    }
});