var converter = new Showdown.converter();

var Review = React.createClass({
    getInitialState: function() {
        return {
            reviewIndex: 0
        };
    },
    nextReview: function(){
        this.setState({reviewIndex: this.state.reviewIndex+1});
    },
    render: function() {
        var i, j, k, info, lastReview, iTypeName, iTypeIndex, iType;
        var fieldnameToIndex = {};
        for (i = 0; i < this.props.info_types.length; ++i) {
            for (j = 0; j < this.props.info_types[i].fieldNames.length; ++j) {
                fieldnameToIndex[ this.props.info_types[i].fieldNames[j] ] = j;
            }
        }

        var reviewsItems = [];
        for (i = 0; i < this.props.infos.length; ++i) {
            info = this.props.infos[i];
            for (j = 0; j < info.reviews.length; ++j) {
                if( info.reviews[j].length === 0 ){
                    lastReview = {
                        reviewTime: "never",
                        dueTime: moment().format(),
                        modifier: ""
                    };
                }else{
                    lastReview = info.reviews[j][ info.reviews[j].length-1 ];
                }

                iTypeName = info.type;
                iTypeIndex = this.props.iTypeIdxLookup[iTypeName];
                iType = this.props.info_types[iTypeIndex];
                var frontStr = iType.views[j].front;
                var backStr =  iType.views[j].back;
                for (k = 0; k < iType.fieldNames.length; ++k) {
                    var regex = new RegExp("{" + iType.fieldNames[k] + "}", "g");
                    frontStr = frontStr.replace(regex, info.fields[ fieldnameToIndex[iType.fieldNames[k]] ]);
                    backStr  =  backStr.replace(regex, info.fields[ fieldnameToIndex[iType.fieldNames[k]] ]);
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
        //console.log("reviewsItems: " + JSON.stringify(reviewsItems, null, "  ") + ", length: " + reviewsItems.length);
        //converter.makeHtml( reviewsItems[this.state.reviewIndex].front )
        return (
            <div className="Review Component">
                <div dangerouslySetInnerHTML={{__html: converter.makeHtml( reviewsItems[this.state.reviewIndex].front )}}></div>
                <div>BREAK</div>
                <div dangerouslySetInnerHTML={{__html: converter.makeHtml( reviewsItems[this.state.reviewIndex].back )}}></div>
                <button onClick={this.nextReview}>next</button>
                <div>
                    <span>Status</span>
                    <span>{this.state.reviewIndex+1 + "/" + reviewsItems.length}</span>
                </div>
            </div>);
    }
});
