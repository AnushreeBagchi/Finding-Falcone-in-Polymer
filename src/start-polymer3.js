/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

// Import statements in Polymer 3.0 can now use package names.
// polymer-element.js now exports PolymerElement instead of Element,
// so no need to change the symbol. 
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import {} from '@polymer/polymer/lib/elements/dom-repeat.js';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';

class StartPolymer3 extends PolymerElement {
  static get properties() {
    return {
      message: {
        type: String,
        value: ''
      },
      pie: {
        type: Boolean,
        value: false,
        observer: 'togglePie'
      },
      loadComplete: {
        type: Boolean,
        value: false
      }
    };
  }

  constructor() {
    // If you override the constructor, always call the 
    // superconstructor first.
    super();
    // Resolve warning about scroll performance 
    // See https://developers.google.com/web/updates/2016/06/passive-event-listeners
    setPassiveTouchGestures(true);
    this.message = 'Hello World! I\'m a Polymer element :)';
  }

  ready() {
    // If you override ready, always call super.ready() first.
    super.ready();
    // Output the custom element's HTML tag to the browser console.
    // Open your browser's developer tools to view the output.
    console.log(this.tagName);

  }

  togglePie() {
    if (this.pie && !this.loadComplete) {
      // See https://developers.google.com/web/updates/2017/11/dynamic-import
      import('./lazy-element.js').then((LazyElement) => {
        console.log("LazyElement loaded");
      }).catch((reason) => {
        console.log("LazyElement failed to load", reason);
      });
      this.loadComplete = true;
    }
  }

  static get template() {
    // Template getter must return an instance of HTMLTemplateElement.
    // The html helper function makes this easy.
    return html`
      <style>
        .images {
          width: var(--iron-image-width, 1200px);
          height: var(--iron-image-height, 250px);
          background-color: lightgray;
        }
      </style>

      <h1>Finding Falcone</h1>
      <iron-image class="images" src = "src/images/planets.png" preload sizing = "cover"></iron-image>
      <iron-image class="images" src = "src/images/spaceship.png" preload sizing = "cover"></iron-image>



      <h3>Select planets you want to search in:</h3>
      <paper-dropdown-menu label = "Planet">
        <paper-listbox slot="dropdown-content">
          <paper-item>Item1</paper-item>
          <paper-item>Item2</paper-item>
          <paper-item>Item3</paper-item>
        </paper-listbox> 
      </paper-dropdown-menu>

      <h3>Select planets you want to search in:</h3>
      <paper-dropdown-menu label = "Planet">
        <paper-listbox slot="dropdown-content">
          <paper-item>Item1</paper-item>
          <paper-item>Item2</paper-item>
          <paper-item>Item3</paper-item>
        </paper-listbox> 
      </paper-dropdown-menu>

      <h3>Select planets you want to search in:</h3>
      <paper-dropdown-menu label = "Planet">
        <paper-listbox slot="dropdown-content">
          <paper-item>Item1</paper-item>
          <paper-item>Item2</paper-item>
          <paper-item>Item3</paper-item>
        </paper-listbox> 
      </paper-dropdown-menu>

      <h3>Select planets you want to search in:</h3>
      <paper-dropdown-menu label = "Planet">
        <paper-listbox slot="dropdown-content">
          <paper-item>Item1</paper-item>
          <paper-item>Item2</paper-item>
          <paper-item>Item3</paper-item>
        </paper-listbox> 
      </paper-dropdown-menu>

      
      
    `;
  }
}

// Register the element with the browser.
customElements.define('start-polymer3', StartPolymer3);
