"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { fetchMenu, STATIC_BASE } from "../../lib/api";
import type { RestaurantMenu, MenuCategory } from "../../lib/api";
import { use } from "react";

/* ── Helper: slug-safe id for sections ── */
function catSectionId(id: string) {
    return `cat-${id}`;
}

export default function MenuPage({
    params,
}: {
    params: Promise<{ restaurantId: string }>;
}) {
    const { restaurantId } = use(params);

    const [menu, setMenu] = useState<RestaurantMenu | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>("");
    const [isScrolled, setIsScrolled] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

    /* ── Fetch menu data ── */
    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setNotFound(false);
        setError(false);

        fetchMenu(restaurantId)
            .then((data) => {
                if (controller.signal.aborted) return;
                if (!data) {
                    setNotFound(true);
                } else {
                    setMenu(data);
                    if (data.menuCategories.length > 0) {
                        setActiveCategory(data.menuCategories[0].id);
                    }
                }
            })
            .catch(() => {
                if (!controller.signal.aborted) setError(true);
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });

        return () => controller.abort();
    }, [restaurantId]);

    /* ── Scroll shadow ── */
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 60);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /* ── Auto-scroll nav tab into view ── */
    const scrollActiveTabIntoView = useCallback((catId: string) => {
        const nav = navRef.current;
        if (!nav) return;
        const btn = nav.querySelector(`[data-category="${catId}"]`) as HTMLElement | null;
        if (!btn) return;
        const navRect = nav.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        nav.scrollTo({ left: btn.offsetLeft - navRect.width / 2 + btnRect.width / 2, behavior: "smooth" });
    }, []);

    /* ── IntersectionObserver: update active tab on scroll ── */
    useEffect(() => {
        if (!menu) return;
        const observers: IntersectionObserver[] = [];

        menu.menuCategories.forEach((cat) => {
            const el = document.getElementById(catSectionId(cat.id));
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
    }, [menu, scrollActiveTabIntoView]);

    const scrollToCategory = (id: string) => {
        setActiveCategory(id);
        scrollActiveTabIntoView(id);
        document.getElementById(catSectionId(id))?.scrollIntoView({ behavior: "smooth" });
    };

    /* ── States ── */
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
                <div style={{ color: "var(--text-secondary)", fontSize: 16 }}>Menü yükleniyor...</div>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--background)" }}>
                <div style={{ fontSize: 48 }}>🔍</div>
                <p style={{ color: "var(--foreground)", fontSize: 20, fontWeight: 700 }}>Restoran bulunamadı</p>
                <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Bu QR kod geçersiz olabilir.</p>
            </div>
        );
    }

    if (error || !menu) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--background)" }}>
                <div style={{ fontSize: 48 }}>⚠️</div>
                <p style={{ color: "var(--foreground)", fontSize: 20, fontWeight: 700 }}>Menü yüklenemedi</p>
                <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Lütfen daha sonra tekrar deneyin.</p>
            </div>
        );
    }

    const categories = menu.menuCategories.filter((c) => c.isActive);

    return (
        <div className="min-h-screen" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            {/* ─── Hero Header ─── */}
            <header className="hero-gradient relative overflow-hidden px-4 pt-10 pb-5 text-center">
                <div
                    className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full opacity-20 blur-3xl"
                    style={{ background: "radial-gradient(circle, var(--accent), transparent)" }}
                />
                <div
                    className="pointer-events-none absolute -right-16 top-10 h-48 w-48 rounded-full opacity-10 blur-3xl"
                    style={{ background: "radial-gradient(circle, var(--accent-light), transparent)" }}
                />

                <div className="animate-fade-in-up relative z-10">
                    {/* Logo or emoji */}
                    <div className="animate-float mx-auto mb-3">
                        {menu.logoUrl ? (
                            <img
                                src={`${STATIC_BASE}${menu.logoUrl}`}
                                alt={menu.name}
                                className="mx-auto h-16 w-16 rounded-2xl object-cover"
                                style={{ border: "2px solid rgba(165,180,252,.3)" }}
                            />
                        ) : (
                            <div className="text-4xl">🍽️</div>
                        )}
                    </div>

                    <h1
                        className="mb-1 text-3xl font-bold tracking-tight sm:text-4xl"
                        style={{ fontFamily: "var(--font-playfair), serif", color: "var(--foreground)" }}
                    >
                        {menu.name}
                    </h1>

                    {menu.description && (
                        <p className="text-xs tracking-widest uppercase" style={{ color: "var(--accent)" }}>
                            — {menu.description} —
                        </p>
                    )}

                    {menu.address && (
                        <p className="mx-auto mt-2 max-w-xs text-sm" style={{ color: "var(--text-secondary)" }}>
                            📍 {menu.address}
                        </p>
                    )}
                </div>
            </header>

            {/* ─── Sticky Category Nav ─── */}
            {categories.length > 0 && (
                <nav
                    className="nav-sticky transition-shadow duration-300"
                    style={{ boxShadow: isScrolled ? "0 4px 24px rgba(0,0,0,0.4)" : "none" }}
                >
                    <div ref={navRef} className="hide-scrollbar flex gap-2 overflow-x-auto px-4 py-3 sm:justify-center">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                data-category={cat.id}
                                onClick={() => scrollToCategory(cat.id)}
                                className={`tab-btn flex items-center gap-1.5 ${activeCategory === cat.id ? "active" : ""}`}
                            >
                                {cat.photoUrl ? (
                                    <img
                                        src={`${STATIC_BASE}${cat.photoUrl}`}
                                        alt=""
                                        className="h-5 w-5 rounded object-cover"
                                    />
                                ) : (
                                    <span className="text-base">🍴</span>
                                )}
                                <span className="text-xs sm:text-sm">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </nav>
            )}

            {/* ─── Menu Sections ─── */}
            <main className="mx-auto max-w-2xl px-4 py-8">
                {categories.length === 0 ? (
                    <div className="py-20 text-center" style={{ color: "var(--text-secondary)" }}>
                        Henüz menü kategorisi eklenmemiş.
                    </div>
                ) : (
                    categories.map((cat: MenuCategory, catIdx: number) => {
                        const products = cat.products.filter((p) => p.isAvailable);
                        return (
                            <section key={cat.id} id={catSectionId(cat.id)} className="mb-14">
                                {/* Section Header */}
                                <div className="section-divider animate-fade-in-up">
                                    <h2
                                        className="flex items-center gap-3 whitespace-nowrap text-xl font-semibold sm:text-2xl"
                                        style={{ fontFamily: "var(--font-playfair), serif", color: "var(--foreground)" }}
                                    >
                                        {cat.photoUrl ? (
                                            <img
                                                src={`${STATIC_BASE}${cat.photoUrl}`}
                                                alt=""
                                                className="category-icon h-8 w-8 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <span className="category-icon">🍴</span>
                                        )}
                                        {cat.name}
                                    </h2>
                                    {cat.description && (
                                        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                                            {cat.description}
                                        </p>
                                    )}
                                </div>

                                {/* Products */}
                                <div className="flex flex-col gap-3">
                                    {products.length === 0 ? (
                                        <p className="py-4 text-sm" style={{ color: "var(--text-muted)" }}>
                                            Bu kategoride ürün bulunmuyor.
                                        </p>
                                    ) : (
                                        products.map((item, idx) => (
                                            <div
                                                key={item.id}
                                                className={`glass-card animate-fade-in-up delay-${Math.min(idx + 1, 8)} flex items-start gap-4 p-4`}
                                            >
                                                {/* Photo or emoji */}
                                                {item.photoUrl ? (
                                                    <img
                                                        src={`${STATIC_BASE}${item.photoUrl}`}
                                                        alt={item.name}
                                                        className="h-14 w-14 shrink-0 rounded-xl object-cover"
                                                    />
                                                ) : (
                                                    <div
                                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                                                        style={{ background: "var(--accent-glow)" }}
                                                    >
                                                        🍽️
                                                    </div>
                                                )}

                                                {/* Info */}
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <h3
                                                            className="text-sm font-semibold sm:text-base"
                                                            style={{ color: "var(--foreground)" }}
                                                        >
                                                            {item.name}
                                                        </h3>
                                                        <span className="price-tag shrink-0 text-sm sm:text-base">
                                                            ₺{item.price % 1 === 0 ? item.price.toFixed(0) : item.price.toFixed(2)}
                                                        </span>
                                                    </div>
                                                    {item.description && (
                                                        <p
                                                            className="mt-1 text-xs leading-relaxed sm:text-sm"
                                                            style={{ color: "var(--text-secondary)" }}
                                                        >
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Shimmer divider */}
                                {catIdx < categories.length - 1 && (
                                    <div className="animate-shimmer mt-10 h-px w-full rounded-full" />
                                )}
                            </section>
                        );
                    })
                )}
            </main>

            {/* ─── Footer ─── */}
            <footer className="border-t px-4 py-8 text-center" style={{ borderColor: "var(--card-border)" }}>
                {menu.logoUrl ? (
                    <img
                        src={`${STATIC_BASE}${menu.logoUrl}`}
                        alt={menu.name}
                        className="animate-float mx-auto mb-3 h-12 w-12 rounded-xl object-cover"
                    />
                ) : (
                    <div className="animate-float mb-3 text-3xl">🍽️</div>
                )}
                <p
                    className="text-lg font-semibold"
                    style={{ fontFamily: "var(--font-playfair), serif", color: "var(--foreground)" }}
                >
                    {menu.name}
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                    Afiyet olsun! 🤍
                </p>
                {(menu.address || menu.phone) && (
                    <div
                        className="mx-auto mt-4 flex flex-col items-center gap-2 text-xs sm:flex-row sm:justify-center sm:gap-4"
                        style={{ color: "var(--text-muted)" }}
                    >
                        {menu.address && <span>📍 {menu.address}</span>}
                        {menu.phone && <span>📞 {menu.phone}</span>}
                    </div>
                )}
            </footer>
        </div>
    );
}
