import { useState, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { InterestCalculator } from "./InterestCalculator";
import { BasicCalculator } from "./BasicCalculator";
import { Calculator, TrendingUp, LogOut, User } from "lucide-react";

interface MainAppProps {
  userName: string;
  onLogout: () => void;
}

type TabType = "interest" | "calculator";

export const MainApp = forwardRef<HTMLDivElement, MainAppProps>(({ userName, onLogout }, ref) => {
  const [activeTab, setActiveTab] = useState<TabType>("interest");

  return (
    <div ref={ref} className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50 no-print">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg">Interest Calculator</h1>
              <p className="text-xs text-muted-foreground">PN Loan Method</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{userName}</span>
            </div>
            <Button onClick={onLogout} variant="ghost" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Exit</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="container mx-auto px-4 py-4 no-print">
        <div className="flex justify-center gap-2">
          <Button
            onClick={() => setActiveTab("interest")}
            variant={activeTab === "interest" ? "default" : "outline"}
            className="gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Interest Calculator
          </Button>
          <Button
            onClick={() => setActiveTab("calculator")}
            variant={activeTab === "calculator" ? "default" : "outline"}
            className="gap-2"
          >
            <Calculator className="w-4 h-4" />
            Calculator
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 flex justify-center">
        {activeTab === "interest" ? (
          <InterestCalculator userName={userName} />
        ) : (
          <BasicCalculator />
        )}
      </main>

    </div>
  );
});

MainApp.displayName = "MainApp";
