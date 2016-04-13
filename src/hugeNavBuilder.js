/**
 * @class HugeNavBuilder
 * @description Helper Class.
 */
class HugeNavBuilder {

  static _getNavigationData(endpoint, handler) {
    var request = new XMLHttpRequest();

    //Handles onreadystatechange event
    request.onreadystatechange = () => {
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
  }

  static buildNavigation(endpoint, parent)  {
    // Get JSON data
    HugeNavBuilder._getNavigationData(endpoint, (data) => {
      //create custom element instance
      var navInstance = new hugeNav;
      // add data to element
      navInstance.properties = { items: data.items };
      // append element into parent
      parent.appendChild(navInstance);
    });
  }
}
