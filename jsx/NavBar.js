var NavBar = React.createClass({
    render() {
        return (
            <div className="navBar unselectable">
                <div
                    className={this.props.activeMode == "status" ? "active" : ""}
                    title={this.props.isChanged?"unsaved changes":""}
                    onClick={this.props.clickNav.bind(null, "status")}>Status<span className={this.props.isChanged?"":"invisible"}>*</span>
                </div>
                <div className={this.props.activeMode == "settings" ? "active" : ""}
                    onClick={this.props.clickNav.bind(null, "settings")}>Settings
                </div>
                <div className={_(["browse", "new", "edit"]).contains(this.props.activeMode) ? "active" : "" }
                    onClick={this.props.clickNav.bind(null, "browse")}>Infos
                </div>
                <div className={this.props.activeMode === "types" ? "active" : ""}
                    onClick={this.props.clickNav.bind(null, "types")}>Types
                </div>
                <div className={this.props.activeMode === "profiles" ? "active" : ""}
                    onClick={this.props.clickNav.bind(null, "profiles")}>Profiles
                </div>
                <div className={_(["review", "reviewPrompt" ]).contains( this.props.activeMode) ? "active" : ""}
                    onClick={this.props.clickNav.bind(null, "review")}>Review
                </div>
            </div>
        )
    }
});
