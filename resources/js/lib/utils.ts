import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parse a date string from backend (Y-m-d H:i:s format) as Asia/Manila time
 * The backend stores dates like "2025-11-23 14:20:00" which should be interpreted as 2:20 PM Manila time
 * This function ensures the date is parsed correctly by appending the Manila timezone offset
 */
export function parseManilaDate(dateString: string | Date | null | undefined): Date | null {
  if (!dateString) return null;
  
  if (dateString instanceof Date) {
    return dateString;
  }
  
  // If it's already in ISO format with timezone (Z, +, -), parse directly
  if (dateString.includes('T') && (dateString.includes('Z') || dateString.match(/[+-]\d{2}:\d{2}$/))) {
    return new Date(dateString);
  }
  
  // For 'Y-m-d H:i:s' format from backend, append Manila timezone offset (+08:00)
  // This tells JavaScript to interpret the time as Manila time
  const normalizedDate = dateString.includes('T') ? dateString : dateString.replace(' ', 'T');
  const dateWithTimezone = normalizedDate + '+08:00'; // Manila is UTC+8
  
  return new Date(dateWithTimezone);
}

/**
 * Format a date for display in Asia/Manila timezone
 */
export function formatManilaDate(dateString: string | Date | null | undefined, options?: Intl.DateTimeFormatOptions): string {
  if (!dateString) return 'No schedule set';
  
  const date = parseManilaDate(dateString);
  if (!date) return 'Invalid date';
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila'
  };
  
  return date.toLocaleString('en-US', { ...defaultOptions, ...options });
}

/**
 * Get current time in Asia/Manila timezone for comparisons
 * Returns a Date object representing the current Manila time
 */
export function getManilaTimeNow(): Date {
  // Get current time as a string in Manila timezone, then parse it back
  const now = new Date();
  const manilaTimeString = now.toLocaleString('en-US', { 
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  // Parse the Manila time string back to a Date object
  // Format: "MM/DD/YYYY, HH:MM:SS"
  const [datePart, timePart] = manilaTimeString.split(', ');
  const [month, day, year] = datePart.split('/').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);
  
  // Create date in local timezone that represents the Manila time
  return new Date(year, month - 1, day, hours, minutes, seconds);
}
