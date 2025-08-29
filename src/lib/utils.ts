import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Special Character Handling Utilities

/**
 * URL encode special characters in passwords for MongoDB connection strings
 */
export function encodeMongoPassword(password: string): string {
  return encodeURIComponent(password);
}

/**
 * Sanitize and escape special characters for safe HTML/JSX display
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validate that a string contains only safe characters for usernames
 * Allows: letters, numbers, underscore, hyphen, dot, and most international characters
 */
export function isValidUsername(username: string): boolean {
  // Allow letters (including international), numbers, underscore, hyphen, dot, spaces
  // Supports: Latin, Extended Latin, Greek, Cyrillic, Arabic, CJK, and more
  const usernameRegex = /^[\w\-\.\s\u00C0-\u024F\u0370-\u03FF\u0400-\u04FF\u0590-\u05FF\u0600-\u06FF\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]+$/;
  return usernameRegex.test(username) && username.trim().length >= 2 && username.length <= 50;
}

/**
 * Validate password strength while allowing special characters
 */
export function isValidPassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  if (password.length > 128) {
    errors.push("Password must be less than 128 characters long");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  // Allow any special characters
  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize company names and project titles for safe storage and display
 */
export function sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[\x00-\x1F\x7F]/g, ''); // Remove control characters
}

/**
 * Validate company name allowing international characters and common business symbols
 */
export function isValidCompanyName(name: string): boolean {
  // Allow letters, numbers, spaces, and common business symbols
  const companyRegex = /^[\w\s\-\.\&\(\)\,À-ÿ\u0100-\u017F\u0180-\u024F\u0370-\u03FF\u0400-\u04FF\u0500-\u052F\u1E00-\u1EFF\u2C60-\u2C7F\uA720-\uA7FF]+$/;
  return companyRegex.test(name) && name.trim().length >= 2 && name.trim().length <= 100;
}

/**
 * Clean and validate search queries to prevent injection while preserving special chars
 */
export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/[\$\{\}]/g, '') // Remove MongoDB operators
    .slice(0, 100); // Limit length
}

/**
 * Format display names safely for UI
 */
export function formatDisplayName(name: string): string {
  return sanitizeText(name);
}

/**
 * Check if a string contains potentially dangerous characters for DB queries
 */
export function hasDangerousChars(input: string): boolean {
  const dangerousPattern = /[\$\{\}\\]/;
  return dangerousPattern.test(input);
}
