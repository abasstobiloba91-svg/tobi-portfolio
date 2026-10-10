import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Trash2, Plus, Save, LogOut, UploadCloud, Edit3 } from 'lucide-react';

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [profile, setProfile] = useState({ dp_url: '', about_me: '', job_titles: '' });
  const [projects, setProjects] = useState([]);
  
  const emptyProject = { title: '', category: '', tech_stack: '', color_gradient: 'from-blue-900 to-indigo-900', project_url: '', description: '', testimonial: '', client_name: '', image_urls: [] };
  const [newProject, setNewProject] = useState(emptyProject);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchData();
      setLoading(false);
    });
  }, []);

  const fetchData = async () => {
    const { data: profileData } = await supabase.from('profile').select('*').eq('id', 1).single();
    if (profileData) setProfile(profileData);
    const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (projectsData) setProjects(projectsData);
  };

  const uploadFile = async (file, pathFolder) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${pathFolder}/${fileName}`;
    const { error } = await supabase.storage.from('portfolio_images').upload(filePath, file);
    if (error) throw error;
    const { data } = supabase.storage.from('portfolio_images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleProfileImage = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;
      const url = await uploadFile(file, 'profile');
      setProfile({ ...profile, dp_url: url });
    } catch (error) {
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleProjectImages = async (e) => {
    try {
      setUploading(true);
      const files = Array.from(e.target.files);
      const urls = [];
      for (const file of files) {
        urls.push(await uploadFile(file, 'projects'));
      }
      setNewProject({ ...newProject, image_urls: [...newProject.image_urls, ...urls] });
    } catch (error) {
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    await supabase.from('profile').upsert({ id: 1, ...profile });
    alert('Profile updated successfully!');
  };

  const submitProject = async (e) => {
    e.preventDefault();
    const techArray = typeof newProject.tech_stack === 'string' ? newProject.tech_stack.split(',').map(t => t.trim()) : newProject.tech_stack;
    
    if (editingId) {
      const { error } = await supabase.from('projects').update({ ...newProject, tech_stack: techArray }).eq('id', editingId);
      if (!error) {
        alert("Project updated!");
        setEditingId(null);
        setNewProject(emptyProject);
        fetchData();
      } else alert("Error updating: " + error.message);
    } else {
      const { data, error } = await supabase.from('projects').insert([{ ...newProject, tech_stack: techArray }]).select();
      if (!error && data) {
        setProjects([data[0], ...projects]);
        setNewProject(emptyProject);
      } else alert("Error adding project: " + error.message);
    }
  };

  const editProject = (project) => {
    setNewProject({ ...project, tech_stack: project.tech_stack.join(', ') });
    setEditingId(project.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProject = async (id) => {
    if(window.confirm("Are you sure you want to delete this project?")) {
      await supabase.from('projects').delete().eq('id', id);
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0F0F11] text-white flex items-center justify-center p-6">
        <form onSubmit={async (e) => { e.preventDefault(); await supabase.auth.signInWithPassword({ email: e.target.email.value, password: e.target.password.value }); window.location.reload(); }} className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold">Admin Login</h2>
          <input name="email" type="email" placeholder="Email" required className="w-full bg-black/50 border border-zinc-800 rounded-lg p-3 outline-none" />
          <input name="password" type="password" placeholder="Password" required className="w-full bg-black/50 border border-zinc-800 rounded-lg p-3 outline-none" />
          <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg">Sign In</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F11] text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex justify-between items-center border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button onClick={() => supabase.auth.signOut()} className="text-zinc-400 hover:text-white flex items-center gap-2"><LogOut className="w-4 h-4"/> Logout</button>
        </header>

        {/* Profile Section */}
        <section className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><Save className="w-5 h-5 text-purple-500"/> Profile & ID Card</h2>
          
          <div className="flex items-center gap-4">
            {profile.dp_url && <img src={profile.dp_url} alt="Profile" className="w-16 h-16 rounded-full object-cover" />}
            <label className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg cursor-pointer transition">
              <UploadCloud className="w-4 h-4"/> {uploading ? "Uploading..." : "Upload Profile Image"}
              <input type="file" accept="image/*" onChange={handleProfileImage} className="hidden" disabled={uploading} />
            </label>
          </div>
          
          <input type="text" value={profile.job_titles || ''} onChange={e => setProfile({...profile, job_titles: e.target.value})} placeholder="ID Badge Subtitle (e.g. DESIGNER • DEVELOPER)" className="w-full bg-black/50 border border-zinc-800 rounded-lg p-3 outline-none focus:border-purple-500" />
          <textarea rows="4" value={profile.about_me || ''} onChange={e => setProfile({...profile, about_me: e.target.value})} placeholder="About Me Text" className="w-full bg-black/50 border border-zinc-800 rounded-lg p-3 outline-none focus:border-purple-500" />
          <button onClick={saveProfile} className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-lg font-bold">Save Profile</button>
        </section>

        {/* Add/Edit Project Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <h2 className="text-xl font-bold">{editingId ? "Edit Project" : "Create New Project"}</h2>
            {editingId && <button onClick={() => { setEditingId(null); setNewProject(emptyProject); }} className="text-sm text-zinc-400 hover:text-white">Cancel Edit</button>}
          </div>
          <form onSubmit={submitProject} className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Project Title" required value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="bg-black/50 border border-zinc-800 rounded-lg p-3 outline-none" />
            <input type="text" placeholder="Category (e.g., Web App)" required value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})} className="bg-black/50 border border-zinc-800 rounded-lg p-3 outline-none" />
            <input type="text" placeholder="Tech Stack (comma separated)" required value={newProject.tech_stack} onChange={e => setNewProject({...newProject, tech_stack: e.target.value})} className="bg-black/50 border border-zinc-800 rounded-lg p-3 outline-none" />
            <input type="url" placeholder="Live Project URL (Optional)" value={newProject.project_url} onChange={e => setNewProject({...newProject, project_url: e.target.value})} className="bg-black/50 border border-zinc-800 rounded-lg p-3 outline-none" />
            
            <textarea placeholder="Extensive Project Description..." rows="4" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="md:col-span-2 bg-black/50 border border-zinc-800 rounded-lg p-3 outline-none" />
            
            <textarea placeholder="Client Testimonial (Optional)" rows="2" value={newProject.testimonial} onChange={e => setNewProject({...newProject, testimonial: e.target.value})} className="bg-black/50 border border-zinc-800 rounded-lg p-3 outline-none" />
            <input type="text" placeholder="Client Name (Optional)" value={newProject.client_name} onChange={e => setNewProject({...newProject, client_name: e.target.value})} className="bg-black/50 border border-zinc-800 rounded-lg p-3 outline-none" />

            <div className="md:col-span-2 space-y-2">
              <label className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 w-full py-4 rounded-lg cursor-pointer transition border border-dashed border-zinc-600">
                <UploadCloud className="w-5 h-5"/> {uploading ? "Uploading..." : "Upload Project Screenshots (Select Multiple)"}
                <input type="file" accept="image/*" multiple onChange={handleProjectImages} className="hidden" disabled={uploading} />
              </label>
              {newProject.image_urls.length > 0 && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                  {newProject.image_urls.map((url, i) => (
                     <img key={i} src={url} className="w-16 h-16 object-cover rounded-lg border border-zinc-700" alt="Upload preview" />
                  ))}
                  <button type="button" onClick={() => setNewProject({...newProject, image_urls: []})} className="text-xs text-red-400 p-2">Clear Images</button>
                </div>
              )}
            </div>

            <select value={newProject.color_gradient} onChange={e => setNewProject({...newProject, color_gradient: e.target.value})} className="md:col-span-2 bg-black/50 border border-zinc-800 rounded-lg p-3 outline-none text-white">
              <option value="from-blue-900 to-indigo-900">Blue Gradient</option>
              <option value="from-red-900 to-orange-900">Red Gradient</option>
              <option value="from-green-900 to-emerald-900">Green Gradient</option>
            </select>
            
            <button type="submit" className={`md:col-span-2 font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition ${editingId ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-white text-black hover:bg-zinc-200'}`}>
              <Plus className="w-5 h-5"/> {editingId ? "Save Changes" : "Publish Project"}
            </button>
          </form>
        </section>

        {/* Existing Projects List */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold border-b border-white/10 pb-2">Your Projects</h2>
          {projects.map(project => (
            <div key={project.id} className="flex justify-between items-center bg-zinc-900 p-4 rounded-xl border border-zinc-800">
              <div>
                <h3 className="font-bold text-lg">{project.title}</h3>
                <p className="text-sm text-zinc-400">{project.category}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => editProject(project)} className="text-blue-400 hover:bg-blue-400/10 p-2 rounded-lg transition"><Edit3 className="w-5 h-5"/></button>
                <button onClick={() => deleteProject(project.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition"><Trash2 className="w-5 h-5"/></button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
