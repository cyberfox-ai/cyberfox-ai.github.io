export const PERSON = {
  name: 'Vivek Choudhary',
  tagline: 'Security Engineer',
  taglineSub: 'OSCP · Penetration Tester · Bug Hunter',
  email: 'vivekchoudhary.me@gmail.com',
  website: 'https://vivekchoudhary.in',
  location: 'Indore, India',
}

export const SOCIALS = [
  { label: 'GitHub',   icon: 'gh',  url: 'https://github.com/sudovivek',         color: '#ffffff' },
  { label: 'LinkedIn', icon: 'li',  url: 'https://in.linkedin.com/in/sudovivek', color: '#0a66c2' },
  { label: 'X',        icon: 'x',   url: 'https://x.com/sudovivek',              color: '#ffffff' },
  { label: 'Medium',   icon: 'med', url: 'https://medium.com/@sudovivek',         color: '#ffffff' },
  { label: 'Email',    icon: 'em',  url: 'mailto:vivekchoudhary.me@gmail.com',    color: '#39ff14' },
]

export const ABOUT = `OSCP certified Information Security Enthusiast with 1 year of hands-on experience. Dedicated to safeguarding the Confidentiality, Integrity, and Availability of critical data and systems. Expertise in Vulnerability Assessments, Web Application Penetration Testing, API Penetration Testing, Mobile Application Penetration Testing, Internal and External Network Penetration Testing.`

export const SERVICES = [
  { title: 'Web Application Penetration Testing', desc: 'Proactively uncovers vulnerabilities in web applications, preventing potential breaches before they occur.' },
  { title: 'API Penetration Testing', desc: 'Conducting comprehensive assessments to identify and remediate potential vulnerabilities within APIs.' },
  { title: 'Network Penetration Testing', desc: 'Uses simulated attacks to probe network assets, uncover and mitigate security vulnerabilities.' },
  { title: 'Mobile Application Penetration Testing', desc: 'Static and dynamic analysis of Android APKs to explore and address security vulnerabilities.' },
]

export const CERTIFICATIONS = [
  { name: 'Offensive Security Certified Professional (OSCP)', issuer: 'Offsec', date: '03/2024', url: 'https://www.credential.net/cc3a33f0-554c-4066-82dd-6dbd06d5a2b8' },
  { name: 'Ethical Hacking Essentials', issuer: 'EC-Council', date: '03/2024', url: 'https://codered.eccouncil.org/certificate/a578ad68-1c12-4466-b053-174a52ab9e0d' },
  { name: 'API Penetration Testing', issuer: 'APISEC University', date: '03/2024', url: '#' },
  { name: 'Certified Network Security Practitioner (CNSP)', issuer: 'The SecOps Group', date: '06/2024', url: '#' },
  { name: 'Certified AppSec Practitioner (CAP)', issuer: 'The SecOps Group', date: '03/2025', url: '#' },
]

export const EXPERIENCE = [
  {
    role: 'Associate Quality Engineer',
    company: 'Impetus Technologies India Pvt. Ltd.',
    period: 'May 2025 – Present',
    location: 'Indore, MP, India (On-Site)',
    bullets: [],
  },
  {
    role: 'Security Engineer',
    company: 'R.U.D.R.A Cybersecurity Pvt. Ltd.',
    period: 'June 2024 – Feb 2025',
    location: 'Mumbai, MH, India (On-Site)',
    bullets: [
      'Identify and exploit security flaws by simulating attacks on Web, API, Mobile and Infrastructure.',
      'Work individually or as a part of the team to deliver security assessments for the clients.',
      'Develop and refine threat models to map application architecture and identify attack vectors.',
      'Prepare detailed reports and presentations for both technical and executive audiences.',
      'Develop scripts, tools, and methodologies to enhance penetration testing processes.',
    ],
  },
  {
    role: 'Intern Security Analyst',
    company: 'Crystal IT Soft Pvt. Ltd.',
    period: 'Jan 2024 – Mar 2024',
    location: 'Indore, MP, India (On-Site)',
    bullets: [
      'Conducted comprehensive Web & API Penetration Testing using both manual and automated approaches.',
      'Created comprehensive reports and presentations for technical staff and executive decision makers.',
    ],
  },
]

export const EDUCATION = [
  { degree: 'Master of Computer Applications', institute: 'Rajiv Gandhi Prodyogiki Vishwavidyalaya', period: '2024 – 2026', location: 'Indore' },
  { degree: 'Bachelor of Computer Applications', institute: 'Devi Ahilya Vishwavidyalaya', period: '2021 – 2024', location: 'Indore' },
]

export const ACHIEVEMENTS = [
  { title: 'Discovered 16 CVE IDs', desc: 'CVE-2023-33571 through CVE-2023-33590 published on exploit-db.', url: 'https://www.exploit-db.com/exploits/51528' },
  { title: 'Hall of Fame', desc: 'Appreciated by Santos, Retool, and Telstra Health on BugCrowd.', url: 'https://bugcrowd.com/engagements/santos-vdp/hall_of_fames' },
  { title: 'Hacker Rank – Hack The Box', desc: 'Active HTB player ranked as Hacker.', url: 'https://app.hackthebox.com/profile/1508311' },
]

export const SKILLS = [
  'Web Application Penetration Testing',
  'API Penetration Testing',
  'Mobile Application Penetration Testing',
  'Internal & External Network Penetration Testing',
  'Vulnerability Assessments',
  'Scripting (Bash & Python)',
  'Threat Modeling',
  'Docker',
]

export const PROJECTS = [
  {
    id: 'p1',
    title: 'Portable HTTP Server',
    description: 'Python portable HTTP server supporting PUT, POST, and DELETE methods, compatible with both Python versions, capable of running on HTTP and HTTPS.',
    tags: ['Python', 'HTTP', 'HTTPS'],
    link: 'https://github.com/sudovivek/Portable-Servers/tree/main/HTTP_Server',
  },
  {
    id: 'p2',
    title: 'Portable FTP Server',
    description: 'Python portable FTP server capable of running on both FTP and secure FTP (FTPS) protocols.',
    tags: ['Python', 'FTP', 'FTPS'],
    link: 'https://github.com/sudovivek/Portable-Servers/tree/main/FTP_Server',
  },
  {
    id: 'p3',
    title: 'File Transfer Methods',
    description: 'Collection of almost all possible methods to transfer files between Windows and Linux using command-line interfaces.',
    tags: ['Linux', 'Windows', 'Red Team'],
    link: 'https://github.com/sudovivek/File-Transfer',
  },
  {
    id: 'p4',
    title: 'C2 Frameworks',
    description: 'Collection of advanced C2 frameworks for red teaming and adversary emulation — includes Havoc and Merlin for secure post-exploitation operations.',
    tags: ['Red Team', 'C2', 'Exploitation'],
    link: 'https://github.com/sudovivek/C2-Frameworks',
  },
]

export const BLOGS = [
  {
    id: 'b1',
    title: 'Understanding Broken Access Control',
    date: 'May 03, 2024',
    tags: ['OWASP', 'Web Security'],
    url: 'https://medium.com/@sudovivek/understanding-broken-access-control-136447e3bd57',
    excerpt: 'A deep dive into Broken Access Control vulnerabilities — the #1 OWASP Top 10 risk — with real-world examples and how to test for them.',
  },
]
