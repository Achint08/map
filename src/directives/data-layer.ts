import { Directive, Output, EventEmitter } from '@angular/core';

import { BaseMapDirective } from './base-map-directive';
import { NguiMapComponent } from '../components/ngui-map.component';

const INPUTS = ['controlPosition', 'controls', 'drawingMode', 'featureFactory', 'style', 'geoJson'];
const OUTPUTS = [
  'addfeature', 'click', 'dblclick', 'mousedown', 'mouseout', 'mouseover',
  'mouseup', 'removefeature', 'removeproperty', 'rightclick', 'setgeometry', 'setproperty'
];

@Directive({
  selector: 'ngui-map > data-layer',
  inputs: INPUTS,
  outputs: OUTPUTS,
})
export class DataLayer extends BaseMapDirective {
  @Output() public initialized$: EventEmitter<any> = new EventEmitter();

  constructor(nguiMapComponent: NguiMapComponent) {
    super(nguiMapComponent, 'Data', INPUTS, OUTPUTS);
  }

  // only called when map is ready
  initialize(): void {
    if (this['geoJson']) {
      console.log('this.geoJson', this['geoJson']);
      this.nguiMapComponent.map.data.loadGeoJson(this['geoJson']);
    } else {
      this.objectOptions = this.optionBuilder.googlizeAllInputs(this.inputs, this);
      console.log(this.mapObjectName, 'initialization objectOptions', this.objectOptions);
      this.nguiMapComponent.map.data.add(this.objectOptions);
    }

    // unlike others, data belongs to map. e.g., map.data.loadGeoJson(), map.data.add()
    this.mapObject = this.nguiMapComponent.map.data;

    // set google events listeners and emits to this outputs listeners
    this.nguiMap.setObjectEvents(this.outputs, this, 'mapObject');

    this.nguiMapComponent.addToMapObjectGroup(this.mapObjectName, this.mapObject);
    this.initialized$.emit(this.mapObject);
  }
}