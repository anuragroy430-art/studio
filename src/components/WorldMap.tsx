"use client";

import { useEffect, useRef } from 'react';
import L, { type Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// This is to fix the marker icon issue in Leaflet with webpack
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const WorldMapComponent = ({ pins }: { pins: { lat: number; lng: number; city: string }[] }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) { // Only initialize if map doesn't exist
      const map = L.map(mapRef.current).setView([20, 0], 2);
      mapInstance.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      pins.forEach(pin => {
        L.marker([pin.lat, pin.lng]).addTo(map);
      });
    }

    // Cleanup function to destroy the map instance
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [pins]); // Re-run effect if pins change, but initialization is protected.

  return (
    <div className="relative w-full aspect-[2/1] bg-muted/30 rounded-lg overflow-hidden border">
      <div ref={mapRef} style={{ height: '100%', width: '100%' }}></div>
    </div>
  );
};

export default WorldMapComponent;
