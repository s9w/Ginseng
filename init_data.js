var init_data = {
  "infos": [
    {
      "type": "Front and back",
      "fields": ["child", "el niño"],
      "tags": ["spanish", "language", "reverse"],
      "creationDate": "2014-11-27T09:43:46+01:00",
      "reviews":[
          [
            {
              "reviewTime": "2014-12-04T10:46:39+01:00",
              "dueTime": "2014-12-04T12:46:39+01:00",
              "modifier": "Set review time"
            },
            {
              "reviewTime": "2014-12-04T13:46:39+01:00",
              "dueTime": "2014-12-04T20:46:39+01:00",
              "modifier": "Set interval"
            }
          ],
          []
      ]
    }
  ],
  "infoTypes": [
    {
      "name": "Front and back",
      "fieldNames": ["front", "back"],
      "views": [
        {
          "front": "Hier ist front: {front}",
          "back": "Hier ist back: {back}. Und hier noch **bold** uuh\nund nächste zeile",
          "condition": ""
        },
        {
          "front": "Und andersrum. Hier ist back: {back}",
          "back": "Hier ist front: {front}. Und hier noch **bold** uuh\nund nächste zeile",
          "condition": "tag: reverse"
        }
      ]
    }
  ],
  "intervalModifiers":[
    {
      "name": "Set review time",
      "parameters": ["time"]
    },
    {
      "name": "Set interval",
      "parameters": ["months", "weeks", "days", "hours", "minutes"]
    },
    {
      "name": "Modify time since last review relatively",
      "parameters": ["percent"]
    },
    {
      "name": "Modify time since last review absolutely",
      "parameters": ["months", "weeks", "days", "hours", "minutes"]
    }
  ],
  "selections": [
    {
      "name": "All",
      "string": ""
    },
    {
      "name": "Due + not hidden",
      "string": "is: due, tag: !hidden"
    },
    {
      "name": "Science",
      "string": "tag: math OR tag: physics"
    }
  ],
  "settings":{
    "lastInfoType": "Front and back"
  }
};