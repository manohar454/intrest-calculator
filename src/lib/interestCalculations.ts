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
 * Calculate the number of days between two dates
 */
export function calculateDays(startDate: Date, endDate: Date): number {
  const diffTime = endDate.getTime() - startDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
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
