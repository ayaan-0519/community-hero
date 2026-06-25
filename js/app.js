/**
 * Community Hero – Hyperlocal Problem Solver
 * Shared application JavaScript
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initScrollEffects();
  initFadeInAnimations();
  initReportForm();
  initTrackFilters();
  initCounterAnimation();
});

/* ---- Navbar ---- */
function initNavbar() {
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navbar = document.querySelector(".navbar");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("open");
      navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.classList.remove("open");
        navLinks.classList.remove("open");
      });
    });
  }

  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 10);
    });
  }

  highlightActiveNavLink();
}

function highlightActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

/* ---- Scroll & Fade Effects ---- */
function initScrollEffects() {
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    navbar.classList.toggle("scrolled", window.scrollY > 10);
  }
}

function initFadeInAnimations() {
  const selectors = ".fade-in, .fade-in-left, .fade-in-right";
  const elements = document.querySelectorAll(selectors);

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay;
          if (delay) {
            entry.target.style.transitionDelay = `${delay}ms`;
          }
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ---- Counter Animation (Home Stats) ---- */
function initCounterAnimation() {
  const counters = document.querySelectorAll("[data-count]");

  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.dataset.count, 10);
  const suffix = element.dataset.suffix || "";
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    element.textContent = current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ---- Report Form ---- */
function initReportForm() {
  const form = document.getElementById("report-form");
  const fileUpload = document.getElementById("file-upload");
  const filePreview = document.getElementById("file-preview");
  const previewImage = document.getElementById("preview-image");
  const fileRemove = document.getElementById("file-remove");
  const dropZone = document.getElementById("drop-zone");
  const detectLocationBtn = document.getElementById("detect-location");
  const locationInput = document.getElementById("location");

  if (fileUpload && dropZone) {
    ["dragenter", "dragover"].forEach((event) => {
      dropZone.addEventListener(event, (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach((event) => {
      dropZone.addEventListener(event, (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
      });
    });

    dropZone.addEventListener("drop", (e) => {
      const files = e.dataTransfer.files;
      if (files.length) {
        fileUpload.files = files;
        handleFilePreview(files[0]);
      }
    });

    fileUpload.addEventListener("change", (e) => {
      if (e.target.files.length) {
        handleFilePreview(e.target.files[0]);
      }
    });
  }

  function handleFilePreview(file) {
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (previewImage) previewImage.src = e.target.result;
      if (filePreview) filePreview.classList.add("visible");
      if (dropZone) dropZone.classList.add("has-file");
    };
    reader.readAsDataURL(file);
  }

  function clearFilePreview() {
    if (fileUpload) fileUpload.value = "";
    if (filePreview) filePreview.classList.remove("visible");
    if (previewImage) previewImage.src = "";
    if (dropZone) dropZone.classList.remove("has-file");
  }

  if (fileRemove) {
    fileRemove.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      clearFilePreview();
    });
  }

  if (detectLocationBtn && locationInput) {
    detectLocationBtn.addEventListener("click", () => {
      if (!navigator.geolocation) {
        showToast("Geolocation is not supported by your browser.");
        return;
      }

      detectLocationBtn.classList.add("loading");
      detectLocationBtn.querySelector("span").textContent = "Detecting…";

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          locationInput.value = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          detectLocationBtn.classList.remove("loading");
          detectLocationBtn.querySelector("span").textContent = "Use GPS";
        },
        () => {
          showToast("Unable to detect location. Please enter it manually.");
          detectLocationBtn.classList.remove("loading");
          detectLocationBtn.querySelector("span").textContent = "Use GPS";
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      showToast("Issue reported successfully! Track it on the Track page.");
      form.reset();
      clearFilePreview();
    });
  }
}

/* ---- Track Page ---- */
const TRACK_ISSUES = [
  {
    id: "CH-2026-0142",
    name: "Large Pothole on Oak Avenue",
    category: "roads",
    categoryLabel: "Roads & Pavement",
    severity: "high",
    status: "open",
    statusLabel: "Open",
    location: "Oak Avenue & 5th Street, Downtown",
    date: "Jun 21, 2026",
    votes: 47,
    image: "https://picsum.photos/seed/pothole142/600/340",
    emoji: "🕳️",
  },
  {
    id: "CH-2026-0138",
    name: "Broken Streetlight on Elm Street",
    category: "lighting",
    categoryLabel: "Street Lighting",
    severity: "medium",
    status: "progress",
    statusLabel: "In Progress",
    location: "142 Elm Street, Riverside District",
    date: "Jun 18, 2026",
    votes: 31,
    image: "https://picsum.photos/seed/streetlight138/600/340",
    emoji: "💡",
  },
  {
    id: "CH-2026-0129",
    name: "Overflowing Garbage Bin at Park",
    category: "sanitation",
    categoryLabel: "Sanitation & Waste",
    severity: "low",
    status: "resolved",
    statusLabel: "Resolved",
    location: "Central Park, North Entrance",
    date: "Jun 14, 2026",
    votes: 18,
    image: "https://picsum.photos/seed/garbage129/600/340",
    emoji: "🗑️",
  },
  {
    id: "CH-2026-0145",
    name: "Blocked Storm Drain on Maple Lane",
    category: "water",
    categoryLabel: "Water & Drainage",
    severity: "critical",
    status: "open",
    statusLabel: "Open",
    location: "78 Maple Lane, Westside",
    date: "Jun 22, 2026",
    votes: 62,
    image: "https://picsum.photos/seed/drain145/600/340",
    emoji: "🌊",
  },
  {
    id: "CH-2026-0135",
    name: "Fallen Tree Branch Blocking Sidewalk",
    category: "parks",
    categoryLabel: "Parks & Public Spaces",
    severity: "high",
    status: "progress",
    statusLabel: "In Progress",
    location: "Birch Road, Near Community Center",
    date: "Jun 20, 2026",
    votes: 39,
    image: "https://picsum.photos/seed/tree135/600/340",
    emoji: "🌳",
  },
  {
    id: "CH-2026-0121",
    name: "Graffiti on Community Mural Wall",
    category: "safety",
    categoryLabel: "Public Safety",
    severity: "low",
    status: "resolved",
    statusLabel: "Resolved",
    location: "Art District, Wall at 3rd & Pine",
    date: "Jun 9, 2026",
    votes: 24,
    image: "https://picsum.photos/seed/graffiti121/600/340",
    emoji: "🎨",
  },
  {
    id: "CH-2026-0151",
    name: "Cracked Sidewalk Near School",
    category: "roads",
    categoryLabel: "Roads & Pavement",
    severity: "medium",
    status: "open",
    statusLabel: "Open",
    location: "Lincoln Elementary, 4th Avenue",
    date: "Jun 22, 2026",
    votes: 55,
    image: "https://picsum.photos/seed/sidewalk151/600/340",
    emoji: "🚸",
  },
  {
    id: "CH-2026-0133",
    name: "Water Leak from Fire Hydrant",
    category: "water",
    categoryLabel: "Water & Drainage",
    severity: "critical",
    status: "progress",
    statusLabel: "In Progress",
    location: "Corner of Pine & 7th, Midtown",
    date: "Jun 19, 2026",
    votes: 73,
    image: "https://picsum.photos/seed/hydrant133/600/340",
    emoji: "🚒",
  },
];

function initTrackFilters() {
  const grid = document.getElementById("issue-grid");
  if (!grid) return;

  const searchInput = document.getElementById("issue-search");
  const statusFilter = document.getElementById("filter-status");
  const categoryFilter = document.getElementById("filter-category");
  const severityFilter = document.getElementById("filter-severity");
  const clearBtn = document.getElementById("clear-filters");
  const resetBtn = document.getElementById("reset-filters");
  const resultsCount = document.getElementById("results-count");
  const emptyState = document.getElementById("track-empty");

  let supportedIds = new Set(
    JSON.parse(localStorage.getItem("supportedIssues") || "[]")
  );

  function getBadgeClass(type, value) {
    return `badge badge-${type}-${value}`;
  }

  function renderIssueCard(issue) {
    const supported = supportedIds.has(issue.id);
    const voteCount = issue.votes + (supported ? 1 : 0);

    return `
      <article class="issue-card fade-in visible"
        data-id="${issue.id}"
        data-status="${issue.status}"
        data-category="${issue.category}"
        data-severity="${issue.severity}"
        data-search="${issue.name.toLowerCase()} ${issue.location.toLowerCase()} ${issue.categoryLabel.toLowerCase()}">
        <div class="issue-card-image-wrap">
          <img class="issue-card-image" src="${issue.image}" alt="${issue.name}" loading="lazy"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="issue-card-image-fallback" style="display:none;">${issue.emoji}</div>
          <span class="issue-card-status-overlay">
            <span class="${getBadgeClass("status", issue.status)}">${issue.statusLabel}</span>
          </span>
          <span class="issue-card-category">${issue.categoryLabel}</span>
        </div>
        <div class="issue-card-body">
          <div class="issue-card-top">
            <h3>${issue.name}</h3>
            <span class="issue-id">#${issue.id}</span>
          </div>
          <div class="issue-card-meta">
            <div class="issue-meta-item">
              <span class="issue-meta-icon">📍</span>
              ${issue.location}
            </div>
            <div class="issue-meta-item">
              <span class="issue-meta-icon">📅</span>
              ${issue.date}
            </div>
          </div>
          <div class="issue-tags">
            <span class="${getBadgeClass("severity", issue.severity)}">${issue.severity}</span>
            <span class="${getBadgeClass("status", issue.status)}">${issue.statusLabel}</span>
          </div>
          <div class="issue-card-footer">
            <div class="issue-votes">
              <span class="issue-votes-icon">👍</span>
              <span class="vote-count">${voteCount}</span> votes
            </div>
            <div class="issue-card-actions">
              <button type="button" class="btn-issue btn-view" data-action="view" data-id="${issue.id}">View Details</button>
              <button type="button" class="btn-issue btn-support${supported ? " supported" : ""}" data-action="support" data-id="${issue.id}"${supported ? " disabled" : ""}>
                ${supported ? "Supported" : "Support Issue"}
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function getFilteredIssues() {
    const query = (searchInput?.value || "").trim().toLowerCase();
    const status = statusFilter?.value || "all";
    const category = categoryFilter?.value || "all";
    const severity = severityFilter?.value || "all";

    return TRACK_ISSUES.filter((issue) => {
      const matchesStatus = status === "all" || issue.status === status;
      const matchesCategory = category === "all" || issue.category === category;
      const matchesSeverity = severity === "all" || issue.severity === severity;
      const searchText = `${issue.name} ${issue.location} ${issue.categoryLabel}`.toLowerCase();
      const matchesSearch = !query || searchText.includes(query);
      return matchesStatus && matchesCategory && matchesSeverity && matchesSearch;
    });
  }

  function renderIssues() {
    const filtered = getFilteredIssues();

    grid.innerHTML = filtered.map(renderIssueCard).join("");

    if (resultsCount) {
      resultsCount.textContent = `Showing ${filtered.length} issue${filtered.length !== 1 ? "s" : ""}`;
    }

    if (emptyState) {
      emptyState.hidden = filtered.length > 0;
      grid.style.display = filtered.length > 0 ? "" : "none";
    }

    attachCardListeners();
  }

  function attachCardListeners() {
    grid.querySelectorAll("[data-action='view']").forEach((btn) => {
      btn.addEventListener("click", () => {
        const issue = TRACK_ISSUES.find((i) => i.id === btn.dataset.id);
        if (issue) {
          showToast(`Opening details for "${issue.name}" (#${issue.id})`);
        }
      });
    });

    grid.querySelectorAll("[data-action='support']").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        if (supportedIds.has(id)) return;

        supportedIds.add(id);
        localStorage.setItem("supportedIssues", JSON.stringify([...supportedIds]));
        showToast("Thank you for supporting this issue!");
        renderIssues();
      });
    });
  }

  function clearAllFilters() {
    if (searchInput) searchInput.value = "";
    if (statusFilter) statusFilter.value = "all";
    if (categoryFilter) categoryFilter.value = "all";
    if (severityFilter) severityFilter.value = "all";
    renderIssues();
  }

  [searchInput, statusFilter, categoryFilter, severityFilter].forEach((el) => {
    if (el) el.addEventListener("input", renderIssues);
    if (el && el.tagName === "SELECT") el.addEventListener("change", renderIssues);
  });

  if (clearBtn) clearBtn.addEventListener("click", clearAllFilters);
  if (resetBtn) resetBtn.addEventListener("click", clearAllFilters);

  renderIssues();
}

/* ---- Toast Notification ---- */
function showToast(message) {
  let toast = document.querySelector(".toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}
// ===============================
// AI Report Submission
// ===============================

const reportForm = document.getElementById("report-form");

if (reportForm) {
  reportForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const location = document.getElementById("location").value;

    // Show loading
    document.getElementById("ai-category").textContent = "Analyzing...";
    document.getElementById("ai-severity").textContent = "Analyzing...";
    document.getElementById("ai-department").textContent = "Analyzing...";
    document.getElementById("ai-summary").textContent = "Analyzing...";
    document.getElementById("ai-action").textContent = "Analyzing...";

    try {
      const response = await fetch("http://localhost:3000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          location,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      // Remove ```json ... ``` if AI returns markdown
      let text = data.result
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const ai = JSON.parse(text);

      document.getElementById("ai-category").textContent = ai.category;
      document.getElementById("ai-severity").textContent = ai.severity;
      document.getElementById("ai-department").textContent = ai.department;
      document.getElementById("ai-summary").textContent = ai.summary;
      document.getElementById("ai-action").textContent =
        ai.suggestedAction;

    } catch (err) {
      console.error(err);

      document.getElementById("ai-category").textContent = "Error";
      document.getElementById("ai-severity").textContent = "-";
      document.getElementById("ai-department").textContent = "-";
      document.getElementById("ai-summary").textContent = err.message;
      document.getElementById("ai-action").textContent = "Try again.";
    }
  });
}// ===============================
// AI Report Submission
// ===============================

