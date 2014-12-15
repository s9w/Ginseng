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
        if(this.state.progressState === "frontSide")
            this.refs.flipButton.getDOMNode().focus();
    },
    flip: function(){
        this.setState({progressState: "backSide"});

    },
    applyInterval: function(newInterval){
        this.props.applyInterval(newInterval);
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
    gotoEdit: function(){
        this.props.gotoEdit(this.props.nextInfoIndex);
    },
    render: function() {
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
        return (
            <div className="Review Component">
                <div>
                    <button
                        className="button"
                        tabIndex="2"
                        onClick={this.gotoEdit}
                    >Edit Info</button>
                    <span>{"Due count: "+this.props.dueCount}</span>
                </div>

                <div id="reviewStage">
                    <div className="markdowned"
                        dangerouslySetInnerHTML={{__html: this.getRenderedStr( this.props.frontStr )}}></div>
                    <div className={"markdowned "+(this.state.progressState==="backSide"?"":"invisible")}
                        dangerouslySetInnerHTML={{__html: this.getRenderedStr(this.props.backStr) }}></div>
                </div>

                {flipButton}
                <Intervaller
                    show={this.state.progressState==="backSide"}
                    reviewInterval={this.props.reviewInterval}
                    applyInterval={this.applyInterval}
                    timeIntervalChoices={this.props.timeIntervalChoices}
                />
            </div>);
    }
});
