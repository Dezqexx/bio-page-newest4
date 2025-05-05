
declare namespace google.maps {
  class Map {
    constructor(mapDiv: Element, opts?: MapOptions);
  }

  interface MapOptions {
    center: LatLng | LatLngLiteral;
    zoom: number;
    styles?: any[];
  }

  interface LatLng {
    lat(): number;
    lng(): number;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }
}
