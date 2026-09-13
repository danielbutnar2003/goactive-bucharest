/* GoActive Bucharest — site scripts */
(() => {
  "use strict";

  /* ------------------------------------------------------------------
     EDIT THESE
     ------------------------------------------------------------------ */
  const CONFIG = {
    email: "daniel.butnar@gmail.com",
    // Paste the full links to your pages here, e.g. "https://www.instagram.com/your.handle"
    instagram: "https://www.instagram.com/goactivebucharest",
    // Both forms are delivered to your inbox through FormSubmit (formsubmit.co), no account needed.
    // The very first submission sends an activation email to the address below — click the link once.
    formEndpoint: "https://formsubmit.co/ajax/daniel.butnar@gmail.com",
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;

  /* ---------- Header state ---------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".mobile-menu");
  const setMenu = (open) => {
    body.classList.toggle("menu-open", open);
    if (burger) {
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    if (menu) menu.inert = !open;
  };
  if (menu) menu.inert = true;
  burger?.addEventListener("click", () => setMenu(!body.classList.contains("menu-open")));
  menu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  window.addEventListener("resize", () => { if (window.innerWidth > 1000) setMenu(false); });

  /* ---------- Team dropdown ---------- */
  const drops = document.querySelectorAll(".nav__drop");
  const closeDrops = () => drops.forEach((d) => {
    d.classList.remove("is-open");
    d.querySelector("button")?.setAttribute("aria-expanded", "false");
  });
  drops.forEach((d) => {
    const btn = d.querySelector("button");
    btn?.addEventListener("click", () => {
      const open = !d.classList.contains("is-open");
      closeDrops();
      d.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });
  document.addEventListener("click", (e) => { if (!e.target.closest(".nav__drop")) closeDrops(); });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { setMenu(false); closeDrops(); }
  });

  /* ---------- Load + reveal ---------- */
  requestAnimationFrame(() => requestAnimationFrame(() => body.classList.add("is-loaded")));

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Count-up numbers ---------- */
  const counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const decimals = Number(el.dataset.decimals || 0);
      const start = performance.now();
      const duration = 1700;
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        el.textContent = (target * (1 - Math.pow(1 - p, 4))).toFixed(decimals);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { run(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => {
      el.textContent = (0).toFixed(Number(el.dataset.decimals || 0));
      cio.observe(el);
    });
  }

  /* ---------- Social links ---------- */
  document.querySelectorAll("[data-social]").forEach((a) => {
    const url = CONFIG[a.dataset.social];
    if (url) {
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
    } else {
      a.classList.add("is-pending");
      a.title = "Link coming soon";
      a.addEventListener("click", (e) => e.preventDefault());
    }
  });

  /* ---------- Misc ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const label = btn.querySelector(".btn__label") || btn;
      const original = label.textContent;
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        label.textContent = "Copied";
      } catch {
        window.location.href = `mailto:${btn.dataset.copy}`;
      }
      setTimeout(() => { label.textContent = original; }, 1800);
    });
  });

  document.querySelectorAll("textarea[maxlength]").forEach((ta) => {
    const counter = document.querySelector(`[data-counter-for="${ta.id}"]`);
    if (!counter) return;
    const update = () => { counter.textContent = `${ta.value.length} / ${ta.maxLength}`; };
    ta.addEventListener("input", update);
    update();
  });

  /* ---------- Optional team photos (no inline handlers, CSP-safe) ---------- */
  document.querySelectorAll("img[data-optional-photo]").forEach((img) => {
    const show = () => img.classList.add("is-loaded");
    const drop = () => img.remove();
    if (img.complete) {
      if (img.naturalWidth > 0) show(); else drop();
    } else {
      img.addEventListener("load", show, { once: true });
      img.addEventListener("error", drop, { once: true });
    }
  });

  /* ---------- Pause animations (WCAG 2.2.2) ---------- */
  document.querySelectorAll("[data-motion-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const paused = document.documentElement.classList.toggle("motion-paused");
      document.querySelectorAll("[data-motion-toggle]").forEach((b) => {
        b.setAttribute("aria-pressed", String(paused));
        b.textContent = paused ? "Play animations" : "Pause animations";
      });
    });
  });

  /* ---------- Forms ---------- */
  document.querySelectorAll("form[data-form]").forEach((form) => {
    const wrap = form.closest(".form-wrap");
    const success = wrap?.querySelector(".success");
    const status = form.querySelector(".form-status");
    const submit = form.querySelector('[type="submit"]');
    const submitLabel = submit?.querySelector(".btn__label");
    const groups = form.querySelectorAll("[data-required-group]");

    const checkGroups = () => {
      let firstInvalid = null;
      groups.forEach((g) => {
        const ok = !!g.querySelector("input:checked");
        g.classList.toggle("is-invalid", !ok);
        if (!ok && !firstInvalid) firstInvalid = g;
      });
      return firstInvalid;
    };
    groups.forEach((g) => g.addEventListener("change", () => {
      if (g.classList.contains("is-invalid")) checkGroups();
    }));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.className = "form-status";
      status.textContent = "";

      const invalidGroup = checkGroups();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (invalidGroup) {
        invalidGroup.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        invalidGroup.querySelector("input")?.focus({ preventScroll: true });
        return;
      }

      const fd = new FormData(form);
      if (fd.get("_honey")) return;

      const data = {};
      for (const [key, value] of fd.entries()) {
        if (key === "_honey") continue;
        const v = String(value).trim();
        if (!v) continue;
        data[key] = data[key] ? `${data[key]}, ${v}` : v;
      }
      data._subject = form.dataset.subject || "New message — GoActive Bucharest";
      data._template = "table";
      data._captcha = "false";
      if (data.Email) data._replyto = data.Email;

      const originalLabel = submitLabel ? submitLabel.textContent : "";
      submit.disabled = true;
      if (submitLabel) submitLabel.textContent = "Sending…";

      try {
        const res = await fetch(CONFIG.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || String(json.success) !== "true") throw new Error(json.message || `HTTP ${res.status}`);

        form.reset();
        form.querySelectorAll("textarea[maxlength]").forEach((ta) => ta.dispatchEvent(new Event("input")));
        if (success) {
          form.hidden = true;
          success.hidden = false;
          success.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
          success.focus({ preventScroll: true });
        }
      } catch (err) {
        const text = Object.entries(data)
          .filter(([k]) => !k.startsWith("_"))
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n");
        const mailto = `mailto:${CONFIG.email}?subject=${encodeURIComponent(data._subject)}&body=${encodeURIComponent(text.slice(0, 1800))}`;
        status.className = "form-status form-status--err is-visible";
        status.textContent = "We couldn’t send this automatically. ";
        const link = document.createElement("a");
        link.href = mailto;
        link.textContent = "Send it by email instead";
        status.append(link, " — your answers will be filled in for you.");
      } finally {
        submit.disabled = false;
        if (submitLabel) submitLabel.textContent = originalLabel;
      }
    });

    wrap?.querySelector("[data-reset-form]")?.addEventListener("click", () => {
      success.hidden = true;
      form.hidden = false;
      form.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });
})();
