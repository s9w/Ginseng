var Intervaller = React.createClass({
    getInitialState: function() {
        return {
            modifyBase: "mod", // mod, set
            activeKey: "1h"
        };
    },
    onModeChange: function(newModeStr){
        if(newModeStr !== this.state.modifyBase) {
            var newActiveKey = this.state.activeKey;
            if(newModeStr === "set" && this.state.activeKey.slice(-1)==="%")
                newActiveKey = "1d";

            this.setState({modifyBase: newModeStr, activeKey: newActiveKey});
        }
    },
    onIntervalChoice: function(choice, event){
        this.setState({ activeKey: choice});
    },
    getPreciseDurationStr: function(duration){
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
        // create interval buttons
        var modifyChoices = ["10m", "30m", "1h", "5h", "10h", "1d", "2d", "3d", "1w", "2w", "0%", "15%", "30%"];
        var timeframeNameDict = {"m": "Minutes", "h":"Hours", "d":"Days", "w":"Weeks", "%":"Relative"};
        var activeTimeframe = "Minutes";
        var choice, choice_value, choice_postfix;
        var toolbarConents = [], groupConents = [];
        var currLabel = "";
        for (var i = 0; i < modifyChoices.length; ++i) {
            choice = modifyChoices[i];
            choice_postfix = choice.slice(-1);
            choice_value = choice.slice(0, -1);
            currLabel =  <div key={(i+100)}>{activeTimeframe}</div> ;
            if(timeframeNameDict[choice_postfix] !== activeTimeframe){
                toolbarConents.push(
                    <span key={i}>
                        {currLabel}
                        <ButtonGroup >
                            {groupConents}
                        </ButtonGroup>
                    </span>
                );
                activeTimeframe = timeframeNameDict[choice_postfix];
                groupConents = [];
            }
            groupConents.push(
                <BButton key={i} bsStyle={choice===this.state.activeKey?"success":"default"} onClick={this.onIntervalChoice.bind(this, choice)}>{choice}</BButton>
            );
        }
        toolbarConents.push(
            <span key={99} className={this.state.modifyBase==="set"?"invisible":""}>
                {currLabel}
                <ButtonGroup >
                    {groupConents}
                </ButtonGroup>
            </span>
        );

        // calculate next interval
        var modifyValue, intervalDiff, newInterval;
        var activeKeyValue = this.state.activeKey.slice(0, -1);
        activeTimeframe = timeframeNameDict[this.state.activeKey.slice(-1)];
        if(this.state.modifyBase == "mod") {
            if (this.state.activeKey.slice(-1) === "%") {
                modifyValue = activeKeyValue / 100.0;
                intervalDiff = modifyValue * this.props.lastInterval;
            } else {
                modifyValue = moment.duration(parseInt(activeKeyValue, 10), activeTimeframe.toLowerCase()).asMilliseconds();
                intervalDiff = modifyValue;
            }
            newInterval = this.props.lastInterval + intervalDiff;
        }
        else if(this.state.modifyBase == "set") {
            modifyValue = moment.duration(parseInt(activeKeyValue, 10), activeTimeframe.toLowerCase()).asMilliseconds();
            newInterval = modifyValue;
        }


        return(
            <div className={this.props.show?"":"invisible"}>
                <ul>
                    <li>last interval: { this.getPreciseDurationStr(moment.duration(this.props.lastInterval)) }</li>
                    <li>new interval: { this.getPreciseDurationStr(moment.duration(newInterval)) }</li>
                </ul>

                <div className="intervalButtonCont">
                    <span>
                        <div>Type</div>
                        <ButtonGroup >
                            <BButton active={this.state.modifyBase==="mod"} onClick={this.onModeChange.bind(this, "mod")}>mod</BButton>
                            <BButton active={this.state.modifyBase==="set"} onClick={this.onModeChange.bind(this, "set")}>set</BButton>
                        </ButtonGroup>
                    </span>
                {toolbarConents}
                </div>

            </div>
        );
    }
});
