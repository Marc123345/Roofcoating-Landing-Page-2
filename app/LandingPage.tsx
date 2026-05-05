"use client";

import { useEffect, useRef, useState, MouseEvent } from "react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const slides = [
    { bg: "https://ik.imagekit.io/qcvroy8xpd/Asyrc.png?updatedAt=1776008954670" },
    { bg: "https://ik.imagekit.io/qcvroy8xpd/Sylicone.jpeg?updatedAt=1776009369481" },
    { bg: "https://ik.imagekit.io/qcvroy8xpd/580c524e-ceaa-4322-801d-0e8c216bebdd.png?updatedAt=1776666137369" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 6500);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(t);
    };
  }, [slides.length]);

  // Reveal-on-scroll
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".rv").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Counter animation
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  useEffect(() => {
    const animated = new WeakSet<HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          if (animated.has(el)) return;
          animated.add(el);
          const stop = parseInt(el.dataset.stop || "0", 10);
          const speed = parseInt(el.dataset.speed || "2000", 10);
          const start = performance.now();
          const step = (now: number) => {
            const p = Math.min((now - start) / speed, 1);
            const v = Math.floor(stop * (1 - Math.pow(1 - p, 3)));
            el.textContent = v.toString();
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = stop.toString();
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.4 }
    );
    counterRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const [shockVisible, setShockVisible] = useState(false);
  const [shockCount, setShockCount] = useState(0);
  const shockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = shockRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShockVisible(true);
        const duration = 2000;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          setShockCount(Math.round(p * p * 91));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let obs: MutationObserver | null = null;
    const script = document.createElement("script");
    script.src = "https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js";
    script.onload = () => {
      (window as any).jotformEmbedHandler("iframe[id='JotFormIFrame-261243265404147']", "https://form.jotform.com/");
      const iframe = document.getElementById("JotFormIFrame-261243265404147") as HTMLElement | null;
      if (iframe) {
        obs = new MutationObserver(() => { if (iframe.style.height) iframe.style.height = ""; });
        obs.observe(iframe, { attributes: true, attributeFilter: ["style"] });
      }
    };
    document.body.appendChild(script);
    return () => { script.remove(); obs?.disconnect(); };
  }, []);

  const galleryRef = useRef<HTMLDivElement | null>(null);
  const scrollGallery = (dir: -1 | 1) => {
    const track = galleryRef.current;
    if (!track) return;
    const slide = track.querySelector(".wc-slide") as HTMLElement | null;
    const delta = slide ? slide.offsetWidth + 14 : 320;
    track.scrollBy({ left: delta * dir, behavior: "smooth" });
  };

  const smoothScroll = (e: MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute("href");
    if (href && href.startsWith("#")) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        setMobileOpen(false);
      }
    }
  };

  const navItems = [
    { href: "#banner", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#services", label: "Benefits" },
    { href: "#projects", label: "Projects" },
    { href: "#blog", label: "Insights" },
    { href: "#contact", label: "Contact" },
  ];

  const projectImages = ["34.png", "20.png", "35.png", "22.png", "37.png", "26.png", "30.png", "23.png", "29.png", "13.png"];

  return (
    <>
      {/* ═══ HEADER ═══ */}
      <header className={`main-header${scrolled ? " sticky" : ""}`}>
        <div className="wrap">
          <div className="header-inner">
            <a href="#banner" className="logo" onClick={smoothScroll}>
              <span className="logo-mark" aria-hidden="true">
                <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                  <path d="M4 30 L20 10 L36 30" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="miter" strokeLinecap="square" />
                  <line x1="8" y1="23" x2="32" y2="23" stroke="var(--primary)" strokeWidth="3" strokeLinecap="square" />
                </svg>
              </span>
              <span className="logo-txt">Roof Coat</span>
            </a>
          </div>
        </div>
      </header>

      {/* ═══ HERO ═══ */}
      <section id="banner" className="hero">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`hero-slide${i === slide ? " active" : ""}`}
            style={{ backgroundImage: `url('${s.bg}')` }}
          />
        ))}
        <div className="hero-overlay" />
        <div className="wrap hero-grid">
          <div className="hero-text rv">
            <div className="hero-eyebrow">Free Commercial Roof Assessment</div>
            <h1>Restore Your Roof for 75% Less<br /><em>with a Roof Coating.</em></h1>
          </div>
          <div className="hero-formbox rv" id="contact">
            <div className="form-embed">
              <iframe
                id="JotFormIFrame-261243265404147"
                title="Clone of Get Your Roof Coating Deal"
                onLoad={() => window.parent.scrollTo(0, 0)}
                allowTransparency={true}
                allow="geolocation; microphone; camera; fullscreen; payment"
                src="https://form.jotform.com/261243265404147?isIframeEmbed=1"
                frameBorder={0}
                scrolling="no"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SHOCK STAT ═══ */}
      <section className="shock-s" ref={shockRef}>
        <div className="shock-grain" aria-hidden="true" />
        <div className="wrap shock-wrap">
          <p className="shock-eyebrow">The Statistic That Changes Everything</p>
          <div className="shock-counter">
            <span className="shock-num">{shockCount}</span>
            <span className="shock-sign">%</span>
          </div>
          <div className="shock-bar-track">
            <div className="shock-bar-fill" style={{ width: shockVisible ? '91%' : '0%' }} />
            <span className="shock-bar-label">91% of owners</span>
          </div>
          <p className="shock-stmt">
            of commercial roof owners{' '}
            <strong>don&apos;t know</strong> they can restore
            <br className="shock-br" />
            their roof for{' '}
            <em className="shock-highlight">75% less</em>{' '}
            than a full replacement.
          </p>
        </div>
      </section>

      {/* ═══ RECENT WORK — moved up under hero ═══ */}
      <section id="projects" className="work-carousel-s">
        <div className="wrap">
          <div className="sec-title center rv">
            <span className="eyebrow">Recent Work</span>
            <h2>Real Roofs. Real Results.<br /><em>Restored This Year.</em></h2>
            <p style={{ maxWidth: 640, margin: "14px auto 0", color: "var(--gray)" }}>1,200+ commercial roofs sealed and warrantied in the last 12 months. Zero tear-offs. Zero tenant disruption. Just bone-dry roofs and six-figure savings.</p>
          </div>
          <div className="work-carousel">
            <button className="wc-nav wc-prev" onClick={() => scrollGallery(-1)} aria-label="Previous projects" type="button"><i className="fas fa-chevron-left"></i></button>
            <div className="wc-track" ref={galleryRef}>
              {projectImages.map((file, i) => (
                <div key={i} className="wc-slide">
                  <img src={`https://ik.imagekit.io/qcvroy8xpd/${file}`} alt="Commercial roof coating project" loading="lazy" />
                </div>
              ))}
            </div>
            <button className="wc-nav wc-next" onClick={() => scrollGallery(1)} aria-label="Next projects" type="button"><i className="fas fa-chevron-right"></i></button>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="about" className="about">
        <div className="wrap">
          <div className="about-grid">
            <div className="about-imgs rv">
              <div className="ai-main">
                <img src="https://ik.imagekit.io/qcvroy8xpd/Sylicone.jpeg?updatedAt=1776009369481" alt="Silicone roof coating application" />
              </div>
              <div className="ai-accent">
                <img src="https://ik.imagekit.io/qcvroy8xpd/580c524e-ceaa-4322-801d-0e8c216bebdd.png?updatedAt=1776666137369" alt="Roof before and after coating" />
              </div>
            </div>
            <div className="about-content rv">
              <div className="sec-title">
                <span className="eyebrow">Why Coat, Not Replace</span>
                <h2>The 20-Year Roof<br />Upgrade Smart Owners<br />Already Know About</h2>
              </div>
              <p>Most commercial roofs don't need a tear-off. If the deck is structurally sound, a professional-grade silicone system seals every seam, blister, and pinhole — restoring the roof for decades at a <strong>fraction of replacement cost</strong>.</p>
              <p>Our applications are backed by manufacturer warranties up to <strong>20 years, transferable on sale</strong>, and installed in 1–3 working days. Tenants won't even know we were there.</p>
              <p>Over <strong>1,200 commercial owners across 14 industries</strong> have already made the smarter decision. Here's your chance to skip the six-figure quote — and keep that money in your operating budget.</p>
              <div className="about-stats">
                <div className="about-stat">
                  <div className="as-n"><span ref={(el) => { counterRefs.current[0] = el; }} data-stop="1200" data-speed="2500">0</span>+</div>
                  <div className="as-l">Commercial Roofs<br />Restored</div>
                </div>
                <div className="about-stat">
                  <div className="as-n"><span ref={(el) => { counterRefs.current[1] = el; }} data-stop="20" data-speed="2500">0</span> yr</div>
                  <div className="as-l">Maximum<br />Warranty</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WORKING PROCESS ═══ */}
      <section className="process">
        <div className="wrap">
          <div className="sec-title center rv">
            <span className="eyebrow">The Process</span>
            <h2>Leaky Roof to <em>Bone-Dry</em><br />in 3 Days Flat</h2>
          </div>
          <div className="process-grid">
            {[
              { n: "01", title: "Free Inspection — No Pressure", body: "We inspect, measure, and tell you straight up if coating is right. Written report in your inbox same week. Zero obligation." },
              { n: "02", title: "Fixed Quote — Zero Surprises", body: "Silicone, acrylic, or hybrid — we recommend the smartest system for your roof, climate, and budget. Locked-in price. No change orders." },
              { n: "03", title: "Enjoy a 20-Year Bone-Dry Roof", body: "Certified crew cleans, primes, coats. You get manufacturer warranty docs in hand and the smartest decision you'll make this year." },
            ].map((p, i) => (
              <div key={i} className="process-card rv">
                <div className="pc-num">{p.n}</div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                {i < 2 && <div className="pc-arrow" aria-hidden="true">
                  <svg viewBox="0 0 80 20" fill="none"><path d="M2 10 C 20 2, 60 18, 76 10" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="3 3" /><path d="M68 4 L78 10 L68 16" stroke="var(--primary)" strokeWidth="1.5" fill="none" /></svg>
                </div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BENEFITS — 6 dark navy cards ═══ */}
      <section id="services" className="benefits-s">
        <div className="wrap">
          <div className="sec-title center rv">
            <span className="eyebrow">Why Smart Owners Choose Coating</span>
            <h2>The 20-Year Roof Upgrade<br /><em>Smart Owners</em> Already Know About</h2>
          </div>
          <div className="benefits-grid">
            {[
              { icon: "fa-dollar-sign", title: "Save Up To 75% — Period.", body: "Replacement: $8–$14/sq ft. Coating: $3–$5. On a 20,000 sq ft roof, you keep $100K+ in your pocket. Same waterproofing. Better warranty." },
              { icon: "fa-volume-mute", title: "Zero Disruption — Tenants Won't Know", body: "No tear-off. No dumpsters. No closed parking. No noise. We're in and out before your tenants notice anything changed." },
              { icon: "fa-shield-alt", title: "20-Year Manufacturer Warranty", body: "Backed in writing by the manufacturer — not a contractor handshake. Fully transferable when you sell the building." },
              { icon: "fa-thermometer-quarter", title: "Cooling Bills Drop 25% — Day One", body: "Reflective coatings cut rooftop temps by up to 60°F. Your HVAC stops fighting the sun. Energy savings start the day we leave." },
              { icon: "fa-leaf", title: "Keep 20+ Tons Out Of The Landfill", body: "Tear-offs send a mountain of debris to the dump. Coating restores what's already there — and your tenants love the green credentials." },
              { icon: "fa-clock", title: "Bone-Dry In 3 Days Flat", body: "Most commercial roofs fully coated in 1–3 working days. Sealed, warrantied, and leak-free by the end of the week. No exceptions." },
            ].map((b, i) => (
              <div key={i} className="benefit-card rv">
                <div className="bc-icon-wrap">
                  <div className="bc-icon-ring" />
                  <div className="bc-icon"><i className={`fas ${b.icon}`}></i></div>
                </div>
                <h3>{b.title}</h3>
                <p>{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ROOF SYSTEMS WE COAT ═══ */}
      <section id="roof-types" className="roof-types">
        <div className="wrap">
          <div className="sec-title center rv">
            <span className="eyebrow">What We Coat</span>
            <h2>Every Roof System — <em>Restored</em>, Not Replaced</h2>
            <p style={{ maxWidth: 640, margin: "14px auto 0", color: "var(--gray)" }}>If your commercial roof is one of these, coating is almost certainly the smarter decision — and we've sealed thousands of them.</p>
          </div>
          <div className="rt-grid">
            {[
              { icon: "fa-building", name: "TPO", desc: "Single-Ply Thermoplastic" },
              { icon: "fa-industry", name: "EPDM", desc: "Synthetic Rubber Membrane" },
              { icon: "fa-warehouse", name: "PVC", desc: "Durable Polyvinyl Membrane" },
              { icon: "fa-layer-group", name: "Metal", desc: "Standing Seam & R-Panel" },
              { icon: "fa-scroll", name: "Modified Bitumen", desc: "Asphalt-Based Membrane" },
              { icon: "fa-stream", name: "Built-Up", desc: "Traditional Tar & Gravel" },
            ].map((t, i) => (
              <div key={i} className="rt-card rv">
                <div className="rt-icon"><i className={`fas ${t.icon}`}></i></div>
                <div className="rt-name">{t.name}</div>
                <div className="rt-desc">{t.desc}</div>
              </div>
            ))}
          </div>
          <p className="rt-note rv">Not sure what you have? Send a photo when you book — we'll confirm during the inspection.</p>
        </div>
      </section>

      {/* ═══ FACT COUNTER ═══ */}
      <section className="facts">
        <div className="wrap">
          <div className="facts-grid">
            {[
              { icon: "fa-check-circle", stop: 1200, suffix: "+", label: "Roofs Coated" },
              { icon: "fa-dollar-sign", stop: 127, suffix: "K", label: "Avg. Project Savings" },
              { icon: "fa-percentage", stop: 75, suffix: "%", label: "Max Savings vs. Replacement" },
              { icon: "fa-medal", stop: 20, suffix: " yr", label: "Manufacturer Warranty" },
            ].map((f, i) => (
              <div key={i} className="fact-item rv">
                <div className="fi-icon"><i className={`fas ${f.icon}`}></i></div>
                <div className="fi-n">
                  <span ref={(el) => { counterRefs.current[2 + i] = el; }} data-stop={f.stop} data-speed="2500">0</span>{f.suffix}
                </div>
                <div className="fi-l">{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CASE STUDY ═══ */}
      <section id="blog" className="case-s">
        <div className="wrap">
          <div className="sec-title center rv">
            <span className="eyebrow eyebrow-light">Case Study</span>
            <h2 className="h2-light">How One Smart Property Manager<br />Saved <em>$127,000</em> — In One Phone Call</h2>
          </div>
          <div className="cs-grid">
            <div className="cs-i rv"><div className="cs-lb">Building</div><div className="cs-v">45,000 ft²</div><div className="cs-sub">Commercial office</div></div>
            <div className="cs-i rv"><div className="cs-lb">Replacement Quote</div><div className="cs-v">$189,000</div><div className="cs-sub">Full tear-off</div></div>
            <div className="cs-i rv"><div className="cs-lb">Coating Cost</div><div className="cs-v">$62,000</div><div className="cs-sub">Silicone system</div></div>
            <div className="cs-i rv"><div className="cs-lb">Total Saved</div><div className="cs-v hl">$127,000</div><div className="cs-sub">Zero leaks since</div></div>
          </div>
          <div className="cs-bottom">
            <div className="cs-details rv">
              <p><strong>The situation:</strong> 45,000 sq ft commercial office, 18-year-old flat TPO roof. Multiple leaks, interior damage. Replacement quote: $189,000.</p>
              <p><strong>Our solution:</strong> Full silicone coating with complete surface prep. 20-year manufacturer warranty. Total: $62,000. Done in 4 days.</p>
              <p className="cs-result"><strong>Result:</strong> $127,000 saved. Zero leaks in 3 years. Warranty transfers with sale.</p>
            </div>
            <div className="cs-quote rv">
              <p>"We were ready to write a check for $189K. They saved us six figures and the roof has been bone dry since. I wish I'd called them first."</p>
              <cite>
                <strong><i className="fas fa-user-tie" /> Michael Hartman</strong>
                <span>Property Manager &middot; Commercial Office Park</span>
              </cite>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="footer">
        <div className="footer-bottom">
          <div className="wrap">
            <div className="fb-inner">
              <p>© 2026 Roof Coat. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
