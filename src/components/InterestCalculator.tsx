import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, IndianRupee, Percent, User, Calculator, Clock, Search } from "lucide-react";
import {
  parseDate,
  calculateInterest,
  calculateInterestByDuration,
  calculateDays,
  calculateRate,
  formatCurrency,
  InterestResult,
  RateResult,
  formatDate
} from "@/lib/interestCalculations";
import { InterestStatement } from "./InterestStatement";
import { RateResultCard } from "./RateResultCard";
import { toast } from "@/hooks/use-toast";

interface InterestCalculatorProps {
  userName: string;
}

type CalcMode = "dates" | "duration" | "rate";

export function InterestCalculator({ userName }: InterestCalculatorProps) {
  const [mode, setMode] = useState<CalcMode>("dates");

  const [borrowerName, setBorrowerName] = useState("");
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");

  // Date range mode
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Duration mode
  const [years, setYears] = useState("");
  const [months, setMonths] = useState("");
  const [days, setDays] = useState("");

  // Find-rate mode
  const [rateSubMode, setRateSubMode] = useState<"dates" | "duration">("duration");
  const [interestPaid, setInterestPaid] = useState("");
  const [rateResult, setRateResult] = useState<RateResult | null>(null);

  const [result, setResult] = useState<InterestResult | null>(null);
  const [showStatement, setShowStatement] = useState(false);

  const handleCalculate = () => {
    if (mode !== "rate" && !borrowerName.trim()) {
      toast({ title: "Error", description: "Please enter borrower name", variant: "destructive" });
      return;
    }

    const principalNum = parseFloat(principal);
    if (isNaN(principalNum) || principalNum <= 0) {
      toast({ title: "Error", description: "Please enter a valid principal amount", variant: "destructive" });
      return;
    }

    if (mode !== "rate") {
      const rateNum = parseFloat(rate);
      if (isNaN(rateNum) || rateNum <= 0) {
        toast({ title: "Error", description: "Please enter a valid interest rate", variant: "destructive" });
        return;
      }
    }
    const rateNum = parseFloat(rate);

    let calculationResult: InterestResult;

    if (mode === "dates") {
      const start = parseDate(startDate);
      if (!start) {
        toast({ title: "Error", description: "Please enter a valid start date (DD/MM/YYYY)", variant: "destructive" });
        return;
      }

      const end = parseDate(endDate);
      if (!end) {
        toast({ title: "Error", description: "Please enter a valid end date (DD/MM/YYYY)", variant: "destructive" });
        return;
      }

      if (end <= start) {
        toast({ title: "Error", description: "End date must be after start date", variant: "destructive" });
        return;
      }

      calculationResult = calculateInterest(principalNum, rateNum, start, end);
    } else if (mode === "duration") {
      const yearsNum = parseFloat(years) || 0;
      const monthsNum = parseFloat(months) || 0;
      const daysNum = parseFloat(days) || 0;

      if (yearsNum < 0 || monthsNum < 0 || daysNum < 0) {
        toast({ title: "Error", description: "Years, months and days cannot be negative", variant: "destructive" });
        return;
      }

      if (yearsNum === 0 && monthsNum === 0 && daysNum === 0) {
        toast({ title: "Error", description: "Please enter a valid duration", variant: "destructive" });
        return;
      }

      calculationResult = calculateInterestByDuration(principalNum, rateNum, yearsNum, monthsNum, daysNum);
    } else {
      // Find-rate mode
      const interestNum = parseFloat(interestPaid);
      if (isNaN(interestNum) || interestNum <= 0) {
        toast({ title: "Error", description: "Please enter the interest paid (₹)", variant: "destructive" });
        return;
      }

      let totalDays = 0;
      if (rateSubMode === "dates") {
        const start = parseDate(startDate);
        const end = parseDate(endDate);
        if (!start || !end) {
          toast({ title: "Error", description: "Enter valid start and end dates (DD/MM/YYYY)", variant: "destructive" });
          return;
        }
        if (end <= start) {
          toast({ title: "Error", description: "End date must be after start date", variant: "destructive" });
          return;
        }
        totalDays = calculateDays(start, end);
      } else {
        const y = parseFloat(years) || 0;
        const m = parseFloat(months) || 0;
        const d = parseFloat(days) || 0;
        if (y < 0 || m < 0 || d < 0) {
          toast({ title: "Error", description: "Duration cannot be negative", variant: "destructive" });
          return;
        }
        if (y === 0 && m === 0 && d === 0) {
          toast({ title: "Error", description: "Please enter a valid duration", variant: "destructive" });
          return;
        }
        totalDays = y * 360 + m * 30 + d;
      }

      const rr = calculateRate(principalNum, interestNum, totalDays);
      setRateResult(rr);
      toast({
        title: "Rate Calculated",
        description: `SI rate ≈ ₹${rr.simpleRate.toFixed(4)} per ₹100 per month`,
      });
      return;
    }

    setResult(calculationResult);
    setShowStatement(true);

    toast({
      title: "Calculation Complete",
      description: `Interest calculated for ${calculationResult.months.toFixed(2)} months`
    });
  };

  const handleClear = () => {
    setBorrowerName("");
    setPrincipal("");
    setRate("");
    setStartDate("");
    setEndDate("");
    setYears("");
    setMonths("");
    setDays("");
    setInterestPaid("");
    setRateResult(null);
    setResult(null);
    setShowStatement(false);
  };

  if (showStatement && result) {
    return (
      <InterestStatement
        userName={userName}
        borrowerName={borrowerName}
        principal={parseFloat(principal)}
        rate={parseFloat(rate)}
        startDate={mode === "dates" ? startDate : undefined}
        endDate={mode === "dates" ? endDate : undefined}
        durationYears={mode === "duration" ? (parseFloat(years) || 0) : undefined}
        durationMonths={mode === "duration" ? (parseFloat(months) || 0) : undefined}
        durationDays={mode === "duration" ? (parseFloat(days) || 0) : undefined}
        result={result}
        onBack={() => setShowStatement(false)}
        onNewCalculation={handleClear}
      />
    );
  }

  return (
    <Card className="w-full max-w-lg shadow-card animate-slide-up">
      <CardHeader className="text-center pb-2">
        <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
          <Calculator className="w-7 h-7 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl font-serif">Interest Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Mode Toggle */}
        <div className="flex rounded-lg bg-muted p-1 gap-1 flex-wrap">
          <button
            type="button"
            onClick={() => { setMode("dates"); setRateResult(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              mode === "dates"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Date Range
          </button>
          <button
            type="button"
            onClick={() => { setMode("duration"); setRateResult(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              mode === "duration"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="w-4 h-4" />
            Duration
          </button>
          <button
            type="button"
            onClick={() => { setMode("rate"); setRateResult(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              mode === "rate"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Search className="w-4 h-4" />
            Find Rate
          </button>
        </div>

        {/* Borrower Name (not needed for Find Rate) */}
        {mode !== "rate" && (
        <div className="space-y-2">
          <Label htmlFor="borrowerName" className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            Borrower Name
          </Label>
          <Input
            id="borrowerName"
            placeholder="Enter borrower name"
            value={borrowerName}
            onChange={(e) => setBorrowerName(e.target.value)}
          />
        </div>
        )}

        {/* Principal Amount */}
        <div className="space-y-2">
          <Label htmlFor="principal" className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-muted-foreground" />
            Principal Amount (₹)
          </Label>
          <Input
            id="principal"
            type="number"
            placeholder="e.g., 100000"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </div>

        {/* Interest Rate (hidden in Find Rate mode) */}
        {mode !== "rate" && (
        <div className="space-y-2">
          <Label htmlFor="rate" className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-muted-foreground" />
            Interest Rate (₹ per 100 per month)
          </Label>
          <Input
            id="rate"
            type="number"
            step="0.01"
            placeholder="e.g., 1.5"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
        )}

        {/* Interest Paid (only in Find Rate mode) */}
        {mode === "rate" && (
          <div className="space-y-2">
            <Label htmlFor="interestPaid" className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-muted-foreground" />
              Interest Paid (₹)
            </Label>
            <Input
              id="interestPaid"
              type="number"
              placeholder="e.g., 24000"
              value={interestPaid}
              onChange={(e) => setInterestPaid(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter the total interest amount paid (not including principal).
            </p>
          </div>
        )}

        {/* Find Rate sub-mode toggle */}
        {mode === "rate" && (
          <div className="flex rounded-lg bg-muted p-1 gap-1">
            <button
              type="button"
              onClick={() => setRateSubMode("duration")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                rateSubMode === "duration"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Duration
            </button>
            <button
              type="button"
              onClick={() => setRateSubMode("dates")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                rateSubMode === "dates"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Date Range
            </button>
          </div>
        )}

        {/* Date Range */}
        {(mode === "dates" || (mode === "rate" && rateSubMode === "dates")) && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                Start Date
              </Label>
              <Input
                id="startDate"
                placeholder="DD/MM/YYYY"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                End Date
              </Label>
              <Input
                id="endDate"
                placeholder="DD/MM/YYYY"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Duration */}
        {(mode === "duration" || (mode === "rate" && rateSubMode === "duration")) && (
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="years" className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Years
              </Label>
              <Input
                id="years"
                type="number"
                min="0"
                placeholder="e.g., 6"
                value={years}
                onChange={(e) => setYears(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="months" className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Months
              </Label>
              <Input
                id="months"
                type="number"
                min="0"
                placeholder="e.g., 0"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="days" className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Days
              </Label>
              <Input
                id="days"
                type="number"
                min="0"
                placeholder="e.g., 0"
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Rate Result */}
        {mode === "rate" && rateResult && (
          <RateResultCard result={rateResult} principal={parseFloat(principal) || 0} />
        )}

        {/* Info Box */}
        <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Banking / PN Loan Method</p>
          <p>1 Month = 30 Days | Interest calculated monthly</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <Button onClick={handleClear} variant="outline" className="flex-1">
            Clear
          </Button>
          <Button onClick={handleCalculate} variant="gold" className="flex-1">
            {mode === "rate" ? "Find Rate" : "Calculate Interest"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
