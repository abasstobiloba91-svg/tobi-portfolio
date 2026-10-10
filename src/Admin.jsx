import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Trash2, Plus, Save, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ dp_url: '', about_me: '' });
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', category: '', tech_stack: '', color_gradient: 'from-blue-900 to-indigo-900' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchData();
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchData();
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    const { data: profileData } = await supabase.from('profile').select('*').eq('id', 1).single();
    if (profileData) setProfile(profileData);

    const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (projectsData) setProjects(projectsData);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: e.target.email.value,
      password: e.target.password.value
    });
    
    if (error) {
      alert("Login failed: " + error.message);
    }
  };

  const saveProfile = async () => {
    const { error } = await supabase.from('profile').upsert({ id: 1, ...profile });
    if (error) alert("Error saving: " + error.message);
    else alert('Profile updated successfully!');
  };

  const addProject = async (e) => {
    e.preventDefault();
    const techArray = newProject.tech_stack.split(',').map(t => t.trim());
    const { data, error } = await supabase.from('projects').insert([{ ...newProject, tech_stack: techArray }]).select();
    
    if (error) {
      alert("Error adding project: " + error.message);
    } else if (data) {
      setProjects([data[0], ...projects]);
      setNewProject({ title: '', category: '', tech_stack: '', color_gradient: 'from-blue-900 to-indigo-900' });
    }
  };

  const deleteProject = async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      alert("Error deleting: " + error.message);
    } else {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0F0F11] text-white flex items-center justify-center">Loading...</div>;

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0F0F11] text-white flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md space-y-6 border border-zinc-800">
          <h2 className="text-2xl font-bold">Admin Login</h2>
          <input name="email" type="email" placeholder="Email" required className="w-full bg-black/50 border border-zinc-800 rounded-lg p-3 outline-none focus:border-purple-500" />
          <input name="password" type="password" placeholder="Password" required className="w-full bg-black/50 border border-zinc-800 rounded-lg p-3 outline-none focus:border-purple-500" />
          <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors">Sign In</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F11] text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex justify-between items-center border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4"/> Logout
          </button>
        </header>

        <section className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><Save className="w-5 h-5 text-purple-500"/> Profile & ID Card</h2>
          <input type="text" value={profile.dp_url} onChange={e => setProfile({...profile, dp_url: e.target.value})} placeholder="Image URL (e.g., your display picture link)" className="w-full bg-black/50 border border-zinc-800 rounded-lg p-3 focus:border-purple-500 outline-none" />
          <textarea rows="4" value={profile.about_me} onChange={e => setProfile({...profile, about_me: e.target.value})} placeholder="About Me Text" className="w-full bg-black/50 border border-zinc-800 rounded-lg p-3 focus:border-purple-500 outline-none" />
          <button onClick={saveProfile} className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-lg font-bold transition">Save Profile</button>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-bold border-b border-white/10 pb-2">Manage Projects</h2>
          <form onSubmit={addProject} className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Project Title" required value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="bg-black/50 border border-zinc-800 rounded-lg p-3 outline-none focus:border-purple-500" />
            <input type="text" placeholder="Category" required value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})} className="bg-black/50 border border-zinc-800 rounded-lg p-3 outline-none focus:border-purple-500" />
            <input type="text" placeholder="Tech Stack (comma separated)" required value={newProject.tech_stack} onChange={e => setNewProject({...newProject, tech_stack: e.target.value})} className="bg-black/50 border border-zinc-800 rounded-lg p-3 outline-none focus:border-purple-500" />
            <select value={newProject.color_gradient} onChange={e => setNewProject({...newProject, color_gradient: e.target.value})} className="bg-black/50 border border-zinc-800 rounded-lg p-3 outline-none text-white focus:border-purple-500">
              <option value="from-blue-900 to-indigo-900">Blue Gradient</option>
              <option value="from-red-900 to-orange-900">Red Gradient</option>
              <option value="from-green-900 to-emerald-900">Green Gradient</option>
            </select>
            <button type="submit" className="md:col-span-2 bg-white text-black font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-zinc-200 transition"><Plus className="w-5 h-5"/> Add Project</button>
          </form>

          <div className="space-y-4">
            {projects.map(project => (
              <div key={project.id} className="flex justify-between items-center bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                <div>
                  <h3 className="font-bold text-lg">{project.title}</h3>
                  <p className="text-sm text-zinc-400">{project.category} • {project.tech_stack.join(', ')}</p>
                </div>
                <button onClick={() => deleteProject(project.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition"><Trash2 className="w-5 h-5"/></button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
