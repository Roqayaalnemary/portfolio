/* ============================================================
   PORTFOLIO DATA  —  edit this file to update the content.
   Anything bilingual is written as { ar: '...', en: '...' }.
   Plain strings (technology names, official titles) are shown
   as-is in both languages.
   ============================================================ */
window.PORTFOLIO = {

  /* ---------- Contact & identity (existing, real details) ---------- */
  profile: {
    name: 'Roqaya Al Nemary',
    email: 'Ra.alnemary@hotmail.com',
    phone: '+966567139705',
    phoneDisplay: '+966 567 139 705',
    linkedin: 'https://www.linkedin.com/in/rogaiah-alnemari-4a65411b0',
    github: 'https://github.com/Roqayaalnemary',
    // Put the path of a real résumé file here (e.g. 'assets/Roqaya-CV.pdf').
    // While it is null, the "Download CV" button is hidden automatically.
    cv: null,
    photo: 'assets/img/roqaya.webp'
  },

  /* ---------- Experience ----------
     kind:    'employment' | 'training' | 'volunteer'
     start/end: 'YYYY-MM' or 'YYYY-MM-DD'  (leave null when unknown)
     current: true  -> shows a "Present" badge and "– Present".
              Set it to true ONLY after you confirm it.
     Entries with a start date are sorted newest-first automatically;
     undated entries go last.
  --------------------------------------------------------------- */
  experience: [
    {
      id: 'logix',
      kind: 'employment',
      start: '2025-10-12',
      end: null,
      current: false,
      title: { ar: 'أخصائية دعم فني', en: 'Technical Support Specialist' },
      org: 'Logix Information Technology',
      location: { ar: 'الرياض، المملكة العربية السعودية', en: 'Riyadh, Saudi Arabia' },
      description: {
        ar: 'دعم أنظمة ERP والتطبيقات المستخدمة لدى العملاء، وتحليل المشكلات التقنية ومتابعة معالجتها، والتعامل مع قواعد البيانات والاستعلامات، والمساعدة في تحديد المشكلات التي تحتاج إلى تصعيد للفريق التقني أو فريق التطوير.',
        en: 'Providing technical support for ERP systems and customer-facing applications, investigating technical issues, working with databases and SQL queries, and following up on problems that require further investigation or escalation to the appropriate technical teams.'
      },
      skills: ['ERP Systems', 'SQL Server', 'SQL Queries', 'Application Support', 'Technical Troubleshooting', 'Crystal Reports']
    },
    {
      id: 'holberton',
      kind: 'training',
      start: '2026-10',
      end: null,
      current: false,
      title: { ar: 'المعسكر التأسيسي في هندسة البرمجيات', en: 'Software Engineering Foundation Program' },
      org: { ar: 'Holberton School بالتعاون مع أكاديمية طويق', en: 'Holberton School × Tuwaiq Academy' },
      location: null,
      duration: { ar: 'تسعة أشهر', en: 'Nine months' },
      description: {
        ar: 'المشاركة في برنامج تأسيسي في هندسة البرمجيات لمدة تسعة أشهر، مع التركيز على تطوير المهارات البرمجية والتفكير المنطقي وحل المشكلات والتطبيق العملي لمفاهيم تطوير البرمجيات.',
        en: 'Participating in a nine-month foundational software engineering program focused on programming fundamentals, logical thinking, problem-solving, and practical software development.'
      },
      skills: [
        { ar: 'أساسيات البرمجة', en: 'Programming Fundamentals' },
        { ar: 'التفكير المنطقي', en: 'Logical Thinking' },
        { ar: 'حل المشكلات', en: 'Problem Solving' }
      ]
    },
    {
      id: 'taif-health',
      kind: 'volunteer',
      start: null,
      end: null,
      current: false,
      title: { ar: 'متطوعة في الدعم الفني والشبكات', en: 'Technical Support & Networks — Volunteer' },
      org: { ar: 'تجمع الطائف الصحي / RCUD', en: 'Taif Health Cluster / RCUD' },
      location: null,
      description: {
        ar: 'المساعدة في تحديث التطبيقات، وتثبيت برامج الحماية، ومعالجة بعض مشكلات الأجهزة والطاقة، وتقديم الدعم الأساسي للشبكات والمستخدمين.',
        en: 'Assisted with application updates, security software installation, troubleshooting selected device and power-related issues, and providing basic network and user support.'
      },
      skills: [
        { ar: 'تحديث التطبيقات', en: 'Application Updates' },
        { ar: 'برامج الحماية', en: 'Security Software' },
        { ar: 'دعم الشبكات الأساسي', en: 'Basic Network Support' },
        { ar: 'دعم المستخدمين', en: 'User Support' }
      ]
    }
  ],

  /* ---------- Skills (no proficiency percentages on purpose) ---------- */
  skills: [
    { id: 'prog',      title: { ar: 'البرمجة وتقنيات الويب', en: 'Programming & Web Technologies' }, items: ['JavaScript', 'Python', 'SQL', 'TypeScript', 'HTML', 'CSS', 'JSON'] },
    { id: 'frontend',  title: { ar: 'تطوير الواجهات الأمامية', en: 'Frontend Development' },       items: ['React', 'HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'Bootstrap'] },
    { id: 'backend',   title: { ar: 'تطوير الواجهات الخلفية', en: 'Backend Development' },         items: ['Node.js', 'Express.js', 'Django', { ar: 'ربط الأنظمة عبر API', en: 'API Integration' }] },
    { id: 'db',        title: { ar: 'قواعد البيانات', en: 'Databases' },                            items: ['Microsoft SQL Server', 'PostgreSQL'] },
    { id: 'tools',     title: { ar: 'الأدوات', en: 'Tools' },                                       items: ['Git', 'GitHub', 'Docker'] },
    { id: 'enterprise',title: { ar: 'الأنظمة المؤسسية والدعم الفني', en: 'Enterprise Systems & Technical Support' },
      items: [{ ar: 'أنظمة ERP', en: 'ERP Systems' }, { ar: 'دعم التطبيقات', en: 'Application Support' }, { ar: 'حل الأعطال التقنية', en: 'Technical Troubleshooting' }, { ar: 'استعلامات قواعد البيانات', en: 'Database Queries' }, { ar: 'تحليل المشكلات', en: 'Problem Analysis' }] },
    { id: 'soft',      title: { ar: 'المهارات المهنية', en: 'Professional Skills' },
      items: [{ ar: 'حل المشكلات', en: 'Problem Solving' }, { ar: 'العمل الجماعي', en: 'Teamwork' }, { ar: 'القدرة على التكيّف', en: 'Adaptability' }, { ar: 'التعلّم المستمر', en: 'Continuous Learning' }, { ar: 'تحليل البيانات', en: 'Data Analysis' }] }
  ],

  /* ---------- Projects ----------
     Add a project by adding an object here. Optional fields:
       links: [{ url, label: {ar,en} }]   (only add REAL links)
       image + alt: {ar,en}               (only a real screenshot)
       hidden: true                       (keeps it in the file but off the page)
  --------------------------------------------------------------- */
  projects: [
    {
      id: 'task-management',
      featured: true,
      type: { ar: 'تطبيق ويب متكامل (Full-Stack)', en: 'Full-Stack Web Application' },
      title: { ar: 'تطبيق إدارة المهام', en: 'Task Management Application' },
      description: {
        ar: 'تطبيق متكامل لإدارة المهام وتنظيم الأعمال اليومية، يجمع بين تطوير الواجهات الأمامية والخلفية والتعامل مع البيانات وربط الخدمات عبر واجهات برمجة التطبيقات، مع استخدام آليات المصادقة باستخدام JWT.',
        en: 'A task management application designed to organize tasks and workflows. The project involves frontend and backend development, data handling, API integration, and JWT-based authentication.'
      },
      tech: ['React', 'JavaScript', 'Node.js', 'Django', 'JWT', 'JSON', 'APIs'],
      image: 'assets/img/task-login.webp',
      alt: { ar: 'شاشة تسجيل الدخول في تطبيق إدارة المهام', en: 'Login screen of the Task Management Application' },
      links: []
    },
    {
      // Existing project from the old version of the site. Kept here but hidden,
      // because its details (Unity, Computer Vision) and link were not verified.
      id: 'chinese-ar',
      hidden: true,
      type: { ar: 'تطبيق واقع معزز', en: 'Augmented Reality App' },
      title: { ar: 'تطبيق الصينية بالواقع المعزز', en: 'Chinese Language AR App' },
      description: { ar: '', en: '' },
      tech: ['C#'],
      image: 'chinese.jpg',
      alt: { ar: '', en: '' },
      links: []
    }
  ],

  /* ---------- Education & training ---------- */
  education: [
    {
      id: 'bsc',
      kind: 'degree',
      start: '2017-10', end: '2021-05',
      title: { ar: 'بكالوريوس علوم الحاسب', en: 'Bachelor of Computer Science' },
      org: 'College of Computing and Information Technology',
      location: { ar: 'الطائف، المملكة العربية السعودية', en: 'Taif, Saudi Arabia' }
    },
    {
      id: 'sda-ga',
      kind: 'training',
      start: '2025-02', end: '2025-05',
      title: { ar: 'تدريب تطوير البرمجيات: Software Engineering / Python Bootcamp', en: 'Software Development Training: Software Engineering / Python Bootcamp' },
      org: 'Saudi Digital Academy + General Assembly',
      location: null
    }
  ],

  /* ---------- Certifications ----------
     Add  link: 'https://…'  when an official verification URL exists. */
  certifications: [
    { id: 'ibm',   title: 'Project Based Learning Programme in Data Analysis', issuer: 'IBM SkillsBuild', date: '2024-10', link: null },
    { id: 'gt',    title: 'Mechanics of Materials I', issuer: 'Georgia Institute of Technology / Coursera', date: '2020-07', link: null },
    { id: 'eit',   title: 'Security and Privacy for Big Data', issuer: 'EIT Digital / Coursera', date: '2020-06', link: null }
  ]
};
