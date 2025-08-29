"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Droplets, Leaf, BarChart, Trophy, MessageSquare, TrendingUp, Send, Menu, Award, Target, Gauge, Gamepad2, BookOpen, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const WorldMap = dynamic(() => import('@/components/WorldMap'), { 
  ssr: false,
  loading: () => <div className="relative w-full aspect-[2/1] bg-muted/30 rounded-lg border flex items-center justify-center"><p>Loading Map...</p></div>
});


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

const leaderboardData = [
    { rank: 1, name: "Greta T.", score: 9850, avatar: "/avatars/01.png" },
    { rank: 2, name: "David A.", score: 9700, avatar: "/avatars/02.png" },
    { rank: 3, name: "Jane G.", score: 9550, avatar: "/avatars/03.png" },
    { rank: 4, name: "Leo D.", score: 9200, avatar: "/avatars/04.png" },
    { rank: 5, name: "Mark R.", score: 8900, avatar: "/avatars/05.png" },
];

const initialCommunityFeedData = [
    { name: "Alex P.", pledge: "I pledge to compost all my food scraps.", time: "5m ago", avatar: "/avatars/06.png" },
    { name: "Maria S.", pledge: "I pledge to switch to a bamboo toothbrush.", time: "12m ago", avatar: "/avatars/07.png" },
    { name: "Kenji T.", pledge: "I pledge to use reusable shopping bags every time.", time: "30m ago", avatar: "/avatars/08.png" },
    { name: "Fatima A.", pledge: "I pledge to bike to work at least 3 times a week.", time: "1h ago", avatar: "/avatars/09.png" },
];

export default function CommunityPage() {
    const [pins, setPins] = useState<{lat: number; lng: number; city: string}[]>([]);
    const [communityFeed, setCommunityFeed] = useState(initialCommunityFeedData);
    const [newPost, setNewPost] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        setPins(generateRandomPins(50));
    }, []);

    const handlePostSubmit = () => {
        if (newPost.trim().length < 5) {
            toast({
                variant: "destructive",
                title: "Message is too short",
                description: "Please write a more meaningful message to share.",
            });
            return;
        }

        const newFeedItem = {
            name: "Eco Pledger", // Placeholder name
            pledge: newPost,
            time: "Just now",
            avatar: `https://i.pravatar.cc/48?u=eco-pledger`
        };

        setCommunityFeed([newFeedItem, ...communityFeed]);
        setNewPost("");
        toast({
            title: "Posted!",
            description: "Your message has been added to the community feed.",
        });
    };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="py-6 bg-card shadow-sm">
        <div className="container mx-auto px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" className="inline-block">
            <div className="flex items-center gap-3">
              <Leaf className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold font-headline text-primary">
                EcoPledger
              </h1>
            </div>
          </Link>
          <nav className="hidden md:flex gap-4 items-center">
            <Link href="/pledge" className="text-primary hover:underline">Take the Pledge</Link>
            <Link href="/challenges" className="text-primary hover:underline">Challenges</Link>
            <Link href="/dashboard" className="text-primary hover:underline">Dashboard</Link>
            <Link href="/game" className="text-primary hover:underline">Waste Sorting Game</Link>
            <Link href="/education" className="text-primary hover:underline">Learn</Link>
            <Link href="/greenify" className="text-primary hover:underline">Greenify</Link>
          </nav>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                 <div className="flex items-center gap-3 p-4 border-b">
                    <Leaf className="w-8 h-8 text-primary" />
                    <h2 className="text-2xl font-bold font-headline text-primary">EcoPledger</h2>
                </div>
                <nav className="grid gap-2 p-4">
                    <Link href="/pledge" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted">
                        <Award className="h-5 w-5" />
                        Take the Pledge
                    </Link>
                    <Link href="/challenges" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted">
                        <Target className="h-5 w-5" />
                        Challenges
                    </Link>
                    <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted">
                        <Gauge className="h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link href="/community" className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary bg-muted font-semibold">
                        <Users className="h-5 w-5" />
                        Community
                    </Link>
                    <Link href="/game" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted">
                        <Gamepad2 className="h-5 w-5" />
                        Waste Sorting Game
                    </Link>
                    <Link href="/education" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted">
                        <BookOpen className="h-5 w-5" />
                        Learn
                    </Link>
                    <Link href="/greenify" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted">
                        <ImageIcon className="h-5 w-5" />
                        Greenify
                    </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-grow py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Users className="w-12 h-12 mx-auto text-primary mb-4" />
            <h2 className="text-4xl md:text-5xl font-bold font-headline mb-2">Community Hub</h2>
            <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
              See the collective impact, climb the leaderboard, and get inspired by our global community.
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

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Global Pledges</CardTitle>
                    <CardDescription>A world map of our eco-conscious community members.</CardDescription>
                </CardHeader>
                <CardContent>
                    <WorldMap pins={pins} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-primary" />
                        <CardTitle>Leaderboard</CardTitle>
                    </div>
                    <CardDescription>Top 5 members by impact score.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-[50px]">Rank</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaderboardData.map(user => (
                                <TableRow key={user.rank}>
                                    <TableCell className="font-bold text-lg">{user.rank}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={`https://i.pravatar.cc/40?u=${user.name}`} alt={user.name} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>{user.name}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">{user.score.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
          </div>
          
          <Separator className="my-12" />

          <div>
             <div className="text-center mb-12">
                <TrendingUp className="w-12 h-12 mx-auto text-primary mb-4" />
                <h2 className="text-4xl font-bold font-headline mb-2">Community Feed</h2>
                <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
                Join the conversation and share your own eco-actions!
                </p>
            </div>
            <div className="max-w-2xl mx-auto space-y-8">
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg">Share Your Pledge</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Textarea 
                            placeholder="What are you doing to help the planet today?"
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            className="min-h-[80px]"
                        />
                         <Button onClick={handlePostSubmit} disabled={!newPost.trim()} className="w-full">
                            <Send className="mr-2 h-4 w-4" />
                            Post to Feed
                        </Button>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    {communityFeed.map((item, index) => (
                        <Card key={index} className="shadow-md">
                            <CardContent className="p-4 flex items-start gap-4">
                                <Avatar className="h-11 w-11 border-2 border-primary/50">
                                    <AvatarImage src={`https://i.pravatar.cc/48?u=${item.name}`} alt={item.name} />
                                    <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">{item.time}</p>
                                    </div>
                                    <p className="text-foreground/90 mt-1">"{item.pledge}"</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
          </div>

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
