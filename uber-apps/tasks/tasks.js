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
    var elm, li, i, x, coll;

    // fill in the list
    elm = document.getElementById('data');
    if(elm) {
      elm.innerHTML = '';
      for(i=0,x=g.msg.collection.length;i<x;i++) {
        li = document.createElement('li');
        li.appendChild(document.createTextNode(g.msg.collection[i].text));

        // see if we have an affordance here
        try {
          if(g.msg.collection[i].link.rel==='complete') {
            if(g.msg.collection[i].link.data) {
              li.setAttribute('data', g.msg.collection[i].link.data[0].name);
              li.setAttribute('dvalue', g.msg.collection[i].id);
            }
            li.id = g.msg.collection[i].link.rel;
            li.setAttribute('href', g.msg.collection[i].link.href);
            li.setAttribute('method', g.msg.collection[i].link.method);
            li.onclick = clickButton;
          }
        }
        catch (ex) {}
        elm.appendChild(li);
      }
    }
    showControls();
  }

  // handle possible hypermedia controls
  function showControls() {
    var elm, inp, i, x;

    // find and render controls
    elm = document.getElementById('actions');
    if(elm) {
      elm.innerHTML = '';
      for(i=0,x=g.msg.links.length;i<x;i++) {
        inp = document.createElement('input');
        inp.type = "button";
        inp.className = "button";
        inp.id = g.msg.links[i].rel;
        inp.setAttribute('method',g.msg.links[i].method);
        inp.setAttribute('href',g.msg.links[i].href);
        inp.value = g.msg.links[i].rel;
        inp.onclick = clickButton;
        
        // check for args
        if(g.msg.links[i].data) {
          inp.setAttribute('data',g.msg.links[i].data[0].name);
        }
        elm.appendChild(inp);
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
            g.msg = JSON.parse(ajax.responseXml);
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
