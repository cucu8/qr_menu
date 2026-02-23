// ── Types ──────────────────────────────────────────────────────────────
export interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    photoUrl: string | null;
    displayOrder: number;
    isAvailable: boolean;
    menuCategoryId: string;
}

export interface MenuCategory {
    id: string;
    restaurantId: string;
    name: string;
    description: string | null;
    photoUrl: string | null;
    displayOrder: number;
    isActive: boolean;
    products: Product[];
}

export interface RestaurantMenu {
    id: string;
    name: string;
    description: string | null;
    logoUrl: string | null;
    phone: string | null;
    address: string | null;
    isActive: boolean;
    menuCategories: MenuCategory[];
}

// ── Config ─────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5252";
export const STATIC_BASE = API_BASE;

// ── Fetch helper ───────────────────────────────────────────────────────
export async function fetchMenu(restaurantId: string): Promise<RestaurantMenu | null> {
    const res = await fetch(`${API_BASE}/api/menu/${restaurantId}`, {
        // next.js cache: her zaman güncel veri istiyoruz
        cache: "no-store",
    });

    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`API error: ${res.status}`);

    return res.json() as Promise<RestaurantMenu>;
}
