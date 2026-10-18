const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const headerCta = document.querySelector(".header-cta");
const year = document.querySelector("#year");

const contactSubject = document.querySelector('.contact-form select[name="subject"]');

if (contactSubject) {
  const requestedSubject = new URLSearchParams(window.location.search).get("subject");
  const matchingOption = Array.from(contactSubject.options).find((option) => option.value === requestedSubject || option.text === requestedSubject);

  if (matchingOption) contactSubject.value = matchingOption.value || matchingOption.text;
}

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


const calendarList = document.querySelector(".calendar-event-list");
if (calendarList) {
  const carousel = calendarList.closest(".calendar-carousel");
  const todayInHouston = () => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date());
    const value = (type) => parts.find((part) => part.type === type).value;
    return `${value("year")}-${value("month")}-${value("day")}`;
  };
  const refreshCalendar = () => {
    const today = todayInHouston();
    const cards = [...calendarList.querySelectorAll(".calendar-event-card")];
    cards.forEach((card) => {
      card.hidden = card.querySelector("time").dateTime.slice(0, 10) < today;
    });
    const hasEvents = cards.some((card) => !card.hidden);
    calendarList.hidden = !hasEvents;
    carousel.querySelector(".calendar-no-events").hidden = hasEvents;
  };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let lastInteraction = 0;
  let transitioning = false;
  const fadeToEvent = async (left) => {
    if (transitioning) return;
    if (reducedMotion.matches) {
      calendarList.scrollTo({ left, behavior: "instant" });
      return;
    }
    transitioning = true;
    try {
      await calendarList.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 350, easing: "ease-in-out", fill: "forwards"
      }).finished.then(() => {
        calendarList.style.opacity = "0";
        calendarList.getAnimations().forEach((animation) => animation.cancel());
      });
      calendarList.scrollTo({ left, behavior: "instant" });
      await calendarList.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 550, easing: "ease-in-out"
      }).finished;
    } finally {
      calendarList.style.opacity = "";
      transitioning = false;
      }
  };
  const moveCalendar = (direction) => fadeToEvent(
    calendarList.scrollLeft + direction * (calendarList.clientWidth + 20)
  );
  ["pointerdown", "wheel", "keydown"].forEach((eventName) => {
    carousel.addEventListener(eventName, () => { lastInteraction = Date.now(); }, { passive: true });
  });
  setInterval(() => {
    if (reducedMotion.matches || transitioning || document.hidden || carousel.matches(":hover") ||
        carousel.contains(document.activeElement) || Date.now() - lastInteraction < 8000 ||
        calendarList.hidden || calendarList.scrollWidth <= calendarList.clientWidth + 1) return;
    const bounds = carousel.getBoundingClientRect();
    if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
    if (calendarList.scrollLeft + calendarList.clientWidth >= calendarList.scrollWidth - 1) {
      fadeToEvent(0);
    } else {
      moveCalendar(1);
    }
  }, 6000);
  document.addEventListener("visibilitychange", refreshCalendar);
  refreshCalendar();
  setInterval(refreshCalendar, 60000);
}
