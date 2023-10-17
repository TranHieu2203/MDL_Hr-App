import { google } from "google-maps";
declare const google: any;
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, NgZone } from "@angular/core";
import { Subject } from "rxjs";
const _ = require("lodash");
import { CoreService } from "src/app/_services/core.service";
import { AgmMap } from "@agm/core";
@Component({
  selector: "map-multimarker",
  templateUrl: "./mapmultimarker.component.html",
  styleUrls: ["./mapmultimarker.component.scss"],
  providers: [],
  encapsulation: ViewEncapsulation.None,
})
export class MapMultiMarkerComponent implements OnInit {
  // Varriable Language
  flagState = "";
  model: ModelMap = new ModelMap();
  languages: any;
  @ViewChild("AgmMap", { static: false })
  public agmMap!: AgmMap;

  @ViewChild('search', { static: false })
  public searchElementRef!: ElementRef;
  // Private
  private _unsubscribeAll: Subject<any>;
  // Map
  // google maps zoom level
  zoom: number = 20;
  // initial center position for the map
  center = {
    lat: 100.0000000,
    lng: 105.2964959,
  };
  latitude!: number;
  longitude!: number;
  markers: marker[] = [];
  shape: any = null;
  points: any;
  polygon: any;
  radius: any;
  lng: any;
  lat: any;
  drawingManager: any;
  openedWindow: number = 0; // alternative: array of numbers

  /**
   * Constructor
   *
   */
  constructor(private _mapService: CoreService, private ngZone: NgZone) {
    this._unsubscribeAll = new Subject();
  }

  /**
   * On init
   */
  ngOnInit(): void {
    // this.polygon = JSON.parse(this.model.polygon);
    // if (this.polygon && this.polygon.center) {
    //   this.radius = this.polygon.radius;
    //   this.lat = this.polygon.center.lat;
    //   this.lng = this.polygon.center.lng;
    // }
    this.setValue(this.model)
  }
  getValue() {
    return this.model;
  }
  setValue(model: ModelMap) {
    this.model.lat = Number(model.lat);
    this.model.long = Number(model.long);
    this.model.markers = model.markers;
    if (this.model.zoom != null) {
      this.model.zoom = 12;
    }
  }
  refesh() {
    if (this.shape) {
      this.shape.setMap(null);
    }
    this.model.lat = 0;
    this.model.long = 0;
    this.model.radius = 0;
    this.model.id = null;
  }
  mapClicked($event: any) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: false,
    });
  }

  acceptLocation = () => {
    this.model.lat = this.points.center.lat.toString();
    this.model.long = this.points.center.lng.toString();
  };
  openWindow(id: any) {
    this.openedWindow = id; // alternative: push to array of numbers
  }

  isInfoWindowOpen(id: any) {
    return this.openedWindow == id; // alternative: check if id is in array
  }
}
// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
class ModelMap {
  id?: any;
  markers?: Array<any>;
  lat?: any;
  long?: any;
  radius?: any;
  zoom?: any = 18;
}
