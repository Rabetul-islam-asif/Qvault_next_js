'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- SUPABASE CONFIGURATION ---
const SUPABASE_URL = "https://imeykplylnqymupmofcb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZXlrcGx5bG5xeW11cG1vZmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4OTU1NzgsImV4cCI6MjA3OTQ3MTU3OH0.YjkgJ1eWVoM4PCP9bq8qMYKmdrqiwi2JBxk2l1woYZ4";

// --- COURSE DATABASE ---
const COURSE_DB = [
    { code: "10031CSE320", name: "Technical Writing and Research Methodology", credits: 3, type: "theory" },
    { code: "20031ORE101", name: "Freshman Orientation", credits: 0.5, type: "theory" },
    { code: "300611CSE233", name: "Computer Organization and Architecture", credits: 3, pre: "0611CSE133", type: "theory" },
    { code: "300611CSE234", name: "Computer Organization and Architecture Sessional", credits: 1.5, pre: "0611CSE133", type: "lab" },
    { code: "300611CSE313", name: "Operating System", credits: 3, pre: "0611CSE233", type: "theory" },
    { code: "300611CSE314", name: "Operating System Sessional", credits: 1.5, pre: "0611CSE233", type: "lab" },
    { code: "300611CSE315", name: "Computer Network", credits: 3, pre: "0611CSE335", type: "theory" },
    { code: "300611CSE316", name: "Computer Network Sessional", credits: 1.5, pre: "0611CSE335", type: "lab" },
    { code: "300611CSE321", name: "Artificial Intelligence and Expert System", credits: 3, pre: "0611CSE121", type: "theory" },
    { code: "300611CSE322", name: "Artificial Intelligence and Expert System Sessional", credits: 1.5, pre: "0611CSE121", type: "lab" },
    { code: "300611CSE327", name: "Microprocessors, Microcontrollers and Embedded Systems", credits: 3, pre: "0611CSE233", type: "theory" },
    { code: "300611CSE328", name: "Microprocessors, Microcontrollers, and Embedded Systems Sessional", credits: 1.5, pre: "0611CSE233", type: "lab" },
    { code: "300611CSE333", name: "Advanced Programming", credits: 3, pre: "0611CSE217", type: "theory" },
    { code: "300611CSE334", name: "Advanced Programming Sessional", credits: 1.5, pre: "0611CSE217", type: "lab" },
    { code: "300611CSE335", name: "Data Communication", credits: 3, pre: "0611CSE233", type: "theory" },
    { code: "300611CSE339", name: "Industrial and Operational Management", credits: 3, type: "theory" },
    { code: "300611CSE400", name: "Project and Thesis", credits: 3, type: "theory" },
    { code: "300611CSE411", name: "Automata Theory and Compiler", credits: 3, pre: "0611CSE121", type: "theory" },
    { code: "300611CSE412", name: "Automata Theory and Compiler Sessional", credits: 1.5, pre: "0611CSE121", type: "lab" },
    { code: "300611CSE413", name: "Computer Graphics", credits: 3, pre: "0611CSE231", type: "theory" },
    { code: "300611CSE414", name: "Computer Graphics Sessional", credits: 1.5, pre: "0611CSE231", type: "lab" },
    { code: "300611CSE431", name: "System Design and Software Engineering", credits: 3, pre: "0611CSE223", type: "theory" },
    { code: "300611CSE432", name: "System Design and Software Engineering Sessional", credits: 1.5, pre: "0611CSE223", type: "lab" },
    { code: "300611CSE441", name: "Computer and Cyber Security", credits: 3, pre: "0611CSE315", type: "theory" },
    { code: "300611HUM311", name: "Engineering Ethics and Professional Practice", credits: 3, type: "theory" },
    { code: "300611HUM319", name: "Engineering Economics", credits: 3.0, type: "theory" },
    { code: "300611MAT319", name: "Linear Algebra, Fourier Analysis and Laplace Transformation", credits: 3, pre: "0611MAT113", type: "theory" },
    { code: "300611MAT327", name: "Numerical Methods", credits: 3, pre: "0611MAT113", type: "theory" },
    { code: "300611MAT337", name: "Mathematical Analysis for Computer Science", credits: 3, pre: "0611MAT113", type: "theory" },
    { code: "300613ACC227", name: "Financial, Cost, and Managerial Accounting", credits: 3, type: "theory" },
    { code: "300613CSE213", name: "Digital Electronics and Pulse Technique", credits: 3, pre: "0611EEE195", type: "theory" },
    { code: "300613CSE214", name: "Digital Electronics and Pulse Technique Sessional", credits: 1.5, pre: "0611EEE195", type: "lab" },
    { code: "300613CSE217", name: "Object Oriented Programming", credits: 3, pre: "0611CSE123", type: "theory" },
    { code: "300613CSE218", name: "Object Oriented Programming Sessional", credits: 1.5, pre: "0611CSE123", type: "lab" },
    { code: "300613CSE223", name: "Database Management System", credits: 3, pre: "0611CSE121", type: "theory" },
    { code: "300613CSE224", name: "Database Management System Sessional", credits: 1.5, pre: "0611CSE121", type: "lab" },
    { code: "300613CSE231", name: "Data Structures and Algorithms II", credits: 3, pre: "0611CSE121", type: "theory" },
    { code: "300613CSE232", name: "Data Structures and Algorithms II Sessional", credits: 1.5, pre: "0611CSE121", type: "lab" },
    { code: "300613MAT225", name: "Coordinate Geometry and Vector Calculus", credits: 3, pre: "0611MAT113", type: "theory" },
    { code: "300613MAT237", name: "Statistics and Probability", credits: 3, pre: "0611MAT113", type: "theory" },
    { code: "300615CSE121", name: "Data Structures and Algorithms I", credits: 3, pre: "0611CSE123", type: "theory" },
    { code: "300615CSE122", name: "Data Structure and Algorithms I Sessional", credits: 1.5, pre: "0611CSE123", type: "lab" },
    { code: "300615CSE133", name: "Digital Logic Design", credits: 3, type: "theory" },
    { code: "300615CSE134", name: "Digital Logic Design Sessional", credits: 1.5, type: "lab" },
    { code: "300615EEE195", name: "Electronics", credits: 3, pre: "0611EEE193", type: "theory" },
    { code: "300615EEE196", name: "Electronics Sessional", credits: 1.5, pre: "0611EEE193", type: "lab" },
    { code: "300615MAT135", name: "Discrete Mathematics", credits: 3, type: "theory" },
    { code: "300615SOC113", name: "Bangladesh Studies", credits: 3, type: "theory" },
    { code: "300617CSE115", name: "Computer Applications and Future Aspects", credits: 3, type: "theory" },
    { code: "300617CSE123", name: "Structured Programming Language", credits: 3, type: "theory" },
    { code: "300617CSE124", name: "Structured Programming Language Sessional", credits: 1.5, type: "lab" },
    { code: "300617EEE193", name: "Electrical Circuit and Devices", credits: 3, pre: "0611PHY217", type: "theory" },
    { code: "300617ENG117", name: "Composition", credits: 3, pre: "0611ENG100", type: "theory" },
    { code: "300617MAT113", name: "Differential and Integral Calculus", credits: 3, type: "theory" },
    { code: "300617PHY217", name: "Physics", credits: 3, type: "theory" },
    { code: "300619ENG100", name: "English Fundamentals", credits: 3, type: "theory" }
];

const DEPARTMENTS = [
    'Business Administration', 'Pharmacy', 'Microbiology', 'Environmental Science', 'English', 'Economics', 'Film and Media Studies', 'Journalism and Media Studies', 'Public Administration', 'Law', 'Computer Science & Engineering', 'Electrical & Electronic Engineering', 'Civil Engineering', 'Architecture'
];

export default function QVaultApp() {
    // --- STATE ---
    const [supabase, setSupabase] = useState(null);
    const [view, setView] = useState('home');
    const [teachers, setTeachers] = useState([]);
    const [papers, setPapers] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [pendingPapers, setPendingPapers] = useState([]);
    const [pendingMaterials, setPendingMaterials] = useState([]);
    const [user, setUser] = useState(null); // 'admin' or null
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallModal, setShowInstallModal] = useState(false);
    
    // Modals State
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [showTeacherModal, setShowTeacherModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showVaultFilter, setShowVaultFilter] = useState(false);
    const [showMaterialsFilter, setShowMaterialsFilter] = useState(false);

    // Data for Modals/Views
    const [previewUrl, setPreviewUrl] = useState('');
    const [teacherProfileId, setTeacherProfileId] = useState(null);
    const [adminTab, setAdminTab] = useState('uploads');
    
    // New State for Course List
    const [courseListDept, setCourseListDept] = useState('Computer Science & Engineering');

    // Upload Form State
    const [uploadType, setUploadType] = useState('paper'); // 'paper' or 'material'
    const [uploadFormData, setUploadFormData] = useState({
        dept: 'Computer Science & Engineering',
        semSeason: 'Winter',
        semYear: '2025',
        type: 'theory', // course type
        matType: 'slide', // material type
        code: '',
        name: '',
        exam: 'Mid',
        teacherId: 'Additional'
    });
    const [uploadFile, setUploadFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Filters State
    const [filters, setFilters] = useState({
        vault: { search: '', dept: '', semSeason: '', semYear: '', type: '' },
        materials: { search: '', dept: '', semSeason: '', semYear: '', teacher: '', course: '', type: '' },
        faculty: { search: '' },
        adminPaper: { search: '' },
        adminMaterial: { search: '' }
    });

    // Toast State
    const [toast, setToast] = useState({ show: false, title: '', msg: '', type: 'success' });

    // --- EFFECTS ---

    // 1. Initialize Supabase
    useEffect(() => {
        const client = createClient(SUPABASE_URL, SUPABASE_KEY);
        setSupabase(client);
    }, []);

    // 2. Fetch Initial Data & Subscribe (Only when supabase is ready)
    useEffect(() => {
        if (!supabase) return;

        const fetchData = async (table, setter) => {
            const { data } = await supabase.from(table).select('*');
            if (data) setter(data);
        };

        const tables = [
            { name: 'teachers', setter: setTeachers },
            { name: 'papers', setter: setPapers },
            { name: 'pending_papers', setter: setPendingPapers },
            { name: 'materials', setter: setMaterials },
            { name: 'pending_materials', setter: setPendingMaterials },
        ];

        tables.forEach(t => fetchData(t.name, t.setter));

        // Realtime Subscription
        const channel = supabase.channel('db-changes');
        tables.forEach(t => {
            channel.on('postgres_changes', { event: '*', schema: 'public', table: t.name }, (payload) => {
                const { eventType, new: newRow, old: oldRow } = payload;
                t.setter(prev => {
                    if (eventType === 'INSERT') return [...prev, newRow];
                    if (eventType === 'DELETE') return prev.filter(i => i.id !== oldRow.id);
                    if (eventType === 'UPDATE') return prev.map(i => i.id === newRow.id ? newRow : i);
                    return prev;
                });
            });
        });
        channel.subscribe();

        // Init Upload Form Codes
        updateCourseOptions('theory');

        return () => supabase.removeChannel(channel);
    }, [supabase]);

    // 3. PWA Installer Listener
    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallModal(true);
            console.log('PWA Install Prompt captured');
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    // --- HELPERS ---

    const showToast = (title, msg, type = 'success') => {
        setToast({ show: true, title, msg, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    const installPWA = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') setDeferredPrompt(null);
    };

    const getTeacherName = (id) => {
        const t = teachers.find(x => x.id == id);
        return t ? t.name : (isNaN(id) ? id : 'Guest Faculty');
    };

    // --- UPLOAD LOGIC ---

    const updateCourseOptions = (type) => {
        const filtered = COURSE_DB.filter(c => c.type === type);
        filtered.sort((a, b) => a.code.localeCompare(b.code));
        // Defaults
        if(filtered.length > 0) {
            setUploadFormData(prev => ({ ...prev, code: filtered[0].code, name: filtered[0].name }));
        }
    };

    const handleUploadChange = (field, value) => {
        setUploadFormData(prev => {
            const newData = { ...prev, [field]: value };
            // Auto-fill Name if Code changes
            if (field === 'code') {
                const course = COURSE_DB.find(c => c.code === value);
                if (course) newData.name = course.name;
            }
            // Update options if type changes
            if (field === 'type') {
                updateCourseOptions(value);
            }
            return newData;
        });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) setUploadFile(e.target.files[0]);
    };

    const submitUpload = async () => {
        if (!supabase) return showToast('Error', 'Database connection not ready', 'error');
        if (!uploadFile) return showToast('Error', 'Please select a PDF file', 'error');
        setIsUploading(true);

        try {
            const fd = new FormData();
            fd.append('reqtype', 'fileupload');
            fd.append('fileToUpload', uploadFile);
            const res = await fetch('https://corsproxy.io/?' + encodeURIComponent('https://catbox.moe/user/api.php'), { method: 'POST', body: fd });
            const url = await res.text();
            
            if (!url.startsWith('http')) throw new Error('Upload failed');

            const commonData = {
                courseCode: uploadFormData.code,
                courseName: uploadFormData.name,
                semester: `${uploadFormData.semSeason} ${uploadFormData.semYear}`,
                dept: uploadFormData.dept,
                teacherId: uploadFormData.teacherId,
                fileUrl: url.trim()
            };

            if (uploadType === 'paper') {
                await supabase.from('pending_papers').insert({ ...commonData, exam: uploadFormData.exam, type: uploadFormData.type });
            } else {
                await supabase.from('pending_materials').insert({ ...commonData, type: uploadFormData.matType });
            }

            showToast('Success', 'Submitted for approval', 'success');
            setShowUploadModal(false);
            setUploadFile(null);
        } catch (e) {
            showToast('Error', e.message, 'error');
        } finally {
            setIsUploading(false);
        }
    };

    // --- ADMIN LOGIC ---
    const handleLogin = (e) => {
        e.preventDefault();
        const id = e.target.elements.id.value;
        const pass = e.target.elements.pass.value;
        if (id === 'sub=admin' && pass === 'admin2025') {
            setUser('admin');
            setShowLoginModal(false);
            setView('admin');
        } else {
            alert('Invalid Credentials');
        }
    };

    const approveItem = async (item, type) => {
        if (!supabase) return;
        const { id: _, uploadedAt: __, ...data } = item;
        const targetTable = type === 'paper' ? 'papers' : 'materials';
        const sourceTable = type === 'paper' ? 'pending_papers' : 'pending_materials';
        
        await supabase.from(targetTable).insert(data);
        await supabase.from(sourceTable).delete().eq('id', item.id);
        showToast('Approved', 'Item added to database');
    };

    const rejectItem = async (id, type) => {
        if (!supabase) return;
        if (!confirm('Reject this item?')) return;
        const table = type === 'paper' ? 'pending_papers' : 'pending_materials';
        await supabase.from(table).delete().eq('id', id);
    };

    const deleteItem = async (id, table) => {
        if (!supabase) return;
        if (!confirm('Delete permanently?')) return;
        await supabase.from(table).delete().eq('id', id);
    };

    // --- TEACHER PROFILE LOGIC ---
    const [teacherForm, setTeacherForm] = useState({ id: '', name: '', dept: DEPARTMENTS[10], desig: '', bio: '', img: '' });
    const [imgStatus, setImgStatus] = useState('');

    const handleTeacherImgUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImgStatus('Uploading...');
        const fd = new FormData(); fd.append('image', file);
        try {
            const res = await fetch(`https://api.imgbb.com/1/upload?key=659c558f44d89bffc201c4e258836605`, { method: 'POST', body: fd });
            const d = await res.json();
            if (d.success) {
                setTeacherForm(prev => ({ ...prev, img: d.data.url }));
                setImgStatus('Done');
            }
        } catch (e) { setImgStatus('Failed'); }
    };

    const saveTeacher = async () => {
        if (!supabase) return;
        const { id, ...data } = teacherForm;
        if (id) await supabase.from('teachers').update(data).eq('id', id);
        else await supabase.from('teachers').insert(data);
        setShowTeacherModal(false);
    };

    // --- RENDERERS ---

    return (
        <div className="bg-slate-50 text-slate-800 h-[100dvh] flex flex-col overflow-hidden font-sans">
            {/* External Scripts / Styles */}
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
            
            {/* Navbar */}
            <nav className="glass sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 sm:h-20">
                        <div className="flex items-center cursor-pointer group" onClick={() => setView('home')}>
                            <div className="flex-shrink-0 flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">Q</div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">QVault <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 ml-1 font-bold align-middle uppercase tracking-wide">Live</span></span>
                                    <span className="text-[10px] text-slate-400 font-medium tracking-wide">Developed by Asif Rabetul</span>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:flex md:items-center md:space-x-2">
                            <div className="flex items-center bg-slate-100/50 rounded-full p-1 border border-slate-200/50 mr-4">
                                {['vault', 'materials', 'faculty'].map(v => (
                                    <a key={v} href="#" onClick={(e) => { e.preventDefault(); setView(v); }} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${view === v ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-indigo-600 hover:bg-white'}`}>
                                        {v.charAt(0).toUpperCase() + v.slice(1)}
                                    </a>
                                ))}
                            </div>
                            {deferredPrompt && (
                                <button onClick={installPWA} className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors mr-2 shadow-sm">
                                    <i className="fas fa-download mr-2"></i> Install App
                                </button>
                            )}
                            <a href="#" onClick={(e) => { e.preventDefault(); user ? setView('admin') : setShowLoginModal(true); }} className="text-slate-400 hover:text-indigo-600 p-2 transition-colors mr-2" title="Admin"><i className="fas fa-cog"></i></a>
                            <button onClick={() => { setUploadType('paper'); setShowUploadModal(true); }} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-slate-900/20 hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                                <i className="fas fa-plus"></i> <span>Upload</span>
                            </button>
                        </div>
                        <div className="flex items-center md:hidden gap-3">
                            {deferredPrompt && <button onClick={installPWA} className="text-indigo-600 bg-indigo-50 border border-indigo-200 p-2.5 rounded-xl shadow-sm animate-pulse"><i className="fas fa-download"></i></button>}
                            <button onClick={() => { setUploadType('paper'); setShowUploadModal(true); }} className="text-white bg-indigo-600 shadow-indigo-500/30 shadow-md p-2.5 rounded-xl"><i className="fas fa-plus"></i></button>
                            <button onClick={() => setView('vault')} className="text-slate-600 bg-white border border-slate-200 p-2.5 rounded-xl"><i className="fas fa-search"></i></button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-slate-50">
                
                {/* HOME VIEW */}
                {view === 'home' && (
                    <div className="fade-in h-full">
                        <div className="relative overflow-hidden bg-white pb-12 pt-16 sm:pb-24 lg:pb-32 lg:pt-24 border-b border-slate-100">
                            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                                <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                                <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                            </div>
                            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left">
                                <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                                    <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                                        <div className="inline-flex items-center px-3 py-1 rounded-full border border-indigo-100 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">Stamford University</div>
                                        <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl lg:leading-tight">
                                            Unlock your <br />
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">academic history.</span>
                                        </h1>
                                        <p className="mt-4 text-base text-slate-500 sm:mt-5 sm:text-lg md:mt-5 md:text-xl leading-relaxed">Access a curated archive of past papers, slides, and class notes instantly.</p>
                                        <div className="mt-8 flex gap-3 flex-wrap justify-center lg:justify-start">
                                            <button onClick={() => setView('vault')} className="px-5 py-2.5 rounded-xl font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-colors text-sm">Question Bank</button>
                                            <button onClick={() => setView('course-list')} className="px-5 py-2.5 rounded-xl font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all text-sm">Course List</button>
                                            <button onClick={() => setView('materials')} className="px-5 py-2.5 rounded-xl font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all text-sm">Materials</button>
                                            <button onClick={() => setView('faculty')} className="px-5 py-2.5 rounded-xl font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all text-sm">Faculty</button>
                                        </div>
                                    </div>
                                    <div className="hidden lg:block lg:col-span-6">
                                        <div className="relative mx-auto w-full rounded-2xl shadow-2xl lg:max-w-md overflow-hidden border border-slate-100 bg-white h-64 flex items-center justify-center bg-slate-50">
                                            <img src="/stamford.jpg" alt="Stamford University" className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                            <h2 className="text-2xl font-bold text-slate-900 mb-8">Just Uploaded</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                                {papers.length === 0 ? (
                                    <div className="col-span-full py-20 text-center"><p className="text-slate-400 text-sm">Fetching archives...</p></div>
                                ) : (
                                    [...papers].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)).slice(0, 5).map(p => (
                                        <div key={p.id} className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between h-full" onClick={() => { setPreviewUrl(p.fileUrl); setShowPreviewModal(true); }}>
                                            <div>
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700">{p.courseCode}</span>
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full text-white ${p.type === 'lab' ? 'bg-gradient-to-br from-purple-400 to-purple-600' : 'bg-gradient-to-br from-emerald-400 to-emerald-600'}`}>{p.type}</span>
                                                </div>
                                                <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2" title={p.courseName}>{p.courseName}</h3>
                                            </div>
                                            <div className="mt-4 flex flex-col gap-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-slate-500 font-semibold">{p.semester}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">{p.exam}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* VAULT VIEW */}
                {view === 'vault' && (
                    <div className="h-full flex flex-col bg-slate-50 p-6 lg:p-10 overflow-y-auto">
                        <div className="mb-6 flex flex-wrap gap-4 justify-between items-end">
                            <div><h3 className="text-2xl font-bold text-slate-900">Question Bank</h3><p className="text-sm text-slate-500 mt-1">Browse past exam papers</p></div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setShowVaultFilter(true)} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 shadow-sm"><i className="fas fa-sliders-h text-indigo-500"></i> Filters</button>
                                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">{papers.filter(p => 
                                    (!filters.vault.search || JSON.stringify(p).toLowerCase().includes(filters.vault.search.toLowerCase())) &&
                                    (!filters.vault.dept || p.dept === filters.vault.dept) &&
                                    (!filters.vault.semSeason || (p.semester && p.semester.includes(filters.vault.semSeason))) &&
                                    (!filters.vault.semYear || (p.semester && p.semester.includes(filters.vault.semYear))) &&
                                    (!filters.vault.type || p.type === filters.vault.type)
                                ).length}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {papers.filter(p => 
                                (!filters.vault.search || JSON.stringify(p).toLowerCase().includes(filters.vault.search.toLowerCase())) &&
                                (!filters.vault.dept || p.dept === filters.vault.dept) &&
                                (!filters.vault.semSeason || (p.semester && p.semester.includes(filters.vault.semSeason))) &&
                                (!filters.vault.semYear || (p.semester && p.semester.includes(filters.vault.semYear))) &&
                                (!filters.vault.type || p.type === filters.vault.type)
                            ).map(p => (
                                <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:translate-y-[-4px] transition-transform duration-300 flex flex-col overflow-hidden">
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">{p.courseCode}</span>
                                            <div className="flex gap-2 items-center">
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full text-white ${p.type === 'lab' ? 'bg-purple-500' : 'bg-emerald-500'}`}>{p.type}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{p.exam}</span>
                                            </div>
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-900 leading-tight mb-2">{p.courseName}</h4>
                                        <div className="flex items-center gap-2 mb-4"><i className="far fa-calendar text-slate-400 text-xs"></i><span className="text-sm text-slate-600 font-bold">{p.semester || 'N/A'}</span></div>
                                        <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-700 font-bold">{getTeacherName(p.teacherId).charAt(0)}</div><span className="text-xs text-slate-700 font-bold truncate">Faculty: {getTeacherName(p.teacherId)}</span></div>
                                    </div>
                                    <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
                                        <button onClick={() => { setPreviewUrl(p.fileUrl); setShowPreviewModal(true); }} className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2"><i className="fas fa-eye"></i> Preview</button>
                                        <button onClick={(e) => { e.stopPropagation(); window.open(p.fileUrl, '_blank'); }} className="text-slate-400 hover:text-slate-600"><i className="fas fa-download"></i></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* MATERIALS VIEW */}
                {view === 'materials' && (
                    <div className="h-full flex flex-col bg-slate-50 p-6 lg:p-10 overflow-y-auto">
                        <div className="mb-6 flex flex-wrap gap-4 justify-between items-end">
                            <div><h3 className="text-2xl font-bold text-slate-900">Course Materials</h3><p className="text-sm text-slate-500 mt-1">Slides, Books & Notes</p></div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setShowMaterialsFilter(true)} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 shadow-sm"><i className="fas fa-sliders-h text-indigo-500"></i> Filters</button>
                                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">{materials.filter(p => 
                                    (!filters.materials.search || JSON.stringify(p).toLowerCase().includes(filters.materials.search.toLowerCase())) &&
                                    (!filters.materials.dept || p.dept === filters.materials.dept) &&
                                    (!filters.materials.semSeason || (p.semester && p.semester.includes(filters.materials.semSeason))) &&
                                    (!filters.materials.semYear || (p.semester && p.semester.includes(filters.materials.semYear))) &&
                                    (!filters.materials.teacher || p.teacherId == filters.materials.teacher) &&
                                    (!filters.materials.course || p.courseCode == filters.materials.course) &&
                                    (!filters.materials.type || p.type === filters.materials.type)
                                ).length}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {materials.filter(p => 
                                (!filters.materials.search || JSON.stringify(p).toLowerCase().includes(filters.materials.search.toLowerCase())) &&
                                (!filters.materials.dept || p.dept === filters.materials.dept) &&
                                (!filters.materials.semSeason || (p.semester && p.semester.includes(filters.materials.semSeason))) &&
                                (!filters.materials.semYear || (p.semester && p.semester.includes(filters.materials.semYear))) &&
                                (!filters.materials.teacher || p.teacherId == filters.materials.teacher) &&
                                (!filters.materials.course || p.courseCode == filters.materials.course) &&
                                (!filters.materials.type || p.type === filters.materials.type)
                            ).map(p => (
                                <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:translate-y-[-4px] transition-transform duration-300 flex flex-col overflow-hidden">
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">{p.courseCode}</span>
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full text-white ${p.type === 'slide' ? 'bg-amber-500' : p.type === 'book' ? 'bg-pink-500' : 'bg-blue-500'}`}>{p.type}</span>
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-900 leading-tight mb-2">{p.courseName}</h4>
                                        <div className="flex items-center gap-2 mb-4"><i className="far fa-clock text-slate-400 text-xs"></i><span className="text-sm text-slate-600 font-bold">Sem: {p.semester || 'N/A'}</span></div>
                                        <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-600 font-bold"><i className="fas fa-user"></i></div><span className="text-xs text-slate-700 font-bold truncate">Faculty: {getTeacherName(p.teacherId)}</span></div>
                                    </div>
                                    <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
                                        <button onClick={() => { setPreviewUrl(p.fileUrl); setShowPreviewModal(true); }} className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2"><i className="fas fa-eye"></i> Preview</button>
                                        <button onClick={(e) => { e.stopPropagation(); window.open(p.fileUrl, '_blank'); }} className="text-slate-400 hover:text-slate-600"><i className="fas fa-download"></i></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* COURSE LIST VIEW */}
                {view === 'course-list' && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Course List</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-500">Browse courses by department.</p>
                            <div className="mt-8 max-w-md mx-auto">
                                <select value={courseListDept} onChange={(e) => setCourseListDept(e.target.value)} className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm">
                                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(() => {
                                const staticCourses = courseListDept === 'Computer Science & Engineering' ? COURSE_DB : [];
                                const dynamicCourses = [...new Set(papers.filter(p => p.dept === courseListDept).map(p => JSON.stringify({ code: p.courseCode, name: p.courseName })))].map(s => JSON.parse(s));
                                const allCourses = [...staticCourses, ...dynamicCourses].filter((v,i,a)=>a.findIndex(t=>(t.code === v.code))===i).sort((a,b) => a.code.localeCompare(b.code));

                                return allCourses.map((c, i) => (
                                    <div key={i} onClick={() => { setFilters(prev => ({ ...prev, vault: { ...prev.vault, search: c.code } })); setView('vault'); }} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{c.code}</span>
                                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{c.credits ? `${c.credits} Cr` : 'N/A'}</span>
                                            </div>
                                            <h3 className="font-bold text-slate-800 mb-2">{c.name}</h3>
                                        </div>
                                        {c.pre && (
                                            <div className="mt-2 pt-2 border-t border-slate-50">
                                                <p className="text-xs text-slate-500"><span className="font-bold text-slate-400 uppercase">Pre-req:</span> {c.pre}</p>
                                            </div>
                                        )}
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                )}

                {/* FACULTY VIEW */}
                {view === 'faculty' && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Meet the Faculty</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-500">Browse professors and executives.</p>
                            <div className="mt-8 max-w-2xl mx-auto relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                <div className="relative bg-white rounded-xl shadow-sm flex items-center border border-slate-200">
                                    <i className="fas fa-search absolute left-4 text-slate-400"></i>
                                    <input type="text" className="block w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400" placeholder="Find a Professor..." onInput={(e) => setFilters(prev => ({ ...prev, faculty: { search: e.target.value } }))} />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {teachers.filter(t => t.name.toLowerCase().includes(filters.faculty.search.toLowerCase()))
                            .sort((a, b) => {
                                const designationRank = {
                                    "Chairman": 1,
                                    "Acting Chairman": 2,
                                    "Professor": 3,
                                    "Course Coordinator (NS)": 4,
                                    "Academic Advisor": 5,
                                    "Assistant Professor": 6,
                                    "Senior Lecturer": 7,
                                    "Lecturer": 8,
                                    "Coordinator": 9
                                };
                                return (designationRank[a.designation] || 99) - (designationRank[b.designation] || 99);
                            })
                            .map(t => (
                                <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center text-center hover:translate-y-[-4px] transition-all duration-300 cursor-pointer group" onClick={() => { setTeacherProfileId(t.id); setView('teacher-profile'); }}>
                                    <div className="relative w-28 h-28 mb-5">
                                        <div className="absolute inset-0 bg-indigo-100 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                        <img className="relative w-28 h-28 rounded-full object-cover border-4 border-white shadow-md" src={t.img || 'https://via.placeholder.com/150'} alt={t.name} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{t.name}</h3>
                                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-wide mt-1">{t.dept}</p>
                                    <p className="text-sm text-slate-400 mt-2 line-clamp-2">{t.designation}</p>
                                    <button className="mt-6 text-xs font-bold text-indigo-600 bg-indigo-50 px-6 py-2.5 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">View Profile</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TEACHER PROFILE VIEW */}
                {view === 'teacher-profile' && teacherProfileId && (
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        {(() => {
                            const t = teachers.find(x => x.id == teacherProfileId);
                            if (!t) return null;
                            const manualCourses = t.courses ? t.courses : [];
                            const paperCourses = [...new Set(papers.filter(p => p.teacherId == teacherProfileId).map(p => JSON.stringify({ code: p.courseCode, name: p.courseName, semester: p.semester })))].map(s => JSON.parse(s));
                            const coursesToDisplay = manualCourses.length > 0 ? manualCourses : paperCourses;

                            return (
                                <>
                                    <button onClick={() => setView('faculty')} className="mb-6 flex items-center text-slate-500 hover:text-indigo-600 font-medium transition-colors"><i className="fas fa-arrow-left mr-2"></i> Back to list</button>
                                    <div className="bg-white shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden mb-8 border border-slate-100">
                                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 h-32 sm:h-48 relative overflow-hidden"></div>
                                        <div className="px-8 pb-8 relative">
                                            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20 mb-6">
                                                <div className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-2xl border-4 border-white shadow-lg bg-white overflow-hidden">
                                                    <img src={t.img || 'https://via.placeholder.com/150'} className="h-full w-full object-cover" />
                                                </div>
                                                <div className="mt-6 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
                                                    <h1 className="text-3xl font-bold text-slate-900">{t.name}</h1>
                                                    <p className="text-indigo-600 font-bold text-sm tracking-wide uppercase mt-1">{t.designation}</p>
                                                    <p className="text-slate-500 font-medium">{t.dept}</p>
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Biography</h4>
                                                <p className="text-slate-600 leading-relaxed max-w-4xl">{t.bio}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white shadow-lg shadow-slate-200/40 rounded-2xl overflow-hidden border border-slate-100">
                                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                            <h3 className="text-lg font-bold text-slate-900">Course History</h3>
                                            <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">Archive</span>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-slate-100">
                                                <thead className="bg-slate-50">
                                                    <tr>
                                                        <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Semester</th>
                                                        <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                                                        <th className="px-8 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-slate-100">
                                                    {coursesToDisplay.map((p, i) => (
                                                        <tr key={i}>
                                                            <td className="px-8 py-4 text-sm font-medium text-slate-900">{p.semester || (p.ongoing ? <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs uppercase font-bold">Ongoing</span> : 'Past')}</td>
                                                            <td className="px-8 py-4 text-sm text-slate-500"><span className="font-bold mr-2 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{p.code || p.courseCode}</span>{p.name || p.courseName}</td>
                                                            <td className="px-8 py-4 text-right">
                                                                {p.fileUrl ? (
                                                                    <button onClick={() => { setPreviewUrl(p.fileUrl); setShowPreviewModal(true); }} className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline">View PDF</button>
                                                                ) : <span className="text-slate-400 text-xs">No File</span>}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {coursesToDisplay.length === 0 && <div className="px-6 py-12 text-center text-slate-400"><p>No records found for this faculty member.</p></div>}
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                )}

                {/* ADMIN DASHBOARD */}
                {view === 'admin' && user && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                            <div><h2 className="text-3xl font-bold text-slate-900">Admin Dashboard</h2><p className="text-slate-500">Manage uploads and records.</p></div>
                            <button onClick={() => { setUser(null); setView('home'); }} className="bg-white border border-red-200 text-red-600 px-5 py-2.5 rounded-xl hover:bg-red-50 transition-colors font-medium shadow-sm flex items-center"><i className="fas fa-sign-out-alt mr-2"></i> Logout</button>
                        </div>
                        <div className="border-b border-slate-200 mb-8 overflow-x-auto">
                            <nav className="-mb-px flex space-x-6">
                                {['uploads', 'mat_uploads', 'papers', 'materials', 'faculty'].map(tab => (
                                    <button key={tab} onClick={() => setAdminTab(tab)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${adminTab === tab ? 'border-indigo-500 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                                        {tab === 'uploads' ? 'Papers' : tab === 'mat_uploads' ? 'Materials' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        {(tab === 'uploads' || tab === 'mat_uploads') && <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs ${adminTab === tab ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>{tab === 'uploads' ? pendingPapers.length : pendingMaterials.length}</span>}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
                            {adminTab === 'uploads' && (
                                <ul className="divide-y divide-slate-100">
                                    {pendingPapers.length === 0 && <div className="px-6 py-16 text-center text-slate-500">All caught up! No pending papers.</div>}
                                    {pendingPapers.map(p => (
                                        <li key={p.id} className="px-6 py-5 hover:bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{p.courseCode}</span>
                                                    <span className="text-xs font-medium text-slate-500">{p.semester}</span>
                                                    <span className="text-xs font-bold text-slate-400 uppercase border border-slate-200 px-1.5 rounded">{p.type}</span>
                                                </div>
                                                <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">{p.courseName} <a href={p.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline"><i className="fas fa-external-link-alt"></i></a></div>
                                            </div>
                                            <div className="flex space-x-3">
                                                <button onClick={() => approveItem(p, 'paper')} className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-lg text-xs font-bold">Approve</button>
                                                <button onClick={() => rejectItem(p.id, 'paper')} className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-xs font-bold">Reject</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {adminTab === 'mat_uploads' && (
                                <ul className="divide-y divide-slate-100">
                                    {pendingMaterials.length === 0 && <div className="px-6 py-16 text-center text-slate-500">All caught up! No pending materials.</div>}
                                    {pendingMaterials.map(p => (
                                        <li key={p.id} className="px-6 py-5 hover:bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{p.courseCode}</span>
                                                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase">{p.type}</span>
                                                </div>
                                                <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">{p.courseName} <a href={p.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline"><i className="fas fa-external-link-alt"></i></a></div>
                                            </div>
                                            <div className="flex space-x-3">
                                                <button onClick={() => approveItem(p, 'material')} className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-lg text-xs font-bold">Approve</button>
                                                <button onClick={() => rejectItem(p.id, 'material')} className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-xs font-bold">Reject</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {adminTab === 'papers' && (
                                <div>
                                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                        <h3 className="font-bold text-slate-700">Active Database</h3>
                                        <input onInput={(e) => setFilters(prev => ({...prev, adminPaper: { search: e.target.value }}))} placeholder="Search..." className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                                    </div>
                                    <table className="min-w-full divide-y divide-slate-100">
                                        <tbody>
                                            {papers.filter(p => JSON.stringify(p).toLowerCase().includes(filters.adminPaper.search.toLowerCase())).map(p => (
                                                <tr key={p.id} className="hover:bg-slate-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">{p.courseCode}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600"><div className="font-medium">{p.courseName}</div><div className="text-xs text-slate-400">{p.semester}</div></td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><button onClick={() => deleteItem(p.id, 'papers')} className="text-red-400 hover:text-red-600"><i className="fas fa-trash-alt"></i></button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {adminTab === 'materials' && (
                                <div>
                                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                        <h3 className="font-bold text-slate-700">Active Database</h3>
                                        <input onInput={(e) => setFilters(prev => ({...prev, adminMaterial: { search: e.target.value }}))} placeholder="Search..." className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                                    </div>
                                    <table className="min-w-full divide-y divide-slate-100">
                                        <tbody>
                                            {materials.filter(p => JSON.stringify(p).toLowerCase().includes(filters.adminMaterial.search.toLowerCase())).map(p => (
                                                <tr key={p.id} className="hover:bg-slate-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">{p.courseCode}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600"><div className="font-medium">{p.courseName}</div><div className="text-xs text-slate-400">{p.semester} ({p.type})</div></td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><button onClick={() => deleteItem(p.id, 'materials')} className="text-red-400 hover:text-red-600"><i className="fas fa-trash-alt"></i></button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {adminTab === 'faculty' && (
                                <div>
                                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                        <h3 className="font-bold text-slate-700">Faculty Members</h3>
                                        <button onClick={() => { setTeacherForm({ id: '', name: '', dept: DEPARTMENTS[10], desig: '', bio: '', img: '' }); setShowTeacherModal(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all">Add New</button>
                                    </div>
                                    <table className="min-w-full divide-y divide-slate-100">
                                        <tbody>
                                            {teachers.map(t => (
                                                <tr key={t.id} className="hover:bg-slate-50">
                                                    <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="h-10 w-10 flex-shrink-0"><img className="h-10 w-10 rounded-full object-cover border border-slate-200" src={t.img || 'https://via.placeholder.com/40'} /></div><div className="ml-4"><div className="text-sm font-bold text-slate-900">{t.name}</div><div className="text-xs text-slate-500">{t.dept}</div></div></div></td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><button onClick={() => { setTeacherForm(t); setShowTeacherModal(true); }} className="text-indigo-600 hover:text-indigo-900 mr-4 font-semibold">Edit</button><button onClick={() => deleteItem(t.id, 'teachers')} className="text-red-400 hover:text-red-600"><i className="fas fa-trash-alt"></i></button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Credits Footer */}
            <footer className="bg-white border-t border-slate-200 py-6 md:py-4 z-30 relative">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-end items-center gap-2">
                    <p className="text-[11px] text-slate-400 font-medium tracking-wide">Planned by Nazmus Sakib</p>
                </div>
            </footer>

            {/* --- MODALS --- */}

            {/* INSTALL MODAL */}
            {showInstallModal && deferredPrompt && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowInstallModal(false)}></div>
                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full relative z-10 p-6">
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
                                    <i className="fas fa-download text-indigo-600 text-xl"></i>
                                </div>
                                <h3 className="text-lg leading-6 font-bold text-slate-900">Install QVault</h3>
                                <div className="mt-2">
                                    <p className="text-sm text-slate-500">Install the app for a better experience and offline access.</p>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6 flex gap-3">
                                <button onClick={() => { installPWA(); setShowInstallModal(false); }} className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:text-sm">
                                    Install
                                </button>
                                <button onClick={() => setShowInstallModal(false)} className="w-full inline-flex justify-center rounded-xl border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none sm:text-sm">
                                    Later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* UPLOAD MODAL */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowUploadModal(false)}></div>
                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full relative z-10">
                            <div className="bg-slate-900 pt-8 pb-16 px-8 relative overflow-hidden">
                                <div className="flex justify-between items-start text-white relative z-10">
                                    <div><h3 className="text-2xl font-bold tracking-tight">Upload Content</h3><p className="text-slate-400 text-sm mt-1">Contribute to the academic archive.</p></div>
                                    <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors"><i className="fas fa-times text-xl"></i></button>
                                </div>
                            </div>
                            <div className="bg-white -mt-8 mx-4 mb-4 rounded-xl shadow-lg px-8 py-8 relative">
                                <div className="flex justify-center mb-8">
                                    <div className="bg-slate-100 p-1.5 rounded-xl inline-flex shadow-inner">
                                        <button onClick={() => { setUploadType('paper'); setUploadFormData(p => ({ ...p, matType: 'slide' })); updateCourseOptions('theory'); }} className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${uploadType === 'paper' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Question Paper</button>
                                        <button onClick={() => { setUploadType('material'); setUploadFormData(p => ({ ...p, matType: 'book' })); updateCourseOptions('theory'); }} className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${uploadType === 'material' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Course Material</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Department</label>
                                            <div className="relative"><select value={uploadFormData.dept} onChange={e => handleUploadChange('dept', e.target.value)} className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none">{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select><i className="fas fa-chevron-down absolute right-4 top-4 text-slate-400 text-xs pointer-events-none"></i></div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Semester & Year</label>
                                            <div className="flex gap-3">
                                                <div className="relative w-1/2"><select value={uploadFormData.semSeason} onChange={e => handleUploadChange('semSeason', e.target.value)} className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none"><option>Winter</option><option>Summer</option></select><i className="fas fa-chevron-down absolute right-4 top-4 text-slate-400 text-xs pointer-events-none"></i></div>
                                                <div className="relative w-1/2"><select value={uploadFormData.semYear} onChange={e => handleUploadChange('semYear', e.target.value)} className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none">{Array.from({ length: 11 }, (_, i) => 2020 + i).map(y => <option key={y}>{y}</option>)}</select><i className="fas fa-chevron-down absolute right-4 top-4 text-slate-400 text-xs pointer-events-none"></i></div>
                                            </div>
                                        </div>
                                        {uploadType === 'paper' ? (
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Course Type</label>
                                                <div className="relative"><select value={uploadFormData.type} onChange={e => handleUploadChange('type', e.target.value)} className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none"><option value="theory">Theory</option><option value="lab">Lab</option></select><i className="fas fa-chevron-down absolute right-4 top-4 text-slate-400 text-xs pointer-events-none"></i></div>
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Material Type</label>
                                                <div className="relative"><select value={uploadFormData.matType} onChange={e => handleUploadChange('matType', e.target.value)} className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none"><option value="slide">Slide/Presentation</option><option value="book">Book/PDF</option><option value="note">Class Note</option></select><i className="fas fa-chevron-down absolute right-4 top-4 text-slate-400 text-xs pointer-events-none"></i></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Code</label>
                                            <div className="relative">
                                                <select value={uploadFormData.code} onChange={e => handleUploadChange('code', e.target.value)} className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none">
                                                    {COURSE_DB.filter(c => uploadType === 'material' || c.type === uploadFormData.type).sort((a, b) => a.code.localeCompare(b.code)).map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                                                </select>
                                                <i className="fas fa-chevron-down absolute right-4 top-4 text-slate-400 text-xs pointer-events-none"></i>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">{uploadType === 'paper' ? 'Course Name' : 'Book / Slide'}</label>
                                            <input value={uploadFormData.name} onChange={e => handleUploadChange('name', e.target.value)} placeholder="Introduction to CS" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">{uploadType === 'paper' ? 'Details' : 'Faculty'}</label>
                                            <div className="flex gap-3">
                                                {uploadType === 'paper' && (
                                                    <div className="relative w-1/2">
                                                        <select value={uploadFormData.exam} onChange={e => handleUploadChange('exam', e.target.value)} className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none"><option>Mid</option><option>Final</option></select>
                                                        <i className="fas fa-chevron-down absolute right-4 top-4 text-slate-400 text-xs pointer-events-none"></i>
                                                    </div>
                                                )}
                                                <div className={`relative ${uploadType === 'paper' ? 'w-1/2 flex-1' : 'w-full'}`}>
                                                    <select value={uploadFormData.teacherId} onChange={e => handleUploadChange('teacherId', e.target.value)} className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none">
                                                        <option value="Additional">Additional</option>
                                                        {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                                    </select>
                                                    <i className="fas fa-chevron-down absolute right-4 top-4 text-slate-400 text-xs pointer-events-none"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2 mt-2">
                                        <div className="border-2 border-dashed border-slate-300 rounded-2xl px-6 py-10 text-center hover:bg-indigo-50 hover:border-indigo-300 transition-all bg-slate-50 cursor-pointer relative group">
                                            <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                            <div className="mx-auto h-16 w-16 text-indigo-500 bg-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-100 mb-4 group-hover:scale-110 transition-transform"><i className="fas fa-cloud-upload-alt text-2xl"></i></div>
                                            <p className="text-sm text-slate-600 font-medium">{uploadFile ? uploadFile.name : 'Click to upload PDF (Max 200MB)'}</p>
                                            <p className="text-xs text-slate-400 mt-1">Drag and drop supported</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
                                    <button onClick={() => setShowUploadModal(false)} className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
                                    <button onClick={submitUpload} disabled={isUploading} className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5">{isUploading ? 'Processing...' : 'Submit Content'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PREVIEW MODAL */}
            {showPreviewModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={() => setShowPreviewModal(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
                                <button onClick={() => setShowPreviewModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"><i className="fas fa-times"></i></button>
                                <div className="mb-4 pr-10"><h3 className="text-xl leading-6 font-bold text-slate-900">Preview Document</h3></div>
                                <div className="bg-slate-100 rounded-xl h-[75vh] flex flex-col items-center justify-center relative overflow-hidden border border-slate-200">
                                    <iframe src={previewUrl} className="w-full h-full"></iframe>
                                </div>
                            </div>
                            <div className="bg-slate-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-100 gap-3">
                                <button onClick={() => window.open(previewUrl, '_blank')} className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-lg shadow-indigo-500/20 px-6 py-2.5 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:w-auto sm:text-sm transition-all">Download PDF</button>
                                <button onClick={() => setShowPreviewModal(false)} className="mt-3 w-full inline-flex justify-center rounded-xl border border-slate-300 shadow-sm px-6 py-2.5 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 sm:mt-0 sm:w-auto sm:text-sm transition-all">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TEACHER MODAL */}
            {showTeacherModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowTeacherModal(false)}></div>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 p-8 transform transition-all">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Faculty Profile</h3>
                            <button onClick={() => setShowTeacherModal(false)} className="text-slate-400 hover:text-slate-600"><i className="fas fa-times text-xl"></i></button>
                        </div>
                        <div className="space-y-5">
                            <input placeholder="Full Name" value={teacherForm.name} onChange={e => setTeacherForm({ ...teacherForm, name: e.target.value })} className="w-full border-slate-300 rounded-xl shadow-sm border p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                            <div className="grid grid-cols-2 gap-4">
                                <select value={teacherForm.dept} onChange={e => setTeacherForm({ ...teacherForm, dept: e.target.value })} className="w-full border-slate-300 rounded-xl border p-3 bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none">{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                                <input placeholder="Designation" value={teacherForm.desig} onChange={e => setTeacherForm({ ...teacherForm, desig: e.target.value })} className="w-full border-slate-300 rounded-xl border p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                            </div>
                            <div>
                                <div className="flex gap-2">
                                    <input placeholder="Image URL (Auto)" value={teacherForm.img} readOnly className="flex-1 border-slate-300 rounded-xl border p-3 bg-slate-50 text-slate-500 text-sm" />
                                    <label className="bg-indigo-600 text-white px-4 rounded-xl cursor-pointer hover:bg-indigo-700 flex items-center justify-center shadow-md"><i className="fas fa-cloud-upload-alt mr-2"></i> Upload <input type="file" hidden accept="image/*" onChange={handleTeacherImgUpload} /></label>
                                </div>
                                <div className="text-xs text-indigo-500 mt-1 font-medium min-h-[16px]">{imgStatus}</div>
                            </div>
                            <textarea rows="4" placeholder="Biography" value={teacherForm.bio} onChange={e => setTeacherForm({ ...teacherForm, bio: e.target.value })} className="w-full border-slate-300 rounded-xl border p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none"></textarea>
                            <div className="flex justify-end pt-4"><button onClick={saveTeacher} className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all">Save Profile</button></div>
                        </div>
                    </div>
                </div>
            )}

            {/* LOGIN MODAL */}
            {showLoginModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm" onClick={() => setShowLoginModal(false)}></div>
                    <div className="bg-white rounded-3xl p-10 w-full max-w-sm z-10 text-center relative shadow-2xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                        <div className="mx-auto h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner"><i className="fas fa-lock text-slate-800 text-3xl"></i></div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Restricted Access</h3>
                        <p className="text-slate-500 text-sm mb-8">Please authenticate to continue.</p>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <input name="id" type="text" placeholder="Admin ID" className="w-full border-slate-200 border px-5 py-3.5 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
                            <input name="pass" type="password" placeholder="Password" className="w-full border-slate-200 border px-5 py-3.5 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
                            <button type="submit" className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 shadow-xl shadow-slate-900/20 transform hover:-translate-y-0.5 transition-all mt-4">Authenticate</button>
                        </form>
                    </div>
                </div>
            )}

            {/* VAULT FILTER DRAWER */}
            {showVaultFilter && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowVaultFilter(false)}></div>
                    <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><i className="fas fa-filter text-indigo-500"></i> Filters</h2>
                            <button onClick={() => setShowVaultFilter(false)} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full shadow-sm border border-slate-100"><i className="fas fa-times"></i></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Search</label>
                                <input type="text" value={filters.vault.search} onChange={e => setFilters(prev => ({ ...prev, vault: { ...prev.vault, search: e.target.value } }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="Keywords..." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Department</label>
                                <select value={filters.vault.dept} onChange={e => setFilters(prev => ({ ...prev, vault: { ...prev.vault, dept: e.target.value } }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"><option value="">All Departments</option>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Semester</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <select value={filters.vault.semSeason} onChange={e => setFilters(prev => ({ ...prev, vault: { ...prev.vault, semSeason: e.target.value } }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"><option value="">Any</option><option>Winter</option><option>Summer</option></select>
                                    <select value={filters.vault.semYear} onChange={e => setFilters(prev => ({ ...prev, vault: { ...prev.vault, semYear: e.target.value } }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"><option value="">Year</option>{Array.from({ length: 11 }, (_, i) => 2020 + i).map(y => <option key={y}>{y}</option>)}</select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Type</label>
                                <div className="flex bg-slate-100 p-1 rounded-lg">
                                    {['', 'theory', 'lab'].map(t => (
                                        <button key={t} onClick={() => setFilters(prev => ({ ...prev, vault: { ...prev.vault, type: t } }))} className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${filters.vault.type === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>{t === '' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50"><button onClick={() => setShowVaultFilter(false)} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-indigo-700">Apply Filters</button></div>
                    </div>
                </div>
            )}

            {/* MATERIALS FILTER DRAWER */}
            {showMaterialsFilter && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowMaterialsFilter(false)}></div>
                    <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><i className="fas fa-filter text-indigo-500"></i> Filters</h2>
                            <button onClick={() => setShowMaterialsFilter(false)} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full shadow-sm border border-slate-100"><i className="fas fa-times"></i></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Search</label>
                                <input type="text" value={filters.materials.search} onChange={e => setFilters(prev => ({ ...prev, materials: { ...prev.materials, search: e.target.value } }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="Topic..." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Category</label>
                                <select value={filters.materials.type} onChange={e => setFilters(prev => ({ ...prev, materials: { ...prev.materials, type: e.target.value } }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"><option value="">All Types</option><option value="book">Books</option><option value="slide">Slides</option><option value="note">Notes</option></select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Faculty</label>
                                <select value={filters.materials.teacher} onChange={e => setFilters(prev => ({ ...prev, materials: { ...prev.materials, teacher: e.target.value } }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"><option value="">All Faculty</option>{teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Course</label>
                                <select value={filters.materials.course} onChange={e => setFilters(prev => ({ ...prev, materials: { ...prev.materials, course: e.target.value } }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"><option value="">All Courses</option>{[...new Set(materials.map(m => m.courseCode))].sort().map(c => <option key={c} value={c}>{c}</option>)}</select>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50"><button onClick={() => setShowMaterialsFilter(false)} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-indigo-700">Apply Filters</button></div>
                    </div>
                </div>
            )}

            {/* TOAST */}
            <div className={`fixed top-6 right-6 z-[70] transform transition-transform duration-300 bg-white border-l-4 shadow-2xl shadow-slate-300/50 rounded-lg p-5 flex items-start gap-4 min-w-[320px] ${toast.show ? 'translate-x-0' : 'translate-x-[150%]'} ${toast.type === 'error' ? 'border-red-500' : 'border-indigo-500'}`}>
                <div className="mt-0.5"><i className={`fas text-xl ${toast.type === 'error' ? 'fa-exclamation-circle text-red-500' : 'fa-check-circle text-indigo-500'}`}></i></div>
                <div><h4 className="font-bold text-slate-900 text-sm">{toast.title}</h4><p className="text-sm text-slate-500 mt-1">{toast.msg}</p></div>
            </div>
        </div>
    );
}
