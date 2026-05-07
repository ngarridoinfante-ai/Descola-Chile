(function () {
  const cfg = window.DescolaAnalyticsConfig || {};
  const ATTR_KEY = cfg.attributionSessionKey || "descola_attribution";

  window.dataLayer = window.dataLayer || [];

  function parseAttribution() {
    const params = new URLSearchParams(window.location.search);
    const current = {
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_content: params.get("utm_content") || "",
      utm_term: params.get("utm_term") || "",
      referrer: document.referrer || "direct",
      first_seen_at: new Date().toISOString(),
    };

    try {
      const existingRaw = sessionStorage.getItem(ATTR_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : null;

      const hasUtm = Boolean(
        current.utm_source ||
        current.utm_medium ||
        current.utm_campaign ||
        current.utm_content ||
        current.utm_term,
      );

      if (hasUtm || !existing) {
        const next = {
          ...existing,
          ...current,
          first_seen_at:
            existing && existing.first_seen_at
              ? existing.first_seen_at
              : current.first_seen_at,
          last_seen_at: new Date().toISOString(),
        };
        sessionStorage.setItem(ATTR_KEY, JSON.stringify(next));
        return next;
      }

      const merged = {
        ...existing,
        last_seen_at: new Date().toISOString(),
      };
      sessionStorage.setItem(ATTR_KEY, JSON.stringify(merged));
      return merged;
    } catch (_error) {
      return current;
    }
  }

  function getAttribution() {
    try {
      const raw = sessionStorage.getItem(ATTR_KEY);
      return raw ? JSON.parse(raw) : parseAttribution();
    } catch (_error) {
      return parseAttribution();
    }
  }

  function gtag() {
    window.dataLayer.push(arguments);
  }

  function setupGA() {
    if (!cfg.enabled || !cfg.measurementId) return;

    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(cfg.measurementId)}`;
    document.head.appendChild(gaScript);

    window.gtag = window.gtag || gtag;
    window.gtag("js", new Date());
    window.gtag("config", cfg.measurementId, {
      send_page_view: true,
    });
  }

  function track(eventName, params) {
    const payload = {
      event: eventName,
      page_path: window.location.pathname,
      page_title: document.title,
      timestamp: new Date().toISOString(),
      ...getAttribution(),
      ...(params || {}),
    };

    window.dataLayer.push(payload);

    if (typeof window.gtag === "function" && cfg.enabled && cfg.measurementId) {
      window.gtag("event", eventName, payload);
    }

    if (cfg.debug) {
      console.info("[DescolaAnalytics]", eventName, payload);
    }
  }

  function bindTrackedClicks() {
    document.addEventListener("click", (event) => {
      const target = event.target.closest("[data-track-event]");
      if (!target) return;

      track(target.dataset.trackEvent, {
        cta_label:
          target.dataset.trackLabel || target.textContent.trim().slice(0, 80),
        cta_location: target.dataset.trackLocation || "unknown",
      });
    });
  }

  function boot() {
    parseAttribution();
    setupGA();
    bindTrackedClicks();
    track("dc_page_view", {
      page_type: document.body
        ? document.body.className || "default"
        : "default",
    });
  }

  window.DescolaAnalytics = {
    track,
    getAttribution,
  };

  boot();
})();
