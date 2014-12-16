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
                case "a":
                    return (moment(a.creationDate).isBefore(b.creationDate))?1:-1;
                    break;
                case "ar":
                    return (moment(a.creationDate).isBefore(b.creationDate))?-1:1;
                    break;
            }
        });

        // generate trs
        var maxAge = 0;
        var age;
        var tableRows = [];
        var thData;
        for (var k = 0; k < sortedInfos.length; ++k) {
            age = moment().diff(moment(sortedInfos[k].creationDate));
            if( age>maxAge){
                maxAge = age;
            }
        }
        for (var i = 0; i < sortedInfos.length; ++i) {
            age = moment().diff(moment(sortedInfos[i].creationDate));
            if( sortedInfos[i].fields[0].toLowerCase().indexOf(this.state.filterText.toLowerCase()) !== -1 ||
                sortedInfos[i].fields[1].toLowerCase().indexOf(this.state.filterText.toLowerCase()) !== -1) {
                var ds=[];
                thData = [
                    sortedInfos[i].fields[0],
                    sortedInfos[i].fields[1],
                    this.props.types[sortedInfos[i].typeID].name,
                    sortedInfos[i].tags.join(", "),
                    getShortPreciseIntervalStr(age)
                ];
                for (var j = 0; j < thData.length; ++j) {
                    var content;
                    var shortenLen = (j===2?5:15);
                    if(thData[j].length > shortenLen){
                        content= thData[j].slice(0,shortenLen)+"...";
                    }else{
                        content= thData[j];
                    }
                    if(j==4){
                        ds.push(
                            <td key={j}>
                                <div style={{position: "absolute"}}>{content}</div>
                                <div style={{
                                    height: "1em",
                                    background: "#E0E0E0",
                                    width: (age/maxAge*100.0)+"%"
                                }}></div>
                            </td>
                        );
                    }else {
                        ds.push(<td key={j}>{content}</td>);
                    }
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
            case "a":
                th_age += "↓";
                break;
            case "ar":
                th_age += "↑";
                break;
        }

        return (
            <div className="InfoBrowser Component">
                <div className="browseControls">
                    <input type="text" placeholder="Quick filter..." value={this.state.filterText}
                        onChange={this.onFilterChange}/>
                    <button className="button buttonGood" onClick={this.props.onNew}>New info</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th onClick={this.changeSortOrder.bind(this, "1")}>{th_1}</th>
                            <th onClick={this.changeSortOrder.bind(this, "2")}>{th_2}</th>
                            <th>Type</th>
                            <th>Tags</th>
                            <th onClick={this.changeSortOrder.bind(this, "a")}>{th_age}</th>
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