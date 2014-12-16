var Review = React.createClass({
    getInitialState: function() {
        return {
            progressState: "frontSide"
        };
    },
    componentDidMount: function(){
        this.refs.flipButton.getDOMNode().focus();
    },
    componentDidUpdate : function(){
        if(this.state.progressState === "frontSide" && "flipButton" in this.refs)
            this.refs.flipButton.getDOMNode().focus();
    },
    flip: function(){
        this.setState({progressState: "backSide"});

    },
    applyInterval: function(infoIndex, reviewKey, newInterval){
        this.props.applyInterval(infoIndex, reviewKey, newInterval);
        this.setState({progressState: "frontSide"});
    },
    getRenderedStr: function(str){
        var latexStringBuffer = [];
        var backStrNew = str.replace(/(\$.*?\$)/g, function(match, p1){
            latexStringBuffer.push(p1.slice(1,-1));
            return '$$';
        });
        return marked(backStrNew).replace(/\$\$/g, function(){
            return katex.renderToString(latexStringBuffer.shift());
        });
    },
    gotoEdit: function(nextInfoIndex){
        this.props.gotoEdit(nextInfoIndex);
    },
    filterInfo: function(filterStr, info){
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
    render: function() {
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
            viewID: 0,
            realInterval: 0
        };
        for (var infoIndex = 0; infoIndex < this.props.infos.length; ++infoIndex) {
            var info = this.props.infos[infoIndex];
            for(var viewID in info.reviews){
                if( !(this.filterInfo(this.props.types[info.typeID].views[viewID].condition, info))){
                    continue;
                }
                if(info.reviews[viewID].length > 0) {
                    var lastDueTimeStr = info.reviews[viewID][info.reviews[viewID].length - 1].dueTime;
                    var lastReviewTimeStr = info.reviews[viewID][info.reviews[viewID].length - 1].reviewTime;
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
                    nextReview.infoIndex = infoIndex;
                    nextReview.viewID = viewID;
                    nextReview.realInterval = actualIntervalMs;
                }
            }
        }

        var frontStr, backStr;
        var thisReview = this;
        if (dueCount > 0) {
            var nextTypeID = this.props.infos[nextReview.infoIndex].typeID;
            frontStr = this.props.types[nextTypeID].views[nextReview.viewID].front.replace(
                /{(\w*)}/g, function (match, p1) {
                    return thisReview.props.infos[nextReview.infoIndex].fields[thisReview.props.types[nextTypeID].fieldNames.indexOf(p1)];
                });

            backStr = this.props.types[nextTypeID].views[nextReview.viewID].back.replace(
                /{(\w*)}/g, function (match, p1) {
                    return thisReview.props.infos[nextReview.infoIndex].fields[thisReview.props.types[nextTypeID].fieldNames.indexOf(p1)];
                });

            return (
                <div className="Review Component">
                    <div>
                        <button
                            className="button"
                            tabIndex="2"
                            onClick={this.gotoEdit.bind(this, nextReview.infoIndex)}
                        >Edit Info</button>
                        <span>{"Due count: " + dueCount}</span>
                    </div>

                    <div id="reviewStage">
                        <div className="markdowned"
                            dangerouslySetInnerHTML={{__html: this.getRenderedStr(frontStr)}}></div>
                        <div className={"markdowned " + (this.state.progressState === "backSide" ? "" : "invisible")}
                            dangerouslySetInnerHTML={{__html: this.getRenderedStr(backStr)}}></div>
                    </div>

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
        else{
            return(<div></div>)
        }
    }
});
