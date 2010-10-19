/*
// +----------------------------------------------------------------------+
// | Orginial Code Care Of:                                               |
// +----------------------------------------------------------------------+
// | Copyright (c) 2004 Bitflux GmbH                                      |
// +----------------------------------------------------------------------+
// | Licensed under the Apache License, Version 2.0 (the "License");      |
// | you may not use this file except in compliance with the License.     |
// | You may obtain a copy of the License at                              |
// | http://www.apache.org/licenses/LICENSE-2.0                           |
// | Unless required by applicable law or agreed to in writing, software  |
// | distributed under the License is distributed on an "AS IS" BASIS,    |
// | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or      |
// | implied. See the License for the specific language governing         |
// | permissions and limitations under the License.                       |
// +----------------------------------------------------------------------+
// | Author: Bitflux GmbH <devel@bitflux.ch>                              |
// |         http://blog.bitflux.ch/p1735.html                            |
// +----------------------------------------------------------------------+
//
// +----------------------------------------------------------------------+
// | Heavily Modified by Jeff Minard (07/09/04)                           |
// | Slightly Modified by Michael D. Adams (06/14/05)                     |
// +----------------------------------------------------------------------+
// | Same stuff as above, yo!                                             |
// +----------------------------------------------------------------------+
// | Author: Jeff Minard <jeff-js@creatimation.net>                       |
// |         http://www.creatimation.net                                  |
// | Author: Michael D. Adams                                             |
// |         http://blogwaffe.com/                                        |
// +----------------------------------------------------------------------+
*/

var liveReq = false;
var t = null;
var liveReqLast = "";
var liveReqLastAuthor = "";
var liveReqLastURL = "";
var isIE = false;

var inputElement;
var outputElement;
var doitElement;
var authorElement;
var urlElement;

// on !IE we only have to initialize it once
if (window.XMLHttpRequest) {
	liveReq = new XMLHttpRequest();
}

function liveReqInit() {
	
	inputElement  = document.getElementById(inputId);
	outputElement = document.getElementById(outputId);
	doitElement   = document.getElementById(doitId);
	authorElement = document.getElementById(authorId);
	urlElement    = document.getElementById(urlId);
	
	if( inputElement == null || outputElement == null || doitElement == null ) 
		return;
	
	if (navigator.userAgent.indexOf("Safari") > 0 || navigator.product == "Gecko") {
		doitElement.addEventListener("click",liveReqStart,false);
	} else {
		doitElement.attachEvent('onclick',liveReqStart);
		isIE = true;
	}

	
	if(emptyString == '') {
		// set the result field to hidden, or to default string
		outputElement.style.display = "none";
	} else {
		outputElement.innerHTML = emptyString;
	}
}

addLoadEvent(liveReqInit);

function liveReqStart() {
	if (t) {
		window.clearTimeout(t);
	}
	t = window.setTimeout("liveReqDoReq()",400);
}

function liveReqDoReq() {
	var req = '';
	var proceed = false;

	if (authorElement) {
		if ( (liveReqLast != inputElement.value || liveReqLastAuthor != authorElement.value || liveReqLastURL != urlElement.value) && inputElement.value != "") {
			proceed = true;
			outputElement.innerHTML = 'Loading.';
		}
	} else {
		if (liveReqLast != inputElement.value && inputElement.value != "") {
			proceed = true;
			outputElement.innerHTML = 'Loading.';
		}
	}

	if ( proceed == true) {
		if (liveReq && liveReq.readyState < 4) {
			liveReq.abort();
		}
		if (window.XMLHttpRequest) {
		// branch for IE/Windows ActiveX version
		} else if (window.ActiveXObject) {
			liveReq = new ActiveXObject("Microsoft.XMLHTTP");
		}

		liveReq.onreadystatechange = liveReqProcessReqChange;

	
		if(authorElement) {
			req = "&author=" + encodeURIComponent(authorElement.value) + "&url=" + encodeURIComponent(urlElement.value);
			liveReqLastAuthor = authorElement.value;
			liveReqLastURL = urlElement.value;
		}
		liveReq.open("POST", processURI);
		liveReqLast = inputElement.value;
		liveReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
		liveReq.send("text=" + encodeURIComponent(inputElement.value) + req);
	} else if(inputElement.value == "") {
		if(emptyString == '') {
			outputElement.innerHTML = '';
			outputElement.style.display = "none";
		} else {
			outputElement.innerHTML = emptyString;
		}
	}
}

function liveReqProcessReqChange() {
	if (liveReq.readyState == 4) {
    // alert(liveReq.responseText);
		outputElement.innerHTML = liveReq.responseText;
		if(emptyString == '') {
			outputElement.style.display = "block";
		}
	} else {
		outputElement.innerHTML += '.';
	}
}

//Care Of (Thnx Dude!): Simon Willison http://simon.incutio.com/archive/2004/05/26/addLoadEvent
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      oldonload();
      func();
    }
  }
}
