"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Droplets, Leaf, BarChart } from 'lucide-react';
import Link from 'next/link';

// A simple world map SVG component. In a real app, you might use a library like D3 or Mapbox.
const WorldMap = ({ pins }: { pins: { x: number; y: number; city: string }[] }) => {
  return (
    <div className="relative w-full aspect-[2/1] bg-muted/30 rounded-lg overflow-hidden border">
      <svg viewBox="0 0 1000 500" className="w-full h-full" fill="hsl(var(--muted))">
        <path d="M1000 249.2c0 60.2-21.9 113.8-65.9 161.4-43.8 47.7-101.4 75.7-161.4 75.7s-117.6-28-161.4-75.7C567.4 363 545.5 309.4 545.5 249.2c0-60.2 21.9-113.8 65.9-161.4C655.2 40.2 712.8 12.2 772.7 12.2s117.6 28 161.4 75.7c43.9 47.7 65.9 101.2 65.9 161.3zM493.5 487.8c-22-3.8-43-9.9-63-18.4-20-8.5-38.3-18.8-55.2-31.2-16.8-12.4-31.4-26.2-43.9-41.4-12.5-15.2-22.1-31.2-28.9-47.9-6.8-16.8-10.2-33.8-10.2-51.3s3.4-34.5 10.2-51.3c6.8-16.8 16.4-32.8 28.9-47.9 12.5-15.2 27.1-29 43.9-41.4 16.8-12.4 35.1-22.7 55.2-31.2 20-8.5 41-14.6 63-18.4 22-3.8 44.2-5.7 66.5-5.7s44.5 1.9 66.5 5.7c22 3.8 43 9.9 63 18.4 20 8.5 38.3 18.8 55.2 31.2 16.8 12.4 31.4 26.2 43.9 41.4 12.5 15.2 22.1 31.2 28.9 47.9 6.8 16.8 10.2 33.8 10.2 51.3s-3.4 34.5-10.2 51.3c-6.8 16.8-16.4 32.8-28.9 47.9-12.5 15.2-27.1 29-43.9 41.4-16.8 12.4-35.1 22.7-55.2 31.2-20 8.5-41 14.6-63 18.4-22 3.8-44.2 5.7-66.5 5.7s-44.5-1.9-66.5-5.7zM20.6 249.2c0 21.1 3.6 41.4 10.7 61 7.1 19.6 17.6 37.6 31.2 54.3 13.6 16.6 29.9 31.2 48.9 43.9 19 12.7 40.2 22.8 63.8 30.6 23.5 7.8 48.6 11.6 75.4 11.6 26.8 0 49.3-3.9 67.5-11.6 18.2-7.8 32.5-17.9 43.2-30.6 10.7-12.7 17.6-26.6 21-41.8s3.4-30.9 3.4-47.1c0-16.2 0-32-3.4-47.1s-10.4-29.1-21-41.8c-10.7-12.7-25-22.8-43.2-30.6-18.2-7.8-40.7-11.6-67.5-11.6-26.8 0-51.9 3.9-75.4 11.6-23.5 7.8-44.8 17.9-63.8 30.6-19 12.7-35.3 27.3-48.9 43.9-13.6 16.6-24.1 34.6-31.2 54.3-7.1 19.6-10.7 39.9-10.7 61z" />
        <path d="M493.5,487.8c-22-3.8-43-9.9-63-18.4c-20-8.5-38.3-18.8-55.2-31.2c-16.8-12.4-31.4-26.2-43.9-41.4c-12.5-15.2-22.1-31.2-28.9-47.9c-6.8-16.8-10.2-33.8-10.2-51.3s3.4-34.5,10.2-51.3c6.8-16.8,16.4-32.8,28.9-47.9c12.5-15.2,27.1-29,43.9-41.4c16.8-12.4,35.1-22.7,55.2-31.2c20-8.5,41-14.6,63-18.4c22-3.8,44.2-5.7,66.5-5.7c22.3,0,44.5,1.9,66.5,5.7c22,3.8,43,9.9,63,18.4c20,8.5,38.3,18.8,55.2,31.2c16.8,12.4,31.4,26.2,43.9,41.4c12.5,15.2,22.1,31.2,28.9,47.9c6.8,16.8,10.2,33.8,10.2,51.3c0,17.5-3.4,34.5-10.2,51.3c-6.8,16.8-16.4,32.8-28.9,47.9c-12.5,15.2-27.1,29-43.9,41.4c-16.8,12.4-35.1,22.7-55.2,31.2c-20,8.5-41,14.6-63,18.4c-22,3.8-44.2,5.7-66.5,5.7C537.7,493.5,515.5,491.6,493.5,487.8z" fill="hsl(var(--card))"/>
        <path d="M485.4,449.6c-27.5-10-50.6-24.8-69.2-44.5s-32-43.7-40-72c-8-28.2-10.2-58-6.8-89.2c3.4-31.2,12.8-60.7,28.2-88.5c15.4-27.8,36.5-51.7,63.3-71.8c26.8-20.1,58-34.8,93.8-44.2c35.8-9.4,74-13.3,114.6-11.6c40.6,1.7,80,9.9,118.1,24.8c38.1,14.9,71,35.5,98.6,61.9c27.6,26.4,49,57.7,64,93.8c15.1,36.1,22.6,75.3,22.6,117.6c0,42.3-7.5,81.5-22.6,117.6c-15.1,36.1-36.4,67.4-64,93.8c-27.6,26.4-60.5,47-98.6,61.9c-38.1,14.9-77.5,22.3-118.1,22.3c-40.6,0-79.2-3.9-115.8-11.6C543.4,484.4,512.2,469.7,485.4,449.6zM20.6,249.2c0,21.1,3.6,41.4,10.7,61c7.1,19.6,17.6,37.6,31.2,54.3c13.6,16.6,29.9,31.2,48.9,43.9c19,12.7,40.2,22.8,63.8,30.6c23.5,7.8,48.6,11.6,75.4,11.6c26.8,0,49.3-3.9,67.5-11.6c18.2-7.8,32.5-17.9,43.2-30.6c10.7-12.7,17.6-26.6,21-41.8c3.4-15.2,3.4-30.9,3.4-47.1c0-16.2,0-32-3.4-47.1c-3.4-15.2-10.4-29.1-21-41.8c-10.7-12.7-25-22.8-43.2-30.6c-18.2-7.8-40.7-11.6-67.5-11.6c-26.8,0-51.9,3.9-75.4,11.6c-23.5,7.8-44.8,17.9-63.8,30.6c-19,12.7-35.3,27.3-48.9,43.9c-13.6,16.6-24.1,34.6-31.2,54.3C24.2,207.8,20.6,228.1,20.6,249.2z" fill="hsl(var(--card))"/>
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
