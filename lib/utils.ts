import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounceImmediate(func: Function, wait: number) {
  let timeout: any;
  return function (...args: any[]) {
    const context = this;
    const callNow = !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(() => (timeout = null), wait);
    if (callNow) func.apply(context, args);
  };
}

export function extractLinkedInUsername(url: string) {
  const pattern = /linkedin\.com\/in\/([^/?#]+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}

export function extractTwitterUsername(url: string) {
  const pattern = /twitter\.com\/([^/?#]+)|x\.(twitter\.com)\/([^/?#]+)/;
  const match = url.match(pattern);
  return match ? match.filter(Boolean).pop() : null;
}

export function extractGithubUsername(url: string) {
  const pattern = /github\.com\/([^/?#]+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}

export function extractDribbbleUsername(url: string) {
  const pattern = /dribbble\.com\/([^/?#]+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}

export function extractBehanceUsername(url: string) {
  const pattern = /behance\.net\/([^/?#]+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}
