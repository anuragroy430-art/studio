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
  Trash2,
  Droplets,
  Plane,
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
import Link from "next/link";

const formSchema = z.object({
  commute: z.string({ required_error: "Please select your primary commute." }).min(1, "Please select your primary commute."),
  diet: z.string({ required_error: "Please select your diet." }).min(1, "Please select your diet."),
  shopping: z.string({ required_error: "Please select your shopping habits." }).min(1, "Please select your shopping habits."),
  energyUse: z.string({ required_error: "Please select your energy use." }).min(1, "Please select your energy use."),
  wasteManagement: z.string({ required_error: "Please select your waste management habits." }).min(1, "Please select your waste management habits."),
  waterConsumption: z.string({ required_error: "Please select your water consumption habits." }).min(1, "Please select your water consumption habits."),
  travelHabits: z.string({ required_error: "Please select your travel habits." }).min(1, "Please select your travel habits."),
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
  {
    name: "wasteManagement",
    label: "How do you manage your household waste?",
    icon: Trash2,
    options: ["General Waste Only", "Recycle Sometimes", "Recycle Regularly", "Compost and Recycle"],
    placeholder: "Select your waste habits",
  },
  {
    name: "waterConsumption",
    label: "How conscious are you of your water usage?",
    icon: Droplets,
    options: ["Not Very", "Somewhat", "Very Conscious"],
    placeholder: "Select your water usage",
  },
  {
    name: "travelHabits",
    label: "How often do you fly per year?",
    icon: Plane,
    options: ["Never", "1-2 times", "3-5 times", "More than 5 times"],
    placeholder: "Select your travel frequency",
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
      wasteManagement: "",
      waterConsumption: "",
      travelHabits: "",
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
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="shadow-2xl border-2 border-primary/10">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-headline">Create Your Eco-Pledge</CardTitle>
                <CardDescription className="text-lg">
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
                            <FormLabel className="flex items-center gap-2 text-base font-semibold">
                              <q.icon className="w-5 h-5 text-primary" />
                              {q.label}
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="text-base">
                                  <SelectValue placeholder={q.placeholder} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {q.options.map((option) => (
                                  <SelectItem key={option} value={option} className="text-base">
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
                    <Button type="submit" disabled={isPending} size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-7">
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating Your Pledge...
                        </>
                      ) : (
                        "Generate My Pledge"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </div>
        </section>

        <div
          ref={resultsRef}
          className={cn(
            "transition-all duration-1000 ease-in-out",
            showPledge ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
          )}
        >
          {pledge && (
            <section className="py-16 md:py-24 bg-card">
              <div className="container mx-auto px-4 max-w-2xl">
                <Card className="shadow-lg border-2 border-primary/20 bg-background">
                  <CardHeader className="text-center">
                    <TreePine className="w-12 h-12 mx-auto text-primary mb-2" />
                    <CardTitle className="text-3xl font-headline text-primary">Your Personalized Eco-Pledge</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <blockquote className="text-center text-xl italic border-l-4 border-accent pl-4 py-2 bg-accent/10">
                      "{pledge.pledge}"
                    </blockquote>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                          <TreePine className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold font-headline text-lg text-primary">Your Impact</h3>
                          <p className="text-foreground/80">{pledge.impact}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                          <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold font-headline text-lg text-primary">Stay Motivated!</h3>
                          <p className="text-foreground/80">{pledge.motivation}</p>
                        </div>
                      </div>
                    </div>

                    {pledge.audio && (
                      <>
                        <audio ref={audioRef} src={pledge.audio} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={() => setIsPlaying(false)} preload="auto" />
                        <Button variant="outline" onClick={toggleAudio} className="w-full text-lg py-6">
                          {isPlaying ? <Pause className="mr-2" /> : <Volume2 className="mr-2" />}
                          {isPlaying ? "Pause" : "Listen to Your Pledge"}
                        </Button>
                      </>
                    )}
                  </CardContent>
                  <CardFooter className="flex-col gap-4 pt-6">
                    <p className="font-semibold text-primary">Share your pledge and inspire others!</p>
                    <div className="flex gap-4">
                      <Button variant="outline" size="icon" onClick={shareOnTwitter} aria-label="Share on Twitter">
                        <Twitter className="w-5 h-5 text-primary" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={shareOnLinkedIn} aria-label="Share on LinkedIn">
                        <Linkedin className="w-5 h-5 text-primary" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </section>
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
