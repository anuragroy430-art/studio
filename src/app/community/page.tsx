"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Droplets, Leaf, BarChart } from 'lucide-react';
import Link from 'next/link';

// A simple world map SVG component. In a real app, you might use a library like D3 or Mapbox.
const WorldMap = ({ pins }: { pins: { x: number; y: number; city: string }[] }) => {
  return (
    <div className="relative w-full aspect-[2/1] bg-muted/30 rounded-lg overflow-hidden border">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 500"
        className="w-full h-full"
        fill="hsl(var(--muted))"
        stroke="hsl(var(--border))"
        strokeWidth="0.5"
      >
        <path d="M500.1 45.4c-80-3.7-153.3 23-207.1 76.5-49 48.7-77.9 113.8-80.4 182.2-2.5 68.3 21.3 134.3 65.8 184.4 46.1 51.9 109.8 83.2 178.6 86.4 75.6 3.5 147.2-23.7 200.2-75.1 55.4-53.5 86.8-125.8 86.8-202.8.1-70.1-26.6-136.2-74.8-185.3-51.4-52.4-120.3-81.1-192.4-81.1-25.2 0-50.1 3.2-74.3 9.4-2.8.7-5.5 1.5-8.2 2.3l-.2-.1z" />
        <path d="M296.8 91.3c-2.3 1.1-4.6 2.3-6.8 3.5-32.9 18.5-60.3 44.8-79.7 76.9-18.4 30.6-28.2 65.6-28.2 101.4s8.3 68.2 24.3 98.2c16.6 31 41.9 57.3 73.1 75.9 29.8 17.8 63.4 27.5 98.4 28.1h.4c35 .6 69.8-8.9 99.2-26.6 30-18.1 54.3-43.7 70.7-74.9 16.9-32 25.9-68.4 25.9-106.1s-11.2-73.4-31.8-105.7c-17-26.7-40.4-49.3-68.2-66.2-28.3-17.2-60-27.4-93.2-29.1-11.3-.6-22.6-.5-33.8.2z" />
        <path d="M86.1 220.6c-2.3-11.8-3.4-23.8-3.4-35.9 0-20.9 4.3-41.2 12.7-60.2 7.9-18 19.3-34.6 33.7-49.2 14.5-14.7 31.8-27.1 40.2-30.8l-12.2-23.5-3.2 3.6c-20.9 23.5-35.9 52.8-43.5 85-8.3 34.6-8.3 70.8-.2 106.3 3.9 17 9.8 33.5 17.5 49.3 9.5 19.5 22.1 37.4 37.4 53.1 12.9 13.4 27.8 24.9 44.2 34.1 18.2 10.2 37.9 17.8 58.4 22.5 22.1 5.1 44.8 7.2 67.5 6.2 22.7-1 45-5.1 66.2-12.2s41.1-17.1 59.2-29.6c18.5-12.8 35-28.1 49-45.5 14-17.4 25.2-37 33.2-58.1 8.3-21.7 13.1-44.8 14.2-68.6.8-16.1.5-32.3-.9-48.4-1.4-16.1-4.2-32-8.2-47.5-4-15.5-9.2-30.4-15.5-44.6-6.3-14.2-13.6-27.5-21.9-39.9-8.2-12.2-17.4-23.4-27.3-33.3-9.9-10-20.6-18.6-31.9-25.9-11.2-7.2-23.1-13.1-35.4-17.6-12.3-4.5-25-7.7-37.9-9.4-12.9-1.7-26-2-39-1-12.8.9-25.5 3.2-37.8 6.7-12.2 3.5-24 8.1-35.3 13.6-11.2 5.5-21.9 11.9-31.9 19-10.1 7.2-19.4 15.2-28.1 23.9-8.6 8.7-16.4 18.1-23.4 28.1-7 10-13.2 20.6-18.4 31.7-5.2 11.1-9.5 22.7-12.7 34.6-3.2 11.9-5.4 24.1-6.5 36.4l.1.1z" />
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
