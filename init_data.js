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
            [],
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
        "Front and back":{
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
              "front": "Und andersrum. Hier ist back: {back}",
              "back": "Hier ist front: {front}. Und hier noch **bold** uuh\nund nächste zeile",
              "condition": "tag: reverse"
            }
          ]
        }
      },
      "settings": {
        "lastInfoType": "Front and back"
      }
    }
    ;