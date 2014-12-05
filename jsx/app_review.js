var Review = React.createClass({
    render: function() {
        if(this.props.show) {
            var reviewsItems = [];
            for (var i = 0; i < this.props.infos.length; ++i) {
                console.log("in info " + i);
                for (var j = 0; j < this.props.infos[i].reviews.length; ++j) {
                    console.log("in review " + j);
                    var lastReview;
                    if( this.props.infos[i].reviews[j].length === 0 ){
                        lastReview = {
                            reviewTime: "never",
                            dueTime: moment().format(),
                            modifier: ""
                        };
                    }else{
                        lastReview = this.props.infos[i].reviews[j][ this.props.infos[i].reviews[j].length-1 ];
                    }
                    reviewsItems.push({
                        type: this.props.infos[i].type,
                        fields: this.props.infos[i].fields,
                        tags: this.props.infos[i].tags,
                        lastReview: lastReview
                    });
                }
            }
            console.log("reviewsItems: " + JSON.stringify(reviewsItems));

            return (
                <div className="Review Component">
                    Hallo :)
                </div>);
        }
        else{
            return ( <div className="Review"></div> );
        }
    }
});
