import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Printer, RotateCcw } from "lucide-react";
import { formatCurrency, InterestResult } from "@/lib/interestCalculations";

interface InterestStatementProps {
  userName: string;
  borrowerName: string;
  principal: number;
  rate: number;
  startDate?: string;
  endDate?: string;
  durationYears?: number;
  durationMonths?: number;
  durationDays?: number;
  result: InterestResult;
  onBack: () => void;
  onNewCalculation: () => void;
}

export function InterestStatement({
  userName,
  borrowerName,
  principal,
  rate,
  startDate,
  endDate,
  durationYears,
  durationMonths,
  durationDays,
  result,
  onBack,
  onNewCalculation,
}: InterestStatementProps) {
  const handlePrint = () => {
    window.print();
  };

  const isDurationMode =
    durationYears !== undefined || durationMonths !== undefined || durationDays !== undefined;

  return (
    <div className="w-full max-w-2xl animate-scale-in">
      {/* Action Buttons */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 no-print">
        <Button onClick={onBack} variant="ghost" size="sm" className="px-2">
          <ArrowLeft className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Back to Calculator</span>
          <span className="sm:hidden ml-1">Back</span>
        </Button>
        <div className="flex flex-1 justify-end gap-2">
          <Button onClick={handlePrint} variant="outline" size="sm" className="px-2 sm:px-3">
            <Printer className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Print Statement</span>
            <span className="sm:hidden ml-1">Print</span>
          </Button>
          <Button onClick={onNewCalculation} variant="gold" size="sm" className="px-2 sm:px-3">
            <RotateCcw className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">New Calculation</span>
            <span className="sm:hidden ml-1">New</span>
          </Button>
        </div>
      </div>

      {/* Statement Card */}
      <Card className="shadow-card print-statement overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="gradient-primary text-primary-foreground px-4 py-5 text-center sm:px-6 sm:py-6">
            <h1 className="mb-1 font-serif text-xl font-bold sm:text-2xl">INTEREST STATEMENT</h1>
          </div>

          {/* Content */}
          <div className="p-4 space-y-5 sm:p-6 sm:space-y-6">
            {/* Borrower Info */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Borrower Name</p>
                <p className="break-words font-semibold text-base sm:text-lg">{borrowerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Principal Amount</p>
                <p className="break-words font-semibold text-base sm:text-lg">{formatCurrency(principal)}</p>
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Rate and Method */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Interest Rate</p>
                <p className="break-words font-semibold text-sm sm:text-base">₹{rate} per ₹100 per month</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Interest Method</p>
                <p className="break-words font-semibold text-sm sm:text-base">Banking / PN Loan Method</p>
                <p className="text-xs text-muted-foreground">(1 Month = 30 Days)</p>
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Loan Period */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Loan Period</p>
              <div className={`grid gap-3 sm:gap-4 ${isDurationMode ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
                {!isDurationMode && (
                  <>
                    <div>
                      <p className="text-xs text-muted-foreground">Start Date</p>
                      <p className="font-medium">{startDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">End Date</p>
                      <p className="font-medium">{endDate}</p>
                    </div>
                  </>
                )}
                {isDurationMode && (
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-medium">
                      {durationYears ? `${durationYears} Year${durationYears !== 1 ? 's' : ''}` : ''}
                      {durationYears && durationMonths ? ' ' : ''}
                      {durationMonths ? `${durationMonths} Month${durationMonths !== 1 ? 's' : ''}` : ''}
                      {(durationYears || durationMonths) && durationDays ? ' ' : ''}
                      {durationDays ? `${durationDays} Day${durationDays !== 1 ? 's' : ''}` : ''}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Total Days</p>
                  <p className="font-medium">{result.days} Days</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Time Period</p>
                  <p className="font-medium">{result.months.toFixed(2)} Months</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Interest Calculation Results */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">Interest Calculation</p>
              
              {/* Simple Interest */}
              <div className="bg-muted/30 rounded-lg p-3 mb-3 sm:p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-1">
                  <span className="font-medium">Simple Interest</span>
                  <span className="text-lg font-bold text-primary sm:text-xl">{formatCurrency(result.simpleInterest)}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1 text-xs sm:text-sm">
                  <span className="text-muted-foreground">Total Amount (Principal + SI)</span>
                  <span className="font-semibold">{formatCurrency(result.totalAmountSI)}</span>
                </div>
              </div>

              {/* Compound Interest */}
              <div className="bg-gold/10 rounded-lg p-3 border border-gold/20 sm:p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-1">
                  <span className="font-medium">Compound Interest</span>
                  <span className="text-lg font-bold text-gold-dark sm:text-xl">{formatCurrency(result.compoundInterest)}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1 text-xs sm:text-sm">
                  <span className="text-muted-foreground">Total Amount (Principal + CI)</span>
                  <span className="font-semibold">{formatCurrency(result.totalAmountCI)}</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Footer */}
            <div className="flex justify-between items-center text-sm">
              <div>
                <p className="text-muted-foreground">Calculated By</p>
                <p className="font-semibold">{userName}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">Date</p>
                <p className="font-semibold">
                  {new Date().toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
