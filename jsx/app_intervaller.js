var Intervaller = React.createClass({
    getInitialState() {
        return {
            modifyType: this.props.reviewInterval===0?"set":"change",
            changeType: "minutes",
            modifyAmount: 10,
            activeKeyIndex: false
        };
    },
    componentWillReceiveProps(nextProps){
        this.setState({
            activeKeyIndex: false,
            modifyType: nextProps.reviewInterval===0?"set":this.state.modifyType
        });
    },
    onModeChange(newModeStr){
        if(newModeStr !== this.state.modifyType) {
            this.setState({modifyType: newModeStr, activeKeyIndex: false});
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
        var keyIndex = 0;
        for (var timeframeKey in this.props.timeIntervalChoices) {
            for (let i = 0; i < this.props.timeIntervalChoices[timeframeKey].length; ++i) {
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
                var amount = this.props.timeIntervalChoices[timeframeKey][i];
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
                    disabled={this.props.reviewInterval===0}
                    className={" "+ (this.state.modifyType==="change"?"buttonGood":"")}
                    onClick={this.onModeChange.bind(this, "change")}>change</button>
                <button
                    className={" "+ (this.state.modifyType==="set"?"buttonGood":"")}
                    onClick={this.onModeChange.bind(this, "set")}>set</button>
                <div className="intervalButtonCont">
                    {intervals}
                </div>
                <div>Old interval: {getPreciseIntervalStr( this.props.reviewInterval )}</div>
                <div className={this.state.activeKeyIndex?"":"invisible"}>New interval: {getPreciseIntervalStr( this.getNewInterval() )}</div>
                <div className={this.state.activeKeyIndex?"":"invisible"}>Due on: {moment().add(moment.duration(this.getNewInterval())).format("dddd, YYYY-MM-DD, HH:mm") }</div>
            </div>
        );
    }
});
