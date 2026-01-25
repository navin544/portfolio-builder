import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertMessageSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // === API ROUTES ===

  app.get(api.profile.get.path, async (_req, res) => {
    const profile = await storage.getProfile();
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  });

  app.get(api.skills.list.path, async (_req, res) => {
    const skills = await storage.getSkills();
    res.json(skills);
  });

  app.get(api.projects.list.path, async (_req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get(api.experience.list.path, async (_req, res) => {
    const experience = await storage.getExperience();
    res.json(experience);
  });

  app.post(api.contact.submit.path, async (req, res) => {
    try {
      const input = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(input);
      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // === SEED DATA ===
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingProfile = await storage.getProfile();
  if (!existingProfile) {
    console.log("Seeding database...");
    
    // Profile
    await storage.createProfile({
      name: "Jane Doe", // Placeholder
      title: "Senior Full-Stack Developer",
      bio: "I build accessible, pixel-perfect, and performant web experiences. Award-winning UI/UX designer with a passion for clean code.",
      summary: "I'm a software engineer specializing in building (and occasionally designing) exceptional digital experiences. Currently, I'm focused on building accessible, human-centered products.",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=300&h=300",
      resumeUrl: "/resume.pdf",
      socialLinks: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        email: "mailto:hello@example.com"
      }
    });

    // Skills
    const skills = [
      { name: "JavaScript (ES6+)", category: "Languages" },
      { name: "TypeScript", category: "Languages" },
      { name: "Python", category: "Languages" },
      { name: "React", category: "Frameworks" },
      { name: "Node.js", category: "Frameworks" },
      { name: "Next.js", category: "Frameworks" },
      { name: "Tailwind CSS", category: "Frameworks" },
      { name: "PostgreSQL", category: "Tools" },
      { name: "Docker", category: "DevOps" },
      { name: "AWS", category: "DevOps" },
    ];
    for (const s of skills) await storage.createSkill(s);

    // Projects
    const projects = [
      {
        title: "E-Commerce Platform",
        description: "A full-featured online store with real-time inventory and payments.",
        techStack: ["React", "Node.js", "Stripe", "PostgreSQL"],
        outcome: "Increased sales by 25% through improved UX.",
        githubUrl: "https://github.com",
        demoUrl: "https://example.com",
        imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80"
      },
      {
        title: "Task Management App",
        description: "Collaborative project management tool for remote teams.",
        techStack: ["Vue.js", "Firebase", "Tailwind"],
        outcome: "Adopted by 500+ teams in first month.",
        githubUrl: "https://github.com",
        demoUrl: "https://example.com",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
      },
      {
        title: "AI Content Generator",
        description: "Generates blog posts and marketing copy using OpenAI API.",
        techStack: ["Next.js", "OpenAI", "Vercel"],
        outcome: "Featured on Product Hunt #1 Product of the Day.",
        githubUrl: "https://github.com",
        demoUrl: "https://example.com",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80"
      }
    ];
    for (const p of projects) await storage.createProject(p);

    // Experience
    const experiences = [
      {
        company: "Tech Solutions Inc.",
        role: "Senior Frontend Engineer",
        startDate: "2021",
        endDate: "Present",
        description: [
          "Led migration from legacy codebase to React, improving load times by 40%.",
          "Mentored junior developers and established code review best practices.",
          "Architected reusable component library used across 5 products."
        ]
      },
      {
        company: "Creative Digital Agency",
        role: "Full Stack Developer",
        startDate: "2018",
        endDate: "2021",
        description: [
          "Developed and launched 15+ client websites using JAMstack architecture.",
          "Collaborated with designers to implement pixel-perfect UIs.",
          "Optimized backend APIs for high-traffic campaigns."
        ]
      }
    ];
    for (const e of experiences) await storage.createExperience(e);
    
    console.log("Database seeded successfully.");
  }
}
