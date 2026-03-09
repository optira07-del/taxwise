import { useState, useEffect, useRef } from "react";

const TAX_DATA = {
  "Germany": { rate: 19, reduced: 7, type: "VAT", currency: "EUR", symbol: "€", flag: "🇩🇪" },
  "France": { rate: 20, reduced: 5.5, type: "VAT", currency: "EUR", symbol: "€", flag: "🇫🇷" },
  "United Kingdom": { rate: 20, reduced: 5, type: "VAT", currency: "GBP", symbol: "£", flag: "🇬🇧" },
  "Italy": { rate: 22, reduced: 10, type: "VAT", currency: "EUR", symbol: "€", flag: "🇮🇹" },
  "Spain": { rate: 21, reduced: 10, type: "VAT", currency: "EUR", symbol: "€", flag: "🇪🇸" },
  "Netherlands": { rate: 21, reduced: 9, type: "VAT", currency: "EUR", symbol: "€", flag: "🇳🇱" },
  "Sweden": { rate: 25, reduced: 12, type: "VAT", currency: "SEK", symbol: "kr", flag: "🇸🇪" },
  "Norway": { rate: 25, reduced: 15, type: "VAT", currency: "NOK", symbol: "kr", flag: "🇳🇴" },
  "Denmark": { rate: 25, reduced: 0, type: "VAT", currency: "DKK", symbol: "kr", flag: "🇩🇰" },
  "Poland": { rate: 23, reduced: 8, type: "VAT", currency: "PLN", symbol: "zł", flag: "🇵🇱" },
  "Belgium": { rate: 21, reduced: 6, type: "VAT", currency: "EUR", symbol: "€", flag: "🇧🇪" },
  "Portugal": { rate: 23, reduced: 6, type: "VAT", currency: "EUR", symbol: "€", flag: "🇵🇹" },
  "Ireland": { rate: 23, reduced: 9, type: "VAT", currency: "EUR", symbol: "€", flag: "🇮🇪" },
  "Switzerland": { rate: 8.1, reduced: 2.6, type: "VAT", currency: "CHF", symbol: "CHF", flag: "🇨🇭" },
  "Turkey": { rate: 20, reduced: 10, type: "VAT", currency: "TRY", symbol: "₺", flag: "🇹🇷" },
  "Australia": { rate: 10, reduced: 0, type: "GST", currency: "AUD", symbol: "A$", flag: "🇦🇺" },
  "New Zealand": { rate: 15, reduced: 0, type: "GST", currency: "NZD", symbol: "NZ$", flag: "🇳🇿" },
  "Canada": { rate: 5, reduced: 0, type: "GST", currency: "CAD", symbol: "CA$", flag: "🇨🇦" },
  "Singapore": { rate: 9, reduced: 0, type: "GST", currency: "SGD", symbol: "S$", flag: "🇸🇬" },
  "India": { rate: 18, reduced: 5, type: "GST", currency: "INR", symbol: "₹", flag: "🇮🇳" },
  "Japan": { rate: 10, reduced: 8, type: "CT", currency: "JPY", symbol: "¥", flag: "🇯🇵" },
  "South Korea": { rate: 10, reduced: 0, type: "VAT", currency: "KRW", symbol: "₩", flag: "🇰🇷" },
  "China": { rate: 13, reduced: 9, type: "VAT", currency: "CNY", symbol: "¥", flag: "🇨🇳" },
  "Thailand": { rate: 7, reduced: 0, type: "VAT", currency: "THB", symbol: "฿", flag: "🇹🇭" },
  "Philippines": { rate: 12, reduced: 0, type: "VAT", currency: "PHP", symbol: "₱", flag: "🇵🇭" },
  "Malaysia": { rate: 10, reduced: 6, type: "SST", currency: "MYR", symbol: "RM", flag: "🇲🇾" },
  "UAE": { rate: 5, reduced: 0, type: "VAT", currency: "AED", symbol: "AED", flag: "🇦🇪" },
  "Saudi Arabia": { rate: 15, reduced: 0, type: "VAT", currency: "SAR", symbol: "SAR", flag: "🇸🇦" },
  "South Africa": { rate: 15, reduced: 0, type: "VAT", currency: "ZAR", symbol: "R", flag: "🇿🇦" },
  "Nigeria": { rate: 7.5, reduced: 0, type: "VAT", currency: "NGN", symbol: "₦", flag: "🇳🇬" },
  "Kenya": { rate: 16, reduced: 0, type: "VAT", currency: "KES", symbol: "KSh", flag: "🇰🇪" },
  "Egypt": { rate: 14, reduced: 5, type: "VAT", currency: "EGP", symbol: "E£", flag: "🇪🇬" },
  "Pakistan": { rate: 17, reduced: 10, type: "GST", currency: "PKR", symbol: "₨", flag: "🇵🇰" },
  "Mexico": { rate: 16, reduced: 0, type: "VAT", currency: "MXN", symbol: "MX$", flag: "🇲🇽" },
  "Brazil": { rate: 17, reduced: 12, type: "ICMS", currency: "BRL", symbol: "R$", flag: "🇧🇷" },
  "Argentina": { rate: 21, reduced: 10.5, type: "VAT", currency: "ARS", symbol: "AR$", flag: "🇦🇷" },
  "Chile": { rate: 19, reduced: 0, type: "VAT", currency: "CLP", symbol: "CL$", flag: "🇨🇱" },
  "Colombia": { rate: 19, reduced: 5, type: "VAT", currency: "COP", symbol: "COP$", flag: "🇨🇴" },
  "Russia": { rate: 20, reduced: 10, type: "VAT", currency: "RUB", symbol: "₽", flag: "🇷🇺" },
};

const CATEGORIES = [
  { id: "standard", label: "Standard Goods & Services", rateType: "standard" },
  { id: "reduced", label: "Food & Essentials (Reduced Rate)", rateType: "reduced" },
  { id: "digital", label: "Digital Services", rateType: "standard" },
  { id: "exempt", label: "Exempt (Medical, Education)", rateType: "exempt" },
];

const PLANS = [
  {
    name: "Starter",
    price: 0,
    period: "forever",
    color: "#64748b",
    features: ["500 calculations/month", "20 countries", "Basic API access", "Email support"],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Growth",
    price: 29,
    period: "month",
    color: "#F0A500",
    features: ["10,000 calculations/month", "All 40+ countries", "Full API + webhooks", "Bulk CSV export", "Priority support"],
    cta: "Start 14-day Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: 99,
    period: "month",
    color: "#6366f1",
    features: ["Unlimited calculations", "Custom country rules", "White-label API", "Dedicated account manager", "SLA guarantee"],
    cta: "Contact Sales",
    popular: false,
  },
];

const CountryCard = ({ country, data, onClick, selected }) => (
  <button
    onClick={() => onClick(country)}
    style={{
      background: selected
        ? "linear-gradient(135deg, rgba(240,165,0,0.2), rgba(240,165,0,0.05))"
        : "rgba(255,255,255,0.03)",
      border: selected ? "1px solid rgba(240,165,0,0.6)" : "1px solid rgba(255,255,255,0.07)",
      borderRadius: "12px",
      padding: "12px 16px",
      cursor: "pointer",
      textAlign: "left",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      width: "100%",
    }}
  >
    <span style={{ fontSize: "22px" }}>{data.flag}</span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ color: "#fff", fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{country}</div>
      <div style={{ color: "#F0A500", fontSize: "11px", fontWeight: 700 }}>{data.type} {data.rate}%</div>
    </div>
  </button>
);

export default function TaxWise() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [selectedCountry, setSelectedCountry] = useState("Germany");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("standard");
  const [priceType, setPriceType] = useState("exclusive"); // exclusive = pre-tax, inclusive = post-tax
  const [result, setResult] = useState(null);
  const [search, setSearch] = useState("");
  const [animateResult, setAnimateResult] = useState(false);
  const [compareCountries, setCompareCountries] = useState(["Germany", "United Kingdom", "Australia"]);
  const [compareAmount, setCompareAmount] = useState("1000");

  const filteredCountries = Object.entries(TAX_DATA).filter(([name]) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  const calculate = () => {
    if (!amount || isNaN(parseFloat(amount))) return;
    const data = TAX_DATA[selectedCountry];
    const cat = CATEGORIES.find(c => c.id === category);
    const num = parseFloat(amount);

    let rate = 0;
    if (cat.rateType === "standard") rate = data.rate;
    else if (cat.rateType === "reduced") rate = data.reduced;
    else rate = 0;

    let netAmount, taxAmount, grossAmount;
    if (priceType === "exclusive") {
      netAmount = num;
      taxAmount = num * (rate / 100);
      grossAmount = num + taxAmount;
    } else {
      grossAmount = num;
      taxAmount = num - num / (1 + rate / 100);
      netAmount = num - taxAmount;
    }

    setResult({ netAmount, taxAmount, grossAmount, rate, data, country: selectedCountry });
    setAnimateResult(true);
    setTimeout(() => setAnimateResult(false), 600);
  };

  useEffect(() => { if (amount) calculate(); }, [amount, selectedCountry, category, priceType]);

  const fmt = (n, sym) => `${sym}${parseFloat(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080D1A",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#fff",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0d1220; }
        ::-webkit-scrollbar-thumb { background: #2a3550; border-radius: 3px; }
        input:focus { outline: none; }
        @keyframes fadeUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.03); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .result-animate { animation: pulse 0.5s ease; }
        .hero-gradient {
          background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(240,165,0,0.15) 0%, transparent 60%),
                      radial-gradient(ellipse 40% 40% at 80% 60%, rgba(99,102,241,0.08) 0%, transparent 50%);
        }
        .glow-gold { box-shadow: 0 0 30px rgba(240,165,0,0.15); }
        .nav-link { transition: color 0.2s; cursor: pointer; }
        .nav-link:hover { color: #F0A500; }
        .tab-btn { transition: all 0.2s; }
        .tab-btn:hover { background: rgba(255,255,255,0.05); }
        .country-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; }
        @media (max-width: 768px) { .hero-split { flex-direction: column !important; } .country-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(8,13,26,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 5%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "64px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "8px",
            background: "linear-gradient(135deg, #F0A500, #e07b00)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", fontWeight: 800, color: "#000",
          }}>T</div>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "20px", letterSpacing: "-0.3px" }}>
            Tax<span style={{ color: "#F0A500" }}>Wise</span>
          </span>
        </div>

        <div style={{ display: "flex", gap: "28px", fontSize: "14px", color: "#94a3b8" }}>
          {["Calculator", "Compare", "Pricing", "API Docs"].map(t => (
            <span key={t} className="nav-link"
              onClick={() => setActiveTab(t.toLowerCase().replace(" ", ""))}
              style={{ color: activeTab === t.toLowerCase().replace(" ", "") ? "#F0A500" : "#94a3b8" }}>
              {t}
            </span>
          ))}
        </div>

        <button style={{
          background: "linear-gradient(135deg, #F0A500, #e07b00)",
          border: "none", borderRadius: "8px", padding: "8px 18px",
          color: "#000", fontWeight: 700, fontSize: "13px", cursor: "pointer",
        }}>
          Get API Key →
        </button>
      </nav>

      {/* HERO */}
      <div className="hero-gradient" style={{ padding: "80px 5% 60px", textAlign: "center" }}>
        <div style={{
          display: "inline-block", background: "rgba(240,165,0,0.1)",
          border: "1px solid rgba(240,165,0,0.3)", borderRadius: "100px",
          padding: "6px 16px", fontSize: "12px", color: "#F0A500",
          fontWeight: 600, letterSpacing: "0.5px", marginBottom: "24px",
        }}>
          🌍 40+ COUNTRIES · REAL-TIME RATES · VAT / GST / SST
        </div>
        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(38px, 6vw, 72px)",
          lineHeight: 1.1, marginBottom: "20px",
          background: "linear-gradient(135deg, #fff 40%, #F0A500 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Global Tax Calculator<br />Built for Modern Business
        </h1>
        <p style={{ color: "#64748b", fontSize: "18px", maxWidth: "560px", margin: "0 auto 40px", lineHeight: 1.7 }}>
          Instantly calculate VAT, GST & indirect taxes across 40+ countries.
          Embed our API in minutes. Scale globally, stay compliant.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("calculator")}
            style={{
              background: "linear-gradient(135deg, #F0A500, #e07b00)",
              border: "none", borderRadius: "10px", padding: "14px 28px",
              color: "#000", fontWeight: 700, fontSize: "15px", cursor: "pointer",
            }}>
            Try Calculator Free →
          </button>
          <button style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "14px 28px",
            color: "#fff", fontWeight: 600, fontSize: "15px", cursor: "pointer",
          }}>
            View API Docs
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "48px",
          marginTop: "60px", flexWrap: "wrap",
        }}>
          {[["40+", "Countries"], ["99.9%", "API Uptime"], ["< 50ms", "Response Time"], ["Free", "To Start"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "28px", color: "#F0A500" }}>{v}</div>
              <div style={{ fontSize: "13px", color: "#475569", marginTop: "4px" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div style={{ padding: "0 5%", marginBottom: "8px" }}>
        <div style={{
          display: "flex", gap: "4px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "12px", padding: "4px",
          width: "fit-content",
        }}>
          {[
            { id: "calculator", label: "🧮 Calculator" },
            { id: "compare", label: "⚖️ Compare" },
            { id: "pricing", label: "💳 Pricing" },
            { id: "apidocs", label: "🔌 API" },
          ].map(t => (
            <button key={t.id} className="tab-btn"
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "8px 20px", borderRadius: "8px", border: "none",
                background: activeTab === t.id ? "rgba(240,165,0,0.15)" : "transparent",
                color: activeTab === t.id ? "#F0A500" : "#64748b",
                fontWeight: 600, fontSize: "13px", cursor: "pointer",
                border: activeTab === t.id ? "1px solid rgba(240,165,0,0.3)" : "1px solid transparent",
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 5% 80px" }}>

        {/* ===== CALCULATOR TAB ===== */}
        {activeTab === "calculator" && (
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }} className="hero-split">

            {/* Left: Country Picker */}
            <div style={{ flex: "1 1 300px" }}>
              <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "16px", padding: "24px",
              }}>
                <h3 style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "16px", fontWeight: 600, letterSpacing: "0.5px" }}>
                  SELECT COUNTRY
                </h3>
                <input
                  placeholder="🔍  Search countries..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px", color: "#fff", fontSize: "14px",
                    marginBottom: "16px",
                  }}
                />
                <div style={{ maxHeight: "420px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {filteredCountries.map(([name, data]) => (
                    <CountryCard key={name} country={name} data={data}
                      selected={selectedCountry === name}
                      onClick={setSelectedCountry} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Calculator */}
            <div style={{ flex: "2 1 400px" }}>
              {/* Country Header */}
              <div style={{
                background: "linear-gradient(135deg, rgba(240,165,0,0.08), rgba(240,165,0,0.02))",
                border: "1px solid rgba(240,165,0,0.2)",
                borderRadius: "16px", padding: "24px", marginBottom: "20px",
                display: "flex", alignItems: "center", gap: "16px",
              }}>
                <span style={{ fontSize: "40px" }}>{TAX_DATA[selectedCountry]?.flag}</span>
                <div>
                  <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "24px", marginBottom: "4px" }}>{selectedCountry}</h2>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <span style={{ background: "rgba(240,165,0,0.15)", color: "#F0A500", padding: "3px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: 700 }}>
                      {TAX_DATA[selectedCountry]?.type} {TAX_DATA[selectedCountry]?.rate}%
                    </span>
                    {TAX_DATA[selectedCountry]?.reduced > 0 && (
                      <span style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8", padding: "3px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: 700 }}>
                        Reduced {TAX_DATA[selectedCountry]?.reduced}%
                      </span>
                    )}
                    <span style={{ background: "rgba(255,255,255,0.08)", color: "#94a3b8", padding: "3px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: 600 }}>
                      {TAX_DATA[selectedCountry]?.currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Input Form */}
              <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "16px", padding: "24px", marginBottom: "20px",
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  {/* Amount */}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>AMOUNT</label>
                    <div style={{ position: "relative" }}>
                      <span style={{
                        position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
                        color: "#F0A500", fontWeight: 700, fontSize: "16px",
                      }}>{TAX_DATA[selectedCountry]?.symbol}</span>
                      <input
                        type="number" placeholder="0.00" value={amount}
                        onChange={e => setAmount(e.target.value)}
                        style={{
                          width: "100%", padding: "14px 14px 14px 40px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          borderRadius: "10px", color: "#fff",
                          fontSize: "20px", fontWeight: 600,
                        }}
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>CATEGORY</label>
                    <select value={category} onChange={e => setCategory(e.target.value)}
                      style={{
                        width: "100%", padding: "12px 14px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "10px", color: "#fff", fontSize: "13px",
                      }}>
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id} style={{ background: "#1e293b" }}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Type */}
                  <div>
                    <label style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>PRICE TYPE</label>
                    <div style={{ display: "flex", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)" }}>
                      {[["exclusive", "Ex-Tax"], ["inclusive", "Inc-Tax"]].map(([v, l]) => (
                        <button key={v} onClick={() => setPriceType(v)}
                          style={{
                            flex: 1, padding: "12px 8px",
                            background: priceType === v ? "rgba(240,165,0,0.2)" : "rgba(255,255,255,0.03)",
                            border: "none", color: priceType === v ? "#F0A500" : "#64748b",
                            fontWeight: 600, fontSize: "13px", cursor: "pointer",
                          }}>{l}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              {result && (
                <div className={animateResult ? "result-animate" : ""}
                  style={{
                    background: "linear-gradient(135deg, rgba(240,165,0,0.08), rgba(240,165,0,0.02))",
                    border: "1px solid rgba(240,165,0,0.25)",
                    borderRadius: "16px", padding: "24px",
                  }}>
                  <h3 style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 600, letterSpacing: "0.5px", marginBottom: "20px" }}>CALCULATION RESULT</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                    {[
                      ["Net Amount", fmt(result.netAmount, result.data.symbol), "#fff"],
                      ["Tax Amount", fmt(result.taxAmount, result.data.symbol), "#F0A500"],
                      ["Gross Amount", fmt(result.grossAmount, result.data.symbol), "#4ade80"],
                    ].map(([label, value, color]) => (
                      <div key={label} style={{
                        background: "rgba(0,0,0,0.3)", borderRadius: "12px", padding: "16px", textAlign: "center",
                      }}>
                        <div style={{ fontSize: "11px", color: "#475569", marginBottom: "8px", fontWeight: 600 }}>{label}</div>
                        <div style={{ fontSize: "18px", fontWeight: 700, color, fontFamily: "'DM Serif Display', serif" }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tax Breakdown Bar */}
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b", marginBottom: "8px" }}>
                      <span>Tax Breakdown</span>
                      <span style={{ color: "#F0A500" }}>{result.rate}% applied</span>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "100px", height: "8px", overflow: "hidden" }}>
                      <div style={{
                        width: `${(result.taxAmount / result.grossAmount) * 100}%`,
                        height: "100%", borderRadius: "100px",
                        background: "linear-gradient(90deg, #F0A500, #e07b00)",
                        transition: "width 0.5s ease",
                      }} />
                    </div>
                  </div>

                  <div style={{
                    background: "rgba(0,0,0,0.3)", borderRadius: "10px", padding: "12px 16px",
                    fontFamily: "monospace", fontSize: "12px", color: "#94a3b8",
                    lineHeight: 1.8,
                  }}>
                    <span style={{ color: "#64748b" }}>// API equivalent call</span><br />
                    <span style={{ color: "#F0A500" }}>GET</span> /v1/calculate?<span style={{ color: "#a78bfa" }}>country</span>=<span style={{ color: "#4ade80" }}>{result.country.toLowerCase().replace(/ /g, "_")}</span>&<span style={{ color: "#a78bfa" }}>amount</span>=<span style={{ color: "#4ade80" }}>{amount}</span>&<span style={{ color: "#a78bfa" }}>type</span>=<span style={{ color: "#4ade80" }}>{priceType}</span>
                  </div>
                </div>
              )}

              {!result && (
                <div style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px dashed rgba(255,255,255,0.1)",
                  borderRadius: "16px", padding: "40px",
                  textAlign: "center", color: "#334155",
                }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>🧮</div>
                  <div style={{ fontSize: "16px" }}>Enter an amount to see the tax breakdown</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== COMPARE TAB ===== */}
        {activeTab === "compare" && (
          <div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "28px", marginBottom: "8px" }}>Compare Tax Rates</h2>
            <p style={{ color: "#64748b", marginBottom: "28px" }}>See how indirect taxes differ across countries for the same transaction</p>

            <div style={{ marginBottom: "24px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
              <div>
                <label style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, display: "block", marginBottom: "8px" }}>TRANSACTION AMOUNT (USD)</label>
                <input type="number" value={compareAmount} onChange={e => setCompareAmount(e.target.value)}
                  style={{
                    padding: "12px 16px", background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px",
                    color: "#fff", fontSize: "16px", width: "200px",
                  }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {Object.entries(TAX_DATA)
                .sort((a, b) => b[1].rate - a[1].rate)
                .map(([name, data]) => {
                  const amt = parseFloat(compareAmount) || 1000;
                  const tax = amt * (data.rate / 100);
                  const pct = data.rate;
                  return (
                    <div key={name} style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "14px", padding: "20px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                        <span style={{ fontSize: "24px" }}>{data.flag}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "14px" }}>{name}</div>
                          <div style={{ fontSize: "12px", color: "#475569" }}>{data.type} · {data.currency}</div>
                        </div>
                        <div style={{ marginLeft: "auto", textAlign: "right" }}>
                          <div style={{ fontSize: "18px", fontWeight: 700, color: "#F0A500" }}>{pct}%</div>
                        </div>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "8px", height: "6px", marginBottom: "12px" }}>
                        <div style={{
                          width: `${(pct / 25) * 100}%`, height: "100%",
                          background: pct > 20 ? "#ef4444" : pct > 15 ? "#F0A500" : "#4ade80",
                          borderRadius: "8px", transition: "width 0.5s",
                        }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                        <span style={{ color: "#64748b" }}>Tax on ${amt.toLocaleString()}</span>
                        <span style={{ color: "#fff", fontWeight: 600 }}>${tax.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ===== PRICING TAB ===== */}
        {activeTab === "pricing" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "36px", marginBottom: "12px" }}>Simple, Transparent Pricing</h2>
              <p style={{ color: "#64748b", fontSize: "16px" }}>Start free. Scale as you grow. No surprise fees.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", maxWidth: "900px", margin: "0 auto" }}>
              {PLANS.map(plan => (
                <div key={plan.name} style={{
                  background: plan.popular ? "linear-gradient(135deg, rgba(240,165,0,0.08), rgba(240,165,0,0.02))" : "rgba(255,255,255,0.02)",
                  border: plan.popular ? "1px solid rgba(240,165,0,0.35)" : "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "20px", padding: "32px",
                  position: "relative",
                }}>
                  {plan.popular && (
                    <div style={{
                      position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                      background: "linear-gradient(135deg, #F0A500, #e07b00)",
                      color: "#000", padding: "4px 16px", borderRadius: "100px",
                      fontSize: "11px", fontWeight: 800, letterSpacing: "0.5px",
                    }}>MOST POPULAR</div>
                  )}
                  <div style={{ marginBottom: "24px" }}>
                    <div style={{ fontSize: "13px", color: plan.color, fontWeight: 700, letterSpacing: "1px", marginBottom: "8px" }}>{plan.name.toUpperCase()}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                      <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "42px" }}>${plan.price}</span>
                      <span style={{ color: "#475569", fontSize: "14px" }}>/{plan.period}</span>
                    </div>
                  </div>
                  <div style={{ marginBottom: "28px" }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ color: plan.color, fontSize: "14px" }}>✓</span>
                        <span style={{ fontSize: "14px", color: "#94a3b8" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button style={{
                    width: "100%", padding: "14px",
                    background: plan.popular ? "linear-gradient(135deg, #F0A500, #e07b00)" : "rgba(255,255,255,0.06)",
                    border: "none", borderRadius: "10px",
                    color: plan.popular ? "#000" : "#fff",
                    fontWeight: 700, fontSize: "14px", cursor: "pointer",
                  }}>{plan.cta}</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== API TAB ===== */}
        {activeTab === "apidocs" && (
          <div style={{ maxWidth: "800px" }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "32px", marginBottom: "8px" }}>API Documentation</h2>
            <p style={{ color: "#64748b", marginBottom: "36px" }}>Embed global tax calculations in your app with one API call.</p>

            {[
              {
                title: "Calculate Tax",
                method: "GET",
                endpoint: "/v1/calculate",
                description: "Calculate VAT/GST for any amount in any supported country.",
                code: `curl https://api.taxwise.io/v1/calculate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d "country=germany" \\
  -d "amount=1000" \\
  -d "category=standard" \\
  -d "price_type=exclusive"`,
                response: `{
  "country": "Germany",
  "tax_type": "VAT",
  "rate": 19,
  "net_amount": 1000.00,
  "tax_amount": 190.00,
  "gross_amount": 1190.00,
  "currency": "EUR"
}`,
              },
              {
                title: "List Countries",
                method: "GET",
                endpoint: "/v1/countries",
                description: "Get all supported countries with their current tax rates.",
                code: `curl https://api.taxwise.io/v1/countries \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
                response: `{
  "countries": [
    { "name": "Germany", "type": "VAT", "rate": 19, "currency": "EUR" },
    { "name": "Australia", "type": "GST", "rate": 10, "currency": "AUD" }
    // ... 40+ countries
  ]
}`,
              },
            ].map(api => (
              <div key={api.title} style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "16px", padding: "24px", marginBottom: "20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <span style={{
                    background: "rgba(240,165,0,0.15)", color: "#F0A500",
                    padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 800,
                  }}>{api.method}</span>
                  <code style={{ color: "#a78bfa", fontSize: "14px" }}>{api.endpoint}</code>
                  <span style={{ fontWeight: 600, fontSize: "15px", marginLeft: "auto" }}>{api.title}</span>
                </div>
                <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "16px" }}>{api.description}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {[["Request", api.code, "#F0A500"], ["Response", api.response, "#4ade80"]].map(([label, code, color]) => (
                    <div key={label}>
                      <div style={{ fontSize: "11px", color: "#475569", fontWeight: 700, marginBottom: "8px", letterSpacing: "0.5px" }}>{label}</div>
                      <pre style={{
                        background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "10px", padding: "14px", fontSize: "12px",
                        color, overflow: "auto", lineHeight: 1.7, whiteSpace: "pre-wrap",
                      }}>{code}</pre>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "32px 5%",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 28, height: 28, borderRadius: "7px",
            background: "linear-gradient(135deg, #F0A500, #e07b00)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px", fontWeight: 800, color: "#000",
          }}>T</div>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "17px" }}>
            Tax<span style={{ color: "#F0A500" }}>Wise</span>
          </span>
          <span style={{ color: "#334155", fontSize: "13px" }}>· Global Tax Intelligence</span>
        </div>
        <div style={{ fontSize: "13px", color: "#334155" }}>
          Rates updated regularly · Not financial/legal advice · © 2025 TaxWise
        </div>
      </footer>
    </div>
  );
}
