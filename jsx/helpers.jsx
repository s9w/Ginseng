module.exports = {filterInfo: function (filterStr, info, typename){
    if(filterStr===""){
        return true
    }
    try {
        return eval(
            filterStr.replace(
                /tag: ?([\wäÄü/ÜöÖß]+)/g, function (match, p1) {
                    return "(_(info.tags).contains(\"" + p1 + "\"))";
                }
            ).replace(
                /createdBefore: ?([\w\-:\.\+\-]+)/g, function (match, p1) {
                    return "moment(info.creationDate).isBefore(moment(\"" + p1 + "\"))";
                }
            ).replace(
                /type: ?"([\w ]+)"/g, function (match, p1) {
                    return "typename === \"" + p1 + "\"";
                }
            )
        );
    }
    catch (e) {
        console.log("Filter malformed! Filter was: " + filterStr);
        return false;
    }
},
    getPreciseIntervalStr: function (interval){
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
},

    getShortPreciseIntervalStr: function (interval){
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

};
