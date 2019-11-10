import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import { } from '@polymer/polymer/lib/elements/dom-repeat.js';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';
import '../components/pebble-image.js';

class FindFalcone extends PolymerElement {
  static get properties() {
    return {
      spaceshipImage: {
        type: String,
        value: "src/images/spaceship.png"
      },
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
        type: Object
      }  
    }
  }

  constructor() {
    super();
    setPassiveTouchGestures(true);
    this.message = 'Hello World! I\'m a Polymer element :)';
    this.getPlanets();
    this.getVehicle();    
  }

  getPlanets() {    
    return fetch('https://findfalcone.herokuapp.com/planets').then(function (response) {      
      return response.json();
    }).then(data => {
      this.planets = data;
      for(let i=0; i<this.destinationList.length; i++) {
        this.destinationList[i].planets = data;
      }           
      return this.planets;
    }).catch(err => window.alert(err));
  }

  getVehicle() {
    return fetch('https://findfalcone.herokuapp.com/vehicles').then(function(response) {
      return response.json();
    }).then(data=> {
      this.vehicle =  data;
      for(let i = 0; i< this.destinationList.length ; i++) {
        this.destinationList[i].vehicle = data;
      }    
      return this.vehicle;
    }).catch(err=> window.alert(err));
  }

  async getToken() {
    this.requestBody = {
        "token": "",
        "planet_names": [],
        "vehicle_names": []
    }; 
  
    let token =  await fetch('https://findfalcone.herokuapp.com/token', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
    }).then((r) => {           
      return r.json(); 
    })
    .catch(err=>window.alert(err));

    this.requestBody.token = token.token;

    this.getRequestBody();
  }

  getRequestBody() { 
    for(let destination = 0; destination < this.destinationList.length; destination++){
      let current = this.destinationList[destination];
      this.requestBody.planet_names.push(current.planets[current.selectedPlanetIndex].name);
      this.requestBody.vehicle_names.push(current.vehicle[current.selectedVehicleIndex].name);      
    }
    this.getFalcone();
     
  }

  async getFalcone(){
    let response = await fetch('https://findfalcone.herokuapp.com/find', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.requestBody)
    }).then((r) => {           
      return r.json(); 
    })
    .catch(err=>window.alert(err));

    if(response.status == 'success'){
      console.log("success");
    }
  }

  static get template() {
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
      
        <pebble-image src={{spaceshipImage}}></pebble-image> 
      
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
                  <paper-item>"{{vehicle.name}}"</paper-items>                  
                </template>
              </dom-repeat>
            </paper-listbox>
          </paper-dropdown-menu> 
          </div>
        </template>
      </dom-repeat>
      <paper-button raised on-click='getToken' id='findBtn'>Find Falcone</paper-button>      
      
      `;
  }
}
customElements.define('find-falcone', FindFalcone);

{/* <iron-image class="images" src = "src/images/spaceship.png" preload sizing = "cover"></iron-image> */}
{/* <iron-image class="images" src = "src/images/planets.png" preload sizing = "cover"></iron-image> */}
