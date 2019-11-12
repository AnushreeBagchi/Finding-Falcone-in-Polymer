import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-image/iron-image.js';


class PebbleImage extends PolymerElement {
  static get properties() {
    return {
       imageUrl: {
           type: String
       }
    }
  }

  static get template() {
    return html`
        <style>
            #img {
                width: var(--iron-image-width, 1350px);
                height: var(--iron-image-height, 300px);
            }
        </style>
        <iron-image id="img" src={{imageUrl}} alt="text" preload sizing = "cover"></iron-image> 
        `;
  }
}
customElements.define('pebble-image', PebbleImage);