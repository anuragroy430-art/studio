"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Droplets, Leaf, BarChart } from 'lucide-react';
import Link from 'next/link';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

const WorldMap = ({ pins }: { pins: { lat: number; lng: number; city: string }[] }) => {
  const position = { lat: 20, lng: 0 };
  
  if (!process.env.NEXT_PUBLIC_MAPS_API_KEY) {
    return (
      <div className="relative w-full aspect-[2/1] bg-muted/30 rounded-lg overflow-hidden border flex flex-col items-center justify-center text-center p-4">
        <h3 className="text-lg font-semibold text-destructive">Google Maps API Key Missing</h3>
        <p className="text-sm text-muted-foreground mt-2">
          To display the interactive map, please add your Google Maps API key to the <code className="px-1 py-0.5 bg-muted rounded-sm text-xs">.env</code> file as <code className="px-1 py-0.5 bg-muted rounded-sm text-xs">NEXT_PUBLIC_MAPS_API_KEY</code>.
        </p>
         <p className="text-xs text-muted-foreground mt-4">
          Remember to restart the development server after adding the key.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[2/1] bg-muted/30 rounded-lg overflow-hidden border">
       <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY}>
        <Map 
            defaultCenter={position} 
            defaultZoom={2} 
            mapId="eco_pledger_map"
            mapTypeControl={false}
            streetViewControl={false}
            fullscreenControl={false}
        >
          {pins.map((pin, i) => (
             <AdvancedMarker key={i} position={pin} title={pin.city}>
                <div className="w-4 h-4 rounded-full bg-primary/80 border-2 border-primary-foreground shadow-md"></div>
            </AdvancedMarker>
          ))}
        </Map>
       </APIProvider>
    </div>
  );
};


const generateRandomPins = (count: number) => {
    const cities = [
        { lat: 40.7128, lng: -74.0060, city: "New York" },
        { lat: 51.5074, lng: -0.1278, city: "London" },
        { lat: 35.6895, lng: 139.6917, city: "Tokyo" },
        { lat: -33.8688, lng: 151.2093, city: "Sydney" },
        { lat: 30.0444, lng: 31.2357, city: "Cairo" },
        { lat: -22.9068, lng: -43.1729, city: "Rio de Janeiro" },
        { lat: 55.7558, lng: 37.6173, city: "Moscow" },
        { lat: 39.9042, lng: 116.4074, city: "Beijing" },
        { lat: 19.4326, lng: -99.1332, city: "Mexico City" },
        { lat: -34.6037, lng: -58.3816, city: "Buenos Aires" },
        { lat: 6.5244, lng: 3.3792, city: "Lagos" },
        { lat: 1.3521, lng: 103.8198, city: "Singapore" },
    ];
    
    return Array.from({ length: count }, () => {
        const city = cities[Math.floor(Math.random() * cities.length)];
        return {
            lat: city.lat + (Math.random() - 0.5) * 10,
            lng: city.lng + (Math.random() - 0.5) * 20,
            city: city.city
        };
    });
}


export default function CommunityPage() {
    const [pins, setPins] = useState<{lat: number; lng: number; city: string}[]>([]);

    useEffect(() => {
        setPins(generateRandomPins(50));
    }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="py-6 bg-card shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="inline-block">
            <div className="flex items-center gap-3">
              <Leaf className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold font-headline text-primary">
                EcoPledger
              </h1>
            </div>
          </Link>
          <Link href="/pledge" className="text-primary hover:underline">Take the Pledge</Link>
        </div>
      </header>

      <main className="flex-grow py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Users className="w-12 h-12 mx-auto text-primary mb-4" />
            <h2 className="text-4xl md:text-5xl font-bold font-headline mb-2">Community Impact</h2>
            <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
              See the collective impact of our global community. Every pledge makes a difference.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pledges</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,453</div>
                <p className="text-xs text-muted-foreground">+2,012 since last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Water Saved (Est.)</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2M Gallons</div>
                <p className="text-xs text-muted-foreground">Equivalent to 6 Olympic pools</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CO2 Reduction (Est.)</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">850 Tons</div>
                <p className="text-xs text-muted-foreground">Like taking 185 cars off the road</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Global Pledges</CardTitle>
            </CardHeader>
            <CardContent>
              <WorldMap pins={pins} />
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="py-8 bg-card text-center text-foreground/60">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} EcoPledger. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
