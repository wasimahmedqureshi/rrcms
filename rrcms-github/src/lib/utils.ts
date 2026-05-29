import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInDays, differenceInMonths, differenceInYears, format, parseISO, isValid } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Aging calculation functions for MPR reports
export type AgingCategory = 
  | 'upto6Months'
  | 'sixTo12Months'
  | 'oneTo2Years'
  | 'twoTo3Years'
  | 'threeTo5Years'
  | 'fiveTo10Years'
  | 'tenTo20Years'
  | 'twentyTo30Years'
  | 'thirtyTo40Years'
  | 'moreThan40Years';

export function calculateAgingCategory(institutionDate: Date, referenceDate: Date = new Date()): AgingCategory {
  const days = differenceInDays(referenceDate, new Date(institutionDate));
  const months = differenceInMonths(referenceDate, new Date(institutionDate));
  const years = differenceInYears(referenceDate, new Date(institutionDate));
  
  if (months <= 6) return 'upto6Months';
  if (months <= 12) return 'sixTo12Months';
  if (years < 2) return 'oneTo2Years';
  if (years < 3) return 'twoTo3Years';
  if (years < 5) return 'threeTo5Years';
  if (years < 10) return 'fiveTo10Years';
  if (years < 20) return 'tenTo20Years';
  if (years < 30) return 'twentyTo30Years';
  if (years < 40) return 'thirtyTo40Years';
  return 'moreThan40Years';
}

export function calculateDisposalAging(institutionDate: Date, disposalDate: Date): number {
  return differenceInDays(new Date(disposalDate), new Date(institutionDate));
}

export function getAgingCategoryLabel(category: AgingCategory): string {
  const labels: Record<AgingCategory, string> = {
    upto6Months: 'Upto 6 Months',
    sixTo12Months: '6 Months to 1 Year',
    oneTo2Years: '1 to 2 Years',
    twoTo3Years: '2 to 3 Years',
    threeTo5Years: '3 to 5 Years',
    fiveTo10Years: '5 to 10 Years',
    tenTo20Years: '10 to 20 Years',
    twentyTo30Years: '20 to 30 Years',
    thirtyTo40Years: '30 to 40 Years',
    moreThan40Years: 'More than 40 Years',
  };
  return labels[category];
}

// Date formatting utilities
export function formatDate(date: Date | string, formatStr: string = 'dd/MM/yyyy'): string {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsedDate)) return '';
  return format(parsedDate, formatStr);
}

export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
}

// Generate unique case number
export function generateCaseNumber(prefix: string = 'RC', year: number = new Date().getFullYear()): string {
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}/${year}/${random}`;
}

// Parse Excel date
export function parseExcelDate(excelDate: number | string): Date | null {
  if (typeof excelDate === 'string') {
    const parsed = parseISO(excelDate);
    return isValid(parsed) ? parsed : null;
  }
  // Excel date is number of days since 1899-12-30
  const excelEpoch = new Date(1899, 11, 30);
  const date = new Date(excelEpoch.getTime() + excelDate * 24 * 60 * 60 * 1000);
  return isValid(date) ? date : null;
}

// Password hashing (simple for demo, use bcrypt in production)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// Generate random token
export function generateToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Format number with commas
export function formatNumber(num: number): string {
  return num.toLocaleString('en-IN');
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Get year from date
export function getYearFromDate(date: Date | string): number {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return parsedDate.getFullYear();
}

// Calculate statistics
export function calculateStatistics(cases: { institutionDate: Date; disposalDate?: Date }[]) {
  const total = cases.length;
  const pending = cases.filter(c => !c.disposalDate).length;
  const disposed = cases.filter(c => c.disposalDate).length;
  
  return { total, pending, disposed };
}
