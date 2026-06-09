/**
 * Shared domain types — kept centralized so route files and components
 * can speak the same shape without redefining interfaces locally.
 */

export type ProjectCategory =
  | "E-Commerce"
  | "AI & SaaS"
  | "Agency"
  | "Spiritual"
  | "Concepts";

export interface Project {
  title: string;
  desc: string;
  tags: string[];
  category: ProjectCategory;
  gradient: string;
  emoji: string;
  image?: string;
  live?: string;
  code?: string;
}

export interface Skill {
  name: string;
  level: number;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar: string;
}