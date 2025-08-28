
"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const WorldMapComponent = ({ pins }: { pins: { lat: number; lng: number; city: string }[] }) => {
  const position: LatLngExpression = [20, 0];
  
  useEffect(() => {
    (async () => {
      const L = (await import('leaflet'));
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      // @ts-ignore
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    })();
  }, []);

  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div className="relative w-full aspect-[2/1] bg-muted/30 rounded-lg overflow-hidden border">
       <MapContainer center={position} zoom={2} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pins.map((pin, i) => (
          <Marker key={i} position={[pin.lat, pin.lng]} />
        ))}
      </MapContainer>
    </div>
  );
};

export default WorldMapComponent;
