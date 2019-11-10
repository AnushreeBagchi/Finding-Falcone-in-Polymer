import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-image/iron-image.js';


class PebbleImage extends PolymerElement {
  static get properties() {
    return {
       src: {
           type: String
       }
    }
  }

  constructor() {
    super();
    this.printsrc();   
  }

  printsrc(){
    console.log(this.src);
  }

  static get template() {
    return html`
        <iron-image class="images"  alt="text" preload sizing = "cover"></iron-image> 
                `;
  }
}
customElements.define('pebble-image', PebbleImage);