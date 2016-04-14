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
                      <div id="block-mask" style="display:none"></div>`;

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
      const ul = this._buildNode(item, false);
      if (ul) { li.appendChild(ul) };
    }

    return li;
  }

  //Shows subMenu
  _showMenu(event) {
    event.stopPropagation();
    const shown = event.target.parentElement.classList.contains('selected-node');
    this._hideMenu(null);
    if(!shown){
      const ulTags = event.target.parentElement.getElementsByTagName('ul');
      if (ulTags.length > 0) {
        this._showMask();
        event.target.parentElement.classList.add('selected-node');
      }
    }
  }

  //Hides submenu
  _hideMenu(event){
    if (!event || event.target.tagName != 'A') {
      this._hideMask();
      const nodes = this.querySelectorAll('nav > ul > li.selected-node');
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].classList.remove('selected-node');
      }
    }
  }

  // shows transluscent mask
  _showMask(){
    this.blockMask.style.display = 'block';
  }

  //Hides transluscent mask
  _hideMask(){
    // only hide if mobile menu is closed
    if (!this.innerNav.classList.contains('menu-open')) {
      this.blockMask.style.display = 'none';
    }
  }

  // Toggle Mobile menu styles
  _toggleMenu(event) {
    event.stopPropagation();
    this.menuButton.classList.toggle('menu-open');
    this.navbarBrand .classList.toggle('menu-open');
    this.innerNav.classList.toggle('menu-open');
    if (this.innerNav.classList.contains('menu-open')) {
      this._showMask();
    }else{
      this._hideMask();
    }
  }

}

//Register custom Element
var hugeNav = document.registerElement('huge-nav', HugeNavElement);
