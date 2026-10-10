import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Quote } from 'lucide-react';
import { supabase } from './supabase';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const { data } = await supabase.from('projects').select('*').eq('id', id).single();
      if (data) setProject(data);
      setLoading(false);
    };
    fetchProject();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#0F0F11] text-white flex items-center justify-center">Loading...</div>;
  if (!project) return <div className="min-h-screen bg-[#0F0F11] text-white flex items-center justify-center">Project not found.</div>;

  return (
    <div className="min-h-screen bg-[#0F0F11] text-white font-sans selection:bg-purple-500/30">
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center backdrop-blur-md z-50 border-b border-white/5">
        <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Portfolio
        </Link>
        {project.project_url && (
          <a href={project.project_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-zinc-200 transition-colors">
            Live Project <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </nav>

      <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto space-y-16">
        <header className="space-y-6">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-purple-500 font-mono tracking-widest text-sm uppercase">
            {project.category}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
            {project.title}
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-2 pt-4">
            {project.tech_stack.map(t => (
              <span key={t} className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-sm font-medium">
                {t}
              </span>
            ))}
          </motion.div>
        </header>

        {project.description && (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="prose prose-invert prose-lg max-w-none text-zinc-300 leading-relaxed">
            <p className="whitespace-pre-wrap">{project.description}</p>
          </motion.section>
        )}

        {project.image_urls && project.image_urls.length > 0 && (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="space-y-8">
            <h3 className="text-2xl font-bold border-b border-white/10 pb-4">Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.image_urls.map((url, index) => (
                <div key={index} className="rounded-2xl overflow-hidden border border-white/10 bg-zinc-900">
                  <img src={url} alt={`${project.title} screenshot ${index + 1}`} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {project.testimonial && (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-zinc-900/50 p-8 md:p-12 rounded-3xl border border-white/5 relative overflow-hidden">
            <Quote className="absolute top-6 left-6 w-24 h-24 text-white/5 rotate-180 pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <p className="text-xl md:text-2xl font-medium leading-relaxed italic text-zinc-300">"{project.testimonial}"</p>
              <div>
                <p className="font-bold text-white">— {project.client_name || "Client"}</p>
              </div>
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
