"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Leaf, WandSparkles, Upload, Loader2, Image as ImageIcon, ArrowRight, Lightbulb, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { handleGreenifyImage } from "@/app/actions";
import type { GreenifyImageOutput } from "@/ai/schemas";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function GreenifyPage() {
    const [prompt, setPrompt] = useState("");
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [result, setResult] = useState<GreenifyImageOutput | null>(null);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const [fileName, setFileName] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                setOriginalImage(loadEvent.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (!originalImage) {
            toast({
                variant: "destructive",
                title: "No image selected",
                description: "Please upload an image to greenify.",
            });
            return;
        }
        if (!prompt.trim()) {
            toast({
                variant: "destructive",
                title: "Prompt is empty",
                description: "Please tell the AI how to greenify your image.",
            });
            return;
        }

        setResult(null);

        startTransition(async () => {
            try {
                const generatedResult = await handleGreenifyImage({
                    imageDataUrl: originalImage,
                    prompt: prompt,
                });
                setResult(generatedResult);
            } catch (error) {
                console.error(error);
                toast({
                    variant: "destructive",
                    title: "Oh no! Something went wrong.",
                    description: "We couldn't greenify your image. Please try again later.",
                });
            }
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
                <Link href="/community" className="text-primary hover:underline">Community</Link>
                <Link href="/game" className="text-primary hover:underline">Waste Sorting Game</Link>
                <Link href="/education" className="text-primary hover:underline">Learn</Link>
            </nav>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <div className="grid gap-4 py-6">
                      <Link href="/pledge" className="text-lg font-medium text-primary hover:underline">Take the Pledge</Link>
                      <Link href="/challenges" className="text-lg font-medium text-primary hover:underline">Challenges</Link>
                      <Link href="/dashboard" className="text-lg font-medium text-primary hover:underline">Dashboard</Link>
                      <Link href="/community" className="text-lg font-medium text-primary hover:underline">Community</Link>
                      <Link href="/game" className="text-lg font-medium text-primary hover:underline">Waste Sorting Game</Link>
                      <Link href="/education" className="text-lg font-medium text-primary hover:underline">Learn</Link>
                      <Link href="/greenify" className="text-lg font-medium text-primary hover:underline">Greenify</Link>
                  </div>
                </SheetContent>
              </Sheet>
          </div>
            </div>
        </header>

        <main className="flex-grow py-12 md:py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <Card className="shadow-2xl border-2 border-primary/10 mb-12">
                    <CardHeader className="text-center">
                        <div className="w-fit mx-auto p-3 bg-primary/10 rounded-full mb-2">
                            <ImageIcon className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-headline">Greenify Your Image</CardTitle>
                        <CardDescription className="text-lg">
                            Upload a photo and let our AI suggest eco-friendly improvements!
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                             <label htmlFor="image-upload" className="font-semibold text-lg">1. Upload an Image</label>
                             <div className="flex items-center gap-4">
                                <Button asChild variant="outline">
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        <Upload className="mr-2 h-5 w-5" />
                                        Choose File
                                    </label>
                                </Button>
                                <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                {fileName && <span className="text-muted-foreground">{fileName}</span>}
                            </div>
                        </div>

                        {originalImage && (
                            <div className="p-4 border rounded-lg bg-muted/50">
                                <h3 className="font-semibold mb-2">Image Preview:</h3>
                                <Image src={originalImage} alt="Preview" width={400} height={300} className="rounded-md mx-auto" />
                            </div>
                        )}
                        
                        <div className="space-y-2">
                            <label htmlFor="prompt-input" className="font-semibold text-lg">2. Tell Us How to Greenify It</label>
                            <Textarea
                                id="prompt-input"
                                placeholder="e.g., 'Make my backyard more wildlife-friendly' or 'Replace the plastic bottles with reusable ones.'"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="min-h-[100px] text-base"
                            />
                        </div>

                        <Button onClick={handleSubmit} disabled={isPending || !originalImage || !prompt.trim()} size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-7">
                            {isPending ? (
                                <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Generating Your Greenified Image...
                                </>
                            ) : (
                                <>
                                <WandSparkles className="mr-2 h-5 w-5" />
                                Greenify My Image
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {isPending && (
                    <div className="text-center p-8">
                         <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                         <p className="mt-4 text-lg text-muted-foreground">The AI is working its magic... This can take up to a minute.</p>
                    </div>
                )}

                {result && (
                    <Card className="shadow-lg border-2 border-accent bg-background">
                         <CardHeader>
                            <CardTitle className="text-2xl font-headline text-center text-primary">Your Greenified Image</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                           <div className="grid md:grid-cols-3 items-center gap-4">
                                <div className="space-y-2 text-center">
                                    <h3 className="font-bold text-lg">Original</h3>
                                    {originalImage && <Image src={originalImage} alt="Original" width={300} height={300} className="rounded-md border-2" />}
                                </div>
                                <div className="flex justify-center">
                                    <ArrowRight className="w-12 h-12 text-primary" />
                                </div>
                                <div className="space-y-2 text-center">
                                    <h3 className="font-bold text-lg text-primary">Greenified</h3>
                                    <Image src={result.greenifiedImageUrl} alt="Greenified result" width={300} height={300} className="rounded-md border-2 border-primary" />
                                </div>
                           </div>
                           <div className="p-4 rounded-lg bg-primary/10 flex items-start gap-4">
                                <Lightbulb className="w-8 h-8 text-primary mt-1" />
                                <div>
                                    <h4 className="font-bold text-primary">Eco-Suggestion</h4>
                                    <p className="text-foreground/90">{result.explanation}</p>
                                </div>
                           </div>
                        </CardContent>
                    </Card>
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
