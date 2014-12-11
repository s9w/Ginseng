var init_data = {
      "infos": [
        {
          "type": "Front and back",
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
          "type": "Front and back",
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
        "type": "Front and back",
        "fields": [
          "Standardnormalverteilung",
          "$\\frac{1}{2\\pi}e^{-\\frac{x^2}{2}}$"
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
        "Front and back": {
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
        },
        "Countries": {
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
          [],
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