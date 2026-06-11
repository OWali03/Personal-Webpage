/* Page behavior: nav state, mobile menu, scroll reveals. No libraries. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Fixed nav: semi-opaque after scrolling past the top ---------- */
  var nav = document.getElementById("nav");
  var scrollHint = document.querySelector(".scroll-hint");

  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 24);
    if (scrollHint) {
      scrollHint.classList.toggle("is-hidden", y > window.innerHeight * 0.15);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("nav-toggle");
  var links = document.getElementById("nav-links");

  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", function () {
    setMenu(!document.body.classList.contains("menu-open"));
  });

  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") setMenu(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  /* ---------- Scroll-triggered reveals ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
