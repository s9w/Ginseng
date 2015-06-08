function filterInfo(filterStr, info, typename){
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
}

var ReviewInterface = React.createClass({
    getInitialState() {
        return {
            progressState: "profileChoice",
            activeProfileKey: false
        };
    },
    componentWillMount(){
        // Skip Profile choice if there's only one
        if(_.keys(this.props.profiles).length === 1){
            this.setState({
                activeProfileKey: _.keys(this.props.profiles)[0]
            });
        }
    },
    focusInput(){
        if(this.state.progressState === "frontSide" && !this.props.useGuess){
            this.refs.flipButton.getDOMNode().focus();
        }
    },
    componentDidMount(){
        this.focusInput();
    },
    componentDidUpdate : function(){
        this.focusInput();
    },
    flip(){
        this.setState({progressState: "backSide"});
    },
    applyInterval(infoIndex, reviewKey, newInterval){
        this.props.applyInterval(infoIndex, reviewKey, newInterval);
        this.setState({
            progressState: "frontSide"
        });
    },

    selectProfile(profileKey){
        this.setState({
            activeProfileKey: profileKey,
            progressState: "frontSide"
        })
    },
    getUrgency(templateReviews){
        if(templateReviews.length > 0) {
            var lastReview = _.last(templateReviews);
            var realInterval = moment().diff(moment(lastReview.reviewTime));
            var plannedInterval = moment(lastReview.dueTime).diff(moment(lastReview.reviewTime));
            return realInterval / plannedInterval;
        }else {
            return 1.1;
        }
    },
    guessChange(event){
        this.setState({guess: event.target.value});
    },
    handleGuessKeyDown(evt) {
        if (evt.keyCode == 13 ) {
            this.flip()
        }
    },
    getDueCounts(){
        //var dueCounts =
        //_(this.props.profiles).mapValues((profile, profileKey) =>
        //    _(this.props.infos).map((info, infoIndex) =>
        //        _(info.reviews).filter((template, templateID) =>
        //            this.filterInfo(this.props.types[info.typeID].templates[templateID].condition, info) &&
        //            this.filterInfo(this.props.profiles[profileKey].condition, info) &&
        //            this.getUrgency(template) >= this.props.profiles[profileKey].dueThreshold
        //        ).value().length
        //    ).reduce((a,b) => a+b)
        //).value();

        var dueCounts =
            _(this.props.profiles).mapValues((profile, profileKey) =>
                _(this.props.infos).map((info, infoIndex) =>
                    _(info.reviews).filter((review, reviewKey) =>
                        filterInfo(this.props.types[info.typeID].templates[reviewKey].condition, info, this.props.types[info.typeID].name) &&
                        filterInfo(this.props.profiles[profileKey].condition, info, this.props.types[info.typeID].name) &&
                        (
                            review.length > 0 ?
                            moment().diff(moment(_.last(review).reviewTime)) / moment(_.last(review).dueTime).diff(moment(_.last(review).reviewTime)) :
                                1.1
                        ) >= this.props.profiles[profileKey].dueThreshold
                    ).value().length
                ).reduce((a,b) => a+b)
            ).value();


        //var dueCounts = _.mapValues(this.props.profiles, () => 0);
        //for(var profileKey in this.props.profiles) {
        //    for (let infoIndex = 0; infoIndex < this.props.infos.length; ++infoIndex) {
        //        var info = this.props.infos[infoIndex];
        //        for(var templateID in info.reviews){
        //            if (
        //                this.filterInfo(this.props.types[info.typeID].templates[templateID].condition, info) &&
        //                this.filterInfo(this.props.profiles[profileKey].condition, info) &&
        //                this.getUrgency(info.reviews[templateID]) >= this.props.profiles[profileKey].dueThreshold
        //            ) {
        //                dueCounts[profileKey] += 1;
        //            }
        //        }
        //    }
        //}

        return dueCounts;
    },
    getNextReview(profileKey){
        var dueness;
        var realInterval;
        var nextReview = {
            dueness: 0.0,
            dueCount: 0
        };
        for (var infoIndex = 0; infoIndex < this.props.infos.length; ++infoIndex) {
            var info = this.props.infos[infoIndex];
            for(var templateID in info.reviews){
                if(info.reviews[templateID].length > 0) {
                    realInterval = moment().diff(moment(_.last(info.reviews[templateID]).reviewTime));
                    dueness = realInterval / info.plannedIntervals[templateID];
                }else {
                    dueness = 1.1;
                    realInterval = 0;
                }
                if( info["templateConditions"][templateID] &&
                    info["profileConditions"][profileKey] &&
                    dueness >= this.props.profiles[profileKey].dueThreshold
                ){
                    nextReview.dueCount++;
                    if (dueness > nextReview.dueness) {
                        nextReview.dueness = dueness;
                        nextReview.info = info;
                        nextReview.infoIndex = infoIndex;
                        nextReview.templateID = templateID;
                        nextReview.realInterval = realInterval;
                    }
                }
            }
        }
        return nextReview;
    },
    render() {
        if(!this.state.activeProfileKey){
            var nextReviews = _.mapValues(this.props.profiles, (val, profileKey) => this.getNextReview(profileKey));
            var sortedProfiles = _(this.props.profiles).mapValues((n, i) => _.merge(n, {"id":i})).values().value();
            sortedProfiles = sortedProfiles.sort((a, b) =>a.name.localeCompare(b.name));
            return(
                <div className="Component">
                    <section className="Component">
                        <h3>Select review profile</h3>
                    </section>
                    <table className = "profileTable" >
                        <thead>
                            <tr>
                                <th>Profile</th>
                                <th>Due Count</th>
                            </tr>
                        </thead>
                        < tbody >
                            {_(sortedProfiles).map((profile) =>
                                <tr onClick={this.selectProfile.bind(null, profile.id)}>
                                    <td>{profile.name}</td>
                                    <td>{nextReviews[profile.id].dueCount}</td>
                                </tr>
                            ).value()}
                        </tbody>
                    </table>
                </div>
            );
        }

        else{
            let nextReview = this.getNextReview(this.state.activeProfileKey);
            return (
                <div className="Component">
                    <div className="flexRowDistribute">
                        <button
                            tabIndex="2"
                            onClick={this.props.gotoEdit.bind(null, nextReview.infoIndex, nextReview.templateID)}>
                            Edit Info
                        </button>
                        <div className="reviewStatusElement">
                            <span className="reviewStatusHeading">Due: </span>
                            <span>{nextReview.dueCount}</span>
                        </div>
                        <div className="reviewStatusElement">
                            <span className="reviewStatusHeading">Dueness: </span>
                            <span>{nextReview.dueness.toFixed(1)}</span>
                        </div>
                        <div className="reviewStatusElement">
                            <span className="reviewStatusHeading">Profile: </span>
                            <span>{this.props.profiles[this.state.activeProfileKey].name}</span>
                        </div>
                    </div>

                    {nextReview.dueCount >=1 &&
                        <div>
                            <ReviewContent
                                template={this.props.types[nextReview.info.typeID].templates[nextReview.templateID]}
                                templateData={_.zipObject(this.props.types[nextReview.info.typeID].entryNames, nextReview.info.entries)}
                                progressState={this.state.progressState}
                                useGuess={this.props.useGuess}
                                onFlip={this.flip}
                            />

                            {this.state.progressState === "frontSide" &&
                                <div style={{textAlign: "center"}}>
                                    <button
                                        tabIndex="1"
                                        ref="flipButton"
                                        className="buttonGood"
                                        onClick={this.flip}>
                                        Show backside
                                    </button>
                                </div>
                            }

                            <Intervaller
                                show={this.state.progressState === "backSide"}
                                lastInterval={nextReview.realInterval}
                                applyInterval={this.applyInterval.bind(this, nextReview.infoIndex, nextReview.templateID)}
                                timeIntervalChoices={this.props.timeIntervalChoices}
                                rememberModType={this.props.rememberModType}
                            />
                        </div>
                    }
                </div>
            );
        }
    }
});
