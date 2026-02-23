"use client";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <div className="animate-float mb-6 text-6xl">📱</div>
      <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair), serif" }}>
        Dijital QR Menü Sistemi
      </h1>
      <p className="max-w-md text-secondary text-lg">
        Menüyü görüntülemek için lütfen masadaki QR kodu taratın veya doğrudan restoran linkini kullanın.
      </p>

      <div className="mt-12 p-6 glass-card border border-accent/20 rounded-2xl opacity-60">
        <p className="text-sm italic">
          Dashboard üzerinden restoranınızı seçip "Menüyü Gör" butonuna tıklayarak önizleme yapabilirsiniz.
        </p>
      </div>

      <footer className="mt-auto py-8 text-muted text-xs">
        &copy; {new Date().getFullYear()} QR Menü | Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
