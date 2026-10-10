import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';

export default function Quote() {
  const [formData, setFormData] = useState({ name: '', email: '', budget: '', details: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`New Project Quote from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nBudget: ${formData.budget}\n\nProject Details:\n${formData.details}`);
    window.location.href = `mailto:abasstobiloba91@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-[#0F0F11] text-white font-sans selection:bg-purple-500/30 p-6 md:p-12 flex flex-col items-center justify-center relative">
      <nav className="absolute top-0 w-full p-6 flex justify-start z-50">
        <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Portfolio
        </Link>
      </nav>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl bg-zinc-900/50 p-8 md:p-12 rounded-3xl border border-white/5 space-y-8 mt-16">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Let's build something.</h1>
          <p className="text-zinc-400">Fill out the details below and I'll get back to you within 24 hours.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" required placeholder="Your Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-black/50 border border-zinc-800 rounded-xl p-4 outline-none focus:border-purple-500 transition-colors" />
            <input type="email" required placeholder="Your Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-black/50 border border-zinc-800 rounded-xl p-4 outline-none focus:border-purple-500 transition-colors" />
          </div>
          <select required value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} className="w-full bg-black/50 border border-zinc-800 rounded-xl p-4 outline-none focus:border-purple-500 transition-colors text-white">
            <option value="" disabled>Select your budget</option>
            <option value="< $1,000">Less than $1,000</option>
            <option value="$1,000 - $5,000">$1,000 - $5,000</option>
            <option value="$5,000 - $10,000">$5,000 - $10,000</option>
            <option value="$10,000+">$10,000+</option>
          </select>
          <textarea required placeholder="Tell me about your project..." rows="5" value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} className="w-full bg-black/50 border border-zinc-800 rounded-xl p-4 outline-none focus:border-purple-500 transition-colors" />
          
          <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-zinc-200 transition-transform active:scale-[0.98]">
            Send Quote Request <Send className="w-5 h-5"/>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
