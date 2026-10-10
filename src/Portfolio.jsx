import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight, Mail, Layout, Code, PenTool, ExternalLink } from 'lucide-react';
import { supabase } from './supabase';

const IDBadge = ({ profile }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className="relative w-72 h-[420px] mx-auto cursor-pointer group"
      style={{ perspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative origin-center"
        style={{ 
          transformStyle: "preserve-3d",
          rotateX: isFlipped ? 0 : rotateX, 
          rotateY: isFlipped ? 180 : rotateY 
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 70, damping: 12, mass: 1.2 }}
      >
        <div className="absolute inset-0 bg-[#161618] border border-zinc-800 rounded-3xl p-6 flex flex-col items-center shadow-2xl" style={{ backfaceVisibility: "hidden" }}>
           <div className="w-16 h-2 bg-zinc-800 rounded-full mb-6" />
           <div className="w-32 h-32 bg-zinc-700 rounded-full overflow-hidden border-4 border-zinc-800 pointer-events-none">
             {profile?.dp_url ? <img src={profile.dp_url} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-purple-500 to-orange-400" />}
           </div>
           <div className="text-center w-full mt-8 space-y-2">
             <h2 className="text-2xl font-bold tracking-tight text-white uppercase">Tobiloba Abass</h2>
             <div className="h-px w-full bg-zinc-800 my-4" />
             <p className="text-sm text-zinc-400 font-mono tracking-widest">DESIGNER • DEVELOPER</p>
           </div>
        </div>

        <div className="absolute inset-0 bg-zinc-200 rounded-3xl p-8 flex flex-col justify-center shadow-2xl text-black" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <h3 className="text-xl font-bold mb-4">About Me</h3>
          <p className="text-sm leading-relaxed font-medium">{profile?.about_me || "Loading bio..."}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default function Portfolio() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const carouselRef = useRef(null);
  const [width, setWidth] = useState(0);
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

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, [projects]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-purple-500/30 overflow-hidden">
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center backdrop-blur-md z-50 border-b border-white/5">
        <span className="text-xl font-bold tracking-tighter">tobi.</span>
        <button className="text-sm font-medium hover:text-purple-400 transition-colors">Contact</button>
      </nav>

      <main className="pt-32 pb-24 space-y-40">
        
        <section className="flex flex-col items-center justify-center min-h-[70vh] px-6">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="w-full relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-20">
              <h1 className="text-[14vw] md:text-[8vw] font-black tracking-tighter whitespace-nowrap overflow-hidden">
                DESIGN BUILD
              </h1>
            </div>
            <IDBadge profile={profile} />
          </motion.div>
        </section>

        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="space-y-12 px-6 md:px-12 max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
            <motion.div variants={fadeInUp} className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <Layout className="w-8 h-8 md:w-12 md:h-12 text-purple-500"/>
                <span className="text-5xl md:text-7xl font-bold tracking-tighter text-white">Designer.</span>
              </div>
              <div className="flex items-center gap-4">
                <Code className="w-8 h-8 md:w-12 md:h-12 text-blue-500"/>
                <span className="text-5xl md:text-7xl font-bold tracking-tighter text-zinc-500">Developer.</span>
              </div>
              <div className="flex items-center gap-4">
                <PenTool className="w-8 h-8 md:w-12 md:h-12 text-orange-500"/>
                <span className="text-5xl md:text-7xl font-bold tracking-tighter text-zinc-700">Creator.</span>
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 md:max-w-[400px]">
              {tools.map(tool => (
                <span key={tool} className="px-6 py-3 bg-zinc-900/80 border border-zinc-800 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors cursor-pointer">
                  {tool}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.section>

        <section className="space-y-8 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-2">Selected work</h2>
            <p className="text-zinc-400">Drag to explore web apps, UI/UX, and brand experiences.</p>
          </motion.div>

          <motion.div ref={carouselRef} className="cursor-grab active:cursor-grabbing overflow-hidden pb-8">
            <motion.div 
              drag="x"
              dragConstraints={{ right: 0, left: -width }}
              className="flex gap-6"
            >
              {projects.map((project) => (
                <motion.div 
                  key={project.id}
                  className={`min-w-[85vw] md:min-w-[450px] h-[450px] rounded-3xl p-8 flex flex-col justify-between bg-gradient-to-br ${project.color_gradient} border border-white/10 relative overflow-hidden group`}
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
            </motion.div>
          </motion.div>
        </section>

        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="text-center space-y-10 py-20 border-t border-white/5 px-6"
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
