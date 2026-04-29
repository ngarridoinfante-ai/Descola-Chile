(function () {
  const data = window.DescolaData;
  const components = window.DescolaComponents;
  const SESSION_KEY = data.STORAGE_KEYS.adminSession;
  const hasSupabaseAuth = Boolean(data.supabaseClient);

  async function isAuthenticated() {
    if (hasSupabaseAuth) {
      try {
        const session = await data.getAdminSession();
        if (!session || !session.user) return false;
        return await data.isAdminUser();
      } catch (_error) {
        return false;
      }
    }
    return localStorage.getItem(SESSION_KEY) === "ok";
  }

  async function requireAuth() {
    if (!(await isAuthenticated())) {
      window.location.href = "/admin";
      return false;
    }
    return true;
  }

  async function mountAdminRoot() {
    const root = document.getElementById("adminRoot");
    if (!root) return;

    if (!(await isAuthenticated())) {
      root.innerHTML = `
        <section class="admin-login-wrap">
          <form id="adminLoginForm" class="dc-card admin-login-form" novalidate>
            <p class="dc-kicker">Panel privado</p>
            <h1>Acceso administrador</h1>
            <div class="form-row">
              <label>Email</label>
              <input name="email" type="email" required placeholder="admin@descolachile.com" />
            </div>
            <div class="form-row">
              <label>Contrasena</label>
              <input name="password" type="password" required placeholder="********" />
            </div>
            <button class="dc-btn dc-btn-primary" type="submit">Ingresar</button>
            <p class="form-helper">${hasSupabaseAuth ? "Acceso con Supabase Auth (solo usuarios admin)." : "Mock login: admin@descolachile.com / descola123"}</p>
          </form>
        </section>
      `;

      const form = document.getElementById("adminLoginForm");
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const email = String(formData.get("email") || "").trim();
        const password = String(formData.get("password") || "").trim();

        try {
          if (hasSupabaseAuth) {
            await data.adminSignIn(email, password);
            const allowed = await data.isAdminUser();
            if (!allowed) {
              await data.adminSignOut();
              throw new Error(
                "Usuario autenticado sin permisos de administrador.",
              );
            }
          } else {
            if (
              email !== "admin@descolachile.com" ||
              password !== "descola123"
            ) {
              throw new Error("Credenciales invalidas.");
            }
            localStorage.setItem(SESSION_KEY, "ok");
          }

          window.location.href = "/admin";
        } catch (error) {
          alert(error.message || "No fue posible iniciar sesion.");
        }
      });

      return;
    }

    renderDashboard(root);
  }

  async function renderDashboard(root) {
    const metrics = await data.DataProvider.getMetrics();
    const cards = [
      { label: "Ventas totales", value: metrics.salesTotal },
      { label: "Cupones vendidos", value: metrics.couponsSold },
      { label: "Clientes activos", value: metrics.activeCustomers },
      { label: "Clientes en Chile hoy", value: metrics.inChileToday },
      {
        label: "Ingresos del mes",
        value: data.formatMoney(metrics.monthRevenue),
      },
      {
        label: "Comision estimada",
        value: data.formatMoney(metrics.estimatedCommission),
      },
      { label: "Cupones usados", value: metrics.usedCoupons },
      { label: "Partners activos", value: metrics.activePartners },
    ];

    root.innerHTML = `
      <section class="admin-shell">
        <aside class="admin-sidebar">
          <h2>Descola Admin</h2>
          <nav>
            <a href="/admin">Dashboard</a>
            <a href="/admin/clientes">Clientes</a>
            <a href="/admin/cupons">Cupones</a>
            <a href="/admin/partners">Partners</a>
            <a href="/admin/metricas">Metricas</a>
            <a href="/admin/configuracoes">Configuracion</a>
            <button id="logoutBtn" class="dc-btn dc-btn-ghost" type="button">Cerrar sesion</button>
          </nav>
        </aside>
        <main class="admin-content">
          <header class="admin-header">
            <p class="dc-kicker">Dashboard principal</p>
            <h1>Vista operativa de Descola Chile</h1>
          </header>
          <section class="metric-grid">
            ${cards.map((item) => components.DashboardMetricCard(item)).join("")}
          </section>
          <section class="admin-two-columns">
            <article class="dc-card">
              <h3>Top 5 descuentos mas usados</h3>
              <ol>${metrics.topDiscounts.map((item) => `<li>${item}</li>`).join("")}</ol>
            </article>
            <article class="dc-card">
              <h3>Top 5 partners por ventas</h3>
              <ol>${metrics.topPartners.map((item) => `<li>${item}</li>`).join("")}</ol>
            </article>
          </section>
        </main>
      </section>
    `;

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", async () => {
      if (hasSupabaseAuth) {
        try {
          await data.adminSignOut();
        } catch (_error) {
          // Fall through to redirect.
        }
      }
      localStorage.removeItem(SESSION_KEY);
      window.location.href = "/admin";
    });
  }

  async function mountCustomersPage() {
    const root = document.getElementById("adminClientesApp");
    if (!root || !(await requireAuth())) return;

    const rows = await data.DataProvider.getCustomers();
    root.innerHTML = `
      <section class="admin-page-wrap">
        <header class="admin-subheader">
          <h1>Gestion de clientes</h1>
          <a class="dc-btn dc-btn-secondary" href="/admin">Volver al dashboard</a>
        </header>
        ${components.AdminTable({
          columns: [
            { key: "name", label: "Nombre" },
            { key: "email", label: "Email" },
            { key: "whatsapp", label: "WhatsApp" },
            { key: "arrival", label: "Llegada" },
            { key: "departure", label: "Salida" },
            { key: "status", label: "Estado" },
            { key: "product", label: "Cupon comprado" },
            { key: "uniqueCode", label: "Codigo" },
            { key: "lastUse", label: "Ultimo uso" },
            { key: "totalUses", label: "Total usos" },
          ],
          rows,
          actions: [
            { id: "view", label: "Ver" },
            { id: "edit", label: "Editar" },
            { id: "wa", label: "WhatsApp" },
            { id: "disable", label: "Desactivar" },
          ],
        })}
      </section>
    `;
  }

  async function mountCouponsPage() {
    const root = document.getElementById("adminCuponsApp");
    if (!root || !(await requireAuth())) return;

    const list = await data.DataProvider.getCoupons();

    root.innerHTML = `
      <section class="admin-page-wrap">
        <header class="admin-subheader">
          <h1>Gestion de cupones</h1>
          <a class="dc-btn dc-btn-secondary" href="/admin">Volver al dashboard</a>
        </header>
        <form id="couponForm" class="dc-card admin-form-grid" novalidate>
          <h2>Crear o editar cupon</h2>
          <input name="id" placeholder="ID interno" required />
          <input name="name" placeholder="Nombre del cupon" required />
          <input name="partner" placeholder="Partner" required />
          <input name="category" placeholder="Categoria" required />
          <input name="discount" placeholder="Descuento" required />
          <input name="conditions" placeholder="Condiciones" required />
          <input name="image" placeholder="URL imagen" required />
          <input name="startDate" type="date" required />
          <input name="endDate" type="date" required />
          <input name="active" placeholder="Activo/Inactivo" required />
          <input name="usageLimit" type="number" min="1" placeholder="Limite de usos" required />
          <input name="qrCode" placeholder="Codigo QR asociado" required />
          <button class="dc-btn dc-btn-primary" type="submit">Guardar cupon</button>
        </form>
        <section id="couponAdminGrid" class="coupon-grid"></section>
      </section>
    `;

    const form = document.getElementById("couponForm");
    const grid = document.getElementById("couponAdminGrid");

    const render = async () => {
      const updated = await data.DataProvider.getCoupons();
      grid.innerHTML = updated
        .map(
          (coupon) => `
            <article class="dc-card admin-coupon-row">
              <h3>${coupon.name}</h3>
              <p>${coupon.partner} | ${coupon.category}</p>
              <p>${coupon.discount}</p>
              <div class="button-row">
                <button class="dc-btn dc-btn-ghost" data-edit="${coupon.id}">Editar</button>
                <button class="dc-btn dc-btn-danger" data-delete="${coupon.id}">Eliminar</button>
              </div>
            </article>
          `,
        )
        .join("");

      grid.querySelectorAll("[data-delete]").forEach((button) => {
        button.addEventListener("click", async () => {
          await data.DataProvider.deleteCoupon(button.dataset.delete);
          render();
        });
      });

      grid.querySelectorAll("[data-edit]").forEach((button) => {
        button.addEventListener("click", async () => {
          const current = (await data.DataProvider.getCoupons()).find(
            (item) => item.id === button.dataset.edit,
          );
          if (!current) return;

          form.id.value = current.id;
          form.name.value = current.name;
          form.partner.value = current.partner;
          form.category.value = current.category;
          form.discount.value = current.discount;
          form.conditions.value = current.conditions;
          form.image.value = current.image;
          form.startDate.value = current.startDate || "2026-01-01";
          form.endDate.value = current.validUntil || "2026-12-31";
          form.active.value = current.active ? "Activo" : "Inactivo";
          form.usageLimit.value = current.usageLimit || 1;
          form.qrCode.value = current.id;
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      });
    };

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const fd = new FormData(form);
      const nextCoupon = {
        id: String(fd.get("id") || "").trim(),
        name: String(fd.get("name") || "").trim(),
        partner: String(fd.get("partner") || "").trim(),
        category: String(fd.get("category") || "").trim(),
        discount: String(fd.get("discount") || "").trim(),
        conditions: String(fd.get("conditions") || "").trim(),
        image: String(fd.get("image") || "").trim(),
        startDate: String(fd.get("startDate") || "").trim(),
        validUntil: String(fd.get("endDate") || "").trim(),
        active:
          String(fd.get("active") || "")
            .trim()
            .toLowerCase() === "activo",
        usageLimit: Number(fd.get("usageLimit") || 1),
        qrCode: String(fd.get("qrCode") || "").trim(),
        address: "Por definir",
        maps: "https://maps.google.com/?q=Santiago",
        schedule: "Por definir",
      };

      await data.DataProvider.saveCoupon(nextCoupon);
      form.reset();
      render();
    });

    render();
  }

  async function mountPartnersPage() {
    const root = document.getElementById("adminPartnersApp");
    if (!root || !(await requireAuth())) return;

    const list = await data.DataProvider.getPartners();

    root.innerHTML = `
      <section class="admin-page-wrap">
        <header class="admin-subheader">
          <h1>Gestion de partners</h1>
          <a class="dc-btn dc-btn-secondary" href="/admin">Volver al dashboard</a>
        </header>
        <section class="partner-grid">
          ${list.map((partner) => components.PartnerCard(partner)).join("")}
        </section>
        <section class="dc-card">
          <h2>Campos gestionables (MVP)</h2>
          <p>Nombre empresa, categoria, contacto, email, WhatsApp, direccion, comision, descuento ofrecido, estado, ventas generadas, cupones usados y monto estimado aportado.</p>
        </section>
      </section>
    `;
  }

  async function mountMetricsPage() {
    const root = document.getElementById("adminMetricasApp");
    if (!root || !(await requireAuth())) return;

    const metrics = await data.DataProvider.getMetrics();
    const usage = await data.DataProvider.getCouponUsage();

    const chart = (title, points) => {
      const max = Math.max(...points.map((item) => item.value), 1);
      return `
        <article class="dc-card mini-chart">
          <h3>${title}</h3>
          <div class="chart-bars">
            ${points
              .map(
                (item) => `
                  <div class="bar-item">
                    <span class="bar" style="height:${Math.max(12, (item.value / max) * 120)}px"></span>
                    <small>${item.label}</small>
                  </div>
                `,
              )
              .join("")}
          </div>
        </article>
      `;
    };

    root.innerHTML = `
      <section class="admin-page-wrap">
        <header class="admin-subheader">
          <h1>Metricas y reportes</h1>
          <a class="dc-btn dc-btn-secondary" href="/admin">Volver al dashboard</a>
        </header>
        <section class="charts-grid">
          ${chart("Uso por categoria", metrics.usageByCategory)}
          ${chart("Partners con mas conversiones", metrics.partnerConversions)}
          ${chart("Clientes por fuente", metrics.clientsBySource)}
          ${chart("Ingresos por tipo de producto", metrics.incomeByProduct)}
        </section>
        <section class="dc-card">
          <h2>Tracking de uso</h2>
          ${components.AdminTable({
            columns: [
              { key: "client", label: "Cliente" },
              { key: "coupon", label: "Cupon" },
              { key: "partner", label: "Partner" },
              { key: "datetime", label: "Fecha/hora" },
              { key: "estimatedValue", label: "Valor compra" },
              { key: "discountApplied", label: "Descuento" },
              { key: "estimatedCommission", label: "Comision" },
              { key: "status", label: "Estado" },
            ],
            rows: usage.map((item) => ({
              ...item,
              estimatedValue: data.formatMoney(item.estimatedValue),
              estimatedCommission: data.formatMoney(item.estimatedCommission),
            })),
            actions: [{ id: "validate", label: "Validar" }],
          })}
        </section>
      </section>
    `;
  }

  async function mountConfigPage() {
    const root = document.getElementById("adminConfigApp");
    if (!root || !(await requireAuth())) return;

    const settings = await data.DataProvider.getSettings();

    root.innerHTML = `
      <section class="admin-page-wrap">
        <header class="admin-subheader">
          <h1>Configuracion</h1>
          <a class="dc-btn dc-btn-secondary" href="/admin">Volver al dashboard</a>
        </header>
        <form id="configForm" class="dc-card admin-form-grid" novalidate>
          <input name="membershipPrice" type="number" value="${settings.membershipPrice}" placeholder="Precio membresia" />
          <input name="whatsappSales" value="${settings.whatsappSales}" placeholder="Link WhatsApp ventas" />
          <input name="whatsappSupport" value="${settings.whatsappSupport}" placeholder="Link WhatsApp soporte" />
          <input name="esimAffiliate" value="${settings.esimAffiliate}" placeholder="Link eSIM afiliado" />
          <input name="logo" value="${settings.logo}" placeholder="Logo" />
          <input name="brandPrimary" value="${settings.brandPrimary}" placeholder="Color primario" />
          <input name="brandAccent" value="${settings.brandAccent}" placeholder="Color acento" />
          <textarea name="legalText" placeholder="Textos legales">${settings.legalText}</textarea>
          <input name="termsUrl" value="${settings.termsUrl}" placeholder="Terminos y condiciones" />
          <button class="dc-btn dc-btn-primary" type="submit">Guardar configuracion</button>
        </form>
      </section>
    `;

    const form = document.getElementById("configForm");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const fd = new FormData(form);
      await data.DataProvider.saveSettings({
        membershipPrice: Number(fd.get("membershipPrice") || 0),
        whatsappSales: String(fd.get("whatsappSales") || ""),
        whatsappSupport: String(fd.get("whatsappSupport") || ""),
        esimAffiliate: String(fd.get("esimAffiliate") || ""),
        logo: String(fd.get("logo") || ""),
        brandPrimary: String(fd.get("brandPrimary") || ""),
        brandAccent: String(fd.get("brandAccent") || ""),
        legalText: String(fd.get("legalText") || ""),
        termsUrl: String(fd.get("termsUrl") || ""),
      });
      alert("Configuracion guardada.");
    });
  }

  mountAdminRoot();
  mountCustomersPage();
  mountCouponsPage();
  mountPartnersPage();
  mountMetricsPage();
  mountConfigPage();
})();
