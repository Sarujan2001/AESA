import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  Images,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Plane,
  Radar,
  Send,
  Share2,
  X,
} from "lucide-react";

const club = {
  name: "Aerospace Engineering Student Association",
  shortName: "AESA",
  email: "rmitaesa@gmail.com",
  location: "124 La Trobe St, Melbourne VIC 3000",
  socials: {
    facebook: "https://www.facebook.com/RMIT.AESA/",
    instagram: "https://www.instagram.com/rmitaesa/",
    linkedin: "https://au.linkedin.com/company/rmit-aerospace-engineering-student-association-aesa",
    rubric: "https://campus.hellorubric.com/?s=957",
    linktree: "https://linktr.ee/rmitaesa",
  },
};

const navItems = [
  ["Home", "home"],
  ["Activities", "activities"],
  ["Calendar", "#calendar"],
  ["Team", "team"],
  ["Past Events", "past"],
  ["Join Us", "join"],
  ["Contact", "#contact"],
];

const focusAreas = ["Industry Connections", "Trvia Nights", "Networking", "Internships", "Nerds Out", "Assignment Help"];

const sponsors = [
  ["AIAA", "AIAA Melbourne Section", "https://www.linkedin.com/company/aiaa-melbourne-section/", "https://logo.clearbit.com/aiaa.org"],
  ["AMOG", "AMOG", "https://www.amog.consulting/", "https://logo.clearbit.com/amog.consulting"],
  ["B", "Boeing", "https://www.boeing.com.au/", "https://logo.clearbit.com/boeing.com"],
  ["3DS", "Dassault Systemes", "https://www.3ds.com/", "https://logo.clearbit.com/3ds.com"],
  ["DA", "Defence Australia", "https://www.defence.gov.au/", "https://logo.clearbit.com/defence.gov.au"],
  ["DSTG", "DSTG", "https://www.dst.defence.gov.au/", "https://logo.clearbit.com/dst.defence.gov.au"],
  ["D", "Dovetail Electric Aviation", "https://www.dovetail.aero/", "https://logo.clearbit.com/dovetail.aero"],
  ["JAG", "Javelin Aerospace Group", "https://www.javelinaerospace.com/", "https://logo.clearbit.com/javelinaerospace.com"],
  ["JA", "Jetstar Airways", "https://www.jetstar.com/", "https://logo.clearbit.com/jetstar.com"],
  ["QF", "Qantas", "https://www.qantas.com/", "https://logo.clearbit.com/qantas.com"],
  ["RRT", "RMIT Rover Team", "https://www.rmitrover.com/", "https://logo.clearbit.com/rmitrover.com"],
  ["HPR", "Monash High Powered Rocketry", "https://www.monashhpr.com/", "https://logo.clearbit.com/monashhpr.com"],
];

const activities = [
  ["Aerospace Industry Night", "Flagship", "AESA x MAMEC's annual networking night connects students with aerospace companies, Q&A panel guests, internship pathways, and industry representatives."],
  ["Campus Fest Membership Drive", "Orientation", "AESA meets new and returning students on Bowen Street, introducing membership, events, merchandise, and committee opportunities."],
  ["Industry Networking", "Careers", "Events are built around communication skills, professional development, and helping students build contacts with industry."],
  ["Student Project Pathways", "Projects", "AESA connects students with aerospace-adjacent initiatives including space sector, rover, rocketry, UAV, and research communities."],
  ["AIAA RMIT Student Branch", "Professional", "AESA represents the AIAA RMIT University Student Branch and links students with broader aerospace professional networks."],
];

const calendar = [
  ["May 7", "Aerospace Industry Night 2026", "Storey Hall, Building 16", "6:30 PM - 9:30 PM", "Free"],
  ["TBA", "Campus Fest / Club Day", "Bowen Street, RMIT City Campus", "Daytime", "Free"],
  ["TBA", "AIAA Student Branch Session", "RMIT City Campus", "TBA", "Members"],
  ["TBA", "Industry Q&A Panel", "RMIT City Campus", "Evening", "Free"],
  ["TBA", "Project and Pathways Night", "RMIT City Campus", "Evening", "Free"],
];

const executiveTeam = [
  ["Nikolas Makris", "President", "Public AESA post text identifies Nikolas supporting membership sign-ups during Campus Fest.", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"],
  ["Tanya Kimani", "Events Director", "Public AESA post text identifies Tanya as Events Director during Campus Fest.", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"],
  ["Sarujan Srikaran", "Careers Director", "Public AESA post text identifies Sarujan as Careers Director and LinkedIn lists him with AESA.", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"],
];

const generalCommittee = [
  ["Suvindu Amarasekara", "LinkedIn-listed member", "Listed publicly under employees at RMIT Aerospace Engineering Student Association.", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"],
  ["Mahi Mistry", "LinkedIn-listed member", "Listed publicly under employees at RMIT Aerospace Engineering Student Association.", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"],
  ["Timotius Tan", "General committee", "Public AESA post text identifies Timotius supporting committee activity at Campus Fest.", "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80"],
];

const pastEvents = [
  {
    title: "Aerospace Industry Night 2026",
    year: "2026",
    text: "AESA and MAMEC hosted a sold-out industry night with 350 tickets, Q&A panel insight, and companies across aerospace, defence, aviation, and engineering.",
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Campus Fest Membership Drive",
    year: "2026",
    text: "AESA signed up 50 students on the day and reported 191 members to date, introducing students to events, merchandise, and the Rubric membership page.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "AESA x MAMEC Collaboration",
    year: "2026",
    text: "AESA collaborated with Monash Aerospace and Mechanical Engineering Club to bring students, industry professionals, and organisations together.",
    image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=900&q=80",
  },
];

const benefits = [
  "Access AESA events, memberships, and ticketing through Rubric.",
  "Build communication and organisational skills through student-led opportunities.",
  "Meet industry contacts through networking nights, panels, and professional events.",
  "Connect with the AIAA RMIT University Student Branch and wider aerospace community.",
];

function SectionHeader({ eyebrow, title, text }) {
  return (
    <div className="section-header">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      {text && <span>{text}</span>}
    </div>
  );
}

function SocialLink({ href, icon: Icon, label }) {
  return (
    <a className="social-link" href={href} target="_blank" rel="noreferrer">
      <Icon size={18} />
      {label}
    </a>
  );
}

function SponsorLogo({ mark, name, logo }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <span className="sponsor-mark">{mark}</span>;
  }

  return <img className="sponsor-logo" src={logo} alt={`${name} logo`} onError={() => setFailed(true)} />;
}

function PageHero({ eyebrow, title, text, action, onAction }) {
  return (
    <section className="page-hero">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="hero-copy">{text}</p>
      {action && (
        <button className="primary" type="button" onClick={onAction}>
          {action} <ArrowRight size={18} />
        </button>
      )}
    </section>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [activeTarget, setActiveTarget] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactStatus, setContactStatus] = useState("");

  const stats = useMemo(
    () => [
      ["392", "LinkedIn followers"],
      ["191", "members reported"],
      ["350", "AIN 2026 tickets"],
      ["AIAA", "RMIT student branch"],
    ],
    [],
  );

  function navigate(target) {
    if (target.startsWith("#")) {
      setPage("home");
      setActiveTarget(target);
      window.setTimeout(() => document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    } else {
      setPage(target);
      setActiveTarget(target);
      window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 30);
    }
    setMenuOpen(false);
  }

  function handleContact(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get("name");
    const email = form.get("email");
    const message = form.get("message");
    const subject = encodeURIComponent(`AESA enquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${club.email}?subject=${subject}&body=${body}`;
    setContactStatus("Opening your email app with the message ready to send.");
  }

  return (
    <div className="site-shell">
      <Header activeTarget={activeTarget} menuOpen={menuOpen} setMenuOpen={setMenuOpen} navigate={navigate} />
      {menuOpen && <MobileNav navigate={navigate} />}

      <main>
        {page === "home" && <HomePage stats={stats} navigate={navigate} handleContact={handleContact} contactStatus={contactStatus} />}
        {page === "activities" && <ActivitiesPage navigate={navigate} />}
        {page === "team" && <TeamPage />}
        {page === "past" && <PastPage />}
        {page === "join" && <JoinPage />}
      </main>

      <Footer navigate={navigate} />
    </div>
  );
}

function Header({ activeTarget, menuOpen, setMenuOpen, navigate }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => navigate("home")} aria-label="Go to home">
        <span className="brand-mark">
          <img src="/AESALONG.png" alt="AESA logo" />
        </span>
        <span>
          <strong>{club.shortName}</strong>
          <small>RMIT Aerospace</small>
        </span>
      </button>

      <nav className="desktop-nav" aria-label="Main navigation">
        {navItems.map(([label, target]) => (
          <button className={target === activeTarget ? "active" : ""} key={target} type="button" onClick={() => navigate(target)}>
            {label}
          </button>
        ))}
      </nav>

      <button className="primary small" type="button" onClick={() => navigate("join")}>
        Join
      </button>

      <button
        className="menu-button"
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? <X /> : <Menu />}
      </button>
    </header>
  );
}

function MobileNav({ navigate }) {
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {navItems.map(([label, target]) => (
        <button key={target} type="button" onClick={() => navigate(target)}>
          {label}
        </button>
      ))}
    </nav>
  );
}

function HomePage({ stats, navigate, handleContact, contactStatus }) {
  return (
    <>
      <section className="hero editorial-hero" id="home">
        <motion.div className="hero-statement" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="eyebrow">
            <Radar size={18} />
            RMIT aerospace student association
          </p>
          <h1 className="home-title">AESA is taking aerospace students beyond the lecture hall.</h1>
          <p className="hero-copy">
            A student-run body providing social and professional development opportunities for aerospace and aviation
            students at RMIT.
          </p>
          <div className="focus-strip" aria-label="AESA focus areas">
            {focusAreas.map((area) => (
              <span key={area}>{area}</span>
            ))}
          </div>
          <div className="hero-actions">
            <button className="primary" type="button" onClick={() => navigate("join")}>
              Join AESA <ArrowRight size={18} />
            </button>
            <button className="secondary" type="button" onClick={() => navigate("#calendar")}>
              View calendar <CalendarDays size={18} />
            </button>
          </div>
          <div className="social-row">
            <SocialLink href={club.socials.facebook} icon={Share2} label="Facebook" />
            <SocialLink href={club.socials.instagram} icon={Images} label="Instagram" />
            <SocialLink href={club.socials.linkedin} icon={BriefcaseBusiness} label="LinkedIn" />
            <SocialLink href={club.socials.rubric} icon={MessageCircle} label="Rubric" />
          </div>
        </motion.div>

        <motion.div
          className="mission-card"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="mission-card-head">
            <span>Current mission</span>
            <strong>2025-2026</strong>
          </div>
          <div className="mini-orbit" aria-hidden="true">
            <Plane className="plane-wire" strokeWidth={1.2} />
          </div>
          <div className="stats-grid">
            {stats.map(([value, label]) => (
              <div key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="mission-note">
            <b>Next checkpoint</b>
            <span>Aerospace Industry Night - Storey Hall, RMIT City Campus</span>
          </div>
        </motion.div>
      </section>

      <section className="overview-section split-overview">
        <div>
          <a className="section-anchor" href="#overview">
            Overview
          </a>
          <div className="overview-copy" id="overview">
            <p>
              AESA endeavours to provide opportunities for students to improve communication and organisational skills
              while building contacts with industry.
            </p>
            <p>
              The association represents the AIAA RMIT University Student Branch and supports aerospace and aviation
              students through industry events, networking, student leadership, and professional development.
            </p>
          </div>
        </div>
        <aside className="overview-aside">
          <h3>What AESA does</h3>
          <ul>
            <li>Social and professional development for aerospace and aviation students</li>
            <li>Industry contacts through AIN, panels, and networking nights</li>
            <li>AIAA RMIT University Student Branch representation</li>
            <li>Memberships and events through Rubric</li>
          </ul>
        </aside>
      </section>

      <section className="link-board">
        <div className="link-board-title">
          <p className="eyebrow">Navigate</p>
          <h2>Association directory</h2>
        </div>
        <div className="directory-list">
          <button className="directory-row" type="button" onClick={() => navigate("activities")}>
            <CalendarDays />
            <span>
              <b>Activities</b>
              <small>Technical sessions, industry nights, tours, and student showcases</small>
            </span>
            <ArrowRight />
          </button>
          <button className="directory-row" type="button" onClick={() => navigate("team")}>
            <BriefcaseBusiness />
            <span>
              <b>Executive team</b>
              <small>Meet the 2025-2026 committee and leadership roles</small>
            </span>
            <ArrowRight />
          </button>
          <button className="directory-row" type="button" onClick={() => navigate("past")}>
            <Camera />
            <span>
              <b>Past events</b>
              <small>Previous workshops, lab tours, project evenings, and highlights</small>
            </span>
            <ArrowRight />
          </button>
          <button className="directory-row" type="button" onClick={() => navigate("join")}>
            <Send />
            <span>
              <b>Join us</b>
              <small>Open the official Rubric membership and ticketing page</small>
            </span>
            <ArrowRight />
          </button>
        </div>
      </section>

      <CalendarSection navigate={navigate} />
      <SponsorSection />
      <ContactSection handleContact={handleContact} contactStatus={contactStatus} />
    </>
  );
}

function SponsorSection() {
  return (
    <section className="sponsor-section">
      <SectionHeader
        eyebrow="Support network"
        title="Sponsors and collaborators"
        text="AESA public posts mention aerospace, aviation, defence, engineering, and student project organisations involved in industry night programming."
      />
      <div className="sponsor-list">
        {sponsors.map(([mark, name, href, logo]) => (
          <a href={href} target="_blank" rel="noreferrer" key={name}>
            <SponsorLogo mark={mark} name={name} logo={logo} />
            <span>{name}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function CalendarSection({ navigate }) {
  return (
    <section className="band" id="calendar">
      <SectionHeader
        eyebrow="Calendar"
        title="2025-2026 event timeline"
        text="Aerospace Industry Night 2026 was publicly listed for Thursday 7 May, 6:30 PM to 9:30 PM. TBA rows can be replaced with future Rubric events."
      />
      <div className="calendar-list">
        {calendar.map(([date, title, location, time, price]) => (
          <button className="calendar-row" key={title} type="button" onClick={() => navigate("join")}>
            <strong>{date}</strong>
            <span>
              <b>{title}</b>
              <small>
                <MapPin size={15} /> {location}
              </small>
            </span>
            <span>
              <Clock size={16} /> {time}
            </span>
            <em>{price}</em>
          </button>
        ))}
      </div>
    </section>
  );
}

function ContactSection({ handleContact, contactStatus }) {
  return (
    <section className="split-section contact" id="contact">
      <div>
        <SectionHeader
          eyebrow="Contact us"
          title="Questions, sponsorships, collaborations"
          text="Contact AESA for memberships, industry partnerships, event ideas, project support, and student enquiries."
        />
        <div className="contact-links">
          <a href={`mailto:${club.email}`}>
            <Mail /> {club.email}
          </a>
          <a href={club.socials.rubric} target="_blank" rel="noreferrer">
            <MessageCircle /> Rubric membership page
          </a>
          <p>
            <MapPin /> {club.location}
          </p>
        </div>
      </div>

      <form className="form-card" onSubmit={handleContact}>
        <label>
          Name
          <input name="name" required placeholder="Your name" />
        </label>
        <label>
          Email
          <input name="email" type="email" required placeholder="you@email.com" />
        </label>
        <label>
          Message
          <textarea name="message" required placeholder="Tell us what you need..." />
        </label>
        <button className="secondary light" type="submit">
          Email the club <Mail size={18} />
        </button>
        {contactStatus && <p className="form-status">{contactStatus}</p>}
      </form>
    </section>
  );
}

function ActivitiesPage({ navigate }) {
  return (
    <>
      <PageHero
        eyebrow="Activities"
        title="Technical programming for aerospace students"
        text="This page is dedicated to AESA events: practical workshops, industry contact, lab culture, project showcases, and student support."
        action="Join AESA"
        onAction={() => navigate("join")}
      />
      <section className="band">
        <div className="activity-grid">
          {activities.map(([title, tag, text]) => (
            <button className="activity-card" key={title} type="button" onClick={() => navigate("#calendar")}>
              <span>{tag}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <strong>
                Check calendar <ChevronRight size={16} />
              </strong>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Executive team"
        title="2025-2026 committee"
        text="Publicly listed AESA committee and member names gathered from accessible AESA LinkedIn page text."
      />
      <TeamBranch title="Executive Team" members={executiveTeam} />
      <TeamBranch title="General Committee Members" members={generalCommittee} />
    </>
  );
}

function TeamBranch({ title, members }) {
  return (
    <section className="team-branch">
      <h2>{title}</h2>
      <div className="team-grid">
        {members.map(([name, role, text, photo]) => (
          <article className="team-card" key={`${title}-${name}`}>
            <img className="team-photo" src={photo} alt={name} />
            <h3>{name}</h3>
            <p>{role}</p>
            <span>{text}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function PastPage() {
  return (
    <>
      <PageHero
        eyebrow="Past activities"
        title="Previous engineering nights and highlights"
        text="A separate gallery-style page for workshops, lab tours, showcases, and event recaps."
      />
      <section className="band">
        <div className="past-grid">
          {pastEvents.map((event) => (
            <a className="past-card" href={club.socials.instagram} target="_blank" rel="noreferrer" key={event.title}>
              <img src={event.image} alt={event.title} />
              <div>
                <span>
                  <Camera size={15} /> {event.year}
                </span>
                <h3>{event.title}</h3>
                <p>{event.text}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}

function JoinPage() {
  return (
    <section className="split-section page-split">
      <div>
        <SectionHeader
          eyebrow="Join us"
          title="Become an AESA member this semester"
          text="Join the RMIT aerospace student community for technical events, industry access, project support, and peer connection."
        />
        <div className="benefits">
          {benefits.map((benefit) => (
            <p key={benefit}>
              <CheckCircle2 size={19} /> {benefit}
            </p>
          ))}
        </div>
      </div>

      <div className="join-actions-panel">
        <a className="primary" href={club.socials.rubric} target="_blank" rel="noreferrer">
          Open AESA on Rubric <ArrowRight size={18} />
        </a>
        <a className="secondary" href={club.socials.linkedin} target="_blank" rel="noreferrer">
          Open AESA LinkedIn <ArrowRight size={18} />
        </a>
        <p>Memberships, tickets, and live event registration are handled through AESA's official Rubric page.</p>
      </div>
    </section>
  );
}

function Footer({ navigate }) {
  return (
    <footer>
      <div>
        <strong>{club.name}</strong>
        <span>RMIT aerospace engineering student association</span>
      </div>
      <div>
        {navItems.slice(0, 5).map(([label, target]) => (
          <button key={target} type="button" onClick={() => navigate(target)}>
            {label}
          </button>
        ))}
      </div>
    </footer>
  );
}
