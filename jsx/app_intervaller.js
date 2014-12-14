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
    getPreciseIntervalStr: function(interval){
        var duration = moment.duration(interval);
        if(duration.asMinutes()<=1)
            return "<1 min";
        if(duration.asYears() >= 1) return (Math.round(duration.asYears() * 10)/10)+" years";
        if(duration.asMonths() >= 1) return (Math.round(duration.asMonths() * 10)/10)+" months";
        if(duration.asWeeks() >= 1) return (Math.round(duration.asWeeks() * 10)/10)+" weeks";
        if(duration.asDays() >= 1) return (Math.round(duration.asDays() * 10)/10)+" days";
        if(duration.asHours() >= 1) return (Math.round(duration.asHours() * 10)/10)+" hours";
        if(duration.asMinutes() >= 1) return (Math.round(duration.asMinutes() * 10)/10)+" minutes";
    },
    render: function(){
        var toolbarConents = [];
        var groupConents;
        var amount;
        var keyIndex = 0;
        for (var i = 0; i < this.state.intervalChoiceGroups.length; ++i) {
            groupConents = [];
            for (var j = 0; j < this.state.intervalChoiceGroups[i].members.length; ++j) {
                amount = this.state.intervalChoiceGroups[i].members[j];
                var buttonClassName = "button unselectable";
                buttonClassName += " interval"+(i%2);
                buttonClassName += keyIndex === this.state.activeKeyIndex ? " intervalSelected" : "";
                var buttonStr = amount;
                if(this.state.intervalChoiceGroups[i].label==="Relative")
                    buttonStr += "%";
                else
                    buttonStr += this.state.intervalChoiceGroups[i].label.slice(0,1).toLowerCase();
                if(this.state.modifyType==="change"){
                    buttonStr = "+"+buttonStr;
                }
                groupConents.push(
                    <span
                        key={j}
                        className={buttonClassName}
                        onClick={this.onIntervalChoice.bind(this, amount, keyIndex, this.state.intervalChoiceGroups[i].label.toLowerCase())}> {buttonStr}
                    </span>
                );
                keyIndex += 1;
            }

            var hideRelative = this.state.intervalChoiceGroups[i].label==="Relative" && this.state.modifyType==="set" ;
            toolbarConents.push(
                <span key={i} className={hideRelative?"invisible":""}>
                    <span>{this.state.intervalChoiceGroups[i].label}</span>
                    <div >
                        {groupConents}
                    </div>
                </span>
            );
        }

        return(
            <div className={this.props.show?"":"invisible"}>
                <div className="intervalButtonCont">
                    <span>
                        <span>Type</span>
                        <div >
                            <span className={"button "+ (this.state.modifyType==="change"?"buttonGood":"")} onClick={this.onModeChange.bind(this, "change")}>change</span>
                            <span className={"button "+ (this.state.modifyType==="set"?"buttonGood":"")} onClick={this.onModeChange.bind(this, "set")}>set</span>
                        </div>
                    </span>
                    {toolbarConents}
                </div>
                <div>Old interval: {this.getPreciseIntervalStr( this.props.reviewInterval )}</div>
                <div>New interval: {this.getPreciseIntervalStr( this.getNewInterval() )}</div>

            </div>
        );
    }
});
