"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Leaf, Award, Star, Zap, CheckCircle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const badges = [
    { id: 'pledge-maker', icon: Award, title: "Pledge Maker", description: "You made your first pledge!", requirement: 0 },
    { id: 'first-step', icon: Star, title: "First Step", description: "Logged your first activity.", requirement: 1 },
    { id: 'week-streak', icon: Zap, title: "Week Streak", description: "Logged activity for 7 days.", requirement: 7 },
    { id: 'eco-warrior', icon: Target, title: "Eco Warrior", description: "Completed your first major goal by logging 30 activities.", requirement: 30 },
] as const;

type BadgeId = typeof badges[number]['id'];

export default function DashboardPage() {
    const [progress, setProgress] = useState(0);
    const [earnedBadges, setEarnedBadges] = useState<Set<BadgeId>>(new Set(['pledge-maker']));
    const [lastToastDate, setLastToastDate] = useState<string | null>(null);
    const { toast } = useToast();

    const activePledge = {
        title: "Reduce Single-Use Plastics",
        description: "I pledge to actively reduce my consumption of single-use plastics by carrying a reusable water bottle and coffee cup, and by opting for products with minimal or no plastic packaging.",
    };

    const maxProgress = 30; // 30 days to become an Eco Warrior

    useEffect(() => {
        const newBadges = new Set(earnedBadges);
        let badgeEarned = false;
        const today = new Date().toDateString();

        for (const badge of badges) {
            if (progress >= badge.requirement && !newBadges.has(badge.id)) {
                newBadges.add(badge.id);
                badgeEarned = true;
                // Prevent spamming toasts on a single day
                if (lastToastDate !== today) {
                    toast({
                        title: "Badge Unlocked! 🎉",
                        description: `You've earned the "${badge.title}" badge. Keep it up!`,
                    });
                    setLastToastDate(today);
                }
            }
        }

        if (badgeEarned) {
            setEarnedBadges(newBadges);
        }
    }, [progress, earnedBadges, toast, lastToastDate]);


    const logActivity = () => {
        setProgress(current => Math.min(current + 1, maxProgress));
    }

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
          <nav className="flex gap-4">
            <Link href="/pledge" className="text-primary hover:underline">Take the Pledge</Link>
            <Link href="/challenges" className="text-primary hover:underline">Challenges</Link>
            <Link href="/community" className="text-primary hover:underline">Community</Link>
            <Link href="/game" className="text-primary hover:underline">Waste Sorting Game</Link>
            <Link href="/education" className="text-primary hover:underline">Learn</Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold font-headline mb-2">Your Dashboard</h2>
                <p className="text-lg text-foreground/80">Track your progress, earn badges, and make a difference!</p>
            </div>

            <Card className="mb-8 shadow-lg border-2 border-primary/10">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">Your Active Pledge</CardTitle>
                </CardHeader>
                <CardContent>
                    <h3 className="font-semibold text-lg text-primary">{activePledge.title}</h3>
                    <p className="text-foreground/80 mt-1">{activePledge.description}</p>
                </CardContent>
            </Card>

            <Card className="mb-8 shadow-lg">
                <CardHeader>
                    <CardTitle>Your Progress</CardTitle>
                    <CardDescription>Log your daily sustainable activities to make progress.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-primary">Activity Log</span>
                        <span className="text-sm font-bold">{progress} / {maxProgress} days</span>
                    </div>
                    <Progress value={(progress / maxProgress) * 100} className="h-4" />
                </CardContent>
                <CardFooter>
                    <Button onClick={logActivity} disabled={progress >= maxProgress} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        {progress >= maxProgress ? "Goal Complete!" : "Log Today's Activity"}
                    </Button>
                </CardFooter>
            </Card>
            
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Badges Earned</CardTitle>
                    <CardDescription>Unlock new badges by sticking to your pledge.</CardDescription>
                </CardHeader>
                <CardContent>
                    <TooltipProvider>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            {badges.map(badge => (
                                <Tooltip key={badge.id}>
                                    <TooltipTrigger asChild>
                                        <div className="flex flex-col items-center gap-2">
                                            <div className={cn(
                                                "p-4 rounded-full transition-all duration-300",
                                                earnedBadges.has(badge.id) ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                                            )}>
                                                <badge.icon className="w-10 h-10" />
                                            </div>
                                            <h4 className={cn(
                                                "font-semibold",
                                                earnedBadges.has(badge.id) ? "text-foreground" : "text-muted-foreground"
                                            )}>{badge.title}</h4>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="font-bold">{badge.title}</p>
                                        <p>{badge.description}</p>
                                        {!earnedBadges.has(badge.id) && <p className="text-xs text-muted-foreground italic">Requires {badge.requirement} days of activity.</p>}
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </div>
                    </TooltipProvider>
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
