(function () {
  const data = window.DescolaData;
  const components = window.DescolaComponents;

  function parseCouponId() {
    const fromPath = window.location.pathname.match(/\/cupom\/([^/]+)/);
    if (fromPath && fromPath[1]) {
      return decodeURIComponent(fromPath[1]);
    }

    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  function mountCheckout() {
    const root = document.getElementById("checkoutApp");
    if (!root) return;

    root.innerHTML = components.CheckoutForm({
      product: data.defaultProduct,
      priceLabel: data.formatMoney(data.defaultProduct.price),
    });

    const form = document.getElementById("checkoutForm");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const payload = {
        name: String(formData.get("name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        whatsapp: String(formData.get("whatsapp") || "").trim(),
        arrival: String(formData.get("arrival") || "").trim(),
        departure: String(formData.get("departure") || "").trim(),
        productId: String(formData.get("productId") || "").trim(),
        productName: String(formData.get("productName") || "").trim(),
        price: Number(formData.get("price") || 0),
      };

      if (
        !payload.name ||
        !payload.email ||
        !payload.whatsapp ||
        !payload.arrival ||
        !payload.departure
      ) {
        alert("Preencha todos os campos obrigatorios.");
        return;
      }

      data.savePurchase(payload);
      window.location.href = "/success";
    });
  }

  function mountSuccess() {
    const root = document.getElementById("successApp");
    if (!root) return;

    const purchase = data.getPurchase();
    if (!purchase) {
      root.innerHTML = `
        <div class="dc-card empty-state">
          <h2>Nenhuma compra encontrada</h2>
          <p>Finalize o checkout para liberar seu acesso aos descontos.</p>
          <a class="dc-btn dc-btn-primary" href="/checkout">Ir para checkout</a>
        </div>
      `;
      return;
    }

    const waText = encodeURIComponent(
      `Oi! Acabei de comprar meu acesso na Descola Chile. Meu codigo: ${purchase.code}`,
    );

    root.innerHTML = `
      <article class="dc-card success-card">
        <p class="dc-kicker">Compra confirmada</p>
        <h1>Seu acesso esta ativo</h1>
        <p>Codigo unico do cliente:</p>
        <p class="unique-code">${purchase.code}</p>
        <div class="button-row">
          <a class="dc-btn dc-btn-primary" href="/meus-descontos">Ver descontos</a>
          <a class="dc-btn dc-btn-secondary" href="https://wa.me/56941079792?text=${waText}" target="_blank" rel="noopener noreferrer">Receber por WhatsApp</a>
        </div>
      </article>
    `;
  }

  async function mountDiscounts() {
    const root = document.getElementById("discountsApp");
    if (!root) return;

    const purchase = data.getPurchase();
    const list = await data.DataProvider.getCoupons();
    const categories = Array.from(new Set(list.map((item) => item.category)));

    // Usuario sem compra: mostra muro com preview
    if (!purchase) {
      const preview = list.slice(0, 3);
      const remaining = list.length - preview.length;

      root.innerHTML = `
        <section class="paywall-wrap">
          <div class="paywall-preview">
            ${preview.map((coupon) => components.CouponCardLocked(coupon)).join("")}
            ${remaining > 0 ? `<div class="dc-card coupon-card-more"><span class="coupon-more-count">+${remaining}</span><p>cupons disponíveis</p></div>` : ""}
          </div>
          <div class="paywall-cta dc-card">
            <p class="dc-kicker">Acesso exclusivo</p>
            <h2>Desbloqueie todos os descontos</h2>
            <p class="paywall-desc">Pague uma vez e use todos os cupons durante sua viagem ao Chile. Restaurantes, neve, vinícolas, eSIM e muito mais.</p>
            <ul class="paywall-benefits">
              <li>✓ ${list.length} cupons de desconto ativos</li>
              <li>✓ QR code único para cada estabelecimento</li>
              <li>✓ Suporte em português via WhatsApp</li>
              <li>✓ Acesso por 7 dias completos</li>
            </ul>
            <div class="paywall-price">
              <span class="paywall-price-label">Acesso completo</span>
              <span class="paywall-price-value">${data.formatMoney(data.defaultProduct.price)}</span>
            </div>
            <a class="dc-btn dc-btn-primary paywall-btn" href="/checkout">Comprar acesso agora</a>
            <a class="paywall-wa" href="https://wa.me/56941079792?text=Oi%2C%20quero%20saber%20mais%20sobre%20os%20cupons%20Descola%20Chile" target="_blank" rel="noopener noreferrer">Dúvidas? Fale no WhatsApp</a>
          </div>
        </section>
      `;
      return;
    }

    // Usuario com compra: acesso completo
    root.innerHTML = `
      <div class="dc-card access-banner">
        <p>Olá, <strong>${purchase.name.split(" ")[0]}</strong>! Seu acesso está ativo até <strong>${purchase.departure}</strong>.</p>
        <span class="unique-code-sm">${purchase.code}</span>
      </div>
      ${components.FilterBar({ categories, searchPlaceholder: "Buscar por parceiro ou beneficio" })}
      <section id="couponGrid" class="coupon-grid"></section>
    `;

    const searchInput = document.getElementById("couponSearch");
    const categorySelect = document.getElementById("couponCategory");
    const grid = document.getElementById("couponGrid");

    const render = () => {
      const term = String(searchInput.value || "").toLowerCase();
      const selected = categorySelect.value;
      const filtered = list.filter((coupon) => {
        const byCategory = selected === "Todos" || coupon.category === selected;
        const byText =
          coupon.name.toLowerCase().includes(term) ||
          coupon.partner.toLowerCase().includes(term) ||
          coupon.discount.toLowerCase().includes(term);
        return byCategory && byText;
      });

      if (!filtered.length) {
        grid.innerHTML = `<div class="dc-card empty-state"><p>Nenhum desconto encontrado com esse filtro.</p></div>`;
        return;
      }

      grid.innerHTML = filtered
        .map((coupon) => components.CouponCard(coupon))
        .join("");
    };

    searchInput.addEventListener("input", render);
    categorySelect.addEventListener("change", render);
    render();
  }

  async function mountCouponDetail() {
    const root = document.getElementById("couponDetailApp");
    if (!root) return;

    const id = parseCouponId();
    const list = await data.DataProvider.getCoupons();
    const coupon = list.find((item) => item.id === id) || list[0];

    root.innerHTML = `
      <article class="dc-card coupon-detail">
        <div class="coupon-detail-media" style="background-image:url('${coupon.image}')"></div>
        <div class="coupon-detail-body">
          <span class="dc-badge">${coupon.category}</span>
          <h1>${coupon.name}</h1>
          <p class="coupon-partner">Partner: ${coupon.partner}</p>
          <p><strong>Desconto:</strong> ${coupon.discount}</p>
          <p><strong>Condicoes:</strong> ${coupon.conditions}</p>
          <p><strong>Endereco:</strong> ${coupon.address}</p>
          <p><strong>Horario:</strong> ${coupon.schedule}</p>
          <a class="dc-link" href="${coupon.maps}" target="_blank" rel="noopener noreferrer">Abrir no Google Maps</a>
          <a class="dc-btn dc-btn-primary" href="/apresentar-cupom?id=${encodeURIComponent(coupon.id)}">Usar desconto</a>
        </div>
      </article>
    `;
  }

  async function mountPresentCoupon() {
    const root = document.getElementById("presentCouponApp");
    if (!root) return;

    const id =
      parseCouponId() || new URLSearchParams(window.location.search).get("id");
    const list = await data.DataProvider.getCoupons();
    const coupon = list.find((item) => item.id === id) || list[0];
    const purchase = data.getPurchase();

    root.innerHTML = `
      <article class="dc-card present-card">
        <h1>Apresentar cupom</h1>
        ${components.QRDisplay({ code: purchase ? purchase.code : `VISITANTE-${coupon.id}`, size: 280 })}
        <ul class="present-meta">
          <li><strong>Codigo unico:</strong> ${purchase ? purchase.code : "Sem codigo"}</li>
          <li><strong>Nome cliente:</strong> ${purchase ? purchase.name : "Visitante"}</li>
          <li><strong>Nome partner:</strong> ${coupon.partner}</li>
          <li><strong>Desconto:</strong> ${coupon.discount}</li>
          <li><strong>Validade:</strong> ${coupon.validUntil}</li>
        </ul>
        <p class="present-message">Apresente esta tela ao estabelecimento.</p>
      </article>
    `;
  }

  function mountHelp() {
    const root = document.getElementById("helpApp");
    if (!root) return;

    root.innerHTML = `
      <div class="help-layout">
        <section class="dc-card">
          <h1>Ajuda em portugues</h1>
          <p>Suporte rapido para brasileiros antes e durante a viagem no Chile.</p>
          <a class="dc-btn dc-btn-primary" href="https://wa.me/56941079792?text=Oi%2C%20preciso%20de%20ajuda%20com%20meus%20cupons" target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a>
        </section>
        <section class="dc-card faq-list">
          <h2>Perguntas frequentes</h2>
          ${data.faq
            .map(
              (item) =>
                `<details><summary>${item.q}</summary><p>${item.a}</p></details>`,
            )
            .join("")}
        </section>
      </div>
    `;
  }

  mountCheckout();
  mountSuccess();
  mountDiscounts();
  mountCouponDetail();
  mountPresentCoupon();
  mountHelp();
})();
