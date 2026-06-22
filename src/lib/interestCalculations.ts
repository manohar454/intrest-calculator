/**
 * Interest Calculation Utilities
 * Using Banking / PN Loan Method (1 month = 30 days)
 */

export interface InterestResult {
  days: number;
  months: number;
  simpleInterest: number;
  compoundInterest: number;
  totalAmountSI: number;
  totalAmountCI: number;
}

/**
 * Parse date string in DD/MM/YYYY format to Date object
 */
export function parseDate(dateStr: string): Date | null {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  
  const date = new Date(year, month, day);
  
  // Validate the date is real
  if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
    return null;
  }
  
  return date;
}

/**
 * Format Date object to DD/MM/YYYY string
 */
export function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Calculate the number of days between two dates using the
 * Banking / PN Loan (30/360) method.
 *
 * Formula (matches manual Y-M-D subtraction with borrow at 30 days / 12 months):
 *   days = (Y2 - Y1) * 360 + (M2 - M1) * 30 + (D2 - D1)
 *
 * Example: 15/11/2024 → 07/06/2026
 *   = (2026-2024)*360 + (6-11)*30 + (7-15)
 *   = 720 - 150 - 8 = 562 days  (i.e. 1 year 6 months 22 days)
 */
export function calculateDays(startDate: Date, endDate: Date): number {
  const y1 = startDate.getFullYear();
  const m1 = startDate.getMonth() + 1;
  const d1 = startDate.getDate();

  const y2 = endDate.getFullYear();
  const m2 = endDate.getMonth() + 1;
  const d2 = endDate.getDate();

  return (y2 - y1) * 360 + (m2 - m1) * 30 + (d2 - d1);
}

/**
 * Calculate time period in months using Banking/PN method (30 days = 1 month)
 */
export function calculateMonths(days: number): number {
  return days / 30;
}

/**
 * Calculate Simple Interest
 * Formula: SI = (P × R × T) / 100
 * Where P = Principal, R = Rate per 100 per month, T = Time in months
 */
export function calculateSimpleInterest(principal: number, rate: number, months: number): number {
  return (principal * rate * months) / 100;
}

/**
 * Calculate Compound Interest (Monthly compounding)
 * Formula: CI = P × (1 + R/100)^T - P
 * Where P = Principal, R = Rate per 100 per month, T = Time in months
 */
export function calculateCompoundInterest(principal: number, rate: number, months: number): number {
  return principal * Math.pow(1 + rate / 100, months) - principal;
}

/**
 * Calculate all interest values
 */
export function calculateInterest(
  principal: number,
  rate: number,
  startDate: Date,
  endDate: Date
): InterestResult {
  const days = calculateDays(startDate, endDate);
  const months = calculateMonths(days);
  
  const simpleInterest = calculateSimpleInterest(principal, rate, months);
  const compoundInterest = calculateCompoundInterest(principal, rate, months);
  
  return {
    days,
    months,
    simpleInterest,
    compoundInterest,
    totalAmountSI: principal + simpleInterest,
    totalAmountCI: principal + compoundInterest,
  };
}

/**
 * Format currency in Indian Rupees
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
