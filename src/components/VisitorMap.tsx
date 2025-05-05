
import React, { useEffect, useRef, useState } from 'react';
import { Map } from 'lucide-react';

const VisitorMap = () => {
  const [showMap, setShowMap] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (showMap && mapContainerRef.current) {
      // Load the Google Maps script dynamically
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      // Define the callback function that Google Maps will call
      window.initMap = () => {
        if (mapContainerRef.current) {
          // Initialize the map
          new window.google.maps.Map(mapContainerRef.current, {
            center: { lat: 51.1657, lng: 10.4515 }, // Center on Germany
            zoom: 5,
            styles: [
              { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
              { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
              { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
              {
                featureType: "administrative.locality",
                elementType: "labels.text.fill",
                stylers: [{ color: "#00ff00" }],
              },
              {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
              },
              {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{ color: "#263c3f" }],
              },
              {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{ color: "#6b9a76" }],
              },
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#38414e" }],
              },
              {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#212a37" }],
              },
              {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9ca5b3" }],
              },
              {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#746855" }],
              },
              {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{ color: "#1f2835" }],
              },
              {
                featureType: "road.highway",
                elementType: "labels.text.fill",
                stylers: [{ color: "#f3d19c" }],
              },
              {
                featureType: "transit",
                elementType: "geometry",
                stylers: [{ color: "#2f3948" }],
              },
              {
                featureType: "transit.station",
                elementType: "labels.text.fill",
                stylers: [{ color: "#00ff00" }],
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#17263c" }],
              },
              {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#515c6d" }],
              },
              {
                featureType: "water",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#17263c" }],
              },
            ],
          });
        }
      };
      
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
        delete window.initMap;
      };
    }
  }, [showMap]);
  
  return (
    <div className="relative">
      <button 
        onClick={() => setShowMap(!showMap)} 
        className="flex items-center gap-2 p-2 bg-black/30 backdrop-blur-sm rounded border border-[#00ff00]/30 text-[#00ff00]/80 text-xs hover:bg-black/50 transition-colors"
      >
        <Map className="h-4 w-4 text-[#00ff00]" />
        {showMap ? 'Hide Map' : 'Show Visitor Map'}
      </button>
      
      {showMap && (
        <div className="absolute top-full mt-2 left-0 w-[300px] h-[200px] z-20">
          <div 
            ref={mapContainerRef} 
            className="w-full h-full rounded-lg border border-[#00ff00]/30 overflow-hidden"
          ></div>
        </div>
      )}
    </div>
  );
};

export default VisitorMap;

// Declare the global initMap function
declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}
