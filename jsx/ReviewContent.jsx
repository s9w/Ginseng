var Guessing = require('./Guessing.jsx');

module.exports = React.createClass({
    getDefaultProps: function() {
        marked.setOptions({breaks: true});
        return {
            progressState: 'backSide',
            preview: false
        };
    },
    shouldComponentUpdate(nextProps, nextState){
        return this.props.preview || nextProps.progressState !== this.props.progressState;
    },
    //renderMarkdown(str){
    //    var latexStringBuffer = [];
    //    var backStrNew = str.replace(/(\$.*?\$)/g, function(match, p1){
    //        latexStringBuffer.push(p1);
    //        return '$$';
    //    });
    //    return marked(backStrNew).replace(/\$\$/g, function(){
    //        // and replace the placeholders with transformed math
    //        return latexStringBuffer.shift();
    //    });
    //},
    onFlip(){
        this.props.onFlip();
    },
    renderMarkdownOld(str){
        var latexStringBuffer = [];
        var backStrNew = str.replace(/(\$.*?\$)/g, function(match, p1){
            latexStringBuffer.push(p1);
            return '$$';
        });
        return marked(backStrNew).replace(/\$\$/g, function(){
            // and replace the placeholders with transformed math
            return latexStringBuffer.shift();
        });
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
                console.log("Katex Error: " + e.message);
                return "ERROR.";
            }
        }), hasLatex: hasLatex};
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
                    ref="frontsideCanvas"
                    className="markdowned"
                    dangerouslySetInnerHTML={{__html: this.renderMarkdown(frontStr).Html}}>
                </div>

                {this.props.useGuess &&
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
                        ref="backsideCanvas"
                        className="markdowned"
                        dangerouslySetInnerHTML={{__html: renderedBack.Html}}>
                    </div>
                }
            </div>
        )
    }
});
