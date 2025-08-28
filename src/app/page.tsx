import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Award, Users, TreePine } from 'lucide-react';
import Image from 'next/image';
import { EcoBot } from '@/components/EcoBot';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white">
        <Image
          src="https://picsum.photos/1600/900"
          alt="Lush green forest"
          fill
          className="object-cover"
          data-ai-hint="forest canopy"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-4">
          <div className="flex justify-center items-center gap-4 mb-4">
            <Leaf className="w-16 h-16 text-primary" />
            <h1 className="text-5xl md:text-7xl font-bold font-headline text-white">
              EcoPledger
            </h1>
          </div>
          <p className="text-lg md:text-2xl mt-4 max-w-3xl mx-auto">
            Discover your environmental impact and commit to a greener future.
          </p>
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
            <Card className="text-center shadow-lg">
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
            <Card className="text-center shadow-lg">
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
            <Card className="text-center shadow-lg">
              <CardHeader>
                <div className="p-4 bg-accent/20 rounded-full w-fit mx-auto mb-4">
                  <Users className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle>Join the Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p>See the collective impact of all pledges on our community map and feel the power of shared goals.</p>
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
              <Link href="/community">View Community Impact</Link>
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
