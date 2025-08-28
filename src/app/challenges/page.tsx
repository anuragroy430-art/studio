
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Leaf, Loader2, WandSparkles, Target, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { handleGenerateChallenge } from "@/app/actions";
import type { EcoChallengeOutput } from "@/ai/schemas";
import { cn } from "@/lib/utils";

export default function ChallengesPage() {
    const [pledge, setPledge] = useState("");
    const [challenge, setChallenge] = useState<EcoChallengeOutput | null>(null);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleSubmit = () => {
        if (pledge.trim().length < 10) {
            toast({
                variant: "destructive",
                title: "Pledge is too short",
                description: "Please enter a meaningful pledge to generate a challenge.",
            });
            return;
        }

        startTransition(async () => {
            try {
                const result = await handleGenerateChallenge({ pledge });
                setChallenge(result);
            } catch (error) {
                console.error(error);
                toast({
                    variant: "destructive",
                    title: "Oh no! Something went wrong.",
                    description: "We couldn't generate your challenge. Please try again later.",
                });
            }
        });
    };

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
          <nav className="flex gap-4">
            <Link href="/pledge" className="text-primary hover:underline">Take the Pledge</Link>
            <Link href="/dashboard" className="text-primary hover:underline">Dashboard</Link>
            <Link href="/community" className="text-primary hover:underline">Community</Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="shadow-2xl border-2 border-primary/10">
            <CardHeader className="text-center">
                <div className="w-fit mx-auto p-3 bg-primary/10 rounded-full mb-2">
                    <Target className="w-8 h-8 text-primary" />
                </div>
              <CardTitle className="text-3xl font-headline">Generate Your Eco-Challenge</CardTitle>
              <CardDescription className="text-lg">
                Enter your eco-pledge below to get a personalized daily or weekly challenge.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label htmlFor="pledge-input" className="font-semibold text-lg">Your Eco-Pledge</label>
                    <p className="text-sm text-muted-foreground mb-2">
                        Don't have one? <Link href="/pledge" className="text-primary underline">Create one now!</Link>
                    </p>
                    <Textarea
                        id="pledge-input"
                        placeholder="e.g., I pledge to reduce my plastic waste by using reusable bags and bottles."
                        value={pledge}
                        onChange={(e) => setPledge(e.target.value)}
                        className="min-h-[100px] text-base"
                    />
                </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} disabled={isPending || !pledge.trim()} size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-7">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Your Challenge...
                  </>
                ) : (
                  <>
                    <WandSparkles className="mr-2 h-5 w-5" />
                    Generate My Challenge
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <div className={cn("transition-all duration-1000 ease-in-out mt-12", challenge ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none")}>
            {challenge && (
                <Card className="shadow-lg border-2 border-accent bg-accent/10">
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline text-center text-accent-foreground">{challenge.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                        <p className="text-lg">
                            {challenge.description}
                        </p>
                        <div className="flex items-center justify-center gap-3 p-3 bg-background/50 rounded-lg">
                            <Lightbulb className="w-6 h-6 text-primary" />
                            <div>
                                <h4 className="font-semibold">Environmental Benefit</h4>
                                <p className="text-sm text-foreground/80">{challenge.benefit}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
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
