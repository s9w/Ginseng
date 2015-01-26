var init_data =
    {
        "infos": [
            {
                "typeID": "1",
                "entries": [
                    "France",
                    "Paris",
                    "French"
                ],
                "reviews": {
                    "0": [],
                    "1": [],
                    "2": []
                },
                "tags": [],
                "creationDate": "2015-01-13T12:30:50+01:00"
            },
            {
                "typeID": "0",
                "entries": [
                    "Hamilton's equations",
                    "- $\\dot{\\vec p} = -\\frac{\\partial H}{\\partial \\vec q}$\n- $\\dot{\\vec q} = \\frac{\\partial H}{\\partial \\vec p}$"
                ],
                "reviews": {
                    "0": [
                        {
                            "reviewTime": "2015-01-11T20:03:56+01:00",
                            "dueTime": "2015-01-11T22:03:56+01:00"
                        }
                    ],
                    "1": []
                },
                "tags": [
                    "physics"
                ],
                "creationDate": "2015-01-11T16:04:23+01:00"
            },
            {
                "typeID": "0",
                "entries": [
                    "la chica",
                    "girl"
                ],
                "reviews": {
                    "0": [],
                    "1": []
                },
                "tags": [
                    "spanish"
                ],
                "creationDate": "2015-01-11T15:58:42+01:00"
            },
            {
                "typeID": "0",
                "entries": [
                    "la manzana",
                    "apple"
                ],
                "reviews": {
                    "0": [],
                    "1": []
                },
                "tags": [
                    "reverse",
                    "spanish"
                ],
                "creationDate": "2015-01-11T15:59:16+01:00"
            },
            {
                "typeID": "0",
                "entries": [
                    "liberté",
                    "freedom"
                ],
                "reviews": {
                    "0": [],
                    "1": []
                },
                "tags": [
                    "french"
                ],
                "creationDate": "2015-01-11T16:00:39+01:00"
            },
            {
                "typeID": "0",
                "entries": [
                    "Pythagorean theorem",
                    "$a^2 + b^2 = x^2$\n![Animation](http://i.imgur.com/b4gZm.gif)"
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
                "name": "Example type",
                "entryNames": [
                    "front",
                    "back"
                ],
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
                "entryNames": [
                    "Country",
                    "Capital",
                    "Language"
                ],
                "templates": {
                    "0": {
                        "front": "What's the capital of {Country}?",
                        "back": "{Capital}",
                        "condition": ""
                    },
                    "1": {
                        "front": "{Capital} is the capital of...?",
                        "back": "{Country}",
                        "condition": ""
                    },
                    "2": {
                        "front": "What language is spoken in {Country}?",
                        "back": "{Language}",
                        "condition": ""
                    }
                }
            }
        },
        "reviewProfiles": {
            "0": {
                "name": "All",
                "condition": "",
                "dueThreshold": 1
            },
            "1": {
                "name": "Languages",
                "condition": "tag: spanish || tag: french",
                "dueThreshold": "1.0"
            },
            "2": {
                "name": "Math + Physics",
                "condition": "tag: math || tag: physics",
                "urgencyThreshold": 1,
                "dueThreshold": "1.0"
            },
            "3": {
                "name": "Countries",
                "condition": "type: \"Countries\"",
                "dueThreshold": 1
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
                "Weeks": [
                    1,
                    2
                ],
                "Months": [],
                "Percent": [
                    0,
                    10,
                    20,
                    30
                ]
            },
            "reviewHistoryLength": 2,
            "useCompression": false,
            "useGuess": true,
            "rememberModType": false
        },
        "meta": {
            "lastSaved": "2015-01-13T12:35:20+01:00"
        }
    }
    ;