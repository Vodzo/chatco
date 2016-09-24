(function () {

  'use strict';

  var exports = {};

  var options = {
    contentType : 'application/x-www-form-urlencoded'
  };

  var parse = function (req) {
    var result;
    try {
      result = JSON.parse(req.responseText);
    } catch (e) {
      result = req.responseText;
    }
    return [result, req];
  };

  var xhr = function (httpMethod, url, data, contentType) {
    var contentTypeHeader = contentType || options.contentType;
    var methods = {
      success: function () {},
      error: function () {}
    };
    var XHR = window.XMLHttpRequest || ActiveXObject;
    var request = new XHR('MSXML2.XMLHTTP.3.0');
    request.open(httpMethod, url, true);
    request.setRequestHeader('Content-Type', contentTypeHeader);
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status >= 200 && request.status < 300) {
          methods.success.apply(methods, parse(request));
        } else {
          methods.error.apply(methods, parse(request));
        }
      }
    };
    request.send(data);
    var callbacks = {
      success: function (callback) {
        methods.success = callback;
        return callbacks;
      },
      error: function (callback) {
        methods.error = callback;
        return callbacks;
      }
    };

    return callbacks;
  };

  exports['get'] = function (src) {
    return xhr('GET', src);
  };

  exports['put'] = function (url, data, contentType) {
    return xhr('PUT', url, data, contentType);
  };

  exports['post'] = function (url, data, contentType) {
    return xhr('POST', url, data, contentType);
  };

  exports['delete'] = function (url) {
    return xhr('DELETE', url);
  };

  exports['setContentType'] = function (contentType) {
    options.contentType = contentType;
  };

  // check for AMD/Module support, otherwise define Bullet as a global variable.
  if (typeof define !== 'undefined' && define.amd)
  {
    // AMD. Register as an anonymous module.
    define (function()
    {
      return exports;
    });

  }
  else if (typeof module !== 'undefined' && module.exports)
  {
    module.exports = exports;
  }
  else
  {
    window.atomic = exports;
  }

})();

(function() {
	"use strict";

	var scr = document.getElementById('chatco-script');
	var options = {
		header : scr.getAttribute('data-header') ? scr.getAttribute('data-header') : 'Chatco chat'
	};

	var html = '<div class="chatco"><div class="header">' + options.header + '</div><div class="message-box"><div class="message">bla bla</div><div class="message">bla bla</div><div class="input"><form id="chatco-form" method="post" action="/message"><input type="text" value="" name="message" class="message-input" placeholder="Upiši poruku" /></form></div></div></div>';
	var body = document.getElementsByTagName("body")[0];
	var el =  document.createElement("div")
	el.id="chatco";
	el.innerHTML = html;

	body.appendChild(el);

	function addListener(elem, type, fn) {
	    if (elem.addEventListener) {
	        elem.addEventListener(type, fn, false);

	    } else if (elem.attachEvent) {
	        elem.attachEvent("on" + type, function() {
				return fn.call(elem, window.event);
			});
	    } else {
	        elem["on" + type] = fn;
	    }
	}

	function serialize(form){if(!form||form.nodeName!=="FORM"){return }var i,j,q=[];for(i=form.elements.length-1;i>=0;i=i-1){if(form.elements[i].name===""){continue}switch(form.elements[i].nodeName){case"INPUT":switch(form.elements[i].type){case"text":case"hidden":case"password":case"button":case"reset":case"submit":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;case"checkbox":case"radio":if(form.elements[i].checked){q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value))}break;case"file":break}break;case"TEXTAREA":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;case"SELECT":switch(form.elements[i].type){case"select-one":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;case"select-multiple":for(j=form.elements[i].options.length-1;j>=0;j=j-1){if(form.elements[i].options[j].selected){q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].options[j].value))}}break}break;case"BUTTON":switch(form.elements[i].type){case"reset":case"submit":case"button":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break}break}}return q.join("&")};

	var form = document.getElementById('chatco-form');
	form.onsubmit = function() {
		var form_data = serialize(form);
		atomic.post('/message', [form_data])
		.success(function (data, xhr) {

		})
		.error(function (data, xhr) {

		});
		console.log(form_data);
		return false;
	};
})();