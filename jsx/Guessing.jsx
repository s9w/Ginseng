module.exports = React.createClass({
    getInitialState() {
        return {
            guessString: ""
        };
    },
    componentWillReceiveProps(nextProps){
        // When switching to new card
        if(this.props.backStr && !nextProps.backStr){
            this.setState({guessString: ""});
        }
    },
    focusInput(){
        this.refs.guessInput.getDOMNode().focus();
    },
    componentDidMount(){
        this.focusInput();
    },
    componentDidUpdate : function(){
        if("guessInput" in this.refs){
            this.focusInput();
        }
    },
    guessChange(event){
        this.setState({guessString: event.target.value});
    },
    handleGuessKeyDown(evt) {
        if (evt.keyCode == 13 ) {
            this.props.onFlip();
        }
    },
    render(){
        if(!this.props.backStr){
            return(
                <div>
                    <input
                        ref="guessInput"
                        value={this.state.guessString}
                        onKeyDown={this.handleGuessKeyDown}
                        onChange={this.guessChange}
                    />
                </div>
            );
        }else{
            // diff the lowercased guess and solution + replace with their correct original case
            var diff = JsDiff.diffChars(this.props.backStr.toLowerCase(), this.state.guessString.toLowerCase());
            var replaceIndex = 0;
            for(let i=0; i<diff.length; i++){
                diff[i].value = this.props.backStr.substr(replaceIndex, diff[i].value.length);
                replaceIndex += diff[i].value.length;
            }

            return(
                <div>
                    {diff.map((part, index)=>
                        <span
                            key={index}
                            className={(part.added || part.removed) ? 'guessWrong' : 'guessCorrect'}>
                            {part.value}
                        </span>
                    )}
                </div>
            );
        }
    }
});
