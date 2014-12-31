var ReviewDisplay = React.createClass({
    renderMarkdown(str){
        var latexStringBuffer = [];
        // replace math with $$
        var backStrNew = str.replace(/(\$.*?\$)/g, function(match, p1){
            latexStringBuffer.push(p1.slice(1,-1));
            return '$$';
        });
        // convert rest markdown to html
        marked.setOptions({breaks: true});
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
    shouldComponentUpdate: function (nextProps, nextState) {
        return nextProps.info.typeID !== this.props.info.templateID ||
            JSON.stringify(nextProps.info.entries) !== JSON.stringify(this.props.info.entries) ||
            nextProps.progressState !== this.props.progressState;
    },
    render(){
        console.log("render ReviewDisplay");
        var thisOuter = this;
        var frontStr = this.props.type.templates[this.props.templateID].front.replace(
            /{(\w*)}/g, function (match, p1) {
                return thisOuter.props.info.entries[thisOuter.props.type.entryNames.indexOf(p1)];
            });

        var backStr = this.props.type.templates[this.props.templateID].back.replace(
            /{(\w*)}/g, function (match, p1) {
                return thisOuter.props.info.entries[thisOuter.props.type.entryNames.indexOf(p1)];
            });
        return(
            <div id="reviewStage">
                <div
                    className="markdowned"
                    dangerouslySetInnerHTML={{__html: this.renderMarkdown(frontStr)}}></div>
                <div
                    className={"markdowned " + (this.props.progressState === "backSide" ? "" : "invisible")}
                    dangerouslySetInnerHTML={{__html: this.renderMarkdown(backStr)}}></div>
            </div>
        )
    }
});
