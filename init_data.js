var init_data = {
        "infos": [
            {
                "typeID": "0",
                "entries": [
                    "Weihnachten",
                    "Christmas"
                ],
                "tags": [
                    "englisch"
                ],
                "creationDate": "2014-12-10T21:40:09+01:00",
                "reviews": {
                    "0": [],
                    "1": []
                }
            },
            {
                "typeID": "0",
                "entries": [
                    "Tree",
                    "Baum"
                ],
                "tags": [
                    "englisch", "reverse"
                ],
                "creationDate": "2014-12-10T21:40:09+01:00",
                "reviews": {
                    "0": [],
                    "1": []
                }
            },
            {
                "typeID": "0",
                "entries": [
                    "Standardnormalverteilung",
                    "$\\frac{1}{\\sqrt{2\\pi}}e^{-\\frac{x^2}{2}}$"
                ],
                "tags": [
                    "math"
                ],
                "creationDate": "2014-12-10T21:40:09+01:00",
                "reviews": {
                    "0": [],
                    "1": []
                }
            }
        ],
        "infoTypes": {
            "0": {
                "name": "Front and back",
                "entryNames": ["front", "back"],
                "templates": {
                    "0": {
                        "front": "{front}",
                        "back": "{back}",
                        "condition": ""
                    },
                    "1": {
                        "front": "{back}",
                        "back": "{front}",
                        "condition": "tag: reverse"
                    }
                }
            },
            "1": {
                "name": "Countries",
                "entryNames": ["Country", "Capital", "Language"],
                "templates": {
                    "0": {
                        "front": "Country: {Country}",
                        "back": "Capital: {Capital}",
                        "condition": ""
                    },
                    "1": {
                        "front": "Capital: {Capital}",
                        "back": "Country: {Country}",
                        "condition": ""
                    },
                    "2": {
                        "front": "Country: {Country}",
                        "back": "Language: {Language}",
                        "condition": ""
                    }
                }
            }
        },
        "reviewModes":{
            "0":{
                "name": "All",
                "condition": ""
            },
            "1":{
                "name": "Uni",
                "condition": "tag: math or tag: physik"
            }
        },
        "settings": {
            "lastInfoType": "Front and back",
            "timeIntervalChoices": {
                "Minutes": [
                    10,
                    30
                ],
                "Hours": [
                    1,
                    5,
                    10
                ],
                "Days": [
                    1,
                    2,
                    3,
                    4
                ],
                "Weeks": [1, 2],
                "Months": [],
                "Percent": [
                    0,
                    10,
                    20,
                    30
                ]
            },
            "reviewHistoryLength": 2
        },
        "meta": {
            "dataFormatVersion": "2014-12-17",
            "lastSaved": "never"
        }
    }
    ;