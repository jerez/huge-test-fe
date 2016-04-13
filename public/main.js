'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class HugeNavBuilder
 * @description Helper Class.
 */

var HugeNavBuilder = function () {
  function HugeNavBuilder() {
    _classCallCheck(this, HugeNavBuilder);
  }

  _createClass(HugeNavBuilder, null, [{
    key: '_getNavigationData',
    value: function _getNavigationData(endpoint, handler) {
      var request = new XMLHttpRequest();

      //Handles onreadystatechange event
      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          switch (request.status) {

            // Success handler
            case 200:
              var data = JSON.parse(request.responseText);
              if (handler) handler(data);
              break;

            // Error handler
            case 404:
            case 500:
            default:
              console.error(request.status + ' :: ' + request.responseText);
              break;
          }
        }
      };
      // Make the request
      request.open('GET', endpoint);
      request.send();
    }
  }, {
    key: 'buildNavigation',
    value: function buildNavigation(endpoint, parent) {
      // Get JSON data
      HugeNavBuilder._getNavigationData(endpoint, function (data) {
        //create custom element instance
        var navInstance = new hugeNav();
        // add data to element
        navInstance.properties = { items: data.items };
        // append element into parent
        parent.appendChild(navInstance);
      });
    }
  }]);

  return HugeNavBuilder;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class HugeNavElement
 * @description Class that represents navigation tree.
 */

var HugeNavElement = function (_HTMLElement) {
  _inherits(HugeNavElement, _HTMLElement);

  function HugeNavElement() {
    _classCallCheck(this, HugeNavElement);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(HugeNavElement).call(this));
  }

  // Handles element created


  _createClass(HugeNavElement, [{
    key: 'createdCallback',
    value: function createdCallback() {}
    // this.addEventListener('click',() => HugeNavElement._hideMask());


    // Handles element atached to DOM

  }, {
    key: 'attachedCallback',
    value: function attachedCallback() {
      this.items = this.items != null ? this.items : this.dataset['items'];
      this._initializeElement();
    }

    // Porperties setter

  }, {
    key: '_initializeElement',


    // /dynamically create innerHTML
    value: function _initializeElement() {
      var brand = '<li class="brand-container"><a rel="home" href="#" title="HUGE"><span class="navbar-brand" ></span></a></li>';
      this.innerHTML = '<nav>' + this._buildNode({ items: this.items }, brand) + '</nav>';
    }

    // Recursive function to create the HTML node

  }, {
    key: '_buildNode',
    value: function _buildNode(nodeData, prepend) {
      var _this2 = this;

      if (nodeData.items && nodeData.items.length > 0) {
        var childsHtml = nodeData.items.map(function (item) {
          return '<li onclick="HugeNavElement.handleNodeClick(this, event)"><a href=' + item.url + ' >' + item.label + ' </a>' + _this2._buildNode(item) + '</li>';
        });
        return '<ul>' + (prepend ? prepend : '') + childsHtml.join('') + '</ul>';
      }return '';
    }
  }, {
    key: 'properties',
    set: function set(props) {
      this.items = props.items;
    }
  }], [{
    key: '_showMenu',
    value: function _showMenu(element) {
      var ulTags = element.getElementsByTagName('ul');
      if (ulTags.length > 0) {
        HugeNavElement._showMask();
        element.className = 'selected-node';
      }
    }
  }, {
    key: '_hideMenu',
    value: function _hideMenu() {
      HugeNavElement._hideMask();
      var nodes = document.querySelectorAll('ul > li.selected-node');
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].classList.remove('selected-node');
      }
    }
  }, {
    key: '_showMask',
    value: function _showMask() {
      var blockMask = document.getElementById('block-mask');
      if (!blockMask) {
        blockMask = document.createElement('div');
        blockMask.id = 'block-mask';
        blockMask.addEventListener('click', function () {
          return HugeNavElement._hideMenu();
        });
        document.getElementsByTagName('body')[0].appendChild(blockMask);
      }
      blockMask.style.display = 'block';
    }
  }, {
    key: '_hideMask',
    value: function _hideMask() {
      var blockMask = document.getElementById('block-mask');
      if (blockMask) {
        blockMask.style.display = 'none';
      }
    }
  }, {
    key: 'handleNodeClick',
    value: function handleNodeClick(element, event) {
      HugeNavElement._hideMenu();
      HugeNavElement._showMenu(element);
    }
  }]);

  return HugeNavElement;
}(HTMLElement);

//Register custom Element


var hugeNav = document.registerElement('huge-nav', HugeNavElement);
