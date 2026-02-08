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
    
    // Profile (updated from user-provided data)
    await storage.createProfile({
      name: "Naveen Chaurasia",
      title: "B.Tech Student - Computer Science & Engineering",
      bio: "Sir Vishweshwaraiah Moti Bagh, South West Delhi, New Delhi - 110022 | Mob: 9717185219",
      summary: "Aspiring Computer Science & Engineering student with internship and project experience in data analysis, application development, and cyber security fundamentals. Proficient in Java, Python, and web technologies, seeking an entry-level role to build industry experience.",
      avatarUrl: "",
      resumeUrl: "/resume.pdf",
      socialLinks: {
        github: "https://github.com/navin544",
        linkedin: "https://www.linkedin.com/in/naveen-kumar-9176b51a7",
        email: "nchourasia591@gmail.com"
      }
    });

    // Skills
    const skills = [
      { name: "C", category: "Languages" },
      { name: "C++", category: "Languages" },
      { name: "Java", category: "Languages" },
      { name: "Python", category: "Languages" },
      { name: "HTML", category: "Languages" },
      { name: "CSS", category: "Languages" },
      { name: "Pandas", category: "Tools" },
      { name: "NumPy", category: "Tools" },
      { name: "Jupyter Notebook", category: "Tools" },
      { name: "VS Code", category: "Tools" },
      { name: "Android Studio", category: "Tools" },
    ];
    for (const s of skills) await storage.createSkill(s);

    // Projects
    const projects = [
      {
        title: "Web Card",
        description: "Responsive and reusable web component using semantic HTML and modern CSS.",
        techStack: ["HTML", "CSS"],
        outcome: "Reusable UI component for multiple projects.",
        githubUrl: "",
        demoUrl: "",
        imageUrl: ""
      },
      {
        title: "Portfolio WebApp",
        description: "Portfolio builder web application with responsive UI and content management features.",
        techStack: ["React", "TypeScript", "Tailwind CSS"],
        outcome: "A personal portfolio and resume site with editable content.",
        githubUrl: "https://github.com/navin544",
        demoUrl: "",
        imageUrl: ""
      },
      {
        title: "Trivia Quiz App (Android)",
        description: "Java-based Android application with OOP logic, XML UI layouts, and in-app question and score handling.",
        techStack: ["Java", "Android"],
        outcome: "Interactive quiz experience for mobile users.",
        githubUrl: "",
        demoUrl: "",
        imageUrl: ""
      }
    ];
    for (const p of projects) await storage.createProject(p);

    // Experience
    const experiences = [
      {
        company: "Cognifyz Technologies",
        role: "Data Engineering Intern",
        startDate: "Feb 2025",
        endDate: "Mar 2025",
        description: [
          "Performed data exploration, cleaning, transformation, and visualization on structured datasets."
        ]
      },
      {
        company: "Forensic Science Laboratory",
        role: "Cyber Forensic Intern",
        startDate: "Jul 2025",
        endDate: "Aug 2025",
        description: [
          "Assisted in forensic evidence extraction, analysis, and report preparation."
        ]
      },
      {
        company: "NASSCOM Foundation (Capgemini)",
        role: "Trainee",
        startDate: "Ongoing",
        endDate: "",
        description: [
          "Training in data analysis, machine learning fundamentals, and AI workflows."
        ]
      }
    ];
    for (const e of experiences) await storage.createExperience(e);
    
    console.log("Database seeded successfully.");
  }
}
