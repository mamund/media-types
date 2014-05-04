{
  "uber" : 
  {
    "version" : "1.0", 
    "data" :
    [
      { 
        "rel" : ["self"], 
        "url" : "http://example.org/"
      },
      {
        "name" : "list", 
        "rel" : ["collection"], 
        "url" : "http://example.org/list/"
      },
      {
        "name" : "search", 
        "rel" : ["search","collection"],
        "url" : "http://example.org/search",
        "model" : "{?title}"
      },
      {
        "name" : "todo",
        "rel" : ["item","http://example.org/rels/todo"],
        "url" : "http://example.org/list/1",
        "data" : 
        [
          {"name" : "title", "value" : "Clean house"},
          {"name" : "dueDate", "value" : "2014-05-01"}
        ]
      },
      {
        "name" : "todo",
        "rel" : ["item","http://example.org/rels/todo"],
        "url" : "http://example.org/list/2",
        "data" : 
        [
          {"name" : "title", "value" : "Paint the fence"},
          {"name" : "dueDate", "value" : "2014-06-01"}
        ]
      }
    ]    
  }
}
