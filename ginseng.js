function getPreciseIntervalStr(interval){var duration=moment.duration(interval);if(duration.asMinutes()<=1)return"<1 min";if(duration.asYears()>=1)return Math.round(duration.asYears()*10)/10+" years";if(duration.asMonths()>=1)return Math.round(duration.asMonths()*10)/10+" months";if(duration.asWeeks()>=1)return Math.round(duration.asWeeks()*10)/10+" weeks";if(duration.asDays()>=1)return Math.round(duration.asDays()*10)/10+" days";if(duration.asHours()>=1)return Math.round(duration.asHours()*10)/10+" hours";if(duration.asMinutes()>=1)return Math.round(duration.asMinutes()*10)/10+" minutes"}function getShortPreciseIntervalStr(interval){var duration=moment.duration(interval);if(duration.asMinutes()<=1)return"<1 min";if(duration.asYears()>=1)return Math.round(duration.asYears()*10)/10+" y";if(duration.asMonths()>=1)return Math.round(duration.asMonths()*10)/10+" m";if(duration.asWeeks()>=1)return Math.round(duration.asWeeks()*10)/10+" w";if(duration.asDays()>=1)return Math.round(duration.asDays()*10)/10+" d";if(duration.asHours()>=1)return Math.round(duration.asHours()*10)/10+" h";if(duration.asMinutes()>=1)return Math.round(duration.asMinutes()*10)/10+" m"}var InfoBrowser=React.createClass({displayName:"InfoBrowser",getInitialState:function(){return{filterText:"",sortOrder:"1"}},onFilterChange:function(event){this.setState({filterText:event.target.value})},onRowSelect:function(index){this.props.onRowSelect(index)},changeSortOrder:function(order){var newOrder=order;if(this.state.sortOrder===order){newOrder+="r"}this.setState({sortOrder:newOrder})},render:function(){var thisBrowser=this;var sortedInfos=this.props.infos.sort(function(a,b){switch(thisBrowser.state.sortOrder){case"1":return a.entries[0].localeCompare(b.entries[0]);break;case"1r":return-a.entries[0].localeCompare(b.entries[0]);break;case"2":return a.entries[1].localeCompare(b.entries[1]);break;case"2r":return-a.entries[1].localeCompare(b.entries[1]);break;case"a":return moment(a.creationDate).isBefore(b.creationDate)?1:-1;break;case"ar":return moment(a.creationDate).isBefore(b.creationDate)?-1:1;break}});var maxAge=0;var age;var tableRows=[];var thData;for(var k=0;k<sortedInfos.length;++k){age=moment().diff(moment(sortedInfos[k].creationDate));if(age>maxAge){maxAge=age}}for(var i=0;i<sortedInfos.length;++i){age=moment().diff(moment(sortedInfos[i].creationDate));if(sortedInfos[i].entries[0].toLowerCase().indexOf(this.state.filterText.toLowerCase())!==-1||sortedInfos[i].entries[1].toLowerCase().indexOf(this.state.filterText.toLowerCase())!==-1){var ds=[];thData=[sortedInfos[i].entries[0],sortedInfos[i].entries[1],this.props.types[sortedInfos[i].typeID].name,sortedInfos[i].tags.join(", "),getShortPreciseIntervalStr(age)];for(var j=0;j<thData.length;++j){var content;var shortenLen=j===2?5:15;if(thData[j].length>shortenLen){content=thData[j].slice(0,shortenLen)+"..."}else{content=thData[j]}if(j==4){ds.push(React.createElement("td",{key:j},React.createElement("div",{style:{position:"absolute"}},content),React.createElement("div",{style:{height:"1em",background:"#E0E0E0",width:age/maxAge*100+"%"}})))}else{ds.push(React.createElement("td",{key:j},content))}}tableRows.push(React.createElement("tr",{key:i,onClick:this.onRowSelect.bind(this,i)},ds))}}var th_1="1st";var th_2="2nd";var th_age="Age";switch(this.state.sortOrder){case"1":th_1+="↓";break;case"1r":th_1+="↑";break;case"2":th_2+="↓";break;case"2r":th_2+="↑";break;case"a":th_age+="↓";break;case"ar":th_age+="↑";break}return React.createElement("div",{className:"InfoBrowser Component"},React.createElement("div",{className:"browseControls"},React.createElement("input",{type:"text",placeholder:"Quick filter...",value:this.state.filterText,onChange:this.onFilterChange}),React.createElement("button",{className:"button buttonGood",onClick:this.props.onNew},"New info")),React.createElement("table",null,React.createElement("thead",null,React.createElement("tr",null,React.createElement("th",{onClick:this.changeSortOrder.bind(this,"1")},th_1),React.createElement("th",{onClick:this.changeSortOrder.bind(this,"2")},th_2),React.createElement("th",null,"Type"),React.createElement("th",null,"Tags"),React.createElement("th",{onClick:this.changeSortOrder.bind(this,"a")},th_age))),React.createElement("tbody",null,tableRows)))}});var InfoEdit=React.createClass({displayName:"InfoEdit",getInitialState:function(){var infoNew;if(!("info"in this.props)){var firstTypeID="0";while(!(firstTypeID in this.props.types)){firstTypeID=(parseInt(firstTypeID,10)+1).toString()}infoNew=this.getNewInfo(firstTypeID)}else{infoNew=JSON.parse(JSON.stringify(this.props.info))}return{info:infoNew,previewID:false,scrollHeights:{}}},componentWillReceiveProps:function(nextProps){console.log(" xb");if(!("info"in nextProps)){var firstTypeID="0";while(!(firstTypeID in this.props.types)){firstTypeID=(parseInt(firstTypeID,10)+1).toString()}this.setState({info:this.getNewInfo(firstTypeID)})}},getNewInfo:function(typeID){var infoNew={typeID:typeID};var entries=[];var reviews={};for(var i=0;i<this.props.types[typeID].entryNames.length;++i){entries.push("");reviews[i]=[]}infoNew.entries=entries;infoNew.reviews=reviews;infoNew.tags=[];infoNew.creationDate=moment().format();return infoNew},onTypeChange:function(newTypeID){var newInfo=JSON.parse(JSON.stringify(this.state.info));newInfo.typeID=newTypeID;var newEntriesLength=this.props.types[newTypeID].entryNames.length;var sizeDiff=newEntriesLength-this.state.info.entries.length;if(sizeDiff>0){for(var i=0;i<sizeDiff;i++){newInfo.entries.push("")}}else if(sizeDiff<0){newInfo.entries=newInfo.entries.slice(0,newEntriesLength)}this.setState({info:newInfo})},onEntryEdit:function(entryIndex,event){var newInfo=JSON.parse(JSON.stringify(this.state.info));var scrollHeights=JSON.parse(JSON.stringify(this.state.scrollHeights));scrollHeights[entryIndex]=this.refs[entryIndex].getDOMNode().scrollHeight;newInfo.entries[entryIndex]=event.target.value;this.setState({info:newInfo,scrollHeights:scrollHeights})},onTagsEdit:function(event){var newInfo=JSON.parse(JSON.stringify(this.state.info));if(event.target.value===""){newInfo.tags=[]}else{newInfo.tags=event.target.value.replace(/ /g,"").split(",")}this.setState({info:newInfo})},onSave:function(){this.props.onSave(this.state.info)},addUsedTag:function(nextTagStr){var newInfo=JSON.parse(JSON.stringify(this.state.info));newInfo.tags.push(nextTagStr);this.setState({info:newInfo})},editType:function(){this.props.editType(this.state.info.typeID)},setPreview:function(newPreview){this.setState({previewID:newPreview})},render:function(){var infoTypeSection;if("info"in this.props){infoTypeSection=React.createElement("section",null,React.createElement("h3",null,"Info Type"),React.createElement("span",{className:"sectionContent"},this.props.types[this.state.info.typeID].name))}else{infoTypeSection=React.createElement("section",null,React.createElement("h3",null,"Info Type"),React.createElement(ITypeSwitcher,{className:"sectionContent",types:this.props.types,selectedTypeID:this.state.info.typeID,onTypeChange:this.onTypeChange}))}var entrySections=[];for(var entryIdx=0;entryIdx<this.state.info.entries.length;++entryIdx){var ss={overflow:"hidden"};if(entryIdx in this.state.scrollHeights){ss={overflow:"hidden",height:this.state.scrollHeights[entryIdx]-4+"px"}}entrySections.push(React.createElement("textarea",{key:entryIdx,value:this.state.info.entries[entryIdx],placeholder:this.props.types[this.state.info.typeID].entryNames[entryIdx],className:"sectionContent",style:ss,onChange:this.onEntryEdit.bind(this,entryIdx),ref:entryIdx}))}var usedTagEls=[];var seperator;for(var index=0;index<this.props.usedTags.length;++index){if(this.state.info.tags.indexOf(this.props.usedTags[index])===-1){if(usedTagEls.length===0)seperator="";else seperator=", ";usedTagEls.push(React.createElement("a",{key:index,onClick:this.addUsedTag.bind(this,this.props.usedTags[index]),href:"#"},seperator+this.props.usedTags[index]))}}var deleteButton=false;var saveButtonStr="add";if("onDelete"in this.props){deleteButton=React.createElement("button",{className:"buttonDanger",onClick:this.props.onDelete},"Delete");saveButtonStr="save"}var templateButtons=[];templateButtons.push(React.createElement("button",{key:"none",className:"flexElemContHoriz button "+(this.state.previewID?"":"buttonGood"),onClick:this.setPreview.bind(this,false)},"None"));for(var templateID in this.props.types[this.state.info.typeID].templates){templateButtons.push(React.createElement("button",{key:templateID,className:"flexElemContHoriz button "+(this.state.previewID&&this.state.previewID===templateID?"buttonGood":""),onClick:this.setPreview.bind(this,templateID)},"Template "+templateID))}var previewEl=false;if(this.state.previewID){previewEl=React.createElement(ReviewDisplay,{type:this.props.types[this.state.info.typeID],viewID:this.state.previewID,info:this.state.info,progressState:"backSide"})}var isChanged=JSON.stringify(this.props.info)!==JSON.stringify(this.state.info);return React.createElement("div",{className:"InfoEdit Component"},infoTypeSection,React.createElement("section",null,React.createElement("h3",null,"Entries"),entrySections),React.createElement("section",null,React.createElement("h3",null,"Tags"),React.createElement("textarea",{className:"sectionContent",rows:1,type:"text",value:this.state.info.tags.join(", "),onChange:this.onTagsEdit}),React.createElement("div",{className:"sectionContent"},"used: ",usedTagEls)),React.createElement("section",null,React.createElement("h3",null,"Preview"),React.createElement("div",{className:"sectionContent tabContainer"},templateButtons)),previewEl,React.createElement("div",{className:"flexContHoriz"},React.createElement("button",{disabled:!isChanged,className:"buttonGood",onClick:this.onSave},saveButtonStr),React.createElement("button",{onClick:this.props.cancelEdit},"Cancel"),deleteButton))}});var Popup=React.createClass({displayName:"Popup",render:function(){return React.createElement("div",{className:"popup"},React.createElement("p",null,this.props.text),this.props.buttonContainer)}});var ITypeSwitcher=React.createClass({displayName:"ITypeSwitcher",onTypeChange:function(typeID){this.props.onTypeChange(typeID)},render:function(){var typeNameOptions=[];for(var typeID in this.props.types){typeNameOptions.push(React.createElement("button",{key:typeID,className:"button"+(this.props.selectedTypeID===typeID?" buttonGood":""),onClick:this.onTypeChange.bind(this,typeID)},this.props.types[typeID].name))}if(this.props.onAddType){typeNameOptions.push(React.createElement("button",{className:"button",key:"new",onClick:this.props.onAddType},"New.."))}return React.createElement("div",{className:"sectionContent wrap"},typeNameOptions)}});var InfoTypes=React.createClass({displayName:"InfoTypes",getInitialState:function(){var chosenTypeID=0;while(!(chosenTypeID in this.props.types)){chosenTypeID++}if(this.props.selectedTypeID){chosenTypeID=this.props.selectedTypeID}return{selectedTypeID:chosenTypeID.toString(),types:this.props.types,changes:{renames:"",typeResizes:[]},mode:"main"}},onFieldNameEdit:function(fieldNameIndex,event){var newTypes=JSON.parse(JSON.stringify(this.state.types));newTypes[this.state.selectedTypeID].entryNames[fieldNameIndex]=event.target.value;var newchanges=JSON.parse(JSON.stringify(this.state.changes));newchanges.renames="renamed";this.setState({types:newTypes,changes:newchanges})},selectType:function(newID){this.setState({selectedTypeID:newID,mode:"main"})},onNameEdit:function(event){var newTypes=JSON.parse(JSON.stringify(this.state.types));newTypes[this.state.selectedTypeID].name=event.target.value;var newchanges=JSON.parse(JSON.stringify(this.state.changes));newchanges.renames="renamed";this.setState({types:newTypes,changes:newchanges})},onFieldsResize:function(fieldNameIndex){var newTypes=JSON.parse(JSON.stringify(this.state.types));if(fieldNameIndex==="add"){newTypes[this.state.selectedTypeID].entryNames.push("")}else{newTypes[this.state.selectedTypeID].entryNames.splice(fieldNameIndex,1)}var newchanges=JSON.parse(JSON.stringify(this.state.changes));newchanges.typeResizes.push({id:this.state.selectedTypeID,fieldNameIndex:fieldNameIndex});this.setState({types:newTypes,changes:newchanges})},onSave:function(){this.props.onSave(this.state.types,this.state.changes)},componentDidUpdate:function(){if(this.state.types[this.state.selectedTypeID].name==="new info type"){this.refs.nameRef.getDOMNode().focus()}},onAddType:function(){var newTypes=JSON.parse(JSON.stringify(this.state.types));var nextTypeID="0";for(var typeID in newTypes){if(parseInt(typeID,10)>parseInt(nextTypeID,10)){nextTypeID=typeID}}nextTypeID=(parseInt(nextTypeID,10)+1).toString();newTypes[nextTypeID]={name:"new info type",entryNames:["first field","second field"],templates:{0:{front:"{front}",back:"{back}",condition:""},1:{front:"{back}",back:"{front}",condition:"tag: reverse"}}};this.setState({types:newTypes,selectedTypeID:nextTypeID})},setMode:function(modeStr){this.setState({mode:modeStr})},onViewChange:function(type,newContent){var newTypes=JSON.parse(JSON.stringify(this.state.types));newTypes[this.state.selectedTypeID].templates[this.state.mode][type]=newContent;this.setState({types:newTypes})},render:function(){var selectedType=this.state.types[this.state.selectedTypeID];var entrynameRows=[];for(var i=0;i<selectedType.entryNames.length;++i){entrynameRows.push(React.createElement("div",{key:i,className:"sectionContent"},React.createElement("input",{className:"sectionContentEl",value:selectedType.entryNames[i],onChange:this.onFieldNameEdit.bind(this,i)}),React.createElement("button",{className:"buttonDanger microbutton sectionContentElFixed"+(selectedType.entryNames.length<=2?" invisible":""),onClick:this.onFieldsResize.bind(this,i)},"✖")))}entrynameRows.push(React.createElement("div",{key:"add",className:"sectionContent"},React.createElement("button",{className:"buttonGood",onClick:this.onFieldsResize.bind(this,"add")},"Add entry")));var mainSection=[];if(this.state.mode!=="main"){mainSection=React.createElement(TemplateDetails,{view:selectedType.templates[this.state.mode],onViewChange:this.onViewChange})}else{mainSection.push(React.createElement("section",{key:0},React.createElement("h3",null,"Name"),React.createElement("input",{className:"sectionContent",type:"text",ref:"nameRef",id:"typeName",value:selectedType.name,onChange:this.onNameEdit})));mainSection.push(React.createElement("section",{key:1},React.createElement("h3",null,"Entries"),entrynameRows))}var viewButtons=[];for(var templateID in selectedType.templates){viewButtons.push(React.createElement("button",{key:templateID,className:"flexElemContHoriz button "+(this.state.mode===templateID?"buttonGood":""),onClick:this.setMode.bind(this,templateID)},"Template "+templateID))}var isChanged=JSON.stringify(this.props.types)!==JSON.stringify(this.state.types);return React.createElement("div",{className:"Component"},React.createElement("section",null,React.createElement("h3",null,"Info Type"),React.createElement(ITypeSwitcher,{className:"sectionContent",types:this.state.types,selectedTypeID:this.state.selectedTypeID,onTypeChange:this.selectType,onAddType:this.onAddType})),React.createElement("section",{className:"sectionContent tabContainer"},React.createElement("button",{className:"button "+(this.state.mode==="main"?"buttonGood":""),onClick:this.setMode.bind(this,"main")},"Details"),viewButtons),mainSection,React.createElement("section",{className:"sectionContent flexContHoriz"},React.createElement("button",{disabled:!isChanged,className:"flexElemContHoriz buttonGood",onClick:this.onSave},"Save"),React.createElement("button",{className:"flexElemContHoriz",onClick:this.props.cancelEdit},"Cancel")))}});var Intervaller=React.createClass({displayName:"Intervaller",getInitialState:function(){return{modifyType:"change",changeType:"minutes",modifyAmount:10,activeKeyIndex:0}},onModeChange:function(newModeStr){if(newModeStr!==this.state.modifyType){var newActiveKeyIndex=this.state.activeKeyIndex;if(newModeStr==="set"&&this.state.changeType==="percent")newActiveKeyIndex=0;this.setState({modifyType:newModeStr,activeKeyIndex:newActiveKeyIndex})}},getNewInterval:function(){var intervalDiff;if(this.state.modifyType==="change"){if(this.state.changeType==="percent"){intervalDiff=this.props.reviewInterval*this.state.modifyAmount/100;return intervalDiff+this.props.reviewInterval}else{intervalDiff=moment.duration(this.state.modifyAmount,this.state.changeType.toLowerCase()).asMilliseconds();return this.props.reviewInterval+intervalDiff}}else if(this.state.modifyType==="set"){return moment.duration(this.state.modifyAmount,this.state.changeType.toLowerCase()).asMilliseconds()}},onIntervalChoice:function(modifyAmount,keyIndex,changeType){if(this.state.activeKeyIndex===keyIndex){this.props.applyInterval(this.getNewInterval())}this.setState({activeKeyIndex:keyIndex,changeType:changeType,modifyAmount:modifyAmount})},render:function(){var cx=React.addons.classSet;var intervals=[];var amount;var keyIndex=0;for(var timeframeKey in this.props.timeIntervalChoices){for(var j=0;j<this.props.timeIntervalChoices[timeframeKey].length;++j){var buttonClasses=cx({unselectable:true,intervalMinutes:timeframeKey==="Minutes",intervalHours:timeframeKey==="Hours",intervalDays:timeframeKey==="Days",intervalWeeks:timeframeKey==="Weeks",intervalMonths:timeframeKey==="Months",intervalPercent:timeframeKey==="Percent",buttonSelected:keyIndex===this.state.activeKeyIndex,invisible:timeframeKey==="Percent"&&this.state.modifyType==="set"});var plusEL=React.createElement("span",{className:this.state.modifyType==="change"?"":"invisible"},"+");amount=this.props.timeIntervalChoices[timeframeKey][j];var buttonStr=amount;if(timeframeKey==="Percent")buttonStr+="%";else buttonStr+=timeframeKey.slice(0,1).toLowerCase();intervals.push(React.createElement("button",{key:keyIndex,className:buttonClasses,onClick:this.onIntervalChoice.bind(this,amount,keyIndex,timeframeKey.toLowerCase())},plusEL," ",buttonStr));keyIndex+=1}}return React.createElement("div",{className:this.props.show?"":"invisible"},React.createElement("button",{className:" "+(this.state.modifyType==="change"?"buttonGood":""),onClick:this.onModeChange.bind(this,"change")},"change"),React.createElement("button",{className:" "+(this.state.modifyType==="set"?"buttonGood":""),onClick:this.onModeChange.bind(this,"set")},"set"),React.createElement("div",{className:"intervalButtonCont"},intervals),React.createElement("div",null,"Old interval: ",getPreciseIntervalStr(this.props.reviewInterval)),React.createElement("div",null,"New interval: ",getPreciseIntervalStr(this.getNewInterval())),React.createElement("div",null,"Due on: ",moment().add(moment.duration(this.getNewInterval())).format("dddd, YYYY-MM-DD, HH:mm")))}});var ReviewDisplay=React.createClass({displayName:"ReviewDisplay",renderMarkdown:function(str){var latexStringBuffer=[];var backStrNew=str.replace(/(\$.*?\$)/g,function(match,p1){latexStringBuffer.push(p1.slice(1,-1));return"$$"});return marked(backStrNew).replace(/\$\$/g,function(){try{return katex.renderToString(latexStringBuffer.shift())}catch(e){console.log("Error: "+e.message);return"ERROR."}})},render:function(){var thisOuter=this;var frontStr=this.props.type.templates[this.props.viewID].front.replace(/{(\w*)}/g,function(match,p1){return thisOuter.props.info.entries[thisOuter.props.type.entryNames.indexOf(p1)]});var backStr=this.props.type.templates[this.props.viewID].back.replace(/{(\w*)}/g,function(match,p1){return thisOuter.props.info.entries[thisOuter.props.type.entryNames.indexOf(p1)]});return React.createElement("div",{id:"reviewStage"},React.createElement("div",{className:"markdowned",dangerouslySetInnerHTML:{__html:this.renderMarkdown(frontStr)}}),React.createElement("div",{className:"markdowned "+(this.props.progressState==="backSide"?"":"invisible"),dangerouslySetInnerHTML:{__html:this.renderMarkdown(backStr)}}))}});var Review=React.createClass({displayName:"Review",getInitialState:function(){return{progressState:"frontSide"}},componentDidMount:function(){if("flipButton"in this.refs)this.refs.flipButton.getDOMNode().focus()},componentDidUpdate:function(){if(this.state.progressState==="frontSide"&&"flipButton"in this.refs)this.refs.flipButton.getDOMNode().focus()},flip:function(){this.setState({progressState:"backSide"})},applyInterval:function(infoIndex,reviewKey,newInterval){this.props.applyInterval(infoIndex,reviewKey,newInterval);this.setState({progressState:"frontSide"})},gotoEdit:function(nextInfoIndex){this.props.gotoEdit(nextInfoIndex)},filterInfo:function(filterStr,info){if(filterStr===""){return true}var filterStrNew=filterStr.replace(/ /g,"");var filters=filterStrNew.split(",");for(var i=0;i<filters.length;++i){if(filters[i]===""){console.log("   empty?")}else if(filters[i]==="tag:reverse"){if(info.tags.indexOf("reverse")===-1){return false}}else{console.log("other filter, eek")}}return true},render:function(){var flipButton=false;if(this.state.progressState==="frontSide")flipButton=React.createElement("div",{style:{textAlign:"center"}},React.createElement("button",{tabIndex:"1",ref:"flipButton",className:"button buttonGood "+(this.state.progressState==="frontSide"?"":"invisible"),onClick:this.flip},"Show backside"));var urgency;var dueCount=0;var actualIntervalMs;var nextReview={urgency:1,infoIndex:0,info:false,viewID:0,realInterval:0};for(var infoIndex=0;infoIndex<this.props.infos.length;++infoIndex){var info=this.props.infos[infoIndex];for(var templateID in info.reviews){if(!this.filterInfo(this.props.types[info.typeID].templates[templateID].condition,info)){continue}if(info.reviews[templateID].length>0){var lastDueTimeStr=info.reviews[templateID][info.reviews[templateID].length-1].dueTime;var lastReviewTimeStr=info.reviews[templateID][info.reviews[templateID].length-1].reviewTime;var plannedIntervalMs=moment(lastDueTimeStr).diff(moment(lastReviewTimeStr));actualIntervalMs=moment().diff(moment(lastReviewTimeStr));urgency=actualIntervalMs/plannedIntervalMs}else{urgency=1.1;actualIntervalMs=0}if(urgency>=1)dueCount++;if(urgency>nextReview.urgency){nextReview.urgency=urgency;nextReview.info=this.props.infos[infoIndex];nextReview.infoIndex=infoIndex;nextReview.viewID=templateID;nextReview.realInterval=actualIntervalMs}}}if(dueCount>0){return React.createElement("div",{className:"Review Component"},React.createElement("div",null,React.createElement("button",{className:"button",tabIndex:"2",onClick:this.gotoEdit.bind(this,nextReview.infoIndex)},"Edit Info"),React.createElement("span",null,"Due count: "+dueCount)),React.createElement(ReviewDisplay,{type:this.props.types[nextReview.info.typeID],viewID:nextReview.viewID,info:nextReview.info,progressState:this.state.progressState}),flipButton,React.createElement(Intervaller,{show:this.state.progressState==="backSide",reviewInterval:nextReview.realInterval,applyInterval:this.applyInterval.bind(this,nextReview.infoIndex,nextReview.viewID),timeIntervalChoices:this.props.timeIntervalChoices}))}else{return React.createElement("div",null)}}});var TemplateDetails=React.createClass({displayName:"TemplateDetails",onViewChange:function(type,event){this.props.onViewChange(type,event.target.value)},render:function(){return React.createElement("div",null,React.createElement("section",null,React.createElement("h3",null,"Front"),React.createElement("textarea",{className:"sectionContent",value:this.props.view.front,rows:(this.props.view.front.match(/\n/g)||[]).length+1,onChange:this.onViewChange.bind(this,"front")})),React.createElement("section",null,React.createElement("h3",null,"Back"),React.createElement("textarea",{className:"sectionContent",value:this.props.view.back,rows:(this.props.view.back.match(/\n/g)||[]).length+1,onChange:this.onViewChange.bind(this,"back")})),React.createElement("section",null,React.createElement("h3",null,"Filter"),React.createElement("input",{className:"sectionContent",value:this.props.view.condition,onChange:this.onViewChange.bind(this,"condition")})))}});var client=new Dropbox.Client({key:"ob9346e5yc509q2"});client.authDriver(new Dropbox.AuthDriver.Popup({receiverUrl:"https://leastaction.org/ginseng/dropbox_receiver.html"}));var App=React.createClass({displayName:"App",getInitialState:function(){return{infos:init_data.infos,infoTypes:init_data.infoTypes,ginseng_settings:init_data.settings,meta:init_data.meta,activeMode:"status",selectedTypeID:false,selectedInfoIndex:0,conversionNote:false,dropBoxStatus:"initial",lastLoadedStr:"never"}},clickNav:function(mode){this.setState({activeMode:mode})},authDB:function(){this.setState({dropBoxStatus:"logging in..."});var thisApp=this;client.authenticate(function(error){if(error){thisApp.setState({dropBoxStatus:"ERROR"})}else{thisApp.setState({dropBoxStatus:"loggedIn"})}})},saveDB:function(){this.setState({dropBoxStatus:"saving"});var thisApp=this;var newMeta=JSON.parse(JSON.stringify(this.state.meta));newMeta.lastSaved=moment().format();var writeData={infos:this.state.infos,infoTypes:this.state.infoTypes,settings:this.state.ginseng_settings,meta:newMeta};client.writeFile("ginseng_data.txt",JSON.stringify(writeData,null,"	"),function(error,stat){if(error){console.log("error: "+error)}else{thisApp.setState({meta:newMeta,dropBoxStatus:"loggedIn",conversionNote:false})}})},loadJsonData:function(jsonData){var sanitizedData={infos:jsonData.infos,infoTypes:jsonData.infoTypes,ginseng_settings:jsonData.settings};if(!("meta"in jsonData)){this.setState({conversionNote:"old data format from before 2014-12-17. Converted!"});sanitizedData.meta={dataFormatVersion:"2014-12-17",lastSaved:"never"}}else{this.setState({conversionNote:false});sanitizedData.meta=jsonData.meta}return sanitizedData},loadDB:function(){this.setState({dropBoxStatus:"loading"});var thisApp=this;client.readFile("ginseng_data.txt",function(error,data){if(error){console.log("ERROR: "+error)}var sanitizedData=thisApp.loadJsonData(JSON.parse(data));thisApp.setState({infos:sanitizedData.infos,infoTypes:sanitizedData.infoTypes,ginseng_settings:sanitizedData.ginseng_settings,meta:sanitizedData.meta,lastLoadedStr:moment().format(),dropBoxStatus:"loggedIn"})})},gotoEdit:function(infoIndex){this.setState({selectedInfoIndex:infoIndex,activeMode:"edit"})},onInfoEdit:function(newInfo){var newInfos=this.state.infos.slice();newInfos[this.state.selectedInfoIndex]=newInfo;this.setState({infos:newInfos,activeMode:"browse"})},onInfoDelete:function(){var newInfos=JSON.parse(JSON.stringify(this.state.infos));console.log("ondelete, this.state.selectedInfoIndex: "+this.state.selectedInfoIndex);newInfos.splice(this.state.selectedInfoIndex,1);this.setState({infos:newInfos,activeMode:"browse"})},addInfo:function(newInfo){var newInfo_copy=JSON.parse(JSON.stringify(newInfo));var newInfos=JSON.parse(JSON.stringify(this.state.infos));newInfos.push(newInfo_copy);this.setState({infos:newInfos,activeMode:"new"})},onTypesEdit:function(newTypes,changes){var newTypes_copy=JSON.parse(JSON.stringify(newTypes));var new_infos=JSON.parse(JSON.stringify(this.state.infos));for(var infoIdx=0;infoIdx<new_infos.length;++infoIdx){for(var resizeIdx=0;resizeIdx<changes.typeResizes.length;++resizeIdx){if(new_infos[infoIdx].typeID===changes.typeResizes[resizeIdx].id){var fieldNameIndex=changes.typeResizes[resizeIdx].fieldNameIndex;if(fieldNameIndex==="add"){new_infos[infoIdx].entries.push("")}else{new_infos[infoIdx].entries.splice(fieldNameIndex,1)}}}}this.setState({infoTypes:newTypes_copy,infos:new_infos,activeMode:"browse"})},applyInterval:function(infoIndex,reviewKey,newInterval){var newInfos=JSON.parse(JSON.stringify(this.state.infos));newInfos[infoIndex].reviews[reviewKey].push({reviewTime:moment().format(),dueTime:moment().add(moment.duration(newInterval)).format()});this.setState({infos:newInfos})},editType:function(typeID){this.setState({activeMode:"types",selectedTypeID:typeID})},render:function(){var usedTags=[];for(var i=0;i<this.state.infos.length;++i){for(var j=0;j<this.state.infos[i].tags.length;++j){if(usedTags.indexOf(this.state.infos[i].tags[j])===-1){usedTags.push(this.state.infos[i].tags[j])}}}var compEdit=React.createElement("div",null);if(this.state.activeMode=="new"){compEdit=React.createElement(InfoEdit,{types:this.state.infoTypes,usedTags:usedTags,onSave:this.addInfo,cancelEdit:this.clickNav.bind(this,"browse"),editType:this.editType})}else if(this.state.activeMode=="edit"){compEdit=React.createElement(InfoEdit,{info:this.state.infos[this.state.selectedInfoIndex],onDelete:this.onInfoDelete,types:this.state.infoTypes,usedTags:usedTags,onSave:this.onInfoEdit,cancelEdit:this.clickNav.bind(this,"browse"),editType:this.editType})}var compBrowser=React.createElement("div",null);if(this.state.activeMode==="browse"){compBrowser=React.createElement(InfoBrowser,{infos:this.state.infos,types:this.state.infoTypes,onRowSelect:this.gotoEdit,onNew:this.clickNav.bind(this,"new"),selections:this.state.ginseng_selections})}var comp_review=React.createElement("div",null);if(this.state.activeMode==="review"){comp_review=React.createElement(Review,{infos:this.state.infos,types:this.state.infoTypes,applyInterval:this.applyInterval,timeIntervalChoices:this.state.ginseng_settings.timeIntervalChoices,gotoEdit:this.gotoEdit})}var compTypes=false;if(this.state.activeMode=="types"){compTypes=React.createElement(InfoTypes,{types:this.state.infoTypes,cancelEdit:this.clickNav.bind(this,"browse"),onSave:this.onTypesEdit,selectedTypeID:this.state.selectedTypeID})}return React.createElement("div",{className:"app"},React.createElement("div",{className:"navBar unselectable"},React.createElement("div",{className:this.state.activeMode=="status"?"active":"inactive",onClick:this.clickNav.bind(this,"status")},"Status"),React.createElement("div",{className:["browse","new","edit"].indexOf(this.state.activeMode)!==-1?"active":"inactive",onClick:this.clickNav.bind(this,"browse")},"Infos"),React.createElement("div",{className:this.state.activeMode=="types"?"active":"inactive",onClick:this.clickNav.bind(this,"types")},"Types"),React.createElement("div",{className:this.state.activeMode=="review"?"active":"inactive",onClick:this.clickNav.bind(this,"review")},"Review")),React.createElement(Status,{show:this.state.activeMode=="status",infoCount:this.state.infos.length,dropBoxStatus:this.state.dropBoxStatus,onDBAuth:this.authDB,onDbSave:this.saveDB,meta:this.state.meta,lastLoadedStr:this.state.lastLoadedStr,onDbLoad:this.loadDB,conversionNote:this.state.conversionNote}),compEdit,compBrowser,compTypes,comp_review)}});var Status=React.createClass({displayName:"Status",getInitialState:function(){return{showOverwriteWarning:false}},componentWillReceiveProps:function(){this.setState({showOverwriteWarning:false})},onSaveClick:function(){if(this.props.lastLoadedStr==="never"){this.setState({showOverwriteWarning:true})}else{this.props.onDbSave()}},onCancelOverwrite:function(){this.setState({showOverwriteWarning:false})},render:function(){if(this.props.show){var conversionNoteEl=false;if(this.props.conversionNote){conversionNoteEl=React.createElement("div",null,this.props.conversionNote)}var lastSavedStr=this.props.meta.lastSaved;var lastLoadedStr=this.props.lastLoadedStr;if(this.props.meta.lastSaved!=="never"){lastSavedStr=moment(this.props.meta.lastSaved).fromNow()}if(this.props.lastLoadedStr!=="never"){lastLoadedStr=moment(this.props.lastLoadedStr).fromNow()}if(this.props.dropBoxStatus==="loading"){lastSavedStr="...";lastLoadedStr="..."}if(this.props.dropBoxStatus==="saving"){lastSavedStr="..."}var popupOverwrite=false;if(this.state.showOverwriteWarning){var buttonContainer=React.createElement("div",{className:"flexContHoriz"},React.createElement("button",{onClick:this.props.onDbSave,className:"button buttonGood"},"Yes"),React.createElement("button",{onClick:this.onCancelOverwrite,className:"button buttonGood"},"Oh god no"));popupOverwrite=React.createElement(Popup,{text:"You're about to save to your Dropbox without loading first. This will overwrite previous data in your Dropbox! Continue?",buttonContainer:buttonContainer})
}return React.createElement("div",{className:"Status Component"},popupOverwrite,React.createElement("div",null,"Infos loaded: ",this.props.dropBoxStatus==="loading"?"loading":this.props.infoCount),React.createElement("div",null,"Dropbox Status: ",this.props.dropBoxStatus),React.createElement("div",null,"Last save: "+lastSavedStr),React.createElement("div",null,"Last load: "+lastLoadedStr),conversionNoteEl,React.createElement("div",{className:"flexContHoriz"},React.createElement("button",{disabled:this.props.dropBoxStatus!=="initial",className:"buttonGood",onClick:this.props.onDBAuth},"Log into Dropbox"),React.createElement("button",{disabled:this.props.dropBoxStatus!=="loggedIn",onClick:this.props.onDbLoad},"Load from Dropbox"),React.createElement("button",{disabled:this.props.dropBoxStatus!=="loggedIn",onClick:this.onSaveClick},"Save to Dropbox")))}else{return React.createElement("div",{className:"Status Component"})}}});React.render(React.createElement(App,null),document.getElementById("content"));