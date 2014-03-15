/* client side library for tasks */

window.onload = function() {
  var pg;
  pg = thisPage();
  pg.init();
};

var thisPage = function() {

  var g = {};
  g.msg = {};
  g.listUrl = '/tasks/';

  // prime the system
  function init() {
    makeRequest(g.listUrl,'list');
  }

  /* parse the response */
  function showResponse() {
    var elm, li, i, x, coll, item, data, task;

    // fill in the list
    elm = document.getElementById('data');
    if(elm) {
      elm.innerHTML = '';

      coll = g.msg.getElementsByTagName('data');
      for(i=0,x=coll.length;i<x;i++) {
        if(coll[i].getAttribute("name")==="tasks") {
          li = document.createElement('li');
          task = document.createElement('span');
          task.className = 'task';

          var item = coll[i].children;
          for(j=0,y=item.length;j<y;j++) {
            // handle transition elements
            if(item[j].getAttribute("url")!==null) {
              data = document.createElement('a');
              data.href = item[j].getAttribute('url');
              data.rel = item[j].getAttribute('rel');
              data.title = item[j].getAttribute('rel');
              if(item[j].getAttribute('model')!==null) {
                data.setAttribute('model',item[j].getAttribute('model'));
              }              
              else {
                data.setAttribute('model','');
              }
              data.setAttribute('action',item[j].getAttribute('action'));
              data.innerHTML = 'X';
            }
            else {
              // handle data elements
              data = document.createElement('span');
              data.className='item';
              data.innerHTML = item[j].childNodes[0].nodeValue;
            }
            task.appendChild(data);
          }                               
          li.appendChild(task);
          elm.appendChild(li);
        }
      }
    }
    showControls();
  }

  // handle possible hypermedia controls
  function showControls() {
    var elm, inp, i, x, coll;

    // find and render controls
    elm = document.getElementById('actions');
    if(elm) {
      elm.innerHTML = '';
      coll = g.msg.getElementsByTagName("data");

      for(i=0,x=coll.length;i<x;i++) {
        if(coll[i].getAttribute('name')==="links") {
          inp = document.createElement('input');
          inp.type = "button";
          inp.className = "button";
          inp.id = coll[i].getAttribute('id');
          
          inp.setAttribute('action',coll[i].getAttribute('action'));
          inp.setAttribute('href',coll[i].getAttribute('url'));
          inp.setAttribute('model',coll[i].getAttribute('model'));
          inp.value = coll[i].getAttribute('rel');
          inp.onclick = clickButton;
          
          elm.appendChild(inp);
        }
      }
    }
  }
  function clickButton() {
    var elm, inp, data;
    elm = this;
  
    if(elm.getAttribute('data')) {
      if(elm.getAttribute('dvalue')) {
        inp = elm.getAttribute('dvalue');
      }
      else {
        inp = prompt('Enter '+elm.getAttribute('data')+':');
      }
      if(inp) {
        data = elm.getAttribute('data')+'='+encodeURIComponent(inp);
        if(elm.getAttribute('method')==='get') {
          makeRequest(elm.getAttribute('href')+'?'+data, elm.id);        
        }
        else {
          makeRequest(elm.getAttribute('href'), elm.id, data)
        }    
      }
    }
    else {
      makeRequest(elm.getAttribute('href'), elm.id);        
    }
  }

  // handle network request/response
  function makeRequest(href, context, body) {
    var ajax;

    ajax=new XMLHttpRequest();
    if(ajax) {

      ajax.onreadystatechange = function(){processResponse(ajax, context);};

      if(body) {
        ajax.open('post',href,true);
        ajax.send(body);
      }
      else {
        ajax.open('get',href,true);
        ajax.send(null);
      }
    }
  }
  function processResponse(ajax, context) {

    if(ajax.readyState==4 || ajax.readyState==='complete') {
      if(ajax.status===200 || ajax.status===204) {
        switch(context) {
          case 'list':
          case 'search':
            g.msg = ajax.responseXML.documentElement;
            showResponse();
            break;
          case 'add':
          case 'complete':
            makeRequest(g.listUrl, 'list');
            break;
          default:
            alert('unknown context:'+context);
            break;
        }
      }
      else {
        alert('*** ERROR: '+ajax.status+'\n'+ajax.statusText);
      }
    }
  }

  var that = {};
  that.init = init;
  return that;
};
