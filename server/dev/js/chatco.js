(function() {
	"use strict";

	//=include ../../../bower_components/atomicjs/src/atomic.js
	//=include ../../../node_modules/socket.io/node_modules/socket.io-client/socket.io.js
	//=include ../../../node_modules/jquery/dist/jquery.js

	jQuery.noConflict();

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

	var socket = io();
	socket.emit('refresh', 'wtf');

	socket.on('poll', function(msg) {
		
	});
})();
