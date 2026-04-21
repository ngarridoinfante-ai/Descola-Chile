var navToggle = document.getElementById("navToggle");
var mainNav = document.getElementById("mainNav");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", function () {
    var isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  document.addEventListener("click", function (event) {
    var clickedInsideNav = mainNav.contains(event.target);
    var clickedToggle = navToggle.contains(event.target);
    if (clickedInsideNav || clickedToggle || window.innerWidth > 920) return;

    mainNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    mainNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });

  mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 920) {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });
}

var navLinks = document.querySelectorAll("#mainNav a[href^='#']");

if (navLinks.length && typeof IntersectionObserver !== "undefined") {
  var sections = [];

  navLinks.forEach(function (link) {
    var sectionId = link.getAttribute("href");
    var section = sectionId ? document.querySelector(sectionId) : null;
    if (section) sections.push(section);
  });

  var activateNavLink = function (id) {
    navLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", isActive);
    });
  };

  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        activateNavLink(entry.target.id);
      });
    },
    {
      threshold: 0.4,
      rootMargin: "-12% 0px -45% 0px",
    },
  );

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });
}

var faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(function (item) {
  var question = item.querySelector(".faq-question");
  if (!question) return;

  question.addEventListener("click", function () {
    var isOpen = item.classList.contains("is-open");

    faqItems.forEach(function (node) {
      node.classList.remove("is-open");
      var btn = node.querySelector(".faq-question");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("is-open");
      question.setAttribute("aria-expanded", "true");
    }
  });
});

var captureForm = document.querySelector(".capture-form");

if (captureForm) {
  captureForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var endpoint = captureForm.getAttribute("action");
    var method = (captureForm.getAttribute("method") || "post").toUpperCase();
    var button = captureForm.querySelector("button[type='submit']");
    if (!button || !endpoint) return;

    var defaultLabel = "Quero receber o mapa";
    var formData = new FormData(captureForm);

    button.textContent = "Enviando...";
    button.disabled = true;

    fetch(endpoint, {
      method: method,
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then(function (response) {
        if (!response.ok) throw new Error("Falha no envio");
        button.textContent = "Mapa enviado!";
        captureForm.reset();
      })
      .catch(function () {
        button.textContent = "Tente novamente";
      })
      .finally(function () {
        setTimeout(function () {
          button.textContent = defaultLabel;
          button.disabled = false;
        }, 2400);
      });
  });
}

var exchangeRate = document.getElementById("exchangeRate");

if (exchangeRate) {
  fetch("https://api.exchangerate-api.com/v4/latest/BRL")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (!data || !data.rates || typeof data.rates.CLP !== "number") return;
      exchangeRate.textContent =
        "1 BRL = " + data.rates.CLP.toFixed(0) + " CLP";
    })
    .catch(function () {
      // Keep static fallback value when API is unavailable.
    });
}

var weatherElement = document.getElementById("weather");
var weatherOptions = [
  "Santiago 21 C / Ensolarado",
  "Santiago 18 C / Parcialmente nublado",
  "Santiago 20 C / Ceu limpo",
  "Santiago 17 C / Vento leve",
];
var weatherIndex = 0;

if (weatherElement) {
  setInterval(function () {
    weatherIndex = (weatherIndex + 1) % weatherOptions.length;
    weatherElement.textContent = weatherOptions[weatherIndex];
  }, 8000);
}

var revealItems = document.querySelectorAll(".reveal");

if (revealItems.length) {
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
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

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  }
}
