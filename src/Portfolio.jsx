import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Layout, Code, PenTool, ExternalLink } from 'lucide-react';
import { supabase } from './supabase';

const IDBadge = ({ profile }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative w-72 h-[420px] mx-auto cursor-pointer group"
      style={{ perspective: 1000 }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <div 
          className="absolute inset-0 bg-[#161618] border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-between shadow-2xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-16 h-3 bg-zinc-800 rounded-full mb-4" />
          <div className="w-32 h-32 bg-zinc-700 rounded-full overflow-hidden border-4 border-zinc-800">
            {profile?.dp_url ? (
              <img src={profile.dp_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-orange-400" />
            )}
          </div>
          <div className="text-center w-full mt-6 space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-white uppercase">Tobiloba Abass</h2>
            <div className="h-px w-full bg-zinc-800 my-4" />
            <p className="text-sm text-zinc-400 font-mono tracking-widest">DESIGNER</p>
            <p className="text-sm text-zinc-400 font-mono tracking-widest">DEVELOPER</p>
            <p className="text-sm text-zinc-400 font-mono tracking-widest">CREATOR</p>
          </div>
        </div>

        <div 
          className="absolute inset-0 bg-zinc-200 rounded-2xl p-8 flex flex-col justify-center shadow-2xl text-black"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <h3 className="text-xl font-bold mb-4">About Me</h3>
          <p className="text-sm leading-relaxed font-medium mb-6">
            {profile?.about_me || "Loading bio..."}
          </p>
          <p className="text-xs text-zinc-500 mt-auto uppercase tracking-widest">Tap to flip back</p>
        </div>
      </motion.div>
    </div>
  );
};

export default function Portfolio() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const tools = ["React", "Framer", "Vercel", "Supabase", "UI/UX", "Strategy"];

  useEffect(() => {
    const loadData = async () => {
      const { data: profileData } = await supabase.from('profile').select('*').eq('id', 1).single();
      if (profileData) setProfile(profileData);

      const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (projectsData) setProjects(projectsData);
    };
    loadData();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-purple-500/30">
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center backdrop-blur-md z-50 border-b border-white/5">
        <span className="text-xl font-bold tracking-tighter">tobi.</span>
        <button className="text-sm font-medium hover:text-purple-400 transition-colors">Contact</button>
      </nav>

      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto space-y-40">
        
        <section className="flex flex-col items-center justify-center min-h-[70vh]">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="w-full relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-20">
              <h1 className="text-[14vw] md:text-[8vw] font-black tracking-tighter whitespace-nowrap overflow-hidden">
                DESIGN BUILD
              </h1>
            </div>
            <IDBadge profile="{profile}"/>
          </motion.div>
        </section>

        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="space-y-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-7xl font-bold tracking-tighter flex flex-col bg-outline">
              <span className="text-white flex items-center gap-4"><Layout className="w-8 h-8 md:w-10 md:h-10 text-purple-500"/> Designer.</span>
              <span className="text-zinc-500 flex items-center gap-4"><Code className="w-8 h-8 md:w-10 md:h-10 text-blue-500"/> Developer.</span>
              <span className="text-zinc-700 flex items-center gap-4"><PenTool className="w-8 h-8 md:w-10 md:h-10 text-orange-500"/> Creator.</span>
            </motion.h2>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 md:max-w-md">
              {tools.map(tool => (
                <span key={tool} className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-full text-sm font-medium">
                  {tool}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.section>

        <section className="space-y-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-2">Selected work</h2>
            <p className="text-zinc-400">Web apps, UI/UX, and brand experiences.</p>
          </motion.div>

          <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory hide-scrollbar">
            {projects.map((project) => (
              <motion.div 
                key={project.id}
                whileHover={{ scale: 0.98 }} whileTap={{ scale: 0.98 }}
                className={`min-w-[85vw] md:min-w-[600px] h-[400px] rounded-3xl p-8 snap-center flex flex-col justify-between bg-gradient-to-br ${project.color_gradient} border border-white/10 relative overflow-hidden group cursor-pointer`}
              >
                <div className="z-10">
                  <p className="text-white/70 text-sm font-medium mb-2">{project.category}</p>
                  <h3 className="text-3xl font-bold text-white">{project.title}</h3>
                </div>
                <div className="z-10 flex justify-between items-end">
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map(t => (
                      <span key={t} className="px-3 py-1 bg-black/30 backdrop-blur-md rounded-full text-xs text-white/90">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center md:translate-y-4 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <ExternalLink className="w-5 h-5"/>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="text-center space-y-10 py-20 border-t border-white/5"
        >
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
            Got an idea?<br/>Let's build it.
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full md:w-auto px-8 py-4 bg-white text-black rounded-full font-bold text-lg flex items-center justify-center gap-2">
              Contact me <ArrowRight className="w-5 h-5"/>
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full md:w-auto px-8 py-4 bg-transparent border border-zinc-700 text-white rounded-full font-bold text-lg flex items-center justify-center gap-2">
              Get a quote <Mail className="w-5 h-5"/>
            </motion.button>
          </div>
        </motion.section>

      </main>
    </div>
  );
}
