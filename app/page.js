'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import jsPDF from 'jspdf';
import Papa from 'papaparse';

// --- SUPABASE CONFIGURATION ---
const SUPABASE_URL = 'https://nfahvsssiokaprylfrxv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mYWh2c3NzaW9rYXByeWxmcnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNDg2MDEsImV4cCI6MjA3OTkyNDYwMX0.yiq_rqI7_EDNX3eAnK50pgafFjZICoCrhnf8IStwpKs';

// --- COURSE DATABASE ---
const COURSE_DB = [
    { code: "0031CSE320", name: "Technical Writing and Research Methodology", credits: 3, type: "theory" },
    { code: "0031ORE101", name: "Freshman Orientation", credits: 0.5, type: "theory" },
    { code: "0222SOC113", name: "Bangladesh Studies", credits: 3, type: "theory" },
    { code: "0223HUM311", name: "Engineering Ethics and Professional Practice", credits: 3, type: "theory" },
    { code: "0232ENG100", name: "English Fundamentals", credits: 3, type: "theory" },
    { code: "0232ENG117", name: "Composition", credits: 3, type: "theory" },
    { code: "0311HUM319", name: "Engineering Economics", credits: 3, type: "theory" },
    { code: "0411ACC227", name: "Financial, Cost, and Managerial Accounting", credits: 3, type: "theory" },
    { code: "0413CSE339", name: "Industrial and Operational Management", credits: 3, type: "theory" },
    { code: "0533PHY217", name: "Physics", credits: 3, type: "theory" },
    { code: "0541MAT113", name: "Differential and Integral Calculus", credits: 3, type: "theory" },
    { code: "0541MAT135", name: "Discrete Mathematics", credits: 3, type: "theory" },
    { code: "0541MAT225", name: "Coordinate Geometry and Vector Calculus", credits: 3, pre: "0541MAT113", type: "theory" },
    { code: "0541MAT319", name: "Linear Algebra, Fourier Analysis and Laplace Transformation", credits: 3, pre: "0541MAT113", type: "theory" },
    { code: "0541MAT327", name: "Numerical Methods", credits: 3, type: "theory" },
    { code: "0541MAT337", name: "Mathematical Analysis for Computer Science", credits: 3, pre: "0541MAT113", type: "theory" },
    { code: "0542MAT237", name: "Differential Equations and Probability", credits: 3, pre: "0541MAT113", type: "theory" },
    { code: "0611CSE115", name: "Computer Applications and Future Aspects", credits: 3, type: "theory" },
    { code: "0611CSE121", name: "Data Structures and Algorithms I", credits: 3, pre: "0613CSE123", type: "theory" },
    { code: "0611CSE122", name: "Data Structure and Algorithms I Sessional", credits: 1.5, type: "lab" },
    { code: "0611CSE133", name: "Digital Logic Design", credits: 3, type: "theory" },
    { code: "0611CSE134", name: "Digital Logic Design Sessional", credits: 1.5, type: "lab" },
    { code: "0611CSE231", name: "Data Structures and Algorithms II", credits: 3, pre: "0613CSE123", type: "theory" },
    { code: "0611CSE232", name: "Data Structures and Algorithms II Sessional", credits: 1.5, type: "lab" },
    { code: "0611CSE233", name: "Computer Organization and Architecture", credits: 3, pre: "0611CSE133", type: "theory" },
    { code: "0611CSE234", name: "Computer Organization and Architecture Sessional", credits: 1.5, type: "lab" },
    { code: "0611CSE313", name: "Operating System", credits: 3, type: "theory" },
    { code: "0611CSE314", name: "Operating System Sessional", credits: 1.5, type: "lab" },
    { code: "0611CSE321", name: "Artificial Intelligence and Expert System", credits: 3, type: "theory" },
    { code: "0611CSE322", name: "Artificial Intelligence and Expert System Sessional", credits: 1.5, type: "lab" },
    { code: "0611CSE327", name: "Microprocessors, Microcontrollers and Embedded Systems", credits: 3, type: "theory" },
    { code: "0611CSE328", name: "Microprocessors, Microcontrollers, and Embedded Systems Sessional", credits: 1.5, type: "lab" },
    { code: "0612CSE223", name: "Database Management System", credits: 3, type: "theory" },
    { code: "0612CSE224", name: "Database Management System Sessional", credits: 1.5, type: "lab" },
    { code: "0612CSE315", name: "Computer Network", credits: 3, type: "theory" },
    { code: "0612CSE316", name: "Computer Network Sessional", credits: 1.5, type: "lab" },
    { code: "0612CSE335", name: "Data Communication", credits: 3, type: "theory" },
    { code: "0612CSE361", name: "Software Architecture", credits: 3, type: "theory" },
    { code: "0612CSI381", name: "Data Mining and Knowledge Discovery", credits: 3, type: "theory" },
    { code: "0612CSI382", name: "Data Mining and Knowledge Discovery Sessional", credits: 1.5, type: "lab" },
    { code: "0613CSE123", name: "Structured Programming Language", credits: 3, type: "theory" },
    { code: "0613CSE124", name: "Structured Programming Language Sessional", credits: 1.5, type: "lab" },
    { code: "0613CSE217", name: "Object Oriented Programming", credits: 3, pre: "0613CSE123", type: "theory" },
    { code: "0613CSE218", name: "Object Oriented Programming Sessional", credits: 1.5, type: "lab" },
    { code: "0613CSE333", name: "Advanced Programming", credits: 3, type: "theory" },
    { code: "0613CSE334", name: "Advanced Programming Sessional", credits: 1.5, type: "lab" },
    { code: "0613CSE343", name: "Web Programming and Publishing", credits: 3, type: "theory" },
    { code: "0613CSE344", name: "Web Programming and Publishing Sessional", credits: 1.5, type: "lab" },
    { code: "0613CSE400", name: "Project and Thesis", credits: 3, type: "theory" },
    { code: "0613CSE411", name: "Automata Theory and Compiler", credits: 3, type: "theory" },
    { code: "0613CSE412", name: "Automata Theory and Compiler Sessional", credits: 1.5, type: "lab" },
    { code: "0613CSE413", name: "Computer Graphics", credits: 3, type: "theory" },
    { code: "0613CSE414", name: "Computer Graphics Sessional", credits: 1.5, type: "lab" },
    { code: "0613CSE431", name: "System Design and Software Engineering", credits: 3, type: "theory" },
    { code: "0613CSE432", name: "System Design and Software Engineering Sessional", credits: 1.5, type: "lab" },
    { code: "0613CSE441", name: "Computer and Cyber Security", credits: 3, type: "theory" },
    { code: "0613CSE477", name: "Computer Vision", credits: 3, type: "theory" },
    { code: "0613CSE487", name: "Mobile Applications Development", credits: 3, type: "theory" },
    { code: "0613CSI483", name: "Machine Learning", credits: 3, type: "theory" },
    { code: "0713EEE193", name: "Electrical Circuit and Devices", credits: 3, type: "theory" },
    { code: "0714CSE213", name: "Digital Electronics and Pulse Technique", credits: 3, pre: "0714EEE195", type: "theory" },
    { code: "0714CSE214", name: "Digital Electronics and Pulse Technique Sessional", credits: 1.5, type: "lab" },
    { code: "0714EEE195", name: "Electronics", credits: 3, pre: "0713EEE193", type: "theory" },
    { code: "0714EEE196", name: "Electronics Sessional", credits: 1.5, type: "lab" },
    { code: "CSI467", name: "Software Project Management", credits: 3, type: "theory" }
];

const DEPARTMENTS = [
    'Business Administration', 'Pharmacy', 'Microbiology', 'Environmental Science', 'English', 'Economics', 'Film and Media Studies', 'Journalism and Media Studies', 'Public Administration', 'Law', 'Computer Science & Engineering', 'Electrical & Electronic Engineering', 'Civil Engineering', 'Architecture', 'Visiting Faculty'
];

export default function QVaultApp() {
    // --- STATE ---
    const [supabase, setSupabase] = useState(null);
    const [view, setView] = useState('notices');
    const [teachers, setTeachers] = useState([]);
    const [papers, setPapers] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [thesisPapers, setThesisPapers] = useState([]);
    const [pendingPapers, setPendingPapers] = useState([]);
    const [pendingMaterials, setPendingMaterials] = useState([]);
    const [pendingThesis, setPendingThesis] = useState([]);
    
    // Notices State Hooks
    const [notices, setNotices] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isNoticeAutoplay, setIsNoticeAutoplay] = useState(true);
    const [showNoticeLightbox, setShowNoticeLightbox] = useState(false);
    const [lightboxNotice, setLightboxNotice] = useState(null);
    const [noticeSearchQuery, setNoticeSearchQuery] = useState('');
    const [isSubmittingNotice, setIsSubmittingNotice] = useState(false);
    const [noticeForm, setNoticeForm] = useState({
        title: '',
        imageUrl: '',
        expiresAt: '',
        targetBatch: '',
        file: null
    });

    // Course Outlines State Hooks
    const [courseOutlines, setCourseOutlines] = useState([]);
    const [outlineSearchQuery, setOutlineSearchQuery] = useState('');
    const [onlyWithOutlines, setOnlyWithOutlines] = useState(false);
    const [outlineForm, setOutlineForm] = useState({
        courseCode: '',
        courseName: '',
        outlineUrl: '',
        file: null
    });
    const [user, setUser] = useState(null); // 'admin' or null
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallModal, setShowInstallModal] = useState(false);
    const [adminTab, setAdminTab] = useState('uploads');
    
    // Blood Bank State
    const [bloodDonors, setBloodDonors] = useState([]);
    const [bloodFilter, setBloodFilter] = useState({
        group: 'All',
        dept: 'All',
        gender: 'All',
        donorStatus: 'All',
        willingness: 'All'
    });
    const [adminBloodFile, setAdminBloodFile] = useState(null);
    const [showBloodModal, setShowBloodModal] = useState(false);
    const [singleBloodForm, setSingleBloodForm] = useState({
        name: '', department: 'Computer Science & Engineering', batch: '', gender: 'Male', contact: '', blood_group: 'A+', is_donor: false, willingness: 5
    });
    
    // Missing State Variables
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const [showTeacherModal, setShowTeacherModal] = useState(false);
    const [teacherForm, setTeacherForm] = useState({ id: '', name: '', dept: DEPARTMENTS[10], desig: '', bio: '', img: '', courses: [] });
    const [imgStatus, setImgStatus] = useState('');
    const [newCourseCode, setNewCourseCode] = useState('');
    const [newCourseOngoing, setNewCourseOngoing] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showVaultFilter, setShowVaultFilter] = useState(false);
    const [showMaterialsFilter, setShowMaterialsFilter] = useState(false);
    const [teacherProfileId, setTeacherProfileId] = useState(null);
    const [homeSearchQuery, setHomeSearchQuery] = useState('');
    
    // New State for Course List
    const [courseListDept, setCourseListDept] = useState('Computer Science & Engineering');
    
    // Blood Bank Filter State
    const [showBloodFilter, setShowBloodFilter] = useState(false);

    // Upload Form State
    const [uploadType, setUploadType] = useState('paper'); // 'paper' or 'material'
    const [uploadFormData, setUploadFormData] = useState({
        dept: 'Computer Science & Engineering',
        semSeason: 'Fall',
        semYear: '2025',
        type: 'theory', // course type
        matType: 'slide', // material type
        code: '',
        name: '',
        exam: 'Mid',
        teacherId: 'Additional',
        thesisTitle: '', author: '', studentId: '', supervisorId: 'Additional', abstract: '',
        thesisType: 'thesis', thesisCategory: '', projectLink: '',
        courseMaterialsLink: '', pdfUploadLink: '',
        keywords: '', slidesLink: ''
    });
    const [uploadFile, setUploadFile] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [showCatboxTutorial, setShowCatboxTutorial] = useState(false);

    // Searchable Dropdown States
    const [teacherSearch, setTeacherSearch] = useState('');
    const [showTeacherDropdown, setShowTeacherDropdown] = useState(false);
    const [supervisorSearch, setSupervisorSearch] = useState('');
    const [showSupervisorDropdown, setShowSupervisorDropdown] = useState(false);

    const [isConvertingToPDF, setIsConvertingToPDF] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Filters State
    const [filters, setFilters] = useState({
        vault: { search: '', dept: '', semSeason: '', semYear: '', type: '', course: '' },
        materials: { search: '', dept: '', semSeason: '', semYear: '', teacher: '', course: '', type: '' },
        faculty: { search: '', dept: 'Computer Science & Engineering' },
        adminPaper: { search: '' },
        adminMaterial: { search: '' },
        adminThesis: { search: '' }
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
            const { data, error } = await supabase.from(table).select('*');
            if (error) console.error(`Error fetching ${table}:`, error);
            if (data) setter(data);
        };

        const tables = [
            { name: 'teachers', setter: setTeachers },
            { name: 'papers', setter: setPapers },
            { name: 'pending_papers', setter: setPendingPapers },
            { name: 'materials', setter: setMaterials },
            { name: 'pending_materials', setter: setPendingMaterials },
            { name: 'thesis_papers', setter: setThesisPapers },
            { name: 'pending_thesis_papers', setter: setPendingThesis },
            { name: 'blood_donors', setter: setBloodDonors },
            { name: 'notices', setter: setNotices },
            { name: 'course_outlines', setter: setCourseOutlines },
        ];

        // Fetch initial data
        tables.forEach(t => fetchData(t.name, t.setter));

        // Realtime Subscription
        console.log('Attempting to subscribe to real-time changes...');
        const channel = supabase.channel('db-changes');
        
        tables.forEach(t => {
            channel.on('postgres_changes', { event: '*', schema: 'public', table: t.name }, (payload) => {
                console.log(`Realtime update received for ${t.name}:`, payload.eventType);
                const { eventType, new: newRow, old: oldRow } = payload;
                t.setter(prev => {
                    if (eventType === 'INSERT') return [...prev, newRow];
                    if (eventType === 'DELETE') return prev.filter(i => i.id !== oldRow.id);
                    if (eventType === 'UPDATE') return prev.map(i => i.id === newRow.id ? newRow : i);
                    return prev;
                });
            });
        });

        channel.subscribe((status) => {
            console.log(`Supabase Realtime Status: ${status}`);
            if (status === 'SUBSCRIBED') {
                // showToast('Connected', 'Real-time updates active', 'success');
            }
            if (status === 'CHANNEL_ERROR') {
                console.error('Realtime channel error. Check your network or Supabase project settings.');
            }
        });

        // Init Upload Form Codes
        updateCourseOptions('theory');

        return () => {
             console.log('Cleaning up subscription...');
             supabase.removeChannel(channel);
        };
    }, [supabase]);

    // notices autoplay effect (6s swap, pauses if isNoticeAutoplay is false)
    useEffect(() => {
        const activeNotices = notices.filter(n => new Date(n.expires_at) > new Date());
        if (activeNotices.length <= 1 || !isNoticeAutoplay) return;

        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % activeNotices.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [notices, isNoticeAutoplay]);

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

    // 4. History State Management (Native Back Button)
    useEffect(() => {
        // Initial state
        window.history.replaceState({ view: 'home' }, '', '#home');

        const onPopState = (event) => {
            if (event.state && event.state.view) {
                setView(event.state.view);
            } else {
                setView('home');
            }
        };

        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
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

    const parseThesisAbstract = (combinedText) => {
        if (!combinedText) return { abstract: '', keywords: '', slidesLink: '' };
        
        let abstractText = combinedText;
        let keywords = '';
        let slidesLink = '';
        
        // Match Keywords (case-insensitive, matching until end of line or next section)
        const keywordsMatch = combinedText.match(/(?:\r?\n)*Keywords:\s*([^\r\n]+)/i);
        if (keywordsMatch) {
            keywords = keywordsMatch[1].trim();
            abstractText = abstractText.replace(/(?:\r?\n)*Keywords:\s*[^\r\n]+/i, '');
        }
        
        // Match Presentation Slides (case-insensitive)
        const slidesMatch = combinedText.match(/(?:\r?\n)*Presentation Slides:\s*([^\r\n\s]+)/i);
        if (slidesMatch) {
            slidesLink = slidesMatch[1].trim();
            abstractText = abstractText.replace(/(?:\r?\n)*Presentation Slides:\s*[^\r\n\s]+/i, '');
        }
        
        return { 
            abstract: abstractText.trim(), 
            keywords: keywords, 
            slidesLink: slidesLink 
        };
    };

    const updateTeacherCourseHistory = async (teacherId, courseCode, courseName) => {
        if (!supabase || !teacherId) return;
        
        // Find the teacher in state or database
        const teacher = teachers.find(t => t.id == teacherId);
        if (!teacher) return;
        
        const currentCourses = teacher.courses || [];
        // Check if the course code already exists in their course history
        const alreadyExists = currentCourses.some(c => c.code === courseCode);
        
        if (!alreadyExists) {
            const updatedCourses = [
                ...currentCourses,
                { code: courseCode, name: courseName, ongoing: false }
            ];
            
            // Save the updated courses back to Supabase
            const { error } = await supabase
                .from('teachers')
                .update({ courses: updatedCourses })
                .eq('id', teacherId);
                
            if (error) {
                console.error('Error updating teacher course history:', error);
            } else {
                console.log(`Successfully added ${courseCode} to teacher ${teacher.name}'s course history`);
            }
        }
    };

    const navigate = (newView) => {
        window.history.pushState({ view: newView }, '', `#${newView}`);
        setView(newView);
    };

    // --- BLOOD BANK LOGIC ---
    const handleBloodCSVUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        Papa.parse(file, {
            header: true,
            complete: async (results) => {
                console.log('Parsed CSV:', results.data);
                const donors = results.data.map(row => {
                    // Support multiple column name variations (including Google Forms exports)
                    const name = row.Name || row.name || row['Full Name'] || row['full name'];
                    const department = row.Dept || row.Department || row.department || row.dept;
                    const batch = row.Batch || row.batch;
                    const gender = row.Gender || row.gender;
                    const contact = row.Contact || row.contact || row['Contact Number'] || row['contact number'] || row.Phone || row.phone;
                    const blood_group = row.BloodGroup || row.blood_group || row['Blood Group'] || row['blood group'];
                    const previousDonor = row.PreviousDonor || row.is_donor || row['Previous Donor'] || row['Have you donated blood before?'];
                    const is_donor = previousDonor === 'Yes' || previousDonor === true || previousDonor === 'true' || previousDonor === 'yes';
                    const willingnessValue = row.Willingness || row.willingness || row['Willingness to Donate'] || row['willingness to donate'] || '5';
                    const willingness = parseInt(willingnessValue) || 5;
                    
                    return { name, department, batch, gender, contact, blood_group, is_donor, willingness };
                }).filter(d => d.name && d.blood_group);

                if (donors.length === 0) return showToast('Error', 'No valid rows found', 'error');

                const { error } = await supabase.from('blood_donors').insert(donors);
                if (error) showToast('Error', error.message, 'error');
                else {
                    showToast('Success', `Imported ${donors.length} donors!`);
                    setAdminBloodFile(null);
                }
            },
            error: (err) => showToast('Error', 'CSV Parse Error', 'error')
        });
    };

    const handleSingleBloodAdd = async () => {
        if (singleBloodForm.id) {
            // Update existing donor
            const { error } = await supabase.from('blood_donors').update(singleBloodForm).eq('id', singleBloodForm.id);
            if (error) showToast('Error', error.message, 'error');
            else {
                showToast('Success', 'Donor updated!');
                setShowBloodModal(false);
                setSingleBloodForm({ name: '', department: 'Computer Science & Engineering', batch: '', gender: 'Male', contact: '', blood_group: 'A+', is_donor: false, willingness: 5 });
            }
        } else {
            // Add new donor
            const { error } = await supabase.from('blood_donors').insert(singleBloodForm);
            if (error) showToast('Error', error.message, 'error');
            else {
                showToast('Success', 'Donor added!');
                setShowBloodModal(false);
                setSingleBloodForm({ name: '', department: 'Computer Science & Engineering', batch: '', gender: 'Male', contact: '', blood_group: 'A+', is_donor: false, willingness: 5 });
            }
        }
    };
    
    const deleteDonor = async (id) => {
        if(!confirm("Delete this donor?")) return;
        const { error } = await supabase.from('blood_donors').delete().eq('id', id);
        if(error) showToast('Error', error.message, 'error');
        else showToast('Success', 'Donor deleted');
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

    const handleFileChange = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Check if images were selected
        const firstFile = files[0];
        if (firstFile.type.startsWith('image/')) {
            // Handle images - add to existing selection (max 4 total)
            const newImages = Array.from(files);
            setSelectedImages(prev => {
                const combined = [...prev, ...newImages];
                return combined.slice(0, 4); // Max 4 images total
            });
            setUploadFile(null); // Clear any previous PDF
            e.target.value = ''; // Reset input to allow selecting same file again
        } else if (firstFile.type === 'application/pdf') {
            // Check if size is larger than 4.5 MB
            if (firstFile.size > 4.5 * 1024 * 1024) {
                setShowCatboxTutorial(true);
                showToast('File Too Large', 'PDF size exceeds 4.5MB. Please upload manually.', 'error');
                e.target.value = ''; // Reset input
                return;
            }
            // Handle PDF directly
            setUploadFile(firstFile);
            setSelectedImages([]); // Clear any selected images
        }
    };

    const removeImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const convertImagesToPDF = async () => {
        if (selectedImages.length === 0) return null;
        
        setIsConvertingToPDF(true);
        
        try {
            console.log('Starting PDF conversion for', selectedImages.length, 'images');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            const pageWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const margin = 10;
            
            for (let i = 0; i < selectedImages.length; i++) {
                const imageFile = selectedImages[i];
                console.log(`Processing image ${i+1}/${selectedImages.length}:`, imageFile.name);
                
                // Read image as data URL
                const imageData = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.onerror = (e) => reject(new Error('Failed to read image'));
                    reader.readAsDataURL(imageFile);
                });
                
                // Get image dimensions
                const img = await new Promise((resolve, reject) => {
                    const image = new Image();
                    image.onload = () => resolve(image);
                    image.onerror = () => reject(new Error('Failed to load image'));
                    image.src = imageData;
                });
                
                // Calculate dimensions to fit page while maintaining aspect ratio
                const imgWidth = img.width;
                const imgHeight = img.height;
                const ratio = Math.min(
                    (pageWidth - 2 * margin) / imgWidth,
                    (pageHeight - 2 * margin) / imgHeight
                );
                
                const width = imgWidth * ratio;
                const height = imgHeight * ratio;
                const x = (pageWidth - width) / 2;
                const y = (pageHeight - height) / 2;
                
                // Add new page for each image except the first
                if (i > 0) pdf.addPage();
                
                // Add image to PDF
                pdf.addImage(imageData, 'JPEG', x, y, width, height);
            }
            
            // Convert PDF to blob
            const pdfBlob = pdf.output('blob');
            const pdfFile = new File([pdfBlob], 'question.pdf', { type: 'application/pdf' });
            
            console.log('PDF created successfully, size:', pdfBlob.size, 'bytes');
            setIsConvertingToPDF(false);
            return pdfFile;
            
        } catch (error) {
            console.error('Error converting images to PDF:', error);
            setIsConvertingToPDF(false);
            showToast('Error', 'Failed to convert images to PDF: ' + error.message, 'error');
            return null;
        }
    };

    const submitUpload = async () => {
        if (!supabase) return showToast('Error', 'Database connection not ready', 'error');
        
        let url = '';
        
        // Determine URL depending on links
        if (uploadType === 'material') {
            if (uploadFormData.matType === 'course_link' && !uploadFormData.courseMaterialsLink) {
                return showToast('Error', 'Please provide the Course Materials Link', 'error');
            }
            
            if (uploadFormData.courseMaterialsLink) {
                url = uploadFormData.courseMaterialsLink;
            } else if (uploadFormData.pdfUploadLink) {
                url = uploadFormData.pdfUploadLink;
            }
        }
        
        // If we don't have a URL link from the form, we must upload a file
        if (!url) {
            let fileToUpload = uploadFile;
            
            // If images are selected, convert them to PDF first
            if (selectedImages.length > 0) {
                fileToUpload = await convertImagesToPDF();
                if (!fileToUpload) return; // Conversion failed
            }
            
            if (!fileToUpload) {
                return showToast('Error', 'Please select a PDF file, select images, or provide a link', 'error');
            }
            
            // Check size limits before uploading
            if (fileToUpload.size > 4.5 * 1024 * 1024) {
                setShowCatboxTutorial(true);
                return showToast('File Too Large', 'PDF size exceeds 4.5MB limit. Please upload manually.', 'error');
            }
            
            setIsUploading(true);
            try {
                console.log('Uploading file:', fileToUpload.name, 'Size:', fileToUpload.size, 'bytes');
                
                // Generate unique filename
                const timestamp = Date.now();
                const randomStr = Math.random().toString(36).substring(2, 8);
                const fileName = `${uploadType}_${timestamp}_${randomStr}.pdf`;
                const filePath = `uploads/${fileName}`;
                
                // Upload to Supabase Storage
                console.log('Uploading to Supabase Storage...');
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('qvault-files')
                    .upload(filePath, fileToUpload, {
                        cacheControl: '3600',
                        upsert: false
                    });
                
                if (uploadError) {
                    console.error('Supabase upload error:', uploadError);
                    throw new Error('Upload failed: ' + uploadError.message);
                }
                
                // Get public URL
                const { data: urlData } = supabase.storage
                    .from('qvault-files')
                    .getPublicUrl(filePath);
                
                url = urlData.publicUrl;
                console.log('File uploaded successfully:', url);
            } catch (e) {
                console.error('Upload Error:', e);
                showToast('Error', e.message || 'Upload failed', 'error');
                setIsUploading(false);
                return;
            }
        } else {
            // Check link validity if they paste one
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                return showToast('Error', 'Please enter a valid link starting with http:// or https://', 'error');
            }
        }
        
        setIsUploading(true);
        try {
            if (uploadType === 'thesis') {
                let combinedAbstract = uploadFormData.abstract || '';
                if (uploadFormData.keywords) {
                    combinedAbstract += `\n\nKeywords: ${uploadFormData.keywords}`;
                }
                if (uploadFormData.slidesLink) {
                    combinedAbstract += `\n\nPresentation Slides: ${uploadFormData.slidesLink}`;
                }

                const thesisData = {
                    title: uploadFormData.thesisTitle,
                    author: uploadFormData.author,
                    studentid: uploadFormData.studentId,
                    dept: uploadFormData.dept,
                    year: parseInt(uploadFormData.semYear),
                    semester: uploadFormData.semSeason,
                    supervisorid: uploadFormData.supervisorId,
                    abstract: combinedAbstract,
                    fileurl: url,
                    type: uploadFormData.thesisType,
                    category: uploadFormData.thesisCategory,
                    project_link: uploadFormData.projectLink
                };
                const { error } = await supabase.from('pending_thesis_papers').insert(thesisData);
                if (error) throw error;
            } else {
                const commonData = {
                    courseCode: uploadFormData.code,
                    courseName: uploadFormData.name,
                    semester: `${uploadFormData.semSeason} ${uploadFormData.semYear}`,
                    dept: uploadFormData.dept,
                    teacherId: uploadFormData.teacherId,
                    fileUrl: url
                };

                if (uploadType === 'paper') {
                    const { error } = await supabase.from('pending_papers').insert({ ...commonData, exam: uploadFormData.exam, type: uploadFormData.type });
                    if (error) throw error;
                } else {
                    const { error } = await supabase.from('pending_materials').insert({ ...commonData, type: uploadFormData.matType });
                    if (error) throw error;
                }
            }

            showToast('Success', 'Submitted for approval', 'success');
            setShowUploadModal(false);
            setUploadFile(null);
            setSelectedImages([]);
            setUploadFormData(prev => ({
                ...prev,
                courseMaterialsLink: '',
                pdfUploadLink: '',
                keywords: '',
                slidesLink: ''
            }));
        } catch (e) {
            console.error('Database Error:', e);
            showToast('Error', e.message || 'Database submission failed', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    // --- ADMIN LOGIC ---
    const handleLogin = (e) => {
        e.preventDefault();
        const id = e.target.elements.id.value;
        const pass = e.target.elements.pass.value;
        if (id === 'sub-admin' && pass === 'admin2025') {
            setUser('admin');
            setShowLoginModal(false);
            navigate('admin');
        } else {
            alert('Invalid Credentials');
        }
    };

    const approveItem = async (item, type) => {
        if (!supabase) return;
        
        let payload = {};
        let targetTable = '';
        let sourceTable = '';

        if (type === 'thesis') {
            payload = {
                title: item.title,
                author: item.author,
                studentid: item.studentid || item.studentId,
                dept: item.dept,
                year: item.year,
                semester: item.semester,
                supervisorid: item.supervisorid || item.supervisorId,
                abstract: item.abstract,
                fileurl: item.fileurl || item.fileUrl,
                type: item.type || 'thesis',
                category: item.category,
                project_link: item.project_link || item.projectLink
            };
            targetTable = 'thesis_papers';
            sourceTable = 'pending_thesis_papers';
        } else {
            // Explicitly construct payload to avoid schema mismatch
            payload = {
                courseCode: item.courseCode,
                courseName: item.courseName,
                semester: item.semester,
                dept: item.dept,
                teacherId: item.teacherId,
                fileUrl: item.fileUrl,
                ...(type === 'paper' ? { exam: item.exam, type: item.type } : { type: item.type })
            };
            targetTable = 'papers';
            sourceTable = type === 'paper' ? 'pending_papers' : 'pending_materials';
            if (type === 'material') targetTable = 'materials';
        }

        const { error: insertError } = await supabase.from(targetTable).insert(payload);
        if (insertError) {
            console.error('Approve Insert Error:', insertError);
            showToast('Error', 'Insert failed: ' + insertError.message, 'error');
            return;
        }

        // Successfully approved! Update Teacher's Course History automatically
        if (type === 'paper' || type === 'material') {
            await updateTeacherCourseHistory(item.teacherId, item.courseCode, item.courseName);
        }

        const { error: deleteError, data: deleteData } = await supabase.from(sourceTable).delete().eq('id', item.id).select();
        
        if (deleteError) {
            console.error('Approve Delete Error:', deleteError);
            showToast('Warning', 'Approved but failed to remove from pending', 'warning');
        } else if (!deleteData || deleteData.length === 0) {
            console.error('Approve Delete Failed: No rows deleted');
            showToast('Warning', 'Approved, but could not remove from pending (Permission Issue)', 'warning');
        } else {
            // Manually update local state
            if (type === 'paper') {
                setPendingPapers(prev => prev.filter(i => i.id !== item.id));
            } else if (type === 'material') {
                setPendingMaterials(prev => prev.filter(i => i.id !== item.id));
            } else if (type === 'thesis') {
                setPendingThesis(prev => prev.filter(i => i.id !== item.id));
            }
            showToast('Approved', 'Item added to database');
        }
    };

    const rejectItem = async (id, type) => {
        if (!supabase) return;
        if (!confirm('Reject this item?')) return;
        
        // Optimistic Update
        if (type === 'paper') {
            setPendingPapers(prev => prev.filter(i => i.id !== id));
        } else if (type === 'material') {
            setPendingMaterials(prev => prev.filter(i => i.id !== id));
        } else if (type === 'thesis') {
            setPendingThesis(prev => prev.filter(i => i.id !== id));
        }

        let table = '';
        if (type === 'paper') table = 'pending_papers';
        else if (type === 'material') table = 'pending_materials';
        else if (type === 'thesis') table = 'pending_thesis_papers';
        
        const { error } = await supabase.from(table).delete().eq('id', id);
        
        if (error) {
            console.error('Reject Error:', error);
            showToast('Error', 'Reject failed: ' + error.message, 'error');
            // Revert state if needed (omitted for simplicity, but recommended for production)
        } else {
            showToast('Rejected', 'Item removed');
        }
    };

    const deleteItem = async (id, table) => {
        if (!supabase) return;
        if (!confirm('Delete permanently?')) return;
        
        // Clean up Supabase Storage file for deleted notice images
        if (table === 'notices') {
            const noticeObj = notices.find(n => n.id === id);
            if (noticeObj && noticeObj.image_url && noticeObj.image_url.includes('/qvault-files/')) {
                const parts = noticeObj.image_url.split('/qvault-files/');
                if (parts.length > 1) {
                    const filePath = parts[1];
                    console.log('Cleaning up notice image from Supabase Storage:', filePath);
                    const { error: storageErr } = await supabase.storage
                        .from('qvault-files')
                        .remove([filePath]);
                    if (storageErr) {
                        console.error('Failed to delete notice image from storage:', storageErr);
                    }
                }
            }
        }

        // Optimistic Update
        if (table === 'papers') {
            setPapers(prev => prev.filter(i => i.id !== id));
        } else if (table === 'materials') {
            setMaterials(prev => prev.filter(i => i.id !== id));
        } else if (table === 'teachers') {
            setTeachers(prev => prev.filter(i => i.id !== id));
        } else if (table === 'thesis_papers') {
            setThesisPapers(prev => prev.filter(i => i.id !== id));
        } else if (table === 'notices') {
            setNotices(prev => prev.filter(i => i.id !== id));
        } else if (table === 'course_outlines') {
            setCourseOutlines(prev => prev.filter(i => i.id !== id));
        }

        const { error } = await supabase.from(table).delete().eq('id', id);
        
        if (error) {
            console.error('Delete Error:', error);
            showToast('Error', 'Delete failed: ' + error.message, 'error');
        } else {
            showToast('Deleted', 'Item removed permanently');
        }
    };

    // --- NOTICES MANAGEMENT LOGIC ---
    const handleNoticeFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNoticeForm(prev => ({
                    ...prev,
                    file: file,
                    imageUrl: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNoticeSubmit = async (e) => {
        e.preventDefault();
        if (!supabase) return;
        if (!noticeForm.imageUrl) {
            alert('Please upload an image or paste a valid image URL!');
            return;
        }
        if (!noticeForm.title) {
            alert('Please enter a notice title!');
            return;
        }
        if (!noticeForm.expiresAt) {
            alert('Please specify the expiration date and time!');
            return;
        }

        setIsSubmittingNotice(true);
        try {
            let finalImageUrl = noticeForm.imageUrl;

            // If local file is selected, upload to Supabase Storage
            if (noticeForm.file) {
                console.log('Uploading notice image to Supabase Storage:', noticeForm.file.name);
                const timestamp = Date.now();
                const randomStr = Math.random().toString(36).substring(2, 8);
                const extension = noticeForm.file.name.split('.').pop() || 'png';
                const fileName = `notice_${timestamp}_${randomStr}.${extension}`;
                const filePath = `notices/${fileName}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('qvault-files')
                    .upload(filePath, noticeForm.file, {
                        cacheControl: '365d',
                        upsert: false
                    });

                if (uploadError) {
                    console.error('Supabase notices upload error:', uploadError);
                    throw new Error('Supabase Storage upload failed: ' + uploadError.message);
                }

                // Get public URL
                const { data: urlData } = supabase.storage
                    .from('qvault-files')
                    .getPublicUrl(filePath);

                finalImageUrl = urlData.publicUrl;
                console.log('Notice image uploaded successfully to Supabase Storage:', finalImageUrl);
            }

            const noticeData = {
                title: noticeForm.title,
                image_url: finalImageUrl,
                expires_at: new Date(noticeForm.expiresAt).toISOString(),
                target_batch: noticeForm.targetBatch || 'All Students',
                created_at: new Date().toISOString()
            };

            const { error } = await supabase.from('notices').insert(noticeData);
            if (error) {
                throw error;
            }
            
            setNoticeForm({ title: '', imageUrl: '', expiresAt: '', targetBatch: '', file: null });
            showToast('Published', 'Notice uploaded successfully', 'success');
        } catch (error) {
            console.error('Error adding notice:', error);
            showToast('Error', 'Publish notice failed: ' + error.message, 'error');
        } finally {
            setIsSubmittingNotice(false);
        }
    };

    const pruneExpiredNotices = async () => {
        if (!supabase) return;
        const expired = notices.filter(n => new Date(n.expires_at) <= new Date());
        if (expired.length === 0) {
            alert('No expired notices to clean up!');
            return;
        }
        if (confirm(`Are you sure you want to clean up ${expired.length} expired notices?`)) {
            // Optimistic update: filter out expired notices immediately
            const expiredIds = expired.map(n => n.id);
            setNotices(prev => prev.filter(n => !expiredIds.includes(n.id)));

            try {
                // 1. Gather all file paths from the expired notices that reside in our Supabase bucket
                const filePathsToDelete = expired
                    .filter(n => n.image_url && n.image_url.includes('/qvault-files/'))
                    .map(n => {
                        const parts = n.image_url.split('/qvault-files/');
                        return parts.length > 1 ? parts[1] : null;
                    })
                    .filter(path => path !== null);

                // 2. Clean up Supabase Storage files in a single bulk operation
                if (filePathsToDelete.length > 0) {
                    console.log('Cleaning up expired notice images from Supabase Storage:', filePathsToDelete);
                    const { error: storageErr } = await supabase.storage
                        .from('qvault-files')
                        .remove(filePathsToDelete);
                    if (storageErr) {
                        console.error('Failed to delete expired notice images from storage:', storageErr);
                    }
                }

                // 3. Delete notices from the database in a single bulk operation
                const { error: dbErr } = await supabase.from('notices').delete().in('id', expiredIds);
                if (dbErr) {
                    throw dbErr;
                }

                showToast('Cleanup Complete', 'Expired notices and their storage files pruned successfully', 'success');
            } catch (err) {
                console.error('Cleanup Error:', err);
                showToast('Error', 'Cleanup failed: ' + err.message, 'error');
                // Revert notices state by refetching to ensure database consistency
                const { data, error } = await supabase.from('notices').select('*');
                if (!error && data) {
                    setNotices(data);
                }
            }
        }
    };

    // --- COURSE OUTLINES LOGIC ---
    const handleOutlineFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('Please upload a PDF file only!');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setOutlineForm(prev => ({
                    ...prev,
                    file: file,
                    outlineUrl: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleOutlineSubmit = async (e) => {
        e.preventDefault();
        if (!supabase) return;
        if (!outlineForm.outlineUrl) {
            alert('Please upload a PDF file or paste a direct PDF URL!');
            return;
        }
        if (!outlineForm.courseCode) {
            alert('Please select a course code!');
            return;
        }

        const courseObj = COURSE_DB.find(c => c.code === outlineForm.courseCode);
        const courseName = courseObj ? courseObj.name : outlineForm.courseCode;

        const outlineData = {
            course_code: outlineForm.courseCode,
            course_name: courseName,
            outline_url: outlineForm.outlineUrl,
            created_at: new Date().toISOString()
        };

        const existing = courseOutlines.find(o => o.course_code === outlineForm.courseCode);
        
        let error;
        if (existing) {
            const { error: err } = await supabase.from('course_outlines').update(outlineData).eq('id', existing.id);
            error = err;
        } else {
            const { error: err } = await supabase.from('course_outlines').insert(outlineData);
            error = err;
        }

        if (error) {
            console.error('Error adding outline:', error);
            showToast('Error', 'Outline upload failed: ' + error.message, 'error');
        } else {
            setOutlineForm({ courseCode: '', courseName: '', outlineUrl: '', file: null });
            setShowUploadModal(false);
            showToast('Published', 'Course outline published successfully', 'success');
        }
    };

    // --- TEACHER PROFILE LOGIC ---


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
        const { id, desig, ...data } = teacherForm;
        
        // Map 'desig' to 'designation' for database
        const dbData = { ...data, designation: desig };
        
        const { error } = id 
            ? await supabase.from('teachers').update(dbData).eq('id', id)
            : await supabase.from('teachers').insert(dbData);

        if (error) {
            console.error('Error saving teacher:', error);
            alert('Failed to save profile: ' + error.message);
            return;
        }

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
                        <div className="flex items-center cursor-pointer group" onClick={() => navigate('home')}>
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
                                {['notices', 'vault', 'course-outline', 'materials', 'thesis', 'faculty', 'blood-bank'].map(v => {
                                    const activeNoticesCount = notices.filter(n => new Date(n.expires_at) > new Date()).length;
                                    return (
                                        <a key={v} href="#" onClick={(e) => { e.preventDefault(); navigate(v); }} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${view === v ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-indigo-600 hover:bg-white'}`}>
                                            <span>{v === 'blood-bank' ? 'Blood Bank' : v === 'notices' ? 'Notices' : v === 'course-outline' ? 'Course Outline' : v.charAt(0).toUpperCase() + v.slice(1)}</span>
                                            {v === 'notices' && activeNoticesCount > 0 && (
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                </span>
                                            )}
                                        </a>
                                    );
                                })}
                            </div>
                            {deferredPrompt && (
                                <button onClick={installPWA} className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors mr-2 shadow-sm">
                                    <i className="fas fa-download mr-2"></i> Install App
                                </button>
                            )}
                            <a href="#" onClick={(e) => { e.preventDefault(); user ? navigate('admin') : setShowLoginModal(true); }} className="text-slate-400 hover:text-indigo-600 p-2 transition-colors mr-2" title="Admin"><i className="fas fa-cog"></i></a>
                            <button onClick={() => { setUploadType('paper'); setShowUploadModal(true); }} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-slate-900/20 hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                                <i className="fas fa-plus"></i> <span>Upload</span>
                            </button>
                        </div>
                        <div className="flex items-center md:hidden gap-3">
                            {deferredPrompt && <button onClick={installPWA} className="text-indigo-600 bg-indigo-50 border border-indigo-200 p-2.5 rounded-xl shadow-sm animate-pulse"><i className="fas fa-download"></i></button>}
                            <button onClick={() => { setUploadType('paper'); setShowUploadModal(true); }} className="text-white bg-indigo-600 shadow-indigo-500/30 shadow-md p-2.5 rounded-xl"><i className="fas fa-plus"></i></button>
                            <button onClick={() => navigate('notices')} className={`p-2.5 rounded-xl border relative ${view === 'notices' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-600'}`}>
                                <i className="fas fa-bullhorn text-sm"></i>
                                {notices.filter(n => new Date(n.expires_at) > new Date()).length > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                )}
                            </button>
                            <button onClick={() => navigate('course-outline')} className={`p-2.5 rounded-xl border relative ${view === 'course-outline' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-600'}`} title="Course Outlines">
                                <i className="fas fa-file-pdf text-sm"></i>
                            </button>
                            <button onClick={() => navigate('vault')} className="text-slate-600 bg-white border border-slate-200 p-2.5 rounded-xl"><i className="fas fa-search"></i></button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-slate-50">
                
                {/* NOTICES VIEW */}
                {view === 'notices' && (
                    <div className="fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-full">
                        {/* Notice Header Section */}
                        <div className="text-center md:text-left flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6 gap-4">
                            <div>
                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-indigo-100 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider mb-2">Notice Board</div>
                                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">University Announcements</h2>
                                <p className="text-slate-500 mt-1 text-sm">Stay updated with the latest notices, exam schedules, and academic instructions.</p>
                            </div>
                            <div className="flex gap-3 justify-center md:justify-end">
                                <button onClick={() => navigate('home')} className="px-5 py-2 rounded-xl text-slate-700 bg-white border border-slate-200 hover:border-slate-300 font-bold text-sm shadow-sm transition-all flex items-center gap-2"><i className="fas fa-home"></i> Back to Main</button>
                                {user && <button onClick={() => { setAdminTab('notices'); navigate('admin'); }} className="px-5 py-2 rounded-xl text-white bg-slate-900 hover:bg-slate-800 font-bold text-sm shadow-md transition-all flex items-center gap-2"><i className="fas fa-plus"></i> Add Notice</button>}
                            </div>
                        </div>

                        {(() => {
                            const activeNotices = notices.filter(n => new Date(n.expires_at) > new Date());
                            const filteredNotices = activeNotices.filter(n => !noticeSearchQuery || n.title.toLowerCase().includes(noticeSearchQuery.toLowerCase()));

                            return (
                                <>
                                    {/* Slider Section */}
                                    {activeNotices.length > 0 ? (
                                        <div 
                                            className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xl max-w-4xl mx-auto aspect-[16/9] md:aspect-[21/9] group"
                                            onMouseEnter={() => setIsNoticeAutoplay(false)}
                                            onMouseLeave={() => setIsNoticeAutoplay(true)}
                                        >
                                            {/* Slides */}
                                            <div className="relative w-full h-full flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                                                {activeNotices.map((n, idx) => (
                                                    <div key={n.id} className="w-full h-full flex-shrink-0 relative cursor-pointer" onClick={() => { setLightboxNotice(n); setShowNoticeLightbox(true); }}>
                                                        <img src={n.image_url} alt={n.title} className="w-full h-full object-contain bg-slate-950 transition-transform duration-700 group-hover:scale-[1.01]" />
                                                        {/* Info Overlay */}
                                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-4 md:p-6 text-white flex flex-col justify-end">
                                                            <div className="flex items-center justify-between gap-4">
                                                                <div>
                                                                    <h3 className="font-bold text-sm md:text-lg tracking-tight drop-shadow flex items-center gap-2 flex-wrap">
                                                                        <span>{n.title || 'Untitled Announcement'}</span>
                                                                        {n.target_batch && n.target_batch !== 'All Students' ? (
                                                                            <span className="bg-indigo-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-indigo-500 shadow align-middle uppercase tracking-wide">Batch {n.target_batch}</span>
                                                                        ) : (
                                                                            <span className="bg-emerald-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-500 shadow align-middle uppercase tracking-wide">All Students</span>
                                                                        )}
                                                                    </h3>
                                                                    <p className="text-[10px] md:text-xs text-slate-300 flex items-center gap-1.5 mt-1">
                                                                        <i className="fas fa-calendar-alt"></i> Posted: {new Date(n.created_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                                                                        <span className="text-slate-500">•</span>
                                                                        <span className="text-red-400 font-semibold flex items-center gap-1">
                                                                            <i className="fas fa-clock animate-pulse"></i> 
                                                                            {(() => {
                                                                                const diff = new Date(n.expires_at) - new Date();
                                                                                const hours = Math.floor(diff / (1000 * 60 * 60));
                                                                                if (hours < 24) {
                                                                                    return hours <= 0 ? "Expiring shortly" : `Expires in ${hours} hours`;
                                                                                }
                                                                                return `Expires in ${Math.ceil(hours / 24)} days`;
                                                                            })()}
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                                <span className="text-xs font-bold bg-white/10 backdrop-blur border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/25 transition-colors">
                                                                    <i className="fas fa-expand-alt mr-1"></i> View Full
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Navigation Chevrons */}
                                            {activeNotices.length > 1 && (
                                                <>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setCurrentSlide(prev => (prev - 1 + activeNotices.length) % activeNotices.length); }} 
                                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-black/40 backdrop-blur border border-white/15 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 active:scale-95 transition-all shadow-md z-20 hover:bg-black/60"
                                                    >
                                                        <i className="fas fa-chevron-left text-sm md:text-base"></i>
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setCurrentSlide(prev => (prev + 1) % activeNotices.length); }} 
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-black/40 backdrop-blur border border-white/15 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 active:scale-95 transition-all shadow-md z-20 hover:bg-black/60"
                                                    >
                                                        <i className="fas fa-chevron-right text-sm md:text-base"></i>
                                                    </button>
                                                </>
                                            )}

                                            {/* Slider Indicator Dots */}
                                            {activeNotices.length > 1 && (
                                                <div className="absolute bottom-4 right-6 z-20 flex gap-2">
                                                    {activeNotices.map((_, idx) => (
                                                        <button 
                                                            key={idx} 
                                                            onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }} 
                                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-indigo-500 w-5' : 'bg-white/40 hover:bg-white/70'}`}
                                                        ></button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16 bg-white border border-slate-200/60 rounded-2xl max-w-4xl mx-auto shadow-inner flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4 border border-slate-200/80"><i className="fas fa-bullhorn text-2xl"></i></div>
                                            <h3 className="font-extrabold text-slate-800 text-lg">No Active Announcements</h3>
                                            <p className="text-slate-400 text-sm mt-1 max-w-md">There are no university notices currently active. Check back later or notify an administrator.</p>
                                        </div>
                                    )}

                                    {/* Notice Board Search and Grid */}
                                    {activeNotices.length > 0 && (
                                        <div className="space-y-6 max-w-5xl mx-auto">
                                            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm justify-between">
                                                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 self-start sm:self-center"><i className="fas fa-th-large text-indigo-500"></i> All Active Notices ({activeNotices.length})</h3>
                                                <div className="relative w-full sm:w-80">
                                                    <i className="fas fa-search absolute left-3 top-3 text-slate-400 text-sm"></i>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Search announcements..." 
                                                        value={noticeSearchQuery}
                                                        onChange={e => setNoticeSearchQuery(e.target.value)}
                                                        className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50/50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                                                    />
                                                </div>
                                            </div>

                                            {filteredNotices.length === 0 ? (
                                                <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-slate-400 text-sm">No notices match your search term.</div>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                                    {filteredNotices.map(n => (
                                                        <div key={n.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col group hover:shadow-md hover:border-slate-300 transition-all">
                                                            <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden cursor-pointer" onClick={() => { setLightboxNotice(n); setShowNoticeLightbox(true); }}>
                                                                <img src={n.image_url} alt={n.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                                                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/0 transition-colors"></div>
                                                                <span className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider flex items-center gap-1 shadow">
                                                                    <i className="fas fa-clock animate-pulse"></i> 
                                                                    {(() => {
                                                                        const diff = new Date(n.expires_at) - new Date();
                                                                        const hours = Math.floor(diff / (1000 * 60 * 60));
                                                                        if (hours < 24) return hours <= 0 ? "Expiring" : `${hours}h left`;
                                                                        return `${Math.ceil(hours / 24)}d left`;
                                                                    })()}
                                                                </span>
                                                            </div>
                                                            <div className="p-4 flex flex-col flex-grow justify-between gap-4">
                                                                <div>
                                                                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors line-clamp-2 flex items-center gap-1.5 flex-wrap">
                                                                        <span>{n.title}</span>
                                                                        {n.target_batch && n.target_batch !== 'All Students' ? (
                                                                            <span className="inline-block bg-indigo-50 text-indigo-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-indigo-100 uppercase tracking-wide">Batch {n.target_batch}</span>
                                                                        ) : (
                                                                            <span className="inline-block bg-emerald-50 text-emerald-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-100 uppercase tracking-wide">All Students</span>
                                                                        )}
                                                                    </h4>
                                                                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><i className="fas fa-calendar-alt"></i> Posted: {new Date(n.created_at).toLocaleDateString()}</p>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <button onClick={() => { setLightboxNotice(n); setShowNoticeLightbox(true); }} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"><i className="fas fa-expand"></i> View</button>
                                                                    <a href={n.image_url} target="_blank" rel="noopener noreferrer" className="px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center transition-colors shadow-sm" title="Open Image"><i className="fas fa-external-link-alt text-xs"></i></a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                )}

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
                                            <button onClick={() => navigate('vault')} className="px-5 py-2.5 rounded-xl font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-colors text-sm">Question Bank</button>
                                            <button onClick={() => navigate('course-outline')} className="px-5 py-2.5 rounded-xl font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all text-sm">Course Outline</button>
                                            <button onClick={() => navigate('materials')} className="px-5 py-2.5 rounded-xl font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all text-sm">Materials</button>
                                            <button onClick={() => navigate('thesis')} className="px-5 py-2.5 rounded-xl font-medium text-purple-700 bg-purple-50 border border-purple-100 hover:bg-purple-100 transition-colors text-sm">Thesis</button>
                                            <button onClick={() => navigate('faculty')} className="px-5 py-2.5 rounded-xl font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all text-sm">Faculty</button>
                                            
                                            <button onClick={() => navigate('blood-bank')} className="px-5 py-2.5 rounded-xl font-bold text-white bg-red-600 border border-red-700 hover:bg-red-700 shadow-md hover:shadow-lg transition-all text-sm flex items-center gap-2 transform hover:-translate-y-0.5">
                                                <i className="fas fa-heartbeat animate-pulse"></i> Blood Bank
                                            </button>
                                        </div>

                                        <div className="mt-8 relative max-w-lg">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25"></div>
                                            <div className="relative bg-white rounded-xl shadow-xl p-1 flex items-center border border-slate-100">
                                                <i className="fas fa-search text-slate-400 ml-4 text-lg absolute left-0 z-10"></i>
                                                <input 
                                                    type="text" 
                                                    placeholder="Search for courses, papers..." 
                                                    className="w-full bg-transparent border-none focus:ring-0 outline-none text-slate-700 placeholder-slate-400 h-12 pl-12 pr-24 text-base font-medium"
                                                    value={homeSearchQuery}
                                                    onChange={(e) => setHomeSearchQuery(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && homeSearchQuery.trim()) {
                                                            setFilters(prev => ({ ...prev, vault: { ...prev.vault, search: homeSearchQuery } }));
                                                            navigate('vault');
                                                        }
                                                    }}
                                                />
                                                <button 
                                                    onClick={() => {
                                                        if (homeSearchQuery.trim()) {
                                                            setFilters(prev => ({ ...prev, vault: { ...prev.vault, search: homeSearchQuery } }));
                                                            navigate('vault');
                                                        }
                                                    }}
                                                    className="absolute right-1 top-1 bottom-1 bg-slate-900 text-white px-4 sm:px-6 rounded-lg font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center"
                                                >
                                                    Find
                                                </button>
                                            </div>
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
                            <div className="flex items-center gap-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">Question Bank</h3>
                                    <p className="text-sm text-slate-500 mt-1">Browse past exam papers</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setShowVaultFilter(true)} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 shadow-sm"><i className="fas fa-sliders-h text-indigo-500"></i> Filters</button>
                                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">{papers.filter(p => 
                                    (!filters.vault.search || JSON.stringify(p).toLowerCase().includes(filters.vault.search.toLowerCase())) &&
                                    (!filters.vault.dept || p.dept === filters.vault.dept) &&
                                    (!filters.vault.semSeason || (p.semester && p.semester.includes(filters.vault.semSeason))) &&
                                    (!filters.vault.semYear || (p.semester && p.semester.includes(filters.vault.semYear))) &&
                                    (!filters.vault.type || p.type === filters.vault.type) &&
                                    (!filters.vault.course || p.courseCode === filters.vault.course)
                                ).length}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {papers.filter(p => 
                                (!filters.vault.search || JSON.stringify(p).toLowerCase().includes(filters.vault.search.toLowerCase())) &&
                                (!filters.vault.dept || p.dept === filters.vault.dept) &&
                                (!filters.vault.semSeason || (p.semester && p.semester.includes(filters.vault.semSeason))) &&
                                (!filters.vault.semYear || (p.semester && p.semester.includes(filters.vault.semYear))) &&
                                (!filters.vault.type || p.type === filters.vault.type) &&
                                (!filters.vault.course || p.courseCode === filters.vault.course)
                            ).map(p => {
                                const teacher = teachers.find(x => x.id == p.teacherId);
                                return (
                                    <div key={p.id} className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:translate-y-[-6px] hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all duration-300 flex flex-col overflow-hidden relative">
                                        <div className={`h-1.5 w-full bg-gradient-to-r ${p.exam?.toLowerCase().includes('mid') ? 'from-amber-400 to-orange-500' : p.exam?.toLowerCase().includes('final') ? 'from-indigo-500 to-blue-600' : 'from-slate-400 to-slate-500'}`}></div>
                                        <div className="p-6 flex-1">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100/50 tracking-wide">{p.courseCode}</span>
                                                <div className="flex gap-2 items-center">
                                                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full text-white ${p.type === 'lab' ? 'bg-purple-500 shadow-sm shadow-purple-500/10' : 'bg-emerald-500 shadow-sm shadow-emerald-500/10'}`}>{p.type}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.exam}</span>
                                                </div>
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-900 leading-tight mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2" title={p.courseName}>{p.courseName}</h4>
                                            <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100/50 w-fit">
                                                <i className="far fa-calendar-alt text-indigo-500"></i>
                                                <span>Semester: {p.semester || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 pt-2">
                                                {teacher && teacher.img ? (
                                                    <img 
                                                        src={teacher.img} 
                                                        alt={teacher.name} 
                                                        className="w-7 h-7 rounded-full object-cover shadow-sm border border-white shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-[10px] text-indigo-800 font-extrabold shadow-sm border border-white shrink-0">
                                                        {getTeacherName(p.teacherId).charAt(0)}
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-0.5">Faculty Member</p>
                                                    <p className="text-xs text-slate-700 font-bold truncate leading-none">{getTeacherName(p.teacherId)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex gap-3 w-full">
                                            <button onClick={() => { setPreviewUrl(p.fileUrl); setShowPreviewModal(true); }} className="flex-1 bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"><i className="fas fa-eye text-indigo-500 text-xs"></i> Preview Paper</button>
                                            <button onClick={(e) => { e.stopPropagation(); window.open(p.fileUrl, '_blank'); }} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-indigo-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-2" title="Download PDF"><i className="fas fa-download text-xs"></i> Download</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* MATERIALS VIEW */}
                {view === 'materials' && (
                    <div className="h-full flex flex-col bg-slate-50 p-6 lg:p-10 overflow-y-auto">
                        <div className="mb-6 flex flex-wrap gap-4 justify-between items-end">
                            <div className="flex items-center gap-4">
                                <div><h3 className="text-2xl font-bold text-slate-900">Course Materials</h3><p className="text-sm text-slate-500 mt-1">Slides, Books & Notes</p></div>
                            </div>
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
                            ).map(p => {
                                const teacher = teachers.find(x => x.id == p.teacherId);
                                return (
                                    <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:translate-y-[-4px] transition-transform duration-300 flex flex-col overflow-hidden">
                                        <div className="p-6 flex-1">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">{p.courseCode}</span>
                                                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full text-white ${p.type === 'course_link' ? 'bg-emerald-500 shadow-sm shadow-emerald-500/10' : p.type === 'slide' ? 'bg-amber-500' : p.type === 'book' ? 'bg-pink-500' : 'bg-blue-500'}`}>
                                                    {p.type === 'course_link' ? 'Course Link' : p.type === 'slide' ? 'Slide' : p.type === 'book' ? 'Book' : p.type === 'note' ? 'Note' : p.type}
                                                </span>
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-900 leading-tight mb-2">{p.courseName}</h4>
                                            <div className="flex items-center gap-2 mb-4"><i className="far fa-clock text-slate-400 text-xs"></i><span className="text-sm text-slate-600 font-bold">Sem: {p.semester || 'N/A'}</span></div>
                                            <div className="flex items-center gap-2">
                                                {teacher && teacher.img ? (
                                                    <img 
                                                        src={teacher.img} 
                                                        alt={teacher.name} 
                                                        className="w-6 h-6 rounded-full object-cover shadow-sm border border-white shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-600 font-bold shrink-0">
                                                        <i className="fas fa-user text-[10px]"></i>
                                                    </div>
                                                )}
                                                <span className="text-xs text-slate-700 font-bold truncate">Faculty: {getTeacherName(p.teacherId)}</span>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex gap-3 w-full">
                                            {p.type === 'course_link' ? (
                                                <a 
                                                    href={p.fileUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="w-full text-center bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                                                >
                                                    <i className="fas fa-external-link-alt text-sm"></i> Access Recommended Link
                                                </a>
                                            ) : (
                                                <>
                                                    <button 
                                                        onClick={() => { setPreviewUrl(p.fileUrl); setShowPreviewModal(true); }} 
                                                        className="flex-1 bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <i className="fas fa-eye text-indigo-500 text-xs"></i> Preview
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); window.open(p.fileUrl, '_blank'); }} 
                                                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-indigo-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                                        title="Download PDF"
                                                    >
                                                        <i className="fas fa-download text-xs"></i> Download
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* COURSE OUTLINES VIEW */}
                {view === 'course-outline' && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="relative text-center mb-12">
                            <div className="text-center">
                                <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Course Outlines</h2>
                                <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-500 font-medium">Browse dynamic PDF syllabus outlines by department.</p>
                            </div>
                            
                            {/* Premium Search and Department Filter Panel */}
                            <div className="mt-10 max-w-2xl mx-auto bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1">
                                    <i className="fas fa-search text-slate-400 absolute left-3.5 top-3.5 text-sm"></i>
                                    <input 
                                        type="text" 
                                        placeholder="Search course code or name..." 
                                        value={outlineSearchQuery}
                                        onChange={e => setOutlineSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm shadow-sm transition-all"
                                    />
                                </div>
                                <div className="w-full sm:w-64 relative">
                                    <select 
                                        value={courseListDept} 
                                        onChange={e => setCourseListDept(e.target.value)} 
                                        className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm shadow-sm appearance-none cursor-pointer transition-all"
                                    >
                                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <i className="fas fa-chevron-down absolute right-4 top-4 text-slate-400 text-xs pointer-events-none"></i>
                                </div>
                            </div>

                            {/* Show only published checkbox toggle */}
                            <div className="mt-4 flex justify-center">
                                <label className="inline-flex items-center cursor-pointer text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors select-none">
                                    <input 
                                        type="checkbox" 
                                        checked={onlyWithOutlines}
                                        onChange={e => setOnlyWithOutlines(e.target.checked)}
                                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 mr-2 transition-all cursor-pointer"
                                    />
                                    <span>Show only courses with published outlines ({courseOutlines.filter(o => {
                                        const staticCourses = courseListDept === 'Computer Science & Engineering' ? COURSE_DB : [];
                                        const dynamicCourses = [...new Set(papers.filter(p => p.dept === courseListDept).map(p => JSON.stringify({ code: p.courseCode, name: p.courseName })))].map(s => JSON.parse(s));
                                        const allCourses = [...staticCourses, ...dynamicCourses].filter((v,i,a)=>a.findIndex(t=>(t.code === v.code))===i);
                                        return allCourses.some(c => c.code === o.course_code);
                                    }).length})</span>
                                </label>
                            </div>
                        </div>

                        {(() => {
                            const staticCourses = courseListDept === 'Computer Science & Engineering' ? COURSE_DB : [];
                            const dynamicCourses = [...new Set(papers.filter(p => p.dept === courseListDept).map(p => JSON.stringify({ code: p.courseCode, name: p.courseName })))].map(s => JSON.parse(s));
                            const allCourses = [...staticCourses, ...dynamicCourses]
                                .filter((v,i,a)=>a.findIndex(t=>(t.code === v.code))===i)
                                .sort((a,b) => a.code.localeCompare(b.code));

                            const filteredCourses = allCourses.filter(c => {
                                const matchesSearch = !outlineSearchQuery || 
                                    c.code.toLowerCase().includes(outlineSearchQuery.toLowerCase()) || 
                                    c.name.toLowerCase().includes(outlineSearchQuery.toLowerCase());
                                const outline = courseOutlines.find(o => o.course_code === c.code);
                                const matchesOutlineOnly = !onlyWithOutlines || !!outline;
                                return matchesSearch && matchesOutlineOnly;
                            });

                            return filteredCourses.length === 0 ? (
                                <div className="text-center py-16 bg-white border border-slate-200/60 rounded-2xl max-w-2xl mx-auto shadow-inner flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4 border border-slate-200/80"><i className="fas fa-file-pdf text-2xl"></i></div>
                                    <h3 className="font-extrabold text-slate-800 text-lg">No Outlines Match Criteria</h3>
                                    <p className="text-slate-400 text-sm mt-1 max-w-sm">No courses matching your search or filters found. Try clearing your search text or shifting departments.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredCourses.map((c, i) => {
                                        const outline = courseOutlines.find(o => o.course_code === c.code);
                                        return (
                                            <div key={i} onClick={() => { setFilters(prev => ({ ...prev, vault: { ...prev.vault, search: c.code } })); navigate('vault'); }} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between hover:translate-y-[-4px] duration-300">
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{c.code}</span>
                                                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{c.credits ? `${c.credits} Cr` : 'N/A'}</span>
                                                    </div>
                                                    <h3 className="font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{c.name}</h3>
                                                    {c.pre && (
                                                        <div className="mt-2 pt-2 border-t border-slate-50">
                                                            <p className="text-xs text-slate-500"><span className="font-bold text-slate-400 uppercase text-[10px]">Pre-req:</span> {c.pre}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                {outline ? (
                                                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                                        <button 
                                                            onClick={(e) => { 
                                                                e.stopPropagation(); 
                                                                setPreviewUrl(outline.outline_url); 
                                                                setShowPreviewModal(true); 
                                                            }} 
                                                            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all w-full justify-center shadow-md active:scale-95 transform"
                                                        >
                                                            <i className="fas fa-file-pdf text-sm animate-pulse"></i>
                                                            <span>View Course Outline</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-center">
                                                        <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5"><i className="fas fa-info-circle"></i> Syllabus pending upload</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* THESIS VIEW */}
                {view === 'thesis' && (
                    <div className="h-full flex flex-col bg-slate-50 p-6 lg:p-10 overflow-y-auto">
                        <div className="mb-6 flex flex-wrap gap-4 justify-between items-end">
                            <div><h3 className="text-2xl font-bold text-slate-900">Thesis Papers</h3><p className="text-sm text-slate-500 mt-1">Browse submitted thesis papers</p></div>
                            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">{thesisPapers.length} papers</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {thesisPapers.length === 0 ? (
                                <div className="col-span-full py-20 text-center"><p className="text-slate-400 text-sm">No thesis papers uploaded yet. Click the Upload button to add one.</p></div>
                            ) : thesisPapers.map(t => {
                                const { abstract, keywords, slidesLink } = parseThesisAbstract(t.abstract);
                                return (
                                    <div key={t.id} className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:translate-y-[-6px] hover:shadow-xl hover:shadow-purple-500/5 hover:border-purple-100 transition-all duration-300 flex flex-col overflow-hidden relative">
                                        <div className={`h-1.5 w-full bg-gradient-to-r ${t.type === 'project' ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500'}`}></div>
                                        <div className="p-6 flex-1">
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100/50 shadow-sm">{t.year || 'N/A'}</span>
                                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.dept}</span>
                                            </div>
                                            <h4 className="text-lg font-black text-slate-900 leading-tight mb-3 group-hover:text-purple-700 transition-colors line-clamp-2" title={t.title}>{t.title}</h4>
                                            
                                            <div className="space-y-1.5 mb-4">
                                                <div className="flex items-center gap-2 text-slate-600"><i className="fas fa-users text-purple-400 text-xs w-4"></i><span className="text-sm font-semibold">{t.author}</span></div>
                                                <div className="flex items-center gap-2 text-slate-500"><i className="fas fa-id-card text-slate-400 text-xs w-4"></i><span className="text-xs">ID: {t.studentid || t.studentId || 'N/A'}</span></div>
                                                <div className="flex items-center gap-2 text-slate-500"><i className="fas fa-chalkboard-teacher text-slate-400 text-xs w-4"></i><span className="text-xs">Supervisor: {getTeacherName(t.supervisorid || t.supervisorId)}</span></div>
                                            </div>

                                            <div className="flex gap-2 mb-4">
                                                <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full text-white ${t.type === 'project' ? 'bg-blue-500 shadow-sm shadow-blue-500/10' : 'bg-purple-500 shadow-sm shadow-purple-500/10'}`}>{t.type || 'thesis'}</span>
                                                {t.category && <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full text-white ${t.category === 'lab' ? 'bg-pink-500' : 'bg-indigo-500'}`}>{t.category}</span>}
                                            </div>
                                            
                                            {abstract && (
                                                <p className="text-xs text-slate-500 line-clamp-3 mt-3 italic bg-slate-50/50 p-3 rounded-2xl border border-slate-100 relative overflow-hidden font-serif">
                                                    "{abstract}"
                                                </p>
                                            )}
                                            
                                            {keywords && (
                                                <div className="flex flex-wrap gap-1.5 mt-3.5">
                                                    {keywords.split(',').map((kw, i) => (
                                                        <span key={i} className="text-[10px] bg-purple-50 text-purple-600 hover:bg-purple-100 px-2 py-0.5 rounded-md font-semibold tracking-wide border border-purple-100/50 transition-colors">
                                                            #{kw.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex flex-wrap gap-4 mt-4 pt-3.5 border-t border-slate-100">
                                                {(t.project_link || t.projectLink) && (
                                                    <a href={t.project_link || t.projectLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold hover:text-indigo-800 hover:underline transition-all">
                                                        <i className="fas fa-code text-indigo-400"></i> View Project
                                                    </a>
                                                )}
                                                {slidesLink && (
                                                    <a href={slidesLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-amber-600 font-bold hover:text-amber-800 hover:underline transition-all">
                                                        <i className="fas fa-play-circle text-amber-400"></i> View Slides
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-slate-50/60 px-6 py-4 border-t border-slate-100 flex gap-3 w-full">
                                            <button onClick={() => { setPreviewUrl(t.fileurl || t.fileUrl); setShowPreviewModal(true); }} className="flex-1 bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"><i className="fas fa-eye text-purple-500 text-xs"></i> Preview Abstract</button>
                                            <button onClick={() => window.open(t.fileurl || t.fileUrl, '_blank')} className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-purple-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-2" title="Download PDF"><i className="fas fa-download text-xs"></i> Download</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* FACULTY VIEW */}
                {view === 'faculty' && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="relative text-center mb-16">
                            <div className="text-center">
                                <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Meet the Faculty</h2>
                                <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-500">Browse professors and executives.</p>
                            </div>
                            <div className="mt-8 max-w-2xl mx-auto space-y-4">
                                <select value={filters.faculty.dept} onChange={(e) => setFilters(prev => ({ ...prev, faculty: { ...prev.faculty, dept: e.target.value } }))} className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm">
                                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                    <div className="relative bg-white rounded-xl shadow-sm flex items-center border border-slate-200">
                                        <i className="fas fa-search absolute left-4 text-slate-400"></i>
                                        <input type="text" className="block w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400" placeholder="Find a Professor..." onInput={(e) => setFilters(prev => ({ ...prev, faculty: { ...prev.faculty, search: e.target.value } }))} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {teachers.filter(t => t.name.toLowerCase().includes(filters.faculty.search.toLowerCase()) && (!filters.faculty.dept || t.dept === filters.faculty.dept))
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
                                <div 
                                    key={t.id} 
                                    className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:translate-y-[-6px] hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100/80 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col items-center text-center" 
                                    onClick={() => { setTeacherProfileId(t.id); navigate('teacher-profile'); }}
                                >
                                    <div className={`h-16 w-full bg-gradient-to-r ${t.dept?.toLowerCase().includes('computer') ? 'from-violet-500 to-indigo-600' : t.dept?.toLowerCase().includes('business') ? 'from-emerald-500 to-teal-600' : 'from-slate-500 to-slate-700'}`}></div>
                                    
                                    <div className="relative w-24 h-24 -mt-12 mb-4 z-10">
                                        <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                                        <img 
                                            className="relative w-24 h-24 rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 group-hover:ring-4 group-hover:ring-indigo-500/15 transition-all duration-500" 
                                            src={t.img || 'https://via.placeholder.com/150'} 
                                            alt={t.name} 
                                        />
                                    </div>
                                    
                                    <div className="px-6 pb-6 flex-1 flex flex-col justify-between items-center w-full">
                                        <div className="mb-4">
                                            <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">{t.name}</h3>
                                            <span className="inline-block tracking-widest text-[9px] px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-600 border border-indigo-100/50 uppercase mt-2 w-max">
                                                {t.dept}
                                            </span>
                                            <p className="text-xs font-semibold text-slate-400 mt-2 line-clamp-1 italic">{t.designation}</p>
                                        </div>
                                        
                                        <button className="mt-auto w-full text-center text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 transform group-hover:scale-[1.02]">
                                            <i className="fas fa-id-card text-xs"></i> View Full Profile
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* TEACHER PROFILE VIEW */}
                {view === 'teacher-profile' && (
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        {(() => {
                            const t = teachers.find(x => x.id == teacherProfileId);
                            if (!t) return <div className="text-center py-20">Profile not found</div>;
                            return (
                                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                                    <div className="bg-slate-900 h-32 relative">
                                        <button onClick={() => setView('faculty')} className="absolute top-6 left-6 text-white/80 hover:text-white flex items-center gap-2 font-bold transition-colors"><i className="fas fa-arrow-left"></i> Back</button>
                                    </div>
                                    <div className="px-8 pb-8">
                                        <div className="relative -mt-16 mb-6 flex flex-col items-center sm:items-start sm:flex-row gap-6">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-indigo-500 rounded-full blur opacity-50"></div>
                                                <img className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white" src={t.img || 'https://via.placeholder.com/150'} alt={t.name} />
                                            </div>
                                            <div className="text-center sm:text-left pt-16 sm:pt-0 sm:mt-16 flex-1">
                                                <h2 className="text-3xl font-bold text-slate-900">{t.name}</h2>
                                                <p className="text-indigo-600 font-bold uppercase tracking-wide text-sm mt-1">{t.dept}</p>
                                                <p className="text-slate-500 font-medium">{t.designation}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            <div className="lg:col-span-2 space-y-8">
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2"><i className="fas fa-user-circle text-indigo-500"></i> Biography</h3>
                                                    <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">{t.bio || "No biography available."}</p>
                                                </div>
                                                
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><i className="fas fa-history text-indigo-500"></i> Course History</h3>
                                                    <div className="space-y-3">
                                                        {(t.courses || []).length > 0 ? (
                                                            t.courses.map((c, i) => (
                                                                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md transition-all group">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${c.ongoing ? 'bg-emerald-500' : 'bg-slate-400'}`}>{c.code.slice(-3)}</div>
                                                                        <div>
                                                                            <div className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{c.name}</div>
                                                                            <div className="text-xs text-slate-500 font-mono">{c.code}</div>
                                                                        </div>
                                                                    </div>
                                                                    {c.ongoing && <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wide">Ongoing</span>}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-slate-400 italic text-sm">No course history added.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                                    <h3 className="font-bold text-slate-900 mb-4">Quick Stats</h3>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                                                            <div className="text-2xl font-bold text-indigo-600">{papers.filter(p => p.teacherId == t.id).length}</div>
                                                            <div className="text-xs text-slate-500 font-bold uppercase mt-1">Papers</div>
                                                        </div>
                                                        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                                                            <div className="text-2xl font-bold text-purple-600">{materials.filter(m => m.teacherId == t.id).length}</div>
                                                            <div className="text-xs text-slate-500 font-bold uppercase mt-1">Materials</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
                                                    <h3 className="font-bold text-lg mb-2">Contribute</h3>
                                                    <p className="text-indigo-100 text-sm mb-4">Have materials from {t.name}? Upload them to help others.</p>
                                                    <button onClick={() => { setUploadType('paper'); setUploadFormData(prev => ({ ...prev, teacherId: t.id })); setShowUploadModal(true); }} className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-sm">Upload Content</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* ADMIN DASHBOARD */}
                {view === 'admin' && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-full flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <div><h2 className="text-3xl font-extrabold text-slate-900">Admin Dashboard</h2><p className="text-slate-500 mt-1">Manage content and faculty.</p></div>
                            <div className="flex gap-3">
                                <button onClick={() => window.location.reload()} className="text-slate-600 hover:text-slate-800 font-bold text-sm bg-slate-100 px-4 py-2 rounded-xl transition-colors"><i className="fas fa-sync-alt mr-2"></i>Refresh</button>
                                <button onClick={() => setView('home')} className="text-indigo-600 hover:text-indigo-800 font-bold text-sm bg-indigo-50 px-4 py-2 rounded-xl transition-colors">Home</button>
                                <button onClick={() => { setUser(null); setView('home'); }} className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-4 py-2 rounded-xl transition-colors">Logout</button>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col flex-1">
                            <div className="flex border-b border-slate-200 overflow-x-auto">
                                {['uploads', 'mat_uploads', 'thesis_uploads', 'notices', 'outlines', 'papers', 'materials', 'thesis', 'faculty', 'blood'].map(tab => {
                                    const names = { 
                                        uploads: 'Pending Questions', 
                                        mat_uploads: 'Pending Materials', 
                                        thesis_uploads: 'Pending Thesis',
                                        notices: 'Notice Board',
                                        outlines: 'Course Outlines',
                                        papers: 'Questions', 
                                        materials: 'Materials', 
                                        thesis: 'Thesis',
                                        faculty: 'Faculty',
                                        blood: 'Blood Bank'
                                    };
                                    return (
                                        <button key={tab} onClick={() => setAdminTab(tab)} className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide transition-all whitespace-nowrap px-4 ${adminTab === tab ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>{names[tab]}</button>
                                    );
                                })}
                            </div>

                            {/* UPLOADS TAB (Pending Papers) */}
                            {adminTab === 'uploads' && (
                                <div className="flex-1 overflow-y-auto p-6">
                                    <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><i className="fas fa-clock text-amber-500"></i> Pending Question Approvals</h3>
                                    {pendingPapers.length === 0 ? (
                                        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400 text-sm">No pending papers.</div>
                                    ) : (
                                        <div className="space-y-3">
                                            {pendingPapers.map(p => ({...p, _type: 'paper'})).map(item => (
                                                <div key={item.id} className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                                    <div>
                                                        <div className="font-bold text-slate-800 text-sm"><span className="uppercase text-[10px] bg-white border border-amber-200 px-1.5 py-0.5 rounded text-amber-600 mr-2 font-extrabold tracking-wider">PAPER</span> {item.courseName}</div>
                                                        <div className="text-xs text-slate-500 mt-1">{item.courseCode} • {item.semester} • {getTeacherName(item.teacherId)}</div>
                                                        <a href={item.fileUrl} target="_blank" className="text-xs text-indigo-600 hover:underline mt-1 block">View File</a>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => approveItem(item, 'paper')} className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-600 shadow-sm">Approve</button>
                                                        <button onClick={() => rejectItem(item.id, 'paper')} className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 shadow-sm">Reject</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* MAT_UPLOADS TAB (Pending Materials) */}
                            {adminTab === 'mat_uploads' && (
                                <div className="flex-1 overflow-y-auto p-6">
                                    <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><i className="fas fa-clock text-amber-500"></i> Pending Material Approvals</h3>
                                    {pendingMaterials.length === 0 ? (
                                        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400 text-sm">No pending materials.</div>
                                    ) : (
                                        <div className="space-y-3">
                                            {pendingMaterials.map(m => ({...m, _type: 'material'})).map(item => (
                                                <div key={item.id} className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                                    <div>
                                                        <div className="font-bold text-slate-800 text-sm"><span className="uppercase text-[10px] bg-white border border-amber-200 px-1.5 py-0.5 rounded text-amber-600 mr-2 font-extrabold tracking-wider">MATERIAL</span> {item.courseName}</div>
                                                        <div className="text-xs text-slate-500 mt-1">{item.courseCode} • {item.semester} • {getTeacherName(item.teacherId)}</div>
                                                        <a href={item.fileUrl} target="_blank" className="text-xs text-indigo-600 hover:underline mt-1 block">View File</a>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => approveItem(item, 'material')} className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-600 shadow-sm">Approve</button>
                                                        <button onClick={() => rejectItem(item.id, 'material')} className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 shadow-sm">Reject</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* THESIS_UPLOADS TAB (Pending Thesis) */}
                            {adminTab === 'thesis_uploads' && (
                                <div className="flex-1 overflow-y-auto p-6">
                                    <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><i className="fas fa-clock text-amber-500"></i> Pending Thesis Approvals</h3>
                                    {pendingThesis.length === 0 ? (
                                        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400 text-sm">No pending thesis papers.</div>
                                    ) : (
                                        <div className="space-y-4">
                                            {pendingThesis.map(t => ({...t, _type: 'thesis'})).map(item => {
                                                const { abstract, keywords, slidesLink } = parseThesisAbstract(item.abstract);
                                                return (
                                                    <div key={item.id} className="p-5 bg-amber-50/60 border border-amber-100 rounded-2xl flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-bold text-slate-900 text-base leading-snug flex items-start gap-2 flex-wrap">
                                                                <span className="uppercase text-[9px] bg-amber-200 border border-amber-300 px-2 py-0.5 rounded-md text-amber-800 font-extrabold tracking-wider mt-0.5">THESIS UPLOAD</span> 
                                                                {item.title}
                                                            </div>
                                                            <div className="text-xs text-slate-600 mt-2 font-medium flex flex-wrap items-center gap-x-3 gap-y-1">
                                                                <span><i className="fas fa-graduation-cap text-slate-400 mr-1"></i> {item.dept}</span>
                                                                <span>•</span>
                                                                <span><i className="fas fa-calendar-alt text-slate-400 mr-1"></i> {item.semester} {item.year}</span>
                                                                <span>•</span>
                                                                <span><i className="fas fa-users text-slate-400 mr-1"></i> {item.author}</span>
                                                                <span>•</span>
                                                                <span><i className="fas fa-id-card text-slate-400 mr-1"></i> ID: {item.studentid || item.studentId || 'N/A'}</span>
                                                            </div>
                                                            <div className="text-xs text-slate-600 mt-1 font-medium">
                                                                <i className="fas fa-user-tie text-slate-400 mr-1.5"></i> Supervisor: {getTeacherName(item.supervisorid || item.supervisorId)}
                                                            </div>
                                                            
                                                            {abstract && (
                                                                <div className="mt-3 bg-white/70 border border-amber-100/55 rounded-xl p-3 text-xs text-slate-600">
                                                                    <div className="font-bold text-slate-700 mb-1">Abstract:</div>
                                                                    <p className="italic line-clamp-3">{abstract}</p>
                                                                </div>
                                                            )}

                                                            {keywords && (
                                                                <div className="mt-2.5 flex flex-wrap gap-1.5">
                                                                    <span className="text-[10px] text-slate-400 font-bold self-center mr-1">Keywords:</span>
                                                                    {keywords.split(',').map((kw, idx) => (
                                                                        <span key={idx} className="text-[10px] bg-amber-100/80 text-amber-800 px-2 py-0.5 rounded-md font-semibold">
                                                                            #{kw.trim()}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            <div className="mt-3 pt-3 border-t border-amber-200/50 flex flex-wrap gap-4 text-xs font-semibold">
                                                                <a href={item.fileurl || item.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 transition-colors">
                                                                    <i className="fas fa-file-pdf"></i> View Submitted PDF
                                                                </a>
                                                                {(item.project_link || item.projectLink) && (
                                                                    <a href={item.project_link || item.projectLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-teal-600 hover:text-teal-800 transition-colors">
                                                                        <i className="fas fa-code"></i> Project Demo/Code
                                                                    </a>
                                                                )}
                                                                {slidesLink && (
                                                                    <a href={slidesLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-amber-700 hover:text-amber-900 transition-colors">
                                                                        <i className="fas fa-play-circle"></i> Presentation Slides
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex md:flex-col gap-2 shrink-0 justify-end mt-2 md:mt-0 self-center">
                                                            <button onClick={() => approveItem(item, 'thesis')} className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-emerald-500/10">Approve</button>
                                                            <button onClick={() => rejectItem(item.id, 'thesis')} className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-red-500/10">Reject</button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* PAPERS TAB */}
                            {adminTab === 'papers' && (
                                <div className="flex-1 overflow-y-auto p-6">
                                    <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><i className="fas fa-database text-indigo-500"></i> Manage Questions</h3>
                                    <div className="flex gap-4 mb-4">
                                        <input placeholder="Search papers..." value={filters.adminPaper.search} className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" onChange={e => setFilters(prev => ({ ...prev, adminPaper: { search: e.target.value } }))} />
                                    </div>
                                    <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                                        <table className="min-w-full divide-y divide-slate-200">
                                            <thead className="bg-slate-100">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Semester</th>
                                                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-slate-100">
                                                {papers
                                                .filter(i => i.courseName.toLowerCase().includes(filters.adminPaper.search.toLowerCase()) || i.courseCode.toLowerCase().includes(filters.adminPaper.search.toLowerCase()))
                                                .slice(0, 50)
                                                .map(item => (
                                                    <tr key={item.id} className="hover:bg-slate-50">
                                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-bold text-slate-900">{item.courseCode}</div><div className="text-xs text-slate-500 truncate max-w-xs">{item.courseName}</div></td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.semester}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><button onClick={() => deleteItem(item.id, 'papers')} className="text-red-400 hover:text-red-600"><i className="fas fa-trash-alt"></i></button></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* MATERIALS TAB */}
                            {adminTab === 'materials' && (
                                <div className="flex-1 overflow-y-auto p-6">
                                    <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><i className="fas fa-database text-indigo-500"></i> Manage Materials</h3>
                                    <div className="flex gap-4 mb-4">
                                        <input placeholder="Search materials..." value={filters.adminMaterial.search} className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" onChange={e => setFilters(prev => ({ ...prev, adminMaterial: { search: e.target.value } }))} />
                                    </div>
                                    <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                                        <table className="min-w-full divide-y divide-slate-200">
                                            <thead className="bg-slate-100">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                                                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-slate-100">
                                                {materials
                                                .filter(i => i.courseName.toLowerCase().includes(filters.adminMaterial.search.toLowerCase()) || i.courseCode.toLowerCase().includes(filters.adminMaterial.search.toLowerCase()))
                                                .slice(0, 50)
                                                .map(item => (
                                                    <tr key={item.id} className="hover:bg-slate-50">
                                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-bold text-slate-900">{item.courseCode}</div><div className="text-xs text-slate-500 truncate max-w-xs">{item.courseName}</div></td>
                                                        <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 inline-flex text-[10px] leading-5 font-bold rounded-full bg-purple-100 text-purple-800 uppercase">{item.type}</span></td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><button onClick={() => deleteItem(item.id, 'materials')} className="text-red-400 hover:text-red-600"><i className="fas fa-trash-alt"></i></button></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* THESIS TAB */}
                            {adminTab === 'thesis' && (
                                <div className="flex-1 overflow-y-auto p-6">
                                    <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><i className="fas fa-database text-indigo-500"></i> Manage Thesis Papers</h3>
                                    <div className="flex gap-4 mb-4">
                                        <input placeholder="Search thesis..." value={filters.adminThesis?.search || ''} className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" onChange={e => setFilters(prev => ({ ...prev, adminThesis: { search: e.target.value } }))} />
                                    </div>
                                    <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                                        <table className="min-w-full divide-y divide-slate-200">
                                            <thead className="bg-slate-100">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Title / Author</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Dept / Year</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Links</th>
                                                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-slate-100">
                                                {thesisPapers
                                                .filter(i => !filters.adminThesis?.search || i.title.toLowerCase().includes(filters.adminThesis.search.toLowerCase()) || i.author.toLowerCase().includes(filters.adminThesis.search.toLowerCase()))
                                                .slice(0, 50)
                                                .map(item => {
                                                    console.log('Thesis Item:', item);
                                                    console.log('Teachers Count:', teachers.length);
                                                    const { keywords, slidesLink } = parseThesisAbstract(item.abstract);
                                                    return (
                                                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                                        <td className="px-6 py-4"><div className="text-sm font-bold text-slate-950 truncate max-w-xs md:max-w-md" title={item.title}>{item.title}</div><div className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-0.5"><span>By: {item.author}</span>{item.studentid && <span>• ID: {item.studentid}</span>}</div></td>
                                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-slate-700">{item.dept}</div><div className="text-xs text-slate-400 mt-0.5">{item.year} • {getTeacherName(item.supervisorid || item.supervisorId)}</div></td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex gap-3 text-xs">
                                                                <a href={item.fileurl || item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1 font-bold" title="PDF Document">
                                                                    <i className="fas fa-file-pdf"></i> PDF
                                                                </a>
                                                                {(item.project_link || item.projectLink) && (
                                                                    <a href={item.project_link || item.projectLink} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline flex items-center gap-1 font-bold" title="Project Code/Demo">
                                                                        <i className="fas fa-code"></i> Code
                                                                    </a>
                                                                )}
                                                                {slidesLink && (
                                                                    <a href={slidesLink} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline flex items-center gap-1 font-bold" title="Presentation Slides">
                                                                        <i className="fas fa-play-circle"></i> Slides
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button onClick={() => deleteItem(item.id, 'thesis_papers')} className="text-red-400 hover:text-red-600 hover:scale-110 active:scale-95 transition-transform p-1" title="Delete Thesis">
                                                                <i className="fas fa-trash-alt"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* FACULTY TAB */}
                            {adminTab === 'faculty' && (
                                <div className="flex-1 overflow-y-auto">
                                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                        <h3 className="font-bold text-slate-700">Faculty Members</h3>
                                        <button onClick={() => { setTeacherForm({ id: '', name: '', dept: DEPARTMENTS[10], desig: '', bio: '', img: '', courses: [] }); setShowTeacherModal(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all">Add New</button>
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

                            {/* BLOOD BANK TAB */}
                            {adminTab === 'blood' && (
                                <div className="p-6 overflow-y-auto">
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                            <h3 className="font-bold text-lg mb-4">Bulk Import Donors (CSV)</h3>
                                            <p className="text-sm text-slate-500 mb-4">Expected CSV Header: Name, Dept, Batch, Gender, Contact, Blood Group, Previous Donor (Yes/No), Willingness (1-5)</p>
                                            <input type="file" accept=".csv" onChange={handleBloodCSVUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                                        </div>
                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex justify-between items-center">
                                            <div>
                                                <h3 className="font-bold text-lg">Add Single Donor</h3>
                                                <p className="text-sm text-slate-500">Manually add a student to the blood bank.</p>
                                            </div>
                                            <button onClick={() => setShowBloodModal(true)} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
                                                <i className="fas fa-plus mr-2"></i> Add Donor
                                            </button>
                                        </div>
                                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                                             <table className="w-full text-sm text-left">
                                                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500">
                                                    <tr>
                                                        <th className="px-6 py-3">Name</th>
                                                        <th className="px-6 py-3">Group</th>
                                                        <th className="px-6 py-3">Dept</th>
                                                        <th className="px-6 py-3">Contact</th>
                                                        <th className="px-6 py-3 text-right">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {bloodDonors.map(d => (
                                                        <tr key={d.id} className="hover:bg-slate-50">
                                                            <td className="px-6 py-3 font-medium">{d.name}</td>
                                                            <td className="px-6 py-3"><span className="bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold text-xs">{d.blood_group}</span></td>
                                                            <td className="px-6 py-3">{d.department}</td>
                                                            <td className="px-6 py-3 font-mono text-xs">{d.contact}</td>
                                                            <td className="px-6 py-3 text-right">
                                                <button onClick={() => { setSingleBloodForm(d); setShowBloodModal(true); }} className="text-indigo-500 hover:bg-indigo-50 p-2 rounded-lg transition-colors mr-2"><i className="fas fa-edit"></i></button>
                                                <button onClick={() => deleteItem(d.id, 'blood_donors')} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><i className="fas fa-trash"></i></button>
                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* NOTICES ADMIN TAB */}
                            {adminTab === 'notices' && (
                                <div className="p-6 overflow-y-auto">
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            {/* Left Panel: Upload Notice Form */}
                                            <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col gap-5">
                                                <div>
                                                    <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2"><i className="fas fa-plus-circle text-indigo-500"></i> Add New Notice</h3>
                                                    <p className="text-xs text-slate-400 mt-1">Publish an announcement image with automated expiry.</p>
                                                </div>
                                                
                                                <form onSubmit={handleNoticeSubmit} className="space-y-4">
                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Notice Title *</label>
                                                        <input 
                                                            type="text" 
                                                            required
                                                            placeholder="e.g. Midterm Exam Schedule Fall 2025" 
                                                            value={noticeForm.title}
                                                            onChange={e => setNoticeForm(prev => ({ ...prev, title: e.target.value }))}
                                                            className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm shadow-sm"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Notice Image File *</label>
                                                        <div className="relative border-2 border-dashed border-slate-200 hover:border-indigo-500/50 rounded-xl p-4 text-center cursor-pointer transition-all bg-slate-50/30 group">
                                                            <input 
                                                                type="file" 
                                                                accept="image/*"
                                                                onChange={handleNoticeFileChange}
                                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                            />
                                                            <div className="flex flex-col items-center justify-center gap-1">
                                                                <i className="fas fa-image text-slate-400 group-hover:text-indigo-500 text-xl transition-colors"></i>
                                                                <span className="text-xs text-slate-600 font-medium">Click to select notice image</span>
                                                                <span className="text-[10px] text-slate-400">PNG, JPG or JPEG format</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-3">
                                                        <span className="h-px bg-slate-200 flex-grow"></span> OR <span className="h-px bg-slate-200 flex-grow"></span>
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Notice Image URL</label>
                                                        <input 
                                                            type="url" 
                                                            placeholder="e.g. https://catbox.moe/notice.png" 
                                                            value={noticeForm.imageUrl && noticeForm.imageUrl.startsWith('data:') ? '' : noticeForm.imageUrl}
                                                            onChange={e => setNoticeForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                                                            className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm shadow-sm font-mono text-xs"
                                                        />
                                                    </div>

                                                    {noticeForm.imageUrl && (
                                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3 animate-in fade-in">
                                                            <div className="w-12 h-12 rounded-lg bg-slate-950 overflow-hidden border border-slate-200 flex-shrink-0">
                                                                <img src={noticeForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="overflow-hidden">
                                                                <p className="text-[10px] text-green-600 font-extrabold uppercase tracking-wide flex items-center gap-1"><i className="fas fa-check-circle"></i> Image Loaded</p>
                                                                <p className="text-[9px] text-slate-400 truncate max-w-xs">{noticeForm.file ? noticeForm.file.name : (noticeForm.imageUrl.startsWith('data:') ? 'Local Image File' : noticeForm.imageUrl)}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Target Batch</label>
                                                        <input 
                                                            type="text" 
                                                            placeholder="e.g. 61 (by default for all students)" 
                                                            value={noticeForm.targetBatch}
                                                            onChange={e => setNoticeForm(prev => ({ ...prev, targetBatch: e.target.value }))}
                                                            className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm shadow-sm"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Validation Time (Expires At) *</label>
                                                        <input 
                                                            type="datetime-local" 
                                                            required
                                                            value={noticeForm.expiresAt}
                                                            onChange={e => setNoticeForm(prev => ({ ...prev, expiresAt: e.target.value }))}
                                                            className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm shadow-sm"
                                                        />
                                                    </div>

                                                    <button 
                                                        type="submit" 
                                                        disabled={isSubmittingNotice}
                                                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95 transform flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isSubmittingNotice ? (
                                                            <><i className="fas fa-spinner animate-spin"></i> Publishing...</>
                                                        ) : (
                                                            <><i className="fas fa-cloud-upload-alt animate-bounce"></i> Publish Notice</>
                                                        )}
                                                    </button>
                                                </form>
                                            </div>

                                            {/* Right Panel: All Notices List */}
                                            <div className="lg:col-span-2 space-y-6">
                                                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                    <div>
                                                        <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2"><i className="fas fa-bullhorn text-indigo-500"></i> Manage Notices ({notices.length})</h3>
                                                        <p className="text-xs text-slate-400 mt-1">Review active notice timelines or perform cleanups.</p>
                                                    </div>
                                                    <button onClick={pruneExpiredNotices} className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"><i className="fas fa-broom text-amber-500"></i> Clean Expired Notices</button>
                                                </div>

                                                {notices.length === 0 ? (
                                                    <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-inner text-slate-400 text-sm">No notices currently recorded in database.</div>
                                                ) : (
                                                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full text-sm text-left">
                                                                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100">
                                                                    <tr>
                                                                        <th className="px-6 py-4">Notice Title</th>
                                                                        <th className="px-6 py-4">Published</th>
                                                                        <th className="px-6 py-4">Expires</th>
                                                                        <th className="px-6 py-4">Status</th>
                                                                        <th className="px-6 py-4 text-right">Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-slate-100">
                                                                    {notices.map(n => {
                                                                        const isActive = new Date(n.expires_at) > new Date();
                                                                        return (
                                                                            <tr key={n.id} className="hover:bg-slate-50/50 transition-colors">
                                                                                <td className="px-6 py-4 font-semibold text-slate-800 text-xs">
                                                                                    <div className="flex items-center gap-3">
                                                                                        <div className="w-8 h-8 rounded bg-slate-900 border border-slate-200 overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => { setLightboxNotice(n); setShowNoticeLightbox(true); }} title="Expand">
                                                                                            <img src={n.image_url} alt={n.title} className="w-full h-full object-cover" />
                                                                                        </div>
                                                                                        <div className="flex flex-col">
                                                                                            <span className="truncate max-w-[200px] font-bold text-slate-800">{n.title}</span>
                                                                                            <span className="text-[9px] text-slate-400 font-medium">Target: {n.target_batch || 'All Students'}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="px-6 py-4 text-slate-500 text-xs">{new Date(n.created_at).toLocaleDateString()}</td>
                                                                                <td className="px-6 py-4 text-slate-500 text-xs">{new Date(n.expires_at).toLocaleString()}</td>
                                                                                <td className="px-6 py-4">
                                                                                    {isActive ? (
                                                                                        <span className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase"><i className="fas fa-check-circle text-[8px]"></i> Active</span>
                                                                                    ) : (
                                                                                        <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-400 px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase"><i className="fas fa-hourglass-end text-[8px]"></i> Expired</span>
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-6 py-4 text-right">
                                                                                    <button onClick={() => { setLightboxNotice(n); setShowNoticeLightbox(true); }} className="text-indigo-500 hover:bg-indigo-50 p-2 rounded-lg transition-colors mr-1" title="View"><i className="fas fa-expand"></i></button>
                                                                                    <button onClick={() => deleteItem(n.id, 'notices')} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Delete"><i className="fas fa-trash"></i></button>
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* COURSE OUTLINES ADMIN TAB */}
                            {adminTab === 'outlines' && (
                                <div className="p-6 overflow-y-auto">
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            {/* Left Panel: Upload Outline Form */}
                                            <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col gap-5">
                                                <div>
                                                    <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2"><i className="fas fa-file-pdf text-red-500"></i> Upload Course Outline</h3>
                                                    <p className="text-xs text-slate-400 mt-1">Publish a dynamic PDF syllabus mapping for any course.</p>
                                                </div>
                                                
                                                <form onSubmit={handleOutlineSubmit} className="space-y-4">
                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Select Course *</label>
                                                        <select 
                                                            required
                                                            value={outlineForm.courseCode}
                                                            onChange={e => setOutlineForm(prev => ({ ...prev, courseCode: e.target.value }))}
                                                            className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm shadow-sm"
                                                        >
                                                            <option value="">-- Choose Course --</option>
                                                            {COURSE_DB.sort((a,b) => a.code.localeCompare(b.code)).map(c => (
                                                                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Upload Outline PDF *</label>
                                                        <div className="relative border-2 border-dashed border-slate-200 hover:border-indigo-500/50 rounded-xl p-6 text-center cursor-pointer transition-all bg-slate-50/30 group">
                                                            <input 
                                                                type="file" 
                                                                accept="application/pdf"
                                                                onChange={handleOutlineFileChange}
                                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                            />
                                                            <div className="flex flex-col items-center justify-center gap-1">
                                                                <i className="fas fa-file-pdf text-slate-400 group-hover:text-red-500 text-2xl transition-colors"></i>
                                                                <span className="text-xs text-slate-600 font-medium">Click to select PDF document</span>
                                                                <span className="text-[10px] text-slate-400">PDF documents only</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-3">
                                                        <span className="h-px bg-slate-200 flex-grow"></span> OR <span className="h-px bg-slate-200 flex-grow"></span>
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">PDF Document URL</label>
                                                        <input 
                                                            type="url" 
                                                            placeholder="e.g. https://catbox.moe/outline.pdf" 
                                                            value={outlineForm.outlineUrl}
                                                            onChange={e => setOutlineForm(prev => ({ ...prev, outlineUrl: e.target.value }))}
                                                            className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm shadow-sm font-mono text-xs"
                                                        />
                                                    </div>

                                                    {outlineForm.outlineUrl && (
                                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3 animate-in fade-in">
                                                            <div className="w-10 h-10 rounded bg-red-50 border border-red-200 flex-shrink-0 flex items-center justify-center text-red-500">
                                                                <i className="fas fa-file-pdf text-lg"></i>
                                                            </div>
                                                            <div className="overflow-hidden">
                                                                <p className="text-[10px] text-green-600 font-extrabold uppercase tracking-wide flex items-center gap-1"><i className="fas fa-check-circle"></i> Document Loaded</p>
                                                                <p className="text-[9px] text-slate-400 truncate max-w-xs">{outlineForm.file ? outlineForm.file.name : outlineForm.outlineUrl}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <button 
                                                        type="submit" 
                                                        className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold rounded-xl transition-all shadow-md shadow-red-600/10 hover:shadow-lg hover:shadow-red-600/20 active:scale-95 transform flex items-center justify-center gap-2 mt-2"
                                                    >
                                                        <i className="fas fa-cloud-upload-alt animate-bounce"></i> Publish Outline
                                                    </button>
                                                </form>
                                            </div>

                                            {/* Right Panel: All Outlines List */}
                                            <div className="lg:col-span-2 space-y-6">
                                                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                                                    <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2"><i className="fas fa-list text-indigo-500"></i> Course Outlines Inventory ({courseOutlines.length})</h3>
                                                    <p className="text-xs text-slate-400 mt-1">Review active syllabus files or perform modifications.</p>
                                                </div>

                                                {courseOutlines.length === 0 ? (
                                                    <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-inner text-slate-400 text-sm">No course outlines currently uploaded. Choose a course on the left to add one!</div>
                                                ) : (
                                                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full text-sm text-left">
                                                                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100">
                                                                    <tr>
                                                                        <th className="px-6 py-4">Course</th>
                                                                        <th className="px-6 py-4">Syllabus File</th>
                                                                        <th className="px-6 py-4">Created</th>
                                                                        <th className="px-6 py-4 text-right">Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-slate-100">
                                                                    {courseOutlines.map(o => (
                                                                        <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                                                                            <td className="px-6 py-4 font-semibold text-slate-800 text-xs">
                                                                                <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-bold mr-2 text-[10px]">{o.course_code}</span>
                                                                                <span>{o.course_name}</span>
                                                                            </td>
                                                                            <td className="px-6 py-4 text-xs text-slate-500">
                                                                                <button 
                                                                                    onClick={() => { setPreviewUrl(o.outline_url); setShowPreviewModal(true); }}
                                                                                    className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-700 font-bold"
                                                                                >
                                                                                    <i className="fas fa-file-pdf"></i>
                                                                                    <span>Preview PDF</span>
                                                                                </button>
                                                                            </td>
                                                                            <td className="px-6 py-4 text-slate-500 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                                                                            <td className="px-6 py-4 text-right">
                                                                                <button onClick={() => deleteItem(o.id, 'course_outlines')} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Delete"><i className="fas fa-trash"></i></button>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {/* BLOOD BANK VIEW (Public) */}
                {view === 'blood-bank' && (
                    <div className="h-full flex flex-col bg-slate-50 p-4 lg:p-8 overflow-y-auto">
                        <div className="max-w-7xl mx-auto w-full">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
                                <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
                                    <span className="bg-red-100 text-red-600 w-12 h-12 rounded-xl flex items-center justify-center"><i className="fas fa-file-medical-alt"></i></span>
                                    Blood Bank
                                </h1>
                                <p className="text-slate-500 text-lg">Find student donors instantly.</p>
                                <div className="mt-4 p-4 bg-emerald-50/80 border-l-4 border-emerald-500 rounded-r-2xl max-w-2xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                    <p className="text-sm text-emerald-800 font-semibold leading-relaxed italic flex items-start gap-2.5">
                                        <i className="fas fa-quote-left text-emerald-500/80 text-base mt-0.5 shrink-0"></i>
                                        <span>
                                            "যে কেউ একজনের জীবন রক্ষা করল, সে যেন সমগ্র মানবজাতির জীবন রক্ষা করল।" 
                                            <span className="text-[11px] text-emerald-600 block mt-1.5 font-bold not-italic font-sans">— (সূরা আল-মায়িদাহ, ৫:৩২)</span>
                                        </span>
                                    </p>
                                </div>
                                
                                <div className="mt-6 flex gap-3">
                                    <button onClick={() => setShowBloodFilter(true)} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 shadow-sm transition-all">
                                        <i className="fas fa-sliders-h text-red-500"></i> Filters
                                    </button>
                                    
                                    {/* Active Filter Badges */}
                                    <div className="flex gap-2 items-center flex-wrap">
                                        {bloodFilter.group !== 'All' && <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-100">{bloodFilter.group} <i className="fas fa-times ml-1 cursor-pointer" onClick={() => setBloodFilter(p => ({...p, group: 'All'}))}></i></span>}
                                        {bloodFilter.dept !== 'All' && <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">{bloodFilter.dept} <i className="fas fa-times ml-1 cursor-pointer" onClick={() => setBloodFilter(p => ({...p, dept: 'All'}))}></i></span>}
                                        {bloodFilter.gender !== 'All' && <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">{bloodFilter.gender} <i className="fas fa-times ml-1 cursor-pointer" onClick={() => setBloodFilter(p => ({...p, gender: 'All'}))}></i></span>}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {bloodDonors.filter(d => {
                                    if (bloodFilter.group !== 'All' && d.blood_group !== bloodFilter.group) return false;
                                    if (bloodFilter.dept !== 'All' && d.department !== bloodFilter.dept) return false;
                                    if (bloodFilter.gender !== 'All' && d.gender !== bloodFilter.gender) return false;
                                    if (bloodFilter.donorStatus !== 'All') {
                                        const isD = d.is_donor; 
                                        if (bloodFilter.donorStatus === 'yes' && !isD) return false;
                                        if (bloodFilter.donorStatus === 'no' && isD) return false;
                                    }
                                    if (bloodFilter.willingness === 'High' && d.willingness < 4) return false;
                                    return true;
                                }).filter((d, index, self) => 
                                    index === self.findIndex((t) => (
                                        t.name === d.name && 
                                        t.blood_group === d.blood_group && 
                                        t.contact === d.contact
                                    ))
                                ).map(donor => (
                                    <div key={donor.id} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-red-100 transition-all duration-300 overflow-hidden flex flex-col relative hover:translate-y-[-6px]">
                                        <div className="flex justify-between items-start p-5 pb-0">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center text-xl font-black border border-red-500/20 shadow-md shadow-red-500/10 shrink-0">
                                                {donor.blood_group}
                                            </div>
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-sm border ${donor.is_donor ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                                                {donor.is_donor ? (
                                                    <>
                                                        <i className="fas fa-check-circle text-xs"></i> Verified Donor
                                                    </>
                                                ) : (
                                                    'New Donor'
                                                )}
                                            </span>
                                        </div>

                                        <div className="p-5 pt-4">
                                            <h3 className="font-extrabold text-slate-950 text-lg leading-tight mb-2 tracking-tight group-hover:text-red-600 transition-colors font-sans">{donor.name}</h3>
                                            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider flex flex-col gap-1">
                                                <span className="truncate" title={donor.department}>{donor.department}</span>
                                                <span className="text-slate-400 text-[10px]">Batch: {donor.batch}</span>
                                            </div>
                                            
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-4 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                                                <div className="flex items-center gap-1.5">
                                                    <i className={`fas fa-${donor.gender === 'Female' ? 'venus text-pink-500' : 'mars text-blue-500'} text-xs`}></i> 
                                                    <span>{donor.gender}</span>
                                                </div>
                                                <span className="text-slate-200">|</span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-slate-400 font-bold text-[10px]">Willingness:</span>
                                                    <div className="flex text-amber-400 text-[9px] gap-0.5">
                                                        {[...Array(5)].map((_,i) => <i key={i} className={`fas fa-star ${i < donor.willingness ? 'text-amber-400' : 'text-slate-200'}`}></i>)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-auto p-4 border-t border-slate-50 bg-slate-50/50">
                                            {donor.contact ? (
                                                <div className="flex flex-col gap-3">
                                                    <div className="text-center bg-white border border-slate-100/60 p-2 rounded-xl shadow-inner shadow-slate-50">
                                                        <p className="text-[9px] text-slate-400 uppercase font-extrabold tracking-widest mb-0.5">Contact Number</p>
                                                        <p className="font-mono text-base font-extrabold text-slate-700 tracking-wider select-all">{donor.contact}</p>
                                                    </div>
                                                    <a href={`tel:${donor.contact}`} className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-slate-900 to-slate-950 hover:from-black hover:to-black text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-slate-950/10 hover:shadow-lg hover:shadow-black/20 active:scale-95 transform group-hover:scale-[1.01]">
                                                        <i className="fas fa-phone-alt animate-pulse"></i> Call Student Donor
                                                    </a>
                                                </div>
                                            ) : (
                                                <span className="block text-center text-slate-400 text-xs italic py-2">No Contact Info Provided</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                                    <div className="bg-slate-100 p-1.5 rounded-xl inline-flex shadow-inner flex-wrap justify-center gap-1">
                                        <button onClick={() => { setUploadType('paper'); setUploadFormData(p => ({ ...p, matType: 'slide' })); updateCourseOptions('theory'); }} className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${uploadType === 'paper' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Question Paper</button>
                                        <button onClick={() => { setUploadType('material'); setUploadFormData(p => ({ ...p, matType: 'book' })); updateCourseOptions('theory'); }} className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${uploadType === 'material' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Course Material</button>
                                        <button onClick={() => { setUploadType('thesis'); }} className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${uploadType === 'thesis' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Thesis Paper</button>
                                        <button onClick={() => { setUploadType('outline'); }} className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${uploadType === 'outline' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-rose-600'}`}>Course Outline</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    {uploadType === 'outline' ? (
                                        user === 'admin' ? (
                                            <>
                                                <div className="col-span-1 sm:col-span-2">
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Course *</label>
                                                    <select 
                                                        required
                                                        value={outlineForm.courseCode}
                                                        onChange={e => setOutlineForm(prev => ({ ...prev, courseCode: e.target.value }))}
                                                        className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-rose-500/20 transition-all text-sm shadow-sm"
                                                    >
                                                        <option value="">-- Choose Course --</option>
                                                        {COURSE_DB.sort((a,b) => a.code.localeCompare(b.code)).map(c => (
                                                            <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="space-y-5 col-span-1 sm:col-span-2">
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Upload Outline PDF *</label>
                                                        <div className="relative border-2 border-dashed border-slate-200 hover:border-rose-500/50 rounded-xl p-6 text-center cursor-pointer transition-all bg-slate-50/30 group">
                                                            <input 
                                                                type="file" 
                                                                accept="application/pdf"
                                                                onChange={handleOutlineFileChange}
                                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                            />
                                                            <div className="flex flex-col items-center justify-center gap-1">
                                                                <i className="fas fa-file-pdf text-slate-400 group-hover:text-red-500 text-2xl transition-colors"></i>
                                                                <span className="text-xs text-slate-600 font-medium">Click to select PDF document</span>
                                                                <span className="text-[10px] text-slate-400">PDF documents only</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-3">
                                                        <span className="h-px bg-slate-200 flex-grow"></span> OR <span className="h-px bg-slate-200 flex-grow"></span>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">PDF Document URL</label>
                                                        <input 
                                                            type="url" 
                                                            placeholder="e.g. https://catbox.moe/outline.pdf" 
                                                            value={outlineForm.outlineUrl && outlineForm.outlineUrl.startsWith('data:') ? '' : outlineForm.outlineUrl}
                                                            onChange={e => setOutlineForm(prev => ({ ...prev, outlineUrl: e.target.value }))}
                                                            className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-rose-500/20 transition-all text-sm shadow-sm font-mono text-xs"
                                                        />
                                                    </div>

                                                    {outlineForm.outlineUrl && (
                                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3 animate-in fade-in">
                                                            <div className="w-10 h-10 rounded bg-red-50 border border-red-200 flex-shrink-0 flex items-center justify-center text-red-500">
                                                                <i className="fas fa-file-pdf text-lg"></i>
                                                            </div>
                                                            <div className="overflow-hidden">
                                                                <p className="text-[10px] text-green-600 font-extrabold uppercase tracking-wide flex items-center gap-1"><i className="fas fa-check-circle"></i> Document Loaded</p>
                                                                <p className="text-[9px] text-slate-400 truncate max-w-xs">{outlineForm.file ? outlineForm.file.name : (outlineForm.outlineUrl.startsWith('data:') ? 'Local PDF File' : outlineForm.outlineUrl)}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="col-span-1 sm:col-span-2 py-6 text-center flex flex-col items-center justify-center gap-4">
                                                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center shadow-lg border border-rose-100 mb-2">
                                                    <i className="fas fa-lock text-2xl"></i>
                                                </div>
                                                <h4 className="font-extrabold text-slate-800 text-lg">🔒 Administrator Restricted</h4>
                                                <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                                                    Course outlines are official Stamford curriculum documents and can only be uploaded by administrators. All students can view published outlines inside the Course Outline viewer menu.
                                                </p>
                                                <button 
                                                    type="button"
                                                    onClick={() => { setShowUploadModal(false); navigate('course-outline'); }}
                                                    className="mt-4 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-rose-600/10 active:scale-95 transform flex items-center gap-2"
                                                >
                                                    <i className="fas fa-file-pdf"></i> Browse Published Course Outlines
                                                </button>
                                            </div>
                                        )
                                    ) : uploadType === 'thesis' ? (
                                        <>
                                            <div className="space-y-5">
                                                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Thesis Title *</label><input value={uploadFormData.thesisTitle || ''} onChange={e => handleUploadChange('thesisTitle', e.target.value)} placeholder="Enter thesis title" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 outline-none" /></div>
                                                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Author Name(s) *</label><input value={uploadFormData.author || ''} onChange={e => handleUploadChange('author', e.target.value)} placeholder="e.g. John Doe, Jane Smith (comma-separated for groups)" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 outline-none" /></div>
                                                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Student ID(s) *</label><input value={uploadFormData.studentId || ''} onChange={e => handleUploadChange('studentId', e.target.value)} placeholder="e.g. CSE12345678, CSE12345679 (comma-separated)" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 outline-none" /></div>
                                                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Department *</label><div className="relative"><select value={uploadFormData.dept} onChange={e => handleUploadChange('dept', e.target.value)} className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 outline-none appearance-none">{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select><i className="fas fa-chevron-down absolute right-4 top-4 text-slate-400 text-xs pointer-events-none"></i></div></div>
                                            </div>
                                            <div className="space-y-5">
                                                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Year / Semester</label><div className="flex gap-3"><div className="relative w-1/2"><select value={uploadFormData.semSeason} onChange={e => handleUploadChange('semSeason', e.target.value)} className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none appearance-none"><option>Fall</option><option>Summer</option><option>Spring</option></select><i className="fas fa-chevron-down absolute right-4 top-4 text-slate-400 text-xs pointer-events-none"></i></div><div className="relative w-1/2"><select value={uploadFormData.semYear} onChange={e => handleUploadChange('semYear', e.target.value)} className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none appearance-none">{Array.from({ length: 11 }, (_, i) => 2020 + i).map(y => <option key={y}>{y}</option>)}</select><i className="fas fa-chevron-down absolute right-4 top-4 text-slate-400 text-xs pointer-events-none"></i></div></div></div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Supervisor *</label>
                                                    <div className="relative">
                                                        {showSupervisorDropdown && <div className="fixed inset-0 z-10" onClick={() => setShowSupervisorDropdown(false)}></div>}
                                                        <input
                                                            type="text"
                                                            value={supervisorSearch}
                                                            onChange={(e) => {
                                                                setSupervisorSearch(e.target.value);
                                                                setShowSupervisorDropdown(true);
                                                            }}
                                                            onFocus={() => setShowSupervisorDropdown(true)}
                                                            placeholder={uploadFormData.supervisorId === 'Additional' ? "Select Supervisor..." : getTeacherName(uploadFormData.supervisorId)}
                                                            className="block w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none relative z-20"
                                                        />
                                                        {showSupervisorDropdown && (
                                                            <div className="absolute z-30 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                                                                <div 
                                                                    className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm flex items-center gap-3 transition-colors border-b border-slate-50"
                                                                    onClick={() => {
                                                                        handleUploadChange('supervisorId', 'Additional');
                                                                        setSupervisorSearch('Additional');
                                                                        setShowSupervisorDropdown(false);
                                                                    }}
                                                                >
                                                                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                                                                        <i className="fas fa-plus text-xs"></i>
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="font-semibold text-slate-800">Additional</span>
                                                                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Guest Faculty</span>
                                                                    </div>
                                                                </div>
                                                                {teachers.filter(t => t.name.toLowerCase().includes(supervisorSearch.toLowerCase())).map(t => (
                                                                    <div 
                                                                        key={t.id} 
                                                                        className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm flex items-center gap-3 transition-colors border-b border-slate-50 last:border-0"
                                                                        onClick={() => {
                                                                            handleUploadChange('supervisorId', t.id);
                                                                            setSupervisorSearch(t.name);
                                                                            setShowSupervisorDropdown(false);
                                                                        }}
                                                                    >
                                                                        <img 
                                                                            src={t.img || 'https://via.placeholder.com/40'} 
                                                                            alt={t.name} 
                                                                            className="w-7 h-7 rounded-full object-cover border border-slate-200 shadow-sm"
                                                                        />
                                                                        <div className="flex flex-col">
                                                                            <span className="font-semibold text-slate-800">{t.name}</span>
                                                                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{t.dept}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <i className="fas fa-search absolute right-4 top-4 text-slate-400 text-xs pointer-events-none z-20"></i>
                                                    </div>
                                                </div>
                                                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Abstract / Description</label><textarea value={uploadFormData.abstract || ''} onChange={e => handleUploadChange('abstract', e.target.value)} placeholder="Paste the official academic thesis abstract or project executive summary here..." rows="4" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none" /></div>
                                                
                                                <div className="flex gap-4">
                                                    <div className="w-1/2">
                                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Type</label>
                                                        <div className="relative">
                                                            <select value={uploadFormData.thesisType || 'thesis'} onChange={e => handleUploadChange('thesisType', e.target.value)} className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none appearance-none">
                                                                <option value="thesis">Thesis</option>
                                                                <option value="project">Project</option>
                                                            </select>
                                                            <i className="fas fa-chevron-down absolute right-4 top-4 text-slate-400 text-xs pointer-events-none"></i>
                                                        </div>
                                                    </div>
                                                    <div className="w-1/2">
                                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Category</label>
                                                        <div className="relative">
                                                            <select value={uploadFormData.thesisCategory || ''} onChange={e => handleUploadChange('thesisCategory', e.target.value)} className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none appearance-none">
                                                                <option value="">None</option>
                                                                <option value="theory">Theory</option>
                                                                <option value="lab">Lab</option>
                                                            </select>
                                                            <i className="fas fa-chevron-down absolute right-4 top-4 text-slate-400 text-xs pointer-events-none"></i>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Research Keywords (Optional)</label>
                                                    <input value={uploadFormData.keywords || ''} onChange={e => handleUploadChange('keywords', e.target.value)} placeholder="e.g. Deep Learning, NLP, IoT, Web Security (comma-separated)" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 outline-none" />
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Project Code or Live Demo Link (Optional)</label>
                                                        <input value={uploadFormData.projectLink || ''} onChange={e => handleUploadChange('projectLink', e.target.value)} placeholder="e.g. https://github.com/... or Vercel URL" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 outline-none" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Defense Presentation Slides (Optional)</label>
                                                        <input value={uploadFormData.slidesLink || ''} onChange={e => handleUploadChange('slidesLink', e.target.value)} placeholder="e.g. Google Slides, PowerPoint Drive Link" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 outline-none" />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-5">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Department</label>
                                                    <div className="relative"><select value={uploadFormData.dept} onChange={e => handleUploadChange('dept', e.target.value)} className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none">{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select><i className="fas fa-chevron-down absolute right-4 top-4 text-slate-400 text-xs pointer-events-none"></i></div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Semester & Year</label>
                                                    <div className="flex gap-3">
                                                        <div className="relative w-1/2"><select value={uploadFormData.semSeason} onChange={e => handleUploadChange('semSeason', e.target.value)} className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none"><option>Fall</option><option>Summer</option><option>Spring</option></select><i className="fas fa-chevron-down absolute right-4 top-4 text-slate-400 text-xs pointer-events-none"></i></div>
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
                                                        <div className="relative"><select value={uploadFormData.matType} onChange={e => handleUploadChange('matType', e.target.value)} className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none"><option value="slide">Slide/Presentation</option><option value="book">Book/PDF</option><option value="note">Class Note</option><option value="course_link">Course Materials Link</option></select><i className="fas fa-chevron-down absolute right-4 top-4 text-slate-400 text-xs pointer-events-none"></i></div>
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
                                                            {showTeacherDropdown && <div className="fixed inset-0 z-10" onClick={() => setShowTeacherDropdown(false)}></div>}
                                                            <input
                                                                type="text"
                                                                value={teacherSearch}
                                                                onChange={(e) => {
                                                                    setTeacherSearch(e.target.value);
                                                                    setShowTeacherDropdown(true);
                                                                }}
                                                                onFocus={() => setShowTeacherDropdown(true)}
                                                                placeholder={uploadFormData.teacherId === 'Additional' ? "Search Faculty..." : getTeacherName(uploadFormData.teacherId)}
                                                                className="block w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none relative z-20"
                                                            />
                                                            {showTeacherDropdown && (
                                                                <div className="absolute z-30 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                                                                    <div 
                                                                        className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm flex items-center gap-3 transition-colors border-b border-slate-50"
                                                                        onClick={() => {
                                                                            handleUploadChange('teacherId', 'Additional');
                                                                            setTeacherSearch('Additional');
                                                                            setShowTeacherDropdown(false);
                                                                        }}
                                                                    >
                                                                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                                                                            <i className="fas fa-plus text-xs"></i>
                                                                        </div>
                                                                        <div className="flex flex-col">
                                                                            <span className="font-semibold text-slate-800">Additional</span>
                                                                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Guest Faculty</span>
                                                                        </div>
                                                                    </div>
                                                                    {teachers.filter(t => t.name.toLowerCase().includes(teacherSearch.toLowerCase())).map(t => (
                                                                        <div 
                                                                            key={t.id} 
                                                                            className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm flex items-center gap-3 transition-colors border-b border-slate-50 last:border-0"
                                                                            onClick={() => {
                                                                                handleUploadChange('teacherId', t.id);
                                                                                setTeacherSearch(t.name);
                                                                                setShowTeacherDropdown(false);
                                                                            }}
                                                                        >
                                                                            <img 
                                                                                src={t.img || 'https://via.placeholder.com/40'} 
                                                                                alt={t.name} 
                                                                                className="w-7 h-7 rounded-full object-cover border border-slate-200 shadow-sm"
                                                                            />
                                                                            <div className="flex flex-col">
                                                                                <span className="font-semibold text-slate-800">{t.name}</span>
                                                                                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{t.dept}</span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            <i className="fas fa-search absolute right-4 top-4 text-slate-400 text-xs pointer-events-none z-20"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {uploadType === 'material' && (
                                        <div className="space-y-4 bg-slate-50 border border-slate-200/85 p-5 rounded-2xl col-span-1 sm:col-span-2">
                                            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 tracking-wide uppercase">
                                                <i className="fas fa-link text-indigo-500 text-sm"></i> Direct Link Inputs
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                                                        <span>Course Materials Link</span>
                                                        {uploadFormData.matType === 'course_link' && <span className="text-[10px] text-red-500 font-bold tracking-normal lowercase">(Required for Course Link)</span>}
                                                    </label>
                                                    <input 
                                                        value={uploadFormData.courseMaterialsLink || ''} 
                                                        onChange={e => handleUploadChange('courseMaterialsLink', e.target.value)} 
                                                        placeholder="e.g. Drive, OneDrive, Dropbox link" 
                                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm shadow-sm" 
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                                                        <span>PDF Upload Link (PDF &gt; 4.5MB)</span>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => setShowCatboxTutorial(true)} 
                                                            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                                        >
                                                            <i className="fas fa-play-circle text-xs"></i> Tutorial
                                                        </button>
                                                    </label>
                                                    <div className="relative">
                                                        <input 
                                                            value={uploadFormData.pdfUploadLink || ''} 
                                                            onChange={e => handleUploadChange('pdfUploadLink', e.target.value)} 
                                                            placeholder="e.g. paste Catbox / Drive link here" 
                                                            className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm shadow-sm" 
                                                        />
                                                        <i className="fas fa-info-circle text-slate-400 absolute right-4 top-4 text-xs" title="If PDF > 4.5MB, upload manually and paste link"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-[10px] text-slate-400 italic">
                                                * Note: If you provide either link, file/image upload below becomes completely optional. Links save Supabase database storage!
                                            </div>
                                        </div>
                                    )}
                                    <div className="sm:col-span-2 mt-2">
                                        <div className="border-2 border-dashed border-slate-300 rounded-2xl px-6 py-10 text-center hover:bg-indigo-50 hover:border-indigo-300 transition-all bg-slate-50 cursor-pointer relative group">
                                            <input 
                                                id="file-upload-input"
                                                type="file" 
                                                accept="image/*,application/pdf" 
                                                onChange={handleFileChange} 
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                                style={{ display: 'none' }}
                                            />
                                            <div className="mx-auto h-16 w-16 text-indigo-500 bg-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-100 mb-4 group-hover:scale-110 transition-transform">
                                                <i className={`fas ${selectedImages.length > 0 ? 'fa-images' : 'fa-cloud-upload-alt'} text-2xl`}></i>
                                            </div>
                                            <p className="text-sm text-slate-600 font-medium mb-3">
                                                {uploadFile 
                                                    ? uploadFile.name 
                                                    : selectedImages.length > 0 
                                                    ? `${selectedImages.length} image${selectedImages.length > 1 ? 's' : ''} selected` 
                                                    : (uploadType === 'material' && (uploadFormData.matType === 'course_link' || uploadFormData.courseMaterialsLink || uploadFormData.pdfUploadLink))
                                                    ? 'Upload PDF or select images (Optional - Link provided)'
                                                    : 'Upload PDF or capture/select images *'
                                                }
                                            </p>
                                            
                                            {/* Action Buttons */}
                                            <div className="flex gap-2 justify-center flex-wrap">
                                                {selectedImages.length < 4 && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const input = document.getElementById('file-upload-input');
                                                            input.accept = 'image/*';
                                                            input.removeAttribute('multiple');
                                                            input.click();
                                                        }}
                                                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md transition-all flex items-center gap-2"
                                                    >
                                                        <i className="fas fa-camera"></i>
                                                        {selectedImages.length === 0 ? 'Capture/Select Image' : `Add Photo (${selectedImages.length}/4)`}
                                                    </button>
                                                )}
                                                {selectedImages.length === 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const input = document.getElementById('file-upload-input');
                                                            input.accept = 'application/pdf';
                                                            input.removeAttribute('multiple');
                                                            input.click();
                                                        }}
                                                        className="bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-700 shadow-md transition-all flex items-center gap-2"
                                                    >
                                                        <i className="fas fa-file-pdf"></i>
                                                        Upload PDF
                                                    </button>
                                                )}
                                            </div>
                                            
                                            <p className="text-xs text-slate-400 mt-3">
                                                {selectedImages.length === 0 ? 'Max 4 images • Images will be converted to PDF' : selectedImages.length === 4 ? 'Maximum 4 images reached' : `${4 - selectedImages.length} more image${4 - selectedImages.length > 1 ? 's' : ''} can be added`}
                                            </p>
                                        </div>
                                        
                                        {/* Image Previews */}
                                        {selectedImages.length > 0 && (
                                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                {selectedImages.map((img, index) => (
                                                    <div key={index} className="relative group">
                                                        <img 
                                                            src={URL.createObjectURL(img)} 
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-full h-24 object-cover rounded-lg border-2 border-slate-200 shadow-sm"
                                                        />
                                                        <div className="absolute top-1 left-1 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                                            Page {index + 1}
                                                        </div>
                                                        <button
                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeImage(index); }}
                                                            className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 hover:scale-110 transition-all"
                                                            title="Remove this image"
                                                        >
                                                            <i className="fas fa-times text-xs"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        
                                        {/* Conversion Status */}
                                        {isConvertingToPDF && (
                                            <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-lg p-3 flex items-center gap-3">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                                                <span className="text-sm font-medium text-indigo-700">Converting images to PDF...</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
                                    <button onClick={() => setShowUploadModal(false)} className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
                                    {uploadType === 'outline' ? (
                                        user === 'admin' && (
                                            <button 
                                                onClick={handleOutlineSubmit} 
                                                className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-500/30 transition-all transform hover:-translate-y-0.5"
                                            >
                                                Publish Outline
                                            </button>
                                        )
                                    ) : (
                                        <button 
                                            onClick={submitUpload} 
                                            disabled={isUploading || isConvertingToPDF} 
                                            className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isConvertingToPDF ? 'Converting...' : isUploading ? 'Uploading...' : 'Submit Content'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CATBOX TUTORIAL MODAL */}
            {showCatboxTutorial && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowCatboxTutorial(false)}></div>
                    <div className="relative bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all max-w-lg w-full z-10 border border-slate-100 flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <i className="fas fa-file-invoice text-indigo-400"></i> Manual Large PDF Guide
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">Step-by-step upload process for PDFs &gt; 4.5 MB</p>
                            </div>
                            <button onClick={() => setShowCatboxTutorial(false)} className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors">
                                <i className="fas fa-times text-lg"></i>
                            </button>
                        </div>
                        
                        {/* Content */}
                        <div className="p-6 overflow-y-auto space-y-4">
                            <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-700 leading-relaxed flex gap-3">
                                <i className="fas fa-exclamation-triangle text-indigo-500 text-base mt-0.5 flex-shrink-0"></i>
                                <span>
                                    To maintain high speed and keep Supabase size efficient, files exceeding <strong>4.5 MB</strong> cannot be uploaded directly. Please use this guide to upload manually.
                                </span>
                            </div>

                            <div className="space-y-4 pt-1">
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Open Catbox File Upload</h4>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                            Visit <a href="https://catbox.moe" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-bold underline inline-flex items-center gap-1">catbox.moe <i className="fas fa-external-link-alt text-[10px]"></i></a> in a new tab. It is a completely free, anonymous file host.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Upload Your PDF</h4>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed font-sans">
                                            Drag and drop your large PDF onto the site, or click "Select or drop files here" to upload your file.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Copy Generated Link</h4>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                            Wait for the upload to complete. Once done, a link like <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono text-[11px] font-bold">https://files.catbox.moe/xxxxxx.pdf</code> will appear. Copy it.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Paste the Link in QVault</h4>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                            Return here and paste that link directly into the <strong>PDF Upload Link</strong> field. You're done!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
                            <a 
                                href="https://catbox.moe" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                            >
                                <i className="fas fa-rocket text-indigo-500"></i> Open Catbox
                            </a>
                            <button 
                                onClick={() => setShowCatboxTutorial(false)} 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all"
                            >
                                Got It
                            </button>
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

            {/* NOTICE LIGHTBOX MODAL */}
            {showNoticeLightbox && lightboxNotice && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md transition-opacity" onClick={() => setShowNoticeLightbox(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-slate-900 border border-slate-800 rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-slate-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
                                <button onClick={() => setShowNoticeLightbox(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition-colors z-30"><i className="fas fa-times"></i></button>
                                <div className="mb-4 pr-10">
                                    <h3 className="text-xl font-bold text-white tracking-tight">{lightboxNotice.title || 'Announcement'}</h3>
                                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                                        <i className="fas fa-calendar-alt"></i> Posted on: {new Date(lightboxNotice.created_at).toLocaleDateString(undefined, {month: 'long', day: 'numeric', year: 'numeric'})}
                                        <span className="text-slate-600">•</span>
                                        <span className="text-red-400 font-semibold flex items-center gap-1">
                                            <i className="fas fa-clock"></i> Expires: {new Date(lightboxNotice.expires_at).toLocaleDateString(undefined, {month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'})}
                                        </span>
                                    </p>
                                </div>
                                <div className="bg-slate-950 rounded-2xl h-[65vh] flex items-center justify-center relative overflow-hidden border border-slate-800">
                                    <img src={lightboxNotice.image_url} alt={lightboxNotice.title} className="w-full h-full object-contain max-h-full" />
                                </div>
                            </div>
                            <div className="bg-slate-950 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-850 gap-3">
                                <a href={lightboxNotice.image_url} download={`Notice_${lightboxNotice.title.replace(/\s+/g, '_')}`} target="_blank" rel="noopener noreferrer" className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-lg shadow-indigo-500/20 px-6 py-2.5 bg-indigo-600 text-base font-bold text-white hover:bg-indigo-700 sm:w-auto sm:text-sm transition-all flex items-center gap-2"><i className="fas fa-download"></i> Open in New Tab / Download</a>
                                <button onClick={() => setShowNoticeLightbox(false)} className="mt-3 w-full inline-flex justify-center rounded-xl border border-slate-800 shadow-sm px-6 py-2.5 bg-slate-900 text-base font-bold text-slate-300 hover:bg-slate-800 hover:text-white sm:mt-0 sm:w-auto sm:text-sm transition-all">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TEACHER MODAL */}
            {showTeacherModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowTeacherModal(false)}></div>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 flex flex-col max-h-[90vh] overflow-hidden transform transition-all">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white">
                            <h3 className="text-xl font-bold text-slate-900">Faculty Profile</h3>
                            <button onClick={() => setShowTeacherModal(false)} className="text-slate-400 hover:text-slate-600"><i className="fas fa-times text-xl"></i></button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-5">
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
                            <textarea rows="2" placeholder="Biography" value={teacherForm.bio} onChange={e => setTeacherForm({ ...teacherForm, bio: e.target.value })} className="w-full border-slate-300 rounded-xl border p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none"></textarea>
                            
                            <div className="border-t border-slate-100 pt-5 mt-2">
                                <h4 className="text-sm font-bold text-slate-900 mb-3">Manage Course History</h4>
                                <div className="flex gap-2 mb-4">
                                    <div className="relative flex-1">
                                        <select value={newCourseCode} onChange={e => setNewCourseCode(e.target.value)} className="w-full border-slate-300 rounded-xl border p-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none">
                                            <option value="">Select Course...</option>
                                            {COURSE_DB.sort((a,b) => a.code.localeCompare(b.code)).map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                                        </select>
                                        <i className="fas fa-chevron-down absolute right-3 top-3.5 text-slate-400 text-xs pointer-events-none"></i>
                                    </div>
                                    <div className="relative w-32">
                                        <select value={newCourseOngoing ? 'ongoing' : 'history'} onChange={e => setNewCourseOngoing(e.target.value === 'ongoing')} className="w-full border-slate-300 rounded-xl border p-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none">
                                            <option value="history">History</option>
                                            <option value="ongoing">Ongoing</option>
                                        </select>
                                        <i className="fas fa-chevron-down absolute right-3 top-3.5 text-slate-400 text-xs pointer-events-none"></i>
                                    </div>
                                    <button onClick={() => {
                                        if (!newCourseCode) return;
                                        const course = COURSE_DB.find(c => c.code === newCourseCode);
                                        const newEntry = { code: course.code, name: course.name, ongoing: newCourseOngoing };
                                        setTeacherForm(prev => ({ ...prev, courses: [...(prev.courses || []), newEntry] }));
                                        setNewCourseCode('');
                                        setNewCourseOngoing(false);
                                    }} className="bg-slate-800 text-white px-4 rounded-xl text-sm font-bold hover:bg-slate-900 transition-colors">Add</button>
                                </div>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                                    {(teacherForm.courses || []).map((c, i) => (
                                        <div key={i} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                {c.ongoing && <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded uppercase">Ongoing</span>}
                                                <span className="text-xs font-bold text-slate-500">{c.code}</span>
                                                <span className="text-xs text-slate-700 truncate">{c.name}</span>
                                            </div>
                                            <button onClick={() => setTeacherForm(prev => ({ ...prev, courses: prev.courses.filter((_, idx) => idx !== i) }))} className="text-red-400 hover:text-red-600 p-1"><i className="fas fa-times"></i></button>
                                        </div>
                                    ))}
                                    {(!teacherForm.courses || teacherForm.courses.length === 0) && <p className="text-xs text-slate-400 text-center py-2">No manual courses added.</p>}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button onClick={() => setShowTeacherModal(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-200 transition-colors">Cancel</button>
                            <button onClick={saveTeacher} className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all">Save Profile</button>
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
                                    <select value={filters.vault.semSeason} onChange={e => setFilters(prev => ({ ...prev, vault: { ...prev.vault, semSeason: e.target.value } }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"><option value="">Any</option><option>Fall</option><option>Summer</option><option>Spring</option></select>
                                    <select value={filters.vault.semYear} onChange={e => setFilters(prev => ({ ...prev, vault: { ...prev.vault, semYear: e.target.value } }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"><option value="">Year</option>{Array.from({ length: 11 }, (_, i) => 2020 + i).map(y => <option key={y}>{y}</option>)}</select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Course</label>
                                <select value={filters.vault.course} onChange={e => setFilters(prev => ({ ...prev, vault: { ...prev.vault, course: e.target.value } }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none">
                                    <option value="">All Courses</option>
                                    {COURSE_DB.sort((a,b) => a.code.localeCompare(b.code)).map(c => (
                                        <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                                    ))}
                                </select>
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
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Department</label>
                                <select value={filters.materials.dept} onChange={e => setFilters(prev => ({ ...prev, materials: { ...prev.materials, dept: e.target.value } }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"><option value="">All Departments</option>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Category</label>
                                <select value={filters.materials.type} onChange={e => setFilters(prev => ({ ...prev, materials: { ...prev.materials, type: e.target.value } }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"><option value="">All Types</option><option value="book">Books</option><option value="slide">Slides</option><option value="note">Notes</option><option value="course_link">Course Links</option></select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Faculty</label>
                                <select value={filters.materials.teacher} onChange={e => setFilters(prev => ({ ...prev, materials: { ...prev.materials, teacher: e.target.value } }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"><option value="">All Faculty</option>{teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Course</label>
                                <select value={filters.materials.course} onChange={e => setFilters(prev => ({ ...prev, materials: { ...prev.materials, course: e.target.value } }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"><option value="">All Courses</option>{COURSE_DB.sort((a,b) => a.code.localeCompare(b.code)).map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}</select>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50"><button onClick={() => setShowMaterialsFilter(false)} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-indigo-700">Apply Filters</button></div>
                    </div>
                </div>
            )}

            {/* SINGLE BLOOD ADD MODAL */}
            {showBloodModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowBloodModal(false)}></div>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 flex flex-col max-h-[90vh] overflow-hidden transform transition-all">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white">
                            <h3 className="text-xl font-bold text-slate-900">Add Donor</h3>
                            <button onClick={() => setShowBloodModal(false)} className="text-slate-400 hover:text-slate-600"><i className="fas fa-times text-xl"></i></button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-5">
                            <input placeholder="Full Name" value={singleBloodForm.name} onChange={e => setSingleBloodForm({ ...singleBloodForm, name: e.target.value })} className="w-full border-slate-300 rounded-xl shadow-sm border p-3 focus:ring-2 focus:ring-red-500/20 outline-none" />
                            <div className="grid grid-cols-2 gap-4">
                                <select value={singleBloodForm.department} onChange={e => setSingleBloodForm({ ...singleBloodForm, department: e.target.value })} className="w-full border-slate-300 rounded-xl border p-3 bg-white focus:ring-2 focus:ring-red-500/20 outline-none">{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                                <input placeholder="Batch (e.g. 24)" value={singleBloodForm.batch} onChange={e => setSingleBloodForm({ ...singleBloodForm, batch: e.target.value })} className="w-full border-slate-300 rounded-xl border p-3 focus:ring-2 focus:ring-red-500/20 outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <select value={singleBloodForm.gender} onChange={e => setSingleBloodForm({ ...singleBloodForm, gender: e.target.value })} className="w-full border-slate-300 rounded-xl border p-3 bg-white focus:ring-2 focus:ring-red-500/20 outline-none"><option value="Male">Male</option><option value="Female">Female</option></select>
                                <select value={singleBloodForm.blood_group} onChange={e => setSingleBloodForm({ ...singleBloodForm, blood_group: e.target.value })} className="w-full border-slate-300 rounded-xl border p-3 bg-white focus:ring-2 focus:ring-red-500/20 outline-none">{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}</select>
                            </div>
                            <input placeholder="Contact Number" value={singleBloodForm.contact} onChange={e => setSingleBloodForm({ ...singleBloodForm, contact: e.target.value })} className="w-full border-slate-300 rounded-xl border p-3 focus:ring-2 focus:ring-red-500/20 outline-none" />
                            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={singleBloodForm.is_donor} onChange={e => setSingleBloodForm({ ...singleBloodForm, is_donor: e.target.checked })} className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
                                    <span className="text-sm font-medium text-slate-700">Previous Donor?</span>
                                </label>
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Willingness to Donate (1-5)</label>
                                <input type="range" min="1" max="5" value={singleBloodForm.willingness} onChange={e => setSingleBloodForm({ ...singleBloodForm, willingness: parseInt(e.target.value) })} className="w-full accent-red-600" />
                                <div className="text-center text-red-600 font-bold mt-1">{singleBloodForm.willingness} Stars</div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button onClick={() => setShowBloodModal(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-200 transition-colors">Cancel</button>
                            <button onClick={handleSingleBloodAdd} className="bg-red-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all">Add Donor</button>
                        </div>
                    </div>
                </div>
            )}

            {/* BLOOD FILTER DRAWER */}
            {showBloodFilter && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowBloodFilter(false)}></div>
                    <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><i className="fas fa-filter text-red-500"></i> Filters</h2>
                            <button onClick={() => setShowBloodFilter(false)} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full shadow-sm border border-slate-100"><i className="fas fa-times"></i></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Blood Group</label>
                                <select value={bloodFilter.group} onChange={e => setBloodFilter({...bloodFilter, group: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"><option value="All">All Blood Groups</option>{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}</select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Department</label>
                                <select value={bloodFilter.dept} onChange={e => setBloodFilter({...bloodFilter, dept: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"><option value="All">All Departments</option>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Gender</label>
                                <div className="flex bg-slate-100 p-1 rounded-lg">
                                    {['All', 'Male', 'Female'].map(g => (
                                        <button key={g} onClick={() => setBloodFilter({...bloodFilter, gender: g})} className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${bloodFilter.gender === g ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>{g}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">History</label>
                                <select value={bloodFilter.donorStatus} onChange={e => setBloodFilter({...bloodFilter, donorStatus: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"><option value="All">Any History</option><option value="yes">Previous Donor</option><option value="no">New Donor</option></select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Willingness</label>
                                <select value={bloodFilter.willingness} onChange={e => setBloodFilter({...bloodFilter, willingness: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"><option value="All">Any Willingness</option><option value="High">Highly Willing (4+ Stars)</option></select>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50"><button onClick={() => setShowBloodFilter(false)} className="w-full bg-red-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-red-700">Apply Filters</button></div>
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
