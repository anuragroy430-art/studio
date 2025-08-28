"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Droplets, Leaf, BarChart } from 'lucide-react';
import Link from 'next/link';

// A simple world map SVG component. In a real app, you might use a library like D3 or Mapbox.
const WorldMap = ({ pins }: { pins: { x: number; y: number; city: string }[] }) => {
  return (
    <div className="relative w-full aspect-[2/1] bg-muted/30 rounded-lg overflow-hidden border">
      <svg viewBox="0 0 1000 500" className="w-full h-full">
        {/* A very simplified world map path */}
        <path d="M500 250 m-250 0 a250 250 0 1 0 500 0 a250 250 0 1 0 -500 0" fill="#e0e0e0" />
        <path d="M499.2,4.8C226.4,4.8,4.8,226.4,4.8,499.2h988.8C993.6,226.4,772,4.8,499.2,4.8z M499.2,881.3c-210.9,0-382.1-171.2-382.1-382.1c0-210.9,171.2-382.1,382.1-382.1c210.9,0,382.1,171.2,382.1,382.1C881.3,710.1,710.1,881.3,499.2,881.3z" fill="#cccccc" transform="scale(0.5) translate(500, 20)"/>
        <path d="M961.9,416.3c-23.4-119.9-84.3-223.4-168.3-294.5l-33.1-27.3c-11.3-9.3-25.1-16.4-40-20.3c-28.3-7.4-58.3-3.6-84.4,10.4  c-20.9,11.2-38.3,27.4-50.6,46.9c-20.1,31.8-21.9,71.2-5.1,104.9c10.9,22,27.8,40.1,48.7,52.3l20.4,12l-14.4,1.8  c-48.4,6.1-95.3,19.3-138.9,38.2c-55.3,24-105.1,56.6-146.5,96.3c-24.1,23.1-45.2,49.4-62.5,78.2c-1.3,2.2-2.6,4.3-3.8,6.5  l-12.1,21.5c-4.9,8.8-11.4,16.5-19.1,22.6c-13.9,11-31.5,16.3-49.3,14.7c-21-1.9-40.4-10.9-54.8-25.4c-20.9-20.9-31.4-49-28.5-77.2  c2.1-20.2,10.6-39.2,23.8-54.4l34-39.2c1.7-1.9,3.3-3.9,4.9-5.8l68.7-82.6c8-9.6,12.7-22,12.7-35.1c0-29.2-23.7-52.9-52.9-52.9  c-14.2,0-27.5,5.6-37.4,15.6l-57.6,57.7c-16.9,17-27.1,39.7-27.1,64.2c0,42,27.7,78.1,66.3,91.3c27.8,9.5,57.6,9.1,84.7-1.1  c22.1-8.3,41.9-22.3,56.9-40.4l30.8-37.1c1.2-1.5,2.5-2.9,3.8-4.4c21.8-24.7,48.7-44.5,79-58.2c44.3-20.1,93-30.2,142.3-30.2  c42.3,0,83.9,7.6,123.1,22.4c35.8,13.5,68.7,32.7,97.2,56.6c29.5,24.9,53.4,54.8,70.3,88.1C965.8,401.3,964.7,409.2,961.9,416.3z" fill="#a5d6a7" />

        {pins.map((pin, i) => (
          <g key={i} transform={`translate(${pin.x}, ${pin.y})`} className="cursor-pointer group">
            <title>{pin.city}</title>
            <circle r="8" fill="hsla(var(--primary) / 0.5)" className="transition-all group-hover:r-12" />
            <circle r="4" fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" />
          </g>
        ))}
      </svg>
    </div>
  );
};


const generateRandomPins = (count: number) => {
    const cities = ["New York", "London", "Tokyo", "Sydney", "Cairo", "Rio de Janeiro", "Moscow", "Beijing"];
    return Array.from({ length: count }, () => ({
        x: Math.random() * 950 + 25,
        y: Math.random() * 450 + 25,
        city: cities[Math.floor(Math.random() * cities.length)]
    }));
}


export default function CommunityPage() {
    const [pins, setPins] = useState<{x: number; y: number; city: string}[]>([]);

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
