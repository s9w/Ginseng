var DictSelector = React.createClass({
    onSelectionChange(event){
        this.props.onSelectionChange(event.target.value);
    },
    render() {
        return (
            <div className="flexRow">
                <select
                    size={_.max([_.keys(this.props.dict).length, 2])}
                    onChange={this.onSelectionChange}
                    style={{minWidth: "100px"}}
                    value={this.props.selectedID}>
                    {_(this.props.dict).map( (value, key) =>
                            <option
                                key={key}
                                value={key}>{value.name}</option>
                    )}
                </select>
                {"onDeleteElement" in this.props &&
                <div>
                    <button
                        onClick={this.props.onAddElement}>
                        New
                    </button>
                    <button
                        className="buttonDanger"
                        disabled={!this.props.onDeleteElement}
                        onClick={this.props.onDeleteElement}>
                        Delete
                    </button>
                </div>
                    }
            </div>
        );
    }
});
