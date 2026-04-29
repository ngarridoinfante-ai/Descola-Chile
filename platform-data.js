(function () {
  const STORAGE_KEYS = {
    purchase: "descola_purchase",
    adminSession: "descola_admin_session",
    coupons: "descola_admin_coupons",
    partners: "descola_admin_partners",
  };

  const defaultProduct = {
    id: "membresia-full",
    name: "Acesso Descola Chile - 7 dias",
    price: 34900,
    currency: "CLP",
  };

  const products = [
    {
      id: "basico",
      name: "Básico",
      price: 49,
      currency: "BRL",
      highlight: false,
      badge: null,
      desc: "Para viagens curtas de fim de semana.",
      days: 3,
      features: [
        "Acesso por 3 dias",
        "Cupons de restaurantes e transfers",
        "QR code único",
        "Suporte via WhatsApp",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: 150,
      currency: "BRL",
      highlight: true,
      badge: "Mais escolhido",
      desc: "Ideal para viagens de 1 semana.",
      days: 7,
      features: [
        "Acesso por 7 dias",
        "Todos os cupons ativos",
        "Neve, vinícolas, eSIM e restaurantes",
        "QR code único por estabelecimento",
        "Suporte prioritário em português",
      ],
    },
    {
      id: "pro-max",
      name: "Pro Max",
      price: 500,
      currency: "BRL",
      highlight: false,
      badge: "Melhor custo-benefício",
      desc: "Para viagens longas ou múltiplas viagens.",
      days: 30,
      features: [
        "Acesso por 30 dias",
        "Todos os cupons ativos",
        "Cupons extras exclusivos",
        "Concierge dedicado em português",
        "Planejamento personalizado de roteiro",
      ],
    },
  ];

  const coupons = [
    {
      id: "cupom-fogobrasas",
      name: "FogoBrasa Providencia",
      partner: "FogoBrasa",
      category: "Restaurantes",
      discount: "20% OFF no menu executivo",
      conditions: "Valido de segunda a quinta no almoco. Nao cumulativo.",
      address: "Av. Providencia 1890, Santiago",
      maps: "https://maps.google.com/?q=Av.+Providencia+1890,+Santiago",
      schedule: "12:00 - 23:00",
      validUntil: "2026-12-31",
      image:
        "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1400&q=80",
      usageLimit: 1,
      active: true,
    },
    {
      id: "cupom-neveandes",
      name: "Neve Andes Day Pass",
      partner: "Neve Andes",
      category: "Neve",
      discount: "15% OFF no pacote dia completo",
      conditions: "Vagas limitadas. Reserva com 48h de antecedencia.",
      address: "Pickup em Providencia e Las Condes",
      maps: "https://maps.google.com/?q=Providencia,+Santiago",
      schedule: "05:30 - 21:30",
      validUntil: "2026-09-30",
      image:
        "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1400&q=80",
      usageLimit: 1,
      active: true,
    },
    {
      id: "cupom-vinaalto",
      name: "Vina Alto Reserva",
      partner: "Vina Alto",
      category: "Vinas",
      discount: "2x1 na degustacao classica",
      conditions: "Somente para maiores de 18 anos. Nao inclui transfer.",
      address: "Ruta del Vino km 24, Valle del Maipo",
      maps: "https://maps.google.com/?q=Valle+del+Maipo,+Chile",
      schedule: "10:00 - 18:00",
      validUntil: "2026-12-31",
      image:
        "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1400&q=80",
      usageLimit: 1,
      active: true,
    },
    {
      id: "cupom-esimglobal",
      name: "eSIM Global Chile",
      partner: "ConectaTrip",
      category: "eSIM",
      discount: "25% OFF no plano de 10GB",
      conditions: "Ativacao em ate 24 horas apos a compra.",
      address: "Atendimento 100% online",
      maps: "https://maps.google.com/?q=Santiago,+Chile",
      schedule: "24 horas",
      validUntil: "2026-12-31",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=80",
      usageLimit: 1,
      active: true,
    },
  ];

  const partners = [
    {
      id: "partner-fogobrasas",
      company: "FogoBrasa",
      category: "Restaurantes",
      contact: "Paula Rojas",
      email: "parcerias@fogobrasa.cl",
      whatsapp: "+56 9 5555 1111",
      address: "Av. Providencia 1890, Santiago",
      commission: "12%",
      discountOffered: "20%",
      status: "Activo",
      sales: 192,
      usedCoupons: 146,
      estimatedAmount: 2894000,
    },
    {
      id: "partner-neveandes",
      company: "Neve Andes",
      category: "Neve",
      contact: "Martin Cuevas",
      email: "alianzas@neveandes.cl",
      whatsapp: "+56 9 6666 2222",
      address: "Las Condes, Santiago",
      commission: "10%",
      discountOffered: "15%",
      status: "Activo",
      sales: 121,
      usedCoupons: 97,
      estimatedAmount: 3641000,
    },
  ];

  const customers = [
    {
      id: "cli-001",
      name: "Juliana Fernandes",
      email: "ju.fernandes@gmail.com",
      whatsapp: "+55 11 99999-1001",
      arrival: "2026-07-12",
      departure: "2026-07-19",
      status: "Activo",
      product: "Acesso 7 dias",
      uniqueCode: "DSC-7J29-KL8P",
      lastUse: "2026-07-14 13:22",
      totalUses: 3,
    },
    {
      id: "cli-002",
      name: "Thiago Moura",
      email: "thiagomoura@hotmail.com",
      whatsapp: "+55 21 98888-2303",
      arrival: "2026-06-18",
      departure: "2026-06-22",
      status: "Inactivo",
      product: "Acesso 7 dias",
      uniqueCode: "DSC-L91Q-5M2A",
      lastUse: "2026-06-21 20:45",
      totalUses: 2,
    },
  ];

  const couponUsage = [
    {
      id: "use-001",
      client: "Juliana Fernandes",
      coupon: "FogoBrasa Providencia",
      partner: "FogoBrasa",
      datetime: "2026-07-14 13:22",
      estimatedValue: 48000,
      discountApplied: "20%",
      estimatedCommission: 5760,
      status: "Validado",
    },
    {
      id: "use-002",
      client: "Juliana Fernandes",
      coupon: "Neve Andes Day Pass",
      partner: "Neve Andes",
      datetime: "2026-07-15 06:10",
      estimatedValue: 129000,
      discountApplied: "15%",
      estimatedCommission: 12900,
      status: "Validado",
    },
    {
      id: "use-003",
      client: "Thiago Moura",
      coupon: "eSIM Global Chile",
      partner: "ConectaTrip",
      datetime: "2026-06-20 11:00",
      estimatedValue: 21000,
      discountApplied: "25%",
      estimatedCommission: 2520,
      status: "No validado",
    },
  ];

  const metrics = {
    salesTotal: 531,
    couponsSold: 531,
    activeCustomers: 238,
    inChileToday: 61,
    monthRevenue: 18540000,
    estimatedCommission: 2189000,
    usedCoupons: 417,
    activePartners: 34,
    topDiscounts: [
      "FogoBrasa Providencia",
      "Neve Andes Day Pass",
      "eSIM Global Chile",
      "Vina Alto Reserva",
      "Transfer Aeroporto Smart",
    ],
    topPartners: [
      "FogoBrasa",
      "Neve Andes",
      "ConectaTrip",
      "Vina Alto",
      "SkyTransfer",
    ],
    salesPerDay: [12, 14, 9, 17, 22, 20, 25],
    salesPerMonth: [320, 410, 455, 492, 531, 488],
    usageByCategory: [
      { label: "Restaurantes", value: 142 },
      { label: "Neve", value: 110 },
      { label: "eSIM", value: 89 },
      { label: "Tours", value: 76 },
    ],
    partnerConversions: [
      { label: "FogoBrasa", value: 146 },
      { label: "Neve Andes", value: 97 },
      { label: "ConectaTrip", value: 88 },
      { label: "Vina Alto", value: 63 },
    ],
    clientsBySource: [
      { label: "Instagram", value: 43 },
      { label: "Google", value: 27 },
      { label: "Indicacao", value: 20 },
      { label: "Blog", value: 10 },
    ],
    incomeByProduct: [
      { label: "Membresia 7 dias", value: 68 },
      { label: "Membresia 14 dias", value: 22 },
      { label: "Pacote Premium", value: 10 },
    ],
  };

  const settings = {
    membershipPrice: 34900,
    whatsappSales: "https://wa.me/56941079792",
    whatsappSupport: "https://wa.me/56941079792",
    esimAffiliate: "https://descolachile.com/esim-afiliado",
    logo: "/favicon.svg",
    brandPrimary: "#0E8A5B",
    brandAccent: "#F4A33C",
    legalText: "Servico digital, nao reembolsavel apos ativacao do acesso.",
    termsUrl: "/termos-condicoes",
  };

  function formatMoney(value) {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(value || 0);
  }

  function generateUniqueCode() {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    const block = () =>
      Array.from(
        { length: 4 },
        () => chars[Math.floor(Math.random() * chars.length)],
      ).join("");
    return `DSC-${block()}-${block()}`;
  }

  function persistCollection(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function readCollection(key, fallback) {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch (_error) {
      return fallback;
    }
  }

  function toBooleanStatus(value) {
    if (typeof value === "boolean") return value;
    return String(value || "").toLowerCase() === "activo";
  }

  function createSupabaseProvider() {
    const config = window.DescolaSupabaseConfig;
    const sdk = window.supabase;

    if (!config || !config.enabled || !sdk || !sdk.createClient) {
      return null;
    }

    const hasKeys = config.url && config.anonKey;
    if (!hasKeys) return null;

    const client = sdk.createClient(config.url, config.anonKey);

    const mapCouponFromDb = (row) => ({
      id: row.id,
      name: row.name,
      partner: row.partner,
      category: row.category,
      discount: row.discount,
      conditions: row.conditions,
      address: row.address,
      maps: row.maps,
      schedule: row.schedule,
      validUntil: row.valid_until,
      image: row.image,
      usageLimit: row.usage_limit,
      active: row.active,
      startDate: row.start_date,
      qrCode: row.qr_code,
    });

    const mapCouponToDb = (coupon) => ({
      id: coupon.id,
      name: coupon.name,
      partner: coupon.partner,
      category: coupon.category,
      discount: coupon.discount,
      conditions: coupon.conditions,
      address: coupon.address || "",
      maps: coupon.maps || "",
      schedule: coupon.schedule || "",
      valid_until: coupon.validUntil || null,
      image: coupon.image || "",
      usage_limit: Number(coupon.usageLimit || 1),
      active: Boolean(coupon.active),
      start_date: coupon.startDate || null,
      qr_code: coupon.qrCode || coupon.id,
    });

    return {
      client,
      async getAdminSession() {
        const { data, error } = await client.auth.getSession();
        if (error) throw error;
        return data.session;
      },
      async signInAdmin(email, password) {
        const { error } = await client.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      },
      async signOutAdmin() {
        const { error } = await client.auth.signOut();
        if (error) throw error;
      },
      async isAdminUser() {
        const session = await this.getAdminSession();
        if (!session || !session.user) return false;

        const { data, error } = await client
          .from("admin_users")
          .select("role")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (error) throw error;
        return Boolean(data && data.role === "admin");
      },
      async getCoupons() {
        const { data, error } = await client
          .from("coupons")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return (data || []).map(mapCouponFromDb);
      },
      async getPartners() {
        const { data, error } = await client
          .from("partners")
          .select("*")
          .order("company", { ascending: true });
        if (error) throw error;
        return (data || []).map((row) => ({
          id: row.id,
          company: row.company,
          category: row.category,
          contact: row.contact,
          email: row.email,
          whatsapp: row.whatsapp,
          address: row.address,
          commission: row.commission,
          discountOffered: row.discount_offered,
          status: row.status,
          sales: row.sales,
          usedCoupons: row.used_coupons,
          estimatedAmount: row.estimated_amount,
        }));
      },
      async getCustomers() {
        const { data, error } = await client
          .from("customers")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return (data || []).map((row) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          whatsapp: row.whatsapp,
          arrival: row.arrival,
          departure: row.departure,
          status: row.status,
          product: row.product,
          uniqueCode: row.unique_code,
          lastUse: row.last_use,
          totalUses: row.total_uses,
        }));
      },
      async getCouponUsage() {
        const { data, error } = await client
          .from("coupon_usage")
          .select("*")
          .order("datetime", { ascending: false });
        if (error) throw error;
        return (data || []).map((row) => ({
          id: row.id,
          client: row.client,
          coupon: row.coupon,
          partner: row.partner,
          datetime: row.datetime,
          estimatedValue: row.estimated_value,
          discountApplied: row.discount_applied,
          estimatedCommission: row.estimated_commission,
          status: row.status,
        }));
      },
      async getMetrics() {
        const { data, error } = await client
          .from("metrics_snapshots")
          .select("payload")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (error) throw error;
        return data && data.payload ? data.payload : metrics;
      },
      async getSettings() {
        const { data, error } = await client
          .from("settings")
          .select("*")
          .eq("id", "main")
          .maybeSingle();
        if (error) throw error;
        if (!data) return settings;

        return {
          membershipPrice: data.membership_price,
          whatsappSales: data.whatsapp_sales,
          whatsappSupport: data.whatsapp_support,
          esimAffiliate: data.esim_affiliate,
          logo: data.logo,
          brandPrimary: data.brand_primary,
          brandAccent: data.brand_accent,
          legalText: data.legal_text,
          termsUrl: data.terms_url,
        };
      },
      async saveSettings(nextSettings) {
        const payload = {
          id: "main",
          membership_price: Number(nextSettings.membershipPrice || 0),
          whatsapp_sales: nextSettings.whatsappSales || "",
          whatsapp_support: nextSettings.whatsappSupport || "",
          esim_affiliate: nextSettings.esimAffiliate || "",
          logo: nextSettings.logo || "",
          brand_primary: nextSettings.brandPrimary || "",
          brand_accent: nextSettings.brandAccent || "",
          legal_text: nextSettings.legalText || "",
          terms_url: nextSettings.termsUrl || "",
        };

        const { error } = await client.from("settings").upsert(payload);
        if (error) throw error;

        return {
          membershipPrice: payload.membership_price,
          whatsappSales: payload.whatsapp_sales,
          whatsappSupport: payload.whatsapp_support,
          esimAffiliate: payload.esim_affiliate,
          logo: payload.logo,
          brandPrimary: payload.brand_primary,
          brandAccent: payload.brand_accent,
          legalText: payload.legal_text,
          termsUrl: payload.terms_url,
        };
      },
      async saveCoupon(nextCoupon) {
        const { error } = await client
          .from("coupons")
          .upsert(mapCouponToDb(nextCoupon));
        if (error) throw error;
        return this.getCoupons();
      },
      async deleteCoupon(couponId) {
        const { error } = await client
          .from("coupons")
          .delete()
          .eq("id", couponId);
        if (error) throw error;
        return this.getCoupons();
      },
      async savePurchase(purchase) {
        const payload = {
          id: purchase.id,
          name: purchase.name,
          email: purchase.email,
          whatsapp: purchase.whatsapp,
          arrival: purchase.arrival,
          departure: purchase.departure,
          product_id: purchase.productId,
          product_name: purchase.productName,
          price: purchase.price,
          code: purchase.code,
          purchased_at: purchase.purchasedAt,
        };

        const { error } = await client.from("purchases").insert(payload);
        if (error) throw error;
      },
    };
  }

  const LocalDataProvider = {
    client: null,
    async getAdminSession() {
      return null;
    },
    async signInAdmin() {
      throw new Error("Supabase no habilitado");
    },
    async signOutAdmin() {
      return;
    },
    async isAdminUser() {
      return false;
    },
    // Keep this interface stable for Supabase/Firebase/Notion adapter swap.
    async getCoupons() {
      return readCollection(STORAGE_KEYS.coupons, coupons);
    },
    async getPartners() {
      return readCollection(STORAGE_KEYS.partners, partners);
    },
    async getCustomers() {
      return customers;
    },
    async getCouponUsage() {
      return couponUsage;
    },
    async getMetrics() {
      return metrics;
    },
    async getSettings() {
      return settings;
    },
    async saveSettings(nextSettings) {
      Object.assign(settings, nextSettings);
      return settings;
    },
    async saveCoupon(nextCoupon) {
      const list = await this.getCoupons();
      const existingIndex = list.findIndex((c) => c.id === nextCoupon.id);
      if (existingIndex >= 0) {
        list[existingIndex] = nextCoupon;
      } else {
        list.unshift(nextCoupon);
      }
      persistCollection(STORAGE_KEYS.coupons, list);
      return list;
    },
    async deleteCoupon(couponId) {
      const list = await this.getCoupons();
      const filtered = list.filter((item) => item.id !== couponId);
      persistCollection(STORAGE_KEYS.coupons, filtered);
      return filtered;
    },
  };

  const DataProvider = createSupabaseProvider() || LocalDataProvider;

  function savePurchase(formData) {
    const purchase = {
      id: `pur-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      whatsapp: formData.whatsapp,
      arrival: formData.arrival,
      departure: formData.departure,
      productId: formData.productId,
      productName: formData.productName,
      price: Number(formData.price),
      code: generateUniqueCode(),
      purchasedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.purchase, JSON.stringify(purchase));

    if (typeof DataProvider.savePurchase === "function") {
      DataProvider.savePurchase(purchase).catch((error) => {
        console.warn("Supabase purchase persistence failed:", error.message);
      });
    }

    return purchase;
  }

  function getPurchase() {
    const raw = localStorage.getItem(STORAGE_KEYS.purchase);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (_error) {
      return null;
    }
  }

  window.DescolaData = {
    STORAGE_KEYS,
    defaultProduct,
    products,
    testimonials: [
      {
        name: "Ana Luiza - Sao Paulo",
        quote: "Economizei no restaurante e no transfer logo no primeiro dia.",
      },
      {
        name: "Rafael e Clara - Curitiba",
        quote: "Tudo em portugues e sem stress. Parece concierge de viagem.",
      },
      {
        name: "Bruno - Rio de Janeiro",
        quote: "O cupom da neve pagou a propria assinatura em uma manha.",
      },
    ],
    faq: [
      {
        q: "Como recebo meus cupons?",
        a: "Assim que confirma o pagamento, voce recebe acesso imediato na area de descontos.",
      },
      {
        q: "Funciona para qualquer turista brasileiro?",
        a: "Sim. Basta preencher seus dados reais no checkout para gerar seu codigo unico.",
      },
      {
        q: "Preciso mostrar impresso?",
        a: "Nao. Apresente o QR e o codigo unico direto no celular.",
      },
    ],
    formatMoney,
    savePurchase,
    getPurchase,
    supabaseClient: DataProvider.client || null,
    async getAdminSession() {
      return DataProvider.getAdminSession();
    },
    async adminSignIn(email, password) {
      return DataProvider.signInAdmin(email, password);
    },
    async adminSignOut() {
      return DataProvider.signOutAdmin();
    },
    async isAdminUser() {
      return DataProvider.isAdminUser();
    },
    DataProvider,
  };
})();
