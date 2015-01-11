function filterInfo(filterStr, info){
    if(filterStr===""){
        return true
    }

    return eval(
        filterStr.replace(
            /tag: ?(\w+)/g, function (match, p1) {
                return "(_(info.tags).contains(\"" + p1 + "\"))";
            }
        ).replace(
            /createdBefore: ?([\w\-:\.\+\-]+)/g, function (match, p1) {
                return "moment(info.creationDate).isBefore(moment(\""+p1+"\"))";
            }
        )
    );
}

var Review = React.createClass({
    getInitialState() {
        return {
            progressState: "frontSide",
            activeProfileKey: false
        };
    },
    componentWillMount(){
        // Skip Profile if there's only one
        if(_.keys(this.props.profiles).length === 1){
            this.setState({
                activeProfileKey: _.keys(this.props.profiles)[0]
            });
        }
    },
    componentDidMount(){
        if("flipButton" in this.refs)
            this.refs.flipButton.getDOMNode().focus();
    },
    componentDidUpdate : function(){
        if(this.state.progressState === "frontSide" && "flipButton" in this.refs)
            this.refs.flipButton.getDOMNode().focus();
    },
    flip(){
        this.setState({progressState: "backSide"});
    },
    applyInterval(infoIndex, reviewKey, newInterval){
        this.props.applyInterval(infoIndex, reviewKey, newInterval);
        this.setState({progressState: "frontSide"});
    },

    selectProfile(profileKey){
        this.setState({
            activeProfileKey: profileKey
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
                        filterInfo(this.props.types[info.typeID].templates[reviewKey].condition, info) &&
                        filterInfo(this.props.profiles[profileKey].condition, info) &&
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

        console.log("dueCounts: " + JSON.stringify(dueCounts));
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
                    var lastReview = _.last(info.reviews[templateID]);
                    realInterval = moment().diff(moment(lastReview.reviewTime));
                    var plannedInterval = moment(lastReview.dueTime).diff(moment(lastReview.reviewTime));
                    dueness = realInterval / plannedInterval;
                }else {
                    dueness = 1.1;
                    realInterval = 0;
                }
                if( filterInfo(this.props.types[info.typeID].templates[templateID].condition, info) &&
                    filterInfo(this.props.profiles[profileKey].condition, info) &&
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
        var nextReviews = _.mapValues(this.props.profiles, (val, profileKey) => this.getNextReview(profileKey));

        if(!this.state.activeProfileKey){
            return(
                <section className="Component">
                    <h3>Select review profile</h3>
                    {_(this.props.profiles).map((profile, key) =>
                        <div>
                            <button
                                onClick={this.selectProfile.bind(null, key)}>
                                {profile.name}
                            </button>
                            <span>Due: {nextReviews[key].dueCount}</span>
                        </div>
                    )}
                </section>
            );
        }

        else{
            let nextReview = nextReviews[this.state.activeProfileKey];
            return (
                <div className="Component">
                    <button
                        tabIndex="2"
                        onClick={this.props.gotoEdit.bind(null, nextReview.infoIndex)}>
                        Edit Info
                    </button>
                    <span>{"Due count: " + nextReview.dueCount}</span>

                    {nextReview.dueCount >=1 && <div>
                        <ReviewDisplay
                            template={this.props.types[nextReview.info.typeID].templates[nextReview.templateID]}
                            templateData={_.zipObject(this.props.types[nextReview.info.typeID].entryNames, nextReview.info.entries)}
                            progressState={this.state.progressState}
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
                        />
                    </div>}
                </div>
            );
        }
    }
});
