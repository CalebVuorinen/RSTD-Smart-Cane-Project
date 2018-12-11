/// <reference path="../../../../node_modules/@types/googlemaps/index.d.ts" />

import {
  Component, OnInit, AfterContentInit, Input, ViewChild,
  ContentChildren, ElementRef, QueryList, ChangeDetectionStrategy
} from '@angular/core';

import { debounceTime } from 'rxjs/operators';
import { MapPointComponent } from './mapPoint.component';
import * as moment from 'moment';


@Component({
  selector: 'cm-map',
  templateUrl: './map.component.html',
  // When using OnPush detectors, then the framework will check an OnPush
  // component when any of its input properties changes, when it fires
  // an event, or when an observable fires an event ~ Victor Savkin (Angular Team)
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit, AfterContentInit {

  private isEnabled: boolean;
  private loadingScript: boolean;
  private map: google.maps.Map;
  private markers: google.maps.Marker[] = [];
  private polylines: google.maps.Polyline[] = [];
  mapHeight: string;
  mapWidth: string;
  selectedMoment: Date;

  @Input() height: number;
  @Input() width: number;
  @Input() latitude = 34.5133;
  @Input() longitude = -94.1629;
  @Input() markerText = 'Your Location';
  @Input() zoom = 8;
  @Input() showFilter?: false;
  @Input() withRoutes?: false;

  // Necessary since a map rendered while container is hidden
  // will not load the map tiles properly and show a grey screen
  @Input() get enabled(): boolean {
    return this.isEnabled;
  }

  set enabled(isEnabled: boolean) {
    this.isEnabled = isEnabled;
    this.init();
  }

  @ViewChild('mapContainer') mapDiv: ElementRef;
  @ContentChildren(MapPointComponent) mapPoints: QueryList<MapPointComponent>;
  showedMapPoints: any;

  constructor() { }

  ngOnInit() {
    if (this.latitude && this.longitude) {
      if (this.mapHeight && this.mapWidth) {
        this.mapHeight = this.height + 'px';
        this.mapWidth = this.width + 'px';
      } else {
        const hw = this.getWindowHeightWidth(this.mapDiv.nativeElement.ownerDocument);
        this.mapHeight = hw.height / 2 + 'px';
        this.mapWidth = hw.width + 'px';
      }
    }
  }

  ngAfterContentInit() {
    this.mapPoints.changes
      .pipe(
        debounceTime(500)
      )
      .subscribe(() => {
        if (this.enabled) {
          this.showedMapPoints = this.mapPoints;
          if (this.withRoutes){
             this.renderPathsAndMarkers();
          } else {
            this.renderMapPoints();
          }
        }
      });
  }

  init() {
    // Need slight delay to avoid grey box when google script has previously been loaded.
    // Otherwise map <div> container may not be visible yet which causes the grey box.
    setTimeout(() => {
      this.showedMapPoints = this.mapPoints;
      this.ensureScript();
    }, 200);
  }

  private getWindowHeightWidth(document: HTMLDocument) {
    let width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

    const height = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;

    if (width > 900) { width = 900; }

    return { height: height, width: width };
  }

  private ensureScript() {
    this.loadingScript = true;
    const document = this.mapDiv.nativeElement.ownerDocument;
    const script = <HTMLScriptElement>document.querySelector('script[id="googlemaps"]');
    if (script) {
      if (this.isEnabled) { this.renderMap(); }
    } else {
      const mapsScript = document.createElement('script');
      mapsScript.id = 'googlemaps';
      mapsScript.type = 'text/javascript';
      mapsScript.async = true;
      mapsScript.defer = true;
      mapsScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCEpZ_OsXM3EOAcwwtwIZRz4C999nwZnhY';
      mapsScript.onload = () => {
        this.loadingScript = false;
        if (this.isEnabled) { this.renderMap(); }
      };
      document.body.appendChild(mapsScript);
    }
  }

  private renderMap() {
    const latlng = this.createLatLong(this.latitude, this.longitude);
    const options = {
      zoom: this.zoom,
      center: latlng,
      mapTypeControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapDiv.nativeElement, options);
    if (this.showedMapPoints && this.showedMapPoints.length) {;
      if (this.withRoutes){
         this.renderPathsAndMarkers();
      } else {
        this.renderMapPoints();
      }
    } else {
      this.createMarker(latlng, this.map, this.markerText);
    }
  }

  private createLatLong(latitude: number, longitude: number) {
    return (latitude && longitude) ? new google.maps.LatLng(latitude, longitude) : null;
  }

  private renderMapPoints() {
    if (this.map) {
      this.clearMapPoints();
      this.clearMapPolylines();

      this.showedMapPoints.forEach((point: MapPointComponent) => {
        const mapPointLatlng = this.createLatLong(point.latitude, point.longitude);
        this.createMarker(mapPointLatlng, this.map, point.markerText);
      });
    }
  }

  private clearMapPoints() {
    this.markers.forEach((marker: google.maps.Marker) => {
      marker.setMap(null);
    });
    this.markers = [];
  }

  private clearMapPolylines() {
    this.polylines.forEach((polyline: google.maps.Polyline) => {
      polyline.setMap(null);
    });
    this.polylines = [];
  }

  private createMarker(position: google.maps.LatLng, map: google.maps.Map, title: string) {
    const infowindow = new google.maps.InfoWindow({
      content: title
    });

    const marker = new google.maps.Marker({
      position: position,
      map: map,
      title: title,
      animation: google.maps.Animation.DROP
    });

    this.markers.push(marker);

    marker.addListener('click', () => {
      infowindow.open(map, marker);
    });
  }

  private renderPathsAndMarkers(){
    if (this.map) {
      this.clearMapPoints();
      this.clearMapPolylines();
      let _this = this;
      let dateTimes = [];
      this.showedMapPoints.forEach(function (point: MapPointComponent, index) {
        dateTimes.push(moment(moment(point.dateTime)));
        // if (index == 0 || index == _this.showedMapPoints.length - 1){
        //   const mapPointLatlng = _this.createLatLong(point.latitude, point.longitude);
        //   _this.createMarker(mapPointLatlng, _this.map, point.markerText);
        // } else {
        //   let duration = moment.duration(moment(_this.showedMapPoints._results[index-1].dateTime).diff(moment(point.dateTime)));
        //   console.log(duration.asHours());
        //   if (duration.asHours() > 24) {
        //     const mapPointLatlng = _this.createLatLong(point.latitude, point.longitude);
        //     _this.createMarker(mapPointLatlng, _this.map, point.markerText);
        //   }
        // }
      });
      let maxDate = moment.max(dateTimes);
      this.showedMapPoints.forEach(function (point: MapPointComponent) {
        if (moment(point.dateTime).isSame(maxDate)) {
          const mapPointLatlng = _this.createLatLong(point.latitude, point.longitude);
          _this.createMarker(mapPointLatlng, _this.map, point.markerText);
        }
      });
      this.renderPaths();
    }
  }

  private renderPaths(){
    if (this.showedMapPoints && this.showedMapPoints.length) {
      let pathPoints = [];
      this.showedMapPoints.forEach((point: MapPointComponent) => {
        let latLng = this.createLatLong(point.latitude, point.longitude);
        if (latLng != null) {
          pathPoints.push(latLng);
        }
      });

      const polyline = new google.maps.Polyline({
        map: this.map,
        path: pathPoints,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      this.polylines.push(polyline);

      return polyline
    }
  }

  onDateFilterChange(event: Date){
    if (event != null){
      this.showedMapPoints = this.mapPoints.filter(
        point => (point.dateTime != null && moment(moment(point.dateTime).format("YYYY-MM-DD")).isSame(moment(event).format("YYYY-MM-DD")))
      );
    } else {
      this.showedMapPoints = this.mapPoints;
    }
    if (this.withRoutes){
       this.renderPathsAndMarkers();
    } else {
      this.renderMapPoints();
    }
  }

}
