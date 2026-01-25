import { pgTable, text, serial, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { sqliteTable, text as sqliteText, integer, blob } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

const isDev = process.env.NODE_ENV === "development";
const table = isDev ? sqliteTable : pgTable;
const textType = isDev ? sqliteText : text;
const serialType = isDev ? integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }) : serial("id").primaryKey();

// === TABLE DEFINITIONS ===

export const profile = table("profile", {
  id: serialType,
  name: textType("name").notNull(),
  title: textType("title").notNull(),
  bio: textType("bio").notNull(),
  summary: textType("summary").notNull(), // For About section
  avatarUrl: textType("avatar_url"),
  resumeUrl: textType("resume_url"),
  socialLinks: isDev ? blob("social_links", { mode: "json" }).$type<{
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  }>() : jsonb("social_links").$type<{
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  }>(),
});

export const skills = table("skills", {
  id: serialType,
  name: textType("name").notNull(),
  category: textType("category").notNull(), // Languages, Frameworks, Tools, DevOps
  proficiency: isDev ? blob("proficiency", { mode: "json" }).$type<number>() : jsonb("proficiency").$type<number>(), // 0-100, optional
});

export const projects = table("projects", {
  id: serialType,
  title: textType("title").notNull(),
  description: textType("description").notNull(), // Short problem statement
  techStack: isDev ? blob("tech_stack", { mode: "json" }).$type<string[]>() : text("tech_stack").array().notNull(),
  outcome: textType("outcome").notNull(), // Impact/Result
  githubUrl: textType("github_url"),
  demoUrl: textType("demo_url"),
  imageUrl: textType("image_url"),
  featured: isDev ? integer("featured", { mode: "boolean" }).default(false) : boolean("featured").default(false),
});

export const experience = table("experience", {
  id: serialType,
  company: textType("company").notNull(),
  role: textType("role").notNull(),
  startDate: textType("start_date").notNull(), // Store as string for flexibility (e.g. "Jan 2023")
  endDate: textType("end_date"), // Null for "Present"
  description: isDev ? blob("description", { mode: "json" }).$type<string[]>() : text("description").array().notNull(), // Bullet points
});

export const messages = table("messages", {
  id: serialType,
  name: textType("name").notNull(),
  email: textType("email").notNull(),
  message: textType("message").notNull(),
  createdAt: isDev ? integer("created_at", { mode: "timestamp" }).default(new Date()) : timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===

export const insertProfileSchema = createInsertSchema(profile);
export const insertSkillSchema = createInsertSchema(skills);
export const insertProjectSchema = createInsertSchema(projects);
export const insertExperienceSchema = createInsertSchema(experience);
export const insertMessageSchema = createInsertSchema(messages);

// === TYPES ===

export type Profile = typeof profile.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Experience = typeof experience.$inferSelect;
export type Message = typeof messages.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
