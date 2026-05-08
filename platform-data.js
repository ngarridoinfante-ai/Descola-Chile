(function () {
  const STORAGE_KEYS = {
    purchase: "descola_purchase",
    adminSession: "descola_admin_session",
    coupons: "descola_admin_coupons",
    partners: "descola_admin_partners",
    couponState: "descola_coupon_state",
    favorites: "descola_favorites",
    meuChileMood: "descola_meu_chile_mood",
    meuChileCtx: "descola_meu_chile_ctx",
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
      name: "La Cabrera Chile",
      partner: "FogoBrasa",
      category: "Restaurantes",
      district: "Providencia",
      discount: "10% OFF para clientes Descola",
      priceNote: "Ticket medio: CLP 22.000 por pessoa",
      shortText: "Ideal para jantar especial em Santiago.",
      badge: "Ideal para primeira viagem",
      tags: ["Mais buscados", "Casal", "Premium"],
      rating: 4.8,
      reviewsCount: 312,
      conditions:
        "Valido de segunda a quinta no jantar. Nao cumulativo com outras promocoes.",
      address: "Av. Providencia 1890, Santiago",
      maps: "https://maps.google.com/?q=Av.+Providencia+1890,+Santiago",
      schedule: "12:00 - 23:00",
      validUntil: "2026-12-31",
      recommended: ["Bife ancho", "Empanada de entrada", "Vinho da casa"],
      idealFor:
        "Casais e grupos que querem uma noite especial sem gastar demais.",
      faq: [
        {
          q: "Preciso reservar antes?",
          a: "Sim, recomendamos reserva com pelo menos 24h em finais de semana.",
        },
        {
          q: "Pode usar no almoco?",
          a: "Esse beneficio e valido para o jantar, de segunda a quinta.",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1400&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=1200&q=80",
      ],
      usageLimit: 1,
      active: true,
    },
    {
      id: "cupom-neveandes",
      name: "Neve Andes Day Pass",
      partner: "Neve Andes",
      category: "Neve & Ski",
      district: "Pickup em Providencia",
      discount: "15% OFF no pacote dia completo",
      priceNote: "A partir de CLP 59.900",
      shortText: "Transfer + equipamento com atendimento em portugues.",
      badge: "Parceiro Descola",
      tags: ["Neve", "Familia", "Mais buscados"],
      rating: 4.7,
      reviewsCount: 428,
      conditions: "Vagas limitadas. Reserva com 48h de antecedencia.",
      address: "Pickup em Providencia e Las Condes",
      maps: "https://maps.google.com/?q=Providencia,+Santiago",
      schedule: "05:30 - 21:30",
      validUntil: "2026-09-30",
      recommended: ["Jaqueta impermeavel", "Luvas", "Seguro viagem"],
      idealFor: "Familias e primeira vez na neve.",
      faq: [
        {
          q: "Inclui roupa de neve?",
          a: "Ha opcao com aluguel incluso. Verifique no momento da reserva.",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1400&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1486911278844-a81c5267e227?auto=format&fit=crop&w=1200&q=80",
      ],
      usageLimit: 1,
      active: true,
    },
    {
      id: "cupom-vinaalto",
      name: "Vina Alto Reserva",
      partner: "Vina Alto",
      category: "Vinicolas",
      district: "Valle del Maipo",
      discount: "2x1 na degustacao classica",
      priceNote: "Degustacao a partir de CLP 35.000",
      shortText: "Tour elegante para um dia diferente perto de Santiago.",
      badge: "Verificado",
      tags: ["Experiencias", "Casal", "Premium"],
      rating: 4.9,
      reviewsCount: 189,
      conditions: "Somente para maiores de 18 anos. Nao inclui transfer.",
      address: "Ruta del Vino km 24, Valle del Maipo",
      maps: "https://maps.google.com/?q=Valle+del+Maipo,+Chile",
      schedule: "10:00 - 18:00",
      validUntil: "2026-12-31",
      recommended: ["Tour Reserva", "Degustacao classica", "Loja da vinicola"],
      idealFor: "Casais e grupos que gostam de vinho e paisagem.",
      faq: [],
      image:
        "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1400&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1470158499416-75be9aa0c4db?auto=format&fit=crop&w=1200&q=80",
      ],
      usageLimit: 1,
      active: true,
    },
    {
      id: "cupom-esimglobal",
      name: "eSIM Global Chile",
      partner: "ConectaTrip",
      category: "Cambio & Servicos uteis",
      district: "Online",
      discount: "25% OFF no plano de 10GB",
      priceNote: "Plano final por CLP 18.900",
      shortText:
        "Chegue conectado para usar mapa, Uber e WhatsApp sem estresse.",
      badge: "Mais buscado",
      tags: ["Servicos", "Primeira viagem", "Perto de mim"],
      rating: 4.6,
      reviewsCount: 501,
      conditions: "Ativacao em ate 24 horas apos a compra.",
      address: "Atendimento 100% online",
      maps: "https://maps.google.com/?q=Santiago,+Chile",
      schedule: "24 horas",
      validUntil: "2026-12-31",
      recommended: ["Plano 10GB", "Ativacao antes do embarque"],
      idealFor: "Qualquer viajante que quer internet funcionando no pouso.",
      faq: [],
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=80",
      ],
      usageLimit: 1,
      active: true,
    },
    {
      id: "cupom-transfer-smart",
      name: "Transfer Aeroporto Smart",
      partner: "SkyTransfer",
      category: "Transfers",
      district: "Aeroporto + Centro",
      discount: "12% OFF no transfer ida e volta",
      priceNote: "Pacote por CLP 31.000",
      shortText: "Sem surpresa no primeiro dia: motorista monitorando seu voo.",
      badge: "Verificado",
      tags: ["Primeira viagem", "Familia", "Mais buscados"],
      rating: 4.7,
      reviewsCount: 223,
      conditions: "Valido para reservas com minimo de 24h de antecedencia.",
      address: "SCL Aeroporto -> Santiago",
      maps: "https://maps.google.com/?q=Aeropuerto+SCL",
      schedule: "24 horas",
      validUntil: "2026-12-31",
      recommended: ["Ida e volta", "Assento infantil"],
      idealFor: "Familias e grupos com malas.",
      faq: [],
      image:
        "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1400&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1400&q=80",
      ],
      usageLimit: 1,
      active: true,
    },
    {
      id: "cupom-cafe-andes",
      name: "Cafe Andes Bakery",
      partner: "Cafe Andes",
      category: "Cafes & Doces",
      district: "Lastarria",
      discount: "15% OFF em cafe + doce",
      priceNote: "Combo medio CLP 8.500",
      shortText: "Parada perfeita no centro para descanso com vista charmosa.",
      badge: "Parceiro Descola",
      tags: ["Perto de mim", "Casal"],
      rating: 4.5,
      reviewsCount: 166,
      conditions: "Valido todos os dias ate 18h.",
      address: "Jose Victorino Lastarria 32, Santiago",
      maps: "https://maps.google.com/?q=Jose+Victorino+Lastarria+32,+Santiago",
      schedule: "08:00 - 20:00",
      validUntil: "2026-12-31",
      recommended: ["Flat white", "Tres leches", "Alfajor artesanal"],
      idealFor: "Quem faz roteiro a pe pelo centro.",
      faq: [],
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80",
      ],
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
    couponsActivated: 462,
    conversionRate: 0.54,
    lowConversionCoupons: [
      "Vina Alto Reserva",
      "Cafe Andes Bakery",
      "Transfer Aeroporto Smart",
    ],
    usersByArrivalWeek: [
      { label: "Semana 1", value: 38 },
      { label: "Semana 2", value: 42 },
      { label: "Semana 3", value: 57 },
      { label: "Semana 4", value: 61 },
    ],
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

  const meuChileMock = {
    user: {
      id: "user-001",
      firstName: "Marina",
      tripType: "casal-premium",
      mood: "romance",
      budget: "medio",
      location: "Providencia",
    },
    trip: {
      id: "trip-2026-jul",
      status: "em-andamento",
      destination: "Santiago",
      dateRange: "12 Jul - 19 Jul",
      currentDayLabel: "Dia 3 de 7",
      weatherToday: "ensolarado",
      weatherTomorrow: "neve",
      airQuality: "moderada",
    },
    nextSteps: [
      "Confirmar transfer de subida para cordillera ate 20:00",
      "Ativar cupom de rooftop para hoje a noite",
      "Separar documentos para passeio de neve de amanha",
    ],
    alerts: [
      {
        id: "alert-airbnb-late",
        title: "Chegada tardia no Airbnb",
        message:
          "Seu check-in e depois das 23h? Ja deixa combinado o acesso para evitar espera na rua.",
        level: "high",
        icon: "moon",
        trigger: "hora",
      },
      {
        id: "alert-market-close",
        title: "Supermercados fechando cedo",
        message:
          "Hoje e feriado parcial. Faz compra de agua e snacks antes das 20h.",
        level: "medium",
        icon: "cart",
        trigger: "hora",
      },
      {
        id: "alert-kitchen-close",
        title: "Cozinha do restaurante",
        message: "Alguns restaurantes em Lastarria encerram cozinha as 22:30.",
        level: "medium",
        icon: "fork",
        trigger: "hora",
      },
      {
        id: "alert-snow",
        title: "Neve amanha",
        message:
          "Amanhas previsao de neve alta. Reserve roupa e leve protetor solar hoje.",
        level: "high",
        icon: "snow",
        trigger: "clima",
      },
      {
        id: "alert-traffic-cordillera",
        title: "Transito para cordillera",
        message:
          "Saindo depois das 07:00, o trajeto pode aumentar +40 min. Vale adiantar.",
        level: "medium",
        icon: "traffic",
        trigger: "clima",
      },
      {
        id: "alert-esim",
        title: "Internet instavel",
        message:
          "Seu pacote eSIM esta em 85%. Recomendamos recarga para nao ficar sem mapa.",
        level: "low",
        icon: "signal",
        trigger: "servico",
      },
      {
        id: "alert-money",
        title: "Cambio favoravel agora",
        message:
          "Hoje a cotacao esta melhor que ontem. Se faltar dinheiro fisico, e um bom momento.",
        level: "low",
        icon: "money",
        trigger: "servico",
      },
      {
        id: "alert-safety",
        title: "Seguranca por horario",
        message:
          "Depois das 23h em trecho vazio de Bellavista, prefira carro por app.",
        level: "high",
        icon: "shield",
        trigger: "bairro",
      },
    ],
    itinerary: [
      {
        id: "day-3",
        dayLabel: "Hoje",
        date: "14 Jul",
        blocks: [
          {
            period: "manha",
            items: [
              {
                name: "Brunch leve em Providencia",
                suggestedTime: "09:30",
                distance: "1.2 km",
                eta: "8 min de carro",
                humanTip:
                  "Essa parada e bem Dicas da Pri: energia boa sem perder a manha inteira.",
                ctaLabel: "Ver rota",
                ctaUrl: "https://maps.google.com/?q=Providencia+Santiago",
                discount: "10% OFF parceiro Descola",
              },
            ],
          },
          {
            period: "almoco",
            items: [
              {
                name: "Mercado + empanadas artesanais",
                suggestedTime: "12:45",
                distance: "3.8 km",
                eta: "16 min de carro",
                humanTip:
                  "Chegue antes de 13h para pegar menos fila e escolher mesa boa.",
                ctaLabel: "Reservar",
                ctaUrl: "https://wa.me/56941079792",
                discount: "Beneficio ativo",
              },
            ],
          },
          {
            period: "tarde",
            items: [
              {
                name: "Sky Costanera + cafe",
                suggestedTime: "16:30",
                distance: "2.1 km",
                eta: "11 min de carro",
                humanTip:
                  "Luz de fim de tarde rende fotos lindas da cordillera.",
                ctaLabel: "Abrir checklist",
                ctaUrl: "/sky-costanera.html",
                discount: "Ingresso com fila rapida",
              },
            ],
          },
          {
            period: "noite",
            items: [
              {
                name: "Rooftop com vinho e por do sol",
                suggestedTime: "19:15",
                distance: "2.5 km",
                eta: "13 min de carro",
                humanTip:
                  "Essa dica e puro modo sem perrengue: vista linda e mesa certa.",
                ctaLabel: "Usar beneficio",
                ctaUrl: "/meus-descontos",
                discount: "15% OFF",
              },
            ],
          },
        ],
      },
      {
        id: "day-4",
        dayLabel: "Amanha",
        date: "15 Jul",
        blocks: [
          {
            period: "manha",
            items: [
              {
                name: "Subida para neve",
                suggestedTime: "06:20",
                distance: "42 km",
                eta: "1h 35min",
                humanTip:
                  "Sai cedo e volta mais leve, sem pegar o pico da estrada.",
                ctaLabel: "Confirmar transfer",
                ctaUrl: "/cupom/cupom-neveandes",
                discount: "12% OFF transfer",
              },
            ],
          },
        ],
      },
    ],
    benefits: [
      {
        id: "benefit-restaurant",
        category: "restaurante",
        title: "Jantar premium em Vitacura",
        benefit: "Ate 20% OFF no menu completo",
        status: "ativo",
        ctaLabel: "usar beneficio",
      },
      {
        id: "benefit-transfer",
        category: "transfer",
        title: "Transfer aeroporto + hotel",
        benefit: "Upgrade para bagagem extra",
        status: "proximo",
        ctaLabel: "usar beneficio",
      },
      {
        id: "benefit-neve",
        category: "neve",
        title: "Neve sem stress",
        benefit: "Desconto no pacote + aluguel",
        status: "premium",
        ctaLabel: "usar beneficio",
      },
      {
        id: "benefit-rooftop",
        category: "rooftop",
        title: "Rooftop sunset",
        benefit: "Welcome drink incluso",
        status: "ativo",
        ctaLabel: "usar beneficio",
      },
      {
        id: "benefit-vinicola",
        category: "vinicola",
        title: "Tour em vinicola",
        benefit: "2x1 degustacao classica",
        status: "proximo",
        ctaLabel: "usar beneficio",
      },
      {
        id: "benefit-esim",
        category: "eSIM",
        title: "Internet no desembarque",
        benefit: "25% OFF no plano 10GB",
        status: "ativo",
        ctaLabel: "usar beneficio",
      },
      {
        id: "benefit-insurance",
        category: "seguro viagem",
        title: "Seguro para neve e altitude",
        benefit: "Cobertura com preco parceiro",
        status: "premium",
        ctaLabel: "usar beneficio",
      },
    ],
    moods: [
      "romance",
      "foodie",
      "neve",
      "relax",
      "premium",
      "instagramavel",
      "familia",
    ],
    surprisePlans: {
      romance: "Rooftop + vinho + por do sol em Santiago",
      foodie: "Mercado local + restaurante assinatura + sobremesa autoral",
      neve: "Subida cedo + cafe panoramico + fondue no fim do dia",
      relax: "Spa urbano + brunch sem fila + caminhada em bairro calmo",
      premium: "Transfer privativo + jantar chef table + skyline noturno",
      instagramavel:
        "Murais de Lastarria + rooftop dourado + cafe com vista cinematica",
      familia: "Parque amplo + lanche pratico + passeio curto sem cansaco",
    },
    partnerHighlights: [
      {
        id: "partner-rooftop-1",
        company: "Andes Rooftop Club",
        category: "Rooftop",
        benefit: "Mesa com vista + taqa de cortesia",
        district: "Las Condes",
        status: "premium",
      },
      {
        id: "partner-transfer-1",
        company: "SkyTransfer",
        category: "Transfer",
        benefit: "Motorista em portugues no WhatsApp",
        district: "Aeroporto",
        status: "ativo",
      },
    ],
    contextualRecommendations: [
      {
        id: "ctx-rooftop-sun",
        message:
          "Hoje esta perfeito para rooftop. Ceu aberto e luz linda no fim da tarde.",
        rules: {
          hourRange: [15, 19],
          climate: ["ensolarado", "parcial"],
          location: ["Providencia", "Las Condes"],
          tripType: ["casal-premium", "friends"],
          moods: ["romance", "instagramavel", "premium"],
          budget: ["medio", "alto"],
        },
      },
      {
        id: "ctx-nearby-partner",
        message:
          "Voce esta perto de um parceiro Descola. Vale ativar agora para nao esquecer.",
        rules: {
          hourRange: [11, 22],
          climate: ["ensolarado", "nublado", "parcial"],
          location: ["Providencia", "Lastarria", "Centro"],
          tripType: ["solo", "casal-premium", "familia"],
          moods: ["foodie", "relax", "familia"],
          budget: ["baixo", "medio", "alto"],
        },
      },
      {
        id: "ctx-snow-prepare",
        message:
          "Amanha tem neve: prepara luva, segunda pele e reserva de transporte hoje.",
        rules: {
          hourRange: [10, 21],
          climate: ["nublado", "neve", "frio"],
          location: ["Providencia", "Las Condes", "Centro"],
          tripType: ["familia", "casal-premium", "friends"],
          moods: ["neve", "premium", "familia"],
          budget: ["medio", "alto"],
        },
      },
      {
        id: "ctx-light-plan",
        message: "Tarde livre? Criamos um plano leve pra voces sem correria.",
        rules: {
          hourRange: [13, 17],
          climate: ["ensolarado", "nublado", "parcial"],
          location: ["Providencia", "Lastarria", "Vitacura"],
          tripType: ["casal-premium", "solo", "friends"],
          moods: ["relax", "romance", "instagramavel"],
          budget: ["baixo", "medio", "alto"],
        },
      },
    ],
    dicasPriVoice: [
      "Essa dica e bem Dicas da Pri: vale MUITO se voce quer evitar perrengue.",
      "Respira: seu dia ja esta organizado, e eu cuido dos detalhes chatos por aqui.",
      "Se fizer nessa ordem, voce aproveita mais e gasta menos energia.",
    ],
  };

  function matchesRule(value, allowed) {
    if (!Array.isArray(allowed) || !allowed.length) return true;
    return allowed.includes(value);
  }

  function getContextRecommendations(filters) {
    const state = filters || {};
    return meuChileMock.contextualRecommendations.filter((item) => {
      const rules = item.rules || {};
      const nowHour = Number(state.hour);
      const range = Array.isArray(rules.hourRange) ? rules.hourRange : [0, 23];
      const inHourRange = nowHour >= range[0] && nowHour <= range[1];
      return (
        inHourRange &&
        matchesRule(state.climate, rules.climate) &&
        matchesRule(state.location, rules.location) &&
        matchesRule(state.tripType, rules.tripType) &&
        matchesRule(state.mood, rules.moods) &&
        matchesRule(state.budget, rules.budget)
      );
    });
  }

  function getSurprisePlan(mood) {
    return (
      meuChileMock.surprisePlans[mood] ||
      meuChileMock.surprisePlans[meuChileMock.user.mood]
    );
  }

  function getSavedMeuChileMood() {
    const saved = String(localStorage.getItem(STORAGE_KEYS.meuChileMood) || "");
    return meuChileMock.moods.includes(saved) ? saved : null;
  }

  function getSavedMeuChileCtx() {
    const raw = localStorage.getItem(STORAGE_KEYS.meuChileCtx);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    } catch (_e) {
      // ignore
    }
    return null;
  }

  function saveMeuChileCtx(ctx) {
    if (!ctx || typeof ctx !== "object") return;
    const allowed = { climate: true, location: true, budget: true };
    const toSave = {};
    Object.keys(ctx).forEach((key) => {
      if (allowed[key] && typeof ctx[key] === "string" && ctx[key].trim()) {
        toSave[key] = ctx[key].trim();
      }
    });
    if (Object.keys(toSave).length > 0) {
      localStorage.setItem(STORAGE_KEYS.meuChileCtx, JSON.stringify(toSave));
    }
  }

  async function saveMeuChileMood(mood) {
    const nextMood = String(mood || "").trim();
    if (!nextMood) return false;

    localStorage.setItem(STORAGE_KEYS.meuChileMood, nextMood);

    if (DataProvider && typeof DataProvider.saveMeuChileMood === "function") {
      try {
        await DataProvider.saveMeuChileMood(nextMood);
      } catch (error) {
        console.warn("Supabase mood persistence failed:", error.message);
      }
    }

    return true;
  }

  function getFirstName(userRow) {
    const fullName = String(
      (userRow && (userRow.first_name || userRow.full_name)) || "",
    ).trim();
    if (!fullName) return meuChileMock.user.firstName;
    return fullName.split(" ")[0];
  }

  function formatTripDateRange(startDate, endDate) {
    if (!startDate || !endDate) return meuChileMock.trip.dateRange;
    const formatShortDate = (value) => {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "";
      return date
        .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
        .replace(".", "");
    };

    const startLabel = formatShortDate(startDate);
    const endLabel = formatShortDate(endDate);
    if (!startLabel || !endLabel) return meuChileMock.trip.dateRange;
    return `${startLabel} - ${endLabel}`;
  }

  function buildCurrentDayLabel(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      now < start
    ) {
      return "Pre-viagem";
    }

    const diffDays = Math.max(
      1,
      Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1,
    );
    const totalDays = Math.max(
      1,
      Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1,
    );

    if (now > end) return `Viagem finalizada (${totalDays} dias)`;
    return `Dia ${Math.min(diffDays, totalDays)} de ${totalDays}`;
  }

  function mapAlertSeverityToLevel(severity) {
    const value = String(severity || "").toLowerCase();
    if (value === "high" || value === "alta") return "high";
    if (value === "medium" || value === "media") return "medium";
    return "low";
  }

  function normalizePeriod(period) {
    const value = String(period || "").toLowerCase();
    if (value === "manha") return "manha";
    if (value === "almoco") return "almoco";
    if (value === "tarde") return "tarde";
    if (value === "noite") return "noite";
    return "tarde";
  }

  function toTimelineDateLabel(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date
      .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
      .replace(".", "");
  }

  function deriveNextStepsFromItinerary(itinerary) {
    const firstDay = Array.isArray(itinerary) ? itinerary[0] : null;
    if (!firstDay || !Array.isArray(firstDay.blocks)) return [];

    return firstDay.blocks
      .flatMap((block) => block.items || [])
      .slice(0, 3)
      .map((item) => `Prioridade: ${item.name}`);
  }

  function normalizeBenefitStatusLabel(status) {
    const value = String(status || "").toLowerCase();
    if (value === "active" || value === "ativo") return "ativo";
    if (value === "paused" || value === "pausado") return "pausado";
    if (value === "expired" || value === "expirado") return "expirado";
    return "ativo";
  }

  function normalizePartnerStatusLabel(status) {
    const value = String(status || "").toLowerCase();
    if (value === "active" || value === "ativo") return "ativo";
    if (value === "inactive" || value === "inactivo") return "inactivo";
    return "ativo";
  }

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

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function readCouponStateMap() {
    return readCollection(STORAGE_KEYS.couponState, {});
  }

  function writeCouponStateMap(next) {
    persistCollection(STORAGE_KEYS.couponState, next);
  }

  function readFavorites() {
    return readCollection(STORAGE_KEYS.favorites, []);
  }

  function writeFavorites(next) {
    persistCollection(STORAGE_KEYS.favorites, next);
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
      async logCouponUsage(usageEntry) {
        const { error } = await client.from("coupon_usage").insert({
          client: usageEntry.client,
          coupon: usageEntry.coupon,
          partner: usageEntry.partner,
          datetime: usageEntry.datetime,
          estimated_value: usageEntry.estimatedValue,
          discount_applied: usageEntry.discountApplied,
          estimated_commission: usageEntry.estimatedCommission,
          status: usageEntry.status,
        });
        if (error) throw error;
      },
      async getMeuChileSnapshot(options) {
        const fallback = meuChileMock;
        const queryOptions = options || {};

        try {
          let userRow = null;
          let tripRow = null;

          const {
            data: { session },
            error: sessionError,
          } = await client.auth.getSession();

          if (sessionError) throw sessionError;

          if (session && session.user && session.user.id) {
            const { data: foundUser, error: userError } = await client
              .from("users")
              .select("id, first_name, full_name, auth_user_id")
              .eq("auth_user_id", session.user.id)
              .maybeSingle();

            if (userError) throw userError;
            userRow = foundUser || null;
          }

          if (queryOptions.tripId) {
            const { data: forcedTrip, error: forcedTripError } = await client
              .from("trips")
              .select(
                "id, user_id, destination, trip_type, mood, budget_level, start_date, end_date, status",
              )
              .eq("id", queryOptions.tripId)
              .maybeSingle();

            if (forcedTripError) throw forcedTripError;
            tripRow = forcedTrip || null;
          }

          if (!tripRow && userRow && userRow.id) {
            const { data: userTrips, error: userTripsError } = await client
              .from("trips")
              .select(
                "id, user_id, destination, trip_type, mood, budget_level, start_date, end_date, status",
              )
              .eq("user_id", userRow.id)
              .order("start_date", { ascending: false })
              .limit(1);

            if (userTripsError) throw userTripsError;
            tripRow = (userTrips && userTrips[0]) || null;
          }

          if (!tripRow) {
            const { data: latestTrips, error: latestTripError } = await client
              .from("trips")
              .select(
                "id, user_id, destination, trip_type, mood, budget_level, start_date, end_date, status",
              )
              .order("start_date", { ascending: false })
              .limit(1);

            if (latestTripError) throw latestTripError;
            tripRow = (latestTrips && latestTrips[0]) || null;
          }

          if (!tripRow) return fallback;

          if (!userRow && tripRow.user_id) {
            const { data: tripUser, error: tripUserError } = await client
              .from("users")
              .select("id, first_name, full_name, auth_user_id")
              .eq("id", tripRow.user_id)
              .maybeSingle();

            if (tripUserError) throw tripUserError;
            userRow = tripUser || null;
          }

          const { data: itineraryRows, error: itineraryError } = await client
            .from("itineraries")
            .select(
              "id, day_index, day_label, travel_date, itinerary_items(period, item_order, name, suggested_time, eta_minutes, distance_km, human_tip, cta_label, cta_url, discount_text)",
            )
            .eq("trip_id", tripRow.id)
            .order("day_index", { ascending: true });

          if (itineraryError) throw itineraryError;

          const { data: alertRows, error: alertsError } = await client
            .from("alerts")
            .select("id, alert_type, severity, title, message, trigger_source")
            .eq("trip_id", tripRow.id)
            .order("created_at", { ascending: false })
            .limit(8);

          if (alertsError) throw alertsError;

          const { data: benefitRows, error: benefitsError } = await client
            .from("benefits")
            .select(
              "id, category, title, benefit_text, status, metadata, partner:partners(company)",
            )
            .eq("status", "active")
            .order("created_at", { ascending: false })
            .limit(12);

          if (benefitsError) throw benefitsError;

          const { data: partnerRows, error: partnersError } = await client
            .from("partners")
            .select("id, category, company, district, benefit_summary, status")
            .eq("status", "active")
            .order("company", { ascending: true })
            .limit(8);

          if (partnersError) throw partnersError;

          let preferenceRow = null;
          if (userRow && userRow.id) {
            const { data: prefsData, error: prefsError } = await client
              .from("user_preferences")
              .select("preferred_moods, budget_level")
              .eq("user_id", userRow.id)
              .maybeSingle();

            if (prefsError) throw prefsError;
            preferenceRow = prefsData || null;
          }

          const itinerary = (itineraryRows || []).map((day) => {
            const grouped = {
              manha: [],
              almoco: [],
              tarde: [],
              noite: [],
            };

            const items = (day.itinerary_items || [])
              .slice()
              .sort(
                (a, b) => Number(a.item_order || 0) - Number(b.item_order || 0),
              );

            items.forEach((item) => {
              const period = normalizePeriod(item.period);
              grouped[period].push({
                name: item.name,
                suggestedTime: item.suggested_time
                  ? String(item.suggested_time).slice(0, 5)
                  : "--:--",
                distance:
                  typeof item.distance_km === "number"
                    ? `${Number(item.distance_km).toFixed(1)} km`
                    : "",
                eta:
                  typeof item.eta_minutes === "number"
                    ? `${item.eta_minutes} min`
                    : "",
                humanTip: item.human_tip || "",
                ctaLabel: item.cta_label || "Abrir",
                ctaUrl: item.cta_url || "#",
                discount: item.discount_text || "Sem desconto",
              });
            });

            return {
              id: day.id,
              dayLabel: day.day_label || `Dia ${day.day_index || "-"}`,
              date: toTimelineDateLabel(day.travel_date),
              blocks: [
                { period: "manha", items: grouped.manha },
                { period: "almoco", items: grouped.almoco },
                { period: "tarde", items: grouped.tarde },
                { period: "noite", items: grouped.noite },
              ].filter((block) => block.items.length > 0),
            };
          });

          const alerts = (alertRows || []).map((alert) => ({
            id: alert.id,
            title: alert.title,
            message: alert.message,
            level: mapAlertSeverityToLevel(alert.severity),
            icon: String(alert.alert_type || "info").slice(0, 10) || "info",
            trigger: alert.trigger_source || alert.alert_type || "sistema",
          }));

          const benefits = (benefitRows || []).map((benefit) => {
            const metadata =
              benefit &&
              typeof benefit.metadata === "object" &&
              benefit.metadata
                ? benefit.metadata
                : {};
            const ctaLabel =
              metadata.ctaLabel || metadata.cta_label || "usar beneficio";
            const partnerName =
              benefit.partner && typeof benefit.partner === "object"
                ? benefit.partner.company
                : "";

            return {
              id: benefit.id,
              category: benefit.category || "beneficio",
              title: benefit.title || "Beneficio",
              benefit: benefit.benefit_text || "Beneficio exclusivo Descola.",
              status: normalizeBenefitStatusLabel(benefit.status),
              ctaLabel,
              partner: partnerName,
            };
          });

          const partnerHighlights = (partnerRows || []).map((partner) => ({
            id: partner.id,
            category: partner.category || "parceiro",
            company: partner.company || "Parceiro Descola",
            benefit:
              partner.benefit_summary ||
              "Beneficio especial para comunidade Descola",
            district: partner.district || "Santiago",
            status: normalizePartnerStatusLabel(partner.status),
          }));

          const preferredMood =
            (preferenceRow &&
              Array.isArray(preferenceRow.preferred_moods) &&
              preferenceRow.preferred_moods[0]) ||
            null;

          const normalizedMood =
            tripRow.mood || preferredMood || fallback.user.mood;
          const normalizedBudget =
            tripRow.budget_level ||
            (preferenceRow && preferenceRow.budget_level) ||
            fallback.user.budget;
          const derivedNextSteps = deriveNextStepsFromItinerary(itinerary);

          return {
            ...fallback,
            user: {
              ...fallback.user,
              id: (userRow && userRow.id) || fallback.user.id,
              firstName: getFirstName(userRow),
              tripType: tripRow.trip_type || fallback.user.tripType,
              mood: normalizedMood,
              budget: normalizedBudget,
              location: fallback.user.location,
            },
            trip: {
              ...fallback.trip,
              id: tripRow.id,
              status: tripRow.status || fallback.trip.status,
              destination: tripRow.destination || fallback.trip.destination,
              dateRange: formatTripDateRange(
                tripRow.start_date,
                tripRow.end_date,
              ),
              currentDayLabel: buildCurrentDayLabel(
                tripRow.start_date,
                tripRow.end_date,
              ),
            },
            nextSteps:
              derivedNextSteps.length > 0
                ? derivedNextSteps
                : fallback.nextSteps,
            alerts: alerts.length > 0 ? alerts : fallback.alerts,
            itinerary: itinerary.length > 0 ? itinerary : fallback.itinerary,
            benefits: benefits.length > 0 ? benefits : fallback.benefits,
            partnerHighlights:
              partnerHighlights.length > 0
                ? partnerHighlights
                : fallback.partnerHighlights,
          };
        } catch (error) {
          console.warn("Supabase Meu Chile snapshot failed:", error.message);
          return fallback;
        }
      },
      async saveMeuChileMood(mood) {
        const nextMood = String(mood || "").trim();
        if (!nextMood) return false;

        const {
          data: { session },
          error: sessionError,
        } = await client.auth.getSession();

        if (sessionError) throw sessionError;
        if (!session || !session.user || !session.user.id) return false;

        const { data: userRow, error: userError } = await client
          .from("users")
          .select("id")
          .eq("auth_user_id", session.user.id)
          .maybeSingle();

        if (userError) throw userError;
        if (!userRow || !userRow.id) return false;

        const { data: existingPrefs, error: prefsError } = await client
          .from("user_preferences")
          .select("preferred_moods")
          .eq("user_id", userRow.id)
          .maybeSingle();

        if (prefsError) throw prefsError;

        const currentMoods = Array.isArray(existingPrefs?.preferred_moods)
          ? existingPrefs.preferred_moods
          : [];
        const mergedMoods = [
          nextMood,
          ...currentMoods.filter((item) => item !== nextMood),
        ].slice(0, 5);

        const { error: upsertError } = await client
          .from("user_preferences")
          .upsert({
            user_id: userRow.id,
            preferred_moods: mergedMoods,
          });

        if (upsertError) throw upsertError;
        return true;
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
    async logCouponUsage() {
      return;
    },
    async getMeuChileSnapshot() {
      return meuChileMock;
    },
    async saveMeuChileMood() {
      return true;
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

  function activateCoupon(couponId, purchase) {
    if (!purchase || !couponId) return null;

    const stateMap = readCouponStateMap();
    const existing = stateMap[couponId];
    if (existing && existing.activationCode) {
      return existing;
    }

    const now = new Date();
    const activationCode = `${purchase.code}-${slugify(couponId).slice(0, 6)}`
      .toUpperCase()
      .slice(0, 22);
    const expiresAt = purchase.departure;

    const next = {
      couponId,
      status: "ativo",
      activatedAt: now.toISOString(),
      expiresAt,
      activationCode,
      usageCount: 0,
      lastUsedAt: null,
    };

    stateMap[couponId] = next;
    writeCouponStateMap(stateMap);
    return next;
  }

  function markCouponUsed(couponId) {
    const stateMap = readCouponStateMap();
    const current = stateMap[couponId];
    if (!current) return null;

    const next = {
      ...current,
      status: "usado",
      usageCount: Number(current.usageCount || 0) + 1,
      lastUsedAt: new Date().toISOString(),
    };

    stateMap[couponId] = next;
    writeCouponStateMap(stateMap);
    return next;
  }

  function getUserCoupons(purchase, list) {
    const stateMap = readCouponStateMap();
    return (list || []).map((coupon) => {
      const state = stateMap[coupon.id] || null;
      const isActive = Boolean(state && state.status === "ativo");
      const isUsed = Boolean(state && state.status === "usado");
      return {
        ...coupon,
        activation: state,
        accessStatus: !purchase
          ? "locked"
          : isUsed
            ? "used"
            : isActive
              ? "active"
              : "available",
      };
    });
  }

  function toggleFavorite(couponId) {
    const list = readFavorites();
    const exists = list.includes(couponId);
    const next = exists
      ? list.filter((item) => item !== couponId)
      : [...list, couponId];
    writeFavorites(next);
    return next;
  }

  function getFavorites() {
    return readFavorites();
  }

  function getPartnerInsights(partnerId) {
    const list = partners;
    const partner = list.find((item) => item.id === partnerId) || list[0];
    const partnerUsage = couponUsage.filter(
      (u) => u.partner === partner.company,
    );
    const estimatedSold = partnerUsage.reduce(
      (total, row) => total + Number(row.estimatedValue || 0),
      0,
    );
    const totalDiscountDelivered = partnerUsage.reduce((total, row) => {
      const percent = Number(
        String(row.discountApplied || "").replace(/[^0-9]/g, ""),
      );
      return total + Number(row.estimatedValue || 0) * (percent / 100 || 0);
    }, 0);

    return {
      partner,
      metrics: {
        customersFromDescola: partnerUsage.length,
        usedCoupons: partnerUsage.length,
        estimatedSold,
        totalDiscountDelivered,
        bestHours: ["12:00-14:00", "19:00-22:00"],
      },
      feedback: [
        "Cliente brasileiro chegou decidido e gastou acima do ticket medio.",
        "Equipe gostou de validar QR direto no celular.",
      ],
      recommendations: [
        "Testar beneficio de segunda a quarta para aumentar ocupacao em dias fracos.",
        "Adicionar foto de pratos/servico no horario de pico para melhorar conversao.",
      ],
    };
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
    activateCoupon,
    markCouponUsed,
    getUserCoupons,
    toggleFavorite,
    getFavorites,
    getPartnerInsights,
    meuChileMock,
    getSavedMeuChileMood,
    saveMeuChileMood,
    getSavedMeuChileCtx,
    saveMeuChileCtx,
    async getMeuChileSnapshot(options) {
      if (
        DataProvider &&
        typeof DataProvider.getMeuChileSnapshot === "function"
      ) {
        return DataProvider.getMeuChileSnapshot(options);
      }
      return meuChileMock;
    },
    getContextRecommendations,
    getSurprisePlan,
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
