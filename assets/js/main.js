// navbar dropdown — hover on desktop, click/tap on touch devices
(function () {
  var mobileViewport = window.matchMedia('(max-width: 1023.98px)');
  var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  var navItems = document.querySelectorAll(".navbar-appscode .nav-item");

  function useClickMode() {
    return mobileViewport.matches || isTouchDevice;
  }

  function openNav(navItem) {
    // close any other open item first
    document.querySelectorAll(".navbar-appscode .nav-item.is-active").forEach(function (other) {
      if (other !== navItem) closeNav(other);
    });
    navItem.classList.add('is-active');
    var trigger = navItem.querySelector('.link');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  }

  function closeNav(navItem) {
    navItem.classList.remove('is-active');
    var trigger = navItem.querySelector('.link');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  navItems.forEach(function (navItem) {
    var trigger = navItem.querySelector('.link');
    var hasMega = !!navItem.querySelector('.mega-menu-wrapper');

    // stamp aria attributes
    if (trigger && hasMega) {
      trigger.setAttribute('aria-haspopup', 'menu');
      trigger.setAttribute('aria-expanded', 'false');
    }

    if (!hasMega) return; // plain links — no dropdown logic needed

    var closeTimer = null;

    function scheduleClose() {
      closeTimer = setTimeout(function () { closeNav(navItem); }, 120);
    }

    function cancelClose() {
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    }

    // click/tap mode for mobile viewport and touch devices
    trigger.addEventListener('click', function (e) {
      if (!useClickMode()) return;
      e.preventDefault();
      if (navItem.classList.contains('is-active')) {
        closeNav(navItem);
      } else {
        openNav(navItem);
      }
    });

    // desktop: hover interaction
    navItem.addEventListener('mouseenter', function () {
      if (useClickMode()) return;
      cancelClose();
      openNav(navItem);
    });

    navItem.addEventListener('mouseleave', function () {
      if (useClickMode()) return;
      scheduleClose();
    });

    // keep open when cursor moves into the dropdown panel
    var panel = navItem.querySelector('.mega-menu-wrapper');
    if (panel) {
      panel.addEventListener('mouseenter', function () {
        if (useClickMode()) return;
        cancelClose();
      });

      panel.addEventListener('mouseleave', function () {
        if (useClickMode()) return;
        scheduleClose();
      });
    }

    // keyboard: Enter/Space opens, Escape closes
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (navItem.classList.contains('is-active')) {
          closeNav(navItem);
        } else {
          openNav(navItem);
        }
      }
      if (e.key === 'Escape') {
        closeNav(navItem);
        trigger.focus();
      }
    });
  });

  function closeAllOpenDropdowns() {
    document.querySelectorAll(".navbar-appscode .nav-item.is-active").forEach(function (item) {
      closeNav(item);
    });
  }

  if (mobileViewport.addEventListener) {
    mobileViewport.addEventListener('change', closeAllOpenDropdowns);
  } else if (mobileViewport.addListener) {
    mobileViewport.addListener(closeAllOpenDropdowns);
  }

  // close on Escape from anywhere inside the dropdown
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll(".navbar-appscode .nav-item.is-active").forEach(function (item) {
        closeNav(item);
        var t = item.querySelector('.link');
        if (t) t.focus();
      });
    }
  });

  // close when clicking outside (covers touch and desktop)
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.navbar-appscode .nav-item')) {
      document.querySelectorAll(".navbar-appscode .nav-item.is-active").forEach(function (item) {
        closeNav(item);
      });
    }
  });
}());
// navbar dropdown end

// responsive navbar area
// elements selector where toggle class will be added
const selectorsForResponsiveMenu = [
  ".left-sidebar-wrapper",
  ".navbar-appscode.documentation-menu > .navbar-right",
  ".right-sidebar",
  ".sidebar-search-area"
];
// toggle classes for responsive buttons
const toggleClassesForResponsiveMenu = ["is-open", "is-visible", "is-open", "right-0"];

function closeAllDocsPanels() {
  [".left-sidebar-wrapper", ".right-sidebar"].forEach(function(sel) {
    var el = document.querySelector(sel);
    if (el) { el.classList.remove("is-open", "is-block"); }
  });
  var docsNav = document.querySelector(".navbar-appscode.documentation-menu > .navbar-right");
  if (docsNav) docsNav.classList.remove("is-visible");
  var searchPanel = document.querySelector(".sidebar-search-area");
  if (searchPanel) searchPanel.classList.remove("right-0");
  var overlay = document.getElementById("docsMobileOverlay");
  if (overlay) overlay.classList.remove("is-active");
  document.querySelectorAll(".docs-mobile-btn").forEach(function(btn) {
    btn.classList.remove("is-active");
  });
}

// All responsive menu buttons (new docs-mobile-bar + legacy responsive-menu)
const responsiveMenus = document.querySelectorAll(
  ".docs-mobile-bar .docs-mobile-btn, .responsive-menu > .is-flex.is-justify-content-space-between > .button"
);
// iterate through the menus to handle click event
Array.from(responsiveMenus).forEach((menu, idx) => {
  menu.addEventListener("click", function () {
    const targetSelector = menu.getAttribute("data-responsive-target") || selectorsForResponsiveMenu[idx];
    const toggleClass = menu.getAttribute("data-toggle-class") || toggleClassesForResponsiveMenu[idx];
    const toggleElement = targetSelector ? document.querySelector(targetSelector) : null;
    const isCurrentlyOpen = toggleElement && toggleElement.classList.contains(toggleClass);

    closeAllDocsPanels();

    if (!isCurrentlyOpen && toggleElement) {
      toggleElement.classList.add(toggleClass);
      menu.classList.add("is-active");

      var overlay = document.getElementById("docsMobileOverlay");
      if (overlay && toggleClass !== "right-0") overlay.classList.add("is-active");

      const backButtonElement = toggleElement.querySelector(".back-button");
      if (backButtonElement) {
        const handleBack = function() {
          closeAllDocsPanels();
          backButtonElement.removeEventListener("click", handleBack);
        };
        backButtonElement.addEventListener("click", handleBack);
      }
    }

    const modalBackdropElement = document.querySelector(".modal-backdrop.is-show");
    if (modalBackdropElement) {
      modalBackdropElement.classList.remove("is-show");
    }

    // only clear navbar nav-items, not sidebar active items
    document.querySelectorAll(".navbar-appscode .nav-item.is-active").forEach(function(navItem) {
      navItem.classList.remove("is-active");
    });
  });
});

// close panels when overlay is tapped
var docsMobileOverlay = document.getElementById("docsMobileOverlay");
if (docsMobileOverlay) {
  docsMobileOverlay.addEventListener("click", closeAllDocsPanels);
}

// copy button for Hugo markdown code blocks (div.highlight > pre > code)
document.querySelectorAll(".content-body div.highlight").forEach((block) => {
  const code = block.querySelector("code");
  if (!code) return;

  block.style.position = "relative";

  const btn = document.createElement("button");
  btn.className = "ac-copy-btn";
  btn.title = "Copy";
  btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

  btn.addEventListener("click", () => {
    navigator.clipboard.writeText(code.innerText.trim()).then(() => {
      btn.classList.add("copied");
      btn.title = "Copied!";
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.title = "Copy";
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
      }, 2000);
    });
  });

  block.appendChild(btn);
});

// docs page codeblock copy button
document.querySelectorAll(".code-block-wrapper").forEach(codeBlockWrapper => {
  const heading = codeBlockWrapper.querySelector(".code-block-title");
  if (!heading) return;
  const highlight = heading.nextElementSibling;
  if (!highlight) return;
  const code = highlight.querySelector("code");
  if (!code) return;

  const downloadBtn = heading.querySelector(".download-here");
  const copyBtn = heading.querySelector(".copy-here");
  const codeContent = code.textContent;
  let fileType = code.getAttribute("class");
  fileType = fileType ? fileType.replace("language-", "") : "txt";
  const h4 = heading.querySelector("h4");
  const fileName = h4 ? h4.textContent.replace(" ", "_") : "code";

  if (downloadBtn) {
    downloadBtn.addEventListener("click", function () {
      return download(codeContent, `${fileName}.${fileType}`, "text/plain");
    });
  }

  if (copyBtn) {
    new ClipboardJS(copyBtn, {
      target: function (trigger) {
        trigger.title = "Copied";
        return heading.nextElementSibling;
      }
    });
  }
});


// scroll to top start
const goToTopBtn = document.querySelector(".go-to-top");
const goToTopProgress = document.querySelector(".go-to-top-progress");
const CIRCUMFERENCE = 119.38; // 2π × r=19

function updateScrollProgress() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

  if (goToTopBtn) {
    if (scrollTop > 80) {
      goToTopBtn.classList.add('is-visible');
    } else {
      goToTopBtn.classList.remove('is-visible');
    }
  }

  if (goToTopProgress) {
    goToTopProgress.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  }
}

if (goToTopBtn) {
  goToTopBtn.addEventListener('click', function () {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });
}

document.addEventListener('scroll', updateScrollProgress, { passive: true });
// scroll to top end


// close modal start
function closeModal() {
  document.querySelectorAll('.modal').forEach((modal) => {
    if (modal.classList.contains('is-active')) {
      modal.classList.remove('is-active')
    }
  })

}
// close modal end
// adds modal JS 
// setTimeout(() => {
//   document.querySelector('.modal-1')?.querySelector('.modal')?.classList.add('is-active')
// }, 1500);

var h_editor = document.querySelector('.hero-area-code-editor');
document.addEventListener("DOMContentLoaded", () => {
  // highligh js initilization start
  if (h_editor) {
    h_editor.classList.add('is-visible')
  }

  // hljs.highlightAll();
  // highligh js initilization end

  // AOS Animation
  // AOS.init({
  //   once: true,
  // });


});

// menu sticky
// Not a ton of code, but hard to

// mega menu active class — handled by the navbar IIFE above; this block is intentionally removed to avoid double-toggle

// owl owlCarousel JS
var owl = $('.testimonial-carousel');
if (owl.length) {
  owl.owlCarousel({
    loop: true,
    margin: 20,
    infinity: true,
    autoplay: true,
    nav: false,
    dots: false,
    smartSpeed: 2000,
    responsiveClass: true,
    autoplayHoverPause: true,
    fluidSpeed: true,
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1400: { items: 2 }
    }
  });
  $('.customNextBtn').click(function () { owl.trigger('next.owl.carousel'); });
  $('.customPrevBtn').click(function () { owl.trigger('prev.owl.carousel'); });
}

// for social prove owlCarousel
var owlSocialProve = $('.brand-image-wrapper');
if (owlSocialProve.length) {
  owlSocialProve.owlCarousel({
    loop: true,
    margin: 20,
    autoplay: true,
    nav: false,
    dots: false,
    infinity: true,
    fluidSpeed: true,
    smartSpeed: 3000,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    rewindNav: false,
    rewindSpeed: 0,
    autoWidth: true,
    responsiveClass: true,
    responsive: {
      0: { items: 4 },
      600: { items: 5 },
      1400: { items: 9 }
    }
  });
}


// testimonial grid carousel
var owlTestiGrid = $('#ac-testi-grid');
if (owlTestiGrid.length) {
  owlTestiGrid.owlCarousel({
    loop: true,
    margin: 24,
    nav: true,
    dots: true,
    smartSpeed: 400,
    autoplay: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    responsiveClass: true,
    navText: [
      '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>',
      '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>'
    ],
    responsive: {
      0:    { items: 1 },
      768:  { items: 2 },
      1024: { items: 3 }
    }
  });
}

// management console screenshot carousel
var owlConsoleScreens = $('.console-screenshot-carousel');
if (owlConsoleScreens.length) {
  owlConsoleScreens.owlCarousel({
    loop: true,
    items: 1,
    margin: 0,
    autoplay: true,
    autoplayTimeout: 4500,
    autoplayHoverPause: true,
    smartSpeed: 800,
    nav: false,
    dots: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true
  });
  $('.console-prev-btn').click(function () {
    $(this).closest('.console-wrap').find('.console-screenshot-carousel').trigger('prev.owl.carousel');
  });
  $('.console-next-btn').click(function () {
    $(this).closest('.console-wrap').find('.console-screenshot-carousel').trigger('next.owl.carousel');
  });
}

// Modal js video init plugin
if ($(".yt-video").length) {
  $(".yt-video").magnificPopup({ type: 'iframe' });
}


// headroomjs start
var myElement = document.querySelector(".active-headroom");
if (myElement) {
  var headroom = new Headroom(myElement);
  headroom.init();
}
// headroomjs end


// For FAQ Collapse Page
const accordionItem = document.querySelectorAll(".accordion-item");
const onClickAccordionHeader = (e) => {
  if (e.currentTarget.parentNode.classList.contains("active")) {
    e.currentTarget.parentNode.classList.remove("active");
  } else {
    Array.prototype.forEach.call(accordionItem, (e) => {
      e.classList.remove("active");
    });
    e.currentTarget.parentNode.classList.add("active");
  }
};
const initFaqAccordion = () => {
  Array.prototype.forEach.call(accordionItem, (e) => {
    e.querySelector(".accordion-header").addEventListener(
      "click",
      onClickAccordionHeader,
      false
    );
  });
};
document.addEventListener("DOMContentLoaded", initFaqAccordion);

// Table Of Content
// go to the section smoothly when click on a table-of-content item
const NAVBAR_HEIGHT = 166;
const goToASectionSmoothly = () => {
  const tocItems = document.querySelectorAll("#TableOfContents a");
  tocItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetEl = document.querySelector(e.currentTarget.hash);
      if (!targetEl) return;
      window.scrollTo({
        top: targetEl.offsetTop - NAVBAR_HEIGHT,
        behavior: "smooth",
      });
    });
  });
};

// add .active dynamically to TOC
const spyScrolling = () => {
  const allHeaders = document.querySelectorAll("h1, h2, h3, h4");
  window.onscroll = () => {
    const scrollPos =
      document.documentElement.scrollTop || document.body.scrollTop;
    for (let s in allHeaders) {
      if (
        allHeaders.hasOwnProperty(s) &&
        allHeaders[s].offsetTop <= scrollPos + NAVBAR_HEIGHT + 8
      ) {
        const id = allHeaders[s].id;
        if (id) {
          document.querySelectorAll("#TableOfContents a").forEach((a) => {
            if (`#${id}` === a.hash) {
              a.classList.add("active");
            } else {
              a.classList.remove("active");
            }
          });
        }
      }
    }
  };
};

goToASectionSmoothly();
spyScrolling();

// docs page left sidebar — remove duplicate first item and style the title
function removeDuplicateLeftSidebarItem() {
  const sidebarMenu = document.querySelector(".product-sidebar-menu");
  if (!sidebarMenu) return;

  const topLevelItemSelector = ":scope > .item, :scope > .nav-item";
  const getTitle = (el) =>
    (el.querySelector("label > a, label, a")?.textContent || "")
      .replace(/\s+/g, " ")
      .trim();

  const items = sidebarMenu.querySelectorAll(topLevelItemSelector);
  if (items.length > 1) {
    const firstTitle = getTitle(items[0]);
    if (firstTitle && firstTitle === getTitle(items[1])) {
      items[0].remove();
    }
  }

  const firstSidebarItem = sidebarMenu.querySelector(topLevelItemSelector);
  const firstSidebarTitle = firstSidebarItem?.querySelector("label > a, label, a");
  if (firstSidebarTitle) {
    firstSidebarTitle.style.fontSize = "22px";
    firstSidebarTitle.style.fontWeight = "600";
  }
}

document.addEventListener("DOMContentLoaded", removeDuplicateLeftSidebarItem, { once: true });

document.addEventListener("DOMContentLoaded", () => {
  // docs-page -> right sidebar (content > 20) then show a scroll
  const allHeaders = document.querySelectorAll(
    ".full-info > h2,.full-info > h3,.full-info > h4"
  );
  if (allHeaders.length > 20) {
    const rightSidebarArea = document.querySelector(".right-sidebar-area");
    if (rightSidebarArea) rightSidebarArea.style.position = "inherit";
  }

  // docs page header anchor links
  Array.from(allHeaders).forEach((el) => {
    const id = el.id;
    if (!id) return;
    const anchorTag = document.createElement("a");
    anchorTag.classList.add('header-anchor');
    anchorTag.setAttribute("href", "#" + id);
    el.appendChild(anchorTag);

    anchorTag.addEventListener("click", (e) => {
      e.preventDefault();
      const targetEl = document.querySelector(e.currentTarget.hash);
      if (!targetEl) return;
      window.history.pushState(id, "title", "#" + id);
      window.scrollTo({
        top: targetEl.offsetTop - NAVBAR_HEIGHT,
        behavior: "smooth",
      });
    });
  });

  // scroll to hash on page load/reload
  setTimeout(function () {
    const getHash = location.hash;
    if (getHash) {
      const targetE2 = document.querySelector(getHash);
      if (!targetE2) return;
      scrollTo({
        top: targetE2.offsetTop - NAVBAR_HEIGHT,
        behavior: "smooth",
      });
    }
  }, 0);
});

// tabs active class add script - setup | install page
// Scoped per tab-group so multiple groups on the same page don't interfere
document.querySelectorAll(".nav-tabs").forEach((tabGroup) => {
  const tabContent = tabGroup.nextElementSibling;
  if (!tabContent || !tabContent.classList.contains("tab-content")) return;

  const tabLinks = tabGroup.querySelectorAll(".nav-link");
  tabLinks.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      const el = e.currentTarget;

      tabLinks.forEach((navLink) => {
        navLink === el ?
          navLink.classList.add("active") :
          navLink.classList.remove("active");
      });

      const tabPaneTarget = tabContent.querySelector(el.getAttribute("href"));
      tabContent.querySelectorAll(".tab-pane").forEach((tabPane) => {
        tabPane === tabPaneTarget ?
          tabPane.classList.add("show") :
          tabPane.classList.remove("show");
      });
    });
  });
});


// custom accordion
function acAccordion(actionBtn) {
  let accordionHeadingAll = document.querySelectorAll(actionBtn);

  // Create event listeners for each accordion heading
  Array.from(accordionHeadingAll).forEach((accordionHeading) => {
    accordionHeading.addEventListener("click", function () {
      let singleAcc = accordionHeading.closest(".single-accordion-item");
      
      let isOpen = singleAcc.classList.contains("open");

      // select all accordion
      let accordionItems = document.querySelectorAll(".single-accordion-item");
      Array.from(accordionItems).forEach((accordionItem) => {
        // close all item
        accordionItem.className = "single-accordion-item closed";
        let icon = accordionItem.querySelector(".icon .fa");
        if (icon) {
          icon.classList.replace("fa-minus", "fa-plus");
        }
        let accordionBody = accordionItem.querySelector(".accordion-body");
        accordionBody.style.maxHeight = null;
      });

      // get single element icon
      let icon = singleAcc.querySelector(".icon .fa");
      if (isOpen) {
        singleAcc.className = "single-accordion-item closed";
        let accordionBody = singleAcc.querySelector(".accordion-body");
        accordionBody.style.maxHeight = null;
        if (icon) {
          icon.classList.replace("fa-minus", "fa-plus");
        }
      } else {
        singleAcc.className = "single-accordion-item open";
        let accordionBody = singleAcc.querySelector(".accordion-body");
        accordionBody.style.maxHeight = accordionBody.scrollHeight + "px";
        if (icon) {
          icon.classList.replace("fa-plus", "fa-minus");
        }
      }
    });
  });
}

acAccordion(".accordion-heading h3");
acAccordion(".accordion-heading .icon");
// accordion end
