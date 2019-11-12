import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';


class PebbleDropdown extends PolymerElement {
  static get properties() {
    return {
       label: {
           type: String,
           value: ""
       },
       selectedIndex: {
           type: Number,
           notify: true,
           observer: "selectedIndexChanged"
           
       },
       dropdownItems: {
           type: Array,
           notify: true,
           value: function(){
               return []
           }
       }
    }
  }

  constructor() {
    super();
       
  }

  static get template() {
    return html`
        <style>
            #menu {
                padding : 10px;
            }
        </style>
        <paper-dropdown-menu id="menu" label ={{label}}>
            <paper-listbox slot="dropdown-content" selected = {{selectedIndex}}>
                <dom-repeat items={{dropdownItems}}>
                    <template>
                        <paper-item>{{item.name}}</paper-item>                  
                    </template>
                <dom-repeat> 
            </paper-listbox>
        </paper-dropdown-menu>
        `;
  }

  selectedIndexChanged(){
    if(this.selectedIndex > -1){
        this.dropdownItems[this.selectedIndex].selected = true;
    }
  }
}
customElements.define('pebble-dropdown', PebbleDropdown);