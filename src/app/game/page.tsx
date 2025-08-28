"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Leaf, Recycle, Trash2, Dna, Bot, ChevronsRight, XCircle, CheckCircle, RefreshCw, Trophy, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

type BinType = "recycling" | "compost" | "waste";

interface WasteItem {
  name: string;
  type: BinType;
  emoji: string;
  fact: string;
}

const wasteItems: WasteItem[] = [
  { name: "Apple Core", type: "compost", emoji: "🍎", fact: "Apple cores can be composted to create nutrient-rich soil." },
  { name: "Plastic Bottle", type: "recycling", emoji: "🍾", fact: "Recycling one plastic bottle can save enough energy to power a 60W bulb for 6 hours." },
  { name: "Styrofoam Cup", type: "waste", emoji: "🥤", fact: "Styrofoam is not typically recyclable and can take 500 years to decompose." },
  { name: "Newspaper", type: "recycling", emoji: "📰", fact: "Recycling a 3-foot stack of newspapers saves one tree." },
  { name: "Banana Peel", type: "compost", emoji: "🍌", fact: "Banana peels are great for compost as they add potassium and other nutrients." },
  { name: "Glass Jar", type: "recycling", emoji: "🫙", fact: "Glass is 100% recyclable and can be recycled endlessly without loss in quality." },
  { name: "Pizza Box", type: "compost", emoji: "🍕", fact: "Greasy pizza boxes shouldn't be recycled but can be composted (if torn into small pieces)." },
  { name: "Used Lightbulb", type: "waste", emoji: "💡", fact: "Most lightbulbs contain materials that make them unsuitable for standard recycling." },
  { name: "Aluminum Can", type: "recycling", emoji: "🥫", fact: "Recycling an aluminum can saves 95% of the energy needed to make a new one." },
  { name: "Coffee Grounds", type: "compost", emoji: "☕", fact: "Coffee grounds are nitrogen-rich, making them an excellent addition to compost piles." },
  { name: "Plastic Bag", type: "waste", emoji: "🛍️", fact: "Plastic bags often jam recycling machinery, so they belong in the trash unless returned to a special drop-off." },
  { name: "Cardboard Box", type: "recycling", emoji: "📦", fact: "Recycling 1 ton of cardboard saves 17 trees, 7,000 gallons of water, and 463 gallons of oil." },
];

const GAME_DURATION = 30; // seconds

export default function GamePage() {
  const [gameState, setGameState] = useState<"start" | "playing" | "over">("start");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  const shuffledItems = useMemo(() => [...wasteItems].sort(() => Math.random() - 0.5), []);
  const currentItem = shuffledItems[currentItemIndex];

  useEffect(() => {
    if (gameState !== "playing") return;

    if (timeLeft === 0) {
      setGameState("over");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setCurrentItemIndex(0);
    setGameState("playing");
    setFeedback(null);
  };

  const handleSort = (bin: BinType) => {
    if (gameState !== "playing") return;

    if (currentItem.type === bin) {
      setScore((prev) => prev + 1);
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentItemIndex < shuffledItems.length - 1) {
        setCurrentItemIndex((prev) => prev + 1);
      } else {
        setGameState("over");
      }
    }, 500);
  };

  const renderStartScreen = () => (
    <Card className="text-center shadow-2xl">
      <CardHeader>
        <CardTitle className="text-3xl font-headline">Waste Sorting Challenge!</CardTitle>
        <CardDescription className="text-lg">Can you sort the items into the correct bins before time runs out?</CardDescription>
      </CardHeader>
      <CardContent>
        <p>You'll have {GAME_DURATION} seconds to sort as many items as you can. Good luck!</p>
      </CardContent>
      <CardFooter>
        <Button size="lg" className="w-full text-lg" onClick={startGame}>Start Game</Button>
      </CardFooter>
    </Card>
  );

  const renderGameOverScreen = () => (
    <Card className="text-center shadow-2xl">
      <CardHeader>
        <Trophy className="w-12 h-12 mx-auto text-primary mb-2" />
        <CardTitle className="text-3xl font-headline">Game Over!</CardTitle>
        <CardDescription className="text-lg">You sorted {score} items correctly.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-bold">Keep practicing to improve your score and become a sorting champion!</p>
      </CardContent>
      <CardFooter>
        <Button size="lg" className="w-full text-lg" onClick={startGame}>
          <RefreshCw className="mr-2" />
          Play Again
        </Button>
      </CardFooter>
    </Card>
  );

  const renderGameScreen = () => (
    <div className="space-y-6">
        <Card className="relative text-center shadow-lg min-h-[150px] flex flex-col justify-center items-center overflow-hidden">
            <div className={cn("absolute inset-0 transition-colors duration-300", 
                feedback === 'correct' && 'bg-green-500/20', 
                feedback === 'incorrect' && 'bg-red-500/20'
            )} />
            <CardContent className="pt-6">
                <p className="text-6xl mb-2">{currentItem.emoji}</p>
                <p className="text-2xl font-bold">{currentItem.name}</p>
            </CardContent>
            {feedback && (
                <div className="absolute top-2 right-2 p-2 rounded-full bg-background">
                    {feedback === 'correct' ? <CheckCircle className="w-8 h-8 text-green-500" /> : <XCircle className="w-8 h-8 text-red-500" />}
                </div>
            )}
        </Card>
        
        <div className="grid grid-cols-3 gap-4">
            <Button onClick={() => handleSort("recycling")} variant="outline" className="h-24 text-lg flex-col gap-2 border-2 border-blue-500 hover:bg-blue-500/10">
                <Recycle className="w-8 h-8 text-blue-500" />
                Recycling
            </Button>
            <Button onClick={() => handleSort("compost")} variant="outline" className="h-24 text-lg flex-col gap-2 border-2 border-green-700 hover:bg-green-700/10">
                <Dna className="w-8 h-8 text-green-700" />
                Compost
            </Button>
            <Button onClick={() => handleSort("waste")} variant="outline" className="h-24 text-lg flex-col gap-2 border-2 border-gray-600 hover:bg-gray-600/10">
                <Trash2 className="w-8 h-8 text-gray-600" />
                Waste
            </Button>
        </div>

        <div className="pt-4">
            <div className="flex justify-between items-center mb-2 text-primary font-bold">
                <div className="flex items-center gap-2"><Trophy className="w-5 h-5"/> Score: {score}</div>
                <div className="flex items-center gap-2"><Clock className="w-5 h-5"/> Time: {timeLeft}s</div>
            </div>
            <Progress value={(timeLeft / GAME_DURATION) * 100} className="h-4" />
        </div>
    </div>
  );

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
            <Link href="/education" className="text-primary hover:underline">Learn</Link>
            <Link href="/greenify" className="text-primary hover:underline">Greenify</Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow py-12 md:py-16 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-lg">
          {gameState === "start" && renderStartScreen()}
          {gameState === "playing" && renderGameScreen()}
          {gameState === "over" && renderGameOverScreen()}
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
