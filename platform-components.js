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
    return `
      <article class="dc-card coupon-card">
        <div class="coupon-media" style="background-image:url('${escapeHtml(coupon.image)}')"></div>
        <div class="coupon-body">
          <span class="dc-badge">${escapeHtml(coupon.category)}</span>
          <h3>${escapeHtml(coupon.name)}</h3>
          <p class="coupon-partner">${escapeHtml(coupon.partner)}</p>
          <p class="coupon-discount">${escapeHtml(coupon.discount)}</p>
          <a class="dc-btn dc-btn-primary" href="/cupom/${encodeURIComponent(coupon.id)}">Ver detalhes</a>
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

  function PartnerCard(partner) {
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
      </div>
    `;
  }

  window.DescolaComponents = {
    CouponCard,
    CouponCardLocked,
    PricingCard,
    PartnerCard,
    DashboardMetricCard,
    AdminTable,
    QRDisplay,
    CheckoutForm,
    FilterBar,
  };
})();
