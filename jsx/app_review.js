var converter = new Showdown.converter();

function getSelected(infos, selectionStr){
    if(selectionStr === "")
        return infos;
    console.log("selectionStr: " + selectionStr);
    var selectedInfos = [];
    var selectionStr_new = selectionStr.replace(/ /g, "");
    selectionStr_new = selectionStr_new.split(" OR ").map(function(el){
        return el.split(",").map(function(fc){
            fc = fc.replace(/tag:(\w+)/, 'infos[i].tags.indexOf("$1") !== -1');
            return fc;
        }).join(" && ")
    }).join(" || ");
    console.log("selectionStr_new: " + selectionStr_new);

    for (var i = 0; i < infos.length; ++i) {
        if( eval(selectionStr_new) ){
            selectedInfos.push(infos[i]);
        }
    }
    console.log("selectedInfos: " + JSON.stringify( selectedInfos) );
    return selectedInfos;
}

var Review = React.createClass({
    getInitialState: function() {
        return {
            reviewIndex: 0,
            flipped: false
        };
    },
    nextReview: function(){
        this.setState({
            reviewIndex: this.state.reviewIndex+1,
            flipped: false
        });
        //this.refs.flipButton.getDOMNode().focus();
    },
    flip: function(){
        this.setState({flipped: true});
        //this.refs.nextButton.getDOMNode().focus();
    },
    componentDidMount: function(){
        //this.refs.flipButton.getDOMNode().focus();
    },
    render: function() {
        var i, j, k, info, lastReview, iType;

        var filteredInfos = getSelected(this.props.infos, "");
        var reviewsItems = [];
        for (i = 0; i < filteredInfos.length; ++i) {
            info = filteredInfos[i];
            for (j = 0; j < info.reviews.length; ++j) {
                if( info.reviews[j].length === 0 ){
                    lastReview = {
                        reviewTime: "never",
                        dueTime: moment().format()
                    };
                }else{
                    lastReview = info.reviews[j][ info.reviews[j].length-1 ];
                }

                iType = this.props.info_types[info.type];
                var frontStr = iType.views[j].front;
                var backStr =  iType.views[j].back;
                for (k = 0; k < iType.fieldNames.length; ++k) {
                    var regex = new RegExp("{" + iType.fieldNames[k] + "}", "g");
                    frontStr = frontStr.replace(regex, info.fields[ k ]);
                    backStr = backStr.replace(regex, info.fields[ k ]);
                }

                reviewsItems.push({
                    front: frontStr,
                    back: backStr,

                    type: info.type,
                    fields: info.fields,
                    tags: info.tags,
                    lastReview: lastReview
                });
            }
        }
        if(reviewsItems.length === 0){
            return(<div>No reviews</div>);
        }
        var backsideClassname = "markdowned";
        if(!(this.state.flipped))
            backsideClassname += " invisible";
        var lastInterval = moment.duration(moment().diff(reviewsItems[this.state.reviewIndex].lastReview.reviewTime)).asMilliseconds();
        return (
            <div className="Review Component">
                <div id="reviewStage">
                    <div className="markdowned"
                        dangerouslySetInnerHTML={{__html: converter.makeHtml( reviewsItems[this.state.reviewIndex].front )}}></div>
                    <div className={backsideClassname}
                        dangerouslySetInnerHTML={{__html: converter.makeHtml( reviewsItems[this.state.reviewIndex].back )}}></div>
                </div>

                <Intervaller show={this.state.flipped} lastInterval={lastInterval} />

                <span>
                    <button className={this.state.flipped?"invisible":""} onClick={this.flip} ref="flipButton">show backside</button>
                    <span >Status: {this.state.reviewIndex+1 + "/" + reviewsItems.length}</span>
                </span>
            </div>);
    }
});
