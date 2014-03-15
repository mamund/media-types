/* tasks uber example */

var fs = require('fs');
var http = require('http');
var querystring = require('querystring');

var g = {};
g.host = '0.0.0.0';
g.port = (process.env.PORT ? process.env.PORT : 8484);

/* internal test data */
g.list = [];
g.list[0] = {id:0,text:'this is some item'};
g.list[1] = {id:1,text:'this is another item'};
g.list[2] = {id:2,text:'this is one more item'};
g.list[3] = {id:3,text:'this is possibly an item'};

// main entry point
function handler(req, res) {

  var m = {};
  m.item = {};
  m.filter = '';
  
  // internal urls
  m.homeUrl = '/';
  m.listUrl = '/tasks/';
  m.scriptUrl = '/tasks.js';
  m.filterUrl = '/tasks/search';
  m.completeUrl = '/tasks/complete/';
  m.profileUrl = '/tasks-alps.xml';

  // media-type identifiers
  m.uberXml  = {'content-type':'application/xml'};
  m.textHtml = {'content-type':'text/html'};
  m.appJS = {'content-type':'application/javascript'};
  m.appXml = {'content-type':'application/xml'};

  // add support for CORS
  var headers = {
    'Content-Type' : 'application/xml',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods' : '*',
    'Access-Control-Allow-Headers' : '*'
  };

  // hypermedia controls
  m.errorMessage = '<uber version="1.0"><error><data id="status">{status}</data><data id="message">{msg}</data></error></uber>';
  m.addControl = '<data id="add" rel="add" name="links" url="/tasks/" action="append" model="text={text}" />';
  m.filterControl = '<data id="search" rel="search" name="links" url="/tasks/search" action="read" model="?text={text}" />';
  m.listControl = '<data id="list" rel="collection" name="links" url="/tasks/" action="read" />';
  m.completeControl = '<data rel="complete" url="/tasks/complete/" model="id={id}" action="append" />';
  m.itemControl = '<data id="task{id}" rel="item" name="tasks">{complete}<data name="text">{text}</data></data>'; 
  m.profileControl = '<data id="alps" rel="profile" url="/tasks-alps.xml" action="read" />';

  // add support for CORS
  var headers = {
    'Content-Type' : 'application/json',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods' : '*',
    'Access-Control-Allow-Headers' : '*'
  };

  main();

  /* process requests */
  function main() {
    var url;

    // check for a search query
    if(req.url.indexOf(m.filterUrl)!==-1) {
      url = m.filterUrl;
      m.filter = req.url.substring(m.filterUrl.length,255).replace('?text=','');
    }
    else {
      url = req.url;
    }

    // handle CORS OPTIONS call
    if(req.method==='OPTIONS') {
        var body = JSON.stringify(headers);
        showResponse(req, res, body, 200);
    }

    // process request
    switch(url) {
      case m.homeUrl:
        switch(req.method) {
          case 'GET':
            showHtml();
            break;
          default:
            showError(405, 'Method not allowed');
            break;
        }
        break;
      case m.scriptUrl:
        switch(req.method) {
          case 'GET':
            showScript();
            break;
          default:
            showError(405, 'Method not allowed');
            break;
        }
        break;
      case m.profileUrl:
        switch(req.method) {
          case 'GET':
            showProfile();
            break;
          default:
            showError(405, 'Method not allowed');
            break;
        }
        break;
      case m.listUrl:
        switch(req.method) {
          case 'GET':
            sendList();
            break;
          case 'POST':
            addToList();
            break;
          default:
            showError(405, 'Method not allowed');
            break;
        }
        break;
      case m.filterUrl:
        switch(req.method) {
          case 'GET':
            searchList();
            break;
          default:
            showError(405, 'Method not allowed');
            break;
        }
        break;
      case m.completeUrl:
        switch(req.method) {
          case 'POST':
            completeItem();
            break;
          default:
            showError(405, 'Method not allowed');
            break;
        }
        break;
      default:
        showError(404, 'Page not found');
        break;
    }
  }

  /* 
    show list of items

    /tasks/
 
  */
  function sendList() {
    var msg, i, x;

    msg = makeUber(g.list,false);
    res.writeHead(200, 'OK', m.uberXml);
    res.end(msg);
  }

  /* 
     search the list

     /tasks/search?text={text} 

  */
  function searchList() {
    var coll, i, x, msg;

    coll = [];
    for(i=0,x=g.list.length;i<x;i++) {
      if(g.list[i].text.indexOf(m.filter)!==-1) {
        coll.push(g.list[i]);
      }
    }

    msg = makeUber(coll,true);
    res.writeHead(200, 'OK', m.uberXml);
    res.end(msg);
  }

  /* 
     add item to list

     /tasks/
     text={text} 

  */
  function addToList() {
    var body = '';

    req.on('data', function(chunk) {
      body += chunk.toString();
    });

    req.on('end', function() {
      m.item = querystring.parse(body);
      sendAdd();
    });
  }
  function sendAdd() {
    var item;

    item = {};
    item.id = g.list.length;
    item.text = m.item.text;
    g.list.push(item);

    res.writeHead(204, "No content");
    res.end();
  }

  /* 
     complete single item

     /tasks/complete/
     id={id} 

  */
  function completeItem() {
    var body = '';

    req.on('data', function(chunk) {
      body += chunk.toString();
    });

    req.on('end', function() {
      m.item = querystring.parse(body);
      sendComplete();
    });
  }
  function sendComplete() {
    var tlist, i, x;

    //build new list
    tlist = [];
    for(i=0,x=g.list.length;i<x;i++) {
      if(g.list[i].id!=m.item.id) {
        tlist.push(g.list[i]);
      }
    }
    g.list = tlist.slice(0);

    res.writeHead(204, "No content");
    res.end();
  }

  /* generate uber representation */
  function makeUber(list, showControls) {
    var i, x, msg;

    msg  = '<uber version="1.0">';
    msg += '<data id="links">';
    msg += m.profileControl
    if(list.length>0 || showControls===true) {
      msg += m.listControl;
      msg += m.filterControl;
    }
    msg += m.addControl;
    msg += '</data>';

    msg += '<data id="tasks">';
    for(i=0,x=list.length;i<x;i++) {
      msg += m.itemControl.replace("{complete}",m.completeControl).replace(/{id}/gi,list[i].id).replace(/{text}/gi,list[i].text);
    }
    msg += '</data>';
    msg += '</uber>';

    return msg;
  }
  
  /* show html page */
  function showHtml() {
    fs.readFile('index.html', 'ascii', sendHtml);
  }
  function sendHtml(err, data) {
    if (err) {
      showError(500, err.message);
    }
    else {
      res.writeHead(200, "OK",m.textHtml);
      res.end(data);
    }
  }

  /* show script file */
  function showScript() {
    fs.readFile('tasks.js', 'ascii', sendScript);
  }
  function sendScript(err, data) {
    if (err) {
      showError(500, err.message);
    }
    else {
      res.writeHead(200, "OK",m.appJS);
      res.end(data);
    }
  }

  /* show profile document */
  function showProfile() {
    fs.readFile('tasks-alps.xml', 'ascii', sendProfile);
  }
  function sendProfile(err, data) {
    if (err) {
      showError(500, err.message);
    }
    else {
      res.writeHead(200, "OK",m.appXml);
      res.end(data);
    }
  }

  /* show error page */
  function showError(status, msg) {
    res.writeHead(status, msg, m.uberXml);
    res.end(m.errorMessage.replace('{status}', status).replace('{msg}', msg));
  }
}

// return response to caller
function showResponse(req, res, body, code) {
    res.writeHead(code,headers);
    res.end(body);
}

// listen for requests
http.createServer(handler).listen(g.port, g.host);

// ***** END OF FILE *****

