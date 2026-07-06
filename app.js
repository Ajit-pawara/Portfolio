// Global State
let portfolioData = {};
let skillsChart = null;

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
    // 1. Fetch data
    await loadPortfolioData();

    // 2. Initialize dynamic elements
    startLiveClock();
    runTypewriterAnimation();
    
    // 3. Setup event listeners
    setupNavigation();
    setupModalEvents();
    setupContactForm();
    checkFirstTimeSetup();
});

// Load Database
async function loadPortfolioData() {
    const saved = localStorage.getItem("cyber_portfolio_db");
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.schemaVersion === 8) {
                portfolioData = parsed;
                return;
            } else {
                console.warn("Outdated localStorage schema detected. Wiping local draft.");
                localStorage.removeItem("cyber_portfolio_db");
            }
        } catch (e) {
            console.error("Failed to parse local draft, falling back to data.json", e);
            localStorage.removeItem("cyber_portfolio_db");
        }
    }

    try {
        const res = await fetch("data.json?t=" + new Date().getTime());
        if (!res.ok) throw new Error("Could not fetch data.json");
        portfolioData = await res.json();
        localStorage.setItem("cyber_portfolio_db", JSON.stringify(portfolioData));
    } catch (err) {
        console.error("Critical database fetch failure", err);
        alert("Failed to initialize portfolio. Please check data.json file path.");
    }
}

// Live Mock Clock
function startLiveClock() {
    const clock = document.getElementById("live-time");
    if (!clock) return;
    
    const update = () => {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const h = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        const s = String(d.getSeconds()).padStart(2, '0');
        clock.textContent = `SYS_TIME: ${y}-${m}-${day} ${h}:${min}:${s}`;
    };
    update();
    setInterval(update, 1000);
}

// Typewriter Hero Animation
function runTypewriterAnimation() {
    const textSpan = document.getElementById("typed-whoami");
    const detailsDiv = document.getElementById("hero-details");
    if (!textSpan || !detailsDiv) return;

    const cmdText = "whoami";
    const resultText = `\nAjit Pawara — IT Undergrad | Building toward Cybersecurity | Day 9/90`;
    
    let i = 0;
    let mode = 'type-cmd'; // 'type-cmd', 'pause', 'print-result', 'reveal'

    function type() {
        if (mode === 'type-cmd') {
            if (i < cmdText.length) {
                textSpan.textContent += cmdText.charAt(i);
                i++;
                setTimeout(type, 100);
            } else {
                mode = 'pause';
                setTimeout(type, 300);
            }
        } else if (mode === 'pause') {
            mode = 'print-result';
            i = 0;
            setTimeout(type, 100);
        } else if (mode === 'print-result') {
            if (i < resultText.length) {
                textSpan.textContent += resultText.charAt(i);
                i++;
                setTimeout(type, 35);
            } else {
                mode = 'reveal';
                setTimeout(type, 300);
            }
        } else if (mode === 'reveal') {
            detailsDiv.classList.remove("hidden");
            // Render other sections now that the terminal is active
            renderAll();
        }
    }
    type();
}

// Render All Components
function renderAll() {
    renderProfile();
    renderChallengeGrid();
    renderSkillsChart();
    renderSkillsList();
    renderCertifications();
    renderProjects();
    renderSocialGrid();
    renderRoadmap();
    renderResumeSheet();
    lucide.createIcons();
    renderDefaultViewer();
}

// Navigation Tab Controls (SPA subpages)
function switchTab(targetId) {
    if (!targetId || targetId === "#" || targetId === "") targetId = "#hero";
    
    // All sections in our app
    const sections = ["#hero", "#challenge", "#skills", "#certifications", "#projects", "#community", "#roadmap", "#resume"];
    
    // Hide all sections first
    sections.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) el.classList.add("hidden");
    });
    
    // Show selected active section(s)
    const activeEl = document.querySelector(targetId);
    if (activeEl) {
        activeEl.classList.remove("hidden");
        
        // Special case: Tracker shows progress grid AND roadmap timeline
        if (targetId === "#challenge") {
            const roadmapEl = document.querySelector("#roadmap");
            if (roadmapEl) roadmapEl.classList.remove("hidden");
        }
        
        // Special case: Skills Map shows skills matrices AND certifications list
        if (targetId === "#skills") {
            const certsEl = document.querySelector("#certifications");
            if (certsEl) certsEl.classList.remove("hidden");
        }
    }
    
    // Update active class on nav links
    const links = document.querySelectorAll(".nav-link");
    links.forEach(l => {
        if (l.getAttribute("href") === targetId) {
            l.classList.add("active");
        } else {
            l.classList.remove("active");
        }
    });
    
    // Reset view position to top of page
    window.scrollTo(0, 0);
}

function setupNavigation() {
    // Listen to hash changes for page routing
    window.addEventListener("hashchange", () => {
        switchTab(window.location.hash);
    });
    
    // Handle initial load hash
    switchTab(window.location.hash);

    const printBtn = document.getElementById("print-resume-btn");
    if (printBtn) {
        printBtn.addEventListener("click", () => window.print());
    }
}

// Render Profile details
function renderProfile() {
    const p = portfolioData.profile;
    if (!p) return;

    // Set dashboard titles
    const dashName = document.getElementById("dash-name");
    const dashSubtitle = document.getElementById("dash-subtitle");
    const dashAcademy = document.getElementById("dash-academy");
    const dashStatus = document.getElementById("dash-status");

    if (dashName) dashName.innerHTML = `${p.name} <span class="name-alt">(${p.fullName})</span>`;
    if (dashSubtitle) dashSubtitle.textContent = p.title;
    if (dashAcademy) {
        dashAcademy.innerHTML = `<i data-lucide="graduation-cap"></i> ${p.institution} | Roll: ${p.rollNo}`;
    }
    if (dashStatus) {
        dashStatus.textContent = `ACTIVE RUN: 90-Day Cybersecurity Public Learning Challenge (${p.status || ''})`;
    }

    // Set resume titles
    document.getElementById("resume-name").textContent = p.name;
    document.getElementById("resume-title").textContent = p.title;
    document.getElementById("resume-institution").textContent = p.institution;
    document.getElementById("resume-email").textContent = p.email;
    document.getElementById("resume-location").textContent = p.location;
    document.getElementById("resume-roll").textContent = p.rollNo;
}

// 90-Day Grid Component
function renderChallengeGrid() {
    const grid = document.getElementById("day-grid");
    if (!grid) return;
    grid.innerHTML = "";

    const challenge = portfolioData.challenge || { currentDay: 9, totalDays: 90 };
    const daysArray = challenge.days || [];

    for (let dayNum = 1; dayNum <= challenge.totalDays; dayNum++) {
        const cell = document.createElement("a");
        cell.className = "day-cell";
        cell.textContent = String(dayNum).padStart(2, '0');
        cell.href = `day${String(dayNum).padStart(2, '0')}.html`;
        
        // Find existing day in array
        const dayData = daysArray.find(d => d.day === dayNum);
        
        if (dayNum <= challenge.currentDay) {
            cell.className += " complete";
        } else if (dayNum === challenge.currentDay + 1) {
            cell.className += " active";
        } else {
            cell.className += " upcoming";
        }

        cell.setAttribute("data-day", dayNum);
        grid.appendChild(cell);
    }
}

// Detail Viewer updates
function inspectChallengeDay(dayNum, dayData) {
    const viewer = document.getElementById("day-viewer-content");
    const viewerTitle = document.querySelector(".challenge-viewer .terminal-title");
    if (!viewer) return;
    
    // Set active class on grid
    document.querySelectorAll(".day-cell").forEach(cell => {
        cell.classList.remove("selected");
        if (parseInt(cell.getAttribute("data-day")) === dayNum) {
            cell.classList.add("selected");
        }
    });

    if (viewerTitle) {
        viewerTitle.textContent = `secops-viewer --log-day=${dayNum}`;
    }

    const currentDay = portfolioData.challenge?.currentDay || 9;

    if (dayData) {
        viewer.innerHTML = `
            <div class="viewer-day-header">
                <div class="viewer-title-line">
                    <h4>Day ${dayNum}: ${dayData.title}</h4>
                    <span class="day-status-pill complete">Verified Complete</span>
                </div>
                <div class="viewer-subtitle">${dayData.subtitle || ''}</div>
            </div>
            
            <div class="viewer-section">
                <div class="viewer-section-title">&gt; Key Learning Takeaway:</div>
                <p>${dayData.takeaway}</p>
            </div>
            
            <div class="viewer-section">
                <div class="viewer-section-title">&gt; Incident Case Correlation:</div>
                <div class="viewer-incident-box">
                    <div class="viewer-incident-title"><i data-lucide="shield-alert" style="width: 12px; height: 12px; display: inline;"></i> ${dayData.incidentName}</div>
                    <div class="viewer-incident-body">${dayData.incidentDetail}</div>
                </div>
            </div>
            
            <div class="viewer-section">
                <div class="viewer-section-title">&gt; Operational Audit Code:</div>
                <pre style="color: var(--color-green); background-color: var(--bg-darker); padding: 6px; border-radius: 4px; font-size: 0.72rem; border: 1px solid var(--border-color); margin-top: 4px;"><code>SEC_LOG_VERIFIED: GCEK-IT-${dayNum}-OK</code></pre>
            </div>
        `;
    } else {
        const isNext = dayNum === currentDay + 1;
        viewer.innerHTML = `
            <div class="viewer-day-header">
                <div class="viewer-title-line">
                    <h4>Day ${dayNum}: ${isNext ? 'Awaiting Log Submission' : 'Classified Track Checkpoint'}</h4>
                    <span class="day-status-pill upcoming">${isNext ? 'Active Focus' : 'Classified'}</span>
                </div>
                <div class="viewer-subtitle">${isNext ? 'Current roadmap day target.' : 'Future checkpoint sequence.'}</div>
            </div>
            
            <div class="viewer-section">
                <p style="color: var(--text-muted);">[INFO] Daily log entries represent hands-on lesson checkpoints. Days 11-90 will expand on Python automation, active network enumeration, vulnerability scanners (Nmap/Nessus), and SOC operations logs.</p>
                <p style="margin-top: 12px; font-size: 0.85rem;"><a href="day${String(dayNum).padStart(2, '0')}.html" style="color: var(--color-cyan); text-decoration: none;">Click to view preview page →</a></p>
            </div>
        `;
    }
    lucide.createIcons();
}

function renderDefaultViewer() {
    const viewer = document.getElementById("day-viewer-content");
    if (!viewer) return;
    viewer.innerHTML = `
        <div class="viewer-day-header">
            <div class="viewer-title-line">
                <h4>Select a Day from the Grid</h4>
                <span class="day-status-pill complete">READY</span>
            </div>
            <div class="viewer-subtitle">Click any day cell to view detailed security notes.</div>
        </div>
        <div class="viewer-section">
            <p style="color: var(--text-muted);">Each completed day logs technical insights, incident correlations, and verified learning outcomes.</p>
        </div>
    `;
}

// ChartJS Skills radar map
function renderSkillsChart() {
    const canvas = document.getElementById("skillsChart");
    if (!canvas) return;

    const skills = portfolioData.skills || [];
    const categories = {};
    
    skills.forEach(s => {
        const cat = s.category || "General";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(s.level);
    });

    const labels = Object.keys(categories);
    const dataValues = labels.map(c => {
        const arr = categories[c];
        return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    });

    if (skillsChart) skillsChart.destroy();

    skillsChart = new Chart(canvas, {
        type: 'radar',
        data: {
            labels: labels.length > 0 ? labels : ["Offensive", "Defensive", "Web", "General"],
            datasets: [{
                label: 'Operational Capability Vectors',
                data: dataValues.length > 0 ? dataValues : [50, 50, 50, 50],
                backgroundColor: 'rgba(0, 217, 255, 0.15)',
                borderColor: '#00d9ff',
                pointBackgroundColor: '#00d9ff',
                pointBorderColor: '#e6edf0',
                borderWidth: 1.5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: '#1c2426' },
                    grid: { color: '#1c2426' },
                    pointLabels: {
                        color: '#7d898c',
                        font: { family: 'IBM Plex Mono', size: 9 }
                    },
                    ticks: {
                        color: '#7d898c',
                        backdropColor: 'transparent',
                        beginAtZero: true,
                        max: 100,
                        stepSize: 25
                    }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Render technical matrix horizontal skills
function renderSkillsList() {
    const list = document.getElementById("skills-list");
    if (!list) return;
    list.innerHTML = "";

    const skills = portfolioData.skills || [];
    skills.forEach(s => {
        const row = document.createElement("div");
        row.className = "skill-row";
        row.innerHTML = `
            <div class="skill-meta">
                <span class="skill-title">${s.name}</span>
                <span class="skill-pct">${s.level}%</span>
            </div>
            <div class="skill-bar-container">
                <div class="skill-bar-fill" style="width: ${s.level}%; background-color: ${s.category === 'Offensive' ? 'var(--color-green)' : (s.category === 'Defensive' ? 'var(--color-cyan)' : 'var(--color-amber)')}"></div>
            </div>
        `;
        list.appendChild(row);
    });
}

// Render Certifications & Badge grids
function renderCertifications() {
    const container = document.getElementById("certs-list");
    if (!container) return;
    container.innerHTML = "";

    const certs = portfolioData.certifications || [];
    certs.forEach(c => {
        const card = document.createElement("div");
        card.className = "cert-card card";
        
        let iconName = "award";
        if (c.icon) iconName = c.icon;
        
        const isDone = c.status.toLowerCase() === "completed" || c.status.toLowerCase() === "certified";

        card.innerHTML = `
            <div class="cert-header">
                <div>
                    <h4>${c.name}</h4>
                    <p class="cert-provider">${c.provider}</p>
                </div>
                <div class="cert-icon-wrapper" style="color: ${isDone ? 'var(--color-cyan)' : 'var(--color-amber)'}">
                    <i data-lucide="${iconName}"></i>
                </div>
            </div>
            <div class="cert-status-block">
                <span class="cert-status ${isDone ? 'completed' : 'in-progress'}">${c.status}</span>
                <span class="cert-id">${c.credentialId || ''}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// Render Projects list
function renderProjects() {
    const container = document.getElementById("projects-list");
    if (!container) return;
    container.innerHTML = "";

    const projects = portfolioData.projects || [];
    projects.forEach(p => {
        const card = document.createElement("div");
        card.className = "project-card card";
        
        let tagsHtml = "";
        p.tags?.forEach(t => {
            tagsHtml += `<span class="proj-tag-badge">${t}</span>`;
        });

        card.innerHTML = `
            <div>
                <div class="proj-header">
                    <h3>${p.title}</h3>
                    <span class="proj-role">${p.role}</span>
                </div>
                <p class="description">${p.description}</p>
                <div class="contribution">
                    <strong>Specific Contribution:</strong>
                    ${p.contribution}
                </div>
                <div class="project-tags">${tagsHtml}</div>
            </div>
            
            <div class="proj-footer-link">
                <a href="${p.link || '#'}" target="_blank" class="link-anchor"><i data-lucide="git-branch"></i> Source Code</a>
                <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted);">Verified Artifact ✓</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// Render platform socials hub grid
function renderSocialGrid() {
    const container = document.getElementById("social-grid");
    if (!container) return;
    container.innerHTML = "";

    const socials = portfolioData.socials || [];
    socials.forEach(s => {
        const card = document.createElement("a");
        card.href = s.url;
        card.target = "_blank";
        card.className = "social-card card";
        
        let iconName = "link-2";
        if (s.icon) iconName = s.icon;

        card.innerHTML = `
            <div>
                <div class="soc-header">
                    <div class="soc-icon"><i data-lucide="${iconName}"></i></div>
                    <span class="soc-platform">${s.platform}</span>
                </div>
                <p class="soc-purpose">${s.purpose}</p>
            </div>
            <div class="soc-footer">
                <span>Access Node &gt;</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// Render Roadmap timeline components
function renderRoadmap() {
    const container = document.getElementById("roadmap-list");
    if (!container) return;
    container.innerHTML = "";

    const roadmap = portfolioData.roadmap || [];
    roadmap.forEach(r => {
        const node = document.createElement("div");
        node.className = `roadmap-node ${r.status}`;
        node.innerHTML = `
            <div class="node-dot"></div>
            <div class="node-card">
                <div class="node-period">${r.period}</div>
                <h4>${r.title}</h4>
                <p class="node-desc">${r.description}</p>
            </div>
        `;
        container.appendChild(node);
    });
}

// Render Resume sheet variables
function renderResumeSheet() {
    // Render experience list
    const expContainer = document.getElementById("resume-experience-list");
    if (expContainer && portfolioData.experience) {
        expContainer.innerHTML = "";
        portfolioData.experience.forEach(exp => {
            const div = document.createElement("div");
            div.className = "sheet-timeline-item";
            div.innerHTML = `
                <div class="sheet-item-header">
                    <span>${exp.role}</span>
                    <span style="font-weight: 500; font-size: 0.7rem; color: #475569;">${exp.period}</span>
                </div>
                <div class="sheet-item-org">${exp.organization}</div>
                <p class="sheet-item-desc">${exp.description}</p>
            `;
            expContainer.appendChild(div);
        });
    }

    // Render education list
    const eduContainer = document.getElementById("resume-education-list");
    if (eduContainer && portfolioData.education) {
        eduContainer.innerHTML = "";
        portfolioData.education.forEach(edu => {
            const div = document.createElement("div");
            div.className = "sheet-timeline-item";
            div.innerHTML = `
                <div class="sheet-item-header">
                    <span>${edu.degree}</span>
                    <span style="font-weight: 500; font-size: 0.7rem; color: #475569;">${edu.period}</span>
                </div>
                <div class="sheet-item-org">${edu.school}</div>
                <p class="sheet-item-desc">${edu.description}</p>
            `;
            eduContainer.appendChild(div);
        });
    }

    // Render side details
    const skillsContainer = document.getElementById("resume-skills-list");
    if (skillsContainer && portfolioData.skills) {
        skillsContainer.innerHTML = "";
        portfolioData.skills.forEach(s => {
            const tag = document.createElement("span");
            tag.className = "sheet-skill-tag";
            tag.textContent = s.name.split(" (")[0];
            skillsContainer.appendChild(tag);
        });
    }

    const certsContainer = document.getElementById("resume-certs-list");
    if (certsContainer) {
        certsContainer.innerHTML = "";
        
        // Active Course
        const cLi = document.createElement("li");
        cLi.innerHTML = `Active Training: <strong>CompTIA Security+</strong>`;
        certsContainer.appendChild(cLi);

        // Render completed
        const completed = portfolioData.challenge?.days?.filter(d => d.status === "completed") || [];
        if (completed.length > 0) {
            const li = document.createElement("li");
            li.innerHTML = `90-Day Challenge: Day 1-9 checkins verified`;
            certsContainer.appendChild(li);
        }

        const forged = portfolioData.certifications?.filter(c => c.status.toLowerCase() === "certified") || [];
        forged.forEach(f => {
            const li = document.createElement("li");
            li.innerHTML = `${f.name} (${f.provider})`;
            certsContainer.appendChild(li);
        });
    }
}

// Contact form simulation
function setupContactForm() {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("contact-status");
    if (!form || !status) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        status.className = "contact-status-msg";
        status.textContent = "[INFO] Establishing cipher socket link...";

        setTimeout(() => {
            status.className = "contact-status-msg success";
            status.innerHTML = `[OK] Socket open. Message packet securely transmitted.<br>Payload: Name=${document.getElementById("contact-name").value}, Email=${document.getElementById("contact-email").value}.`;
            form.reset();
        }, 1200);
    });
}

/* ==========================================================================
   SETTINGS MODAL & EDITORPersistance
   ========================================================================== */

function setupModalEvents() {
    const modal = document.getElementById("admin-modal");
    const editBtn = document.getElementById("edit-mode-btn");
    const closeBtn = document.getElementById("admin-close-btn");
    const cancelBtn = document.getElementById("btn-modal-cancel");
    const saveBtn = document.getElementById("btn-modal-save");

    const authView = document.getElementById("modal-auth-view");
    const editorView = document.getElementById("modal-editor-view");
    const authForm = document.getElementById("auth-form");
    const authPassInput = document.getElementById("auth-password");
    const authErrorMsg = document.getElementById("auth-error-msg");

    if (editBtn && modal) {
        editBtn.addEventListener("click", () => {
            modal.classList.add("active");
            if (sessionStorage.getItem("root_authorized") === "true") {
                authView.classList.add("hidden");
                editorView.classList.remove("hidden");
                populateModalInputs();
            } else {
                authView.classList.remove("hidden");
                editorView.classList.add("hidden");
                if (authPassInput) {
                    authPassInput.value = "";
                    setTimeout(() => authPassInput.focus(), 100);
                }
                if (authErrorMsg) authErrorMsg.textContent = "";
            }
        });
    }

    if (authForm) {
        authForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (authPassInput.value === "root") {
                sessionStorage.setItem("root_authorized", "true");
                authView.classList.add("hidden");
                editorView.classList.remove("hidden");
                populateModalInputs();
            } else {
                authErrorMsg.textContent = "[ERROR] ACCESS DENIED: INVALID PRIVILEGED PASSWORD MATRIX.";
                authPassInput.value = "";
                authPassInput.focus();
            }
        });
    }

    const close = () => { if (modal) modal.classList.remove("active"); };

    if (closeBtn) closeBtn.addEventListener("click", close);
    if (cancelBtn) cancelBtn.addEventListener("click", close);

    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            saveModalChanges();
            close();
        });
    }

    // Modal Tabs
    const tabBtns = document.querySelectorAll(".modal-tab-btn");
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const tabId = btn.getAttribute("data-tab");
            document.querySelectorAll(".modal-tab-content").forEach(p => p.classList.remove("active"));
            const contentPanel = document.getElementById(tabId);
            if (contentPanel) contentPanel.classList.add("active");
        });
    });

    // Export & Reset
    const expBtn = document.getElementById("btn-export-json");
    if (expBtn) {
        expBtn.addEventListener("click", () => exportDatabaseJSON());
    }

    const resetBtn = document.getElementById("btn-reset-data");
    if (resetBtn) {
        resetBtn.addEventListener("click", async () => {
            if (confirm("Reset local modifications and reload defaults?")) {
                localStorage.removeItem("cyber_portfolio_db");
                await loadPortfolioData();
                renderAll();
                close();
            }
        });
    }

    // Add item triggers
    document.getElementById("btn-add-challenge-day").addEventListener("click", () => addNewEditorDay());
    document.getElementById("btn-add-skill").addEventListener("click", () => addNewEditorSkill());
    document.getElementById("btn-add-project").addEventListener("click", () => addNewEditorProject());
}

function populateModalInputs() {
    const p = portfolioData.profile || {};
    document.getElementById("input-name").value = p.name || "";
    document.getElementById("input-fullname").value = p.fullName || "";
    document.getElementById("input-title").value = p.title || "";
    document.getElementById("input-institution").value = p.institution || "";
    document.getElementById("input-roll").value = p.rollNo || "";
    document.getElementById("input-location").value = p.location || "";
    document.getElementById("input-bio").value = p.bio || "";
    document.getElementById("input-email").value = p.email || "";

    renderEditorChallengeDays();
    renderEditorSkills();
    renderEditorProjects();
}

// 1. Challenge Days Editor
function renderEditorChallengeDays() {
    const container = document.getElementById("editor-challenge-list");
    if (!container) return;
    container.innerHTML = "";

    const days = portfolioData.challenge?.days || [];
    days.forEach((d, idx) => {
        const div = document.createElement("div");
        div.className = "editor-item-card";
        div.innerHTML = `
            <div class="form-row">
                <div class="form-group" style="flex: 1;">
                    <label>Day Number</label>
                    <input type="number" class="form-control edit-day-num" value="${d.day}" data-index="${idx}">
                </div>
                <div class="form-group" style="flex: 3;">
                    <label>Topic Title</label>
                    <input type="text" class="form-control edit-day-title" value="${d.title}" data-index="${idx}">
                </div>
            </div>
            <div class="form-group">
                <label>Subtitle / Description</label>
                <input type="text" class="form-control edit-day-subtitle" value="${d.subtitle || ''}" data-index="${idx}">
            </div>
            <div class="form-group">
                <label>Key Takeaway</label>
                <input type="text" class="form-control edit-day-takeaway" value="${d.takeaway || ''}" data-index="${idx}">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Incident Name</label>
                    <input type="text" class="form-control edit-day-inc-name" value="${d.incidentName || ''}" data-index="${idx}">
                </div>
                <div class="form-group">
                    <label>Incident Detail</label>
                    <input type="text" class="form-control edit-day-inc-detail" value="${d.incidentDetail || ''}" data-index="${idx}">
                </div>
            </div>
            <div class="editor-item-actions">
                <button class="btn btn-danger btn-sm" onclick="deleteEditorItem('challengeDays', ${idx})">
                    <i data-lucide="trash-2"></i> Remove Day
                </button>
            </div>
        `;
        container.appendChild(div);
    });
    lucide.createIcons();
}

function addNewEditorDay() {
    const days = portfolioData.challenge?.days || [];
    const nextDayNum = days.length > 0 ? Math.max(...days.map(d => d.day)) + 1 : 1;
    
    if (!portfolioData.challenge) {
        portfolioData.challenge = { currentDay: 9, totalDays: 90, completedDays: 9, days: [] };
    }
    
    portfolioData.challenge.days.push({
        day: nextDayNum,
        title: "New Roadmap Topic",
        subtitle: "One-line introduction",
        takeaway: "Core concept learned",
        incidentName: "Incident Correlation",
        incidentDetail: "Historical context details",
        status: "completed"
    });
    
    renderEditorChallengeDays();
}

// 2. Skills Editor
function renderEditorSkills() {
    const container = document.getElementById("editor-skills-list");
    if (!container) return;
    container.innerHTML = "";

    const skills = portfolioData.skills || [];
    skills.forEach((s, idx) => {
        const div = document.createElement("div");
        div.className = "editor-item-card";
        div.innerHTML = `
            <div class="form-row">
                <div class="form-group" style="flex: 2;">
                    <label>Skill Name</label>
                    <input type="text" class="form-control edit-skill-name" value="${s.name}" data-index="${idx}">
                </div>
                <div class="form-group" style="flex: 1;">
                    <label>Level (%)</label>
                    <input type="number" class="form-control edit-skill-level" value="${s.level}" min="0" max="100" data-index="${idx}">
                </div>
                <div class="form-group" style="flex: 1;">
                    <label>Category</label>
                    <select class="form-control edit-skill-cat" data-index="${idx}">
                        <option value="Offensive" ${s.category === 'Offensive' ? 'selected' : ''}>Offensive</option>
                        <option value="Defensive" ${s.category === 'Defensive' ? 'selected' : ''}>Defensive</option>
                        <option value="General" ${s.category === 'General' ? 'selected' : ''}>General</option>
                        <option value="Web" ${s.category === 'Web' ? 'selected' : ''}>Web</option>
                    </select>
                </div>
            </div>
            <div class="editor-item-actions">
                <button class="btn btn-danger btn-sm" onclick="deleteEditorItem('skills', ${idx})">
                    <i data-lucide="trash-2"></i> Remove Skill
                </button>
            </div>
        `;
        container.appendChild(div);
    });
    lucide.createIcons();
}

function addNewEditorSkill() {
    if (!portfolioData.skills) portfolioData.skills = [];
    portfolioData.skills.push({
        name: "New Skill Vector",
        level: 50,
        category: "General"
    });
    renderEditorSkills();
}

// 3. Projects Editor
function renderEditorProjects() {
    const container = document.getElementById("editor-projects-list");
    if (!container) return;
    container.innerHTML = "";

    const projects = portfolioData.projects || [];
    projects.forEach((p, idx) => {
        const div = document.createElement("div");
        div.className = "editor-item-card";
        div.innerHTML = `
            <div class="form-row">
                <div class="form-group" style="flex: 2;">
                    <label>Project Title</label>
                    <input type="text" class="form-control edit-proj-title" value="${p.title}" data-index="${idx}">
                </div>
                <div class="form-group" style="flex: 1;">
                    <label>Role</label>
                    <input type="text" class="form-control edit-proj-role" value="${p.role || ''}" data-index="${idx}">
                </div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea class="form-control edit-proj-desc" rows="2" data-index="${idx}">${p.description}</textarea>
            </div>
            <div class="form-group">
                <label>Specific Contribution</label>
                <input type="text" class="form-control edit-proj-contrib" value="${p.contribution || ''}" data-index="${idx}">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Tags (Comma separated)</label>
                    <input type="text" class="form-control edit-proj-tags" value="${p.tags ? p.tags.join(', ') : ''}" data-index="${idx}">
                </div>
                <div class="form-group">
                    <label>Git Link</label>
                    <input type="text" class="form-control edit-proj-link" value="${p.link || '#'}" data-index="${idx}">
                </div>
            </div>
            <div class="editor-item-actions">
                <button class="btn btn-danger btn-sm" onclick="deleteEditorItem('projects', ${idx})">
                    <i data-lucide="trash-2"></i> Remove Project
                </button>
            </div>
        `;
        container.appendChild(div);
    });
    lucide.createIcons();
}

function addNewEditorProject() {
    if (!portfolioData.projects) portfolioData.projects = [];
    portfolioData.projects.push({
        title: "New Security Project",
        role: "Developer",
        description: "Project analysis overview",
        contribution: "Your engineering task details",
        tags: ["Python", "Nmap"],
        link: "https://github.com"
    });
    renderEditorProjects();
}

// Global deleter helper
window.deleteEditorItem = function(type, idx) {
    if (type === 'challengeDays') {
        portfolioData.challenge.days.splice(idx, 1);
        renderEditorChallengeDays();
    } else if (type === 'skills') {
        portfolioData.skills.splice(idx, 1);
        renderEditorSkills();
    } else if (type === 'projects') {
        portfolioData.projects.splice(idx, 1);
        renderEditorProjects();
    }
};

// Save modifications
function saveModalChanges() {
    const p = portfolioData.profile || {};
    p.name = document.getElementById("input-name").value;
    p.fullName = document.getElementById("input-fullname").value;
    p.title = document.getElementById("input-title").value;
    p.institution = document.getElementById("input-institution").value;
    p.rollNo = document.getElementById("input-roll").value;
    p.location = document.getElementById("input-location").value;
    p.bio = document.getElementById("input-bio").value;
    p.email = document.getElementById("input-email").value;

    // Challenge days values
    const days = portfolioData.challenge?.days || [];
    document.querySelectorAll(".edit-day-title").forEach(el => {
        const idx = parseInt(el.getAttribute("data-index"));
        if (days[idx]) {
            days[idx].title = el.value;
            days[idx].day = parseInt(document.querySelectorAll(".edit-day-num")[idx].value);
            days[idx].subtitle = document.querySelectorAll(".edit-day-subtitle")[idx].value;
            days[idx].takeaway = document.querySelectorAll(".edit-day-takeaway")[idx].value;
            days[idx].incidentName = document.querySelectorAll(".edit-day-inc-name")[idx].value;
            days[idx].incidentDetail = document.querySelectorAll(".edit-day-inc-detail")[idx].value;
        }
    });

    // Update challenge metadata numbers
    if (portfolioData.challenge) {
        portfolioData.challenge.days = days.sort((a, b) => a.day - b.day);
        const completed = days.filter(d => d.status === "completed").map(d => d.day);
        portfolioData.challenge.currentDay = completed.length > 0 ? Math.max(...completed) : 9;
        portfolioData.challenge.completedDays = completed.length;
        portfolioData.profile.status = `Day ${portfolioData.challenge.currentDay} of 90 Completed`;
    }

    // Skills values
    const skills = portfolioData.skills || [];
    document.querySelectorAll(".edit-skill-name").forEach(el => {
        const idx = parseInt(el.getAttribute("data-index"));
        if (skills[idx]) {
            skills[idx].name = el.value;
            skills[idx].level = parseInt(document.querySelectorAll(".edit-skill-level")[idx].value);
            skills[idx].category = document.querySelectorAll(".edit-skill-cat")[idx].value;
        }
    });

    // Projects values
    const projects = portfolioData.projects || [];
    document.querySelectorAll(".edit-proj-title").forEach(el => {
        const idx = parseInt(el.getAttribute("data-index"));
        if (projects[idx]) {
            projects[idx].title = el.value;
            projects[idx].role = document.querySelectorAll(".edit-proj-role")[idx].value;
            projects[idx].description = document.querySelectorAll(".edit-proj-desc")[idx].value;
            projects[idx].contribution = document.querySelectorAll(".edit-proj-contrib")[idx].value;
            
            const tagsText = document.querySelectorAll(".edit-proj-tags")[idx].value;
            projects[idx].tags = tagsText.split(",").map(t => t.trim()).filter(t => t.length > 0);
            projects[idx].link = document.querySelectorAll(".edit-proj-link")[idx].value;
        }
    });

    localStorage.setItem("cyber_portfolio_db", JSON.stringify(portfolioData));
    localStorage.setItem("custom_data_saved", "true");
    
    const banner = document.getElementById("first-time-banner");
    if (banner) banner.classList.add("hidden");

    renderAll();
    
    const saveStatus = document.getElementById("save-status");
    if (saveStatus) {
        saveStatus.textContent = "State: Changes committed to local storage draft!";
        setTimeout(() => {
            saveStatus.textContent = "State: changes cached locally.";
        }, 3000);
    }
}

// Export database file
function exportDatabaseJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(portfolioData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "data.json");
    dlAnchorElem.click();
}

// Check first-time setup alert
function checkFirstTimeSetup() {
    const banner = document.getElementById("first-time-banner");
    const closeBtn = document.getElementById("close-first-time-btn");
    if (!banner || !closeBtn) return;

    const isCustomized = localStorage.getItem("custom_data_saved") === "true";
    const isDismissed = localStorage.getItem("setup_dismissed") === "true";

    if (!isCustomized && !isDismissed) {
        banner.classList.remove("hidden");
    }

    closeBtn.addEventListener("click", () => {
        banner.classList.add("hidden");
        localStorage.setItem("setup_dismissed", "true");
    });
}
