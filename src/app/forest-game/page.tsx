
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Leaf, Loader2, WandSparkles, Film, TreeDeciduous } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { handleGenerateForestVideo } from "@/app/actions";
import type { GenerateForestVideoOutput } from "@/ai/schemas";
import { cn } from "@/lib/utils";

export default function ForestGamePage() {
    const [video, setVideo] = useState<GenerateForestVideoOutput | null>(null);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleSubmit = () => {
        startTransition(async () => {
            try {
                const result = await handleGenerateForestVideo();
                setVideo(result);
            } catch (error) {
                console.error(error);
                toast({
                    variant: "destructive",
                    title: "Oh no! Something went wrong.",
                    description: "We couldn't generate your forest video. This is an advanced feature and may be temporarily unavailable. Please try again later.",
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
            <Link href="/challenges" className="text-primary hover:underline">Challenges</Link>
            <Link href="/dashboard" className="text-primary hover:underline">Dashboard</Link>
            <Link href="/game" className="text-primary hover:underline">Waste Sorting Game</Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="shadow-2xl border-2 border-primary/10">
            <CardHeader className="text-center">
                <div className="w-fit mx-auto p-3 bg-primary/10 rounded-full mb-2">
                    <TreeDeciduous className="w-8 h-8 text-primary" />
                </div>
              <CardTitle className="text-3xl font-headline">AI Forest Generator</CardTitle>
              <CardDescription className="text-lg">
                Click the button below to use AI to generate a video of a lush forest growing.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={handleSubmit} disabled={isPending} size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-7">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Your Forest... (this can take up to a minute)
                  </>
                ) : (
                  <>
                    <WandSparkles className="mr-2 h-5 w-5" />
                    Generate Forest Video
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <div className={cn("transition-all duration-1000 ease-in-out mt-12", video ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none")}>
            {video && (
                <Card className="shadow-lg border-2 border-accent bg-accent/10">
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline text-center text-accent-foreground flex items-center justify-center gap-2">
                            <Film className="w-6 h-6"/> Your Forest is Ready!
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                       <video
                        src={video.videoUrl}
                        controls
                        className="w-full rounded-lg shadow-md"
                       >
                         Your browser does not support the video tag.
                       </video>
                    </CardContent>
                </Card>
            )}
          </div>
           {isPending && (
             <div className="mt-12 text-center text-foreground/80">
                <p>Please be patient. High-quality video generation is a complex process and can take some time.</p>
             </div>
           )}
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
