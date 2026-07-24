// ===== Count resources on load =====
const cards = Array.from(document.querySelectorAll(".card"));
const countEl = document.getElementById("stat-count");
if (countEl) countEl.textContent = cards.length;

// ===== Live search filter =====
const searchInput = document.getElementById("searchInput");
const sections = Array.from(document.querySelectorAll("[data-subject-section]"));
const noResults = document.getElementById("noResults");
const noResultsQuery = document.getElementById("noResultsQuery");

function applyFilter(query){
  const q = query.trim().toLowerCase();
  let visibleCount = 0;

  cards.forEach(card => {
    const haystack = (card.dataset.search || "") + " " + card.textContent.toLowerCase();
    const match = q === "" || haystack.toLowerCase().includes(q);
    card.style.display = match ? "" : "none";
    if (match) visibleCount++;
  });

  sections.forEach(section => {
    const anyVisible = Array.from(section.querySelectorAll(".card"))
      .some(c => c.style.display !== "none");
    section.style.display = (q === "" || anyVisible) ? "" : "none";
  });

  if (noResults) {
    if (q !== "" && visibleCount === 0) {
      noResults.hidden = false;
      noResultsQuery.textContent = query;
    } else {
      noResults.hidden = true;
    }
  }
}

if (searchInput) {
  searchInput.addEventListener("input", (e) => applyFilter(e.target.value));
}

// ===== Highlight active tab while scrolling =====
const tabs = Array.from(document.querySelectorAll(".tab"));
const sectionEls = sections;

function setActiveTab(id){
  tabs.forEach(t => t.classList.toggle("active", t.dataset.target === id));
}

if ("IntersectionObserver" in window && sectionEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActiveTab(entry.target.id);
    });
  }, { rootMargin: "-40% 0px -50% 0px", threshold: 0 });

  sectionEls.forEach(section => observer.observe(section));
}
