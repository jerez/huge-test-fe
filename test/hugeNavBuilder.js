import { hugeNav } from './hugeNavElement';

var hugeNavBuilder = (function () {

  var _getNavigationData = function (endpoint, handler) {
    var request = new XMLHttpRequest();

    //Handles onreadystatechange event
    request.onreadystatechange = function() {
      if ( request.readyState === 4 ) {
        switch (request.status) {

          // Success handler
          case 200:
            var data = JSON.parse(request.responseText);
            if(handler) handler(data);
            break;

          // Error handler
          case 404:
          case 500:
          default:
            console.error(`${request.status } :: ${request.responseText}`);
            break;
        }

      }
    }
    // Make the request
    request.open('GET', endpoint);
    request.send();
  };

  var buildNavigation = function (endpoint, parent) {
    _getNavigationData(endpoint, function(data){
      var navInstance = new hugeNav;
      navInstance.properties = { items: data.items };
      parent.appendChild(navInstance);
    });
  }

  return {
    buildNavigation: buildNavigation,
  };

})();
