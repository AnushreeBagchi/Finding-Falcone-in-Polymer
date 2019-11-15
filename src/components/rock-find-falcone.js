import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import { } from '@polymer/polymer/lib/elements/dom-repeat.js';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';
import '../components/pebble-image.js';
import '../components/pebble-dropdown';

class FindFalcone extends PolymerElement {
  static get template() {
    return html`
      <style>
        .images {
          width: var(--iron-image-width, 1200px);
          height: var(--iron-image-height, 250px);
          background-color: lightgray;
        }

        .header {
          padding: 10px;
          justify-content: center;
          display: flex;
          color: #3F51B5;
          
          
        }  
        #findBtn,#refresh {
          padding: 10px;
          width: 200px;
          left: 30%;
          border-radius : 30px;          
        }    

        #search {
          padding: 10px;
          border-radius : 30px;          
          display: flex;
          justify-content : center;
          margin-top : 20px;
        }

        paper-button.indigo {
          background-color: var(--paper-indigo-500);
          color: white;
          --paper-button-raised-keyboard-focus: {            
            color: white !important;
          }          
        }

        .body{
          font:400 15px Arial;
        }

      </style>

      <div class="body">
          <h1 class="header">FINDING FALCONE !!</h1>

          <template is="dom-if" if={{!startSearch}}>
            <pebble-image image-url="src/images/spaceship.png"></pebble-image>
            <pebble-image image-url="src/images/planets.png"></pebble-image>
            <paper-button raised on-click='onStartSearch' id='search' class="custom indigo">Start Search</paper-button>
          </template>

          
            <template is="dom-if" if={{!searchStatus}}>
              <dom-repeat items="{{destinationList}}" as="list">
                <template>
                  <div id="destination-list">
                    <span>Select Destination: </span>

                    <pebble-dropdown label="Planets" selected-index={{list.selectedPlanetIndex}}
                      dropdown-items={{getDropdownList(planets)}}>
                    </pebble-dropdown>

                    <template is="dom-if" if="{{isDestinationSelected(list.selectedPlanetIndex)}}">
                      <span>Select Vehicle</span>
                      <pebble-dropdown label="Vehicle" selected-index={{list.selectedVehicleIndex}}
                        dropdown-items={{getDropdownList(vehicle)}}></pebble-dropdown>
                    </template>
                  </div>
                </template>
              </dom-repeat>
              <paper-button raised on-click='getToken' id='findBtn' class="indigo custom">Find Falcone</paper-button>
              <paper-button raised on-click='onRefresh' id='refresh' class="indigo custom">Refresh selection</paper-button>          
            </template>

            <template is="dom-if" if={{searchStatus}}>
              <h1 class="header">Congratulations</h1>
              <h1 class="header">Falcone found in {{searchResponse.planet_name}}</h1>
            </template>
          
      </div>
      `;
  }

  static get properties() {
    return {
      startSearch: {
        type: Boolean,
        value: false
      },
      destinationList: {
        type: Array,
        value : function(){
          return [{"selectedPlanetIndex": -1,"selectedVehicleIndex":-1}]
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
      }, 
      searchResponse : {
        type: Object,
        value: function(){
          return {}
        }
      },
      searchStatus : {
        type: Boolean,
        value: false
      }       
    }
  }

  constructor() {
    super();    
    this.getPlanets();
    this.getVehicle();    
  }

  getPlanets() {    
    return fetch('https://findfalcone.herokuapp.com/planets').then(function (response) {      
      return response.json();
    }).then(data => {
      this.planets = data;      
      this.destinationList[0].planets = data;        
      return this.planets;
    }).catch(err => window.alert(err));
  }

  getVehicle() {
    return fetch('https://findfalcone.herokuapp.com/vehicles').then(function(response) {
      return response.json();
    }).then(data=> {
      this.vehicle =  data;
      this.destinationList[0].vehicle = data;         
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

    this.searchResponse = response;
    this.searchStatus = (response.status == 'success');
    if(response.status == 'success'){
      console.log("success");
    }
  }

  isDestinationSelected(index){
    let dropDownSelected = (index > -1);
    //Add destinations to destinationlist         
    if(dropDownSelected && this.destinationList.length < 4) {
      this.push('destinationList',{"selectedPlanetIndex": -1,"selectedVehicleIndex":-1} )
    }
    return dropDownSelected;
  }

  getDropdownList(item){  
    
    let dropdownItems= [];
    for (let i=0; i< item.length;i++){
      if(!item[i].selected){
        dropdownItems.push(item[i])
      }
    }
    return dropdownItems;
  }

  onDropdownClick() {
    debugger;
  }

  onRefresh(){
    
  }

  onStartSearch(){
    this.startSearch = true;
  }

  
}
customElements.define('find-falcone', FindFalcone);