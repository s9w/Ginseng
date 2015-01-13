var ReviewContent = React.createClass({
    getDefaultProps: function() {
        return {
            progressState: 'backSide',
            preview: false
        };
    },
    shouldComponentUpdate(nextProps, nextState){
        return this.props.preview || nextProps.progressState !== this.props.progressState;
    },
    renderMarkdown(str){
        var latexStringBuffer = [];
        var hasLatex = false;
        // replace math with $$
        var backStrNew = str.replace(/(\$.*?\$)/g, function(match, p1){
            latexStringBuffer.push(p1.slice(1,-1));
            hasLatex =  true;
            return '$$';
        });
        // convert rest markdown to html
        marked.setOptions({breaks: true, smartLists: true});
        return {Html: marked(backStrNew).replace(/\$\$/g, function(){
            // and replace the placeholders with transformed math
            try {
                return katex.renderToString(latexStringBuffer.shift());
            }catch(e){
                console.log("Error: " + e.message);
                return "ERROR.";
            }
        }), hasLatex: hasLatex};
    },
    onFlip(){
        this.props.onFlip();
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

        var renderedBack = this.renderMarkdown(backStr);
        return(
            <div id="reviewStage">
                <div
                    className="markdowned"
                    dangerouslySetInnerHTML={{__html: this.renderMarkdown(frontStr).Html}}>
                </div>

                {this.props.useGuess && !renderedBack.hasLatex &&
                    <Guessing
                        onFlip={this.onFlip}
                        backStr={(this.props.progressState === "backSide" && this.props.useGuess)?backStr:false}
                    />
                }

                {this.props.progressState === "backSide" &&
                    <hr className={this.props.progressState === "backSide" ? "" : "invisible"} />
                }

                {this.props.progressState === "backSide" &&
                    <div
                        className={"markdowned"}
                        dangerouslySetInnerHTML={{__html: renderedBack.Html}}>
                    </div>
                }
            </div>
        )
    }
});
