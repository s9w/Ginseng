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
    componentDidMount: function (root) {
        this.renderMathJax();
    },
    componentDidUpdate: function (prevProps, state) {
        this.renderMathJax();
    },
    renderMathJax(){
        MathJax.Hub.Queue(["Typeset",MathJax.Hub, this.refs["frontsideCanvas"].getDOMNode()]);
        if(this.props.progressState === "backSide"){
            MathJax.Hub.Queue(["Typeset",MathJax.Hub, this.refs["backsideCanvas"].getDOMNode()]);
        }
    },
    renderMarkdown(str){
        marked.setOptions({breaks: true, smartLists: true});
        return marked(str);
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

        return(
            <div id="reviewStage">
                <div
                    ref="frontsideCanvas"
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
                        className={"markdowned"}
                        dangerouslySetInnerHTML={{__html: this.renderMarkdown(backStr)}}>
                    </div>
                }
            </div>
        )
    }
});
