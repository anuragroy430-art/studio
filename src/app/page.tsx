import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Award, Users, TreePine, Target, Gauge, Gamepad2, BookOpen, Image as ImageIcon, Menu } from 'lucide-react';
import Image from 'next/image';
import { EcoBot } from '@/components/EcoBot';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-20 bg-card/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-6 lg:px-8 flex justify-between items-center py-4">
          <Link href="/" className="inline-block">
            <div className="flex items-center gap-3">
              <Leaf className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold font-headline text-primary">
                EcoPledger
              </h1>
            </div>
          </Link>
          <nav className="hidden md:flex gap-4 items-center">
            <Link href="/pledge" className="text-primary font-medium hover:underline">Take the Pledge</Link>
            <Link href="/challenges" className="text-primary font-medium hover:underline">Challenges</Link>
            <Link href="/dashboard" className="text-primary font-medium hover:underline">Dashboard</Link>
            <Link href="/community" className="text-primary font-medium hover:underline">Community</Link>
            <Link href="/game" className="text-primary font-medium hover:underline">Waste Sorting Game</Link>
            <Link href="/education" className="text-primary font-medium hover:underline">Learn</Link>
            <Link href="/greenify" className="text-primary font-medium hover:underline">Greenify</Link>
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
                    <Link href="/community" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted">
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

      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white pt-20">
        <Image
          src="https://picsum.photos/seed/nature/1600/900"
          alt="Lush green nature"
          fill
          className="object-cover"
          data-ai-hint="lush forest"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-4">
          <div className="flex justify-center items-center gap-4 flex-col">
            <div className="flex items-center gap-4">
              <Leaf className="w-16 h-16 text-primary" />
              <h1 className="text-5xl md:text-7xl font-bold font-headline text-white">
                EcoPledger
              </h1>
            </div>
            <p className="text-lg md:text-2xl mt-4 max-w-3xl mx-auto">
              Discover your environmental impact and commit to a greener future.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-7 px-10">
              <Link href="/pledge">Take the Test</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="text-lg py-7 px-10">
              <Link href="/community">View Community Impact</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <TreePine className="w-12 h-12 mx-auto text-primary mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
            Small Changes, Big Impact
          </h2>
          <p className="text-lg text-foreground/80">
            EcoPledger helps you understand how your daily choices affect the planet. Our AI-powered tool analyzes your lifestyle and creates a personalized eco-pledge with actionable steps you can take to reduce your footprint.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center shadow-lg col-span-1">
              <CardHeader>
                <div className="p-4 bg-accent/20 rounded-full w-fit mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle>Answer Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Take a quick quiz about your daily habits in key areas like commute, diet, and energy use.</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg col-span-1">
              <CardHeader>
                <div className="p-4 bg-accent/20 rounded-full w-fit mx-auto mb-4">
                  <Award className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle>Get Your Pledge</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Our AI generates a unique, personalized pledge with measurable goals and motivational tips.</p>
              </CardContent>
            </Card>
             <Card className="text-center shadow-lg col-span-1">
              <CardHeader>
                <div className="p-4 bg-accent/20 rounded-full w-fit mx-auto mb-4">
                  <Target className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle>Take a Challenge</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Receive daily or weekly challenges tailored to your pledge to help you build sustainable habits.</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg col-span-1">
              <CardHeader>
                <div className="p-4 bg-accent/20 rounded-full w-fit mx-auto mb-4">
                  <Gauge className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle>Track Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Use your personal dashboard to log your activities, track your impact, and earn badges for your commitment.</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg col-span-1">
              <CardHeader>
                <div className="p-4 bg-accent/20 rounded-full w-fit mx-auto mb-4">
                  <Users className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle>Join the Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p>See the collective impact of pledges from around the world on our community map.</p>
              </CardContent>
            </Card>
             <Card className="text-center shadow-lg col-span-1">
              <CardHeader>
                <div className="p-4 bg-accent/20 rounded-full w-fit mx-auto mb-4">
                  <ImageIcon className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle>Greenify an Image</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Upload a photo and let our AI show you how to make it more eco-friendly, from gardens to gadgets.</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg col-span-1">
              <CardHeader>
                <div className="p-4 bg-accent/20 rounded-full w-fit mx-auto mb-4">
                  <Gamepad2 className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle>Play a Game</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Have fun while learning about sustainability with our interactive waste sorting mini-game.</p>
              </CardContent>
            </Card>
             <Card className="text-center shadow-lg col-span-1 md:col-start-2">
              <CardHeader>
                <div className="p-4 bg-accent/20 rounded-full w-fit mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle>Learn & Grow</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Explore our AI-powered Knowledge Hub to get articles and tips on any sustainability topic.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of others in making a positive impact on our planet. Your journey to a more sustainable lifestyle starts now.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-7 px-10">
              <Link href="/pledge">Take the Eco-Pledge Test</Link>
            </Button>
             <Button asChild size="lg" variant="secondary" className="text-lg py-7 px-10">
              <Link href="/dashboard">Go to Your Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-background text-center text-foreground/60">
        <p>&copy; {new Date().getFullYear()} EcoPledger. All rights reserved.</p>
      </footer>

      <EcoBot />
    </div>
  );
}
