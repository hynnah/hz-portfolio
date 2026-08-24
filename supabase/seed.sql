-- hz-portfolio — starting content
-- Run once, after schema.sql, in the Supabase SQL editor. Safe to re-run:
-- it clears each table first so it won't create duplicates.

truncate profile, skill_groups, education, certifications, projects;

insert into profile (id, story_line, name, subtitle, about_paragraph, location, email, github_url, linkedin_url)
values (
  1,
  'Once upon a time, in a city by the sea —',
  'hannah martinez',
  'Information Technology Student · Front-End Development · UI/UX',
  'I am a third-year Information Technology student at the University of San Carlos in Cebu, currently looking for an OJT opportunity. I have built both web and mobile applications, working across the front end and the back end with databases and APIs. Front-end development and UI design are where I spend the most time — layouts, interactions, and the small details that make an interface feel considered.',
  'Cebu, Philippines',
  'hannahmarie.martinez.12@gmail.com',
  'https://github.com/hynnah',
  'https://www.linkedin.com/in/hynnahzenitram'
);

insert into skill_groups (label, items, sort_order) values
  ('Languages', array['Java', 'C#', 'C', 'JavaScript'], 1),
  ('Web & Design', array['HTML', 'CSS', 'React', 'UI/UX', 'Wireframing', 'Canva'], 2),
  ('Backend & Databases', array['PHP', 'FastAPI', 'MySQL', 'Supabase'], 3),
  ('Frameworks & Tools', array['.NET MAUI', 'GitHub'], 4);

insert into education (school, degree, years, sort_order) values
  ('University of San Carlos', 'BS Information Technology', '2024 — Present', 1),
  ('Cebu Institute of Technology — University', 'Senior High School Diploma, STEM Strand', 'June 2024', 2);

insert into certifications (title, issuer, year, sort_order) values
  ('Passion Platform: Leveraging Web Scraping for Job Search', 'Cisco x Innovare', '2024', 1),
  ('Containerization and Virtualization with Docker and Kubernetes', 'DataCamp', '2025', 2),
  ('AI & NLP Training Seminar', 'DOST-NICER', '2026', 3);

insert into projects (num, title, kind, dates, blurb, stack, tags, full_description, repo_url, demo_url, private_note, image_url, preview_url, sort_order) values
(
  '01', 'CAREiosk', 'Capstone Project', 'June 2026 — Present',
  'Tri-platform IoT health screening and queue management for the campus clinic.',
  'SRS · UI/UX · System Design',
  array['SRS', 'Use Case Diagram', 'ERD', 'System Architecture', 'UI/UX'],
  'The university clinic runs on paper: students queue at a single desk, vitals are recorded by hand, and records are difficult to retrieve. CAREiosk replaces that with three connected platforms — a touchscreen kiosk where students log in and take their own vitals, a dashboard where clinic staff manage the live queue and patient records, and a portal where students view their own history. I authored the SRS and use case diagram, contributed to the ERD and system architecture, and designed interface prototypes for all three platforms ahead of proposal defense. Implementation begins in the next phase.',
  null, null,
  'In active development. Source and prototypes are kept private until the project is complete — available on request.',
  '/uploads/careiosk.webp',
  null,
  1
),
(
  '02', 'Shutool', 'Mobile Application, Academic Project', 'January — May 2026',
  'Shuttle priority request system for campus transportation.',
  'C# · .NET MAUI · Supabase',
  array['C#', '.NET MAUI', 'Supabase', 'Mobile'],
  'Campus shuttles fill on a first-come basis, which leaves students with disability needs or tight class schedules stranded. Shutool lets riders submit a request with a reason, drivers see a prioritized queue rather than a crowd, and administrators set the rules that decide who boards first. It began as a desktop application in an earlier course; I extended it into a full mobile app, owning feature design and development across all three roles — Rider, Driver, and Administrator — with support from groupmates. Built in C# with .NET MAUI, using Supabase for authentication and data.',
  'https://github.com/hynnah', 'https://github.com/hynnah',
  null,
  '/uploads/shutool.webp',
  null,
  2
),
(
  '03', 'Craveh', 'Web Academic Group Project', 'March — May 2026',
  'Full-stack food ordering platform, from menu to order tracking.',
  'HTML · CSS · JS · PHP · MySQL',
  array['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
  'A food ordering platform covering the full path a customer takes: browsing a menu, building a cart, checking out, and following an order until it arrives. I built the initial design and interface, setting the layout and interaction patterns the rest of the team worked within, then paired with a teammate to refine functionality and fix bugs through iterative testing. Built with HTML, CSS, JavaScript, PHP, and MySQL.',
  'https://github.com/hynnah', 'https://github.com/hynnah',
  null,
  '/uploads/craveh.webp',
  '/uploads/craveh-preview.webp',
  3
),
(
  '04', 'Classync', 'Web Application, Academic Project', 'February — May 2025',
  'Collaborative classroom calendar and task manager, built solo.',
  'HTML · CSS · JS · PHP · MySQL',
  array['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
  'Class schedules, group deadlines, and personal to-dos usually live in three different places, so things fall through. Classync puts them in one place: a shared class calendar, tasks an organizer can delegate to specific students, and a private to-do list for each person. Access is role-based — Admin, Organizer, and Student each see a different surface. I designed and built the whole thing on my own, front end and back end, in HTML, CSS, JavaScript, PHP, and MySQL.',
  'https://github.com/hynnah', 'https://github.com/hynnah',
  null,
  '/uploads/classync.webp',
  null,
  4
);
