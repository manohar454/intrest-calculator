import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Delete } from "lucide-react";

export function BasicCalculator() {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [isNewNumber, setIsNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (isNewNumber) {
      setDisplay("0.");
      setIsNewNumber(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + " " + op + " ");
    setIsNewNumber(true);
  };

  const handleEquals = () => {
    try {
      const fullEquation = equation + display;
      // Safe evaluation using Function constructor
      const sanitized = fullEquation.replace(/[^0-9+\-*/.() ]/g, '');
      const result = Function('"use strict"; return (' + sanitized + ')')();
      
      if (isNaN(result) || !isFinite(result)) {
        setDisplay("Error");
      } else {
        setDisplay(parseFloat(result.toFixed(10)).toString());
      }
      setEquation("");
      setIsNewNumber(true);
    } catch {
      setDisplay("Error");
      setEquation("");
      setIsNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setEquation("");
    setIsNewNumber(true);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
      setIsNewNumber(true);
    }
  };

  const handlePercentage = () => {
    const num = parseFloat(display);
    setDisplay((num / 100).toString());
    setIsNewNumber(true);
  };

  const buttons = [
    { label: "C", action: handleClear, variant: "outline" as const },
    { label: "⌫", action: handleBackspace, variant: "outline" as const },
    { label: "%", action: handlePercentage, variant: "outline" as const },
    { label: "÷", action: () => handleOperator("/"), variant: "calculatorOperator" as const },
    { label: "7", action: () => handleNumber("7"), variant: "calculator" as const },
    { label: "8", action: () => handleNumber("8"), variant: "calculator" as const },
    { label: "9", action: () => handleNumber("9"), variant: "calculator" as const },
    { label: "×", action: () => handleOperator("*"), variant: "calculatorOperator" as const },
    { label: "4", action: () => handleNumber("4"), variant: "calculator" as const },
    { label: "5", action: () => handleNumber("5"), variant: "calculator" as const },
    { label: "6", action: () => handleNumber("6"), variant: "calculator" as const },
    { label: "−", action: () => handleOperator("-"), variant: "calculatorOperator" as const },
    { label: "1", action: () => handleNumber("1"), variant: "calculator" as const },
    { label: "2", action: () => handleNumber("2"), variant: "calculator" as const },
    { label: "3", action: () => handleNumber("3"), variant: "calculator" as const },
    { label: "+", action: () => handleOperator("+"), variant: "calculatorOperator" as const },
    { label: "00", action: () => handleNumber("00"), variant: "calculator" as const },
    { label: "0", action: () => handleNumber("0"), variant: "calculator" as const },
    { label: ".", action: handleDecimal, variant: "calculator" as const },
    { label: "=", action: handleEquals, variant: "calculatorEquals" as const },
  ];

  return (
    <Card className="w-full max-w-sm shadow-card animate-slide-up">
      <CardHeader className="text-center pb-2">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Calculator className="w-7 h-7 text-primary" />
        </div>
        <CardTitle className="text-2xl font-serif">Calculator</CardTitle>
        <p className="text-sm text-muted-foreground">Basic arithmetic operations</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Display */}
        <div className="bg-muted rounded-xl p-4">
          <p className="text-sm text-muted-foreground h-5 truncate text-right">
            {equation}
          </p>
          <p className="text-3xl font-mono font-bold text-right truncate">
            {display}
          </p>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-2">
          {buttons.map((btn, index) => (
            <Button
              key={index}
              onClick={btn.action}
              variant={btn.variant}
              size="calculator"
              className="rounded-xl"
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
