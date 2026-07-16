const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const headerCta = document.querySelector(".header-cta");
const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");

    if (headerCta) {
      headerCta.classList.toggle("open", isOpen);
    }

    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  siteNav.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLAnchorElement)) return;

    siteNav.classList.remove("open");
    headerCta?.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
  });
}

const directoryCarousel = document.querySelector(".directory-carousel");
const directoryPrev = document.querySelector(".directory-prev");
const directoryNext = document.querySelector(".directory-next");

if (directoryCarousel && directoryPrev && directoryNext) {
  const moveDirectory = (direction) => {
    const card = directoryCarousel.querySelector(".directory-card");
    const gap = Number.parseFloat(getComputedStyle(directoryCarousel).columnGap) || 0;
    const distance = card ? card.getBoundingClientRect().width + gap : directoryCarousel.clientWidth;
    directoryCarousel.scrollBy({ left: distance * direction, behavior: "smooth" });
  };

  directoryPrev.addEventListener("click", () => moveDirectory(-1));
  directoryNext.addEventListener("click", () => moveDirectory(1));
}

const directoryFilters = document.querySelectorAll("[data-directory-filter]");
const directoryListings = document.querySelectorAll("[data-directory-category]");
const directorySearch = document.querySelector("#directory-search");

if (directoryListings.length) {
  let activeDirectoryCategory = "all";

  const updateDirectoryResults = () => {
    const searchTerm = directorySearch?.value.trim().toLowerCase() || "";

    directoryListings.forEach((listing) => {
      const categoryMatches = activeDirectoryCategory === "all" || listing.dataset.directoryCategory === activeDirectoryCategory;
      const searchMatches = !searchTerm || listing.textContent.toLowerCase().includes(searchTerm);
      listing.hidden = !categoryMatches || !searchMatches;
    });
  };

  directoryFilters.forEach((filterButton) => {
    filterButton.addEventListener("click", () => {
      activeDirectoryCategory = filterButton.dataset.directoryFilter;

      directoryFilters.forEach((button) => {
        const isActive = button === filterButton;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      updateDirectoryResults();
    });
  });

  directorySearch?.addEventListener("input", updateDirectoryResults);
}

const directoryPreviewModal = document.querySelector("#directory-preview-modal");

if (directoryPreviewModal instanceof HTMLDialogElement) {
  const previewTitle = directoryPreviewModal.querySelector("#directory-preview-title");
  const previewMark = directoryPreviewModal.querySelector(".directory-preview-mark");
  const previewIndustry = directoryPreviewModal.querySelector(".directory-preview-industry");
  const previewLocation = directoryPreviewModal.querySelector(".directory-preview-location");
  const previewDescription = directoryPreviewModal.querySelector(".directory-preview-description");
  const previewClose = directoryPreviewModal.querySelector(".directory-preview-close");

  document.querySelectorAll(".directory-listing-grid .directory-card:not(.directory-open-card) > a").forEach((previewLink) => {
    previewLink.addEventListener("click", (event) => {
      event.preventDefault();

      const card = previewLink.closest(".directory-card");
      const company = card?.querySelector("h3")?.textContent.trim() || "Sample Business";
      const industry = card?.querySelector(".directory-industry")?.textContent.trim() || "Professional Services";
      const location = card?.querySelector(".member-location")?.textContent.trim() || "Houston, Texas";
      const mark = card?.querySelector(".member-mark")?.textContent.trim() || company.charAt(0);

      previewTitle.textContent = company;
      previewMark.textContent = mark;
      previewIndustry.textContent = industry;
      previewLocation.textContent = location;
      previewDescription.textContent = `${company} is a sample ${industry.toLowerCase()} profile created to demonstrate the information, branding, and visibility available to directory members.`;
      directoryPreviewModal.showModal();
    });
  });

  previewClose?.addEventListener("click", () => directoryPreviewModal.close());
  directoryPreviewModal.addEventListener("click", (event) => {
    if (event.target === directoryPreviewModal) directoryPreviewModal.close();
  });
}
