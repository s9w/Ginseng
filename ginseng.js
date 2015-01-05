"use strict";

function getPreciseIntervalStr(interval) {
  var duration = moment.duration(interval);
  if (duration.asMinutes() <= 1) return "<1 min";
  if (duration.asYears() >= 1) return Math.round(duration.asYears() * 10) / 10 + " years";
  if (duration.asMonths() >= 1) return Math.round(duration.asMonths() * 10) / 10 + " months";
  if (duration.asWeeks() >= 1) return Math.round(duration.asWeeks() * 10) / 10 + " weeks";
  if (duration.asDays() >= 1) return Math.round(duration.asDays() * 10) / 10 + " days";
  if (duration.asHours() >= 1) return Math.round(duration.asHours() * 10) / 10 + " hours";
  if (duration.asMinutes() >= 1) return Math.round(duration.asMinutes() * 10) / 10 + " minutes";
}

function getShortPreciseIntervalStr(interval) {
  var duration = moment.duration(interval);
  if (duration.asMinutes() <= 1) return "<1 min";
  if (duration.asYears() >= 1) return Math.round(duration.asYears() * 10) / 10 + " y";
  if (duration.asMonths() >= 1) return Math.round(duration.asMonths() * 10) / 10 + " m";
  if (duration.asWeeks() >= 1) return Math.round(duration.asWeeks() * 10) / 10 + " w";
  if (duration.asDays() >= 1) return Math.round(duration.asDays() * 10) / 10 + " d";
  if (duration.asHours() >= 1) return Math.round(duration.asHours() * 10) / 10 + " h";
  if (duration.asMinutes() >= 1) return Math.round(duration.asMinutes() * 10) / 10 + " m";
}

var InfoBrowser = React.createClass({
  displayName: "InfoBrowser",
  getInitialState: function () {
    return {
      filterText: "",
      sortOrder: "1"
    };
  },
  onFilterChange: function (event) {
    this.setState({ filterText: event.target.value });
  },
  changeSortOrder: function (order) {
    var newOrder = order;
    if (this.state.sortOrder === order) {
      newOrder += "r";
    }
    this.setState({ sortOrder: newOrder });
  },
  render: function () {
    console.log("render browse");

    // sort
    var thisBrowser = this;
    var sortedInfos = this.props.infos.sort(function (a, b) {
      switch (thisBrowser.state.sortOrder) {
        case "1":
          return a.entries[0].localeCompare(b.entries[0]);
          break;
        case "1r":
          return -a.entries[0].localeCompare(b.entries[0]);
          break;
        case "2":
          return a.entries[1].localeCompare(b.entries[1]);
          break;
        case "2r":
          return -a.entries[1].localeCompare(b.entries[1]);
          break;
        case "age":
          return moment(a.creationDate).isBefore(b.creationDate) ? 1 : -1;
          break;
        case "ager":
          return moment(a.creationDate).isBefore(b.creationDate) ? -1 : 1;
          break;
      }
    });

    // generate trs
    var maxAge = 0;
    var age;
    var tableRows = [];
    var thData;
    for (var k = 0; k < sortedInfos.length; ++k) {
      age = moment().diff(moment(sortedInfos[k].creationDate));
      if (age > maxAge) {
        maxAge = age;
      }
    }
    for (var i = 0; i < sortedInfos.length; ++i) {
      age = moment().diff(moment(sortedInfos[i].creationDate));
      if (sortedInfos[i].entries[0].toLowerCase().indexOf(this.state.filterText.toLowerCase()) !== -1 || sortedInfos[i].entries[1].toLowerCase().indexOf(this.state.filterText.toLowerCase()) !== -1) {
        var ds = [];
        thData = [sortedInfos[i].entries[0], sortedInfos[i].entries[1], this.props.types[sortedInfos[i].typeID].name, sortedInfos[i].tags.join(", "), getShortPreciseIntervalStr(age)];
        for (var j = 0; j < thData.length; ++j) {
          var content;
          var shortenLen = j === 2 ? 5 : 15;
          if (thData[j].length > shortenLen) {
            content = thData[j].slice(0, shortenLen) + "...";
          } else {
            content = thData[j];
          }
          if (j == 4) {
            ds.push(React.createElement("td", {
              key: j
            }, React.createElement("div", {
              style: { position: "absolute" }
            }, content), React.createElement("div", {
              style: {
                height: "1em",
                background: "#E0E0E0",
                width: age / maxAge * 100 + "%"
              }
            })));
          } else {
            ds.push(React.createElement("td", {
              key: j
            }, content));
          }
        }
        tableRows.push(React.createElement("tr", {
          key: i,
          onClick: this.props.onRowSelect.bind(null, i)
        }, ds));
      }
    }

    // Table headers based on sort order
    var th_1 = "1st";
    var th_2 = "2nd";
    var th_age = "Age";
    switch (this.state.sortOrder) {
      case "1":
        th_1 += "↓";
        break;
      case "1r":
        th_1 += "↑";
        break;
      case "2":
        th_2 += "↓";
        break;
      case "2r":
        th_2 += "↑";
        break;
      case "age":
        th_age += "↓";
        break;
      case "ager":
        th_age += "↑";
        break;
    }

    return React.createElement("div", {
      className: "InfoBrowser Component"
    }, React.createElement("div", {
      className: "browseControls"
    }, React.createElement("input", {
      type: "text",
      placeholder: "Quick filter...",
      value: this.state.filterText,
      onChange: this.onFilterChange
    }), React.createElement("button", {
      className: "button buttonGood",
      onClick: this.props.onNew
    }, "New info")), React.createElement("table", null, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
      onClick: this.changeSortOrder.bind(this, "1")
    }, th_1), React.createElement("th", {
      onClick: this.changeSortOrder.bind(this, "2")
    }, th_2), React.createElement("th", null, "Type"), React.createElement("th", null, "Tags"), React.createElement("th", {
      onClick: this.changeSortOrder.bind(this, "age")
    }, th_age))), React.createElement("tbody", null, tableRows)));
  }
});
"use strict";

var InfoEdit = React.createClass({
  displayName: "InfoEdit",
  getInitialState: function () {
    return {
      info: JSON.parse(JSON.stringify(this.props.info)),
      previewID: false,
      newTagValue: ""
    };
  },
  componentDidMount: function () {
    console.log("componentDidMount");
    for (var entryIdx = 0; entryIdx < this.state.info.entries.length; ++entryIdx) {
      this.refs[entryIdx].getDOMNode().style.height = this.refs[entryIdx].getDOMNode().scrollHeight - 4 + "px";
    }
    //    //Only focus first text field with new infos. Otherwise confusing/unwanted, especially on mobile
    //    if(!("info" in this.props)) {
    //        this.refs[0].getDOMNode().focus();
    //    }
  },
  onTypeChange: function (newTypeID) {
    var newInfo = JSON.parse(JSON.stringify(this.state.info));
    newInfo.typeID = newTypeID;
    var newEntriesLength = this.props.types[newTypeID].entryNames.length;
    var sizeDiff = newEntriesLength - this.state.info.entries.length;
    if (sizeDiff > 0) {
      for (var i = 0; i < sizeDiff; i++) {
        newInfo.entries.push("");
      }
    } else if (sizeDiff < 0) {
      newInfo.entries = newInfo.entries.slice(0, newEntriesLength);
    }
    this.setState({ info: newInfo });
  },
  toggleTag: function (tagStr) {
    var newInfo = JSON.parse(JSON.stringify(this.state.info));
    if (_.contains(newInfo.tags, tagStr)) {
      newInfo.tags.splice(newInfo.tags.indexOf(tagStr), 1);
    } else {
      newInfo.tags.push(tagStr);
    }
    this.setState({ info: newInfo, newTagValue: "" });
  },

  setPreview: function (newPreview) {
    this.setState({ previewID: newPreview });
  },
  onEntryEdit: function (event) {
    var newInfo = JSON.parse(JSON.stringify(this.state.info));
    var node = this.refs[event.target.name].getDOMNode();
    node.style.height = "auto";
    node.style.height = node.scrollHeight - 4 + "px";
    newInfo.entries[event.target.name] = event.target.value;
    this.setState({
      info: newInfo
    });
  },
  handleNewTagChange: function (e) {
    this.setState({ newTagValue: e.target.value });
  },
  render: function () {
    var _this = this;
    var infoTypeSection;
    if (this.props.info.entries[0] !== "") {
      //edit
      infoTypeSection = React.createElement("section", null, React.createElement("h3", null, "Info Type"), React.createElement("span", {
        className: "sectionContent"
      }, this.props.types[this.state.info.typeID].name));
    } else {
      // new
      infoTypeSection = React.createElement("section", null, React.createElement("h3", null, "Info Type"), React.createElement(ITypeSwitcher, {
        className: "sectionContent",
        types: this.props.types,
        selectedTypeID: this.state.info.typeID,
        onTypeChange: this.onTypeChange
      }));
    }

    // the entries
    var entrySections = [];
    for (var entryIdx = 0; entryIdx < this.state.info.entries.length; ++entryIdx) {
      entrySections.push(React.createElement("textarea", {
        key: entryIdx,
        value: this.state.info.entries[entryIdx],
        placeholder: this.props.types[this.state.info.typeID].entryNames[entryIdx],
        onChange: this.onEntryEdit,
        style: { overflow: "hidden" },
        name: entryIdx,
        ref: entryIdx
      }));
    }

    return React.createElement("div", {
      className: "InfoEdit Component"
    }, infoTypeSection, React.createElement("section", null, React.createElement("h3", null, "Entries"), entrySections), React.createElement("section", null, React.createElement("h3", null, "Tags"), React.createElement("div", null, _.union(this.props.usedTags, this.state.info.tags).map(function (tag) {
      return React.createElement("button", {
        key: tag,
        className: _.contains(_this.state.info.tags, tag) ? "buttonGood" : "",
        onClick: _this.toggleTag.bind(_this, tag)
      }, tag);
    }), React.createElement("input", {
      value: this.state.newTagValue,
      placeholder: "new tag",
      onChange: this.handleNewTagChange
    }), React.createElement("button", {
      onClick: this.toggleTag.bind(this, this.state.newTagValue)
    }, "+"))), React.createElement("section", null, React.createElement("h3", null, "Preview"), React.createElement("div", null, React.createElement("button", {
      key: "none",
      className: this.state.previewID ? "" : "buttonGood",
      onClick: this.setPreview.bind(this, false)
    }, "None"), _.keys(this.props.types[this.state.info.typeID].templates).map(function (templateID) {
      return React.createElement("button", {
        key: templateID,
        className: _this.state.previewID === templateID ? "buttonGood" : "",
        onClick: _this.setPreview.bind(_this, templateID)
      }, "Templ. " + templateID);
    }))), this.state.previewID && React.createElement(ReviewDisplay, {
      type: this.props.types[this.state.info.typeID],
      templateID: this.state.previewID,
      info: this.state.info,
      progressState: "backSide"
    }), React.createElement("div", {
      className: "flexContHoriz"
    }, React.createElement("button", {
      disabled: JSON.stringify(this.props.info) === JSON.stringify(this.state.info),
      className: "buttonGood",
      onClick: this.props.onSave.bind(null, this.state.info)
    }, this.props.onDelete ? "save" : "add"), React.createElement("button", {
      onClick: this.props.cancelEdit
    }, "Cancel"), this.props.onDelete && React.createElement("button", {
      className: "buttonDanger",
      onClick: this.props.onDelete
    }, "Delete")));
  }
});

var Popup = React.createClass({
  displayName: "Popup",
  render: function () {
    return React.createElement("div", {
      className: "popup"
    }, React.createElement("p", null, this.props.text), this.props.buttonContainer);
  }
});

var ITypeSwitcher = React.createClass({
  displayName: "ITypeSwitcher",
  onTypeChange: function (typeID) {
    this.props.onTypeChange(typeID);
  },
  render: function () {
    var typeNameOptions = [];
    for (var typeID in this.props.types) {
      typeNameOptions.push(React.createElement("button", {
        key: typeID,
        className: "button" + (this.props.selectedTypeID === typeID ? " buttonGood" : ""),
        onClick: this.onTypeChange.bind(this, typeID)
      }, this.props.types[typeID].name));
    }
    if (this.props.onAddType) {
      typeNameOptions.push(React.createElement("button", {
        className: "button",
        key: "new",
        onClick: this.props.onAddType
      }, "New.."));
    }

    return React.createElement("div", {
      className: "sectionContent wrap"
    }, typeNameOptions);
  }
});
"use strict";

var Intervaller = React.createClass({
  displayName: "Intervaller",
  getInitialState: function () {
    return {
      modifyType: this.props.reviewInterval === 0 ? "set" : "change",
      changeType: "minutes", // minutes, hours, weeks, relative
      modifyAmount: 10,
      activeKeyIndex: false
    };
  },
  componentWillReceiveProps: function (nextProps) {
    this.setState({ activeKeyIndex: false });
  },
  onModeChange: function (newModeStr) {
    if (newModeStr !== this.state.modifyType) {
      this.setState({ modifyType: newModeStr, activeKeyIndex: false });
    }
  },
  componentWillMount: function () {
    console.log("intervaller mount");
  },
  getNewInterval: function () {
    var intervalDiff;
    if (this.state.modifyType === "change") {
      if (this.state.changeType === "percent") {
        intervalDiff = this.props.reviewInterval * this.state.modifyAmount / 100;
        return intervalDiff + this.props.reviewInterval;
      } else {
        intervalDiff = moment.duration(this.state.modifyAmount, this.state.changeType.toLowerCase()).asMilliseconds();
        return this.props.reviewInterval + intervalDiff;
      }
    } else if (this.state.modifyType === "set") {
      return moment.duration(this.state.modifyAmount, this.state.changeType.toLowerCase()).asMilliseconds();
    }
  },
  onIntervalChoice: function (modifyAmount, keyIndex, changeType) {
    if (this.state.activeKeyIndex === keyIndex) {
      this.props.applyInterval(this.getNewInterval());
    }
    this.setState({
      activeKeyIndex: keyIndex,
      changeType: changeType,
      modifyAmount: modifyAmount
    });
  },
  render: function () {
    console.log("render intervaller");
    var cx = React.addons.classSet;
    var intervals = [];
    var keyIndex = 0;
    for (var timeframeKey in this.props.timeIntervalChoices) {
      for (var i = 0; i < this.props.timeIntervalChoices[timeframeKey].length; ++i) {
        var buttonClasses = cx({
          unselectable: true,
          intervalMinutes: timeframeKey === "Minutes",
          intervalHours: timeframeKey === "Hours",
          intervalDays: timeframeKey === "Days",
          intervalWeeks: timeframeKey === "Weeks",
          intervalMonths: timeframeKey === "Months",
          intervalPercent: timeframeKey === "Percent",
          buttonSelected: keyIndex === this.state.activeKeyIndex,
          invisible: timeframeKey === "Percent" && this.state.modifyType === "set"
        });
        var plusEL = React.createElement("span", {
          className: this.state.modifyType === "change" ? "" : "invisible"
        }, "+");
        var amount = this.props.timeIntervalChoices[timeframeKey][i];
        var buttonStr = amount;
        if (timeframeKey === "Percent") buttonStr += "%";else buttonStr += timeframeKey.slice(0, 1).toLowerCase();
        intervals.push(React.createElement("button", {
          key: keyIndex,
          className: buttonClasses,
          onClick: this.onIntervalChoice.bind(this, amount, keyIndex, timeframeKey.toLowerCase())
        }, plusEL, " ", buttonStr));
        keyIndex += 1;
      }
    }

    return React.createElement("div", {
      className: this.props.show ? "" : "invisible"
    }, React.createElement("button", {
      disabled: this.props.reviewInterval === 0,
      className: " " + (this.state.modifyType === "change" ? "buttonGood" : ""),
      onClick: this.onModeChange.bind(this, "change")
    }, "change"), React.createElement("button", {
      className: " " + (this.state.modifyType === "set" ? "buttonGood" : ""),
      onClick: this.onModeChange.bind(this, "set")
    }, "set"), React.createElement("div", {
      className: "intervalButtonCont"
    }, intervals), React.createElement("div", null, "Old interval: ", getPreciseIntervalStr(this.props.reviewInterval)), React.createElement("div", {
      className: this.state.activeKeyIndex ? "" : "invisible"
    }, "New interval: ", getPreciseIntervalStr(this.getNewInterval())), React.createElement("div", {
      className: this.state.activeKeyIndex ? "" : "invisible"
    }, "Due on: ", moment().add(moment.duration(this.getNewInterval())).format("dddd, YYYY-MM-DD, HH:mm")));
  }
});
"use strict";

var Review = React.createClass({
  displayName: "Review",
  getInitialState: function () {
    return {
      progressState: "frontSide"
    };
  },
  componentDidMount: function () {
    if ("flipButton" in this.refs) this.refs.flipButton.getDOMNode().focus();
  },
  componentDidUpdate: function () {
    if (this.state.progressState === "frontSide" && "flipButton" in this.refs) this.refs.flipButton.getDOMNode().focus();
  },
  flip: function () {
    this.setState({ progressState: "backSide" });
  },
  applyInterval: function (infoIndex, reviewKey, newInterval) {
    this.props.applyInterval(infoIndex, reviewKey, newInterval);
    this.setState({ progressState: "frontSide" });
  },
  filterInfo: function (filterStr, info) {
    if (filterStr === "") {
      return true;
    }

    var filtersOr = filterStr.split(" or ");
    for (var i = 0; i < filtersOr.length; ++i) {
      var filterElements = filtersOr[i].split(" and ");
      for (var j = 0; j < filterElements.length; ++j) {
        var innerTruth = true;
        var matches;
        if ((matches = /tag: ?(\w+)/.exec(filterElements[j])) != null) {
          if (!_.contains(info.tags, matches[1])) {
            innerTruth = false;
          }
        } else {
          console.log("Error, unknown filter: " + filterElements[j]);
          return false;
        }
      }
      if (innerTruth) return true;
    }
    return false;
  },
  render: function () {
    // filter due cards and chose the next
    var urgency;
    var dueCount = 0;
    var realInterval;
    var nextReview = {
      urgency: 1,
      infoIndex: 0,
      info: false,
      templateID: 0,
      realInterval: 0
    };
    for (var infoIndex = 0; infoIndex < this.props.infos.length; ++infoIndex) {
      var info = this.props.infos[infoIndex];
      for (var templateID in info.reviews) {
        if (this.filterInfo(this.props.types[info.typeID].templates[templateID].condition, info)) {
          if (info.reviews[templateID].length > 0) {
            var lastReview = info.reviews[templateID][info.reviews[templateID].length - 1];
            realInterval = moment().diff(moment(lastReview.reviewTime));
            urgency = realInterval / moment(lastReview.dueTime).diff(moment(lastReview.reviewTime));
          } else {
            urgency = 1.1;
            realInterval = 0;
          }

          if (urgency >= 1) {
            dueCount++;
            if (urgency > nextReview.urgency) {
              nextReview.urgency = urgency;
              nextReview.info = info;
              nextReview.infoIndex = infoIndex;
              nextReview.templateID = templateID;
              nextReview.realInterval = realInterval;
            }
          }
        }
      }
    }

    if (dueCount > 0) {
      return React.createElement("div", {
        className: "Component"
      }, React.createElement("button", {
        tabIndex: "2",
        onClick: this.props.gotoEdit.bind(null, nextReview.infoIndex)
      }, "Edit Info"), React.createElement("span", null, "Due count: " + dueCount), React.createElement(ReviewDisplay, {
        type: this.props.types[nextReview.info.typeID],
        templateID: nextReview.templateID,
        info: nextReview.info,
        progressState: this.state.progressState
      }), this.state.progressState === "frontSide" && React.createElement("div", {
        style: { textAlign: "center" }
      }, React.createElement("button", {
        tabIndex: "1",
        ref: "flipButton",
        className: "buttonGood",
        onClick: this.flip
      }, "Show backside")), React.createElement(Intervaller, {
        show: this.state.progressState === "backSide",
        reviewInterval: nextReview.realInterval,
        applyInterval: this.applyInterval.bind(this, nextReview.infoIndex, nextReview.templateID),
        timeIntervalChoices: this.props.timeIntervalChoices
      }));
    } else {
      return React.createElement("div", {
        className: "Component",
        style: { textAlign: "center" }
      }, "No due reviews");
    }
  }
});
"use strict";

var ReviewDisplay = React.createClass({
  displayName: "ReviewDisplay",
  renderMarkdown: function (str) {
    var latexStringBuffer = [];
    // replace math with $$
    var backStrNew = str.replace(/(\$.*?\$)/g, function (match, p1) {
      latexStringBuffer.push(p1.slice(1, -1));
      return "$$";
    });
    // convert rest markdown to html
    marked.setOptions({ breaks: true });
    return marked(backStrNew).replace(/\$\$/g, function () {
      // and replace the placeholders with transformed math
      try {
        return katex.renderToString(latexStringBuffer.shift());
      } catch (e) {
        console.log("Error: " + e.message);
        return "ERROR.";
      }
    });
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    return nextProps.info.typeID !== this.props.info.templateID || JSON.stringify(nextProps.info.entries) !== JSON.stringify(this.props.info.entries) || nextProps.progressState !== this.props.progressState;
  },
  render: function () {
    console.log("render ReviewDisplay");
    var thisOuter = this;
    var frontStr = this.props.type.templates[this.props.templateID].front.replace(/{(\w*)}/g, function (match, p1) {
      return thisOuter.props.info.entries[thisOuter.props.type.entryNames.indexOf(p1)];
    });

    var backStr = this.props.type.templates[this.props.templateID].back.replace(/{(\w*)}/g, function (match, p1) {
      return thisOuter.props.info.entries[thisOuter.props.type.entryNames.indexOf(p1)];
    });
    return React.createElement("div", {
      id: "reviewStage"
    }, React.createElement("div", {
      className: "markdowned",
      dangerouslySetInnerHTML: { __html: this.renderMarkdown(frontStr) }
    }), React.createElement("div", {
      className: "markdowned " + (this.props.progressState === "backSide" ? "" : "invisible"),
      dangerouslySetInnerHTML: { __html: this.renderMarkdown(backStr) }
    }));
  }
});
"use strict";

var InfoTypes = React.createClass({
  displayName: "InfoTypes",
  getInitialState: function () {
    var chosenTypeID = 0;
    while (!(chosenTypeID in this.props.types)) {
      chosenTypeID++;
    }
    if (this.props.selectedTypeID) {
      chosenTypeID = this.props.selectedTypeID;
    }
    return {
      selectedTypeID: chosenTypeID.toString(),
      types: this.props.types,
      changes: {
        renames: "",
        typeResizes: []
      },
      mode: "main"
    };
  },
  onFieldNameEdit: function (fieldNameIndex, event) {
    var newTypes = JSON.parse(JSON.stringify(this.state.types));
    newTypes[this.state.selectedTypeID].entryNames[fieldNameIndex] = event.target.value;
    var newchanges = JSON.parse(JSON.stringify(this.state.changes));
    newchanges.renames = "renamed";
    this.setState({
      types: newTypes,
      changes: newchanges
    });
  },
  selectType: function (newID) {
    this.setState({
      selectedTypeID: newID,
      mode: "main"
    });
  },
  onNameEdit: function (event) {
    var newTypes = JSON.parse(JSON.stringify(this.state.types));
    newTypes[this.state.selectedTypeID].name = event.target.value;
    var newchanges = JSON.parse(JSON.stringify(this.state.changes));
    newchanges.renames = "renamed";
    this.setState({
      types: newTypes,
      changes: newchanges
    });
  },
  onFieldsResize: function (fieldNameIndex) {
    // resize the type
    var newTypes = JSON.parse(JSON.stringify(this.state.types));
    if (fieldNameIndex === "add") {
      newTypes[this.state.selectedTypeID].entryNames.push("");
    } else {
      newTypes[this.state.selectedTypeID].entryNames.splice(fieldNameIndex, 1);
    }

    // set changes
    var newchanges = JSON.parse(JSON.stringify(this.state.changes));
    newchanges.typeResizes.push({ id: this.state.selectedTypeID, fieldNameIndex: fieldNameIndex });

    this.setState({
      types: newTypes,
      changes: newchanges
    });
  },
  componentDidUpdate: function () {
    if (this.state.types[this.state.selectedTypeID].name === "New info type") {
      this.refs.nameRef.getDOMNode().focus();
    }
  },
  onAddType: function () {
    var newTypes = JSON.parse(JSON.stringify(this.state.types));
    // get next type ID
    var nextTypeID = "0";
    for (var typeID in newTypes) {
      if (parseInt(typeID, 10) > parseInt(nextTypeID, 10)) {
        nextTypeID = typeID;
      }
    }
    nextTypeID = (parseInt(nextTypeID, 10) + 1).toString();

    newTypes[nextTypeID] = {
      name: "New info type",
      entryNames: ["first field", "second field"],
      templates: {
        "0": {
          front: "{front}",
          back: "{back}",
          condition: ""
        },
        "1": {
          front: "{back}",
          back: "{front}",
          condition: "tag: reverse"
        }
      }
    };
    this.setState({
      types: newTypes,
      selectedTypeID: nextTypeID
    });
  },
  setMode: function (modeStr) {
    this.setState({ mode: modeStr });
  },
  onViewChange: function (type, newContent) {
    var newTypes = JSON.parse(JSON.stringify(this.state.types));
    newTypes[this.state.selectedTypeID].templates[this.state.mode][type] = newContent;
    this.setState({ types: newTypes });
  },
  render: function () {
    var _this = this;
    console.log("render types");
    var selectedType = this.state.types[this.state.selectedTypeID];

    var mainSection;
    if (this.state.mode !== "main") {
      mainSection = React.createElement(TemplateDetails, {
        view: selectedType.templates[this.state.mode],
        onViewChange: this.onViewChange
      });
    } else {
      mainSection = [React.createElement("section", {
        key: 0
      }, React.createElement("h3", null, "Name"), React.createElement("input", {
        className: "sectionContent",
        type: "text",
        ref: "nameRef",
        id: "typeName",
        value: selectedType.name,
        onChange: this.onNameEdit
      })), React.createElement("section", {
        key: 1
      }, React.createElement("h3", null, "Entries"), selectedType.entryNames.map(function (entryName, i) {
        return React.createElement("div", {
          key: i,
          className: "sectionContent"
        }, React.createElement("input", {
          className: "sectionContentEl",
          value: entryName,
          onChange: _this.onFieldNameEdit.bind(_this, i)
        }), React.createElement("button", {
          className: "buttonDanger microbutton sectionContentElFixed" + (selectedType.entryNames.length <= 2 ? " invisible" : ""),
          onClick: _this.onFieldsResize.bind(_this, i)
        }, "✖"));
      }), React.createElement("div", {
        className: "sectionContent"
      }, React.createElement("button", {
        className: "buttonGood",
        onClick: this.onFieldsResize.bind(this, "add")
      }, "Add entry")))];
    }

    var isChanged = JSON.stringify(this.props.types) !== JSON.stringify(this.state.types);
    return React.createElement("div", {
      className: "Component"
    }, React.createElement("section", null, React.createElement("h3", null, "Info Type"), React.createElement(ITypeSwitcher, {
      className: "sectionContent",
      types: this.state.types,
      selectedTypeID: this.state.selectedTypeID,
      onTypeChange: this.selectType,
      onAddType: this.onAddType
    })), React.createElement("div", {
      className: "sectionContent tabContainer"
    }, React.createElement("button", {
      className: this.state.mode === "main" ? "buttonGood" : "",
      onClick: this.setMode.bind(this, "main")
    }, "Type"), Object.keys(selectedType.templates).map(function (templateID) {
      return React.createElement("button", {
        key: templateID,
        className: "flexElemContHoriz button " + (_this.state.mode === templateID ? "buttonGood" : ""),
        onClick: _this.setMode.bind(_this, templateID)
      }, "Template " + templateID);
    })), mainSection, React.createElement("div", {
      className: "flexContHoriz"
    }, React.createElement("button", {
      disabled: !isChanged,
      className: "buttonGood",
      onClick: this.props.onSave.bind(null, this.state.types, this.state.changes)
    }, "Save"), React.createElement("button", {
      onClick: this.props.cancelEdit
    }, "Cancel")));
  }
});
"use strict";

var client = new Dropbox.Client({ key: "ob9346e5yc509q2" });
//client.authDriver(new Dropbox.AuthDriver.Popup({receiverUrl: "https://s9w.github.io/ginseng/dropbox_receiver.html"}));
client.authDriver(new Dropbox.AuthDriver.Popup({ receiverUrl: "https://leastaction.org/ginseng/dropbox_receiver.html" }));


var App = React.createClass({
  displayName: "App",
  getInitialState: function () {
    return {
      infos: init_data.infos,
      infoTypes: init_data.infoTypes,
      ginseng_settings: init_data.settings,
      meta: init_data.meta,
      activeMode: "status",
      selectedTypeID: false,
      selectedInfoIndex: false,

      conversionNote: false,
      dropBoxStatus: "initial",
      lastLoadedStr: "never",
      isChanged: false
    };
  },
  clickNav: function (mode) {
    this.setState({ activeMode: mode });
  },
  authDB: function () {
    this.setState({ dropBoxStatus: "logging in..." });
    var thisApp = this;
    client.authenticate(function (error) {
      if (error) {
        thisApp.setState({ dropBoxStatus: "ERROR" });
      } else {
        thisApp.setState({ dropBoxStatus: "loggedIn" });
      }
    });
  },
  saveDB: function () {
    this.setState({
      dropBoxStatus: "saving"
    });
    var thisApp = this;
    var newMeta = JSON.parse(JSON.stringify(this.state.meta));
    newMeta.lastSaved = moment().format();
    var writeInfos = JSON.parse(JSON.stringify(this.state.infos));
    for (var i = 0; i < writeInfos.length; i++) {
      var info = writeInfos[i];
      for (var reviewKey in info.reviews) if (info.reviews[reviewKey].length > this.state.ginseng_settings.reviewHistoryLength) {
        info.reviews[reviewKey] = info.reviews[reviewKey].slice(-2);
      }
    }
    var writeData = {
      infos: writeInfos,
      infoTypes: this.state.infoTypes,
      settings: this.state.ginseng_settings,
      meta: newMeta
    };
    client.writeFile("ginseng_data.txt", JSON.stringify(writeData, null, "\t"), function (error) {
      if (error) {
        console.log("error: " + error);
      }
      thisApp.setState({
        meta: newMeta,
        dropBoxStatus: "loggedIn",
        conversionNote: false,
        isChanged: false
      });
    });
  },
  loadJsonData: function (jsonData) {
    var sanitizedData = {
      infos: jsonData.infos,
      infoTypes: jsonData.infoTypes,
      ginseng_settings: jsonData.settings
    };
    if (!("meta" in jsonData)) {
      this.setState({ conversionNote: "old data format from before 2014-12-17. Converted!" });
      sanitizedData.meta = {
        dataFormatVersion: "2014-12-17",
        lastSaved: "never"
      };
    } else {
      this.setState({ conversionNote: false });
      sanitizedData.meta = jsonData.meta;
    }
    return sanitizedData;
  },
  loadDB: function () {
    this.setState({ dropBoxStatus: "loading" });
    var thisApp = this;
    client.readFile("ginseng_data.txt", function (error, data) {
      if (error) {
        console.log("ERROR: " + error);
      }
      var sanitizedData = thisApp.loadJsonData(JSON.parse(data));
      thisApp.setState({
        infos: sanitizedData.infos,
        infoTypes: sanitizedData.infoTypes,
        ginseng_settings: sanitizedData.ginseng_settings,
        meta: sanitizedData.meta,
        lastLoadedStr: moment().format(),
        dropBoxStatus: "loggedIn",
        isChanged: false
      });
    });
  },
  gotoEdit: function (infoIndex) {
    this.setState({
      selectedInfoIndex: infoIndex,
      activeMode: "edit"
    });
  },
  onInfoEdit: function (newInfo) {
    var newInfos = this.state.infos.slice();
    if (this.state.activeMode === "edit") {
      newInfos[this.state.selectedInfoIndex] = newInfo;
    } else {
      newInfos.push(newInfo);
    }
    this.setState({
      infos: newInfos,
      activeMode: "browse",
      isChanged: true
    });
  },
  onInfoDelete: function () {
    var newInfos = JSON.parse(JSON.stringify(this.state.infos));
    console.log("ondelete, this.state.selectedInfoIndex: " + this.state.selectedInfoIndex);
    newInfos.splice(this.state.selectedInfoIndex, 1);
    this.setState({
      infos: newInfos,
      activeMode: "browse"
    });
  },
  onTypesEdit: function (newTypes, changes) {
    var newTypes_copy = JSON.parse(JSON.stringify(newTypes));
    var new_infos = JSON.parse(JSON.stringify(this.state.infos));

    for (var infoIdx = 0; infoIdx < new_infos.length; ++infoIdx) {
      for (var resizeIdx = 0; resizeIdx < changes.typeResizes.length; ++resizeIdx) {
        if (new_infos[infoIdx].typeID === changes.typeResizes[resizeIdx].id) {
          var fieldNameIndex = changes.typeResizes[resizeIdx].fieldNameIndex;
          if (fieldNameIndex === "add") {
            new_infos[infoIdx].entries.push("");
          } else {
            new_infos[infoIdx].entries.splice(fieldNameIndex, 1);
          }
        }
      }
    }

    this.setState({
      infoTypes: newTypes_copy,
      infos: new_infos,
      activeMode: "browse",
      isChanged: true
    });
  },
  applyInterval: function (infoIndex, reviewKey, newInterval) {
    var newInfos = JSON.parse(JSON.stringify(this.state.infos));
    newInfos[infoIndex].reviews[reviewKey].push({
      reviewTime: moment().format(),
      dueTime: moment().add(moment.duration(newInterval)).format()
    });
    this.setState({
      infos: newInfos,
      isChanged: true
    });
  },
  getNewInfo: function () {
    var firstTypeID = "0";
    while (!(firstTypeID in this.state.infoTypes)) {
      firstTypeID = (parseInt(firstTypeID, 10) + 1).toString();
    }
    var entries = _.times(this.state.infoTypes[firstTypeID].entryNames.length, function () {
      return "";
    });
    var reviews = {};
    for (var i = 0; i < this.state.infoTypes[firstTypeID].entryNames.length; ++i) {
      reviews[i] = [];
    }
    return {
      typeID: firstTypeID,
      entries: entries,
      reviews: reviews,
      tags: [],
      creationDate: moment().format()
    };
  },
  render: function () {
    console.log("render main");

    return React.createElement("div", {
      className: "app"
    }, React.createElement("div", {
      className: "navBar unselectable"
    }, React.createElement("div", {
      className: this.state.activeMode == "status" ? "active" : "inactive",
      title: this.state.isChanged ? "unsaved changes" : "",
      onClick: this.clickNav.bind(this, "status")
    }, "Status", React.createElement("span", {
      className: this.state.isChanged ? "" : "invisible"
    }, "*")), React.createElement("div", {
      className: ["browse", "new", "edit"].indexOf(this.state.activeMode) !== -1 ? "active" : "inactive",
      onClick: this.clickNav.bind(this, "browse")
    }, "Infos"), React.createElement("div", {
      className: this.state.activeMode == "types" ? "active" : "inactive",
      onClick: this.clickNav.bind(this, "types")
    }, "Types"), React.createElement("div", {
      className: this.state.activeMode == "review" ? "active" : "inactive",
      onClick: this.clickNav.bind(this, "review")
    }, "Review")), this.state.activeMode === "status" && React.createElement(Status, {
      infoCount: this.state.infos.length,
      dropBoxStatus: this.state.dropBoxStatus,
      onDBAuth: this.authDB,
      onDbSave: this.saveDB,
      meta: this.state.meta,
      lastLoadedStr: this.state.lastLoadedStr,
      onDbLoad: this.loadDB,
      conversionNote: this.state.conversionNote
    }), _.contains(["new", "edit"], this.state.activeMode) && React.createElement(InfoEdit, {
      info: this.state.activeMode === "new" ? this.getNewInfo() : this.state.infos[this.state.selectedInfoIndex],
      onDelete: this.state.activeMode === "edit" ? this.onInfoDelete : false,
      types: this.state.infoTypes,
      usedTags: _(this.state.infos).pluck("tags").flatten().union().value(),
      onSave: this.onInfoEdit,
      cancelEdit: this.clickNav.bind(this, "browse")
    }), this.state.activeMode === "browse" && React.createElement(InfoBrowser, {
      infos: this.state.infos,
      types: this.state.infoTypes,
      onRowSelect: this.gotoEdit,
      onNew: this.clickNav.bind(this, "new"),
      selections: this.state.ginseng_selections
    }), this.state.activeMode === "types" && React.createElement(InfoTypes, {
      types: this.state.infoTypes,
      cancelEdit: this.clickNav.bind(this, "browse"),
      onSave: this.onTypesEdit,
      selectedTypeID: this.state.selectedTypeID
    }), this.state.activeMode === "review" && React.createElement(Review, {
      infos: this.state.infos,
      types: this.state.infoTypes,
      applyInterval: this.applyInterval,
      timeIntervalChoices: this.state.ginseng_settings.timeIntervalChoices,
      gotoEdit: this.gotoEdit
    }));
  }
});

var Status = React.createClass({
  displayName: "Status",
  getInitialState: function () {
    return {
      showOverwriteWarning: false
    };
  },
  componentWillReceiveProps: function () {
    this.setState({ showOverwriteWarning: false });
  },
  onSaveClick: function () {
    if (this.props.lastLoadedStr === "never") {
      this.setState({ showOverwriteWarning: true });
    } else {
      this.props.onDbSave();
    }
  },
  onCancelOverwrite: function () {
    this.setState({ showOverwriteWarning: false });
  },
  render: function () {
    var conversionNoteEl = false;
    if (this.props.conversionNote) {
      conversionNoteEl = React.createElement("div", null, this.props.conversionNote);
    }

    var lastSavedStr = this.props.meta.lastSaved;
    var lastLoadedStr = this.props.lastLoadedStr;
    if (this.props.meta.lastSaved !== "never") {
      lastSavedStr = moment(this.props.meta.lastSaved).fromNow();
    }
    if (this.props.lastLoadedStr !== "never") {
      lastLoadedStr = moment(this.props.lastLoadedStr).fromNow();
    }
    if (this.props.dropBoxStatus === "loading") {
      lastSavedStr = "...";
      lastLoadedStr = "...";
    }
    if (this.props.dropBoxStatus === "saving") {
      lastSavedStr = "...";
    }

    var popupOverwrite = false;
    if (this.state.showOverwriteWarning) {
      var buttonContainer = React.createElement("div", {
        className: "flexContHoriz"
      }, React.createElement("button", {
        onClick: this.props.onDbSave,
        className: "button buttonGood"
      }, "Yes"), React.createElement("button", {
        onClick: this.onCancelOverwrite,
        className: "button buttonGood"
      }, "Oh god no"));
      popupOverwrite = React.createElement(Popup, {
        text: "You're about to save to your Dropbox without loading first. This will overwrite previous data in your Dropbox! Continue?",
        buttonContainer: buttonContainer
      });
    }

    return React.createElement("div", {
      className: "Status Component"
    }, popupOverwrite, React.createElement("div", null, "Infos loaded: ", this.props.dropBoxStatus === "loading" ? "loading" : this.props.infoCount), React.createElement("div", null, "Dropbox Status: ", this.props.dropBoxStatus), React.createElement("div", null, "Last save: " + lastSavedStr), React.createElement("div", null, "Last load: " + lastLoadedStr), conversionNoteEl, React.createElement("div", {
      className: "flexContHoriz"
    }, React.createElement("button", {
      disabled: this.props.dropBoxStatus !== "initial",
      className: "buttonGood",
      onClick: this.props.onDBAuth
    }, "Log into Dropbox"), React.createElement("button", {
      disabled: this.props.dropBoxStatus !== "loggedIn",
      onClick: this.props.onDbLoad
    }, "Load from Dropbox"), React.createElement("button", {
      disabled: this.props.dropBoxStatus !== "loggedIn",
      onClick: this.onSaveClick
    }, "Save to Dropbox")));
  }
});

React.render(React.createElement(App, null), document.getElementById("content"));
"use strict";

var TemplateDetails = React.createClass({
  displayName: "TemplateDetails",
  onViewChange: function (type, event) {
    this.props.onViewChange(type, event.target.value);
  },
  render: function () {
    return React.createElement("div", null, React.createElement("section", null, React.createElement("h3", null, "Front"), React.createElement("textarea", {
      className: "sectionContent",
      value: this.props.view.front,
      rows: (this.props.view.front.match(/\n/g) || []).length + 1,
      onChange: this.onViewChange.bind(this, "front")
    })), React.createElement("section", null, React.createElement("h3", null, "Back"), React.createElement("textarea", {
      className: "sectionContent",
      value: this.props.view.back,
      rows: (this.props.view.back.match(/\n/g) || []).length + 1,
      onChange: this.onViewChange.bind(this, "back")
    })), React.createElement("section", null, React.createElement("h3", null, "Filter"), React.createElement("input", {
      className: "sectionContent",
      value: this.props.view.condition,
      onChange: this.onViewChange.bind(this, "condition")
    })));
  }
});
