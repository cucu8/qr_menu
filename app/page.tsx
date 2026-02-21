"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ───────── Menu Data ───────── */

interface MenuItem {
  name: string;
  description: string;
  price: string;
  price2?: string;
  emoji: string;
}

interface MenuCategory {
  id: string;
  title: string;
  icon: string;
  priceLabels?: [string, string];
  items: MenuItem[];
}

const menuData: MenuCategory[] = [
  {
    id: "efsane-menuler",
    title: "Efsane Menüler",
    icon: "🔥",
    items: [
      {
        name: "Efsane Köfte",
        description: "200gr. Köfte, Salata, Ezme, İkram",
        price: "300",
        emoji: "🥩",
      },
      {
        name: "Efsane Sucuk",
        description: "200gr. Sucuk, Salata, Ezme, İkram",
        price: "300",
        emoji: "🌭",
      },
      {
        name: "Efsane Köfte Sucuk Karışık",
        description: "250gr. Salata, Ezme, İkram",
        price: "350",
        emoji: "🍖",
      },
      {
        name: "Günün Çorbası",
        description: "Her gün taze hazırlanan çorba",
        price: "100",
        emoji: "🍲",
      },
    ],
  },
  {
    id: "ekmek-arasi",
    title: "Ekmek Arası",
    icon: "🥖",
    priceLabels: ["Yarım", "Üç Çeyrek"],
    items: [
      {
        name: "Sucuk Ekmek",
        description: "100gr. Sucuk, Domates, Turşu",
        price: "100",
        price2: "150",
        emoji: "🌭",
      },
      {
        name: "Köfte Ekmek",
        description: "80gr. 4 Adet Köfte, Domates, Turşu, İsteğe Göre Soğan, Özel Sos",
        price: "150",
        price2: "225",
        emoji: "🥩",
      },
      {
        name: "Tavuk Döner Ekmek Arası",
        description: "80gr. Döner, Domates, Turşu, Soğan, Marul",
        price: "150",
        price2: "225",
        emoji: "🍗",
      },
      {
        name: "İzmir Kumru",
        description: "Sosis, Kaşar Peyniri, Turşu, Domates, Ketçap, Mayonez",
        price: "150",
        price2: "200",
        emoji: "🥪",
      },
      {
        name: "Patso",
        description: "Patates, Sosis, Ketçap, Mayonez",
        price: "150",
        price2: "200",
        emoji: "🍟",
      },
      {
        name: "Ekmek Arası Çıtır Tavuk",
        description: "120gr. Çıtır Tavuk, Domates, Turşu, Soğan",
        price: "150",
        price2: "200",
        emoji: "🍗",
      },
    ],
  },
  {
    id: "burgerler",
    title: "Burgerler",
    icon: "🍔",
    items: [
      {
        name: "Gocaman Burger Menü + Ayran",
        description: "130gr Köfte, Cheddar Peyniri, Turşu, Marul, Özel Burger Sos, Domates, Patates Kızartması",
        price: "300",
        emoji: "🍔",
      },
      {
        name: "Gocaman Burger Menü + Kola",
        description: "130gr Köfte, Cheddar Peyniri, Turşu, Marul, Özel Burger Sos, Domates, Patates Kızartması",
        price: "350",
        emoji: "🍔",
      },
      {
        name: "Gocaman CheeseBurger Menü + Ayran",
        description: "180gr Köfte, Bol Cheddar Peyniri, Turşu, Marul, Özel Burger Sos, Domates, Patates Kızartması",
        price: "325",
        emoji: "🧀",
      },
      {
        name: "Gocaman CheeseBurger Menü + Kola",
        description: "130gr Köfte, Bol Cheddar Peyniri, Turşu, Marul, Özel Burger Sos, Domates, Patates Kızartması",
        price: "375",
        emoji: "🧀",
      },
      {
        name: "Çift Etli Burger Menü + Ayran",
        description: "180gr Köfte, Turşu, Cheddar Peyniri, Marul, Özel Burger Sos, Domates, Patates Kızartması",
        price: "400",
        emoji: "🔥",
      },
      {
        name: "Tavuk Burger Menü + Ayran",
        description: "180gr Tavuk, Cheddar Peyniri, Marul, Özel Burger Sos, Domates, Patates Kızartması",
        price: "250",
        emoji: "🐔",
      },
      {
        name: "Sucuk Burger Menü + Ayran",
        description: "Sucuk, Cheddar Peyniri, Marul, Özel Burger Sos, Domates, Patates Kızartması",
        price: "250",
        emoji: "🌭",
      },
    ],
  },
  {
    id: "durumler",
    title: "Dürümler",
    icon: "🌯",
    items: [
      {
        name: "Tavuk Dürüm + Patates Kızartması",
        description: "80gr. Döner, Domates, Turşu, Soğan, Marul",
        price: "170",
        emoji: "🍗",
      },
      {
        name: "Köfte Dürüm + Patates Kızartması",
        description: "80gr. 4 Adet Köfte, Domates, Turşu, İsteğe Göre Soğan, Özel Sos",
        price: "200",
        emoji: "🥩",
      },
      {
        name: "Sucuk Dürüm + Patates Kızartması",
        description: "100gr. Sucuk, Domates, Turşu",
        price: "150",
        emoji: "🌭",
      },
      {
        name: "Kumru Dürüm + Patates Kızartması",
        description: "Sosis, kaşar peyniri, turşu, domates",
        price: "170",
        emoji: "🥪",
      },
    ],
  },
  {
    id: "aparatifler",
    title: "Aparatifler",
    icon: "🍟",
    items: [
      {
        name: "Patates Kızartması Küçük Boy",
        description: "Çıtır patates kızartması",
        price: "100",
        emoji: "🍟",
      },
      {
        name: "Patates Kızartması Büyük Boy",
        description: "Bol porsiyonlu çıtır patates",
        price: "175",
        emoji: "🍟",
      },
      {
        name: "Çıtır Tavuk 8'li Patatesli",
        description: "8 adet çıtır tavuk parçası, patates kızartması ile",
        price: "275",
        emoji: "🍗",
      },
    ],
  },
  {
    id: "tostlar",
    title: "Tostlar",
    icon: "🧀",
    items: [
      {
        name: "Kaşarlı Tost",
        description: "Kaşar peynirli klasik tost",
        price: "100",
        emoji: "🧀",
      },
      {
        name: "Sucuklu Kaşarlı Tost",
        description: "Sucuk ve kaşar peynirli tost",
        price: "150",
        emoji: "🌭",
      },
    ],
  },
  {
    id: "kahvalti",
    title: "Kahvaltı",
    icon: "🍳",
    items: [
      {
        name: "Serpme Kahvaltı",
        description: "Kişi başı fiyatıdır, en az iki kişilik servis açılır",
        price: "450",
        emoji: "🥐",
      },
      {
        name: "Kahvaltı Tabağı",
        description: "Zengin kahvaltı tabağı",
        price: "300",
        emoji: "🍳",
      },
      {
        name: "Sucuklu Yumurta",
        description: "Sucuk ve yumurta",
        price: "200",
        emoji: "🥚",
      },
      {
        name: "Sucuklu Menemen",
        description: "Sucuklu menemen",
        price: "200",
        emoji: "🍅",
      },
    ],
  },
  {
    id: "icecekler-tatlilar",
    title: "İçecekler & Tatlılar",
    icon: "🥤",
    items: [
      {
        name: "Büyük Ayran",
        description: "Soğuk içecek",
        price: "70",
        emoji: "🥛",
      },
      {
        name: "Coca Cola",
        description: "Soğuk içecek",
        price: "70",
        emoji: "🥤",
      },
      {
        name: "Fanta",
        description: "Soğuk içecek",
        price: "70",
        emoji: "🥤",
      },
      {
        name: "Sprite",
        description: "Soğuk içecek",
        price: "70",
        emoji: "🥤",
      },
      {
        name: "Cappy Çeşit",
        description: "Soğuk içecek",
        price: "70",
        emoji: "🧃",
      },
      {
        name: "Fuse Tea Çeşit",
        description: "Soğuk içecek",
        price: "70",
        emoji: "🧃",
      },
      {
        name: "Meyveli Soda Çeşitleri",
        description: "Soğuk içecek",
        price: "50",
        emoji: "🫧",
      },
      {
        name: "Beypazarı Soda",
        description: "Soğuk içecek",
        price: "30",
        emoji: "🫧",
      },
      {
        name: "Şalgam Suyu",
        description: "Soğuk içecek",
        price: "40",
        emoji: "🥤",
      },
      {
        name: "Su (250ml)",
        description: "Su",
        price: "15",
        emoji: "💧",
      },
      {
        name: "Çay",
        description: "Demlik çay",
        price: "20",
        emoji: "🍵",
      },
      {
        name: "Türk Kahvesi",
        description: "Geleneksel Türk kahvesi",
        price: "80",
        emoji: "☕",
      },
      {
        name: "Sütlü Kahve",
        description: "Sıcak içecek",
        price: "80",
        emoji: "☕",
      },
      {
        name: "Çikolatalı Sufle",
        description: "Tatlı",
        price: "200",
        emoji: "🍫",
      },
      {
        name: "Palyaço",
        description: "Tatlı",
        price: "150",
        emoji: "🍨",
      },
    ],
  },
];

/* ───────── Component ───────── */

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>("efsane-menuler");
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
        { rootMargin: "-30% 0px -65% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [scrollActiveTabIntoView]);

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    scrollActiveTabIntoView(id);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      {/* ─── Hero Header ─── */}
      <header className="hero-gradient relative overflow-hidden px-4 pt-10 pb-5 text-center">
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
          <div className="animate-float mx-auto mb-3 text-4xl">🌶️</div>
          <h1
            className="mb-1 text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ fontFamily: "var(--font-playfair), serif", color: "var(--foreground)" }}
          >
            Karabiber Express
          </h1>
          <p className="text-xs tracking-widest uppercase" style={{ color: "var(--accent)" }}>
            — Kastamonu Sucuk Dükkanı —
          </p>
          <p className="mx-auto mt-2 max-w-xs text-sm" style={{ color: "var(--text-secondary)" }}>
            Lezzetin adresi • Cide / Kastamonu
          </p>
        </div>
      </header>

      {/* ─── Sticky Category Nav ─── */}
      <nav
        className="nav-sticky transition-shadow duration-300"
        style={{ boxShadow: isScrolled ? "0 4px 24px rgba(0,0,0,0.4)" : "none" }}
      >
        <div ref={navRef} className="hide-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
          {menuData.map((cat) => (
            <button
              key={cat.id}
              data-category={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`tab-btn flex items-center gap-1.5 ${activeCategory === cat.id ? "active" : ""
                }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span className="text-xs sm:text-sm">{cat.title}</span>
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

            {/* Dual price labels */}
            {category.priceLabels && (
              <div
                className="mb-3 flex justify-end gap-6 pr-4 text-xs font-medium"
                style={{ color: "var(--accent)" }}
              >
                <span>{category.priceLabels[0]}</span>
                <span>{category.priceLabels[1]}</span>
              </div>
            )}

            {/* Items */}
            <div className="flex flex-col gap-3">
              {category.items.map((item, idx) => (
                <div
                  key={item.name}
                  className={`glass-card animate-fade-in-up delay-${Math.min(idx + 1, 8)} flex items-start gap-4 p-4`}
                >
                  {/* Emoji */}
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                    style={{ background: "var(--accent-glow)" }}
                  >
                    {item.emoji}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3
                        className="text-sm font-semibold sm:text-base"
                        style={{ color: "var(--foreground)" }}
                      >
                        {item.name}
                      </h3>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="price-tag text-sm sm:text-base">₺{item.price}</span>
                        {item.price2 && (
                          <span className="price-tag text-sm sm:text-base">₺{item.price2}</span>
                        )}
                      </div>
                    </div>
                    <p
                      className="mt-1 text-xs leading-relaxed sm:text-sm"
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
        <div className="animate-float mb-3 text-3xl">🌶️</div>
        <p
          className="text-lg font-semibold"
          style={{ fontFamily: "var(--font-playfair), serif", color: "var(--foreground)" }}
        >
          Karabiber Express
        </p>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Afiyet olsun! 🤍
        </p>
        <div className="mx-auto mt-4 flex flex-col items-center gap-2 text-xs sm:flex-row sm:justify-center sm:gap-4" style={{ color: "var(--text-muted)" }}>
          <span>📍 Nasuh Mah. Murat Yeni Gün Cad. No:45/1 Cide / Kastamonu</span>
        </div>
        <div className="mx-auto mt-2 flex items-center justify-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
          <span>📞 0543 553 76 37</span>
          <span>•</span>
          <span>🌐 sucukdukkani.com</span>
        </div>
        <p className="mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
          Ara Gelsin! 🛵
        </p>
      </footer>
    </div>
  );
}
