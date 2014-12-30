var Intervaller = React.createClass({
    getInitialState() {
        return {
            modifyType: "change", // change, set
            changeType: "minutes", // minutes, hours, weeks, relative
            modifyAmount: 10,
            activeKeyIndex: 0
        };
    },
    onModeChange(newModeStr){
        if(newModeStr !== this.state.modifyType) {
            var newActiveKeyIndex = this.state.activeKeyIndex;
            if(newModeStr === "set" && this.state.changeType==="percent")
                newActiveKeyIndex = 0;
            this.setState({modifyType: newModeStr, activeKeyIndex: newActiveKeyIndex});
        }
    },
    componentWillMount(){
        console.log("intervaller mount");
    },
    getNewInterval(){
        var intervalDiff;
        if(this.state.modifyType === "change") {
            if (this.state.changeType === "percent") {
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
    onIntervalChoice(modifyAmount, keyIndex, changeType){
        if(this.state.activeKeyIndex === keyIndex){
            this.props.applyInterval(this.getNewInterval());
        }
        this.setState({
            activeKeyIndex: keyIndex,
            changeType: changeType,
            modifyAmount: modifyAmount
        });
    },
    render(){
        console.log("render intervaller");
        var cx = React.addons.classSet;
        var intervals = [];
        var amount;
        var keyIndex = 0;
        for (var timeframeKey in this.props.timeIntervalChoices) {
            for (var j = 0; j < this.props.timeIntervalChoices[timeframeKey].length; ++j) {
                var buttonClasses = cx({
                    'unselectable': true,
                    "intervalMinutes": timeframeKey==="Minutes",
                    "intervalHours": timeframeKey==="Hours",
                    "intervalDays": timeframeKey==="Days",
                    "intervalWeeks": timeframeKey==="Weeks",
                    "intervalMonths": timeframeKey==="Months",
                    "intervalPercent": timeframeKey==="Percent",
                    "buttonSelected": keyIndex === this.state.activeKeyIndex,
                    "invisible": timeframeKey==="Percent" && this.state.modifyType==="set"
                });
                var plusEL = <span className={this.state.modifyType==="change"?"":"invisible"}>+</span>;
                amount = this.props.timeIntervalChoices[timeframeKey][j];
                var buttonStr = amount;
                if(timeframeKey === "Percent")
                    buttonStr += "%";
                else
                    buttonStr += timeframeKey.slice(0,1).toLowerCase();
                intervals.push(
                    <button
                        key={keyIndex}
                        className={buttonClasses}
                        onClick={this.onIntervalChoice.bind(this, amount, keyIndex, timeframeKey.toLowerCase())}>{plusEL} {buttonStr}
                    </button>
                );
                keyIndex += 1;
            }
        }

        return(
            <div className={this.props.show?"":"invisible"}>
                <button
                    className={" "+ (this.state.modifyType==="change"?"buttonGood":"")}
                    onClick={this.onModeChange.bind(this, "change")}>change</button>
                <button
                    className={" "+ (this.state.modifyType==="set"?"buttonGood":"")}
                    onClick={this.onModeChange.bind(this, "set")}>set</button>
                <div className="intervalButtonCont">
                    {intervals}
                </div>
                <div>Old interval: {getPreciseIntervalStr( this.props.reviewInterval )}</div>
                <div>New interval: {getPreciseIntervalStr( this.getNewInterval() )}</div>
                <div>Due on: {moment().add(moment.duration(this.getNewInterval())).format("dddd, YYYY-MM-DD, HH:mm") }</div>
            </div>
        );
    }
});
