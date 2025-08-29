"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Leaf, Loader2, BookOpen, WandSparkles, Lightbulb, Youtube, Menu, Award, Target, Gauge, Users, Gamepad2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { handleGenerateEducationContent } from "@/app/actions";
import type { EducationContentOutput } from "@/ai/schemas";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const suggestedTopics = [
    "Reducing Plastic Waste",
    "Sustainable Fashion",
    "The Importance of Composting",
    "Saving Water at Home",
    "Understanding Carbon Footprints",
    "Benefits of a Plant-Based Diet",
];

export default function EducationPage() {
    const [topic, setTopic] = useState("");
    const [article, setArticle] = useState<EducationContentOutput | null>(null);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleSubmit = (selectedTopic?: string) => {
        const topicToGenerate = selectedTopic || topic;
        if (!topicToGenerate || topicToGenerate.trim().length < 3) {
            toast({
                variant: "destructive",
                title: "Invalid Topic",
                description: "Please enter a valid topic with at least 3 characters.",
            });
            console.error("Validation failed: topicToGenerate is invalid.", { topicToGenerate });
            return;
        }

        console.log("Generating content for topic:", topicToGenerate);
        setArticle(null); // Clear previous article

        startTransition(async () => {
            try {
                const result = await handleGenerateEducationContent({ topic: topicToGenerate });
                setArticle(result);
                console.log("Generated content successfully:", result);
            } catch (error) {
                console.error("Error in handleGenerateEducationContent:", error);
                toast({
                    variant: "destructive",
                    title: "Oh no! Something went wrong.",
                    description: "We couldn't generate your article. Please try again later.",
                });
            }
        });
    };

    const renderContent = (content: string) => {
        const sections = content.split(/(\n## .*)/).filter(Boolean);
        return sections.map((section, index) => {
            if (section.startsWith('\n## ')) {
                const title = section.replace('\n## ', '').trim();
                return <h2 key={index} className="text-2xl font-bold mt-6 mb-2">{title}</h2>;
            }
            return (
                <div key={index} className="space-y-4">
                    {section.split('\n').map((paragraph, pIndex) => (
                        paragraph.trim() && <p key={pIndex} className="text-base leading-relaxed">{paragraph.replace(/(\* )/g, '• ').trim()}</p>
                    ))}
                </div>
            )
        });
    };
    
    const navLinks = [
        { href: "/pledge", icon: Award, text: "Take the Pledge" },
        { href: "/challenges", icon: Target, text: "Challenges" },
        { href: "/dashboard", icon: Gauge, text: "Dashboard" },
        { href: "/community", icon: Users, text: "Community" },
        { href: "/game", icon: Gamepad2, text: "Waste Sorting Game" },
        { href: "/education", icon: BookOpen, text: "Learn" },
        { href: "/greenify", icon: ImageIcon, text: "Greenify" },
    ];

    return (
    <div className="flex flex-col min-h-screen bg-background text-foreground animate-in fade-in duration-500">
      <header className="py-4 bg-card shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
              <Leaf className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold font-headline text-primary">
                EcoPledger
              </h1>
          </Link>
          <nav className="hidden md:flex gap-4 items-center">
             {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-primary hover:underline underline-offset-4">
                    {link.text}
                </Link>
             ))}
          </nav>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6 text-primary" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-3 mb-8">
                        <Leaf className="w-8 h-8 text-primary" />
                        <h1 className="text-2xl font-bold font-headline text-primary">
                            EcoPledger
                        </h1>
                    </Link>
                    <nav className="flex flex-col gap-4">
                        {navLinks.map(link => (
                            <Link key={link.href} href={link.href} className="text-lg font-medium text-foreground hover:text-primary transition-colors flex items-center gap-4 p-2 rounded-md hover:bg-primary/10">
                                <link.icon className="w-6 h-6 text-primary" />
                                {link.text}
                            </Link>
                        ))}
                    </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-grow py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="shadow-2xl border-2 border-primary/10 mb-12 animate-in fade-in zoom-in-95 duration-500">
            <CardHeader className="text-center">
                <div className="w-fit mx-auto p-3 bg-primary/10 rounded-full mb-2">
                    <BookOpen className="w-8 h-8 text-primary" />
                </div>
              <CardTitle className="text-3xl font-headline">Knowledge Hub</CardTitle>
              <CardDescription className="text-lg">
                Enter a topic below to learn more about sustainability.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        id="topic-input"
                        placeholder="e.g., 'The benefits of solar power'"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="text-base flex-grow"
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    />
                    <Button onClick={() => handleSubmit()} disabled={isPending || !topic.trim()} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105 active:scale-100">
                        <WandSparkles className="mr-2 h-5 w-5" />
                        Generate
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2 justify-center pt-2">
                    {suggestedTopics.map(t => (
                        <Button key={t} variant="outline" size="sm" onClick={() => { setTopic(t); handleSubmit(t);}} className="transition-transform hover:scale-105 active:scale-100">
                           <Lightbulb className="mr-2 h-4 w-4" /> {t}
                        </Button>
                    ))}
                </div>
            </CardContent>
          </Card>

          <div className="transition-all duration-500 ease-in-out">
            {isPending && (
                <div className="flex flex-col items-center justify-center text-center gap-4 p-8">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="text-lg text-muted-foreground">Generating your article... This may take a moment.</p>
                </div>
            )}
            {article && (
                <Card className="shadow-lg border-2 border-accent bg-background animate-in fade-in slide-in-from-bottom-10 duration-700">
                    <CardHeader>
                        <CardTitle className="text-4xl font-headline text-center text-primary">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-lg max-w-none text-foreground prose-headings:text-primary prose-strong:text-foreground">
                         {renderContent(article.content)}
                    </CardContent>

                    {article.youtubeLinks && article.youtubeLinks.length > 0 && (
                        <>
                        <Separator className="my-6" />
                        <CardFooter className="flex-col items-start gap-4">
                            <h3 className="text-2xl font-bold font-headline text-primary">Further Watching</h3>
                            <div className="space-y-3">
                            {article.youtubeLinks.map((video, index) => (
                                <a key={index} href={video.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group transition-colors hover:bg-muted/50 p-2 rounded-lg">
                                <Youtube className="w-8 h-8 text-red-600" />
                                <div className="flex-1">
                                    <p className="font-semibold group-hover:underline">{video.title}</p>
                                    <p className="text-sm text-muted-foreground truncate">{video.url}</p>
                                </div>
                                </a>
                            ))}
                            </div>
                        </CardFooter>
                        </>
                    )}
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