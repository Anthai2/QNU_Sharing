import React, { useEffect, useState } from "react";

// QNUniShare — Multi-page (hash router) + Hero khung hình
// - Bấm vào Trang chủ / Tính năng / Giới thiệu / Gói thành viên / Liên hệ sẽ chuyển sang TRANG RIÊNG
// - Trang chủ có lại hero với khung hình ảnh đẹp (gradient + card + grid)
// - Không dùng thư viện router để tránh lỗi môi trường; tự xử lý qua window.location.hash
// - Tone trắng + hồng như yêu cầu

// =============== Icons (inline SVG, nhẹ) ===============
function IconDoc() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
      <path d="M9 10h6M9 14h6M9 6h6" />
    </svg>
  );
}
function IconBook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5z" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M17 21v-2a4 4 0 0 0-3-3.87M7 21v-2a4 4 0 0 1 3-3.87M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
    </svg>
  );
}
function IconCareer() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M12 1v22M5 5h14v14H5z" />
    </svg>
  );
}

// =============== Tiny hash-router ===============
function useRoute() {
  const [route, setRoute] = useState(() => window.location.hash.replace(/^#/, "") || "/");
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.replace(/^#/, "") || "/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  function nav(to: string) {
    if (!to.startsWith("#/")) to = "#/" + to.replace(/^\/?/, "");
    window.location.hash = to.slice(1);
  }
  return { route, nav };
}

// =============== App ===============
export default function App() {
  useEffect(() => { document.body.style.background = "#fff"; }, []);
  const { route, nav } = useRoute();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Header onNav={nav} current={route} />
      <main>
        {route === "/" && <Home onNav={nav} />}
        {route === "/features" && <FeaturesPage />}
        {route === "/about" && <AboutPage />}
        {route === "/plans" && <PlansPage />}
        {route === "/contact" && <ContactPage />}
        {route === "/login" && <LoginPage />}
        {!["/","/features","/about","/plans","/contact","/login"].includes(route) && <NotFound onNav={nav} />}
      </main>
      <Footer onNav={nav} />

      {/* Smooth scroll for internal anchors if any */}
      <style>{`html{scroll-behavior:smooth}`}</style>

      {/* Runtime tests (sanity) */}
      <ScriptedTests />
    </div>
  );
}

// =============== Layout pieces ===============
function Brand() {
  return (
    <div className="flex items-center gap-2 select-none">
      <svg viewBox="0 0 220 48" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="48" height="48" rx="10" fill="url(#g)" />
        <text x="60" y="32" fontFamily="Inter, system-ui" fontSize="22" fontWeight="700" fill="#fb7185">QNUniShare</text>
      </svg>
    </div>
  );
}

function Header({ onNav, current }: { onNav: (to: string) => void; current: string }) {
  const linkCls = (path: string) =>
    "hover:text-pink-700 " + (current === path ? "text-pink-700 font-semibold" : "text-slate-700");
  return (
    <header className="sticky top-0 z-50 border-b border-pink-100 bg-white/80 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
        <button onClick={() => onNav("/")} className="font-semibold tracking-tight" aria-label="QNUniShare">
          <Brand />
        </button>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button onClick={() => onNav("/")} className={linkCls("/")}>Trang chủ</button>
          <button onClick={() => onNav("/features")} className={linkCls("/features")}>Tính năng</button>
          <button onClick={() => onNav("/about")} className={linkCls("/about")}>Giới thiệu</button>
          <button onClick={() => onNav("/plans")} className={linkCls("/plans")}>Gói thành viên</button>
          <button onClick={() => onNav("/contact")} className={linkCls("/contact")}>Liên hệ</button>
          <button onClick={() => onNav("/login")} className="text-pink-600 font-semibold hover:text-pink-700">Đăng nhập / Đăng ký</button>
        </nav>
      </div>
    </header>
  );
}

function Footer({ onNav }: { onNav: (to: string) => void }) {
  return (
    <footer className="border-top border-pink-100 py-10 text-sm">
      <div className="mx-auto max-w-6xl flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p className="text-pink-700">© {new Date().getFullYear()} QNUniShare. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <button onClick={() => onNav("/")} className="text-pink-600 hover:text-pink-800">Trang chủ</button>
          <button onClick={() => onNav("/features")} className="text-pink-600 hover:text-pink-800">Tính năng</button>
          <button onClick={() => onNav("/about")} className="text-pink-600 hover:text-pink-800">Giới thiệu</button>
          <button onClick={() => onNav("/plans")} className="text-pink-600 hover:text-pink-800">Gói thành viên</button>
          <button onClick={() => onNav("/contact")} className="text-pink-600 hover:text-pink-800">Liên hệ</button>
        </div>
      </div>
    </footer>
  );
}

// =============== Pages ===============
function Home({ onNav }: { onNav: (to: string) => void }) {
  return (
    <>
      {/* HERO với khung hình ảnh đẹp */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 -top-48 -z-10 h-[28rem]" style={{ background: "linear-gradient(to bottom, rgba(251,113,133,0.16), rgba(244,63,94,0.08), transparent)", filter: "blur(4px)" }} />
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
          <div className="flex flex-col items-start justify-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold" style={{ border: "1px solid #fecdd3", background: "#fff1f2", color: "#f43f5e" }}>
              ✨ Nền tảng chia sẻ tài liệu sinh viên
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl" style={{ color: "#be123c" }}>QNUniShare – Chia sẻ tài liệu, kết nối tri thức</h1>
            <p className="mt-4 max-w-xl" style={{ color: "#475569" }}>Nền tảng cho sinh viên ĐH Quy Nhơn (và mở rộng) chia sẻ tài liệu học tập, tiếp cận kho sách nói/ebook, kết nối cộng đồng và nhận gợi ý lộ trình học & nghề nghiệp.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => onNav("/features")} className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow" style={{ background: "#fb7185" }}>Khám phá ngay</button>
              <button onClick={() => onNav("/plans")} className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold" style={{ border: "1px solid #fda4af", color: "#be123c" }}>Xem gói thành viên</button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-md rounded-3xl p-4 shadow-xl" style={{ border: "1px solid #ffe4e6" }}>
              <div className="aspect-[4/3] w-full rounded-2xl p-1" style={{ background: "linear-gradient(45deg, #fb7185, #f43f5e, #d946ef)" }}>
                <div className="flex h-full w-full items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(6px)" }}>
                  <span className="text-4xl" style={{ color: "#f43f5e" }}>🚀</span>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-xl" style={{ background: "#fff1f2" }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preview 4 features ngay trên Trang chủ */}
      <section className="py-16" style={{ borderTop: "1px solid #ffe4e6" }}>
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold mb-8" style={{ color: "#be123c" }}>Tính năng nổi bật</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Feature icon={<IconDoc />} title="Chia sẻ tài liệu" desc="Tải lên/ tải xuống bài giảng, đề thi, đồ án; đánh giá & phân loại thông minh." />
            <Feature icon={<IconBook />} title="Sách nói & Ebook" desc="Hợp tác NXB/ tác giả; đọc & nghe trực tiếp trên nền tảng." />
            <Feature icon={<IconUsers />} title="Kết nối cộng đồng" desc="Diễn đàn hỏi đáp theo ngành; workshop/ talkshow, chia sẻ kinh nghiệm." />
            <Feature icon={<IconCareer />} title="Gợi ý nghề nghiệp" desc="Lộ trình học & nghề; mẫu CV/portfolio; định hướng kỹ năng." />
          </div>
        </div>
      </section>
    </>
  );
}

function FeaturesPage() {
  return (
    <PageShell title="Tính năng">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Feature icon={<IconDoc />} title="Chia sẻ tài liệu" desc="Tải lên/ tải xuống bài giảng, đề thi, đồ án; đánh giá & phân loại thông minh." />
        <Feature icon={<IconBook />} title="Sách nói & Ebook" desc="Hợp tác NXB/ tác giả; đọc & nghe trực tiếp trên nền tảng." />
        <Feature icon={<IconUsers />} title="Kết nối cộng đồng" desc="Diễn đàn hỏi đáp theo ngành; workshop/ talkshow, chia sẻ kinh nghiệm." />
        <Feature icon={<IconCareer />} title="Gợi ý nghề nghiệp" desc="Lộ trình học & nghề; mẫu CV/portfolio; định hướng kỹ năng." />
      </div>
    </PageShell>
  );
}

function AboutPage() {
  return (
    <PageShell title="Giới thiệu">
      <p className="text-slate-600">QNUniShare ra đời nhằm kết nối và lan tỏa tri thức trong cộng đồng sinh viên, hướng tới hệ sinh thái học tập mở và bền vững.</p>
    </PageShell>
  );
}

function PlansPage() {
  return (
    <PageShell title="Gói thành viên">
      <div className="grid gap-6 md:grid-cols-3">
        <PriceCard name="Thành viên thường" price="Miễn phí" desc="Trải nghiệm cơ bản" items={["Xem & tải tài liệu công khai (giới hạn)", "Tham gia diễn đàn hỏi đáp", "Tích điểm qua đóng góp"]} cta="Dùng miễn phí" />
        <PriceCard name="Premium" highlight price="Theo tháng/năm" desc="Cho học tập chuyên sâu" items={["Tải xuống không giới hạn", "Kho tài liệu độc quyền", "Không quảng cáo"]} cta="Nâng cấp" />
        <PriceCard name="Đối tác/Doanh nghiệp" price="Liên hệ" desc="Hợp tác phát triển" items={["Workshop/ sự kiện", "Chia sẻ doanh thu khoá học", "Tài trợ & quảng bá"]} cta="Liên hệ" />
      </div>
    </PageShell>
  );
}

function ContactPage() {
  return (
    <PageShell title="Liên hệ">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="rounded-3xl p-6" style={{ border: "1px solid #ffe4e6" }}>
          <div className="flex items-center gap-3" style={{ color: "#f43f5e" }}>✉️ <span style={{ color: "#334155" }}>hello@qnunisite.dev</span></div>
          <div className="mt-3 flex items-center gap-3" style={{ color: "#f43f5e" }}>📞 <span style={{ color: "#334155" }}>+84 900 000 000</span></div>
          <div className="mt-3 flex items-center gap-3" style={{ color: "#f43f5e" }}>📍 <span style={{ color: "#334155" }}>Quy Nhơn, Việt Nam</span></div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); alert("Đã gửi! (demo)"); }} className="md:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Họ và tên</label>
              <input required className="w-full rounded-2xl px-4 py-3 text-sm shadow-sm outline-none" style={{ border: "1px solid #fecdd3" }} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input type="email" required className="w-full rounded-2xl px-4 py-3 text-sm shadow-sm outline-none" style={{ border: "1px solid #fecdd3" }} />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Nội dung</label>
              <textarea rows={4} required className="w-full rounded-2xl px-4 py-3 text-sm shadow-sm outline-none" style={{ border: "1px solid #fecdd3" }} />
            </div>
          </div>
          <button type="submit" className="mt-4 inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow" style={{ background: "#fb7185" }}>Gửi yêu cầu</button>
        </form>
      </div>
    </PageShell>
  );
}

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/.+@.+\..+/.test(email)) return alert("Email không hợp lệ");
    alert(`Đăng nhập (demo) với: ${email}`);
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: "#fff1f2" }}>
      <div className="w-full max-w-sm p-6 rounded-3xl shadow-lg" style={{ background: "#ffffff", border: "1px solid #ffe4e6" }}>
        <h2 className="text-2xl font-bold mb-6" style={{ color: "#be123c" }}>Đăng nhập / Đăng ký</h2>
        <form onSubmit={submit}>
          <label className="block text-left mb-2 font-medium">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full rounded-xl p-3 mb-4 outline-none" style={{ border: "1px solid #fecdd3" }} />
          <label className="block text-left mb-2 font-medium">Mật khẩu</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full rounded-xl p-3 mb-6 outline-none" style={{ border: "1px solid #fecdd3" }} />
          <button type="submit" className="w-full rounded-xl py-3 font-semibold text-white" style={{ background: "#fb7185" }}>Đăng nhập</button>
        </form>
      </div>
    </div>
  );
}

function NotFound({ onNav }: { onNav: (to: string) => void }) {
  return (
    <PageShell title="Không tìm thấy trang">
      <button onClick={() => onNav("/")} className="text-pink-600 hover:text-pink-800">← Về Trang chủ</button>
    </PageShell>
  );
}

function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-bold mb-8" style={{ color: "#be123c" }}>{title}</h2>
        <div className="text-slate-700">{children}</div>
      </div>
    </section>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-3xl p-6 shadow-sm bg-white" style={{ border: "1px solid #ffe4e6" }}>
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl mb-4" style={{ background: "rgba(251,113,133,0.1)", color: "#f43f5e" }}>
        {icon}
      </div>
      <h4 className="font-semibold text-lg mb-2" style={{ color: "#be123c" }}>{title}</h4>
      <p className="text-sm" style={{ color: "#475569" }}>{desc}</p>
    </div>
  );
}

function PriceCard({ name, price, desc, items, cta, highlight }: { name: string; price: string; desc: string; items: string[]; cta: string; highlight?: boolean }) {
  return (
    <div className={`relative rounded-3xl p-6 shadow-sm ${highlight ? "border-pink-300" : ""}`} style={{ border: `1px solid ${highlight ? "#fda4af" : "#ffe4e6"}` }}>
      {highlight && (
        <span className="absolute -top-3 right-6 rounded-full px-3 py-1 text-xs font-semibold" style={{ border: "1px solid #fecdd3", background: "#fff1f2", color: "#be123c" }}>Phổ biến</span>
      )}
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="mt-1 text-sm" style={{ color: "#475569" }}>{desc}</p>
      <div className="mt-4 text-3xl font-extrabold" style={{ color: "#be123c" }}>{price}</div>
      <ul className="mt-4 space-y-2 text-sm" style={{ color: "#334155" }}>
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2"><span className="mt-1 inline-block h-1.5 w-1.5 rounded-full" style={{ background: "#fb7185" }} /> {i}</li>
        ))}
      </ul>
      <button className="mt-6 w-full rounded-2xl px-4 py-2 text-sm font-semibold" style={{ border: "1px solid #fecdd3", background: "#ffffff" }}>{cta}</button>
    </div>
  );
}

// =============== Tests ===============
function ScriptedTests() {
  useEffect(() => {
    try {
      console.assert(typeof React !== "undefined", "[TEST] React defined");
      console.assert(!!document.querySelector("header"), "[TEST] header render");
      console.assert(!!document.body, "[TEST] body exists");
    } catch {}
  }, []);
  return null;
}
