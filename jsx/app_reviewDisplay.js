var ReviewDisplay = React.createClass({
    renderMarkdown: function(str){
        var latexStringBuffer = [];
        // replace math with $$
        var backStrNew = str.replace(/(\$.*?\$)/g, function(match, p1){
            latexStringBuffer.push(p1.slice(1,-1));
            return '$$';
        });
        // convert rest markdown to html
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
    render: function(){
        var thisOuter = this;
        var frontStr = this.props.type.views[this.props.viewID].front.replace(
            /{(\w*)}/g, function (match, p1) {
                return thisOuter.props.info.fields[thisOuter.props.type.fieldNames.indexOf(p1)];
            });

        var backStr = this.props.type.views[this.props.viewID].back.replace(
            /{(\w*)}/g, function (match, p1) {
                return thisOuter.props.info.fields[thisOuter.props.type.fieldNames.indexOf(p1)];
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
