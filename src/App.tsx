import React, { useState, useEffect } from 'react';
import {
  Terminal, Calendar, Cpu, GitBranch, Share2, FileText, Sliders, ShieldAlert,
  Grid, ShieldCheck, Compass, Shield, Code2,
  Activity, Layers, Award, GitMerge, Users, FileCheck,
  Printer, EyeOff, Eye, Mail, Send, Copy, Folder, FileCode, KeyRound,
  User, Zap, Download, Plus, Trash2, Save, RefreshCw, ChevronLeft,
  AtSign, MessageSquare, Menu, X
} from 'lucide-react';
import initialData from './data.json';

// Inline SVGs for Linkedin, Instagram and Volleyball to prevent compilation errors
const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const VolleyballIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10"></path>
    <path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10"></path>
    <path d="M2 12h20"></path>
  </svg>
);

// Helper to render platform icons dynamically
const renderPlatformIcon = (platformName: string) => {
  const name = platformName.toLowerCase();
  if (name.includes('linkedin')) return <LinkedinIcon />;
  if (name.includes('github')) return <GitBranch className="platform-icon" />;
  if (name.includes('instagram')) return <InstagramIcon />;
  if (name.includes('threads')) return <AtSign className="platform-icon" />;
  if (name.includes('tryhackme') || name.includes('htb') || name.includes('hack')) return <Shield className="platform-icon" />;
  if (name.includes('reddit')) return <MessageSquare className="platform-icon" />;
  if (name.includes('rank')) return <Code2 className="platform-icon" />;
  return <Share2 className="platform-icon" />;
};

const specializedPathways = [
  {
    id: "pentest",
    title: "Offensive Security (Pentesting & Red Teaming)",
    description: "Focus on identifying security vulnerabilities, attacking Active Directory setups, writing custom exploit scripts, and breaching target systems in controlled scenarios.",
    skills: ["Active Directory Exploitation", "Web Application Pentesting", "Binary Exploitation & Buffer Overflows", "Linux & Windows Privilege Escalation", "Evasion of Endpoint Detection (EDR)"],
    tools: ["Kali Linux", "Metasploit Framework", "Nmap Scanner", "Burp Suite Pro", "BloodHound", "Mimikatz"],
    certifications: ["OSCP (Offensive Security Certified Professional)", "eJPT (Junior Penetration Tester)", "PNPT (Practical Network Penetration Tester)", "CEH (Certified Ethical Hacker)"]
  },
  {
    id: "defensive",
    title: "Defensive Security (SOC Analyst & Threat Detection)",
    description: "Focus on defending network perimeters, analyzing logs, configuring firewalls/SIEM tools, responding to security incidents, and analyzing malware.",
    skills: ["SIEM Query Design & Configuration", "Packet Analysis & Sniffing", "Intrusion Detection System Tuning", "Incident Containment & Forensics", "Static & Dynamic Malware Analysis"],
    tools: ["Splunk SIEM", "Wireshark Packet Analyzer", "Suricata / Snort IDS", "Elastic Stack (ELK)", "Zeek Network Monitor", "Remnux Toolset"],
    certifications: ["CompTIA Security+", "CySA+ (Cybersecurity Analyst)", "GCIH (GIAC Certified Incident Handler)", "GCIA (GIAC Certified Intrusion Analyst)"]
  },
  {
    id: "devsecops",
    title: "DevSecOps (Security Automation & Cloud Infrastructure)",
    description: "Focus on injecting automated security scanning checks directly into CI/CD pipelines, auditing container environments, and securing cloud access controls.",
    skills: ["Automated Pipeline Scans (CI/CD)", "Static Analysis Security Testing (SAST)", "Dynamic Analysis Security Testing (DAST)", "Infrastructure as Code Security Audits", "IAM Privilege Optimization"],
    tools: ["Jenkins Pipelines", "SonarQube Scanner", "Docker Container Audits", "Kubernetes Security Policies", "AWS IAM Analyzer", "Trivy Scanner"],
    certifications: ["CSSLP (Secure Software Lifecycle Professional)", "AWS Certified Security Specialty", "Practical DevSecOps Professional (PDSO)"]
  }
];

// Custom SVG Radar Chart component (no external chart.js required, pure responsive SVG)
function RadarChart({ skills }: { skills: any[] }) {
  const size = 320;
  const center = size / 2;
  const radius = size * 0.38;

  if (!skills || skills.length === 0) return null;

  const angleStep = (Math.PI * 2) / skills.length;

  // Concentric background grid lines
  const levels = [0.2, 0.4, 0.6, 0.8, 1];
  const gridPolygons = levels.map(level => {
    return skills.map((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = center + Math.cos(angle) * radius * level;
      const y = center + Math.sin(angle) * radius * level;
      return `${x},${y}`;
    }).join(' ');
  });

  // Data polygon coordinates
  const dataPoints = skills.map((s, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const valueRatio = Math.max(10, Math.min(100, s.level)) / 100;
    const x = center + Math.cos(angle) * radius * valueRatio;
    const y = center + Math.sin(angle) * radius * valueRatio;
    return { x, y, name: s.name, level: s.level };
  });

  const dataPolygonString = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="radar-svg" style={{ maxWidth: '100%', maxHeight: '310px', display: 'block', margin: '0 auto' }}>
      {/* Grid rings */}
      {gridPolygons.map((points, idx) => (
        <polygon
          key={idx}
          points={points}
          fill="none"
          stroke="var(--border-color)"
          strokeWidth="1"
        />
      ))}

      {/* Radar axes */}
      {skills.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const ax = center + Math.cos(angle) * radius;
        const ay = center + Math.sin(angle) * radius;
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={ax}
            y2={ay}
            stroke="var(--border-color)"
            strokeWidth="1"
          />
        );
      })}

      {/* Filled data polygon */}
      <polygon
        points={dataPolygonString}
        fill="rgba(0, 217, 255, 0.12)"
        stroke="var(--color-cyan)"
        strokeWidth="2"
        filter="drop-shadow(0 0 6px rgba(0, 217, 255, 0.35))"
      />

      {/* Individual point handles */}
      {dataPoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          fill="var(--bg-dark)"
          stroke="var(--color-cyan)"
          strokeWidth="2"
        />
      ))}

      {/* Labels */}
      {skills.map((s, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const tx = center + Math.cos(angle) * (radius + 20);
        const ty = center + Math.sin(angle) * (radius + 10);

        let textAnchor: "start" | "middle" | "end" = "middle";
        if (Math.cos(angle) > 0.1) textAnchor = "start";
        else if (Math.cos(angle) < -0.1) textAnchor = "end";

        const labelText = s.name.split(' ')[0] || s.name;

        return (
          <text
            key={i}
            x={tx}
            y={ty}
            fill="var(--text-muted)"
            fontSize="9"
            fontWeight="bold"
            fontFamily="var(--font-mono)"
            textAnchor={textAnchor}
            dominantBaseline="middle"
          >
            {labelText}
          </text>
        );
      })}
    </svg>
  );
}

// Helper to construct the dynamic preview URL for a track and day
const getTrackIframeUrl = (trackId: string, track: any, dayNum: number, showRevision: boolean = false) => {
  if (!track || !track.repoUrl) return "";
  try {
    const url = new URL(track.repoUrl);
    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts.length >= 2) {
      const owner = pathParts[0];
      const repo = pathParts[1];

      let fileName = "";
      if (showRevision && dayNum % 10 === 0) {
        const startDay = dayNum - 9;
        fileName = `revision_day${startDay}_${dayNum}.html`;
      } else if (trackId === 'cybersecurity') {
        fileName = `day${String(dayNum).padStart(2, '0')}.html`;
      } else if (trackId === 'java_dsa') {
        fileName = `DSAday${dayNum}.html`;
      } else {
        fileName = `day${dayNum}.html`;
      }

      return `https://${owner.toLowerCase()}.github.io/${repo}/${fileName}`;
    }
  } catch (e) {
    console.error("Error generating iframe URL:", e);
  }
  return "";
};

// Helper to construct the roadmap URL for a track
const getTrackRoadmapUrl = (track: any) => {
  if (!track || !track.repoUrl) return "";
  try {
    const url = new URL(track.repoUrl);
    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts.length >= 2) {
      const owner = pathParts[0];
      const repo = pathParts[1];
      return `https://${owner.toLowerCase()}.github.io/${repo}/A%20roadmap.html`;
    }
  } catch (e) {
    console.error("Error generating roadmap URL:", e);
  }
  return "";
};

const DEFAULT_TRACK = { name: "Cybersecurity & Ethical Hacking", currentDay: 9, totalDays: 90, days: [], repoUrl: "" };

function App() {
  // Load State from LocalStorage fallback to imported JSON
  const [db, setDb] = useState(() => {
    try {
      const stored = localStorage.getItem("cyber_portfolio_db");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Upgrade legacy schema checks
        if (parsed.schemaVersion !== initialData.schemaVersion || (parsed.challenge && !parsed.challenge.tracks)) {
          throw new Error("Old schema or version mismatch detected, resetting to defaults");
        }
        return parsed;
      }
    } catch (e) {
      console.log("No custom draft, loading data.json", e);
    }
    return initialData;
  });

  const [activeTab, setActiveTab] = useState("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isTypingFinished, setIsTypingFinished] = useState(false);
  const whoamiString = "whoami";

  // Tracker interaction
  const activeTrackId = db.challenge?.activeTrack || "cybersecurity";
  const activeTrack = db.challenge?.tracks?.[activeTrackId] || DEFAULT_TRACK;
  const [selectedDayNum, setSelectedDayNum] = useState<number>(activeTrack.currentDay);

  // Remote HTML presence check
  const [iframeExists, setIframeExists] = useState<boolean | null>(null);
  const [checkingIframe, setCheckingIframe] = useState<boolean>(false);
  const [activeViewerTab, setActiveViewerTab] = useState<"log" | "preview" | "revision" | "project">("log");
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [isFullscreenPreviewOpen, setIsFullscreenPreviewOpen] = useState(false);
  const [selectedRevisionInterval, setSelectedRevisionInterval] = useState<number>(10);
  const [isDayOptionModalOpen, setIsDayOptionModalOpen] = useState(false);

  // Auto scroll active tab into view in horizontal containers without scrolling the window vertically
  useEffect(() => {
    const activeEl = document.querySelector('.terminal-tabs .btn-primary, .revision-tabs-container .active') as HTMLElement;
    if (activeEl && activeEl.parentElement) {
      const container = activeEl.parentElement;
      const elementOffset = activeEl.offsetLeft;
      const elementWidth = activeEl.offsetWidth;
      const containerWidth = container.offsetWidth;
      container.scrollTo({
        left: elementOffset - (containerWidth / 2) + (elementWidth / 2),
        behavior: 'smooth'
      });
    }
  }, [activeViewerTab, selectedRevisionInterval]);

  // Reset revision state when switching days/tracks
  useEffect(() => {
    setActiveViewerTab("log");
  }, [activeTrackId, selectedDayNum]);

  useEffect(() => {
    const isRev = activeViewerTab === "revision";
    const checkDay = isRev ? selectedRevisionInterval : selectedDayNum;
    const iframeUrl = getTrackIframeUrl(activeTrackId, activeTrack, checkDay, isRev);
    if (!iframeUrl || !activeTrack.repoUrl) {
      setIframeExists(false);
      return;
    }

    // Determine the exact filename corresponding to the current state
    let fileName = "";
    if (isRev && checkDay % 10 === 0) {
      const startDay = checkDay - 9;
      fileName = `revision_day${startDay}_${checkDay}.html`;
    } else if (activeTrackId === 'cybersecurity') {
      fileName = `day${String(checkDay).padStart(2, '0')}.html`;
    } else if (activeTrackId === 'java_dsa') {
      fileName = `DSAday${checkDay}.html`;
    } else {
      fileName = `day${checkDay}.html`;
    }

    try {
      const repoUrlObj = new URL(activeTrack.repoUrl);
      const pathParts = repoUrlObj.pathname.split('/').filter(Boolean);
      if (pathParts.length >= 2) {
        const owner = pathParts[0];
        const repo = pathParts[1];
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`;

        setCheckingIframe(true);
        setIframeExists(null);

        fetch(apiUrl, { method: 'GET' })
          .then(res => {
            if (res.ok) {
              setIframeExists(true);
            } else if (res.status === 403) {
              // Rate limit reached for anonymous API access; assume file exists and let the iframe try loading it
              setIframeExists(true);
            } else {
              setIframeExists(false);
            }
          })
          .catch(() => {
            // Network error/offline, fallback to false
            setIframeExists(false);
          })
          .finally(() => {
            setCheckingIframe(false);
          });
      } else {
        setIframeExists(false);
      }
    } catch (e) {
      console.error("Error checking file existence via API:", e);
      setIframeExists(false);
    }
  }, [activeTrackId, selectedDayNum, activeTrack, activeViewerTab, selectedRevisionInterval]);

  // Content password protection (days 11-90 require "ignite")
  const [isContentLocked, setIsContentLocked] = useState(() => sessionStorage.getItem("content_unlocked") !== "true");
  const [contentPassword, setContentPassword] = useState("");
  const [contentAuthError, setContentAuthError] = useState("");
  const [isPasswordPromptOpen, setIsPasswordPromptOpen] = useState(false);

  // Certifications password protection (requires "@Ajit1729@")
  const [isCertsUnlocked, setIsCertsUnlocked] = useState(() => sessionStorage.getItem("certs_unlocked") === "true");
  const [certsPassword, setCertsPassword] = useState("");
  const [certsAuthError, setCertsAuthError] = useState("");
  const [isCertsPromptOpen, setIsCertsPromptOpen] = useState(false);
  const [pendingCertUrl, setPendingCertUrl] = useState<string | null>(null);

  // Settings & Authentication modal
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(() => sessionStorage.getItem("root_authorized") === "true");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeEditorTab, setActiveEditorTab] = useState("profile");
  const [saveStatus, setSaveStatus] = useState("State: changes cached locally.");

  // Code Inspector Modal state
  const [isCodeInspectorOpen, setIsCodeInspectorOpen] = useState(false);
  const [inspectorRepo, setInspectorRepo] = useState("");
  const [inspectorPath, setInspectorPath] = useState("");
  const [inspectorFiles, setInspectorFiles] = useState<any[]>([]);
  const [inspectorCode, setInspectorCode] = useState("");
  const [inspectorLoading, setInspectorLoading] = useState(false);
  const [inspectorDemoLink, setInspectorDemoLink] = useState<string | null>(null);

  // Resume layout toggles
  const [isResumeExpanded, setIsResumeExpanded] = useState(false);

  // Collapsed projects
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

  // Warning Banner status
  const [showWarning, setShowWarning] = useState(() => {
    return localStorage.getItem("custom_data_saved") !== "true" && localStorage.getItem("setup_dismissed") !== "true";
  });





  // Section collapse states to keep view clean and tidy
  const [activeSkillsTab, setActiveSkillsTab] = useState<"radar" | "philosophy" | "list" | "pathways">("radar");
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);
  const [isCertsExpanded, setIsCertsExpanded] = useState(false);
  const [isVolleyballExpanded, setIsVolleyballExpanded] = useState(false);

  // Force a clean reset to the top on refresh (prevent browser scroll restoration
  // from landing on the Dossier/resume section and the scrollspy locking onto it)
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    setActiveTab('hero');
  }, []);

  // Native window scrolling handles touchpad/mouse wheel/touch gestures smoothly.

  // Typed effect for hero terminal prompt
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < whoamiString.length) {
        setTypedText(whoamiString.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsTypingFinished(true);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    setActiveTab(targetId);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Scrollspy to update active tab based on scroll position
  useEffect(() => {
    const sections = ['hero', 'challenge', 'skills', 'certifications', 'projects', 'community', 'resume'];

    // IntersectionObserver fallback for scrollspy
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  // Update selected day when switching tracks
  useEffect(() => {
    setSelectedDayNum(activeTrack.currentDay);
  }, [activeTrackId, activeTrack.currentDay]);

  // Save changes locally
  const saveChanges = (newDb: any) => {
    setDb(newDb);
    localStorage.setItem("cyber_portfolio_db", JSON.stringify(newDb));
    localStorage.setItem("custom_data_saved", "true");
    setSaveStatus("State: Changes committed to local storage draft!");
    setTimeout(() => {
      setSaveStatus("State: changes cached locally.");
    }, 3000);
  };

  // Helper to hash password using SHA-256
  const hashPassword = async (pwd: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(pwd);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const CONTENT_HASH_URL = "https://gist.githubusercontent.com/ajit-pawara/REPLACE_WITH_CONTENT_GIST_ID/raw";

  const handleContentAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hashed = await hashPassword(contentPassword);
    try {
      const res = await fetch(CONTENT_HASH_URL);
      if (!res.ok) throw new Error("Failed to fetch hash");
      const expectedHash = (await res.text()).trim();
      if (hashed === expectedHash) {
        sessionStorage.setItem("content_unlocked", "true");
        setIsContentLocked(false);
        setContentPassword("");
        setContentAuthError("");
        setIsPasswordPromptOpen(false);
      } else {
        setContentAuthError("[ERROR] ACCESS DENIED: INVALID CONTENT PASSWORD MATRIX.");
        setContentPassword("");
      }
    } catch {
      setContentAuthError("[ERROR] UNABLE TO VERIFY CREDENTIALS. CHECK NETWORK.");
      setContentPassword("");
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hashed = await hashPassword(password);
    if (hashed === "d4f7f87af4a1d68fc8d586d455136d1958fa4844f0abeb7ee72f7edb16d4b686") { // root@robin
      sessionStorage.setItem("root_authorized", "true");
      setIsAuthorized(true);
      setAuthError("");
    } else {
      setAuthError("[ERROR] ACCESS DENIED: INVALID PRIVILEGED PASSWORD MATRIX.");
      setPassword("");
    }
  };

  const CERTS_HASH_URL = "https://gist.githubusercontent.com/ajit-pawara/REPLACE_WITH_YOUR_GIST_ID/raw";

  const handleCertsAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hashed = await hashPassword(certsPassword);
    try {
      const res = await fetch(CERTS_HASH_URL);
      if (!res.ok) throw new Error("Failed to fetch hash");
      const expectedHash = (await res.text()).trim();
      if (hashed === expectedHash) {
        sessionStorage.setItem("certs_unlocked", "true");
        setIsCertsUnlocked(true);
        setCertsPassword("");
        setCertsAuthError("");
        setIsCertsPromptOpen(false);
        setIsCertsExpanded(true);
        if (pendingCertUrl) {
          window.open(pendingCertUrl, "_blank");
          setPendingCertUrl(null);
        }
      } else {
        setCertsAuthError("[ERROR] ACCESS DENIED: INVALID REGISTRY PASSWORD MATRIX.");
        setCertsPassword("");
      }
    } catch {
      setCertsAuthError("[ERROR] UNABLE TO VERIFY CREDENTIALS. CHECK NETWORK.");
      setCertsPassword("");
    }
  };

  const toggleProjectExpansion = (title: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Directory explorer for repo inspector
  const loadDirectory = async (repoName: string, path: string) => {
    setInspectorLoading(true);
    setInspectorPath(path);
    try {
      const url = `https://api.github.com/repos/Ajit-pawara/${repoName}/contents/${path}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      data.sort((a: any, b: any) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === "dir" ? -1 : 1;
      });
      setInspectorFiles(data);
    } catch (e) {
      console.error(e);
      setInspectorFiles([]);
    } finally {
      setInspectorLoading(false);
    }
  };

  const loadFileContent = async (fileItem: any) => {
    setInspectorLoading(true);
    setInspectorCode(`// [LOADING] Fetching ${fileItem.name} contents...`);
    try {
      let fileContent = "";
      let success = false;

      const branches = ["main", "master"];
      for (const branch of branches) {
        try {
          const rawUrl = `https://raw.githubusercontent.com/Ajit-pawara/${inspectorRepo}/${branch}/${fileItem.path}`;
          const res = await fetch(rawUrl);
          if (res.ok) {
            fileContent = await res.text();
            success = true;
            break;
          }
        } catch {
          // try next branch
        }
      }

      if (!success) {
        const apiRes = await fetch(fileItem.url);
        if (apiRes.ok) {
          const apiData = await apiRes.json();
          if (apiData.encoding === "base64") {
            fileContent = atob(apiData.content.replace(/\n/g, ''));
            success = true;
          }
        }
      }

      if (success) {
        if (fileContent.includes("\u0000") || fileContent.length > 500000) {
          setInspectorCode(`// [INFO] Binary file or content too large to preview in code shell.`);
        } else {
          setInspectorCode(fileContent);
        }
      } else {
        throw new Error("Could not fetch");
      }
    } catch {
      setInspectorCode(`// [ERROR] Unable to retrieve file contents.\n// Please check the link on GitHub:\n// https://github.com/Ajit-pawara/${inspectorRepo}/blob/main/${fileItem.path}`);
    } finally {
      setInspectorLoading(false);
    }
  };

  const openCodeViewer = async (repoUrl: string) => {
    if (!repoUrl || !repoUrl.includes("github.com/Ajit-pawara")) {
      alert("This project does not have a valid GitHub repository linked.");
      return;
    }
    const parts = repoUrl.split("/");
    const repoName = parts[parts.length - 1] || parts[parts.length - 2];
    setInspectorRepo(repoName);
    setIsCodeInspectorOpen(true);
    setInspectorCode(`// Select a file to view code contents`);
    setInspectorPath("");
    setInspectorFiles([]);
    setInspectorDemoLink(null);

    // Fetch repository tree
    loadDirectory(repoName, "");

    // Fetch homepage/deploy links
    try {
      const res = await fetch(`https://api.github.com/repos/Ajit-pawara/${repoName}`);
      if (res.ok) {
        const metadata = await res.json();
        if (metadata.homepage) {
          setInspectorDemoLink(metadata.homepage);
        } else {
          // Fallback check: look inside README.md of repository
          const readmeRes = await fetch(`https://raw.githubusercontent.com/Ajit-pawara/${repoName}/main/README.md`);
          if (readmeRes.ok) {
            const text = await readmeRes.text();
            const mdLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
            let match;
            const links = [];
            while ((match = mdLinkRegex.exec(text)) !== null) {
              links.push({ label: match[1].toLowerCase(), url: match[2] });
            }
            // Find deployed homepage
            const priority = links.find(l => ["live", "demo", "website", "deploy", "link", "visit"].some(k => l.label.includes(k)));
            if (priority) {
              setInspectorDemoLink(priority.url);
            } else {
              const githubIo = text.match(/https?:\/\/[a-zA-Z0-9_-]+\.github\.io\/[a-zA-Z0-9_-]*/);
              if (githubIo) {
                setInspectorDemoLink(githubIo[0]);
              } else {
                const anyExt = links.find(l => !l.url.includes("github.com") && !l.url.includes("actions"));
                if (anyExt) setInspectorDemoLink(anyExt.url);
              }
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Retrieve selected day details
  const selectedDayLog = activeTrack.days?.find((d: any) => d.day === selectedDayNum) || null;

  return (
    <>


      {/* Main Navigation Header */}
      <header className="main-header">
        <nav className="nav-container">
          <div className="logo" style={{ cursor: 'pointer' }} onClick={(e) => { handleNavClick(e as any, 'hero'); setIsMobileMenuOpen(false); }}>
            <span className="logo-bracket">&lt;</span>
            <span className="logo-text">ROBIN</span>
            <span className="logo-bracket">/&gt;</span>
          </div>

          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X style={{ width: 18, height: 18 }} /> : <Menu style={{ width: 18, height: 18 }} />}
          </button>

          <div className={`nav-menu-wrapper ${isMobileMenuOpen ? 'open' : ''}`}>
            <ul className="nav-links">
              <li>
                <a href="#hero" className={`nav-link ${activeTab === 'hero' ? 'active' : ''}`} onClick={(e) => { handleNavClick(e, 'hero'); setIsMobileMenuOpen(false); }}>
                  <Terminal /> Whoami
                </a>
              </li>
              <li>
                <a href="#challenge" className={`nav-link ${activeTab === 'challenge' ? 'active' : ''}`} onClick={(e) => { handleNavClick(e, 'challenge'); setIsMobileMenuOpen(false); }}>
                  <Calendar /> Learning Tracker
                </a>
              </li>
              <li>
                <a href="#skills" className={`nav-link ${activeTab === 'skills' ? 'active' : ''}`} onClick={(e) => { handleNavClick(e, 'skills'); setIsMobileMenuOpen(false); }}>
                  <Cpu /> Skills Map
                </a>
              </li>
              <li>
                <a href="#certifications" className={`nav-link ${activeTab === 'certifications' ? 'active' : ''}`} onClick={(e) => { handleNavClick(e, 'certifications'); setIsMobileMenuOpen(false); }}>
                  <Award /> Certifications
                </a>
              </li>
              <li>
                <a href="#projects" className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`} onClick={(e) => { handleNavClick(e, 'projects'); setIsMobileMenuOpen(false); }}>
                  <GitBranch /> Projects
                </a>
              </li>
              <li>
                <a href="#community" className={`nav-link ${activeTab === 'community' ? 'active' : ''}`} onClick={(e) => { handleNavClick(e, 'community'); setIsMobileMenuOpen(false); }}>
                  <Share2 /> Find Me
                </a>
              </li>
              <li>
                <a href="#resume" className={`nav-link ${activeTab === 'resume' ? 'active' : ''}`} onClick={(e) => { handleNavClick(e, 'resume'); setIsMobileMenuOpen(false); }}>
                  <FileText /> Dossier
                </a>
              </li>
              <li>
                <button
                  onClick={() => { setIsAdminOpen(true); setIsMobileMenuOpen(false); }}
                  className="nav-link"
                >
                  <Sliders /> Settings
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Main Content Container */}
      <main className="workspace">
        {/* Setup Warning Banner */}
        {showWarning && activeTab === 'hero' && (
          <div id="first-time-banner" style={{
            backgroundColor: 'rgba(255, 179, 71, 0.1)',
            border: '1px solid var(--color-amber)',
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--color-amber)',
            lineHeight: 1.4
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              <span><strong>[DATABASE UNCONFIGURED]</strong> Local profile details are running on template values. Click <strong>Settings</strong> and authenticate as <strong>root</strong> to log daily certificates and learning achievements.</span>
            </div>
            <button onClick={() => {
              setShowWarning(false);
              localStorage.setItem("setup_dismissed", "true");
            }} style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-amber)',
              fontSize: '1.1rem',
              cursor: 'pointer',
              marginLeft: '12px',
              padding: '0 4px'
            }}>&times;</button>
          </div>
        )}

        {/* Hero Section / Shell Window */}
        <section id="hero" className="hero-section">
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="window-actions">
                <span className="dot close"></span>
                <span className="dot minimize"></span>
                <span className="dot maximize"></span>
              </div>
              <div className="terminal-title">robin@kali:~</div>
              <div className="terminal-env">bash</div>
            </div>
            <div className="terminal-body hero-body">
              <div className="shell-line">
                <span className="shell-prompt">robin@kali:~$</span> {typedText}
                {!isTypingFinished && <span className="blinking-cursor">|</span>}
              </div>


              {isTypingFinished && (
                <div className="hero-details" style={{ marginTop: '20px' }}>
                  <div className="profile-summary" style={{
                    display: 'flex',
                    gap: '24px',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    animation: 'heroReveal 0.55s ease both',
                    animationDelay: '0.05s'
                  }}>
                    <div className="profile-avatar-container" style={{
                      position: 'relative',
                      width: '96px',
                      height: '96px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '2.5px solid var(--color-cyan)',
                      boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
                      flexShrink: 0,
                      backgroundColor: 'var(--bg-darker)'
                    }}>
                      <img src="./profile.png" alt="Ajit Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="info-block" style={{ flex: '1', minWidth: '250px' }}>
                      <h1 className="glow-title" style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                        {db.profile?.name}
                      </h1>
                      <p className="hero-subtitle" style={{ margin: '4px 0 12px 0', color: 'var(--color-cyan)', fontSize: '1rem', fontWeight: 500 }}>
                        {db.profile?.title} @ {db.profile?.institution}
                      </p>
                      <p className="hero-bio" style={{
                        margin: 0,
                        fontSize: '0.88rem',
                        color: 'var(--text-muted)',
                        lineHeight: '1.5',
                        fontFamily: 'var(--font-sans)',
                        borderLeft: '2px solid var(--border-color)',
                        paddingLeft: '12px'
                      }}>
                        {db.profile?.bio}
                      </p>
                    </div>
                  </div>

                  <div className="hero-ctas" style={{ marginTop: '20px', animation: 'heroReveal 0.55s ease both', animationDelay: '0.35s' }}>
                    <a href="#challenge" className="btn btn-primary" onClick={(e) => handleNavClick(e, 'challenge')}><Calendar /> View Learning Tracker</a>
                    <a href="#projects" className="btn btn-secondary" onClick={(e) => handleNavClick(e, 'projects')}><Folder /> Inspect Shipped Projects</a>
                    <a href="#resume" className="btn btn-tertiary" onClick={(e) => handleNavClick(e, 'resume')}><Mail /> Get In Touch</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Learning Tracker centerpiece */}
        <section id="challenge" className="content-section">
          <div className="section-header-block">
            <h2 className="section-title"><Calendar /> Learning Tracker</h2>
            <p className="section-description">A real-time progress tracker. Select different tracks via the dropdown menu, and click on cells to inspect logs in the Secure Operations log panel.</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <select
              value={activeTrackId}
              onChange={(e) => {
                const updated = { ...db };
                updated.challenge.activeTrack = e.target.value;
                saveChanges(updated);
              }}
              className="form-control"
              style={{
                backgroundColor: 'var(--bg-darker)',
                border: '1px solid var(--border-color)',
                color: 'var(--color-cyan)',
                padding: '0 12px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                outline: 'none',
                cursor: 'pointer',
                height: '36px',
                width: 'auto',
                minWidth: '280px',
                display: 'inline-flex',
                alignItems: 'center',
                boxSizing: 'border-box'
              }}
            >
              {Object.keys(db.challenge?.tracks || {}).map(trackKey => (
                <option key={trackKey} value={trackKey}>
                  {db.challenge.tracks[trackKey].name}
                </option>
              ))}
            </select>

            {activeTrack.repoUrl && (
              <a
                href={activeTrack.repoUrl}
                target="_blank"
                className="btn btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  height: '36px',
                  padding: '0 14px',
                  fontSize: '0.8rem',
                  whiteSpace: 'nowrap',
                  boxSizing: 'border-box'
                }}
              >
                <GitBranch style={{ width: '14px', height: '14px' }} /> View Challenge Repo
              </a>
            )}
            {activeTrack && activeTrack.repoUrl && (
              <button
                onClick={() => setIsRoadmapOpen(true)}
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  height: '36px',
                  padding: '0 14px',
                  fontSize: '0.8rem',
                  whiteSpace: 'nowrap',
                  boxSizing: 'border-box'
                }}
              >
                <Compass style={{ width: '14px', height: '14px' }} /> View Interactive Roadmap
              </button>
            )}
            {activeTrack && activeTrack.repoUrl && (
              <button
                onClick={() => {
                  setActiveViewerTab("revision");
                  if (!selectedRevisionInterval) {
                    setSelectedRevisionInterval(10);
                  }
                  setIsFullscreenPreviewOpen(true);
                }}
                className="btn btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  height: '36px',
                  padding: '0 14px',
                  fontSize: '0.8rem',
                  whiteSpace: 'nowrap',
                  boxSizing: 'border-box'
                }}
              >
                <Zap style={{ width: '14px', height: '14px' }} /> Revision
              </button>
            )}
            {activeTrack && activeTrack.repoUrl && (
              <button
                onClick={() => {
                  setActiveViewerTab("project");
                  setIsFullscreenPreviewOpen(true);
                }}
                className="btn btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  height: '36px',
                  padding: '0 14px',
                  fontSize: '0.8rem',
                  whiteSpace: 'nowrap',
                  boxSizing: 'border-box'
                }}
              >
                <FileCode style={{ width: '14px', height: '14px' }} /> Project
              </button>
            )}
          </div>

          <div className="challenge-container">
            {/* Visual grid card */}
            <div className="challenge-grid-card card">
              <div className="card-header-bar">
                <h3><Grid /> Track Contribution Map</h3>
                <div className="grid-legend">
                  <span className="legend-item"><span className="legend-cell complete"></span> Completed</span>
                  <span className="legend-item"><span className="legend-cell active"></span> Active</span>
                  <span className="legend-item"><span className="legend-cell upcoming"></span> Pending</span>
                </div>
              </div>

              <div className="grid-wrapper">
                <div className="contribution-grid">
                  {Array.from({ length: activeTrack.totalDays || 90 }, (_, index) => {
                    const dayNum = index + 1;

                    let cellClass = "day-cell";
                    if (dayNum <= activeTrack.currentDay) {
                      cellClass += " complete";
                    } else if (dayNum === activeTrack.currentDay + 1) {
                      cellClass += " active";
                    } else {
                      cellClass += " upcoming";
                    }
                    if (dayNum === selectedDayNum) {
                      cellClass += " selected";
                    }

                    return (
                      <div
                        key={dayNum}
                        className={cellClass}
                        onClick={() => {
                          if (dayNum > 10 && isContentLocked) {
                            setSelectedDayNum(dayNum);
                            setIsPasswordPromptOpen(true);
                          } else {
                            setSelectedDayNum(dayNum);
                            setIsDayOptionModalOpen(true);
                          }
                        }}
                      >
                        {String(dayNum).padStart(2, '0')}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid-summary-footer">
                <span id="challenge-stats">
                  <strong>{activeTrack.completedDays} / {activeTrack.totalDays} Days Completed</strong>
                </span>
                <span>Active Track: <strong>{activeTrack.name}</strong></span>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Skills Map */}
        <section id="skills" className="content-section">
          <div className="section-header-block" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
            <div>
              <h2 className="section-title"><ShieldCheck /> Technical Skill Vectors & Method</h2>
              <p className="section-description">Interactive capabilities matrix. Select views below to audit skill radar, matrices, or learning philosophy.</p>
            </div>

            <div className="terminal-tabs" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveSkillsTab("radar")}
                className={`btn btn-sm ${activeSkillsTab === 'radar' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Activity style={{ width: '14px', height: '14px' }} /> Skill Radar Chart
              </button>
              <button
                onClick={() => setActiveSkillsTab("list")}
                className={`btn btn-sm ${activeSkillsTab === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Layers style={{ width: '14px', height: '14px' }} /> Tactical Metrics
              </button>
              <button
                onClick={() => setActiveSkillsTab("philosophy")}
                className={`btn btn-sm ${activeSkillsTab === 'philosophy' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Compass style={{ width: '14px', height: '14px' }} /> Learning Philosophy
              </button>
              {(activeTrackId === 'cybersecurity' || activeTrackId === 'java_dsa') && (
                <button
                  onClick={() => setActiveSkillsTab("pathways")}
                  className={`btn btn-sm ${activeSkillsTab === 'pathways' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Zap style={{ width: '14px', height: '14px' }} /> Specialized Pathways
                </button>
              )}
            </div>
          </div>

          <div className="skills-interactive-container">
            {activeSkillsTab === 'radar' && (
              <div className="chart-card card" style={{ maxWidth: '650px', margin: '0 auto', padding: '24px' }}>
                <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity style={{ color: 'var(--color-cyan)' }} /> Skill Distribution Radar
                </h3>
                <div className="radar-wrapper" style={{ minHeight: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RadarChart skills={db.skills || []} />
                </div>
              </div>
            )}

            {activeSkillsTab === 'philosophy' && (
              <div className="philosophy-card card" style={{ maxWidth: '750px', margin: '0 auto', padding: '24px' }}>
                <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Compass style={{ color: 'var(--color-cyan)' }} /> Learning Philosophy (70-20-10)
                </h3>
                <p className="philosophy-intro" style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>My training methodology allocates focus across three action-oriented pillars:</p>

                <div className="philosophy-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                  <div className="phi-box" style={{ border: '1px solid var(--border-color)', padding: '16px', borderRadius: '6px', backgroundColor: 'var(--bg-darker)' }}>
                    <div className="phi-value neon-cyan" style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{db.philosophy?.handsOn}%</div>
                    <div className="phi-label" style={{ fontWeight: 'bold', color: 'var(--text-primary)', margin: '4px 0' }}>Hands-On Labs</div>
                    <div className="phi-desc" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active build/attack tasks (TryHackMe, HTB, custom script setups).</div>
                  </div>
                  <div className="phi-box" style={{ border: '1px solid var(--border-color)', padding: '16px', borderRadius: '6px', backgroundColor: 'var(--bg-darker)' }}>
                    <div className="phi-value neon-green" style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{db.philosophy?.theory}%</div>
                    <div className="phi-label" style={{ fontWeight: 'bold', color: 'var(--text-primary)', margin: '4px 0' }}>Structured Theory</div>
                    <div className="phi-desc" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Core protocols, documentation study, RFC audits.</div>
                  </div>
                  <div className="phi-box" style={{ border: '1px solid var(--border-color)', padding: '16px', borderRadius: '6px', backgroundColor: 'var(--bg-darker)' }}>
                    <div className="phi-value neon-orange" style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{db.philosophy?.teaching}%</div>
                    <div className="phi-label" style={{ fontWeight: 'bold', color: 'var(--text-primary)', margin: '4px 0' }}>Teaching Others</div>
                    <div className="phi-desc" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Documenting insights publicly to reinforce understanding.</div>
                  </div>
                </div>

                <div className="platforms-bar" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', flexWrap: 'wrap' }}>
                  <span className="platform-title" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>ACTIVE LAB PLATFORMS:</span>
                  <span className="platform-badge" style={{ backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Shield style={{ width: '12px', height: '12px' }} /> TryHackMe</span>
                  <span className="platform-badge" style={{ backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Code2 style={{ width: '12px', height: '12px' }} /> HackerRank</span>
                </div>
              </div>
            )}

            {activeSkillsTab === 'list' && (
              <div className="tools-card card" style={{ maxWidth: '650px', margin: '0 auto', padding: '24px' }}>
                <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers style={{ color: 'var(--color-cyan)' }} /> Tactical Skill Matrices
                </h3>
                <div className="skills-horizontal-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {db.skills?.map((s: any, idx: number) => (
                    <div key={idx} className="skill-item">
                      <div className="skill-info-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem' }}>
                        <span className="skill-name" style={{ fontWeight: 'bold' }}>{s.name}</span>
                        <span className="skill-level" style={{ color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>{s.level}%</span>
                      </div>
                      <div className="skill-meter-bg" style={{ height: '6px', backgroundColor: 'var(--bg-darker)', borderRadius: '3px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        <div className="skill-meter-fill" style={{ width: `${s.level}%`, height: '100%', backgroundColor: 'var(--color-cyan)', borderRadius: '3px', boxShadow: '0 0 8px var(--color-cyan)' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSkillsTab === 'pathways' && (activeTrackId === 'cybersecurity' || activeTrackId === 'java_dsa') && (
              <div className="pathways-card card" style={{ maxWidth: '850px', margin: '0 auto', padding: '24px' }}>
                <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap style={{ color: 'var(--color-cyan)' }} /> Cybersecurity Career Pathways Explorer
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
                  Select a specialized domain pathway below to view target skill vectors, toolkits, and recommended industry credentials.
                </p>

                <div className="pathway-buttons-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                  {specializedPathways.map((p) => {
                    const isSelected = selectedPathway === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPathway(isSelected ? null : p.id)}
                        style={{
                          border: isSelected ? '1px solid var(--color-cyan)' : '1px solid var(--border-color)',
                          padding: '16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'rgba(0, 217, 255, 0.03)' : 'var(--bg-darker)',
                          boxShadow: isSelected ? '0 0 10px rgba(0, 217, 255, 0.1)' : 'none',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}
                      >
                        <h4 style={{ margin: 0, fontSize: '0.9rem', color: isSelected ? 'var(--color-cyan)' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Shield style={{ width: '14px', height: '14px', flexShrink: 0 }} /> {p.title.split(' (')[0]}
                        </h4>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {isSelected ? '[DEEP SCAN ENGAGED]' : 'Click to inspect pathway details'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {selectedPathway ? (() => {
                  const pathway = specializedPathways.find(p => p.id === selectedPathway);
                  if (!pathway) return null;
                  return (
                    <div className="pathway-detail-panel" style={{
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '20px'
                    }}>
                      <h4 style={{ color: 'var(--color-cyan)', margin: '0 0 8px 0', fontSize: '1rem' }}>{pathway.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: '16px' }}>{pathway.description}</p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        <div>
                          <h5 style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CORE SKILL VECTOR TARGETS:</h5>
                          <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.8rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {pathway.skills.map((s, idx) => <li key={idx}>{s}</li>)}
                          </ul>
                        </div>

                        <div>
                          <h5 style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>RECOMMENDED TOOLKITS & LABS:</h5>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {pathway.tools.map((t, idx) => (
                              <span key={idx} style={{ backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '3px 8px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t}</span>
                            ))}
                          </div>

                          <h5 style={{ margin: '16px 0 8px 0', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TARGET INDUSTRY CREDENTIALS:</h5>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {pathway.certifications.map((c, idx) => (
                              <span key={idx} style={{ backgroundColor: 'rgba(0, 217, 255, 0.05)', border: '1px solid rgba(0, 217, 255, 0.2)', borderRadius: '4px', padding: '3px 8px', fontSize: '0.72rem', color: 'var(--color-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}><Award style={{ width: '12px', height: '12px' }} /> {c}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })() : (
                  <div style={{
                    border: '1px dashed var(--border-color)',
                    padding: '24px',
                    borderRadius: '6px',
                    textAlign: 'center',
                    backgroundColor: 'var(--bg-darker)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    [SELECT A PATHWAY CARRIER CARD ABOVE TO INITIATE INTEL SCAN]
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Certifications */}
        <section id="certifications" className="content-section">
          <div className="section-header-block" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
            <div>
              <h2 className="section-title" style={{ margin: 0 }}><Award /> Verified Certifications & Credentials</h2>
              <p className="section-description" style={{ margin: '4px 0 0 0' }}>Cryptographic verification profiles and training completions.</p>
            </div>
            <button
              onClick={() => {
                if (isCertsUnlocked) {
                  setIsCertsExpanded(!isCertsExpanded);
                } else {
                  setIsCertsPromptOpen(true);
                }
              }}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              {isCertsExpanded ? <EyeOff /> : <Eye />}
              {isCertsExpanded ? "Collapse Credentials" : "Decrypt Credentials"}
            </button>
          </div>

          {isCertsExpanded ? (
            <div className="certs-grid">
              {db.certifications?.map((c: any, idx: number) => (
                <div key={idx} className="cert-card card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Award className="cert-icon" style={{ color: 'var(--color-cyan)' }} />
                    <div>
                      <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{c.name}</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.provider} | ID: {c.credentialId}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" onClick={() => {
              if (isCertsUnlocked) {
                setIsCertsExpanded(true);
              } else {
                setIsCertsPromptOpen(true);
              }
            }} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '30px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              border: '1px dashed var(--color-cyan)',
              backgroundColor: 'rgba(0, 217, 255, 0.01)',
              fontFamily: 'var(--font-mono)'
            }}>
              <Award style={{ width: '28px', height: '28px', color: 'var(--color-cyan)', marginBottom: '8px' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>[SECURE] Credentials Registry Encrypted</span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>Click here to authorize credential decryption and view certifications.</span>
            </div>
          )}
        </section>

        {/* Projects Showcase */}
        <section id="projects" className="content-section">
          <div className="section-header-block">
            <h2 className="section-title"><GitMerge /> Software Projects Registry</h2>
            <p className="section-description">A curated index of security modules, utility applications, and static assets engineered individually.</p>
          </div>

          <div className="projects-layout-grid">
            {db.projects?.map((p: any, idx: number) => {
              const isExpanded = !!expandedProjects[p.title];
              return (
                <div
                  key={idx}
                  className={`project-card card ${isExpanded ? 'expanded' : 'collapsed'}`}
                  onClick={() => toggleProjectExpansion(p.title)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: isExpanded ? '12px' : '0px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <h3 className="project-title" style={{ fontSize: '1.05rem', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Folder style={{ width: '16px', height: '16px', color: 'var(--color-cyan)' }} />
                      {p.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {isExpanded ? (
                        <EyeOff style={{ width: '14px', height: '14px', color: 'var(--color-cyan)' }} />
                      ) : (
                        <Eye style={{ width: '14px', height: '14px', color: 'var(--text-muted)' }} />
                      )}
                      <span style={{ fontSize: '0.72rem', color: isExpanded ? 'var(--color-cyan)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {isExpanded ? 'Hide' : 'Inspect'}
                      </span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div
                      className="project-details-expanded"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        borderTop: '1px solid var(--border-color)',
                        paddingTop: '12px',
                        animation: 'fadeIn 0.2s ease-in-out'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="project-role-pill" style={{
                          backgroundColor: 'rgba(0, 217, 255, 0.08)',
                          color: 'var(--color-cyan)',
                          border: '1px solid rgba(0, 217, 255, 0.15)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-mono)'
                        }}>
                          Role: {p.role}
                        </span>
                      </div>

                      <p className="project-description" style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0 }}>
                        {p.description}
                      </p>

                      <div className="project-contrib-panel" style={{
                        padding: '10px',
                        backgroundColor: 'var(--bg-darker)',
                        borderLeft: '2px solid var(--color-cyan)',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        lineHeight: 1.4
                      }}>
                        &gt; {p.contribution}
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {p.tags?.map((t: string, i: number) => (
                          <span key={i} className="skill-tag" style={{
                            backgroundColor: 'var(--bg-darker)',
                            border: '1px solid var(--border-color)',
                            fontSize: '0.7rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            color: 'var(--text-muted)'
                          }}>
                            {t}
                          </span>
                        ))}
                      </div>

                      <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', gap: '10px', borderTop: '1px solid var(--border-color)' }}>
                        <button
                          onClick={() => openCodeViewer(p.link)}
                          className="btn btn-secondary btn-sm"
                          style={{ flex: 1, justifyContent: 'center' }}
                        >
                          <Terminal /> Source Code Inspector
                        </button>
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-tertiary btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <GitBranch /> Repo
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Find Me Platform Hub */}
        <section id="community" className="content-section">
          <div className="section-header-block" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
            <div>
              <h2 className="section-title"><Users /> Platform Hub & Logs</h2>
              <p className="section-description">I document my journey daily across multiple media streams and training networks.</p>
            </div>
            <button
              onClick={() => setIsVolleyballExpanded(!isVolleyballExpanded)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              {isVolleyballExpanded ? <EyeOff /> : <Eye />}
              {isVolleyballExpanded ? "Hide Sports & Academy Background" : "Show Sports & Academy Background"}
            </button>
          </div>

          <div className="social-cards-grid">
            {db.socials?.map((s: any, idx: number) => (
              <a key={idx} href={s.url} target="_blank" rel="noopener noreferrer" className="social-card card" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                textDecoration: 'none'
              }}>
                <div className="social-icon-wrapper" style={{
                  backgroundColor: 'var(--bg-darker)',
                  padding: '10px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-color)'
                }}>
                  {renderPlatformIcon(s.platform)}
                </div>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{s.platform}</h4>
                  <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-muted)' }}>{s.purpose}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Volleyball Feature Box */}
          {isVolleyballExpanded && (
            <div className="sports-feature-box card" style={{ marginTop: '16px' }}>
              <div className="sports-icon-wrapper">
                <VolleyballIcon className="ball-icon" />
              </div>
              <div className="sports-info" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 style={{ margin: 0 }}>Sports & Discipline Background: Volleyball (Zonal/State level)</h4>
                <p style={{ margin: 0 }}>
                  Competing in volleyball at the zonal and state level has instilled deep discipline, tactical coordination, and team-oriented resilience in me. I carry these operational traits into software engineering and threat mitigation.
                </p>
                <div style={{ marginTop: '4px' }}>
                  <button
                    onClick={() => {
                      if (isCertsUnlocked) {
                        window.open("https://drive.google.com/drive/folders/1rOXaHBZRyLMgpFS_KPmBEjNy85cXFlAM?usp=drive_link", "_blank");
                      } else {
                        setPendingCertUrl("https://drive.google.com/drive/folders/1rOXaHBZRyLMgpFS_KPmBEjNy85cXFlAM?usp=drive_link");
                        setIsCertsPromptOpen(true);
                      }
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      padding: '6px 12px',
                      cursor: 'pointer'
                    }}
                  >
                    <Award style={{ width: '14px', height: '14px' }} /> View Sports & Academic Certifications
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Learning Roadmap Timeline */}


        {/* Printable Resume Section */}
        <section id="resume" className="content-section">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h2 className="section-title" style={{ margin: 0 }}><FileCheck /> Security Dossier & Contact</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              {isResumeExpanded && (
                <button onClick={() => {
                  setIsResumeExpanded(false);
                  document.getElementById("resume")?.scrollIntoView({ behavior: "smooth" });
                }} className="btn btn-secondary print-hide" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <EyeOff /> Hide Dossier
                </button>
              )}
              <button onClick={handlePrint} className="btn btn-secondary print-hide" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Printer /> Download PDF Resume
              </button>
            </div>
          </div>

          <div className="dossier-layout">
            {/* Dossier Toggle Card */}
            {!isResumeExpanded && (
              <div onClick={() => setIsResumeExpanded(true)} className="resume-expand-card card print-hide" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                border: '1px dashed var(--color-cyan)',
                backgroundColor: 'rgba(0, 217, 255, 0.02)',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ fontSize: '2.2rem', color: 'var(--color-cyan)', marginBottom: '12px' }}>
                  <FileText />
                </div>
                <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>Interactive Cyber Dossier</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '320px', margin: '4px 0 16px 0' }}>Expand to view education achievements, professional roadmap history, and verified technical credentials.</p>
                <button className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Eye /> Expand Dossier</button>
              </div>
            )}

            {/* Printable Resume layout */}
            {isResumeExpanded && (
              <div className="resume-sheet card" style={{
                display: 'block',
                padding: '40px',
                fontFamily: 'var(--font-sans)',
                backgroundColor: 'var(--bg-panel)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                borderRadius: '6px'
              }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <h1 style={{
                    fontSize: '2.2rem',
                    fontWeight: '800',
                    margin: '0 0 8px 0',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: 'var(--text-primary)'
                  }}>
                    AJIT PAWARA
                  </h1>
                  <div style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}>
                    <span>Karad</span>
                    <span>|</span>
                    <a href="mailto:ajitdawar1729@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                      ajitdawar1729@gmail.com
                    </a>
                    <span>|</span>
                    <a href="https://www.linkedin.com/in/ajit-pawara-69541a305/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline', fontWeight: '500' }}>
                      LinkedIn
                    </a>
                    <span>|</span>
                    <a href="https://github.com/Ajit-pawara" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline', fontWeight: '500' }}>
                      GitHub
                    </a>
                    <span>|</span>
                    <span>9322076276</span>
                  </div>
                </div>

                <hr style={{ border: 'none', height: '3px', backgroundColor: '#c29a53', margin: '0 0 20px 0' }} />

                {/* SUMMARY */}
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    borderBottom: '1.5px solid #c29a53',
                    paddingBottom: '3px',
                    marginBottom: '8px',
                    color: 'var(--text-primary)',
                    letterSpacing: '0.5px'
                  }}>
                    SUMMARY
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: 0, lineHeight: '1.5' }}>
                    IT student passionate about cybersecurity, modern responsive design, and real-world coding challenges. Currently learning ethical hacking and DSA in Java to enhance problem-solving skills. Actively seeking opportunities to apply and grow these skills through internships, workshops, and collaborative projects.
                  </p>
                </div>

                {/* SKILLS ROW */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      borderBottom: '1.5px solid #c29a53',
                      paddingBottom: '3px',
                      marginBottom: '8px',
                      color: 'var(--text-primary)',
                      letterSpacing: '0.5px'
                    }}>
                      PROFESSIONAL SKILLS
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      <div>Design Understanding</div>
                      <div>UI Design</div>
                      <div>Team Collaboration</div>
                      <div>Time Management</div>
                    </div>
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      borderBottom: '1.5px solid #c29a53',
                      paddingBottom: '3px',
                      marginBottom: '8px',
                      color: 'var(--text-primary)',
                      letterSpacing: '0.5px'
                    }}>
                      TECHNICAL SKILLS
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div><strong>Cybersecurity:</strong> Learning ethical hacking & tools</div>
                      <div><strong>Languages:</strong> C, C++, Java (DSA – learning)</div>
                      <div><strong>Web:</strong> HTML, CSS, JavaScript (Basic)</div>
                      <div><strong>Backend:</strong> Firebase (Basic)</div>
                    </div>
                  </div>
                </div>

                {/* PROJECTS */}
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    borderBottom: '1.5px solid #c29a53',
                    paddingBottom: '3px',
                    marginBottom: '8px',
                    color: 'var(--text-primary)',
                    letterSpacing: '0.5px'
                  }}>
                    PROJECTS
                  </h3>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>General Championship scoreboard</strong>
                      <a href="https://github.com/Ajit-pawara/GCTrack" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--color-cyan)', textDecoration: 'underline' }}>
                        (link)
                      </a>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                      Developed a web app for managing a college championship scoreboard with team registrations and updates. Built using HTML, CSS, JavaScript, and Firebase for real-time database and authentication.
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Personal Portfolio website</strong>
                      <a href="https://github.com/Ajit-pawara/Portfolio" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--color-cyan)', textDecoration: 'underline' }}>
                        (link)
                      </a>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                      Developed a personal portfolio website to showcase projects and skills. Built with HTML, CSS, and JavaScript, featuring responsive design and modern UI for a professional online presence.
                    </p>
                  </div>
                </div>

                {/* CERTIFICATION & PRACTICE */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      borderBottom: '1.5px solid #c29a53',
                      paddingBottom: '3px',
                      marginBottom: '8px',
                      color: 'var(--text-primary)',
                      letterSpacing: '0.5px'
                    }}>
                      CERTIFICATION
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div>Solutions Architecture Job Simulation</div>
                      <div>Cybersecurity Analyst Job Simulation</div>
                    </div>
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      borderBottom: '1.5px solid #c29a53',
                      paddingBottom: '3px',
                      marginBottom: '8px',
                      color: 'var(--text-primary)',
                      letterSpacing: '0.5px'
                    }}>
                      PRACTICE PLATFORMS
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>• TryHackMe</span>
                        <a href="https://tryhackme.com/p/Robinx" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-cyan)', textDecoration: 'underline' }}>
                          (link)
                        </a>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>• HackerRank</span>
                        <a href="https://www.hackerrank.com/profile/ajitdawar1729" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-cyan)', textDecoration: 'underline' }}>
                          (link)
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* EXPERIENCE */}
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    borderBottom: '1.5px solid #c29a53',
                    paddingBottom: '3px',
                    marginBottom: '8px',
                    color: 'var(--text-primary)',
                    letterSpacing: '0.5px'
                  }}>
                    EXPERIENCE
                  </h3>
                  {/* Empty as per screenshot */}
                </div>

                {/* EDUCATION */}
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    borderBottom: '1.5px solid #c29a53',
                    paddingBottom: '3px',
                    marginBottom: '8px',
                    color: 'var(--text-primary)',
                    letterSpacing: '0.5px'
                  }}>
                    EDUCATION
                  </h3>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Bachelor of Technology in Information Technology</strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>2024-2028</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Government College of Engineering, Karad | Maharashtra</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>CGPA: 7.55</div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Higher Secondary Education (HSC)</strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>2022-2024</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Hps and Jr College, Dondaicha | Maharashtra State Board 2024</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Grade: 79.00%</div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Secondary School Certificate (SSC)</strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>2016-2022</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Hast Public School, Dondaicha | Maharashtra State Board 2022</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Grade: 95.20%</div>
                  </div>
                </div>

                {/* VOLUNTEER WORK & ACHIEVEMENTS */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  <div>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      borderBottom: '1.5px solid #c29a53',
                      paddingBottom: '3px',
                      marginBottom: '8px',
                      color: 'var(--text-primary)',
                      letterSpacing: '0.5px'
                    }}>
                      VOLUNTEER WORK
                    </h3>
                    {/* Empty as per screenshot */}
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      borderBottom: '1.5px solid #c29a53',
                      paddingBottom: '3px',
                      marginBottom: '8px',
                      color: 'var(--text-primary)',
                      letterSpacing: '0.5px'
                    }}>
                      ACHIEVEMENTS
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div>• Zonal-Level Volleyball Player (2024)</div>
                      <div>• State-Level Hockey Player (2023)</div>
                      <div>• State-Level Floor-ball Player (2023)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Console Form */}
            <div className="terminal-window contact-console">
              <div className="terminal-header">
                <div className="window-actions">
                  <span className="dot close"></span>
                  <span className="dot minimize"></span>
                  <span className="dot maximize"></span>
                </div>
                <div className="terminal-title">contact-operator --port=1337</div>
                <span className="terminal-badge secure">SECURE_LINK</span>
              </div>
              <div className="terminal-body console-body">
                <p className="console-greet">// Submit an encrypted message directly to Ajit Pawara</p>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const statusEl = document.getElementById("contact-status");
                  if (statusEl) {
                    statusEl.className = "contact-status-msg";
                    statusEl.textContent = "[INFO] Establishing cipher socket link...";
                    setTimeout(() => {
                      statusEl.className = "contact-status-msg success";
                      statusEl.innerHTML = `[OK] Socket open. Message packet securely transmitted.<br>Payload encrypted and cached.`;
                      (e.target as HTMLFormElement).reset();
                    }, 1200);
                  }
                }} className="console-form">
                  <div className="form-line">
                    <span className="form-prefix">&gt; name:</span>
                    <input type="text" placeholder="Enter full name" required className="console-input" />
                  </div>
                  <div className="form-line">
                    <span className="form-prefix">&gt; email:</span>
                    <input type="email" placeholder="Enter contact email" required className="console-input" />
                  </div>
                  <div className="form-line">
                    <span className="form-prefix">&gt; message:</span>
                    <textarea placeholder="Write security review request / query..." required className="console-textarea" rows={4}></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary form-submit"><Send /> Transmit Message</button>
                </form>
                <div id="contact-status" className="contact-status-msg"></div>
              </div>
            </div>
          </div>
          {/* Footer */}
          <footer className="main-footer print-hide" style={{ marginTop: '60px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <div className="footer-content">
              <p>&copy; 2026 Ajit Pawara. Secured Static Operator Portfolio.</p>
              <p className="footer-note">Designed in compliance with terminal operations dashboard spec. Hit Settings to customize database schema.</p>
            </div>
          </footer>
        </section>
      </main>

      {/* Code Viewer Modal */}
      {isCodeInspectorOpen && (
        <div className="modal-overlay active" onClick={(e) => {
          if (e.target === e.currentTarget) setIsCodeInspectorOpen(false);
        }}>
          <div className="modal-container code-viewer-container">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <h3><Terminal /> Repository Code Inspector</h3>
                {inspectorDemoLink && (
                  <a href={inspectorDemoLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{
                    padding: '4px 10px',
                    fontSize: '0.72rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: 'var(--color-cyan)',
                    color: 'var(--bg-darker)'
                  }}>
                    <ChevronLeft style={{ transform: 'rotate(180deg)', width: '12px', height: '12px' }} /> Open Live Site
                  </a>
                )}
              </div>
              <button className="modal-close" onClick={() => setIsCodeInspectorOpen(false)}>&times;</button>
            </div>

            <div className="code-viewer-layout">
              {/* Explorer Sidebar */}
              <div className="code-viewer-sidebar">
                <div className="repo-meta-header">
                  <span className="repo-name-label">{inspectorRepo}</span>
                  <span className="repo-branch-label">main</span>
                </div>
                <div className="file-tree-container">
                  {inspectorLoading && inspectorFiles.length === 0 ? (
                    <div className="terminal-loader">Loading repository structure...</div>
                  ) : (
                    <>
                      {inspectorPath && (
                        <div
                          className="file-tree-item file-tree-back-item directory"
                          onClick={() => {
                            const parts = inspectorPath.split("/");
                            parts.pop();
                            const parent = parts.join("/");
                            loadDirectory(inspectorRepo, parent);
                          }}
                        >
                          <ChevronLeft /> .. (Back)
                        </div>
                      )}
                      {inspectorFiles.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            if (item.type === 'dir') {
                              loadDirectory(inspectorRepo, item.path);
                            } else {
                              loadFileContent(item);
                            }
                          }}
                          className={`file-tree-item ${item.type === 'dir' ? 'directory' : 'file'}`}
                        >
                          {item.type === 'dir' ? <Folder /> : <FileCode />}
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Viewer Area */}
              <div className="code-viewer-main">
                <div className="code-header-bar">
                  <span className="active-file-path">{inspectorPath || 'Select a file'}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(inspectorCode);
                      alert('Copied to clipboard!');
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                  >
                    <Copy /> Copy Code
                  </button>
                </div>
                <div className="code-content-wrapper">
                  <pre id="inspector-code-block">
                    <code className="language-javascript">{inspectorCode}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Roadmap Viewer Modal */}
      {isRoadmapOpen && (
        <div className="modal-overlay active" onClick={(e) => {
          if (e.target === e.currentTarget) setIsRoadmapOpen(false);
        }}>
          <div className="modal-container code-viewer-container" style={{ maxWidth: '95vw', width: '1200px', height: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass style={{ color: 'var(--color-cyan)', width: '20px', height: '20px' }} />
                <h3 style={{ margin: 0 }}>Interactive Training Roadmap Preview</h3>
              </div>
              <button className="modal-close" onClick={() => setIsRoadmapOpen(false)}>&times;</button>
            </div>
            <div className="modal-body" style={{ flex: 1, padding: 0, overflow: 'hidden', height: 'calc(100% - 60px)' }}>
              <iframe
                src={getTrackRoadmapUrl(activeTrack)}
                style={{ width: '100%', height: '100%', border: 'none', backgroundColor: '#fff', borderRadius: '0 0 6px 6px' }}
                title="Roadmap HTML Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen HTML Preview Modal */}
      {/* Day Selector Option Modal */}
      {isDayOptionModalOpen && (
        <div className="modal-overlay active" onClick={(e) => {
          if (e.target === e.currentTarget) setIsDayOptionModalOpen(false);
        }}>
          <div className="modal-container" style={{ maxWidth: '420px', padding: '24px', textAlign: 'center', backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
            <h3 style={{ marginBottom: '8px', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Select View Mode for Day {selectedDayNum}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '20px' }}>
              Choose how you want to inspect this daily checkpoint.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                className="btn btn-primary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px' }}
                onClick={() => {
                  setActiveViewerTab("log");
                  setIsDayOptionModalOpen(false);
                  setIsFullscreenPreviewOpen(true);
                }}
              >
                <FileText style={{ width: '16px', height: '16px' }} /> Read Written Log
              </button>
              <button
                className="btn btn-secondary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px' }}
                onClick={() => {
                  setActiveViewerTab("preview");
                  setIsDayOptionModalOpen(false);
                  setIsFullscreenPreviewOpen(true);
                }}
              >
                <Eye style={{ width: '16px', height: '16px' }} /> View HTML Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen HTML Preview / Log Modal */}
      {isFullscreenPreviewOpen && (
        <div className="modal-overlay active" onClick={(e) => {
          if (e.target === e.currentTarget) setIsFullscreenPreviewOpen(false);
        }}>
          <div className="modal-container code-viewer-container" style={{ maxWidth: '95vw', width: '1300px', height: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye style={{ color: 'var(--color-cyan)', width: '20px', height: '20px' }} />
                <h3 style={{ margin: 0 }}>
                  {activeViewerTab === 'revision'
                    ? `Days ${selectedRevisionInterval - 9}–${selectedRevisionInterval} Revision`
                    : activeViewerTab === 'project'
                      ? 'Project Workspace'
                      : `Day ${selectedDayNum}`} Lab Details
                </h3>
              </div>

              {/* Header tabs inside modal for log/preview mode */}
              {(activeViewerTab === "log" || activeViewerTab === "preview") && (
                <div className="terminal-tabs" style={{ display: 'flex', gap: '6px', marginLeft: 'auto', marginRight: '16px' }}>
                  <button
                    onClick={() => setActiveViewerTab("log")}
                    className={`btn btn-sm ${activeViewerTab === 'log' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '4px 10px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <FileText style={{ width: '12px', height: '12px' }} /> Log View
                  </button>
                  <button
                    onClick={() => setActiveViewerTab("preview")}
                    className={`btn btn-sm ${activeViewerTab === 'preview' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '4px 10px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Eye style={{ width: '12px', height: '12px' }} /> HTML Preview
                  </button>
                </div>
              )}

              <button className="modal-close" onClick={() => setIsFullscreenPreviewOpen(false)}>&times;</button>
            </div>

            <div className="modal-body" style={{
              flex: 1,
              padding: activeViewerTab === 'log' ? '20px' : '0',
              overflowY: activeViewerTab === 'log' ? 'auto' : 'hidden',
              backgroundColor: 'var(--bg-dark)',
              color: 'var(--text-primary)',
              fontFamily: activeViewerTab === 'log' ? 'var(--font-mono)' : 'inherit',
              overscrollBehavior: 'contain'
            }}>
              {activeViewerTab === 'preview' ? (
                <div style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {activeTrack && activeTrack.repoUrl ? (
                    <>
                      {checkingIframe ? (
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 1,
                          height: '100%',
                          backgroundColor: 'var(--bg-darker)',
                          color: 'var(--color-cyan)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8rem'
                        }}>
                          <RefreshCw className="loader-spin" style={{ width: '24px', height: '24px', marginBottom: '10px' }} />
                          <span>Verifying remote lab presence on GitHub...</span>
                        </div>
                      ) : iframeExists ? (
                        <iframe
                          src={getTrackIframeUrl(activeTrackId, activeTrack, selectedDayNum, false)}
                          style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            backgroundColor: 'transparent',
                            colorScheme: 'dark'
                          }}
                          title={`Day ${selectedDayNum} HTML Preview`}
                        />
                      ) : (
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 1,
                          padding: '24px',
                          textAlign: 'center',
                          color: 'var(--text-muted)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8rem',
                          lineHeight: 1.5,
                          backgroundColor: 'var(--bg-darker)'
                        }}>
                          <Compass style={{ color: 'var(--color-amber)', width: '32px', height: '32px', marginBottom: '12px' }} />
                          <span style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>
                            [AWAITING UPLOAD] Day {selectedDayNum} Lab Preview
                          </span>
                          <span style={{ fontSize: '0.78rem', maxWidth: '440px', color: 'var(--text-muted)', display: 'block', marginBottom: '12px' }}>
                            The HTML log file for Day {selectedDayNum} hasn't been uploaded to GitHub yet, or is still building on GitHub Pages.
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-green)', fontWeight: 500, backgroundColor: 'rgba(0, 255, 136, 0.05)', padding: '6px 12px', borderRadius: '4px', border: '1px solid rgba(0, 255, 136, 0.15)' }}>
                            ⚡ This preview will automatically load here as soon as the file arrives in your repository!
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1,
                      padding: '24px',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      lineHeight: 1.5,
                      backgroundColor: 'var(--bg-darker)'
                    }}>
                      <ShieldAlert style={{ color: 'var(--color-amber)', width: '28px', height: '28px', marginBottom: '10px' }} />
                      <span>[INFO] HTML Page Previews require a repository configured for this track.</span>
                      <span style={{ fontSize: '0.72rem', marginTop: '6px' }}>Configure the repoUrl in your track settings to enable auto-loading.</span>
                    </div>
                  )}
                </div>
              ) : activeViewerTab === 'revision' ? (
                <div style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="revision-tabs-container" style={{ padding: '10px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
                    {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(val => {
                      const start = val - 9;
                      const label = `Days ${start}–${val}`;
                      const isUnlocked = activeTrack.currentDay >= start;
                      const isActive = selectedRevisionInterval === val;
                      const needsPass = val >= 20 && isContentLocked;
                      return (
                        <button
                          key={val}
                          onClick={() => {
                            if (isUnlocked) {
                              setSelectedRevisionInterval(val);
                              if (needsPass) {
                                setIsPasswordPromptOpen(true);
                              }
                            }
                          }}
                          className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                          style={{
                            padding: '4px 10px',
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-mono)',
                            cursor: isUnlocked ? 'pointer' : 'not-allowed',
                            opacity: isUnlocked ? 1 : 0.4,
                            whiteSpace: 'nowrap',
                            flexShrink: 0
                          }}
                          disabled={!isUnlocked}
                        >
                          {label} {!isUnlocked && "🔒"}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {activeTrack && activeTrack.repoUrl ? (
                      <>
                        {checkingIframe ? (
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1,
                            backgroundColor: 'var(--bg-darker)',
                            color: 'var(--color-cyan)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.8rem'
                          }}>
                            <RefreshCw className="loader-spin" style={{ width: '24px', height: '24px', marginBottom: '10px' }} />
                            <span>Verifying remote lab presence on GitHub...</span>
                          </div>
                        ) : iframeExists ? (
                          <iframe
                            src={getTrackIframeUrl(activeTrackId, activeTrack, selectedRevisionInterval, true)}
                            style={{
                              width: '100%',
                              height: '100%',
                              border: 'none',
                              backgroundColor: 'transparent',
                              colorScheme: 'dark'
                            }}
                            title={`Days ${selectedRevisionInterval - 9}-${selectedRevisionInterval} Revision Preview`}
                          />
                        ) : (
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1,
                            padding: '24px',
                            textAlign: 'center',
                            color: 'var(--text-muted)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.8rem',
                            lineHeight: 1.5,
                            backgroundColor: 'var(--bg-darker)'
                          }}>
                            <Compass style={{ color: 'var(--color-amber)', width: '32px', height: '32px', marginBottom: '12px' }} />
                            <span style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>
                              [AWAITING UPLOAD] Days {selectedRevisionInterval - 9}–{selectedRevisionInterval} Revision Preview
                            </span>
                            <span style={{ fontSize: '0.78rem', maxWidth: '440px', color: 'var(--text-muted)', display: 'block', marginBottom: '12px' }}>
                              The revision HTML log file for Days {selectedRevisionInterval - 9}–{selectedRevisionInterval} hasn't been uploaded to GitHub yet, or is still building.
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-green)', fontWeight: 500, backgroundColor: 'rgba(0, 255, 136, 0.05)', padding: '6px 12px', borderRadius: '4px', border: '1px solid rgba(0, 255, 136, 0.15)' }}>
                              ⚡ This preview will automatically load here as soon as the file arrives in your repository!
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        padding: '24px',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        lineHeight: 1.5,
                        backgroundColor: 'var(--bg-darker)'
                      }}>
                        <ShieldAlert style={{ color: 'var(--color-amber)', width: '28px', height: '28px', marginBottom: '10px' }} />
                        <span>[INFO] HTML Page Previews require a repository configured for this track.</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : activeViewerTab === 'project' ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: 'var(--bg-darker)',
                  height: '100%'
                }}>
                  <FileCode style={{ color: 'var(--color-cyan)', width: '48px', height: '48px', marginBottom: '16px' }} />
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.1rem', display: 'block', marginBottom: '12px' }}>
                    [PROJECT INTEGRATION PORT]
                  </span>
                  <span style={{ fontSize: '0.9rem', maxWidth: '520px', display: 'block', marginBottom: '16px', lineHeight: 1.6 }}>
                    This workspace is reserved for project files and repository assets. The code and live builds will be mapped to this view soon!
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-amber)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '6px 14px', borderRadius: '4px', backgroundColor: 'rgba(245, 158, 11, 0.05)', fontWeight: 500 }}>
                    ⚡ Repository connection: PENDING ACTIVE UPLOAD
                  </span>
                </div>
              ) : selectedDayLog ? (
                <div style={{ padding: '10px 20px' }}>
                  <div className="viewer-day-header">
                    <div className="viewer-title-line" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                      <h4 style={{ color: 'var(--text-primary)', margin: 0 }}>Day {selectedDayNum}: {selectedDayLog.title}</h4>
                      <span className={`day-status-pill ${selectedDayNum <= activeTrack.currentDay ? 'complete' : selectedDayNum === activeTrack.currentDay + 1 ? 'active' : 'upcoming'}`}>
                        {selectedDayNum <= activeTrack.currentDay ? 'Verified Complete' : selectedDayNum === activeTrack.currentDay + 1 ? 'Active Focus' : 'Upcoming'}
                      </span>
                    </div>
                    <div className="viewer-subtitle" style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '16px' }}>{selectedDayLog.subtitle}</div>
                  </div>

                  <div className="viewer-section" style={{ marginBottom: '16px' }}>
                    <div className="viewer-section-title" style={{ color: 'var(--color-cyan)', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>&gt; Key Learning Takeaway:</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>{selectedDayLog.takeaway}</p>
                  </div>

                  <div className="viewer-section" style={{ marginBottom: '16px' }}>
                    <div className="viewer-section-title" style={{ color: 'var(--color-cyan)', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>&gt; incident Correlation / Lab:</div>
                    <div className="viewer-incident-box" style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '10px', backgroundColor: 'var(--bg-darker)' }}>
                      <div className="viewer-incident-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-red)', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px' }}>
                        <ShieldAlert style={{ width: '14px', height: '14px' }} /> {selectedDayLog.incidentName}
                      </div>
                      <div className="viewer-incident-body" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.4 }}>{selectedDayLog.incidentDetail}</div>
                    </div>
                  </div>

                  <div className="viewer-section">
                    <div className="viewer-section-title" style={{ color: 'var(--color-cyan)', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>&gt; Operational Audit Code:</div>
                    <pre style={{
                      color: 'var(--color-green)',
                      backgroundColor: 'var(--bg-darker)',
                      padding: '8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      border: '1px solid var(--border-color)',
                      marginTop: '4px',
                      fontFamily: 'var(--font-mono)',
                      margin: 0
                    }}>
                      <code>SEC_LOG_VERIFIED: GCEK-IT-{selectedDayNum}-OK</code>
                    </pre>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '10px 20px' }}>
                  <div className="viewer-day-header">
                    <div className="viewer-title-line" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                      <h4 style={{ color: 'var(--text-primary)', margin: 0 }}>Day {selectedDayNum}: {selectedDayNum === activeTrack.currentDay + 1 ? 'Awaiting Log Submission' : 'Classified Track Checkpoint'}</h4>
                      <span className="day-status-pill upcoming">
                        {selectedDayNum === activeTrack.currentDay + 1 ? 'Active Focus' : 'Classified'}
                      </span>
                    </div>
                    <div className="viewer-subtitle" style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '12px' }}>
                      {selectedDayNum === activeTrack.currentDay + 1 ? 'Current roadmap day target.' : 'Future checkpoint sequence.'}
                    </div>
                  </div>
                  <div className="viewer-section">
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                      [INFO] Daily log entries represent hands-on lesson checkpoints. Future log updates will expand on automation, security diagnostics, and custom scripts logs.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Password Prompt Modal for Days 11-90 (rendered after fullscreen modal to stack on top) */}
      {isPasswordPromptOpen && (
        <div className="modal-overlay active" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsPasswordPromptOpen(false);
            setContentAuthError("");
            setContentPassword("");
          }
        }}>
          <div className="modal-container" style={{
            maxWidth: '420px', padding: '32px 24px 24px', textAlign: 'center',
            backgroundColor: 'var(--bg-dark)', border: '1px solid rgba(0, 217, 255, 0.3)', borderRadius: '6px'
          }}>
            <KeyRound style={{ width: '40px', height: '40px', color: 'var(--color-cyan)', marginBottom: '12px' }} />
            <h3 style={{ marginBottom: '6px', fontSize: '1.15rem', color: 'var(--text-primary)' }}>
              &#x1f512; Content Locked
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '4px' }}>
              Day {selectedDayNum} requires a security passkey to access.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '20px' }}>
              Enter the passkey to unlock all protected material for this session.
            </p>
            <form onSubmit={handleContentAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <input
                type="password"
                value={contentPassword}
                onChange={(e) => setContentPassword(e.target.value)}
                placeholder="Enter passkey"
                style={{
                  width: '100%', maxWidth: '280px', padding: '10px 14px', fontSize: '0.9rem',
                  backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)', borderRadius: '4px', fontFamily: 'var(--font-mono)',
                  textAlign: 'center', outline: 'none', boxSizing: 'border-box'
                }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '280px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>
                  Unlock
                </button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                  onClick={() => {
                    setIsPasswordPromptOpen(false);
                    setContentAuthError("");
                    setContentPassword("");
                  }}>
                  Cancel
                </button>
              </div>
              {contentAuthError && (
                <p style={{ color: 'var(--color-red)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', margin: 0 }}>
                  {contentAuthError}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Certifications Password Prompt Modal */}
      {isCertsPromptOpen && (
        <div className="modal-overlay active" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsCertsPromptOpen(false);
            setCertsAuthError("");
            setCertsPassword("");
            setPendingCertUrl(null);
          }
        }}>
          <div className="modal-container" style={{
            maxWidth: '420px', padding: '32px 24px 24px', textAlign: 'center',
            backgroundColor: 'var(--bg-dark)', border: '1px solid rgba(0, 217, 255, 0.3)', borderRadius: '6px'
          }}>
            <KeyRound style={{ width: '40px', height: '40px', color: 'var(--color-cyan)', marginBottom: '12px' }} />
            <h3 style={{ marginBottom: '6px', fontSize: '1.15rem', color: 'var(--text-primary)' }}>
              &#x1f512; Credentials Decryption Required
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '4px' }}>
              Viewing certifications registry requires a secure authorization passkey.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '20px' }}>
              Please enter credentials to unlock all verified certificate files.
            </p>
            <form onSubmit={handleCertsAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <input
                type="password"
                value={certsPassword}
                onChange={(e) => setCertsPassword(e.target.value)}
                placeholder="Enter authorization passkey"
                style={{
                  width: '100%', maxWidth: '280px', padding: '10px 14px', fontSize: '0.9rem',
                  backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)', borderRadius: '4px', fontFamily: 'var(--font-mono)',
                  textAlign: 'center', outline: 'none', boxSizing: 'border-box'
                }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '280px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>
                  Decrypt
                </button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                  onClick={() => {
                    setIsCertsPromptOpen(false);
                    setCertsAuthError("");
                    setCertsPassword("");
                    setPendingCertUrl(null);
                  }}>
                  Cancel
                </button>
              </div>
              {certsAuthError && (
                <p style={{ color: 'var(--color-red)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', margin: 0 }}>
                  {certsAuthError}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Admin Panel Settings Modal */}
      {isAdminOpen && (
        <div className="modal-overlay active" onClick={(e) => {
          if (e.target === e.currentTarget) setIsAdminOpen(false);
        }}>
          <div className="modal-container">
            <div className="modal-header">
              <h3><Sliders /> Operator Database Configuration Panel</h3>
              <button className="modal-close" onClick={() => setIsAdminOpen(false)}>&times;</button>
            </div>

            {/* Login verification screen */}
            {activeTrack.currentDay > 10 && !isAuthorized ? (
              <div className="modal-auth-console">
                <div className="terminal-body auth-terminal" style={{ padding: '24px' }}>
                  <p className="auth-line" style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>
                    // SYSTEM ADMINISTRATION PORT AUTHENTICATION REQUIRED
                  </p>
                  <p className="auth-line" style={{ marginBottom: '8px' }}>
                    kali login: <strong style={{ color: 'var(--color-green)' }}>root</strong>
                  </p>
                  <form onSubmit={handleAuthSubmit} className="auth-form-inline">
                    <div className="form-line" style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px', marginBottom: '12px' }}>
                      <span className="form-prefix" style={{ color: 'var(--color-cyan)', marginRight: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>Password:</span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="console-input"
                        autoFocus
                        required
                        placeholder="Enter root password"
                        style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', width: '100%' }}
                      />
                    </div>
                    <div className="auth-actions-row" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button type="submit" className="btn btn-primary btn-sm"><KeyRound /> Authenticate</button>
                      <span className="auth-hint" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        (Hint: password is <strong>root@robin</strong>)
                      </span>
                    </div>
                  </form>
                  {authError && (
                    <div style={{ marginTop: '12px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-red)' }}>
                      {authError}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Admin Editor Panel */
              <div className="modal-layout">
                {/* Modal Sidebar */}
                <div className="modal-tabs">
                  <button
                    onClick={() => setActiveEditorTab("profile")}
                    className={`modal-tab-btn ${activeEditorTab === 'profile' ? 'active' : ''}`}
                  >
                    <User /> Operator Profile
                  </button>
                  <button
                    onClick={() => setActiveEditorTab("challenge")}
                    className={`modal-tab-btn ${activeEditorTab === 'challenge' ? 'active' : ''}`}
                  >
                    <Calendar /> Learning Tracker
                  </button>
                  <button
                    onClick={() => setActiveEditorTab("skills")}
                    className={`modal-tab-btn ${activeEditorTab === 'skills' ? 'active' : ''}`}
                  >
                    <Zap /> Technical Matrix
                  </button>
                  <button
                    onClick={() => setActiveEditorTab("projects")}
                    className={`modal-tab-btn ${activeEditorTab === 'projects' ? 'active' : ''}`}
                  >
                    <Folder /> Project Dossier
                  </button>
                  <button
                    onClick={() => setActiveEditorTab("export")}
                    className={`modal-tab-btn modal-tab-export ${activeEditorTab === 'export' ? 'active' : ''}`}
                  >
                    <Download /> Commit & Sync
                  </button>
                </div>

                {/* Modal Content Panels */}
                <div className="modal-content-panel">
                  {activeEditorTab === 'profile' && (
                    <div className="modal-tab-content active">
                      <h4>Operator Identity Information</h4>
                      <div className="form-group">
                        <label>Alias Name</label>
                        <input
                          type="text"
                          value={db.profile?.name || ""}
                          onChange={(e) => {
                            const updated = { ...db };
                            updated.profile.name = e.target.value;
                            setDb(updated);
                          }}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label>Full Name (Resume)</label>
                        <input
                          type="text"
                          value={db.profile?.fullName || ""}
                          onChange={(e) => {
                            const updated = { ...db };
                            updated.profile.fullName = e.target.value;
                            setDb(updated);
                          }}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label>Professional Title</label>
                        <input
                          type="text"
                          value={db.profile?.title || ""}
                          onChange={(e) => {
                            const updated = { ...db };
                            updated.profile.title = e.target.value;
                            setDb(updated);
                          }}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label>College/Institution</label>
                        <input
                          type="text"
                          value={db.profile?.institution || ""}
                          onChange={(e) => {
                            const updated = { ...db };
                            updated.profile.institution = e.target.value;
                            setDb(updated);
                          }}
                          className="form-control"
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Roll Number</label>
                          <input
                            type="text"
                            value={db.profile?.rollNo || ""}
                            onChange={(e) => {
                              const updated = { ...db };
                              updated.profile.rollNo = e.target.value;
                              setDb(updated);
                            }}
                            className="form-control"
                          />
                        </div>
                        <div className="form-group">
                          <label>Location</label>
                          <input
                            type="text"
                            value={db.profile?.location || ""}
                            onChange={(e) => {
                              const updated = { ...db };
                              updated.profile.location = e.target.value;
                              setDb(updated);
                            }}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Bio Statement</label>
                        <textarea
                          value={db.profile?.bio || ""}
                          onChange={(e) => {
                            const updated = { ...db };
                            updated.profile.bio = e.target.value;
                            setDb(updated);
                          }}
                          className="form-control"
                          rows={3}
                        ></textarea>
                      </div>
                      <div className="form-group">
                        <label>Primary Contact Email</label>
                        <input
                          type="email"
                          value={db.profile?.email || ""}
                          onChange={(e) => {
                            const updated = { ...db };
                            updated.profile.email = e.target.value;
                            setDb(updated);
                          }}
                          className="form-control"
                        />
                      </div>
                    </div>
                  )}

                  {activeEditorTab === 'challenge' && (
                    <div className="modal-tab-content active">
                      <div className="section-subtitle-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ margin: 0 }}>Learning Tracker Logger</h4>
                          <select
                            value={activeTrackId}
                            onChange={(e) => {
                              const updated = { ...db };
                              updated.challenge.activeTrack = e.target.value;
                              setDb(updated);
                            }}
                            className="form-control"
                            style={{
                              backgroundColor: 'var(--bg-darker)',
                              border: '1px solid var(--border-color)',
                              color: 'var(--color-cyan)',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.75rem',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            {Object.keys(db.challenge?.tracks || {}).map(trackKey => (
                              <option key={trackKey} value={trackKey}>
                                {db.challenge.tracks[trackKey].name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => {
                            const updated = { ...db };
                            const track = updated.challenge.tracks[activeTrackId];
                            const days = track.days || [];
                            const nextDayNum = days.length > 0 ? Math.max(...days.map((d: any) => d.day)) + 1 : 1;
                            days.push({
                              day: nextDayNum,
                              title: "New Roadmap Topic",
                              subtitle: "One-line introduction",
                              takeaway: "Core concept learned",
                              incidentName: "Incident Correlation / Lab Exercise",
                              incidentDetail: "Topic detail logs",
                              status: "completed"
                            });
                            track.days = days;
                            track.currentDay = nextDayNum;
                            track.completedDays = days.filter((d: any) => d.status === 'completed').length;
                            setDb(updated);
                          }}
                          className="btn btn-primary btn-sm"
                        >
                          <Plus /> Log New Day
                        </button>
                      </div>

                      <div className="editor-list-container">
                        {activeTrack.days?.map((d: any, idx: number) => (
                          <div key={idx} className="editor-item-card" style={{ marginBottom: '14px' }}>
                            <div className="form-row">
                              <div className="form-group" style={{ flex: 1 }}>
                                <label>Day Number</label>
                                <input
                                  type="number"
                                  value={d.day}
                                  onChange={(e) => {
                                    const updated = { ...db };
                                    updated.challenge.tracks[activeTrackId].days[idx].day = parseInt(e.target.value) || 0;
                                    setDb(updated);
                                  }}
                                  className="form-control"
                                />
                              </div>
                              <div className="form-group" style={{ flex: 3 }}>
                                <label>Topic Title</label>
                                <input
                                  type="text"
                                  value={d.title}
                                  onChange={(e) => {
                                    const updated = { ...db };
                                    updated.challenge.tracks[activeTrackId].days[idx].title = e.target.value;
                                    setDb(updated);
                                  }}
                                  className="form-control"
                                />
                              </div>
                            </div>
                            <div className="form-group">
                              <label>Subtitle / Description</label>
                              <input
                                type="text"
                                value={d.subtitle || ''}
                                onChange={(e) => {
                                  const updated = { ...db };
                                  updated.challenge.tracks[activeTrackId].days[idx].subtitle = e.target.value;
                                  setDb(updated);
                                }}
                                className="form-control"
                              />
                            </div>
                            <div className="form-group">
                              <label>Key Takeaway</label>
                              <input
                                type="text"
                                value={d.takeaway || ''}
                                onChange={(e) => {
                                  const updated = { ...db };
                                  updated.challenge.tracks[activeTrackId].days[idx].takeaway = e.target.value;
                                  setDb(updated);
                                }}
                                className="form-control"
                              />
                            </div>
                            <div className="form-row">
                              <div className="form-group">
                                <label>Incident Name</label>
                                <input
                                  type="text"
                                  value={d.incidentName || ''}
                                  onChange={(e) => {
                                    const updated = { ...db };
                                    updated.challenge.tracks[activeTrackId].days[idx].incidentName = e.target.value;
                                    setDb(updated);
                                  }}
                                  className="form-control"
                                />
                              </div>
                              <div className="form-group">
                                <label>Incident Detail</label>
                                <input
                                  type="text"
                                  value={d.incidentDetail || ''}
                                  onChange={(e) => {
                                    const updated = { ...db };
                                    updated.challenge.tracks[activeTrackId].days[idx].incidentDetail = e.target.value;
                                    setDb(updated);
                                  }}
                                  className="form-control"
                                />
                              </div>
                            </div>
                            <div className="editor-item-actions">
                              <button
                                onClick={() => {
                                  const updated = { ...db };
                                  updated.challenge.tracks[activeTrackId].days.splice(idx, 1);
                                  setDb(updated);
                                }}
                                className="btn btn-danger btn-sm"
                              >
                                <Trash2 /> Remove Day
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeEditorTab === 'skills' && (
                    <div className="modal-tab-content active">
                      <div className="section-subtitle-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <h4 style={{ margin: 0 }}>Skill Matrices</h4>
                        <button
                          onClick={() => {
                            const updated = { ...db };
                            updated.skills.push({ name: "New Skill Vector", level: 50, category: "General" });
                            setDb(updated);
                          }}
                          className="btn btn-primary btn-sm"
                        >
                          <Plus /> Register Skill
                        </button>
                      </div>

                      <div className="editor-list-container">
                        {db.skills?.map((s: any, idx: number) => (
                          <div key={idx} className="editor-item-card" style={{ marginBottom: '14px' }}>
                            <div className="form-row">
                              <div className="form-group" style={{ flex: 2 }}>
                                <label>Skill Name</label>
                                <input
                                  type="text"
                                  value={s.name}
                                  onChange={(e) => {
                                    const updated = { ...db };
                                    updated.skills[idx].name = e.target.value;
                                    setDb(updated);
                                  }}
                                  className="form-control"
                                />
                              </div>
                              <div className="form-group" style={{ flex: 1 }}>
                                <label>Level (%)</label>
                                <input
                                  type="number"
                                  value={s.level}
                                  onChange={(e) => {
                                    const updated = { ...db };
                                    updated.skills[idx].level = parseInt(e.target.value) || 0;
                                    setDb(updated);
                                  }}
                                  className="form-control"
                                  min={0}
                                  max={100}
                                />
                              </div>
                              <div className="form-group" style={{ flex: 1 }}>
                                <label>Category</label>
                                <select
                                  value={s.category}
                                  onChange={(e) => {
                                    const updated = { ...db };
                                    updated.skills[idx].category = e.target.value;
                                    setDb(updated);
                                  }}
                                  className="form-control"
                                >
                                  <option value="Offensive">Offensive</option>
                                  <option value="Defensive">Defensive</option>
                                  <option value="General">General</option>
                                  <option value="Web">Web</option>
                                </select>
                              </div>
                            </div>
                            <div className="editor-item-actions">
                              <button
                                onClick={() => {
                                  const updated = { ...db };
                                  updated.skills.splice(idx, 1);
                                  setDb(updated);
                                }}
                                className="btn btn-danger btn-sm"
                              >
                                <Trash2 /> Remove Skill
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeEditorTab === 'projects' && (
                    <div className="modal-tab-content active">
                      <div className="section-subtitle-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <h4 style={{ margin: 0 }}>Project Registry</h4>
                        <button
                          onClick={() => {
                            const updated = { ...db };
                            updated.projects.push({
                              title: "New Security Project",
                              role: "Solo Developer",
                              description: "Project analysis overview",
                              contribution: "Your engineering task details",
                              tags: ["Python", "Nmap"],
                              link: "https://github.com"
                            });
                            setDb(updated);
                          }}
                          className="btn btn-primary btn-sm"
                        >
                          <Plus /> Add Project
                        </button>
                      </div>

                      <div className="editor-list-container">
                        {db.projects?.map((p: any, idx: number) => (
                          <div key={idx} className="editor-item-card" style={{ marginBottom: '14px' }}>
                            <div className="form-row">
                              <div className="form-group" style={{ flex: 2 }}>
                                <label>Project Title</label>
                                <input
                                  type="text"
                                  value={p.title}
                                  onChange={(e) => {
                                    const updated = { ...db };
                                    updated.projects[idx].title = e.target.value;
                                    setDb(updated);
                                  }}
                                  className="form-control"
                                />
                              </div>
                              <div className="form-group" style={{ flex: 1 }}>
                                <label>Role</label>
                                <input
                                  type="text"
                                  value={p.role || ''}
                                  onChange={(e) => {
                                    const updated = { ...db };
                                    updated.projects[idx].role = e.target.value;
                                    setDb(updated);
                                  }}
                                  className="form-control"
                                />
                              </div>
                            </div>
                            <div className="form-group">
                              <label>Description</label>
                              <textarea
                                value={p.description}
                                onChange={(e) => {
                                  const updated = { ...db };
                                  updated.projects[idx].description = e.target.value;
                                  setDb(updated);
                                }}
                                className="form-control"
                                rows={2}
                              ></textarea>
                            </div>
                            <div className="form-group">
                              <label>Specific Contribution</label>
                              <input
                                type="text"
                                value={p.contribution || ''}
                                onChange={(e) => {
                                  const updated = { ...db };
                                  updated.projects[idx].contribution = e.target.value;
                                  setDb(updated);
                                }}
                                className="form-control"
                              />
                            </div>
                            <div className="form-row">
                              <div className="form-group">
                                <label>Tags (Comma separated)</label>
                                <input
                                  type="text"
                                  value={p.tags ? p.tags.join(', ') : ''}
                                  onChange={(e) => {
                                    const updated = { ...db };
                                    updated.projects[idx].tags = e.target.value.split(',').map((t: string) => t.trim());
                                    setDb(updated);
                                  }}
                                  className="form-control"
                                />
                              </div>
                              <div className="form-group">
                                <label>Git Link</label>
                                <input
                                  type="text"
                                  value={p.link || '#'}
                                  onChange={(e) => {
                                    const updated = { ...db };
                                    updated.projects[idx].link = e.target.value;
                                    setDb(updated);
                                  }}
                                  className="form-control"
                                />
                              </div>
                            </div>
                            <div className="editor-item-actions">
                              <button
                                onClick={() => {
                                  const updated = { ...db };
                                  updated.projects.splice(idx, 1);
                                  setDb(updated);
                                }}
                                className="btn btn-danger btn-sm"
                              >
                                <Trash2 /> Remove Project
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeEditorTab === 'export' && (
                    <div className="modal-tab-content active">
                      <h4>Sync Local Storage with Code Repository</h4>
                      <div className="modal-alert-box info" style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        backgroundColor: 'rgba(0, 217, 255, 0.04)',
                        border: '1px solid rgba(0, 217, 255, 0.15)',
                        padding: '12px',
                        borderRadius: '6px',
                        marginBottom: '16px'
                      }}>
                        <ShieldAlert style={{ color: 'var(--color-cyan)', marginTop: '2px', flexShrink: 0 }} />
                        <div style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                          <p style={{ margin: '0 0 6px 0' }}><strong>How static state persistence works:</strong></p>
                          <p style={{ margin: 0 }}>Modifications saved in this editor persist in your browser's local storage draft. To synchronize these changes with your public GitHub Pages deployment, export the database schema, overwrite <code>data.json</code> inside your local repository, and push changes.</p>
                        </div>
                      </div>

                      <div className="export-actions" style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                        <button
                          onClick={() => {
                            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
                            const dlAnchorElem = document.createElement('a');
                            dlAnchorElem.setAttribute("href", dataStr);
                            dlAnchorElem.setAttribute("download", "data.json");
                            dlAnchorElem.click();
                          }}
                          className="btn btn-primary btn-lg"
                        >
                          <Download /> Download data.json
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm("Reset local modifications and reload defaults?")) {
                              localStorage.removeItem("cyber_portfolio_db");
                              setDb(initialData);
                              setIsAdminOpen(false);
                            }
                          }}
                          className="btn btn-secondary btn-lg"
                        >
                          <RefreshCw /> Reset Database
                        </button>
                      </div>

                      <div className="git-instructions" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                        <h5 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Deploy Guidelines:</h5>
                        <ol style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <li>Download the database by clicking <strong>"Download data.json"</strong>.</li>
                          <li>Overwrite <code>data.json</code> inside your local repository folder.</li>
                          <li>Perform standard Git synchronization:
                            <pre style={{
                              backgroundColor: 'var(--bg-darker)',
                              border: '1px solid var(--border-color)',
                              padding: '8px',
                              borderRadius: '4px',
                              marginTop: '6px',
                              color: 'var(--color-green)'
                            }}><code>git add data.json
                              git commit -m "update: portfolio database"
                              git push origin main</code></pre>
                          </li>
                        </ol>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            {(isAuthorized || activeTrack.currentDay <= 10) && (
              <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="save-status-text" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{saveStatus}</span>
                <div className="modal-footer-buttons" style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary" onClick={() => setIsAdminOpen(false)}>Close Panel</button>
                  <button className="btn btn-primary" onClick={() => {
                    // Update main profile status badge in header
                    const updated = { ...db };
                    const track = updated.challenge.tracks[activeTrackId];
                    if (track && updated.profile) {
                      updated.profile.status = `Day ${track.currentDay} of 90 Completed`;
                    }
                    saveChanges(updated);
                    setIsAdminOpen(false);
                  }}>
                    <Save /> Commit Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
