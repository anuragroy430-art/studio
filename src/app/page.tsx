"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Leaf,
  Car,
  UtensilsCrossed,
  ShoppingCart,
  Zap,
  Loader2,
  TreePine,
  Sparkles,
  Twitter,
  Linkedin,
  Volume2,
  Pause,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { handleGeneratePledge } from "@/app/actions";
import type { EcoPledgeOutput } from "@/ai/flows/eco-pledge-generator";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  commute: z.string({ required_error: "Please select your primary commute." }).min(1, "Please select your primary commute."),
  diet: z.string({ required_error: "Please select your diet." }).min(1, "Please select your diet."),
  shopping: z.string({ required_error: "Please select your shopping habits." }).min(1, "Please select your shopping habits."),
  energyUse: z.string({ required_error: "Please select your energy use." }).min(1, "Please select your energy use."),
});

type FormData = z.infer<typeof formSchema>;

const lifestyleQuestions = [
  {
    name: "commute",
    label: "How do you primarily commute?",
    icon: Car,
    options: ["Car", "Public Transport", "Bike", "Walk"],
    placeholder: "Select your commute",
  },
  {
    name: "diet",
    label: "What is your diet like?",
    icon: UtensilsCrossed,
    options: ["Meat-heavy", "Balanced", "Vegetarian", "Vegan"],
    placeholder: "Select your diet",
  },
  {
    name: "shopping",
    label: "How often do you buy new items?",
    icon: ShoppingCart,
    options: ["Very Often", "Sometimes", "Rarely"],
    placeholder: "Select your shopping frequency",
  },
  {
    name: "energyUse",
    label: "How would you describe your energy use at home?",
    icon: Zap,
    options: ["High", "Average", "Low"],
    placeholder: "Select your energy use",
  },
] as const;


export default function EcoPledgerPage() {
  const [isPending, startTransition] = useTransition();
  const [pledge, setPledge] = useState<EcoPledgeOutput | null>(null);
  const [showPledge, setShowPledge] = useState(false);
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      commute: "",
      diet: "",
      shopping: "",
      energyUse: "",
    },
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        const result = await handleGeneratePledge(data);
        setPledge(result);
        setShowPledge(true);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Oh no! Something went wrong.",
          description: "We couldn't generate your pledge. Please try again later.",
        });
      }
    });
  };

  useEffect(() => {
    if (showPledge && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showPledge]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const shareText = pledge
    ? `My EcoPledge 🌱: "${pledge.motivation}" I'm committed to making a difference! Join me. #EcoPledger`
    : "";

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    const url = window.location.href;
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent("My Eco-Pledge")}&summary=${encodeURIComponent(shareText)}`, "_blank");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-8 text-center">
        <div className="flex justify-center items-center gap-4 mb-4">
          <Leaf className="w-12 h-12 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
            EcoPledger
          </h1>
        </div>
        <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto px-4">
          Turn small lifestyle choices into powerful eco-pledges with AI.
        </p>
      </header>

      <main className="flex-grow w-full max-w-2xl mx-auto px-4 pb-12">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Create Your Eco-Pledge</CardTitle>
            <CardDescription>
              Answer a few questions about your lifestyle to generate a personalized pledge.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                {lifestyleQuestions.map((q) => (
                  <FormField
                    key={q.name}
                    control={form.control}
                    name={q.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base">
                          <q.icon className="w-5 h-5" />
                          {q.label}
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={q.placeholder} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {q.options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate My Pledge"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <div
          ref={resultsRef}
          className={cn(
            "mt-12 transition-all duration-700 ease-in-out",
            showPledge ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"
          )}
        >
          {pledge && (
            <Card className="shadow-lg border-2 border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline text-primary">Your Personalized Eco-Pledge</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <blockquote className="text-center text-lg italic border-l-4 border-accent pl-4 py-2 bg-background">
                  "{pledge.pledge}"
                </blockquote>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent/20 rounded-full">
                      <TreePine className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-bold font-headline text-lg">Your Impact</h3>
                      <p className="text-foreground/80">{pledge.impact}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent/20 rounded-full">
                      <Sparkles className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-bold font-headline text-lg">Stay Motivated!</h3>
                      <p className="text-foreground/80">{pledge.motivation}</p>
                    </div>
                  </div>
                </div>

                {pledge.audio && (
                  <>
                    <audio ref={audioRef} src={pledge.audio} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={() => setIsPlaying(false)} preload="auto" />
                    <Button variant="outline" onClick={toggleAudio} className="w-full">
                      {isPlaying ? <Pause className="mr-2" /> : <Volume2 className="mr-2" />}
                      {isPlaying ? "Pause" : "Listen to Your Pledge"}
                    </Button>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex-col gap-4 pt-4">
                <p className="text-sm font-semibold">Share your pledge!</p>
                <div className="flex gap-4">
                  <Button variant="outline" size="icon" onClick={shareOnTwitter} aria-label="Share on Twitter">
                    <Twitter className="w-5 h-5" />
                  </Button>
                   <Button variant="outline" size="icon" onClick={shareOnLinkedIn} aria-label="Share on LinkedIn">
                    <Linkedin className="w-5 h-5" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
