(() => {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = matchMedia("(max-width: 700px)");
  const fine = matchMedia("(hover: hover) and (pointer: fine)");
  const loader = document.querySelector(".loader");
  const video = loader.querySelector("video");
  const header = document.querySelector(".nav");
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#site-menu");
  const main = document.querySelector("#main");
  const footer = document.querySelector(".footer");
  const featured = document.querySelector(".page-2");
  const entries = [...document.querySelectorAll(".page-2-elem")];
  const backgrounds = [...document.querySelectorAll(".project-background")];
  let locomotive;
  let intro;
  let loaderTimer;
  let selected;
  let introDone = false;

  function finishIntro() {
    if (introDone) return;
    introDone = true;
    clearTimeout(loaderTimer);
    intro?.kill();
    loader.hidden = true;
    video.pause();
    video.removeAttribute("src");
    video.load();
  }
  function startIntro() {
    // Decorative curtains/video/headline keep their sequence; content never waits for media.
    if (!window.gsap || reduced.matches || location.hash || scrollY > 20)
      return finishIntro();
    loader.hidden = false;
    loaderTimer = setTimeout(finishIntro, 2600);
    if (!navigator.connection?.saveData) {
      video.src = video.dataset.src;
      video.play().catch(() => {});
    }
    const gsap = window.gsap;
    gsap.set("#yellow-2", { yPercent: 100 });
    intro = gsap.timeline({ onComplete: finishIntro });
    intro
      .to(
        "#yellow-1",
        { yPercent: -100, duration: 0.7, ease: "expo.out" },
        0.12,
      )
      .to("#yellow-2", { yPercent: 0, duration: 0.7, ease: "expo.out" }, 0.9)
      .to(".loader .studio-statement", { color: "#000", duration: 0.45 }, 1.08)
      .to(loader, { opacity: 0, duration: 0.25 }, 1.65);
  }
  function setupScrolling() {
    locomotive?.destroy();
    locomotive = undefined;
    if (window.LocomotiveScroll && !reduced.matches) {
      try {
        locomotive = new window.LocomotiveScroll({
          lenisOptions: { lerp: 0.15, smoothWheel: true, syncTouch: false },
        });
      } catch (_) {
        /* Native scrolling remains available if enhancement fails. */
      }
    }
  }
  function closeMenu(focus = false) {
    const wasOpen = document.body.classList.contains("menu-active");
    if (wasOpen) {
      document.body.classList.remove("menu-active");
      document.documentElement.classList.remove("menu-open");
      main.inert = false;
      footer.inert = false;
      locomotive?.start();
    }
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    menu.inert = mobile.matches;
    if (focus && wasOpen) toggle.focus({ preventScroll: true });
  }
  toggle.addEventListener("click", () => {
    finishIntro();
    if (document.body.classList.contains("menu-active")) return closeMenu();
    menu.inert = false;
    main.inert = true;
    footer.inert = true;
    document.body.classList.add("menu-active");
    document.documentElement.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation");
    locomotive?.stop();
  });
  document.addEventListener("pointerdown", (event) => {
    finishIntro();
    if (
      document.body.classList.contains("menu-active") &&
      !header.contains(event.target)
    )
      closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    finishIntro();
    if (event.key === "Escape") closeMenu(true);
    if (event.key !== "Tab" || !document.body.classList.contains("menu-active"))
      return;
    const controls = [...header.querySelectorAll("a,button")];
    const first = controls[0],
      last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  function navigate(target, hash, moveFocus = false) {
    finishIntro();
    closeMenu();
    if (hash) history.pushState(null, "", hash);
    if (moveFocus) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
    if (locomotive) locomotive.scrollTo(target, { duration: 0.75 });
    else
      target.scrollIntoView({
        behavior: reduced.matches ? "instant" : "smooth",
      });
  }
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (
      !link ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      event.shiftKey
    )
      return;
    const hash = link.getAttribute("href");
    const target = document.getElementById(hash.slice(1));
    if (!target) return;
    event.preventDefault();
    navigate(
      target,
      hash,
      document.body.classList.contains("menu-active") ||
        link.classList.contains("skip-link"),
    );
  });
  addEventListener("popstate", () => {
    const target = document.getElementById(location.hash.slice(1) || "home");
    if (target) navigate(target);
  });
  addEventListener("wheel", finishIntro, { passive: true });
  addEventListener("touchstart", finishIntro, { passive: true });
  function loadBackground(image) {
    if (image.getAttribute("src")) return;
    image.srcset = image.dataset.srcset;
    image.src = image.dataset.src;
  }
  function showBackground() {
    backgrounds.forEach((image) => {
      image.classList.toggle(
        "is-active",
        image.dataset.project === selected &&
          image.complete &&
          image.naturalWidth > 0,
      );
    });
  }
  function selectProject(entry, announce = false) {
    selected = entry.dataset.project;
    entries.forEach((elem) => {
      const active = elem === entry;
      elem.classList.toggle("is-active", active);
      elem.querySelector("button").setAttribute("aria-pressed", String(active));
    });
    loadBackground(
      backgrounds.find((image) => image.dataset.project === selected),
    );
    showBackground();
    if (announce)
      document.querySelector("#preview-status").textContent =
        `${entry.querySelector(".project-name").textContent} project preview selected.`;
  }
  backgrounds.forEach((image) =>
    image.addEventListener("load", showBackground),
  );
  entries.forEach((entry) => {
    entry.addEventListener("pointerenter", () => {
      if (fine.matches) selectProject(entry);
    });
    const button = entry.querySelector("button");
    button.addEventListener("click", () => selectProject(entry, true));
    button.addEventListener("focus", () => selectProject(entry));
  });
  const preload = () => {
    if (!navigator.connection?.saveData) backgrounds.forEach(loadBackground);
  };
  if ("IntersectionObserver" in window) {
    const warmup = new IntersectionObserver(
      (items) => {
        if (items.some((item) => item.isIntersecting)) {
          preload();
          warmup.disconnect();
        }
      },
      { rootMargin: "0px" },
    );
    warmup.observe(featured);
    const activity = new IntersectionObserver((items) => {
      items.forEach((item) => {
        featured.classList.toggle("is-inview", item.isIntersecting);
      });
    });
    activity.observe(featured);
  } else {
    preload();
    featured.classList.add("is-inview");
  }
  document.addEventListener("visibilitychange", () => {
    document.body.classList.toggle("motion-paused", document.hidden);
    if (document.hidden) finishIntro();
  });
  mobile.addEventListener("change", () => closeMenu());
  reduced.addEventListener("change", () => {
    finishIntro();
    setupScrolling();
    closeMenu();
  });
  setupScrolling();
  closeMenu();
  startIntro();
  addEventListener("pageshow", (event) => {
    if (event.persisted) {
      finishIntro();
      closeMenu();
    }
  });
})();
