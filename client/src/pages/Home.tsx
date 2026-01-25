import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { Github, Linkedin, Twitter, Mail, ExternalLink, Download, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMessageSchema } from "@shared/schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";

import { Navbar } from "@/components/Navbar";
import { SectionHeading } from "@/components/SectionHeading";
import { useProfile, useSkills, useProjects, useExperience, useContact } from "@/hooks/use-portfolio";

// Animations
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  const { data: profile, isLoading: loadingProfile } = useProfile();
  const { data: skills, isLoading: loadingSkills } = useSkills();
  const { data: projects, isLoading: loadingProjects } = useProjects();
  const { data: experience, isLoading: loadingExperience } = useExperience();
  const contactMutation = useContact();

  const form = useForm({
    resolver: zodResolver(insertMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });

  const onSubmit = (data: any) => {
    contactMutation.mutate(data, {
      onSuccess: () => form.reset()
    });
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Navbar />

      {/* HERO SECTION */}
      <section id="hero" className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-4xl mx-auto space-y-8"
          >
            <motion.div variants={fadeInUp} className="inline-block relative">
              <span className="text-sm font-semibold tracking-wider uppercase text-primary mb-2 block">
                Hello, I'm
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-display tracking-tight text-foreground">
                {profile.name}
              </h1>
            </motion.div>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
              {profile.title} based in San Francisco. {profile.bio}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <ScrollLink to="projects" smooth={true} offset={-100} duration={500}>
                <Button size="lg" className="rounded-full px-8 text-lg font-medium h-14 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                  View Work
                </Button>
              </ScrollLink>
              <ScrollLink to="contact" smooth={true} offset={-80} duration={500}>
                <Button size="lg" variant="outline" className="rounded-full px-8 text-lg font-medium h-14 border-2 hover:bg-muted transition-all">
                  Contact Me
                </Button>
              </ScrollLink>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex gap-6 justify-center pt-8 text-muted-foreground">
              {profile.socialLinks?.github && (
                <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors hover:-translate-y-1 transform duration-200">
                  <Github className="w-6 h-6" />
                </a>
              )}
              {profile.socialLinks?.linkedin && (
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors hover:-translate-y-1 transform duration-200">
                  <Linkedin className="w-6 h-6" />
                </a>
              )}
              {profile.socialLinks?.twitter && (
                <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors hover:-translate-y-1 transform duration-200">
                  <Twitter className="w-6 h-6" />
                </a>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <SectionHeading title="About Me" subtitle="Get to know me better" />
          
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-purple-500 rounded-2xl transform rotate-3 group-hover:rotate-2 transition-transform duration-300 opacity-20" />
              {/* Profile Image with fallback */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/5] bg-muted">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                    No image available
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold font-display">Who am I?</h3>
              <div className="prose prose-lg dark:prose-invert text-muted-foreground">
                <p>{profile.summary}</p>
              </div>
              
              <div className="pt-4">
                <Button className="gap-2" onClick={() => window.open(profile.resumeUrl || '#', '_blank')}>
                  <Download className="w-4 h-4" /> Download Resume
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section id="skills" className="py-24">
        <div className="container mx-auto px-6">
          <SectionHeading title="My Skills" subtitle="Technologies I work with" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {loadingSkills ? (
              Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)
            ) : (
              ["Languages", "Frameworks", "Tools", "DevOps"].map((category, idx) => {
                const categorySkills = skills?.filter(s => s.category === category);
                if (!categorySkills?.length) return null;

                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-bold text-center mb-6 border-b pb-2 border-border">{category}</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {categorySkills.map((skill) => (
                        <Badge 
                          key={skill.id} 
                          variant="secondary" 
                          className="px-4 py-2 text-sm font-medium bg-background border border-border shadow-sm hover:border-primary/50 transition-colors"
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <SectionHeading title="Featured Projects" subtitle="Things I've built" />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {loadingProjects ? (
              Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-96 rounded-2xl" />)
            ) : (
              projects?.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Card className="h-full flex flex-col overflow-hidden border-border/50 bg-background hover:shadow-xl hover:border-primary/20 transition-all duration-300 group">
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      {project.imageUrl ? (
                        <img 
                          src={project.imageUrl} 
                          alt={project.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">No Preview</div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                        {project.githubUrl && (
                          <a 
                            href={project.githubUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                        {project.demoUrl && (
                          <a 
                            href={project.demoUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <CardHeader>
                      <h3 className="text-xl font-bold font-display">{project.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.techStack.map((tech) => (
                          <span key={tech} className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground mb-4">{project.description}</p>
                      <p className="text-sm font-medium text-foreground">Outcomes: <span className="text-muted-foreground font-normal">{project.outcome}</span></p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section id="experience" className="py-24">
        <div className="container mx-auto px-6">
          <SectionHeading title="Experience" subtitle="My professional journey" />

          <div className="max-w-4xl mx-auto space-y-8 relative">
            {/* Vertical Line */}
            <div className="absolute left-[28px] md:left-1/2 top-4 bottom-4 w-0.5 bg-border -translate-x-1/2 hidden md:block" />

            {loadingExperience ? (
              <Skeleton className="h-48 w-full rounded-2xl" />
            ) : (
              experience?.map((role, idx) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`relative flex flex-col md:flex-row gap-8 ${
                    idx % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-[28px] md:left-1/2 top-0 w-4 h-4 rounded-full bg-primary border-4 border-background -translate-x-1/2 z-10 hidden md:block" />

                  <div className="flex-1 md:w-1/2">
                    <Card className="border-border/50 bg-secondary/20 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <h3 className="text-xl font-bold text-primary">{role.role}</h3>
                            <h4 className="text-lg font-semibold">{role.company}</h4>
                          </div>
                          <Badge variant="outline" className="text-muted-foreground bg-background">
                            {role.startDate} - {role.endDate || "Present"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 list-disc list-outside ml-4 text-muted-foreground">
                          {role.description.map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="flex-1 hidden md:block" /> {/* Spacer */}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container mx-auto px-6">
          <SectionHeading title="Get In Touch" subtitle="Let's build something amazing together" />

          <div className="max-w-xl mx-auto">
            <Card className="shadow-2xl shadow-primary/5 border-border/50">
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" className="h-12 bg-background/50" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" className="h-12 bg-background/50" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell me about your project..." 
                              className="min-h-[150px] bg-background/50 resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-lg font-medium shadow-lg shadow-primary/20"
                      disabled={contactMutation.isPending}
                    >
                      {contactMutation.isPending ? (
                        "Sending..."
                      ) : (
                        <span className="flex items-center gap-2">Send Message <Send className="w-4 h-4" /></span>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="mt-12 text-center space-y-4">
              <p className="text-muted-foreground">Or reach me directly at</p>
              <a 
                href={`mailto:${profile.socialLinks?.email}`} 
                className="text-xl font-medium hover:text-primary transition-colors inline-flex items-center gap-2"
              >
                <Mail className="w-5 h-5" /> {profile.socialLinks?.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-muted-foreground border-t border-border/50">
        <div className="container mx-auto px-6">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
