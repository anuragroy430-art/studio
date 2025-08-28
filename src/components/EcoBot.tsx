"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Bot, X, Send, Loader2, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { handleEcoBotQuery } from "@/app/actions";
import type { EcoBotInput } from "@/ai/schemas";

type Message = {
  role: "user" | "model";
  content: string;
};

export function EcoBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    startTransition(async () => {
      const data: EcoBotInput = {
        message: input,
        history: messages,
      };
      const result = await handleEcoBotQuery(data);
      setMessages([...newMessages, { role: "model", content: result.response }]);
    });
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        // A bit of a hack to scroll to the bottom of the scroll area after a new message is added.
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100);
    }
  }, [messages]);


  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="icon"
          className="rounded-full w-16 h-16 shadow-lg bg-primary hover:bg-primary/90"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-8 h-8" /> : <Bot className="w-8 h-8" />}
          <span className="sr-only">Toggle EcoBot</span>
        </Button>
      </div>

      <div className={cn("fixed bottom-24 right-6 z-50 transition-all duration-300 ease-in-out", 
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none")}>
        <Card className="w-[350px] shadow-2xl">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4 border-b">
            <Sparkles className="w-6 h-6 text-primary" />
            <CardTitle className="font-headline">Eco-Bot</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96 w-full" ref={scrollAreaRef}>
              <div className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-full"><Bot className="w-6 h-6 text-primary" /></div>
                    <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                        <p className="text-sm">Hi there! I'm Eco-Bot. Ask me anything about sustainability or environmental impact.</p>
                    </div>
                </div>
                {messages.map((m, i) => (
                  <div key={i} className={cn("flex items-start gap-3", m.role === 'user' && 'justify-end')}>
                    {m.role === 'model' && <div className="p-2 bg-primary/10 rounded-full"><Bot className="w-6 h-6 text-primary" /></div>}
                    <div className={cn("p-3 rounded-lg max-w-[80%]", m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                      <p className="text-sm">{m.content}</p>
                    </div>
                    {m.role === 'user' && <div className="p-2 bg-accent/20 rounded-full"><User className="w-6 h-6 text-accent-foreground" /></div>}
                  </div>
                ))}
                 {isPending && (
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-full"><Bot className="w-6 h-6 text-primary" /></div>
                        <div className="bg-muted p-3 rounded-lg max-w-[80%] flex items-center">
                           <Loader2 className="w-5 h-5 text-primary animate-spin" />
                           <span className="sr-only">Thinking...</span>
                        </div>
                    </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={isPending}
              />
              <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
