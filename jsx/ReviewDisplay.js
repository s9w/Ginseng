var ReviewDisplay = React.createClass({
    getDefaultProps: function() {
        return {
            progressState: 'backSide'
        };
    },
    shouldComponentUpdate(nextProps, nextState){
        return nextProps.progressState !== this.props.progressState;
    },
    //componentWillReceiveProps(nextProps){
    //    if(nextProps.progressState === "frontSide"){
    //
    //    }
    //},
    renderMarkdown(str){
        var latexStringBuffer = [];
        // replace math with $$
        var backStrNew = str.replace(/(\$.*?\$)/g, function(match, p1){
            latexStringBuffer.push(p1.slice(1,-1));
            return '$$';
        });
        // convert rest markdown to html
        marked.setOptions({breaks: true, smartLists: true});
        return marked(backStrNew).replace(/\$\$/g, function(){
            // and replace the placeholders with transformed math
            try {
                return katex.renderToString(latexStringBuffer.shift());
            }catch(e){
                console.log("Error: " + e.message);
                return "ERROR.";
            }
        });
    },
    render(){
        var thisOuter = this;
        var template = this.props.template;
        var frontStr = template.front.replace(
            /{(\w*)}/g, function (match, p1) {
                return thisOuter.props.templateData[p1];
            });

        var backStr = template.back.replace(
            /{(\w*)}/g, function (match, p1) {
                return thisOuter.props.templateData[p1];
            });

        return(
            <div id="reviewStage">
                <div
                    className="markdowned"
                    dangerouslySetInnerHTML={{__html: this.renderMarkdown(frontStr)}}>
                </div>
                {this.props.progressState === "backSide" &&
                    <hr className={this.props.progressState === "backSide" ? "" : "invisible"} />
                }

                {this.props.progressState === "backSide" && this.props.guess &&
                    <div>
                        {JsDiff.diffChars(backStr, this.props.guess).map((part)=>
                            <span
                                className={(part.added || part.removed) ? 'guessWrong' : 'guessCorrect'}>
                                {part.value}
                            </span>
                        )}
                    </div>
                }

                {this.props.progressState === "backSide" &&
                    <div
                        className={"markdowned"}
                        dangerouslySetInnerHTML={{__html: this.renderMarkdown(backStr)}}>
                    </div>
                }
            </div>
        )
    }
});
