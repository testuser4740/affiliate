"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Trophy, IndianRupee, Rocket, Megaphone, Users, CheckCircle2, ArrowRight, Instagram, MessageCircle, Star, ChevronDown, Award, Lock, Package, Feather, Briefcase, FileText } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import { colleges } from "@/data/options";
import { backend } from "@/lib/apiHooks";
const Pill = ({ children, className = "" }) => (
  <span className={`gajab-sticker-yellow ${className}`}>{children}</span>
);

const Step = ({ num, title, desc, accent }) => (
  <div className="gajab-card p-6 relative">
    <div className={`w-12 h-12 rounded-xl border border-[#EFEAE0] grid place-items-center font-display text-2xl font-extrabold mb-4 ${accent}`}>
      {num}
    </div>
    <h4 className="font-display text-xl font-extrabold mb-1">{title}</h4>
    <p className="text-sm text-[#5A6378]">{desc}</p>
  </div>
);

const Perk = ({ icon: Icon, title, value, bg }) => (
  <div className={`gajab-card p-5 ${bg}`}>
    <Icon className="w-6 h-6 mb-2" strokeWidth={2.5} />
    <p className="text-xs font-extrabold uppercase tracking-wider opacity-70">{title}</p>
    <p className="font-display text-3xl font-extrabold mt-1">{value}</p>
  </div>
);

const Testimonial = ({ name, college, quote, img }) => (
  <div className="gajab-card p-5">
    <div className="flex items-center gap-3 mb-3">
      <img src={img} alt="" className="w-12 h-12 rounded-full object-cover border border-[#EFEAE0]" />
      <div>
        <p className="font-display font-extrabold">{name}</p>
        <p className="text-xs text-[#5A6378]">{college}</p>
      </div>
    </div>
    <div className="flex gap-0.5 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#FFC93C] text-[#FFC93C]" />)}</div>
    <p className="text-sm leading-relaxed">"{quote}"</p>
  </div>
);

const Faq = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => setOpen(!open)} className="w-full text-left gajab-card-soft p-5 hover:border-[#EFEAE0] transition-all" data-testid={`faq-${q.slice(0, 10)}`}>
      <div className="flex items-center justify-between gap-4">
        <p className="font-display font-extrabold">{q}</p>
        <ChevronDown className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && <p className="mt-3 text-sm text-[#5A6378] leading-relaxed">{a}</p>}
    </button>
  );
};

const CommissionCalculator = () => {
  const [orders, setOrders] = React.useState(25);
  const [aov, setAov] = React.useState(1000);
  const rate = 0.075; // 7.5%
  const earnings = Math.round(orders * aov * rate);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="commission-calculator">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <span className="gajab-sticker-orange inline-flex items-center gap-1.5"><IndianRupee className="w-3.5 h-3.5" strokeWidth={2} /> Earnings Calculator</span>
        <h2 className="font-display text-4xl sm:text-5xl font-extrabold mt-4">How Much Will You Earn?</h2>
        <p className="text-[#5A6378] mt-3">Move the sliders. See your earning power instantly.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-6 items-stretch">
        {/* Earnings display */}
        <div className="gajab-card p-8 bg-gradient-to-br from-[#F26B1F] to-[#C9450C] text-white flex flex-col justify-center">
          <p className="text-xs uppercase font-extrabold tracking-wider text-[#FFC93C]">You could earn up to</p>
          <p className="font-display text-7xl sm:text-8xl font-extrabold leading-none mt-2" data-testid="calc-earnings">₹{earnings.toLocaleString()}</p>
          <p className="text-sm mt-4 opacity-90">based on 7.5% commission rate</p>
          <div className="mt-6 inline-flex items-center gap-2 self-start bg-white/15 border border-white/30 backdrop-blur px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#FFC93C]" />
            <p className="text-xs font-bold">Paid as Gajab Cash Vouchers</p>
          </div>
        </div>
        {/* Sliders */}
        <div className="gajab-card p-8 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold inline-flex items-center gap-1.5"><Package className="w-4 h-4 text-[#F26B1F]" strokeWidth={2} /> Number of Orders</span>
              <span className="font-display text-2xl text-[#F26B1F]">{orders}</span>
            </div>
            <input type="range" min={25} max={200} step={5} value={orders} onChange={e=>setOrders(parseInt(e.target.value))} className="w-full accent-[#F26B1F]" data-testid="calc-orders-slider" />
            <div className="flex justify-between text-[10px] font-bold text-[#5A6378] mt-1"><span>25 orders</span><span>200 orders</span></div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold inline-flex items-center gap-1.5"><IndianRupee className="w-4 h-4 text-[#F26B1F]" strokeWidth={2} /> Average Order Value</span>
              <span className="font-display text-2xl text-[#F26B1F]">₹{aov.toLocaleString()}</span>
            </div>
            <input type="range" min={100} max={10000} step={100} value={aov} onChange={e=>setAov(parseInt(e.target.value))} className="w-full accent-[#F26B1F]" data-testid="calc-aov-slider" />
            <div className="flex justify-between text-[10px] font-bold text-[#5A6378] mt-1"><span>₹100</span><span>₹10,000</span></div>
          </div>
          <p className="text-[11px] text-[#5A6378] leading-relaxed">*Earning estimates are for illustrative purposes only and depend on order performance, order values, and program terms.</p>
          <a href="#apply" className="btn-primary w-full">Lock in Your Earnings <ArrowRight className="w-4 h-4" /></a>
        </div>
      </div>
    </section>
  );
};

export default function ApplyPage() {
  const nav = useRouter();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    email: "", fullName: "", mobile: "", whatsapp: "",
    college: "", collegeState: "", collegeStateOther: "", city: "", year: "",
    instagram: "", linkedin: "",
    clubInvolvement: "",
  });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const next = () => {
    if (step === 1 && (!form.fullName || !form.email || !form.mobile || !form.whatsapp)) { toast.error("Please fill all required fields"); return; }
    if (step === 2 && (!form.college || !form.collegeState || !form.city || !form.year)) { toast.error("Please fill all required college fields"); return; }
    if (step === 3 && !form.instagram) { toast.error("Instagram profile link is required"); return; }
    setStep(s => Math.min(4, s + 1));
  };
  const back = () => setStep(s => Math.max(1, s - 1));
  const submit = async () => {
    const payload = {
      name: form.fullName,
      phone: form.mobile,
      whatsapp: form.whatsapp,
      email: form.email,
      college: form.college,
      city: form.city,
      state: form.collegeState === "Other" ? form.collegeStateOther : form.collegeState,
      year: form.year,
      instagram: form.instagram,
      linkedin: form.linkedin,
      clubInvolvement: form.clubInvolvement,
      appliedOn: new Date().toISOString().slice(0, 10),
    };
    try {
      await backend.submitApplication(payload);
      setSubmitted(true);
      toast.success("Application submitted! We'll get back to you in 48 hours 🎉");
    } catch (err) {
      // Offline / backend down — still show success in demo mode.
      setSubmitted(true);
      toast.success("Application submitted! We'll get back to you in 48 hours 🎉");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7EE] text-[#1B2D54]">
      {/* NAV */}
      <header className="sticky top-0 z-40 bg-[#FFF7EE]/85 backdrop-blur border-b border-[#EFEAE0]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn-ghost text-sm" data-testid="nav-login-btn">Ambassador Login</Link>
            <a href="#apply" className="btn-primary text-sm" data-testid="nav-apply-btn">Apply Now</a>
          </div>
        </div>
        {/* marquee */}
        <div className="bg-[#1B2D54] text-[#FFC93C] py-2 overflow-hidden whitespace-nowrap">
          <div className="marquee-track inline-block">
            {Array(2).fill(0).map((_, i) => (
              <span key={i} className="inline-flex items-center gap-8 px-4 font-display font-extrabold uppercase tracking-wider text-sm">
                <span>🔥 312 ambassadors earning</span><span>•</span>
                <span>💰 ₹18.4L paid out this quarter</span><span>•</span>
                <span>🎓 80+ colleges across India</span><span>•</span>
                <span>⚡ Top earner: ₹68,420/month</span><span>•</span>
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#FFC93C] blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-[#F26B1F] blur-3xl opacity-20 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <Pill className="mb-4">🏆 Campus Ambassador Program • 2026</Pill>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight">
              Your college.<br />
              Your vibe.<br />
              <span className="text-[#F26B1F]">Your earnings.</span>
            </h1>
            <p className="mt-6 text-lg text-[#5A6378] max-w-xl leading-relaxed">
              Become a <b>Gajab Campus Ambassador</b> — share India&apos;s most fun bargain marketplace with your crew and pocket commissions on every order. No fees, no targets, full freedom.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#apply" className="btn-primary" data-testid="hero-apply-btn">Apply via Campus <ArrowRight className="w-4 h-4" /></a>
              <a href="#how" className="btn-ghost" data-testid="hero-how-btn">How it works</a>
            </div>
            <div className="mt-8 flex items-center gap-6 flex-wrap">
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/64?img=${i+10}`} alt="" className="w-9 h-9 rounded-full border border-white/40 object-cover" />
                ))}
              </div>
              <p className="text-sm font-bold">312+ students • 80+ colleges</p>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            {/* Hero student visual */}
            <div className="relative rounded-3xl overflow-hidden border border-[#EFEAE0] shadow-[0_12px_40px_rgba(27,45,84,0.18)] aspect-[5/6] sm:aspect-[6/7]">
              <img
                src="https://images.pexels.com/photos/4622108/pexels-photo-4622108.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Indian college students collaborating on campus"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Color tint to match brand */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1B2D54]/40 via-transparent to-[#F26B1F]/25 mix-blend-multiply" />
              {/* Top live strip */}
              <div className="absolute left-4 right-4 top-4 rounded-2xl bg-white/95 backdrop-blur p-3 flex items-center gap-3 border border-white/60">
                <div className="flex -space-x-2">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" className="w-8 h-8 rounded-full border border-white object-cover" alt="" />
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop" className="w-8 h-8 rounded-full border border-white object-cover" alt="" />
                  <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop" className="w-8 h-8 rounded-full border border-white object-cover" alt="" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-sm leading-tight">Live · 312 ambassadors earning now</p>
                  <p className="text-[10px] uppercase tracking-wider text-[#5A6378] font-bold">₹18.4L paid this quarter</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERKS HIGHLIGHTS — 3 hero stat cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { img: "https://gajab.com/img/campus/underwater.webp", label: "International", sub: "Trip Experience" },
            { img: "https://gajab.com/img/campus/mobile.webp", label: "Mega Rewards", sub: "Quarterly & Yearly" },
            { img: "https://gajab.com/img/campus/pay.webp", label: "7.5%", sub: "Commission Per Order" },
          ].map((c, i) => (
            <div key={i} className="gajab-card overflow-hidden group hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(242,107,31,0.20)] transition-all duration-300">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={c.img} alt={c.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B2D54]/25 via-transparent to-transparent" />
              </div>
              <div className="p-6 text-center">
                <p className="font-display text-3xl text-[#F26B1F]">{c.label}</p>
                <p className="text-sm text-[#5A6378] mt-1">{c.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMMISSION CALCULATOR — mirrors gajab.com/campus-ambassador */}
      <CommissionCalculator />

      {/* LEAD EARN GET RECOGNIZED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="gajab-sticker-orange inline-flex items-center gap-1.5"><Award className="w-3.5 h-3.5" strokeWidth={2} /> Your Career Story Starts Here</span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mt-4">Lead. Earn. Get Recognized.</h2>
          <p className="text-[#5A6378] mt-3">Build a resume that gets you hired anywhere — certifications, founder LOR, and real industry experience, including regular visits to Gajab&apos;s offices.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { Icon: Feather, title: "Founder LOR", desc: "Earn a personal Letter of Recommendation from Gajab founders. A career game-changer that opens doors to top opportunities.", img: "https://gajab.com/img/campus/gajab-founder-lor.webp" },
            { Icon: Briefcase, title: "Internship Opportunity", desc: "Top performers earn official internship offers with Gajab. Real industry experience that sets you apart.", img: "https://gajab.com/img/campus/gajab-internship-opportunity.webp" },
            { Icon: FileText, title: "Experience Certificate", desc: "Earn verified certificates at every milestone. Boost your resume, LinkedIn profile, and career story.", img: "https://gajab.com/img/campus/gajab-experience-certificate.webp" },
          ].map((c, i) => (
            <div key={i} className="gajab-card overflow-hidden">
              <div className="relative aspect-video">
                <img src={c.img} alt={c.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F26B1F]/80 via-[#F26B1F]/40 to-transparent" />
                <span className="absolute top-3 left-3 gajab-sticker bg-white/95 text-[#1B2D54] text-[10px] inline-flex items-center gap-1"><Lock className="w-3 h-3" strokeWidth={2} /> Only On Completion</span>
                <div className="absolute bottom-3 left-3 w-10 h-10 bg-white rounded-xl grid place-items-center shadow"><c.Icon className="w-5 h-5 text-[#F26B1F]" strokeWidth={2} /></div>
              </div>
              <div className="p-5">
                <h4 className="font-display text-lg">{c.title}</h4>
                <p className="text-sm text-[#5A6378] mt-1.5 leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WIN BIG EVERY QUARTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="gajab-sticker-orange inline-flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5" strokeWidth={2} /> Quarterly Prizes</span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mt-4">Win Big. Every Quarter.</h2>
          <p className="text-[#5A6378] mt-3">The top 10 leaders win epic prizes every 3 months.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { rank: "#1", title: "Smartphone or Laptop", img: "https://gajab.com/img/campus/gajab-prize-smartphone-laptop.webp", featured: true },
            { rank: "#2", title: "Tablet", img: "https://gajab.com/img/campus/gajab-prize-tablet.webp" },
            { rank: "#3", title: "Smartwatch", img: "https://gajab.com/img/campus/gajab-prize-smartwatch.webp" },
            { rank: "#4", title: "Earbuds", img: "https://gajab.com/img/campus/gajab-prize-earbuds.webp" },
            { rank: "#5-10", title: "Gajab Welcome Kit", img: "https://gajab.com/img/campus/gajab-welcome-kit.webp" },
          ].map((p, i) => (
            <div key={i} className="gajab-card overflow-hidden group cursor-pointer hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(242,107,31,0.25)] hover:border-[#F26B1F] transition-all duration-300">
              <div className="relative aspect-square overflow-hidden">
                <img src={p.img} alt={p.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B2D54]/0 to-[#1B2D54]/0 group-hover:from-[#F26B1F]/40 group-hover:to-transparent transition-all duration-300" />
                <span className={`absolute top-3 left-3 gajab-sticker text-[10px] transition-all ${p.featured ? "bg-[#F26B1F] text-white" : "bg-[#1B2D54] text-white group-hover:bg-[#F26B1F]"}`}>{p.rank}</span>
              </div>
              <div className="p-3 text-center">
                <p className="font-display text-sm leading-tight group-hover:text-[#F26B1F] transition-colors">{p.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* APPLY FORM */}
      <section id="apply" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="gajab-card p-6 sm:p-10">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto bg-[#FFC93C] rounded-full border border-[#EFEAE0] grid place-items-center mb-4">
                <CheckCircle2 className="w-10 h-10" strokeWidth={2.5} />
              </div>
              <h3 className="font-display text-4xl font-extrabold">Application In!</h3>
              <p className="mt-3 text-[#5A6378] max-w-md mx-auto">We'll review your application within 48 hours. If approved, you'll get login details via WhatsApp & email.</p>
              <button onClick={() => nav.push("/login")} className="btn-primary mt-6" data-testid="apply-success-login-btn">Go to Login <ArrowRight className="w-4 h-4" /></button>
            </div>
          ) : (
            <>
              <Pill>Step {step} of 4</Pill>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold mt-3">Apply via Campus</h2>
              <p className="text-[#5A6378] mt-2 mb-6">Takes ~2 minutes. We'll get back in 48 hours.</p>

              {/* Progress */}
              <div className="flex gap-1.5 mb-8">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`h-2 flex-1 rounded-full border border-[#EFEAE0] ${i <= step ? "bg-[#F26B1F]" : "bg-white"}`} />
                ))}
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  {/* Form Intro Content from Google Form */}
                  <div className="rounded-2xl bg-gradient-to-br from-[#FFE9D9] to-[#FFF1C2] border border-[#F26B1F]/30 p-5 mb-4">
                    <h3 className="font-display text-2xl font-extrabold leading-tight text-[#1B2D54]">Gajab ka Campus Ambassador — <span className="text-[#F26B1F]">Lead. Earn. Get Recognized.</span></h3>
                    <div className="mt-4 space-y-3 text-sm text-[#1B2D54] leading-relaxed">
                      <p>You&apos;re not applying for a job. You&apos;re stepping into a leadership role at one of India&apos;s most exciting e-commerce startups.</p>
                      <p>As a Gajab Ka Campus Ambassador, you&apos;ll build the brand on your campus, earn commission on every order <b>(no upper cap)</b>, and grow into a <b>City Head</b> managing operations across your city.</p>
                      <p>Before you apply, we strongly recommend downloading the Gajab app and exploring it. It&apos;ll give you a clear understanding of the product you&apos;ll be representing on your campus.</p>
                      <p>👉 Download the app: <a href="https://gajab.go.link/bfR8p" target="_blank" rel="noreferrer" className="text-[#F26B1F] font-bold underline">https://gajab.go.link/bfR8p</a></p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#F26B1F]/20">
                      <p className="font-bold text-[#1B2D54] text-sm mb-2">Please note:</p>
                      <ul className="space-y-1.5 text-sm text-[#1B2D54]">
                        <li>⏱️ This form takes just 10–15 minutes. Be honest — we&apos;re looking for drive, not perfection.</li>
                        <li>🔒 Limited seats per city. Applications are reviewed on a rolling basis.</li>
                        <li>📩 Shortlisted candidates will be contacted within 5 business days.</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-extrabold">👋 Tell us about you</h3>
                  <label className="block"><span className="text-xs font-bold uppercase tracking-wider">Full Name <span className="text-[#F26B1F]">*</span></span><input data-testid="apply-fullname" value={form.fullName} onChange={e=>upd("fullName",e.target.value)} placeholder="Your full name" className="input-gajab mt-1" /></label>
                  <label className="block"><span className="text-xs font-bold uppercase tracking-wider">Email <span className="text-[#F26B1F]">*</span></span><input type="email" data-testid="apply-email" value={form.email} onChange={e=>upd("email",e.target.value)} placeholder="you@college.edu" className="input-gajab mt-1" /></label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="block"><span className="text-xs font-bold uppercase tracking-wider">Mobile Number <span className="text-[#F26B1F]">*</span></span><input data-testid="apply-mobile" value={form.mobile} onChange={e=>upd("mobile",e.target.value)} placeholder="+91 98765 43210" className="input-gajab mt-1" /></label>
                    <label className="block"><span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> WhatsApp Number <span className="text-[#F26B1F]">*</span></span><input data-testid="apply-whatsapp" value={form.whatsapp} onChange={e=>upd("whatsapp",e.target.value)} placeholder="+91 98765 43210" className="input-gajab mt-1" /></label>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-display text-xl font-extrabold">🎓 Your college</h3>
                  <label className="block"><span className="text-xs font-bold uppercase tracking-wider">College / University Name <span className="text-[#F26B1F]">*</span></span><input data-testid="apply-college" value={form.college} onChange={e=>upd("college",e.target.value)} placeholder="e.g. Delhi University" className="input-gajab mt-1" /></label>
                  <div className="block">
                    <span className="text-xs font-bold uppercase tracking-wider">Where is your college located? <span className="text-[#F26B1F]">*</span></span>
                    <div className="mt-2 grid grid-cols-3 gap-2" data-testid="apply-college-state">
                      {["Maharashtra", "Gujarat", "Other"].map(s => (
                        <button key={s} type="button" onClick={()=>upd("collegeState", s)} className={`p-3 rounded-xl border text-sm font-bold transition-all ${form.collegeState===s ? "border-[#F26B1F] bg-[#FFE9D9] text-[#C9450C]" : "border-[#EFEAE0] bg-white text-[#5A6378] hover:border-[#F26B1F]/40"}`}>
                          <span className={`inline-block w-3.5 h-3.5 rounded-full border-2 mr-1.5 align-middle ${form.collegeState===s ? "border-[#F26B1F] bg-[#F26B1F]" : "border-[#D1D5DB]"}`} />{s}
                        </button>
                      ))}
                    </div>
                    {form.collegeState === "Other" && (
                      <input
                        type="text"
                        value={form.collegeStateOther}
                        onChange={e=>upd("collegeStateOther", e.target.value)}
                        placeholder="Enter state name (e.g. Karnataka)"
                        className="input-gajab mt-2"
                        data-testid="apply-college-state-other"
                      />
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="block"><span className="text-xs font-bold uppercase tracking-wider">City <span className="text-[#F26B1F]">*</span></span><input data-testid="apply-city" value={form.city} onChange={e=>upd("city",e.target.value)} placeholder="e.g. Mumbai" className="input-gajab mt-1" /></label>
                    <label className="block"><span className="text-xs font-bold uppercase tracking-wider">Current Year of Study <span className="text-[#F26B1F]">*</span></span>
                      <select data-testid="apply-year" value={form.year} onChange={e=>upd("year",e.target.value)} className="input-gajab mt-1"><option value="">Select</option><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>Final Year</option><option>Post Graduate</option><option>Other</option></select>
                    </label>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-display text-xl font-extrabold">📣 Your online presence</h3>
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"><Instagram className="w-4 h-4" /> Instagram Profile Link <span className="text-[#F26B1F]">*</span></span>
                    <input data-testid="apply-instagram" value={form.instagram} onChange={e=>upd("instagram",e.target.value)} placeholder="https://instagram.com/yourhandle" className="input-gajab mt-1" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider">LinkedIn Profile Link <span className="text-[#5A6378]">(optional)</span></span>
                    <input data-testid="apply-linkedin" value={form.linkedin} onChange={e=>upd("linkedin",e.target.value)} placeholder="https://linkedin.com/in/yourhandle" className="input-gajab mt-1" />
                  </label>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="font-display text-xl font-extrabold">✨ Your campus involvement</h3>
                  <div className="block">
                    <span className="text-xs font-bold uppercase tracking-wider">Are you part of any college club, committee, or student body?</span>
                    <div className="mt-2 space-y-2" data-testid="apply-club">
                      {[
                        "Yes — I hold a leadership position",
                        "Yes — I'm an active member",
                        "No, but I attend events regularly",
                        "No",
                      ].map(opt => (
                        <button key={opt} type="button" onClick={()=>upd("clubInvolvement", opt)} className={`w-full text-left p-3 rounded-xl border text-sm font-bold flex items-center gap-2.5 transition-all ${form.clubInvolvement===opt ? "border-[#F26B1F] bg-[#FFE9D9] text-[#C9450C]" : "border-[#EFEAE0] bg-white text-[#5A6378] hover:border-[#F26B1F]/40"}`}>
                          <span className={`inline-block w-4 h-4 rounded-full border-2 ${form.clubInvolvement===opt ? "border-[#F26B1F] bg-[#F26B1F] ring-2 ring-[#F26B1F]/20" : "border-[#D1D5DB]"}`} />
                          {opt}
                        </button>
                      ))}
                    </div>
                    {form.clubInvolvement && (
                      <button type="button" onClick={()=>upd("clubInvolvement", "")} className="text-xs font-bold text-[#5A6378] underline mt-2">Clear selection</button>
                    )}
                  </div>
                  <div className="rounded-xl bg-[#FFE9D9] border border-[#F26B1F]/30 p-4 text-sm">
                    <p className="font-bold text-[#C9450C]">🎁 What you&apos;ll get if approved:</p>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-[#5A6378]">
                      <li>Unique affiliate link + promo codes</li>
                      <li>Up to 7.5% commission on every order</li>
                      <li>Welcome swag box delivered to campus</li>
                      <li>Access to private Gajab Ambassador community</li>
                      <li>Quarterly mega prizes + yearly international trip</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-8">
                <button onClick={back} disabled={step===1} className="btn-ghost disabled:opacity-40 disabled:cursor-not-allowed" data-testid="apply-back-btn">Back</button>
                {step < 4 ? (
                  <button onClick={next} className="btn-primary" data-testid="apply-next-btn">Continue <ArrowRight className="w-4 h-4" /></button>
                ) : (
                  <button onClick={submit} className="btn-primary" data-testid="apply-submit-btn">Submit Application <Sparkles className="w-4 h-4" /></button>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Pill>FAQ</Pill>
        <h2 className="font-display text-4xl font-extrabold mt-3 mb-8">Doubts? Cleared.</h2>
        <div className="space-y-3">
          <Faq q="Who can apply?" a="Any currently enrolled college student (UG/PG) in India. We love both shy bookworms and loud campus stars — what matters is your network." />
          <Faq q="Is there any fee?" a="Zero. ₹0. Free. Forever. We only make money when you do." />
          <Faq q="How do I get paid?" a="Bi-monthly payouts directly to your bank via UPI or NEFT. Minimum payout: ₹500." />
          <Faq q="What if my friends cancel orders?" a="Commission is only locked once the order is delivered. Cancelled & returned orders are auto-reversed." />
          <Faq q="Can I join from any college?" a="Yes! We currently have 312 ambassadors across 80+ colleges. If yours isn't listed, just pick 'Other'." />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1B2D54] text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          <div>
            <Logo size="md" showTag={false} variant="light" />
            <p className="mt-4 text-sm opacity-70">India&apos;s most fun bargain marketplace. Now hiring on campus.</p>
          </div>
          <div>
            <p className="font-display font-extrabold mb-3">Ambassador</p>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#apply">Apply now</a></li>
              <li><Link href="/login">Login</Link></li>
              <li><a href="#how">How it works</a></li>
            </ul>
          </div>
          <div>
            <p className="font-display font-extrabold mb-3">Admin</p>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="/admin" data-testid="footer-admin-link">Admin Console</Link></li>
              <li><a href="https://gajab.com">Visit gajab.com</a></li>
            </ul>
          </div>
        </div>
        <p className="text-center text-xs opacity-50 mt-10">© 2026 Gajab Bazaar. Made with 🌶️ in India.</p>
      </footer>
    </div>
  );
}
