/**
 * @class HugeNavElement
 * @description Class that represents navigation tree.
 */
  class HugeNavElement extends HTMLElement{

  constructor() {
    super();
  }

  // Handles element created
  createdCallback(){
    this.innerHTML = `<div id="nav-controls">
                        <h1 class="brand-container">
                          <a rel="home" href="#" title="HUGE">
                            <span id="navbar-brand"></span>
                          </a>
                        </h1>
                        <button id="menu-button"></button>
                      </div>
                      <nav id="inner-nav">
                        <span class="copyright">&#169 2016 Huge. All Rights Reserved.</span>
                      </nav>
                      <div id="block-mask"></div>`;

    this.menuButton = this.querySelector('#menu-button');
    this.innerNav = this.querySelector('#inner-nav');
    this.navbarBrand = this.querySelector('#navbar-brand');
    this.blockMask = this.querySelector('#block-mask');

    this.menuButton.addEventListener('click', this._toggleMenu.bind(this));
    this.blockMask.addEventListener('click', this._hideMenu.bind(this));
    this.addEventListener('click', this._hideMenu.bind(this));
  }

  // Porperties setter
  set items(items) {
    // /dynamically add childs to inner-nav element
    this.innerNav.appendChild(this._buildNode({items: items}, true));
  }

  // Recursive function to create nodes
  _buildNode(nodeData, topLevel) {
    if (nodeData.items && nodeData.items.length > 0) {
      const docFrag = document.createDocumentFragment();
      for (const key in nodeData.items) {
        docFrag.appendChild(this._createElement(nodeData.items[key], topLevel));
      }
      const ul = document.createElement('ul');
      ul.appendChild(docFrag);
      return ul;
    } return null;
  }

  // Create single node
  _createElement(item, topLevel){
    const li  = document.createElement('li');
    const a  = document.createElement('a');
    const linkText = document.createTextNode(item.label);

    a.appendChild(linkText);
    a.title = item.label;
    a.href = item.url;

    li.appendChild(a);

    if (topLevel || (item.items && item.items.length > 0)) {
      a.addEventListener('click', this._showMenu.bind(this));
      if (item.items && item.items.length > 0) {
        const chevronSpan = document.createElement('span');
        chevronSpan.classList.add('chevron');
        a.appendChild(chevronSpan)
      }
      const ul = this._buildNode(item, false);
      if (ul) { li.appendChild(ul) };
    }

    return li;
  }

  //Shows subMenu
  _showMenu(event) {
    event.stopPropagation();

    const parent = event.target.parentElement;
    const shown = parent.classList.contains('selected-node');
    var viewPort = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    var isMobileVp = (viewPort <= 768);

    this._hideMenu(event);

    const ulTags = parent.getElementsByTagName('ul');
    if (ulTags.length > 0) {
      if (!isMobileVp || (isMobileVp && !shown)) {
        parent.classList.add('selected-node');
      }
      this._setMenuOpenClass(true);
    }
  }

  //Hides submenu
  _hideMenu() {
    this._setMenuOpenClass(false);
    const nodes = this.querySelectorAll('nav > ul > li.selected-node');
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].classList.remove('selected-node');
    }
  }

  _setMenuOpenClass(open){
    if (open) {
      this.menuButton.classList.add('menu-open');
      this.navbarBrand.classList.add('menu-open');
      this.innerNav.classList.add('menu-open');
      this.blockMask.classList.add('menu-open');
    }else {
      this.menuButton.classList.remove('menu-open');
      this.navbarBrand.classList.remove('menu-open');
      this.innerNav.classList.remove('menu-open');
      this.blockMask.classList.remove('menu-open');
    }
  }

  // Toggle Mobile menu styles
  _toggleMenu(event) {
    if (event) event.stopPropagation();
    var shown = this.innerNav.classList.contains('menu-open');
    this._setMenuOpenClass(!shown);
  }
}

//Register custom Element
var hugeNav = document.registerElement('huge-nav', HugeNavElement);
