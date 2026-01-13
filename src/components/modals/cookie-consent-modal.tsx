"use client";

import * as React from "react";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

// Per instructions, creating a text-based placeholder for the logo
// as no SVG asset was provided and writing custom SVG is disallowed.
const IdealoLogo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("text-3xl font-bold text-brand-blue tracking-tight", className)}>
      ideal<span className="text-accent-orange">o</span>
    </div>
  );
};

export default function CookieConsentModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show modal after client-side hydration to prevent SSR issues.
    // In a real app, this would check for a consent cookie first.
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500); 
    
    return () => clearTimeout(timer);
  }, []);

  const handleConsent = (consent: 'accepted' | 'declined') => {
    // In a real app, set a cookie to remember the user's choice.
    // e.g., document.cookie = `cookie_consent=${consent}; path=/; max-age=31536000`;
    setIsOpen(false);
  };

  // Prevents rendering on the server and avoids hydration errors.
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="max-w-[640px] w-[calc(100%-2rem)] p-8 rounded-lg shadow-xl bg-background sm:rounded-lg [&>button.absolute]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={() => handleConsent('declined')}
      >
        <div className="flex flex-col space-y-6">
          <IdealoLogo />
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-3">
              Einwilligung zum Einsatz von Cookies 🍪
            </h2>
            <p className="text-sm text-text-secondary leading-[1.6]">
              Deine Einwilligung vorausgesetzt, setzen wir (die idealo internet GmbH), Cookies und ähnliche Technologien ein, die erfassen, wer du bist und wie du unsere Dienste nutzt, und um personalisierte Werbung (auch auf Webseiten Dritter) anzuzeigen.
            </p>
          </div>
          <div className="text-sm space-y-2">
            <a href="#" className="block font-semibold text-brand-blue-light hover:underline">
              Details und rechtliche Grundlagen
            </a>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <a href="#" className="text-brand-blue-light hover:underline">Datenschutzerklärung</a>
              <a href="#" className="text-brand-blue-light hover:underline">Impressum/AGB</a>
              <a href="#" className="text-brand-blue-light hover:underline">Einstellungen</a>
            </div>
          </div>
          <div className="flex justify-end items-center space-x-3 pt-2">
            <Button
              variant="outline"
              onClick={() => handleConsent('declined')}
              className="font-semibold px-8 py-2 h-auto rounded-md border-brand-blue-light text-brand-blue-light hover:bg-brand-blue-light/10 hover:text-brand-blue-light"
            >
              Ablehnen
            </Button>
            <Button
              onClick={() => handleConsent('accepted')}
              className="font-semibold px-8 py-2 h-auto rounded-md bg-brand-blue-light hover:bg-brand-blue-light/90 text-primary-foreground"
            >
              Annehmen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}