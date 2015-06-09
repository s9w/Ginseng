module.exports = React.createClass({
    componentDidMount(){
        this.getDOMNode().style.height = this.getDOMNode().scrollHeight-4+"px";
    },
    onEntryEdit(){
        this.getDOMNode().style.height = 'auto';
        this.getDOMNode().style.height = this.getDOMNode().scrollHeight-4+"px";
        this.props.onEntryEdit(this.getDOMNode().value);
    },
    render() {
        return (
            <textarea
                className={(_(this.props).keys().contains("isLegal") && !this.props.isLegal)?"illegalForm":""}
                {..._(this.props).pick(["value", "placeholder"]).value() }
                onChange={this.onEntryEdit}
                />
        );
    }
});
