"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ───────── Menu Data ───────── */

interface MenuItem {
  name: string;
  description: string;
  price: string;
  emoji: string;
}

interface MenuCategory {
  id: string;
  title: string;
  icon: string;
  items: MenuItem[];
}

const menuData: MenuCategory[] = [
  {
    id: "baslangic",
    title: "Başlangıçlar",
    icon: "🥗",
    items: [
      {
        name: "Mercimek Çorbası",
        description: "Geleneksel kırmızı mercimek çorbası, limon ve kıtır ekmek ile",
        price: "120",
        emoji: "🍲",
      },
      {
        name: "Humus",
        description: "Nohut ezmesi, tahin, zeytinyağı ve kırmızı biber",
        price: "110",
        emoji: "🫘",
      },
      {
        name: "Atom",
        description: "Bol acılı ince kıyım ezme, nar ekşisi ve baharatlar",
        price: "100",
        emoji: "🌶️",
      },
      {
        name: "Cacık",
        description: "Yoğurt, salatalık, nane ve sarımsak",
        price: "90",
        emoji: "🥒",
      },
      {
        name: "Sigara Böreği",
        description: "Çıtır yufka içinde beyaz peynir ve maydanoz",
        price: "130",
        emoji: "🥟",
      },
      {
        name: "Mevsim Salata",
        description: "Taze mevsim yeşillikleri, domates, salatalık, nar ekşili sos",
        price: "110",
        emoji: "🥬",
      },
    ],
  },
  {
    id: "ara-sicak",
    title: "Ara Sıcaklar",
    icon: "🍳",
    items: [
      {
        name: "Kaşarlı Mantar Sote",
        description: "Tereyağında sote edilmiş mantar, kaşar peyniri ile",
        price: "150",
        emoji: "🍄",
      },
      {
        name: "Patates Kızartması",
        description: "Çıtır patates, özel baharat karışımı ve ranch sos",
        price: "100",
        emoji: "🍟",
      },
      {
        name: "Halloumi Izgara",
        description: "Izgarada pişirilmiş hellim peyniri, bal ve susam ile",
        price: "160",
        emoji: "🧀",
      },
      {
        name: "Kanat",
        description: "Baharatlı tavuk kanatları, acılı sos ve mavi peynir dip",
        price: "180",
        emoji: "🍗",
      },
      {
        name: "Falafel",
        description: "Nohut köftesi, tahin sos ve taze yeşillikler",
        price: "130",
        emoji: "🧆",
      },
    ],
  },
  {
    id: "ana-yemek",
    title: "Ana Yemekler",
    icon: "🥩",
    items: [
      {
        name: "Izgara Köfte",
        description: "El yapımı dana köfte, közlenmiş biber ve pilav ile",
        price: "280",
        emoji: "🔥",
      },
      {
        name: "Tavuk Şiş",
        description: "Marine edilmiş tavuk göğsü, sebze ızgara ve lavaş",
        price: "250",
        emoji: "🍢",
      },
      {
        name: "Kuzu Pirzola",
        description: "Fırında kuzu pirzola, biberiye ve fırın patates ile",
        price: "450",
        emoji: "🍖",
      },
      {
        name: "Levrek Izgara",
        description: "Taze levrek, roka salata ve limon sos ile",
        price: "380",
        emoji: "🐟",
      },
      {
        name: "Karışık Izgara",
        description: "Köfte, tavuk, kuzu pirzola, közlenmiş sebzeler ve pilav",
        price: "520",
        emoji: "🥘",
      },
      {
        name: "Mantarlı Risotto",
        description: "Kremalı arborio pirinci, karışık mantar ve parmesan",
        price: "240",
        emoji: "🍚",
      },
      {
        name: "Biftek",
        description: "250gr dana biftek, tereyağı sos ve patates püresi ile",
        price: "480",
        emoji: "🥩",
      },
    ],
  },
  {
    id: "icecekler",
    title: "İçecekler",
    icon: "🍹",
    items: [
      {
        name: "Türk Kahvesi",
        description: "Geleneksel Türk kahvesi, lokum ile servis edilir",
        price: "70",
        emoji: "☕",
      },
      {
        name: "Taze Limonata",
        description: "Taze sıkılmış limon, nane ve buz",
        price: "80",
        emoji: "🍋",
      },
      {
        name: "Ayran",
        description: "Geleneksel yoğurt içeceği",
        price: "50",
        emoji: "🥛",
      },
      {
        name: "Çay",
        description: "Demlik çay, ince belli bardakta servis edilir",
        price: "30",
        emoji: "🍵",
      },
      {
        name: "Meyve Suyu",
        description: "Portakal, şeftali veya vişne — taze sıkım",
        price: "90",
        emoji: "🧃",
      },
      {
        name: "Smoothie",
        description: "Muz, çilek, yaban mersini ve yoğurt karışımı",
        price: "120",
        emoji: "🫐",
      },
      {
        name: "Meşrubat",
        description: "Kola, Fanta, Sprite — 330ml",
        price: "60",
        emoji: "🥤",
      },
      {
        name: "Su",
        description: "Doğal kaynak suyu — 500ml",
        price: "20",
        emoji: "💧",
      },
    ],
  },
];

/* ───────── Component ───────── */

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>("baslangic");
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  /* Auto-scroll nav to keep active tab visible */
  const scrollActiveTabIntoView = useCallback((categoryId: string) => {
    const nav = navRef.current;
    if (!nav) return;
    const activeBtn = nav.querySelector(`[data-category="${categoryId}"]`) as HTMLElement | null;
    if (!activeBtn) return;
    const navRect = nav.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    const scrollLeft = activeBtn.offsetLeft - navRect.width / 2 + btnRect.width / 2;
    nav.scrollTo({ left: scrollLeft, behavior: "smooth" });
  }, []);

  /* Track scroll position for nav shadow */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Update active tab on scroll via IntersectionObserver */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    menuData.forEach((cat) => {
      const el = document.getElementById(cat.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveCategory(cat.id);
            scrollActiveTabIntoView(cat.id);
          }
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [scrollActiveTabIntoView]);

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      {/* ─── Hero Header ─── */}
      <header className="hero-gradient relative overflow-hidden px-4 pt-12 pb-6 text-center">
        {/* Decorative blurred circles */}
        <div
          className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--accent), transparent)" }}
        />
        <div
          className="pointer-events-none absolute -right-16 top-10 h-48 w-48 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--accent-light), transparent)" }}
        />

        <div className="animate-fade-in-up relative z-10">
          <div className="animate-float mx-auto mb-4 text-5xl">🍽️</div>
          <h1
            className="mb-2 text-4xl font-bold tracking-tight sm:text-5xl"
            style={{ fontFamily: "var(--font-playfair), serif", color: "var(--foreground)" }}
          >
            Lezzet Durağı
          </h1>
          <p className="text-sm tracking-widest uppercase" style={{ color: "var(--accent)" }}>
            — Dijital Menü —
          </p>
          <p className="mx-auto mt-3 max-w-xs text-sm" style={{ color: "var(--text-secondary)" }}>
            Taze malzemeler ile hazırlanan özel lezzetlerimizi keşfedin
          </p>
        </div>
      </header>

      {/* ─── Sticky Category Nav ─── */}
      <nav
        className="nav-sticky transition-shadow duration-300"
        style={{ boxShadow: isScrolled ? "0 4px 24px rgba(0,0,0,0.4)" : "none" }}
      >
        <div ref={navRef} className="hide-scrollbar flex gap-2 overflow-x-auto px-4 py-3 sm:justify-center">
          {menuData.map((cat) => (
            <button
              key={cat.id}
              data-category={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`tab-btn flex items-center gap-2 ${activeCategory === cat.id ? "active" : ""
                }`}
            >
              <span className="text-lg">{cat.icon}</span>
              <span className="hidden sm:inline">{cat.title}</span>
              <span className="sm:hidden">{cat.title.replace("lar", "").replace("ler", "")}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ─── Menu Sections ─── */}
      <main className="mx-auto max-w-2xl px-4 py-8">
        {menuData.map((category, catIdx) => (
          <section key={category.id} id={category.id} className="mb-14">
            {/* Section Header */}
            <div className="section-divider animate-fade-in-up">
              <h2
                className="flex items-center gap-3 whitespace-nowrap text-xl font-semibold sm:text-2xl"
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  color: "var(--foreground)",
                }}
              >
                <span className="category-icon">{category.icon}</span>
                {category.title}
              </h2>
            </div>

            {/* Items Grid */}
            <div className="flex flex-col gap-3">
              {category.items.map((item, idx) => (
                <div
                  key={item.name}
                  className={`glass-card animate-fade-in-up delay-${Math.min(idx + 1, 8)} flex items-start gap-4 p-4`}
                >
                  {/* Emoji */}
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
                    style={{ background: "var(--accent-glow)" }}
                  >
                    {item.emoji}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3
                        className="text-base font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        {item.name}
                      </h3>
                      <span className="price-tag shrink-0">₺{item.price}</span>
                    </div>
                    <p
                      className="mt-1 text-sm leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtle shimmer divider between categories */}
            {catIdx < menuData.length - 1 && (
              <div className="animate-shimmer mt-10 h-px w-full rounded-full" />
            )}
          </section>
        ))}
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t px-4 py-8 text-center" style={{ borderColor: "var(--card-border)" }}>
        <div className="animate-float mb-3 text-3xl">🍽️</div>
        <p
          className="text-lg font-semibold"
          style={{ fontFamily: "var(--font-playfair), serif", color: "var(--foreground)" }}
        >
          Lezzet Durağı
        </p>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Afiyet olsun! 🤍
        </p>
        <div className="mx-auto mt-4 flex items-center justify-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
          <span>📍 İstanbul</span>
          <span>•</span>
          <span>📞 0212 123 45 67</span>
          <span>•</span>
          <span>🕐 10:00 – 23:00</span>
        </div>
        <p className="mt-6 text-xs" style={{ color: "var(--text-muted)" }}>
          © 2026 Lezzet Durağı — Tüm hakları saklıdır.
        </p>
      </footer>
    </div>
  );
}
