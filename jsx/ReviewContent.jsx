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
    componentDidMount: function (root) {
        this.renderMathJax();
    },
    componentDidUpdate: function (prevProps, state) {
        //this.renderMathJax();
        //var math = MathJax.Hub.getAllJax("frontsideCanvas");
        //console.log("debzug math: " + JSON.stringify(math));
        //MathJax.Hub.Queue(["Text",math,"x+1"]);
        //MathJax.Hub.queue.Push(["Text",math,"x+1"]);

        this.renderMathJax();
    },
    renderMathJax(){
        MathJax.Hub.Queue(["Typeset",MathJax.Hub, this.refs["frontsideCanvas"].getDOMNode()]);
        if(this.props.progressState === "backSide"){
            MathJax.Hub.Queue(["Typeset",MathJax.Hub, this.refs["backsideCanvas"].getDOMNode()]);
        }
    },
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
        var backStrNew = str.replace(/(\$.*?\$)/g, function(match, p1){
            latexStringBuffer.push(p1);
            return '$$';
        });
        return marked(backStrNew).replace(/\$\$/g, function(){
            // and replace the placeholders with transformed math
            return latexStringBuffer.shift();
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
                    ref="frontsideCanvas"
                    id="frontsideCanvas"
                    className="markdowned"
                    dangerouslySetInnerHTML={{__html: this.renderMarkdown(frontStr)}}>
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
                        dangerouslySetInnerHTML={{__html: this.renderMarkdown(backStr)}}>
                    </div>
                }
            </div>
        )
    }
});
