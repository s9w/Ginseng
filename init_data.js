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
                "reviews": [
                    [],
                    []
                ]
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
                "reviews": [
                    [],
                    []
                ]
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
                "reviews": [
                    [],
                    []
                ]
            }
        ],
        "infoTypes": {
            "0": {
                "name": "Front and back",
                "fieldNames": [
                    "front",
                    "back"
                ],
                "views": [
                    {
                        "front": "{front}",
                        "back": "{back}",
                        "condition": ""
                    },
                    {
                        "front": "{back}",
                        "back": "{front}",
                        "condition": "tag: reverse"
                    }
                ]
            }
            ,
            "1": {
                "name": "Countries",
                "fieldNames": [
                    "Country", "Capital", "Language"],
                "views": [
                    {
                        "front": "Country: {Country}",
                        "back": "Capital: {Capital}",
                        "condition": ""
                    },
                    {
                        "front": "Capital: {Capital}",
                        "back": "Country: {Country}",
                        "condition": ""
                    },
                    {
                        "front": "Country: {Country}",
                        "back": "Language: {Language}",
                        "condition": ""
                    }
                ]
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