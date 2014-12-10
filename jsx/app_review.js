var converter = new Showdown.converter();

//function getSelected(infos, selectionStr){
//    if(selectionStr === "")
//        return infos;
//    console.log("selectionStr: " + selectionStr);
//    var selectedInfos = [];
//    var selectionStr_new = selectionStr.replace(/ /g, "");
//    selectionStr_new = selectionStr_new.split(" OR ").map(function(el){
//        return el.split(",").map(function(fc){
//            fc = fc.replace(/tag:(\w+)/, 'infos[i].tags.indexOf("$1") !== -1');
//            return fc;
//        }).join(" && ")
//    }).join(" || ");
//    console.log("selectionStr_new: " + selectionStr_new);
//
//    for (var i = 0; i < infos.length; ++i) {
//        if( eval(selectionStr_new) ){
//            selectedInfos.push(infos[i]);
//        }
//    }
//    console.log("selectedInfos: " + JSON.stringify( selectedInfos) );
//    return selectedInfos;
//}

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
        this.refs.flipButton.getDOMNode().focus();
    },
    flip: function(){
        this.setState({progressState: "backSide"});

    },
    applyInterval: function(newInterval){
        this.props.applyInterval(newInterval);
        this.setState({progressState: "frontSide"});
    },
    render: function() {
        return (
            <div className="Review Component">
                <div id="reviewToolbar">
                    <span id="reviewToolbarLeft">{this.props.dueCount}</span>
                    <button id="reviewToolbarRight"
                        ref="flipButton"
                        className={"buttonMain buttonGood "+ (this.state.progressState === "frontSide"?"":"invisible")}
                        onClick={this.flip} >Show backside
                    </button>
                </div>


                <div id="reviewStage">
                    <div className="markdowned"
                        dangerouslySetInnerHTML={{__html: converter.makeHtml( this.props.frontStr )}}></div>
                    <div className={"markdowned "+(this.state.progressState==="backSide"?"":"invisible")}
                        dangerouslySetInnerHTML={{__html: converter.makeHtml( this.props.backStr )}}></div>
                </div>

                <Intervaller
                    show={this.state.progressState==="backSide"}
                    reviewInterval={this.props.reviewInterval}
                    applyInterval={this.applyInterval}
                    timeIntervalChoices={this.props.timeIntervalChoices}
                />
            </div>);
    }
});
