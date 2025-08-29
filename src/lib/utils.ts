
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const colors = {
  primary: "#4F1964",
  primaryLight: "#6B3182",
  primaryDark: "#3A0F4C",
  accent: "#F8E6FF",
  secondary: "#F8F9FA",
  text: "#212529",
  textLight: "#6C757D",
}
