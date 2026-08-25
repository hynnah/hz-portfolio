// Fallback content — used until Supabase content loads (or if it's ever
// empty/unreachable), and doubles as the seed data written into the
// database by supabase/seed.sql. Keep the two in sync if you change this.

export const defaultProfile = {
  story_line: 'Once upon a time, in a city by the sea —',
  name: 'hannah martinez',
  subtitle: 'Information Technology Student · Front-End Development · UI/UX',
  about_paragraph:
    'I am a third-year Information Technology student at the University of San Carlos in Cebu, currently looking for an OJT opportunity. I have built both web and mobile applications, working across the front end and the back end with databases and APIs. Front-end development and UI design are where I spend the most time — layouts, interactions, and the small details that make an interface feel considered.',
  location: 'Cebu, Philippines',
  email: 'hannahmarie.martinez.12@gmail.com',
  github_url: 'https://github.com/hynnah',
  linkedin_url: 'https://www.linkedin.com/in/hynnahzenitram',
  portrait_url: null,
  resume_url: null,
};

export const defaultSkillGroups = [
  { id: 'languages', label: 'Languages', sort_order: 1, items: ['Java', 'C#', 'C', 'JavaScript'] },
  { id: 'web-design', label: 'Web & Design', sort_order: 2, items: ['HTML', 'CSS', 'React', 'UI/UX', 'Wireframing', 'Canva'] },
  { id: 'backend', label: 'Backend & Databases', sort_order: 3, items: ['PHP', 'FastAPI', 'MySQL', 'Supabase'] },
  { id: 'tools', label: 'Frameworks & Tools', sort_order: 4, items: ['.NET MAUI', 'GitHub'] },
];

export const defaultEducation = [
  { id: 'usc', school: 'University of San Carlos', degree: 'BS Information Technology', years: '2024 — Present', sort_order: 1 },
  { id: 'cit', school: 'Cebu Institute of Technology — University', degree: 'Senior High School Diploma, STEM Strand', years: 'June 2024', sort_order: 2 },
];

export const defaultCertifications = [
  { id: 'cisco', title: 'Passion Platform: Leveraging Web Scraping for Job Search', issuer: 'Cisco x Innovare', year: '2024', sort_order: 1 },
  { id: 'docker', title: 'Containerization and Virtualization with Docker and Kubernetes', issuer: 'DataCamp', year: '2025', sort_order: 2 },
  { id: 'nlp', title: 'AI & NLP Training Seminar', issuer: 'DOST-NICER', year: '2026', sort_order: 3 },
];

export const defaultProjects = [
  {
    id: 'careiosk',
    num: '01',
    title: 'CAREiosk',
    kind: 'Capstone Project',
    dates: 'June 2026 — Present',
    blurb: 'Tri-platform IoT health screening and queue management for the campus clinic.',
    stack: 'SRS · UI/UX · System Design',
    tags: ['SRS', 'Use Case Diagram', 'ERD', 'System Architecture', 'UI/UX'],
    full: 'The university clinic runs on paper: students queue at a single desk, vitals are recorded by hand, and records are difficult to retrieve. CAREiosk replaces that with three connected platforms — a touchscreen kiosk where students log in and take their own vitals, a dashboard where clinic staff manage the live queue and patient records, and a portal where students view their own history. I authored the SRS and use case diagram, contributed to the ERD and system architecture, and designed interface prototypes for all three platforms ahead of proposal defense. Implementation begins in the next phase.',
    repo_url: null,
    demo_url: null,
    private_note: 'In active development. Source and prototypes are kept private until the project is complete — available on request.',
    image_url: '/uploads/careiosk.webp',
    preview_url: null,
    sort_order: 1,
  },
  {
    id: 'shutool',
    num: '02',
    title: 'Shutool',
    kind: 'Mobile Application, Academic Project',
    dates: 'January — May 2026',
    blurb: 'Shuttle priority request system for campus transportation.',
    stack: 'C# · .NET MAUI · Supabase',
    tags: ['C#', '.NET MAUI', 'Supabase', 'Mobile'],
    full: 'Campus shuttles fill on a first-come basis, which leaves students with disability needs or tight class schedules stranded. Shutool lets riders submit a request with a reason, drivers see a prioritized queue rather than a crowd, and administrators set the rules that decide who boards first. It began as a desktop application in an earlier course; I extended it into a full mobile app, owning feature design and development across all three roles — Rider, Driver, and Administrator — with support from groupmates. Built in C# with .NET MAUI, using Supabase for authentication and data.',
    repo_url: 'https://github.com/hynnah',
    demo_url: 'https://github.com/hynnah',
    private_note: null,
    image_url: '/uploads/shutool.webp',
    preview_url: null,
    sort_order: 2,
  },
  {
    id: 'craveh',
    num: '03',
    title: 'Craveh',
    kind: 'Web Academic Group Project',
    dates: 'March — May 2026',
    blurb: 'Full-stack food ordering platform, from menu to order tracking.',
    stack: 'HTML · CSS · JS · PHP · MySQL',
    tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    full: 'A food ordering platform covering the full path a customer takes: browsing a menu, building a cart, checking out, and following an order until it arrives. I built the initial design and interface, setting the layout and interaction patterns the rest of the team worked within, then paired with a teammate to refine functionality and fix bugs through iterative testing. Built with HTML, CSS, JavaScript, PHP, and MySQL.',
    repo_url: 'https://github.com/hynnah',
    demo_url: 'https://github.com/hynnah',
    private_note: null,
    image_url: '/uploads/craveh.webp',
    preview_url: '/uploads/craveh-preview.webp',
    sort_order: 3,
  },
  {
    id: 'classync',
    num: '04',
    title: 'Classync',
    kind: 'Web Application, Academic Project',
    dates: 'February — May 2025',
    blurb: 'Collaborative classroom calendar and task manager, built solo.',
    stack: 'HTML · CSS · JS · PHP · MySQL',
    tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    full: 'Class schedules, group deadlines, and personal to-dos usually live in three different places, so things fall through. Classync puts them in one place: a shared class calendar, tasks an organizer can delegate to specific students, and a private to-do list for each person. Access is role-based — Admin, Organizer, and Student each see a different surface. I designed and built the whole thing on my own, front end and back end, in HTML, CSS, JavaScript, PHP, and MySQL.',
    repo_url: 'https://github.com/hynnah',
    demo_url: 'https://github.com/hynnah',
    private_note: null,
    image_url: '/uploads/classync.webp',
    preview_url: null,
    sort_order: 4,
  },
];
