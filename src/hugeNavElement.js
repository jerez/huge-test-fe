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
    // this.addEventListener('click',() => HugeNavElement._hideMask());
  }

  // Handles element atached to DOM
  attachedCallback(){
    this.items  = this.items != null ? this.items : this.dataset['items'];
    this._initializeElement();
  }

  // Porperties setter
  set properties(props) {
    this.items = props.items;
  }

  // /dynamically create innerHTML
  _initializeElement() {
    const brand = '<li class="brand-container"><a rel="home" href="#" title="HUGE"><span class="navbar-brand" ></span></a></li>';
    this.innerHTML = `<nav>${this._buildNode({items: this.items}, brand)}</nav>`;
  }

  // Recursive function to create the HTML node
  _buildNode(nodeData, prepend) {
    if (nodeData.items && nodeData.items.length > 0) {
      const childsHtml = nodeData.items.map((item) => (
        `<li onclick="HugeNavElement.handleNodeClick(this, event)"><a href=${item.url} >${item.label} </a>${this._buildNode(item)}</li>`
      ));
      return`<ul>${prepend ? prepend : ''}${childsHtml.join('')}</ul>`;
    }return '';
  }

  static _showMenu(element){
    const ulTags = element.getElementsByTagName('ul');
    if (ulTags.length > 0) {
      HugeNavElement._showMask();
      element.className = 'selected-node';
    }
  }

  static _hideMenu(){
    HugeNavElement._hideMask();
    const nodes = document.querySelectorAll('ul > li.selected-node');
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].classList.remove('selected-node');
    }
  }

  static _showMask(){
    let blockMask = document.getElementById('block-mask');
    if (!blockMask) {
      blockMask = document.createElement('div');
      blockMask.id = 'block-mask';
      blockMask.addEventListener('click',() => HugeNavElement._hideMenu());
      document.getElementsByTagName('body')[0].appendChild(blockMask);
    }
    blockMask.style.display = 'block';
  }

  static _hideMask(){
    let blockMask = document.getElementById('block-mask');
    if (blockMask) {
      blockMask.style.display = 'none';
    }
  }

  static handleNodeClick(element, event)  {
    HugeNavElement._hideMenu();
    HugeNavElement._showMenu(element);
  }
}

//Register custom Element
var hugeNav = document.registerElement('huge-nav', HugeNavElement);
