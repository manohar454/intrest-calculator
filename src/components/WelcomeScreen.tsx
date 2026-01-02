import { useState, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator, TrendingUp, User } from "lucide-react";

interface WelcomeScreenProps {
  onEnter: (userName: string) => void;
}

export const WelcomeScreen = forwardRef<HTMLDivElement, WelcomeScreenProps>(({ onEnter }, ref) => {
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim().length < 2) {
      setError("Please enter a valid name (at least 2 characters)");
      return;
    }
    onEnter(userName.trim());
  };

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/30">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary shadow-elegant mb-6">
            <TrendingUp className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
            Interest Calculator
          </h1>
          <p className="text-muted-foreground">
            Promissory Note & Rural Loan Method
          </p>
        </div>

        {/* Features */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-gold-dark" />
            </div>
            <p className="text-xs text-muted-foreground">Interest<br />Calculator</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Basic<br />Calculator</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="userName" className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Enter Your Name
              </label>
              <Input
                id="userName"
                type="text"
                placeholder="Your name"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  setError("");
                }}
                className="h-12 text-base"
                autoFocus
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg">
              Enter Application
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Banking Method: 1 Month = 30 Days
          </p>
        </div>
      </div>
    </div>
  );
});

WelcomeScreen.displayName = "WelcomeScreen";
