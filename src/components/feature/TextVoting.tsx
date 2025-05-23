'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { SAMPLE_TEXTS_FOR_VOTING } from '@/config/constants';
import type { TextSnippet } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, MessageSquareQuote } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const TextVoting: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentSnippet, setCurrentSnippet] = useState<TextSnippet | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showThanks, setShowThanks] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (SAMPLE_TEXTS_FOR_VOTING.length > 0) {
      setCurrentSnippet(SAMPLE_TEXTS_FOR_VOTING[currentIndex]);
    } else {
      setMessage("No text snippets available for voting at the moment.");
    }
  }, [currentIndex]);

  const loadNextSnippet = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < SAMPLE_TEXTS_FOR_VOTING.length) {
      setCurrentIndex(nextIndex);
      setCurrentSnippet(SAMPLE_TEXTS_FOR_VOTING[nextIndex]);
      setMessage(null);
    } else {
      setCurrentSnippet(null);
      setMessage("You've voted on all available texts for now. Thank you for your contribution!");
    }
    setShowThanks(false);
  }, [currentIndex]);

  const handleVote = useCallback((vote: 'AI' | 'Human') => {
    if (!currentSnippet) return;

    console.log(`Voted on snippet ID ${currentSnippet.id}: ${vote}`);
    // In a real app, send this vote to a backend.
    // Example: await sendVoteToBackend(currentSnippet.id, vote);
    toast({
        title: "Vote Recorded!",
        description: `You voted '${vote}' for snippet ${currentIndex + 1}.`,
    });

    setShowThanks(true);
    setTimeout(() => {
      loadNextSnippet();
    }, 1500); // Show thanks message for 1.5 seconds
  }, [currentSnippet, loadNextSnippet, currentIndex, toast]);

  return (
    <section aria-labelledby="text-voting-heading" className="w-full p-6 bg-card rounded-lg shadow-xl">
      <h2 id="text-voting-heading" className="text-2xl font-semibold mb-6 text-center text-primary">
        Is this text AI or Human?
      </h2>

      {showThanks && (
        <div className="flex flex-col items-center justify-center h-48 text-center text-green-400">
          <CheckCircle className="w-16 h-16 mb-4" />
          <p className="text-xl font-semibold">Thank you for your vote!</p>
        </div>
      )}

      {!showThanks && currentSnippet && (
        <>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Snippet {currentIndex + 1} of {SAMPLE_TEXTS_FOR_VOTING.length}
          </p>
          <ScrollArea className="h-48 w-full rounded-md border border-border p-4 mb-6 bg-background/30">
            <p className="text-foreground whitespace-pre-wrap">{currentSnippet.text}</p>
          </ScrollArea>
          <div className="flex flex-col sm:flex-row justify-around gap-4">
            <Button
              onClick={() => handleVote('AI')}
              className="w-full sm:w-auto flex-1 bg-violet-600 hover:bg-violet-700 text-primary-foreground"
              aria-label="Vote text as AI Generated"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 8V4H8"/>
<rect width="16" height="12" x="4" y="8" rx="2"/>
<path d="M2 14h2"/>
<path d="M20 14h2"/>
<path d="M15 13v2"/>
<path d="M9 13v2"/></svg>
              AI Generated
            </Button>
            <Button
              onClick={() => handleVote('Human')}
              className="w-full sm:w-auto flex-1 bg-emerald-500 hover:bg-emerald-600 text-primary-foreground"
              aria-label="Vote text as Human Written"
            >
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"/>
<rect width="18" height="18" x="3" y="4" rx="2"/>
<circle cx="12" cy="10" r="2"/>
<line x1="12" y1="2" x2="12" y2="4"/>
<line x1="12" y1="14" x2="12" y2="22"/></svg>
              Human Written
            </Button>
          </div>
        </>
      )}

      {!showThanks && !currentSnippet && message && (
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <MessageSquareQuote className="w-12 h-12 mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">{message}</p>
        </div>
      )}

      {!showThanks && !currentSnippet && !message && SAMPLE_TEXTS_FOR_VOTING.length === 0 && (
         <div className="flex flex-col items-center justify-center h-48 text-center">
            <MessageSquareQuote className="w-12 h-12 mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No text snippets available for voting at the moment.</p>
        </div>
      )}
    </section>
  );
};

export default TextVoting;
