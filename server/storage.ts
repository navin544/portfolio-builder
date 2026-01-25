import { db } from "./db";
import {
  profile, skills, projects, experience, messages,
  type Profile, type Skill, type Project, type Experience, type Message, type InsertMessage
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getProfile(): Promise<Profile | undefined>;
  getSkills(): Promise<Skill[]>;
  getProjects(): Promise<Project[]>;
  getExperience(): Promise<Experience[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Seed methods
  createProfile(p: any): Promise<Profile>;
  createSkill(s: any): Promise<Skill>;
  createProject(p: any): Promise<Project>;
  createExperience(e: any): Promise<Experience>;
}

export class DatabaseStorage implements IStorage {
  async getProfile(): Promise<Profile | undefined> {
    const [p] = await db.select().from(profile).limit(1);
    return p;
  }

  async getSkills(): Promise<Skill[]> {
    return await db.select().from(skills);
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getExperience(): Promise<Experience[]> {
    return await db.select().from(experience);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [m] = await db.insert(messages).values(message).returning();
    return m;
  }

  async createProfile(p: any): Promise<Profile> {
    const [row] = await db.insert(profile).values(p).returning();
    return row;
  }
  async createSkill(s: any): Promise<Skill> {
    const [row] = await db.insert(skills).values(s).returning();
    return row;
  }
  async createProject(p: any): Promise<Project> {
    const [row] = await db.insert(projects).values(p).returning();
    return row;
  }
  async createExperience(e: any): Promise<Experience> {
    const [row] = await db.insert(experience).values(e).returning();
    return row;
  }
}

export const storage = new DatabaseStorage();
