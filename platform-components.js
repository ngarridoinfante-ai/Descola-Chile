(function () {
  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function CouponCard(coupon) {
    const rating = Number(coupon.rating || 0).toFixed(1);
    const reviews = Number(coupon.reviewsCount || 0);
    const badge = coupon.badge || "Parceiro Descola";

    return `
      <article class="dc-card coupon-card">
        <div class="coupon-media" style="background-image:url('${escapeHtml(coupon.image)}')">
          <span class="coupon-badge-top">${escapeHtml(badge)}</span>
        </div>
        <div class="coupon-body">
          <span class="dc-badge">${escapeHtml(coupon.category)}</span>
          <h3>${escapeHtml(coupon.name)}</h3>
          <p class="coupon-partner">${escapeHtml(coupon.partner)} | ${escapeHtml(coupon.district || "Santiago")}</p>
          <p class="coupon-discount">${escapeHtml(coupon.discount)}</p>
          <p class="coupon-short">${escapeHtml(coupon.shortText || "Economize com parceiro verificado da Descola.")}</p>
          <p class="coupon-rating">⭐ ${rating} (${reviews} avaliacoes)</p>
          <p class="coupon-price-note">${escapeHtml(coupon.priceNote || "Beneficio exclusivo para comunidade Descola")}</p>
          <div class="coupon-tags-row">
            ${(coupon.tags || [])
              .slice(0, 3)
              .map(
                (tag) =>
                  `<span class="coupon-tag-chip">${escapeHtml(tag)}</span>`,
              )
              .join("")}
          </div>
          <a class="dc-btn dc-btn-primary" href="/cupom/${encodeURIComponent(coupon.id)}">Ver desconto</a>
        </div>
      </article>
    `;
  }

  function PricingCard(plan) {
    const priceLabel =
      plan.currency === "BRL" ? `R$ ${plan.price}` : `${plan.price}`;

    return `
      <article class="dc-card pricing-card${plan.highlight ? " pricing-card-highlight" : ""}">
        ${plan.badge ? `<span class="pricing-badge">${escapeHtml(plan.badge)}</span>` : ""}
        <p class="pricing-name">${escapeHtml(plan.name)}</p>
        <p class="pricing-desc">${escapeHtml(plan.desc)}</p>
        <div class="pricing-price">
          <span class="pricing-currency">R$</span>
          <span class="pricing-amount">${plan.price}</span>
        </div>
        <ul class="pricing-features">
          ${plan.features.map((f) => `<li>✓ ${escapeHtml(f)}</li>`).join("")}
        </ul>
        <a class="dc-btn ${plan.highlight ? "dc-btn-primary" : "dc-btn-secondary"} pricing-btn"
           href="/checkout?plano=${encodeURIComponent(plan.id)}">
          Escolher ${escapeHtml(plan.name)}
        </a>
      </article>
    `;
  }

  function CouponCardLocked(coupon) {
    return `
      <article class="dc-card coupon-card coupon-card-locked">
        <div class="coupon-media coupon-media-blurred" style="background-image:url('${escapeHtml(coupon.image)}')"></div>
        <div class="coupon-body">
          <span class="dc-badge">${escapeHtml(coupon.category)}</span>
          <h3>${escapeHtml(coupon.name)}</h3>
          <p class="coupon-partner">${escapeHtml(coupon.partner)}</p>
          <p class="coupon-discount coupon-discount-locked">${escapeHtml(coupon.discount)}</p>
          <div class="coupon-lock-overlay">
            <span class="coupon-lock-icon">🔒</span>
            <span>Desbloqueie comprando acesso</span>
          </div>
        </div>
      </article>
    `;
  }

  function AdminPartnerCard(partner) {
    return `
      <article class="dc-card partner-card">
        <span class="dc-badge">${escapeHtml(partner.category)}</span>
        <h3>${escapeHtml(partner.company)}</h3>
        <p>Contato: ${escapeHtml(partner.contact)}</p>
        <p>Comissao: ${escapeHtml(partner.commission)}</p>
        <p>Cupons usados: ${escapeHtml(partner.usedCoupons)}</p>
      </article>
    `;
  }

  function AppShell(config) {
    return `
      <section class="mc-app-shell">
        ${config && config.content ? config.content : ""}
      </section>
    `;
  }

  function HeroDashboard(config) {
    const user = (config && config.user) || {};
    const trip = (config && config.trip) || {};
    const nextSteps = (config && config.nextSteps) || [];

    return `
      <article class="dc-card mc-hero-dashboard">
        <div class="mc-hero-copy">
          <p class="dc-kicker">Meu Chile</p>
          <h1>Oi, ${escapeHtml(user.firstName || "viajante")} 👋</h1>
          <p class="mc-hero-subtitle">Sua viagem esta organizada e a Dicas da Pri esta cuidando de voce.</p>
          <div class="mc-trip-status">
            <span class="mc-status-chip">${escapeHtml(trip.currentDayLabel || "Dia da viagem")}</span>
            <span class="mc-status-chip mc-status-chip-soft">${escapeHtml(trip.dateRange || "Datas da viagem")}</span>
          </div>
        </div>
        <div class="mc-next-steps">
          <h2>Proximos passos</h2>
          <ul>
            ${nextSteps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
          </ul>
        </div>
      </article>
    `;
  }

  function SmartAlertCard(alert) {
    return `
      <article class="dc-card mc-alert-card mc-alert-${escapeHtml(alert.level || "low")}">
        <div class="mc-alert-head">
          <span class="mc-alert-icon" aria-hidden="true">${escapeHtml(alert.icon || "info")}</span>
          <p>${escapeHtml(alert.title || "Alerta")}</p>
        </div>
        <p class="mc-alert-message">${escapeHtml(alert.message || "")}</p>
      </article>
    `;
  }

  function TimelineItem(item) {
    return `
      <article class="dc-card mc-timeline-item">
        <div class="mc-timeline-head">
          <h4>${escapeHtml(item.name || "Item do roteiro")}</h4>
          <span>${escapeHtml(item.suggestedTime || "--:--")}</span>
        </div>
        <p class="mc-timeline-meta">${escapeHtml(item.distance || "")}${item.eta ? ` • ${escapeHtml(item.eta)}` : ""}</p>
        <p class="mc-timeline-tip">${escapeHtml(item.humanTip || "")}</p>
        <div class="mc-timeline-foot">
          <a class="dc-btn dc-btn-secondary" href="${escapeHtml(item.ctaUrl || "#")}">${escapeHtml(item.ctaLabel || "Abrir")}</a>
          <span class="mc-discount-pill">${escapeHtml(item.discount || "Sem desconto")}</span>
        </div>
      </article>
    `;
  }

  function TimelineDay(day) {
    const periodMap = {
      manha: "Manha",
      almoco: "Almoco",
      tarde: "Tarde",
      noite: "Noite",
    };
    return `
      <section class="mc-timeline-day">
        <header class="mc-timeline-day-head">
          <h3>${escapeHtml(day.dayLabel || "Dia")}</h3>
          <span>${escapeHtml(day.date || "")}</span>
        </header>
        ${(day.blocks || [])
          .map(
            (block) => `
                <div class="mc-period-block">
                  <p class="mc-period-title">${escapeHtml(periodMap[block.period] || block.period || "Periodo")}</p>
                  <div class="mc-period-items">
                    ${(block.items || []).map((item) => TimelineItem(item)).join("")}
                  </div>
                </div>
              `,
          )
          .join("")}
      </section>
    `;
  }

  function BenefitCard(benefit) {
    return `
      <article class="dc-card mc-benefit-card">
        <p class="mc-benefit-category">${escapeHtml(benefit.category || "beneficio")}</p>
        <h4>${escapeHtml(benefit.title || "Beneficio")}</h4>
        <p>${escapeHtml(benefit.benefit || "")}</p>
        <div class="mc-benefit-foot">
          <span class="mc-status-pill mc-status-${escapeHtml(benefit.status || "ativo")}">${escapeHtml(benefit.status || "ativo")}</span>
          <a class="dc-btn dc-btn-primary" href="/meus-descontos">${escapeHtml(benefit.ctaLabel || "usar beneficio")}</a>
        </div>
      </article>
    `;
  }

  function MoodSelector(config) {
    const moods = (config && config.moods) || [];
    const selectedMood = (config && config.selectedMood) || "";

    return `
      <section class="dc-card mc-mood-selector">
        <h3>Me surpreenda hoje</h3>
        <p>Escolha o mood do dia para montar um plano rapido.</p>
        <div class="mc-mood-grid" role="group" aria-label="Selecao de mood">
          ${moods
            .map(
              (mood) =>
                `<button class="dc-btn dc-btn-ghost mc-mood-btn ${selectedMood === mood ? "mc-mood-btn-active" : ""}" type="button" data-mood="${escapeHtml(mood)}">${escapeHtml(mood)}</button>`,
            )
            .join("")}
        </div>
        <button id="surpriseTodayBtn" class="dc-btn dc-btn-primary mc-surprise-btn" type="button">Me surpreenda hoje</button>
      </section>
    `;
  }

  function SurpriseCard(config) {
    const plan =
      (config && config.plan) || "Seu plano surpresa vai aparecer aqui.";
    return `
      <article class="dc-card mc-surprise-card" id="surpriseCard">
        <p class="dc-kicker">Plano do dia</p>
        <h3>${escapeHtml(plan)}</h3>
      </article>
    `;
  }

  function DicasPriBlock(config) {
    const text = (config && config.text) || "Essa dica e bem Dicas da Pri.";
    return `
      <article class="dc-card mc-pri-block">
        <p class="dc-kicker">Dicas da Pri</p>
        <p>${escapeHtml(text)}</p>
      </article>
    `;
  }

  function PartnerCard(partner) {
    return `
      <article class="dc-card mc-partner-card">
        <p class="mc-benefit-category">${escapeHtml(partner.category || "parceiro")}</p>
        <h4>${escapeHtml(partner.company || "Parceiro Descola")}</h4>
        <p>${escapeHtml(partner.benefit || "Beneficio especial para comunidade Descola")}</p>
        <div class="mc-partner-foot">
          <span>${escapeHtml(partner.district || "Santiago")}</span>
          <span class="mc-status-pill mc-status-${escapeHtml(partner.status || "ativo")}">${escapeHtml(partner.status || "ativo")}</span>
        </div>
      </article>
    `;
  }

  function DashboardMetricCard(metric) {
    return `
      <article class="dc-card metric-card">
        <p class="metric-label">${escapeHtml(metric.label)}</p>
        <p class="metric-value">${escapeHtml(metric.value)}</p>
      </article>
    `;
  }

  function AdminTable(config) {
    const columns = config.columns || [];
    const rows = config.rows || [];
    const actions = config.actions || [];

    const header = columns
      .map((column) => `<th>${escapeHtml(column.label)}</th>`)
      .join("");

    const body = rows
      .map((row) => {
        const cells = columns
          .map((column) => `<td>${escapeHtml(row[column.key])}</td>`)
          .join("");

        const rowActions = actions
          .map(
            (action) =>
              `<button class="dc-btn dc-btn-ghost" data-action="${escapeHtml(action.id)}" data-row="${escapeHtml(
                row.id || row.uniqueCode || "",
              )}">${escapeHtml(action.label)}</button>`,
          )
          .join(" ");

        return `<tr>${cells}<td class="table-actions">${rowActions}</td></tr>`;
      })
      .join("");

    return `
      <div class="dc-table-wrap">
        <table class="dc-table">
          <thead><tr>${header}<th>Acciones</th></tr></thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    `;
  }

  function QRDisplay(config) {
    const code = config.code || "DESCOLA";
    const size = config.size || 300;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(code)}`;

    return `
      <div class="qr-display">
        <img src="${qrUrl}" alt="QR do cupom" width="${size}" height="${size}" loading="lazy" />
        <p class="qr-code">${escapeHtml(code)}</p>
      </div>
    `;
  }

  function CheckoutForm(config) {
    const product = config.product;
    const priceLabel = config.priceLabel;

    return `
      <form id="checkoutForm" class="dc-card checkout-form" novalidate>
        <div class="form-row">
          <label>Nome completo</label>
          <input name="name" required placeholder="Seu nome" />
        </div>
        <div class="form-row">
          <label>Email</label>
          <input name="email" type="email" required placeholder="voce@email.com" />
        </div>
        <div class="form-row">
          <label>WhatsApp</label>
          <input name="whatsapp" required placeholder="+55 11 99999-0000" />
        </div>
        <div class="form-grid">
          <div class="form-row">
            <label>Data de chegada</label>
            <input name="arrival" type="date" required />
          </div>
          <div class="form-row">
            <label>Data de saida</label>
            <input name="departure" type="date" required />
          </div>
        </div>
        <div class="form-row">
          <label>Produto comprado</label>
          <input name="productName" value="${escapeHtml(product.name)}" readonly />
          <input type="hidden" name="productId" value="${escapeHtml(product.id)}" />
        </div>
        <div class="form-row">
          <label>Preco</label>
          <input name="price" value="${escapeHtml(String(product.price))}" readonly />
          <p class="form-helper">Total a pagar: ${escapeHtml(priceLabel)}</p>
        </div>
        <button class="dc-btn dc-btn-primary" type="submit">Finalizar compra</button>
      </form>
    `;
  }

  function FilterBar(config) {
    const categories = config.categories || [];
    const selected = config.selected || "Todos";
    const chips = config.chips || [];

    return `
      <div class="filter-bar dc-card">
        <input id="couponSearch" type="search" placeholder="${escapeHtml(config.searchPlaceholder || "Buscar desconto")}" />
        <select id="couponCategory">
          <option ${selected === "Todos" ? "selected" : ""}>Todos</option>
          ${categories
            .map(
              (category) =>
                `<option ${selected === category ? "selected" : ""}>${escapeHtml(category)}</option>`,
            )
            .join("")}
        </select>
        <div id="couponChips" class="coupon-chips" role="group" aria-label="Filtros rapidos">
          ${chips
            .map(
              (chip) =>
                `<button class="dc-btn dc-btn-ghost chip-btn" type="button" data-chip="${escapeHtml(chip)}">${escapeHtml(chip)}</button>`,
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function UserCouponCard(item) {
    const statusLabel =
      item.accessStatus === "used"
        ? "Usado"
        : item.accessStatus === "active"
          ? "Ativo"
          : "Disponivel";

    const statusClass =
      item.accessStatus === "used"
        ? "status-used"
        : item.accessStatus === "active"
          ? "status-active"
          : "status-available";

    return `
      <article class="dc-card user-coupon-card">
        <div class="user-coupon-head">
          <p class="user-coupon-name">${escapeHtml(item.name)}</p>
          <span class="user-coupon-status ${statusClass}">${statusLabel}</span>
        </div>
        <p class="coupon-partner">${escapeHtml(item.partner)} | ${escapeHtml(item.district || "Santiago")}</p>
        <p class="coupon-discount">${escapeHtml(item.discount)}</p>
        <p class="user-coupon-expiry">Expira em: ${escapeHtml(item.activation && item.activation.expiresAt ? item.activation.expiresAt : item.validUntil)}</p>
        <div class="button-row">
          <a class="dc-btn dc-btn-secondary" href="/cupom/${encodeURIComponent(item.id)}">Detalhes</a>
          <a class="dc-btn dc-btn-primary" href="/apresentar-cupom?id=${encodeURIComponent(item.id)}">Abrir QR</a>
        </div>
      </article>
    `;
  }

  window.DescolaComponents = {
    AppShell,
    HeroDashboard,
    SmartAlertCard,
    TimelineDay,
    TimelineItem,
    BenefitCard,
    MoodSelector,
    SurpriseCard,
    DicasPriBlock,
    CouponCard,
    CouponCardLocked,
    PricingCard,
    PartnerCard,
    AdminPartnerCard,
    DashboardMetricCard,
    AdminTable,
    QRDisplay,
    CheckoutForm,
    FilterBar,
    UserCouponCard,
  };
})();
