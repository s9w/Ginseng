var Review = React.createClass({
    getInitialState() {
        return {
            progressState: "frontSide"
        };
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
    filterInfo(filterStr, info){
        if(filterStr===""){
            return true
        }
        var filterStrNew = filterStr.replace(/ /g, "");
        var filters = filterStrNew.split(",");
        for (var i = 0; i < filters.length; ++i) {
            if(filters[i] === ""){
                console.log("   empty?");
            }
            else if(filters[i] === "tag:reverse"){
                if(info.tags.indexOf("reverse") === -1){
                    return false;
                }
            }else{
                console.log("other filter, eek");
            }
        }
        return true;
    },
    render() {
        // flip button
        var flipButton= false;
        if(this.state.progressState === "frontSide")
            flipButton =
                <div style={{textAlign: "center"}}>
                    <button
                        tabIndex="1"
                        ref="flipButton"
                        className={"button buttonGood "+ (this.state.progressState === "frontSide"?"":"invisible")}
                        onClick={this.flip} >Show backside
                    </button>
                </div>;

        // filter due cards and chose the next
        var urgency;
        var dueCount = 0;
        var actualIntervalMs;
        var nextReview = {
            urgency: 1.0,
            infoIndex: 0,
            info: false,
            viewID: 0,
            realInterval: 0
        };
        for (var infoIndex = 0; infoIndex < this.props.infos.length; ++infoIndex) {
            var info = this.props.infos[infoIndex];
            for(var templateID in info.reviews){
                if( !(this.filterInfo(this.props.types[info.typeID].templates[templateID].condition, info))){
                    continue;
                }
                if(info.reviews[templateID].length > 0) {
                    var lastDueTimeStr = info.reviews[templateID][info.reviews[templateID].length - 1].dueTime;
                    var lastReviewTimeStr = info.reviews[templateID][info.reviews[templateID].length - 1].reviewTime;
                    var plannedIntervalMs = moment(lastDueTimeStr).diff(moment(lastReviewTimeStr));
                    actualIntervalMs = moment().diff(moment(lastReviewTimeStr));
                    urgency = actualIntervalMs / plannedIntervalMs;
                }else {
                    urgency = 1.1;
                    actualIntervalMs = 0;
                }
                if(urgency>=1.0)
                    dueCount++;
                if( urgency>nextReview.urgency ){
                    nextReview.urgency = urgency;
                    nextReview.info = this.props.infos[infoIndex];
                    nextReview.infoIndex = infoIndex;
                    nextReview.viewID = templateID;
                    nextReview.realInterval = actualIntervalMs;
                }
            }
        }

        if (dueCount > 0) {
            return (
                <div className="Component">
                    <div>
                        <button
                            className="button"
                            tabIndex="2"
                            onClick={this.props.gotoEdit.bind(null, nextReview.infoIndex)}
                        >Edit Info</button>
                        <span>{"Due count: " + dueCount}</span>
                    </div>

                    <ReviewDisplay
                        type={this.props.types[nextReview.info.typeID]}
                        viewID={nextReview.viewID}
                        info={nextReview.info}
                        progressState={this.state.progressState}
                    />

                    {flipButton}
                    <Intervaller
                        show={this.state.progressState === "backSide"}
                        reviewInterval={nextReview.realInterval}
                        applyInterval={this.applyInterval.bind(this, nextReview.infoIndex, nextReview.viewID)}
                        timeIntervalChoices={this.props.timeIntervalChoices}
                    />
                </div>
            );
        }
        else {
            return (
                <div
                    className="Component"
                    style={{textAlign: "center"}}>No due reviews
                </div>
            )
        }
    }
});
