var init_data = {
        "infos": [
            {
                "typeID": "0",
                "fields": [
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
                "fields": [
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
                "fields": [
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
                "fieldNames": ["front", "back"],
                "views": {
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
                "fieldNames": ["Country", "Capital", "Language"],
                "views": {
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
        "settings": {
            "lastInfoType": "Front and back",
            "timeIntervalChoices": [
                [
                    10,
                    30
                ],
                [
                    1,
                    5,
                    10
                ],
                [
                    1,
                    2,
                    3,
                    4
                ],
                [1, 2],
                [],
                [
                    0,
                    10,
                    20,
                    30
                ]
            ]
        }
    }
    ;