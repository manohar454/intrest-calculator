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
    <div ref={ref} className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50 no-print">
        <div className="container mx-auto px-3 py-3 flex items-center justify-between gap-2 sm:px-4 sm:py-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 shrink-0 rounded-lg gradient-primary flex items-center justify-center sm:w-10 sm:h-10">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate font-serif font-bold text-base sm:text-lg">Interest Calculator</h1>
              <p className="text-xs text-muted-foreground">PN Loan Method</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
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
      <div className="container mx-auto px-3 py-4 no-print sm:px-4">
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            onClick={() => setActiveTab("interest")}
            variant={activeTab === "interest" ? "default" : "outline"}
            className="gap-2 text-sm"
          >
            <TrendingUp className="w-4 h-4" />
            Interest Calculator
          </Button>
          <Button
            onClick={() => setActiveTab("calculator")}
            variant={activeTab === "calculator" ? "default" : "outline"}
            className="gap-2 text-sm"
          >
            <Calculator className="w-4 h-4" />
            Calculator
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-3 py-6 flex justify-center sm:px-4">
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
