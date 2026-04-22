const WHATSAPP_NUMBER = "56941079792";
const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;

function applyWhatsAppLinks() {
  const waLinks = document.querySelectorAll("a.js-wa-link, a[href*='wa.me/']");
  waLinks.forEach((link) => {
    const isDirect = link.dataset.waDirect === "true";
    const message = link.dataset.waMessage;

    if (isDirect || !message) {
      link.href = WHATSAPP_BASE;
      return;
    }

    link.href = `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;
  });
}

const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = mainNav.contains(event.target);
    const clickedToggle = navToggle.contains(event.target);
    if (clickedInsideNav || clickedToggle || window.innerWidth > 920) return;

    mainNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    mainNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 920) {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });
}

const navLinks = document.querySelectorAll("#mainNav a[href^='#']");

if (navLinks.length && typeof IntersectionObserver !== "undefined") {
  const sections = [];

  navLinks.forEach((link) => {
    const sectionId = link.getAttribute("href");
    const section = sectionId ? document.querySelector(sectionId) : null;
    if (section) sections.push(section);
  });

  const activateNavLink = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        activateNavLink(entry.target.id);
      });
    },
    {
      threshold: 0.4,
      rootMargin: "-12% 0px -45% 0px",
    },
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  if (!question) return;

  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");

    faqItems.forEach((node) => {
      node.classList.remove("is-open");
      const btn = node.querySelector(".faq-question");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("is-open");
      question.setAttribute("aria-expanded", "true");
    }
  });
});

function weatherLabelFromCode(code) {
  const map = {
    0: "Ceu limpo",
    1: "Parcialmente nublado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Neblina",
    48: "Neblina",
    51: "Garoa",
    53: "Garoa",
    55: "Garoa intensa",
    61: "Chuva leve",
    63: "Chuva",
    65: "Chuva forte",
    71: "Neve leve",
    73: "Neve",
    75: "Neve forte",
    80: "Pancadas de chuva",
    81: "Pancadas de chuva",
    82: "Pancadas fortes",
  };

  return map[code] || "Tempo variavel";
}

async function updateHeroWidgets() {
  const exchangeRate = document.getElementById("exchangeRate");
  const weatherElement = document.getElementById("weather");

  if (!exchangeRate && !weatherElement) return;

  const [rateRes, weatherRes] = await Promise.allSettled([
    fetch("https://api.exchangerate-api.com/v4/latest/BRL"),
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-33.45&longitude=-70.66&current_weather=true",
    ),
  ]);

  if (exchangeRate && rateRes.status === "fulfilled") {
    try {
      const data = await rateRes.value.json();
      const rate = data && data.rates ? data.rates.CLP : null;
      if (typeof rate === "number") {
        exchangeRate.textContent = `1 BRL = ${rate.toFixed(0)} CLP`;
      }
    } catch (_error) {
      // Keep fallback value defined in HTML.
    }
  }

  if (weatherElement && weatherRes.status === "fulfilled") {
    try {
      const data = await weatherRes.value.json();
      const weather = data ? data.current_weather : null;
      if (weather && typeof weather.temperature === "number") {
        const condition = weatherLabelFromCode(weather.weathercode);
        weatherElement.textContent = `Santiago ${Math.round(weather.temperature)} C / ${condition}`;
      }
    } catch (_error) {
      // Keep fallback value defined in HTML.
    }
  }
}

function startCountdown(hours) {
  const countdownElements = document.querySelectorAll(".js-countdown");
  if (!countdownElements.length) return;

  const key = "descola_offer_deadline";
  const now = Date.now();
  const defaultDeadline = now + hours * 60 * 60 * 1000;
  const stored = Number(localStorage.getItem(key));
  const deadline = stored && stored > now ? stored : defaultDeadline;

  if (!stored || stored <= now) {
    localStorage.setItem(key, String(deadline));
  }

  const render = () => {
    const diff = deadline - Date.now();
    if (diff <= 0) {
      countdownElements.forEach((el) => {
        el.textContent = "00h 00m 00s restantes";
      });
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const h = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(totalSeconds % 60)
      .toString()
      .padStart(2, "0");

    countdownElements.forEach((el) => {
      el.textContent = `${h}h ${m}m ${s}s restantes`;
    });
  };

  render();
  setInterval(render, 1000);
}

function generateAvatar(initials, seed) {
  const colors = ["#2D6A4F", "#1B4332", "#40916C", "#52B788", "#74C69D"];
  const color = colors[seed % colors.length];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><circle cx='32' cy='32' r='32' fill='${color}'/><text x='50%' y='52%' text-anchor='middle' dominant-baseline='middle' fill='white' font-family='Arial, sans-serif' font-size='22' font-weight='700'>${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function mountTestimonialAvatars() {
  const avatars = document.querySelectorAll("[data-avatar-initials]");
  avatars.forEach((node) => {
    const initials = node.getAttribute("data-avatar-initials") || "DC";
    const seed = Number(node.getAttribute("data-avatar-seed") || "0");
    const image = document.createElement("img");
    image.src = generateAvatar(initials, seed);
    image.alt = `Avatar de ${initials}`;
    image.className = "avatar-svg";
    node.replaceWith(image);
  });
}

const captureForm = document.querySelector(".capture-form");

if (captureForm) {
  captureForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const endpoint = captureForm.getAttribute("action");
    const button = captureForm.querySelector("button[type='submit']");
    const status = captureForm.querySelector(".form-status");
    const email = captureForm.querySelector("#email");
    if (!button || !endpoint || !email) return;

    const emailValue = String(email.value || "").trim();
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
    if (!emailIsValid) {
      status.textContent = "Digite um e-mail valido antes de enviar.";
      status.classList.add("is-error");
      status.classList.remove("is-success");
      return;
    }

    button.textContent = "Enviando...";
    button.disabled = true;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(captureForm),
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Falha no envio");

      captureForm.reset();
      status.textContent = "Perfeito! Seu mapa foi enviado com sucesso.";
      status.classList.add("is-success");
      status.classList.remove("is-error");
      button.textContent = "Mapa enviado!";
    } catch (_error) {
      status.textContent =
        "Nao foi possivel enviar agora. Tente novamente em instantes.";
      status.classList.add("is-error");
      status.classList.remove("is-success");
      button.textContent = "Tente novamente";
    } finally {
      setTimeout(() => {
        button.textContent = "Quero receber o mapa";
        button.disabled = false;
      }, 1800);
    }
  });
}

const revealItems = document.querySelectorAll(".reveal");

if (revealItems.length) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    revealItems.forEach((item) => {
      revealObserver.observe(item);
    });
  }
}

applyWhatsAppLinks();
mountTestimonialAvatars();
startCountdown(72);
updateHeroWidgets();
