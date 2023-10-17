import { google } from "google-maps";
declare const google: any;
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, NgZone } from "@angular/core";
import { Subject } from "rxjs";
const _ = require("lodash");
import { CoreService } from "src/app/_services/core.service";
import { AgmMap } from "@agm/core";
@Component({
  selector: "map-core",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
  providers: [],
  encapsulation: ViewEncapsulation.None,
})
export class MapCoreComponent implements OnInit {
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
  // chọn vị trí bản đồ
  chooseLocation() {
    //remove
    if (this.shape != null) {
      this.shape.setMap(null);
    }
    //binding
  }
  getValue() {
    return this.model;
  }
  setValue(model: ModelMap) {
    this.model.id = model.id;
    this.model.center = typeof (model.center) == "string" ? JSON.parse(model.center) : model.center;
    this.model.lat = Number(model.lat);
    this.model.long = Number(model.long);
    this.model.radius = model.radius;
    this.model.zoom = 18;
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
  onMapReady(map: any) {
    this.initDrawingManager(map);
  }

  initDrawingManager(map: any) {
    const options = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: ["circle"],
      },
      polygonOptions: {
        draggable: true,
        editable: true,
        stroke: "#ccc",
        fill: "#ddd",
        strokeWeight: 1,
      },
      rectangleOptions: {
        strokeWeight: 1,
      },
      circleOptions: {
        strokeWeight: 1,
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
    };

    //let bounds = new google.maps.LatLngBounds();
    this.drawingManager = new google.maps.drawing.DrawingManager(options);
    this.drawingManager.setMap(map);

    // let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
    // autocomplete.addListener("place_changed", () => {
    //   this.ngZone.run(() => {
    //     //get the place result
    //     let place: google.maps.places.PlaceResult = autocomplete.getPlace();

    //     //verify result
    //     if (place.geometry === undefined || place.geometry === null) {
    //       return;
    //     }

    //     //set latitude, longitude and zoom
    //     this.model.lat = place.geometry.location.lat();
    //     this.model.long = place.geometry.location.lng();
    //     this.model.zoom = 18;
    //     this.setValue(this.model);
    //     var position = new google.maps.LatLng(this.model.lat,this.model.long)
    //     map.setCenter(position);
    //   });
    // });

    google.maps.event.addListener(
      this.drawingManager,
      "overlaycomplete",
      (event: any) => {
        if (this.shape != null) {
          this.shape.setMap(null);
        }
        this.shape = event.overlay;
        this.model.lat = event.overlay.center.lat();
        this.model.long = event.overlay.center.lng();
        this.model.radius = event.overlay.radius;
        this.model.zoom = event.overlay.map.zoom;
        this.model.center = {
          lat: event.overlay.map.center.lat(),
          lng: event.overlay.map.center.lng(),
        };

      }
    );
  }
  acceptLocation = () => {
    this.model.lat = this.points.center.lat.toString();
    this.model.long = this.points.center.lng.toString();
  };
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
  lat?: any;
  long?: any;
  radius?: any;
  zoom?: any = 18;
  center?: any = {
    lat: 20.98773555697224,
    lng: 105.78213118403842,
  };
}
