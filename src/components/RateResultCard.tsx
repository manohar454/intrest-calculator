import { Card, CardContent } from "@/components/ui/card";
import { RateResult, formatCurrency } from "@/lib/interestCalculations";

interface Props {
  result: RateResult;
  principal: number;
}

export function RateResultCard({ result, principal }: Props) {
  const siAnnual = result.simpleRate * 12;
  const ciAnnual = result.compoundRate * 12;

  return (
    <Card className="border-gold/30 bg-gold/5">
      <CardContent className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Principal</p>
            <p className="font-semibold">{formatCurrency(principal)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Interest Paid</p>
            <p className="font-semibold">{formatCurrency(result.interest)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Amount</p>
            <p className="font-semibold">{formatCurrency(result.totalAmount)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Duration</p>
            <p className="font-semibold">
              {result.days} days ({result.months.toFixed(2)} months)
            </p>
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="rounded-md bg-muted/40 p-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">Simple Interest Rate</span>
            <span className="text-lg font-bold text-primary">
              ₹{result.simpleRate.toFixed(4)} / ₹100 / month
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            ≈ {siAnnual.toFixed(2)}% per year (simple)
          </p>
        </div>

        <div className="rounded-md bg-gold/10 border border-gold/20 p-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">Compound Interest Rate</span>
            <span className="text-lg font-bold text-gold-dark">
              ₹{result.compoundRate.toFixed(4)} / ₹100 / month
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            ≈ {ciAnnual.toFixed(2)}% per year (monthly compounded)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}