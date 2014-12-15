var Intervaller = React.createClass({
    getInitialState: function() {
        console.log("construct intervalChoiceGroups");

        // construct intervalChoiceGroups
        var intervalChoiceGroups = [], intervalChoiceGroup=[];
        var timeframeNameDict = ["Minutes","Hours", "Days", "Weeks", "Months", "Relative"];
        for (var intervalGroupIndex = 0; intervalGroupIndex < this.props.timeIntervalChoices.length; ++intervalGroupIndex) {
            if(this.props.timeIntervalChoices[intervalGroupIndex].length===0)
                continue;
            intervalChoiceGroup = [];
            for (var typeIndex = 0; typeIndex < this.props.timeIntervalChoices[intervalGroupIndex].length; ++typeIndex) {
                intervalChoiceGroup.push(this.props.timeIntervalChoices[intervalGroupIndex][typeIndex]);
            }
            intervalChoiceGroups.push({
                label: timeframeNameDict[intervalGroupIndex],
                members: intervalChoiceGroup.slice()
            });
        }

        return {
            modifyType: "change", // change, set
            changeType: "minutes", // minutes, hours, weeks, relative
            modifyAmount: 10,
            activeKeyIndex: 0,
            intervalChoiceGroups: intervalChoiceGroups
        };
    },
    onModeChange: function(newModeStr){
        if(newModeStr !== this.state.modifyType) {
            var newActiveKeyIndex = this.state.activeKeyIndex;
            if(newModeStr === "set" && this.state.changeType==="relative")
                newActiveKeyIndex = 0;
            this.setState({modifyType: newModeStr, activeKeyIndex: newActiveKeyIndex});
        }
    },
    getNewInterval: function(){
        var intervalDiff;
        if(this.state.modifyType === "change") {
            if (this.state.changeType === "relative") {
                intervalDiff = this.props.reviewInterval * this.state.modifyAmount/100.0;
                return intervalDiff + this.props.reviewInterval;
            } else {
                intervalDiff = moment.duration(this.state.modifyAmount, this.state.changeType.toLowerCase()).asMilliseconds();
                return this.props.reviewInterval + intervalDiff;
            }
        }
        else if(this.state.modifyType === "set") {
            return moment.duration(this.state.modifyAmount, this.state.changeType.toLowerCase()).asMilliseconds();
        }
    },
    onIntervalChoice: function(modifyAmount, keyIndex, changeType, event){
        if(this.state.activeKeyIndex === keyIndex){
            this.props.applyInterval(this.getNewInterval());
        }
        this.setState({
            activeKeyIndex: keyIndex,
            changeType: changeType,
            modifyAmount: modifyAmount
        });
    },
    render: function(){
        var toolbarConents = [];
        var groupConents;
        var amount;
        var keyIndex = 0;
        for (var i = 0; i < this.state.intervalChoiceGroups.length; ++i) {
            groupConents = [];
            for (var j = 0; j < this.state.intervalChoiceGroups[i].members.length; ++j) {
                var buttonClassName = "button unselectable";
                buttonClassName += " interval"+(i%2);
                buttonClassName += keyIndex === this.state.activeKeyIndex ? " buttonSelected" : "";
                var plusEL = <span className={this.state.modifyType==="change"?"":"invisible"}>+</span>;
                amount = this.state.intervalChoiceGroups[i].members[j];
                var buttonStr = amount;
                if(this.state.intervalChoiceGroups[i].label==="Relative")
                    buttonStr += "%";
                else
                    buttonStr += this.state.intervalChoiceGroups[i].label.slice(0,1).toLowerCase();
                var labelElement = false;
                if(j===0){
                    labelElement = <div>{this.state.intervalChoiceGroups[i].label}</div>;
                }
                var isSetAndRelative = this.state.intervalChoiceGroups[i].label==="Relative" && this.state.modifyType==="set" ;
                toolbarConents.push(
                    <span
                        key={keyIndex}
                        className={isSetAndRelative?"invisible":""}>
                        {labelElement}
                        <div
                            className={buttonClassName}
                            onClick={this.onIntervalChoice.bind(this, amount, keyIndex, this.state.intervalChoiceGroups[i].label.toLowerCase())}>{plusEL} {buttonStr}
                        </div>
                    </span>
                );
                keyIndex += 1;
            }
        }

        return(
            <div className={this.props.show?"":"invisible"}>
                <div className="intervalButtonCont">
                    <span >
                        <div>Type</div>
                        <div className={"button "+ (this.state.modifyType==="change"?"buttonGood":"")} onClick={this.onModeChange.bind(this, "change")}>change</div>
                    </span>
                    <span className={"button "+ (this.state.modifyType==="set"?"buttonGood":"")} onClick={this.onModeChange.bind(this, "set")}>set</span>
                    {toolbarConents}
                </div>
                <div>Old interval: {getPreciseIntervalStr( this.props.reviewInterval )}</div>
                <div>New interval: {getPreciseIntervalStr( this.getNewInterval() )}</div>
            </div>
        );
    }
});
