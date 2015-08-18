/**
 * Gets the request URL as string.  Returns the responseText of the response (String).
 */
function ajaxRequest(callback, url, container) {
  //showWaitIndicator();
  var req;
  try {								//Firefox, Opera 8.0+, Safari
    req = new XMLHttpRequest();
  } catch(e) {						//IE
    try {
      req = new ActiveXObject('Msxml2.XMLHTTP');
    } catch(e) {
      try {
        req = new ActiveXObject('Microsoft.XMLHTTP');
      } catch(e) {					//something went wrong
        alert('Your browser does not support AJAX!');
        return false;
      }
    }
  }
  req.onreadystatechange = function() {
	if(req.readyState == 4) {
	  //hideWaitIndicator();
	  if(req.status == 200 || req.status == 0) callback.apply(callback, [req, container]);
	  else alert('There was a problem with your AJAX request...\n' + req.statusText);
	}
  };
  req.open('GET', url, true);
  req.send(null);
}
/**
 * Loads the requested urls and puts them into the given containers.
 *
 * Usage 1:  loadURLIntoContainer('/common/action.html','div');
 * Usage 2:  loadURLIntoContainer(['/common/action1.html','/common/action2.html'] ,['div1','div2']);
 */
function loadURLIntoContainer(urls, containers) {
  function cb(req, container) {
    //alert('cb():\n\n' + req.responseText);
    var bodyStartRegExp = new RegExp('<body','i');
    var text = req.responseText;
    var start = text.search(bodyStartRegExp);
    if(start != -1) {
      text = text.substr(start);
      var bodyEndRegExp = new RegExp('</body>','i');
      var end = text.search(bodyEndRegExp);
      text = text.substr(0, end);
    }

    var newEl = document.getElementById(container);
    newEl.innerHTML = text;
    //alert('newEl.outerHTML:\n\n' + newEl.outerHTML);
  }  //eof: cb()

  if(urls.constructor != Array) {
    urls = [urls];
	containers = [containers];
  }
  for(var i=0; i<urls.length; i++) {
    try {
	  if(!document.getElementById(containers[i])) {
        var newEl = document.createElement('DIV');
        newEl.id = containers[i];
      }
      ajaxRequest(cb, urls[i], containers[i]);
    } catch(e) {
	  alert('An exception occurred while loading page <' + urls[i] + '> ' +
		    'into container <' + containers[i] + '>...\n' + e.message);
	}
  }
}
/**
 * Get elements by class name.
 */
function getElementsByClassName(oElm, strTagName, strClassName) {
  var arrElements = (strTagName == "*" && oElm.all)? oElm.all : oElm.getElementsByTagName(strTagName);
  var arrReturnElements = new Array();
  var minusSign = new RegExp('-','g');
  strClassName = strClassName.replace(minusSign, "\\-");
  var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");
  var oElement;
  for(var i=0; i<arrElements.length; i++) {
	oElement = arrElements[i];      
	if(oRegExp.test(oElement.className)) arrReturnElements.push(oElement);
  }
  return arrReturnElements;
}
/**
 * Opens the photo set indicated.
 */
function openPhotoSet(file, newActiveSet) {
  var oldActiveSet = getElementsByClassName(document.getElementById('photoAlbum'), 'div', 'photoSetActive')[0];
  oldActiveSet.className = 'photoSet';
  newActiveSet.className = 'photoSetActive';
  loadURLIntoContainer('photos/'+file, 'photoContent');
}
/**
 * Opens the music file indicated.
 */
function openPlayer(file, width, height) {
  try {
    player.close()
  } catch(e) {};
  player = window.open('music/'+file,'pl','width='+width+',height='+height+',top=200,left=300,scrollbars=0,resizable=0');
}
/**
 * Loads Google Map (GMaps).
 *
 * This function loads Google Maps with an infoWindow pointing
 * to my current address.  The method is used by contact.html.
 * 
 * http://stiern.com/tutorials/adding-custom-google-maps-to-your-website/
 */
function loadMap() {
  var latlng = new google.maps.LatLng(40.7601485,-73.9692758);
  var settings = {
	zoom: 13,
	center: latlng,
	mapTypeControl: true,
	mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
	navigationControl: true,
	navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
	mapTypeId: google.maps.MapTypeId.ROADMAP};
  var map = new google.maps.Map(document.getElementById("map"), settings);

  var companyInfoWindow = new google.maps.InfoWindow({
	content: '<h1 style="margin:0">Bloomberg LP</h1>'+
			 '<p>Bloomberg LP is where I currently earn my dinero.  Our headquarters is a fully transparent glass building with excellent City views.  We have fully stacked free kitchen pantries in the building, something the Company is now famous for.</p>'
  });
  var companyPos = new google.maps.LatLng(40.7620373,-73.9683135);
  var companyMarker = new google.maps.Marker({
      position: companyPos,
      map: map,
      title: "Bloomberg"
  });

  var homeInfoWindow = new google.maps.InfoWindow({
	content: '<h1 style="margin:0">Home sweet home!</h1>'+
			 '<p>I live just around the corner of the United Nations in Turtle Bay.  Turtle Bay is one of the best areas in Midtown with tons of bars, restaurants and young working professionals.  It is also one of the safest neighborhoods in Manhattan, due to its proximity to the UN.</p>'
  });
  var homePos = new google.maps.LatLng(40.7515767,-73.9703921);
  var homeMarker = new google.maps.Marker({
      position: homePos,
      map: map,
      title: "Home"
  });

  google.maps.event.addListener(companyMarker, 'click', function() {
	companyInfoWindow.open(map, companyMarker);
  });
  google.maps.event.addListener(homeMarker, 'click', function() {
	homeInfoWindow.open(map, homeMarker);
  });
}
/**
 * Check and show the feedback alert to the user, after feedback has been sent.
 */
function checkFeedback() {
  var str = eval("'" + window.location + "'");
  if(str.indexOf('f=119') > -1) {
    alert('Done!\n\nYour feedback has been successfully emailed.');
  }
}
/**
 * Disable right click on entire site.
 */
document.oncontextmenu = function(e) {return false;};