(function () {
  const data = window.DescolaData;
  const components = window.DescolaComponents;
  const analytics = window.DescolaAnalytics;

  function track(eventName, params) {
    if (!analytics || typeof analytics.track !== "function") return;
    analytics.track(eventName, params || {});
  }

  function parseCouponId() {
    const fromPath = window.location.pathname.match(/\/cupom\/([^/]+)/);
    if (fromPath && fromPath[1]) return decodeURIComponent(fromPath[1]);
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  function isDiscountsPage() {
    return window.location.pathname.includes("/descontos");
  }

  function getSearchMeta() {
    const params = new URLSearchParams(window.location.search);
    return {
      category: params.get("categoria") || "Todos",
      chip: params.get("filtro") || "",
    };
  }

  function mountCheckout() {
    const root = document.getElementById("checkoutApp");
    if (!root) return;

    const planoId = new URLSearchParams(window.location.search).get("plano");
    const selectedProduct =
      (planoId && data.products.find((p) => p.id === planoId)) ||
      data.products.find((p) => p.highlight) ||
      data.defaultProduct;

    const priceLabel =
      selectedProduct.currency === "BRL"
        ? `R$ ${selectedProduct.price}`
        : data.formatMoney(selectedProduct.price);

    root.innerHTML = components.CheckoutForm({
      product: selectedProduct,
      priceLabel,
    });

    track("dc_begin_checkout", {
      product_id: selectedProduct.id,
      product_name: selectedProduct.name,
      product_price: selectedProduct.price,
      currency: selectedProduct.currency,
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

      track("dc_checkout_submit", {
        product_id: payload.productId,
        product_name: payload.productName,
        product_price: payload.price,
        stay_length_days:
          Number(
            (new Date(payload.departure).getTime() -
              new Date(payload.arrival).getTime()) /
              (1000 * 60 * 60 * 24),
          ) || 0,
      });

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
      `Oi! Ativei meu acesso na Descola Chile. Codigo: ${purchase.code}`,
    );

    track("dc_purchase_success", {
      order_id: purchase.id,
      order_code: purchase.code,
      product_id: purchase.productId,
      product_name: purchase.productName,
      value: purchase.price,
      currency: "BRL",
    });

    root.innerHTML = `
      <article class="dc-card success-card">
        <p class="dc-kicker">Compra confirmada</p>
        <h1>Seu acesso esta ativo</h1>
        <p>Codigo unico do cliente:</p>
        <p class="unique-code">${purchase.code}</p>
        <ol class="success-steps">
          <li>Entre em Meus descontos</li>
          <li>Escolha e ative o cupom</li>
          <li>Mostre o QR no parceiro e economize</li>
        </ol>
        <div class="button-row">
          <a class="dc-btn dc-btn-primary" href="/meus-descontos">Ver meus descontos</a>
          <a class="dc-btn dc-btn-secondary" href="https://wa.me/56941079792?text=${waText}" target="_blank" rel="noopener noreferrer">Receber no WhatsApp</a>
        </div>
      </article>
    `;
  }

  function applyDynamicSeo(coupon) {
    if (!coupon) return;

    document.title = `${coupon.discount} no ${coupon.name} | Descola Chile`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        `${coupon.discount} no ${coupon.name} em ${coupon.district || "Santiago"}. Parceiro verificado para brasileiros no Chile.`,
      );
    }

    const ld = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: coupon.name,
      description: coupon.shortText || coupon.discount,
      brand: coupon.partner,
      offers: {
        "@type": "Offer",
        priceCurrency: "CLP",
        availability: "https://schema.org/InStock",
        price: "0",
        category: coupon.category,
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: String(coupon.rating || 4.7),
        reviewCount: String(coupon.reviewsCount || 100),
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);
  }

  async function mountDiscounts() {
    const root = document.getElementById("discountsApp");
    if (!root) return;

    const purchase = data.getPurchase();
    const list = await data.DataProvider.getCoupons();
    const categories = Array.from(new Set(list.map((item) => item.category)));
    const chips = [
      "Mais buscados",
      "Perto de mim",
      "Melhor desconto",
      "Restaurantes",
      "Familia",
      "Casal",
      "Neve",
      "Premium",
    ];

    const searchMeta = getSearchMeta();
    let trackedListView = false;

    root.innerHTML = `
      ${isDiscountsPage() ? `<div class="dc-card marketplace-intro"><p class="dc-kicker">Descontos reais para brasileiros</p><h2>Escolha, ative e aproveite</h2><p>Filtre por categoria, bairro e estilo de viagem para achar o que faz sentido no seu roteiro.</p></div>` : ""}
      ${purchase ? `<div class="dc-card access-banner"><p>Ola, <strong>${purchase.name.split(" ")[0]}</strong>. Seus cupons ficam ativos ate <strong>${purchase.departure}</strong>.</p><span class="unique-code-sm">${purchase.code}</span></div>` : `<div class="dc-card paywall-top"><p class="dc-kicker">Comunidade Descola</p><h2 class="paywall-title">Veja os descontos agora e ative quando quiser</h2><p class="paywall-desc">Explore parceiros verificados em Santiago e compre seu acesso quando estiver pronto.</p><a class="dc-btn dc-btn-primary" href="/checkout">Ativar acesso</a></div>`}
      ${components.FilterBar({
        categories,
        selected: searchMeta.category,
        chips,
        searchPlaceholder: "Busque por local, bairro ou beneficio",
      })}
      <section id="couponGrid" class="coupon-grid"></section>
    `;

    const searchInput = document.getElementById("couponSearch");
    const categorySelect = document.getElementById("couponCategory");
    const chipButtons = Array.from(document.querySelectorAll(".chip-btn"));
    const grid = document.getElementById("couponGrid");
    const selectedState = { chip: searchMeta.chip };

    if (searchMeta.category && searchMeta.category !== "Todos") {
      categorySelect.value = searchMeta.category;
    }

    const render = () => {
      const term = String(searchInput.value || "").toLowerCase();
      const selected = categorySelect.value;

      const filtered = list.filter((coupon) => {
        const byCategory = selected === "Todos" || coupon.category === selected;
        const byText =
          coupon.name.toLowerCase().includes(term) ||
          coupon.partner.toLowerCase().includes(term) ||
          coupon.discount.toLowerCase().includes(term) ||
          String(coupon.district || "")
            .toLowerCase()
            .includes(term);

        const byChip = !selectedState.chip
          ? true
          : selectedState.chip === "Melhor desconto"
            ? /%/.test(coupon.discount)
            : selectedState.chip === "Perto de mim"
              ? ["Providencia", "Lastarria", "Centro"].some((d) =>
                  String(coupon.district || "").includes(d),
                )
              : selectedState.chip === "Restaurantes"
                ? coupon.category === "Restaurantes"
                : selectedState.chip === "Neve"
                  ? coupon.category === "Neve & Ski"
                  : (coupon.tags || []).includes(selectedState.chip);

        return byCategory && byText && byChip;
      });

      if (!filtered.length) {
        grid.innerHTML = `<div class="dc-card empty-state"><p>Nenhum desconto encontrado com esse filtro.</p></div>`;
        track("dc_filter_no_results", {
          selected_category: selected,
          selected_chip: selectedState.chip || "none",
          term,
        });
        return;
      }

      grid.innerHTML = filtered
        .map((coupon) => components.CouponCard(coupon))
        .join("");

      if (!trackedListView) {
        track("dc_view_discount_list", {
          total_discounts: list.length,
          visible_discounts: filtered.length,
          has_access: Boolean(purchase),
        });
        trackedListView = true;
      }
    };

    searchInput.addEventListener("input", render);
    categorySelect.addEventListener("change", () => {
      track("dc_apply_filter", {
        filter_type: "category",
        filter_value: categorySelect.value,
      });
      render();
    });

    chipButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const isSame = selectedState.chip === button.dataset.chip;
        selectedState.chip = isSame ? "" : button.dataset.chip;
        chipButtons.forEach((btn) => btn.classList.remove("chip-btn-active"));
        if (!isSame) button.classList.add("chip-btn-active");
        track("dc_apply_filter", {
          filter_type: "chip",
          filter_value: selectedState.chip || "none",
        });
        render();
      });
    });

    render();
  }

  async function mountCouponDetail() {
    const root = document.getElementById("couponDetailApp");
    if (!root) return;

    const id = parseCouponId();
    const list = await data.DataProvider.getCoupons();
    const coupon = list.find((item) => item.id === id) || list[0];
    const purchase = data.getPurchase();

    const related = list
      .filter(
        (item) => item.id !== coupon.id && item.category === coupon.category,
      )
      .slice(0, 3);

    applyDynamicSeo(coupon);

    track("dc_view_discount_detail", {
      coupon_id: coupon.id,
      coupon_name: coupon.name,
      partner: coupon.partner,
      category: coupon.category,
      district: coupon.district || "Santiago",
      has_access: Boolean(purchase),
    });

    root.innerHTML = `
      <article class="dc-card coupon-detail">
        <div class="coupon-detail-media" style="background-image:url('${coupon.image}')"></div>
        <div class="coupon-detail-body">
          <span class="dc-badge">${coupon.category}</span>
          <h1>${coupon.discount} no ${coupon.name} em Santiago</h1>
          <p class="coupon-short">Beneficio exclusivo para brasileiros que querem pagar menos sem cair em furada.</p>
          <p class="coupon-partner">${coupon.partner} | ${coupon.district || "Santiago"} | ⭐ ${coupon.rating || 4.7} (${coupon.reviewsCount || 0})</p>
          <p><strong>Endereco:</strong> ${coupon.address}</p>
          <p><strong>Horario:</strong> ${coupon.schedule}</p>
          <p><strong>Condicoes:</strong> ${coupon.conditions}</p>
          <p><strong>Recomendado para:</strong> ${coupon.idealFor || "Turistas brasileiros em primeira ou segunda viagem."}</p>
          <section class="detail-steps">
            <h2>Como usar</h2>
            <ol>
              <li>Ative seu cupom.</li>
              <li>Mostre o QR Code no local.</li>
              <li>Aproveite seu desconto.</li>
            </ol>
          </section>
          <section class="detail-recommended">
            <h2>O que recomendamos</h2>
            <ul>${(coupon.recommended || []).map((item) => `<li>${item}</li>`).join("")}</ul>
          </section>
          <div class="button-row">
            <a class="dc-btn dc-btn-primary" href="${purchase ? `/apresentar-cupom?id=${encodeURIComponent(coupon.id)}` : `/checkout?plano=premium`}">${purchase ? "Ativar desconto" : "Comprar para ativar"}</a>
            <a class="dc-btn dc-btn-secondary" href="${coupon.maps}" target="_blank" rel="noopener noreferrer">Abrir no Google Maps</a>
          </div>
          <section class="faq-list">
            <h2>Perguntas frequentes</h2>
            ${
              (coupon.faq || [])
                .map(
                  (item) =>
                    `<details><summary>${item.q}</summary><p>${item.a}</p></details>`,
                )
                .join("") || "<p>Sem perguntas frequentes por enquanto.</p>"
            }
          </section>
        </div>
      </article>
      ${related.length ? `<section class="dc-card related-section"><h2>Outros descontos relacionados</h2><div class="coupon-grid">${related.map((item) => components.CouponCard(item)).join("")}</div></section>` : ""}
    `;

    const activateBtn = root.querySelector(".dc-btn-primary");
    if (activateBtn) {
      activateBtn.addEventListener("click", () => {
        track("dc_click_activate_discount", {
          coupon_id: coupon.id,
          coupon_name: coupon.name,
          partner: coupon.partner,
          flow: purchase ? "direct_activation" : "go_to_checkout",
        });
      });
    }
  }

  async function mountPresentCoupon() {
    const root = document.getElementById("presentCouponApp");
    if (!root) return;

    const id =
      parseCouponId() || new URLSearchParams(window.location.search).get("id");
    const list = await data.DataProvider.getCoupons();
    const coupon = list.find((item) => item.id === id) || list[0];
    const purchase = data.getPurchase();

    if (!purchase) {
      root.innerHTML = `
        <article class="dc-card empty-state">
          <h1>Ative seu acesso primeiro</h1>
          <p>Para gerar QR unico, finalize sua compra e volte aqui.</p>
          <a class="dc-btn dc-btn-primary" href="/checkout">Ir para checkout</a>
        </article>
      `;
      return;
    }

    const activation = data.activateCoupon(coupon.id, purchase);

    track("dc_coupon_activated", {
      coupon_id: coupon.id,
      coupon_name: coupon.name,
      activation_code: activation.activationCode,
      partner: coupon.partner,
      category: coupon.category,
    });

    root.innerHTML = `
      <article class="dc-card present-card">
        <p class="dc-kicker">Cupom ativo</p>
        <h1>${coupon.name}</h1>
        ${components.QRDisplay({ code: activation.activationCode, size: 280 })}
        <ul class="present-meta">
          <li><strong>Codigo do cupom:</strong> ${activation.activationCode}</li>
          <li><strong>Cliente:</strong> ${purchase.name}</li>
          <li><strong>Parceiro:</strong> ${coupon.partner}</li>
          <li><strong>Beneficio:</strong> ${coupon.discount}</li>
          <li><strong>Validade:</strong> ${activation.expiresAt}</li>
        </ul>
        <p class="present-message">Mostre esta tela no caixa antes de pagar.</p>
        <div class="button-row">
          <a class="dc-btn dc-btn-secondary" href="${coupon.maps}" target="_blank" rel="noopener noreferrer">Abrir mapa</a>
          <button id="markUsedBtn" class="dc-btn dc-btn-primary" type="button">Marcar como usado</button>
          <button id="shareCouponBtn" class="dc-btn dc-btn-ghost" type="button">Compartilhar</button>
        </div>
      </article>
    `;

    const markUsedBtn = document.getElementById("markUsedBtn");
    markUsedBtn.addEventListener("click", async () => {
      data.markCouponUsed(coupon.id);
      if (typeof data.DataProvider.logCouponUsage === "function") {
        await data.DataProvider.logCouponUsage({
          client: purchase.name,
          coupon: coupon.name,
          partner: coupon.partner,
          datetime: new Date().toISOString(),
          estimatedValue: 35000,
          discountApplied: coupon.discount,
          estimatedCommission: 3500,
          status: "Validado",
        });
      }
      track("dc_coupon_used", {
        coupon_id: coupon.id,
        coupon_name: coupon.name,
        partner: coupon.partner,
        activation_code: activation.activationCode,
      });
      markUsedBtn.disabled = true;
      markUsedBtn.textContent = "Cupom registrado";
    });

    const shareCouponBtn = document.getElementById("shareCouponBtn");
    shareCouponBtn.addEventListener("click", async () => {
      const text = `Cupom ${coupon.name} | Codigo: ${activation.activationCode}`;
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        navigator.clipboard.writeText(text);
        shareCouponBtn.textContent = "Codigo copiado";
      }
      track("dc_coupon_shared", {
        coupon_id: coupon.id,
        coupon_name: coupon.name,
        partner: coupon.partner,
      });
    });
  }

  async function mountUserCouponsBoard() {
    const root = document.getElementById("discountsApp");
    if (!root || isDiscountsPage()) return;

    const purchase = data.getPurchase();
    const list = await data.DataProvider.getCoupons();

    if (!purchase) {
      return;
    }

    const userCoupons = data.getUserCoupons(purchase, list);
    const active = userCoupons.filter((item) => item.accessStatus === "active");
    const used = userCoupons.filter((item) => item.accessStatus === "used");
    const available = userCoupons
      .filter((item) => item.accessStatus === "available")
      .slice(0, 4);

    root.insertAdjacentHTML(
      "beforeend",
      `
      <section class="my-coupons-board">
        <article class="dc-card">
          <h2>Cupons ativos</h2>
          <div class="coupon-grid">${active.length ? active.map((item) => components.UserCouponCard(item)).join("") : "<p>Voce ainda nao ativou nenhum cupom.</p>"}</div>
        </article>
        <article class="dc-card">
          <h2>Cupons usados</h2>
          <div class="coupon-grid">${used.length ? used.map((item) => components.UserCouponCard(item)).join("") : "<p>Nenhum cupom usado ainda.</p>"}</div>
        </article>
        <article class="dc-card">
          <h2>Recomendacoes perto de voce</h2>
          <div class="coupon-grid">${available.map((item) => components.CouponCard(item)).join("")}</div>
        </article>
      </section>
    `,
    );
  }

  async function mountMeuChile() {
    const root = document.getElementById("meuChileApp");
    if (!root) return;

    let snapshot = data.meuChileMock;
    let snapshotSource = "mock";

    if (typeof data.getMeuChileSnapshot === "function") {
      try {
        const loaded = await data.getMeuChileSnapshot();
        if (loaded) {
          snapshot = loaded;
          if (
            loaded.trip &&
            loaded.trip.id &&
            loaded.trip.id !== data.meuChileMock.trip.id
          ) {
            snapshotSource = "supabase";
          }
        }
      } catch (error) {
        console.warn("Meu Chile snapshot fallback to mock:", error.message);
      }
    }

    if (!snapshot || !components || !components.AppShell) return;

    const now = new Date();
    const savedMood =
      typeof data.getSavedMeuChileMood === "function"
        ? data.getSavedMeuChileMood()
        : null;
    const savedCtx =
      typeof data.getSavedMeuChileCtx === "function"
        ? data.getSavedMeuChileCtx()
        : null;
    const state = {
      hour: now.getHours(),
      climate: (savedCtx && savedCtx.climate) || snapshot.trip.weatherToday,
      location: (savedCtx && savedCtx.location) || snapshot.user.location,
      tripType: snapshot.user.tripType,
      mood: savedMood || snapshot.user.mood,
      budget: (savedCtx && savedCtx.budget) || snapshot.user.budget,
    };

    const renderRecommendations = () => {
      const list = data.getContextRecommendations(state).slice(0, 3);
      const container = document.getElementById("contextRecommendations");
      if (!container) return;

      if (!list.length) {
        container.innerHTML = `
          <article class="dc-card mc-context-card">
            <p>Ainda sem match perfeito. Ajuste mood, horario ou local para ver novas sugestoes.</p>
          </article>
        `;
        return;
      }

      container.innerHTML = list
        .map(
          (item) => `
            <article class="dc-card mc-context-card">
              <p>${item.message}</p>
            </article>
          `,
        )
        .join("");
    };

    root.innerHTML = components.AppShell({
      content: `
        ${components.HeroDashboard(snapshot)}

        <section class="mc-grid-2">
          <section class="mc-section-block">
            <div class="mc-section-head">
              <h2>Modo sem perrengue</h2>
              <p>Alertas inteligentes para voce evitar os erros mais comuns.</p>
            </div>
            <div class="mc-alert-grid">
              ${snapshot.alerts.map((alert) => components.SmartAlertCard(alert)).join("")}
            </div>
          </section>

          <section class="mc-section-block">
            <div class="mc-section-head">
              <h2>Recomendacoes contextuais</h2>
              <p>Mock inteligente por hora, clima, local, mood e orcamento.</p>
            </div>

            <article class="dc-card mc-context-controls">
              <div class="mc-control-grid">
                <label>Hora
                  <input id="ctxHour" type="range" min="6" max="23" value="${state.hour}" />
                </label>
                <label>Clima
                  <select id="ctxClimate">
                    <option value="ensolarado" ${state.climate === "ensolarado" ? "selected" : ""}>ensolarado</option>
                    <option value="parcial" ${state.climate === "parcial" ? "selected" : ""}>parcial</option>
                    <option value="nublado" ${state.climate === "nublado" ? "selected" : ""}>nublado</option>
                    <option value="frio" ${state.climate === "frio" ? "selected" : ""}>frio</option>
                    <option value="neve" ${state.climate === "neve" ? "selected" : ""}>neve</option>
                  </select>
                </label>
                <label>Local
                  <select id="ctxLocation">
                    <option value="Providencia" ${state.location === "Providencia" ? "selected" : ""}>Providencia</option>
                    <option value="Las Condes" ${state.location === "Las Condes" ? "selected" : ""}>Las Condes</option>
                    <option value="Lastarria" ${state.location === "Lastarria" ? "selected" : ""}>Lastarria</option>
                    <option value="Centro" ${state.location === "Centro" ? "selected" : ""}>Centro</option>
                  </select>
                </label>
                <label>Orcamento
                  <select id="ctxBudget">
                    <option value="baixo" ${state.budget === "baixo" ? "selected" : ""}>baixo</option>
                    <option value="medio" ${state.budget === "medio" ? "selected" : ""}>medio</option>
                    <option value="alto" ${state.budget === "alto" ? "selected" : ""}>alto</option>
                  </select>
                </label>
              </div>
              <p class="form-helper">Hora atual simulada: <strong id="ctxHourValue">${state.hour}:00</strong></p>
            </article>

            <div id="contextRecommendations" class="mc-context-list"></div>
          </section>
        </section>

        <section class="mc-section-block">
          <div class="mc-section-head">
            <h2>Itinerary Timeline</h2>
            <p>Seu dia dividido em manha, almoco, tarde e noite.</p>
          </div>
          <div class="mc-timeline-wrap">
            ${snapshot.itinerary.map((day) => components.TimelineDay(day)).join("")}
          </div>
        </section>

        <section class="mc-section-block">
          <div class="mc-section-head">
            <h2>Beneficios e QR</h2>
            <p>Ative no momento certo e use sem friccao.</p>
          </div>
          <div class="mc-benefits-grid">
            ${snapshot.benefits.map((benefit) => components.BenefitCard(benefit)).join("")}
          </div>
        </section>

        <section class="mc-grid-2">
          ${components.MoodSelector({
            moods: snapshot.moods,
            selectedMood: state.mood,
          })}
          ${components.SurpriseCard({ plan: data.getSurprisePlan(state.mood) })}
        </section>

        ${components.DicasPriBlock({
          text: snapshot.dicasPriVoice[0],
        })}

        <section class="mc-section-block">
          <div class="mc-section-head">
            <h2>Parceiros em destaque</h2>
            <p>Curadoria com alma local para brasileiros.</p>
          </div>
          <div class="mc-partner-grid">
            ${snapshot.partnerHighlights.map((partner) => components.PartnerCard(partner)).join("")}
          </div>
        </section>
      `,
    });

    const hourInput = document.getElementById("ctxHour");
    const hourValue = document.getElementById("ctxHourValue");
    const climateSelect = document.getElementById("ctxClimate");
    const locationSelect = document.getElementById("ctxLocation");
    const budgetSelect = document.getElementById("ctxBudget");

    if (hourInput && hourValue) {
      hourInput.addEventListener("input", () => {
        state.hour = Number(hourInput.value);
        hourValue.textContent = `${state.hour}:00`;
        renderRecommendations();
      });
    }

    const persistCtx = () => {
      if (typeof data.saveMeuChileCtx === "function") {
        data.saveMeuChileCtx({
          climate: state.climate,
          location: state.location,
          budget: state.budget,
        });
      }
    };

    if (climateSelect) {
      climateSelect.addEventListener("change", () => {
        state.climate = climateSelect.value;
        persistCtx();
        renderRecommendations();
      });
    }

    if (locationSelect) {
      locationSelect.addEventListener("change", () => {
        state.location = locationSelect.value;
        persistCtx();
        renderRecommendations();
      });
    }

    if (budgetSelect) {
      budgetSelect.addEventListener("change", () => {
        state.budget = budgetSelect.value;
        persistCtx();
        renderRecommendations();
      });
    }

    const moodButtons = Array.from(document.querySelectorAll(".mc-mood-btn"));
    const surpriseBtn = document.getElementById("surpriseTodayBtn");
    const surpriseCard = document.getElementById("surpriseCard");

    moodButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.mood = button.dataset.mood || state.mood;
        if (typeof data.saveMeuChileMood === "function") {
          data.saveMeuChileMood(state.mood);
        }
        moodButtons.forEach((node) =>
          node.classList.remove("mc-mood-btn-active"),
        );
        button.classList.add("mc-mood-btn-active");
        renderRecommendations();
      });
    });

    if (surpriseBtn && surpriseCard) {
      surpriseBtn.addEventListener("click", () => {
        const plan = data.getSurprisePlan(state.mood);
        surpriseCard.innerHTML = `
          <p class="dc-kicker">Plano do dia</p>
          <h3>${plan}</h3>
        `;
        track("dc_surprise_plan_generated", {
          mood: state.mood,
          plan,
        });
      });
    }

    renderRecommendations();

    track("dc_meu_chile_snapshot_loaded", {
      source: snapshotSource,
      tripId: snapshot.trip && snapshot.trip.id ? snapshot.trip.id : "none",
      alerts: Array.isArray(snapshot.alerts) ? snapshot.alerts.length : 0,
      itineraryDays: Array.isArray(snapshot.itinerary)
        ? snapshot.itinerary.length
        : 0,
      benefits: Array.isArray(snapshot.benefits) ? snapshot.benefits.length : 0,
    });
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
  mountDiscounts().then(mountUserCouponsBoard);
  mountCouponDetail();
  mountPresentCoupon();
  mountMeuChile();
  mountHelp();
})();
