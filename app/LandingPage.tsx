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

  // Jotform embed handler — auto-resize iframes
  useEffect(() => {
    const jf = document.createElement("script");
    jf.src = "https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js";
    jf.async = true;
    jf.onload = () => {
      const w = window as unknown as { jotformEmbedHandler?: (sel: string, base: string) => void };
      if (w.jotformEmbedHandler) {
        w.jotformEmbedHandler("iframe[id^='JotFormIFrame-']", "https://form.jotform.com/");
      }
    };
    document.body.appendChild(jf);
    return () => {
      if (jf.parentNode) jf.parentNode.removeChild(jf);
    };
  }, []);

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
            <nav className="main-nav">
              <ul>
                {navItems.map((n) => (
                  <li key={n.href}>
                    <a href={n.href} onClick={smoothScroll}>{n.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="header-right">
              <a href="#contact" className="btn-one" onClick={smoothScroll}>
                <span>See If You Qualify</span>
              </a>
              <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
                <span /><span /><span />
              </button>
            </div>
          </div>
        </div>
        {mobileOpen && (
          <div className="mobile-menu">
            <ul>
              {navItems.map((n) => (
                <li key={n.href}>
                  <a href={n.href} onClick={smoothScroll}>{n.label}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
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
            <h1>Add 10–20 Years to Your Roof<br />— Skip the Replacement</h1>
            <p>Smart commercial owners coat. Manufacturer-backed silicone seals leaks, reflects heat, and cuts energy bills — without a single day of tear-off.</p>
            <div className="hero-ctas">
              <a href="#services" className="btn-one" onClick={smoothScroll}><span>How It Works</span></a>
              <a href="#projects" className="btn-one btn-ghost" onClick={smoothScroll}><span>See Recent Work</span></a>
            </div>
          </div>
          <div className="hero-formbox rv">
            <div className="hfb-head">
              <span className="eyebrow">Free Assessment</span>
              <h3>See If Your Roof Qualifies</h3>
              <p>30-second form · Report + quote within 24 hrs</p>
            </div>
            <iframe
              id="JotFormIFrame-261093407189057-hero"
              title="Free Roof Coating Assessment"
              allow="geolocation; microphone; camera; fullscreen"
              src="https://form.jotform.com/261093407189057"
              className="jotform-frame"
              scrolling="no"
            ></iframe>
          </div>
        </div>
        <div className="hero-dots">
          {slides.map((_, i) => (
            <button key={i} className={i === slide ? "active" : ""} onClick={() => setSlide(i)} aria-label={`Go to slide ${i + 1}`} />
          ))}
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
              <p>Most commercial roofs don't need a tear-off. If the deck is structurally sound, a professional-grade silicone system seals every seam, blister, and pinhole — restoring the roof for decades at a fraction of replacement cost.</p>
              <p>Our applications are backed by manufacturer warranties up to 20 years, transferable on sale, and installed in 1–3 working days without disturbing tenants or operations.</p>
              <p>Over 1,200 commercial owners across 14 industries have already made the smarter decision. Here's your chance to skip the six-figure quote.</p>
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
            <h2>Here's Exactly What Happens</h2>
          </div>
          <div className="process-grid">
            {[
              { n: "01", title: "Schedule an Inspection", body: "We inspect, measure, and confirm whether coating is right. Written report delivered same week." },
              { n: "02", title: "Receive a Fixed Quote", body: "We recommend the right system — silicone, acrylic, or hybrid — based on roof, climate, and budget." },
              { n: "03", title: "Enjoy a 20-Year Roof", body: "Certified crew cleans, primes, coats. You get manufacturer warranty docs and a bone-dry roof." },
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

      {/* ═══ SERVICES (Benefits) ═══ */}
      <section id="services" className="services">
        <div className="wrap">
          <div className="sec-title center rv">
            <span className="eyebrow">Why Owners Choose Coating</span>
            <h2>Save More. Wait Less.<br />Cover Every Risk.</h2>
          </div>
          <div className="services-grid">
            {[
              { icon: "fa-dollar-sign", title: "Save Up to 75%", body: "Replacement runs $8–$14/sq ft. Coating runs $3–$5. On a 20,000 sq ft roof, that's $100K+ kept in your pocket.", img: "https://ik.imagekit.io/qcvroy8xpd/34.png" },
              { icon: "fa-shield-alt", title: "20-Year Warranty", body: "Manufacturer-backed coverage — transferable on sale. Not a handshake. A document.", img: "https://ik.imagekit.io/qcvroy8xpd/20.png" },
              { icon: "fa-bolt", title: "1–3 Day Install", body: "Zero tear-off. Zero tenant disruption. Your operation runs while we restore the roof.", img: "https://ik.imagekit.io/qcvroy8xpd/35.png" },
            ].map((s, i) => (
              <div key={i} className="service-card rv">
                <div className="sc-img" style={{ backgroundImage: `url('${s.img}')` }} />
                <div className="sc-body">
                  <div className="sc-icon"><i className={`fas ${s.icon}`}></i></div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  <a href="#contact" className="sc-link" onClick={smoothScroll}>
                    <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="center rv">
            <a href="#contact" className="btn-one" onClick={smoothScroll}><span>Get Your Free Report</span></a>
          </div>
        </div>
      </section>

      {/* ═══ ROOF SYSTEMS WE COAT ═══ */}
      <section id="roof-types" className="roof-types">
        <div className="wrap">
          <div className="sec-title center rv">
            <span className="eyebrow">What We Coat</span>
            <h2>Roof Systems We Restore</h2>
            <p style={{ maxWidth: 620, margin: "14px auto 0", color: "var(--gray)" }}>If your commercial roof is one of these, coating is almost certainly the smarter decision.</p>
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

      {/* ═══ RECENT PROJECTS ═══ */}
      <section id="projects" className="team">
        <div className="wrap">
          <div className="sec-title center rv">
            <span className="eyebrow">Recent Work</span>
            <h2>Projects Restored<br />This Year</h2>
          </div>
          <div className="projects-gallery">
            {projectImages.map((file, i) => (
              <div key={i} className="proj-card rv">
                <img src={`https://ik.imagekit.io/qcvroy8xpd/${file}`} alt="Commercial roof coating project" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BLOG / INSIGHTS ═══ */}
      <section id="blog" className="blog">
        <div className="wrap">
          <div className="sec-title center rv">
            <span className="eyebrow">Owner Insights</span>
            <h2>What Smart Commercial<br />Owners Are Reading</h2>
          </div>
          <div className="blog-grid">
            {[
              { date: "07 Dec", cat: "COATING", title: "When Coating Beats Tear-Off: A Decision Framework.", img: "https://ik.imagekit.io/qcvroy8xpd/22.png" },
              { date: "12 Dec", cat: "ROI", title: "Silicone vs. Acrylic: Which System Pays Faster?", img: "https://ik.imagekit.io/qcvroy8xpd/37.png" },
              { date: "18 Dec", cat: "WARRANTY", title: "10 Things to Verify Before Signing Your Coating Warranty.", img: "https://ik.imagekit.io/qcvroy8xpd/26.png" },
            ].map((b, i) => (
              <article key={i} className="blog-card rv">
                <div className="bc-img" style={{ backgroundImage: `url('${b.img}')` }}>
                  <div className="bc-date">{b.date}</div>
                </div>
                <div className="bc-body">
                  <div className="bc-meta">
                    <span>{b.cat}</span>
                    <span>ROOF COAT</span>
                  </div>
                  <h3>{b.title}</h3>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing sed do eiusmod tempor incididunt labore dolore.</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ QUALIFY — BENTO GRID ═══ */}
      <section id="contact" className="qualify">
        <div className="wrap">
          <div className="bento">
            <div className="bt bt-title rv">
              <span className="eyebrow">Start Here</span>
              <h2>Wondering If Your Roof<br />Qualifies for Coating?</h2>
              <p>Takes 30 seconds. We'll send a written report and fixed-price quote within 24 hours — no obligation.</p>
            </div>

            <div className="bt bt-stat bt-stat-dark rv">
              <div className="bt-n">$127K</div>
              <div className="bt-l">Avg. Project Savings</div>
            </div>

            <div className="bt bt-stat bt-stat-primary rv">
              <div className="bt-n">1,200<span>+</span></div>
              <div className="bt-l">Commercial Roofs Coated</div>
            </div>

            <div className="bt bt-reviews rv">
              <div className="bt-stars"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
              <div className="bt-reviews-n"><strong>4.9 / 5</strong> &middot; 127 Google Reviews</div>
            </div>

            <div className="bt bt-form rv">
              <iframe
                id="JotFormIFrame-261093407189057-1"
                title="Free Roof Coating Assessment"
                allow="geolocation; microphone; camera; fullscreen"
                src="https://form.jotform.com/261093407189057"
                className="jotform-frame"
                scrolling="no"
              ></iframe>
            </div>

            <div className="bt bt-warranty rv">
              <div className="bt-warranty-icon"><i className="fas fa-shield-alt"></i></div>
              <div>
                <div className="bt-warranty-n">Up to 20-Year</div>
                <div className="bt-warranty-l">Manufacturer Warranty &middot; Transferable on Sale</div>
              </div>
            </div>

            <div className="bt bt-speed rv">
              <div className="bt-speed-icon"><i className="fas fa-bolt"></i></div>
              <div className="bt-speed-txt"><strong>1–3 Day Install</strong><span>Zero tenant disruption</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="footer">
        <div className="wrap">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-logo">
                <span className="logo-mark">
                  <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                    <path d="M4 30 L20 10 L36 30" stroke="#fff" strokeWidth="2.5" strokeLinejoin="miter" strokeLinecap="square" />
                    <line x1="8" y1="23" x2="32" y2="23" stroke="var(--primary)" strokeWidth="3" strokeLinecap="square" />
                  </svg>
                </span>
                <span className="logo-txt">Roof Coat</span>
              </div>
              <p>Manufacturer-backed silicone and acrylic coating systems for commercial property owners who'd rather restore than replace.</p>
              <div className="footer-hours">
                <h4>Open Hours</h4>
                <p>Mon – Sat: 7AM – 6PM<br />Sunday: Closed</p>
              </div>
            </div>

            <div className="footer-col">
              <h3>Coating Services</h3>
              <ul className="footer-links">
                <li><a href="#">Silicone Roof Coating</a></li>
                <li><a href="#">Acrylic Roof Coating</a></li>
                <li><a href="#">Metal Roof Restoration</a></li>
                <li><a href="#">TPO / EPDM Restoration</a></li>
                <li><a href="#">Preventative Maintenance</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>Useful Links</h3>
              <ul className="footer-links">
                <li><a href="#about" onClick={smoothScroll}>About</a></li>
                <li><a href="#services" onClick={smoothScroll}>Benefits</a></li>
                <li><a href="#projects" onClick={smoothScroll}>Recent Projects</a></li>
                <li><a href="#blog" onClick={smoothScroll}>Insights</a></li>
                <li><a href="#contact" onClick={smoothScroll}>Contact</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>Subscribe</h3>
              <p>Monthly coating tips, case studies, and ROI breakdowns for commercial owners.</p>
              <form className="subscribe-form" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Email address" required />
                <button type="submit" aria-label="Subscribe"><i className="fas fa-arrow-right"></i></button>
              </form>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="wrap">
            <div className="fb-inner">
              <p>© 2026 Roof Coat. All Rights Reserved.</p>
              <ul className="fb-links">
                <li><a href="#">Terms &amp; Conditions</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
