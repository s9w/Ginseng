module.exports = React.createClass({
    onChange(event){
        var newDict = _.pick(this.props.path, _.pluck(this.props.objects, "key"));
        newDict[event.target.name] = event.target.value;
        this.props.onUpdate(newDict);
    },
    render() {
        var innerHtml;
        var thisOuter = this;
        return (
            <div>
                {this.props.objects.map(function (object) {
                    if (object.displayType === "label") {
                        innerHtml = <span>{thisOuter.props.path[object.key]}</span>;
                    } else if (object.displayType === "input") {
                        innerHtml = <input
                            type="text"
                            name={object.key}
                            onChange={thisOuter.onChange}
                            value={thisOuter.props.path[object.key]}
                            placeholder={object.placeholder}
                            />
                    }
                    return (
                        <section key={object.key}>
                            <h3>{object.displayName}</h3>
                            {innerHtml}
                        </section>
                    );

                })}
            </div>
        )
    }
});
