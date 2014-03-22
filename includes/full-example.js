{ 
  "uber" :
  {
    "version" : "1.0",
    "data" :
    [
      {"rel" : ["self"], "url" : "http://example.org/"},
      {"rel" : ["profile"], "url" : "http://example.org/profiles/people-and-places"},
      {
        "id" : "people", 
        "rel" : ["collection","http://example.org/rels/people"], 
        "url" : "http://example.org/people/",
        "data" : 
        [
          {
            "name" : "create", 
            "rel" : ["http://example.org/rels/create"], 
            "url" : "http://example.org/people/",
            "model" : "g={givenName}&f={familyName}&e={email}",
            "action" : "append"
          },
          {
            "name" : "search",
            "rel" : ["search","collection"],
            "url" : "http://example.org/people/search",
            "model" : "?g={givenName}&f={familyName}&e={email}"
          },
          {
            "name" : "person",
            "rel" : ["item","http://example.org/rels/person"],
            "url" : "http://example.org/people/1",
            "data" :
            [
              {"name" : "givenName", "value" : "Mike"},
              {"name" : "familyName", "value" : "Amundsen"},
              {"name" : "email", "value" : "mike@example.org"},
              {"name" : "avatarUrl", "transclude" : "true", 
                  "url" : "http://example.org/avatars/1", 
                  "value" : "User Photo",
                  "accepting" : ["image/*"]
              }
            ]
          },
          {
            "name" : "person",
            "rel" : ["item","http://example.org/rels/person"],
            "url" : "http://example.org/people/2",
            "data" :
            [
              {"name" : "givenName", "value" : "Mildred"},
              {"name" : "familyName", "value" : "Amundsen"},
              {"name" : "email", "value" : "mildred@example.org"},
              {"name" : "avatarUrl", "transclude" : "true", 
                  "url" : "http://example.org/avatars/2", 
                  "value" : "User Photo",
                  "accepting" : ["image/*"]
              }
            ]
          }
        ]
      },
      
      {
        "id" : "places", 
        "rel" : ["collection","http://example.org/rels/places"], 
        "url" : "http://example.org/places/",
        "data" :
        [
          {
            "name" : "search",
            "rel" : ["search","collection"],
            "url" : "http://example.org/places/search",
            "model" : "?r={addressRegion}&l={addressLocality}&p={postalCode}"
          },
          {
            "name" : "place",
            "rel" : ["item","http://example.org/rels/place"],
            "url" : "http://example.org/places/a",
            "data" : 
            [
              {
                "name" : "name", 
                "value" : "Home"
              },
              {
                "name" : "address",
                "data" :
                [
                  {"name" : "streetAddress", "value" : "123 Main Street"},
                  {"name" : "addressLocalitly", "value" : "Byteville"},
                  {"name" : "addressRegion", "value" : "MD"},
                  {"name" : "postalCode", "value" : "12345"}
                ]
              }
            ]
          },
          {
            "name" : "place",
            "rel" : ["item","http://example.org/rels/place"],
            "url" : "http://example.org/places/b",
            "data" : 
            [
              {
                "name" : "name", 
                "value" : "Work"
              },
              {
                "name" : "address",
                "data" : 
                [
                  {"name" : "streetAddress", "value" : "1456 Grand Ave."},
                  {"name" : "addressLocalitly", "value" : "Byteville"},
                  {"name" : "addressRegion", "value" : "MD"},
                  {"name" : "postalCode", "value" : "12345"}
                ]
              }
            ]
          }
        ]
      }
    ]    
  }
}

