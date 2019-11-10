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
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import { } from '@polymer/polymer/lib/elements/dom-repeat.js';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';

class StartPolymer3 extends PolymerElement {
  static get properties() {
    return {
      message: {
        type: String,
        value: ''
      },      
      destinationList: {
        type: Array,
        value : function(){
          return [{"destinationName":"Destination1","selectedPlanetIndex": -1,"selectedVehicleIndex":-1},
                  {"destinationName":"Destination2","selectedPlanetIndex": -1,"selectedVehicleIndex":-1},
                  {"destinationName":"Destination3","selectedPlanetIndex": -1,"selectedVehicleIndex":-1},
                  {"destinationName":"Destination4","selectedPlanetIndex": -1,"selectedVehicleIndex":-1}]
        }
      },
      planets: {
        type: Array                
      },
      vehicle: {
        type: Array
      },
      requestBody : {
        type: Object,
        value : function(){
          return {
            "token": "",
            "planet_names": [],
            "vehicle_names": []
        } 
        }
      }  
    }
  }

  constructor() {
    // If you override the constructor, always call the 
    // superconstructor first.
    super();
    // Resolve warning about scroll performance 
    // See https://developers.google.com/web/updates/2016/06/passive-event-listeners
    setPassiveTouchGestures(true);
    this.message = 'Hello World! I\'m a Polymer element :)';
    this.getPlanets();
    this.getVehicle();    
  }

  ready() {
    // If you override ready, always call super.ready() first.
    super.ready();
    // Output the custom element's HTML tag to the browser console.
    // Open your browser's developer tools to view the output.
    console.log(this.tagName);  
  }  

  getPlanets() {    
    return fetch('https://findfalcone.herokuapp.com/planets').then(function (response) {      
      return response.json();
    }).then(data => {
      this.planets = data;
      this.destinationList[0].planets = data;
      this.destinationList[1].planets = data;
      this.destinationList[2].planets = data;
      this.destinationList[3].planets = data;           
      return this.planets;
    }).catch(err => window.alert(err));
  }

  getVehicle() {
    return fetch('https://findfalcone.herokuapp.com/vehicles').then(function(response) {
      return response.json();
    }).then(data=> {
      this.vehicle =  data;
      this.destinationList[0].vehicle = data;
      this.destinationList[1].vehicle = data;
      this.destinationList[2].vehicle = data;
      this.destinationList[3].vehicle = data;       
      return this.vehicle;
    }).catch(err=> window.alert(err));
  }

  getToken() {
    this.requestBody.token =  fetch('https://findfalcone.herokuapp.com/token', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
    }).then((r) => {           
      return r.json(); 
    })
    .catch(err=>window.alert(err));

    this.getRequestBody();
  }

  getRequestBody() { 
    for(let destination=0; destination <this.destinationList.length; destination++){
      let current = this.destinationList[destination];
      this.requestBody.planet_names.push(current.planets[current.selectedPlanetIndex]);      
    }
    // this.requestBody.planet_names = [];
    // this.vehicle_names = [];
    // console.log(this.requestBody);
     
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
        },
        #destination-list {
          display: flex
        }
      </style>

      <h1>Finding Falcone</h1>
      
          
      <dom-repeat items="{{destinationList}}" as="list">
        <template>
        <div id= "destination-list">
          <span>Select {{list.destinationName}}: </span>     
          <paper-dropdown-menu label ="Planets">
            <paper-listbox slot="dropdown-content" selected = {{list.selectedPlanetIndex}} >                       
              <dom-repeat items="{{planets}}" as="planets" >
                <template>
                  <paper-item>"{{planets.name}}"</paper-item>                  
                </template>
              <dom-repeat>  
            </paper-listbox>
          </paper-dropdown-menu>

          <span>Select Vehicle</span>
          <paper-dropdown-menu label ="Vehicle">
            <paper-listbox  slot="dropdown-content" selected = {{list.selectedVehicleIndex}}>
              <dom-repeat items="{{vehicle}}" as="vehicle" >
                <template>
                  <paper-item>"{{vehicle.name}}"</paper-item>                  
                </template>
              </dom-repeat>
            </paper-listbox>
          </paper-dropdown-menu> 
          </div>
        </template>
      </dom-repeat>

      <div>Planets selected are 
        <dom-repeat items="{{destinationList}}" as="list">
          <template><span>{{list.selectedVehicleIndex}}</span></template>
        </dom-repeat>
      </div>

      <paper-button raised on-click='getToken' id='findBtn'>Find Falcone</paper-button>

      
    `;
  }
}

// Register the element with the browser.
customElements.define('start-polymer3', StartPolymer3);

{/* <iron-image class="images" src = "src/images/spaceship.png" preload sizing = "cover"></iron-image> */}
{/* <iron-image class="images" src = "src/images/planets.png" preload sizing = "cover"></iron-image> */}
{/* <span>Select Vehicle</span>
          <paper-dropdown-menu label ="Vehicle">
            <paper-listbox>
              <dom-repeat items="{{vehicle}}" as="vehicle" >
                <template>
                  <paper-item>"{{vehicle.name}}"</paper-item>                  
                </template>
              </dom-repeat>
            </paper-listbox>
          <paper-dropdown-menu>  */}