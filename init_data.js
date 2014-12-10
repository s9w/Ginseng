var init_data = {
      "infos": [
        {
          "type": "Front and back",
          "fields": [
            "heresy",
            "die Ketzerei"
          ],
          "tags": [
            "en"
          ],
          "creationDate": "2014-12-07T14:40:09+01:00",
          "reviews": [
            [
              {
                "reviewTime": "2014-12-08T10:46:39+01:00",
                "dueTime": "2014-12-08T14:46:39+01:00"
              },
              {
                "reviewTime": "2014-12-09T16:52:10+01:00",
                "dueTime": "2014-12-09T17:02:10+01:00"
              },
              {
                "reviewTime": "2014-12-09T17:46:11+01:00",
                "dueTime": "2014-12-09T18:56:10+01:00"
              },
              {
                "reviewTime": "2014-12-09T22:33:15+01:00",
                "dueTime": "2014-12-09T22:43:15+01:00"
              }
            ],
            []
          ]
        },
        {
          "type": "Front and back",
          "fields": [
            "to concur",
            "zustimmen"
          ],
          "tags": [
            "en"
          ],
          "creationDate": "2014-12-07T16:08:54+01:00",
          "reviews": [
            [
              {
                "reviewTime": "2014-12-09T17:46:45+01:00",
                "dueTime": "2014-12-09T18:46:45+01:00"
              },
              {
                "reviewTime": "2014-12-09T22:33:37+01:00",
                "dueTime": "2014-12-09T22:43:37+01:00"
              }
            ],
            []
          ]
        },
        {
          "type": "Front and back",
          "fields": [
            "makeshift",
            "die Notlösung"
          ],
          "tags": [
            "en"
          ],
          "creationDate": "2014-12-07T17:09:09+01:00",
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
              "back": "**{back}**",
              "condition": ""
            },
            {
              "front": "{back}",
              "back": "{front} **bold**",
              "condition": "tag: reverse"
            }
          ]
        }
      },
      "settings": {
        "lastInfoType": "Front and back",
        "timeIntervalChoices": [[10, 30], [1, 5, 10], [1, 2, 3], [1, 2], [0, 15, 30]]
      }
    }
    ;