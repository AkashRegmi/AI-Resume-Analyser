import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  FileText,
  Menu,
  MessageSquareText,
  ScanSearch,
  Sparkles,
  X,
} from "lucide-react";
import "../landing.css";

const reportItems = [
  { label: "Matched skills", count: "08", tone: "matched" },
  { label: "Partial matches", count: "03", tone: "partial" },
  { label: "Skills to address", count: "02", tone: "missing" },
];

const reportSections = [
  {
    title: "Strengths",
    copy: "Relevant project experience and a clear record of collaboration.",
    icon: Check,
    tone: "strength",
  },
  {
    title: "Suggested improvements",
    copy: "Bring measurable outcomes closer to the top of your experience.",
    icon: Sparkles,
    tone: "improvement",
  },
  {
    title: "Interview questions",
    copy: "Practice role-specific questions based on your resume and the job.",
    icon: MessageSquareText,
    tone: "questions",
  },
];

function Brand() {
  return (
    <Link to="/" className="resume-brand" aria-label="Akrio Resume Match home">
      <span className="resume-brand-mark">
        <ScanSearch size={18} strokeWidth={2.2} />
      </span>
      <span>Akrio Resume Match</span>
    </Link>
  );
}

function AnalysisPreview() {
  return (
    <div
      className="analysis-preview"
      aria-label="Illustrative resume analysis report"
    >
      <div className="report-window-bar">
        <div className="report-window-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <span>YOUR ANALYSIS</span>
        <span className="report-preview-label">ILLUSTRATIVE</span>
      </div>
      <div className="report-body">
        <div className="report-heading">
          <div>
            <span className="report-eyebrow">ROLE MATCH</span>
            <h2>Product Designer</h2>
          </div>
          <span className="report-file-icon">
            <FileText size={17} />
          </span>
        </div>
        <div className="score-row">
          <div
            className="score-ring"
            aria-label="Example match score: 82 out of 100"
          >
            <span>
              <strong>82</strong>
              <small>/100</small>
            </span>
          </div>
          <div className="score-copy">
            <strong>Strong alignment</strong>
            <span>Example match score</span>
            <div className="score-track">
              <i />
            </div>
          </div>
        </div>
        <div className="skill-summary" aria-label="Example skills summary">
          {reportItems.map((item) => (
            <div className="skill-summary-item" key={item.label}>
              <span className={`skill-count ${item.tone}`}>{item.count}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div className="report-detail-list">
          {reportSections.map(({ title, copy, icon: Icon, tone }) => (
            <div className="report-detail" key={title}>
              <span className={`report-detail-icon ${tone}`}>
                <Icon size={15} />
              </span>
              <div>
                <strong>{title}</strong>
                <p>{copy}</p>
              </div>
              <ArrowRight className="report-detail-arrow" size={15} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="resume-site">
      <header className="resume-nav">
        <div className="resume-nav-inner">
          <Brand />
          <nav className="resume-nav-links" aria-label="Main navigation">
            <a href="#what-you-get">What you get</a>
            <a href="#how-it-works">How it works</a>
          </nav>
          <div className="resume-nav-actions">
            <Link className="resume-login" to="/login">
              Sign in
            </Link>
            <Link
              className="resume-button resume-button-primary nav-cta"
              to="/register"
            >
              Get started <ArrowRight size={16} />
            </Link>
          </div>
          <button
            type="button"
            className="resume-mobile-toggle"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {menuOpen && (
          <nav className="resume-mobile-menu" aria-label="Mobile navigation">
            <a href="#what-you-get" onClick={closeMenu}>
              What you get
            </a>
            <a href="#how-it-works" onClick={closeMenu}>
              How it works
            </a>
            <Link to="/login" onClick={closeMenu}>
              Sign in
            </Link>
            <Link className="mobile-primary" to="/register" onClick={closeMenu}>
              Get started
            </Link>
          </nav>
        )}
      </header>

      <main>
        <section className="resume-hero" aria-labelledby="hero-title">
          <div className="resume-hero-inner">
            <div className="resume-hero-copy">
              <div className="resume-kicker">
                <span /> A clearer next step in your job search
              </div>
              <h1 id="hero-title">Resume Analyzer</h1>
              <p className="resume-hero-lede">
                See how your resume lines up with the role you want. Get a match
                score, skill-by-skill feedback, and focused interview practice.
              </p>
              <div className="resume-hero-actions">
                <Link
                  className="resume-button resume-button-primary"
                  to="/register"
                >
                  Analyze your resume <ArrowRight size={17} />
                </Link>
                <a className="resume-text-link" href="#how-it-works">
                  See how it works
                </a>
              </div>
              <div className="resume-file-note">
                <FileText size={15} /> PDF or DOCX <span /> Up to 5 MB
              </div>
            </div>
            <div className="resume-hero-visual">
              <div className="visual-orbit visual-orbit-one" />
              <div className="visual-orbit visual-orbit-two" />
              <AnalysisPreview />
              <div className="visual-stamp">
                <Sparkles size={14} /> BUILT FOR YOUR NEXT MOVE
              </div>
            </div>
          </div>
          <div className="resume-hero-bottom">
            <span>One resume</span>
            <i />
            <span>One job description</span>
            <i />
            <span>A more focused application</span>
          </div>
        </section>

        <section id="what-you-get" className="resume-section outcomes-section">
          <div className="resume-container">
            <div className="outcomes-heading">
              <div>
                <div className="resume-section-kicker">
                  A useful review, not just a number
                </div>
                <h2>
                  Know what fits.
                  <br />
                  Know what to work on.
                </h2>
              </div>
              <p>
                Compare your resume with a specific job description and get
                feedback you can act on before you apply.
              </p>
            </div>
            <div className="outcomes-grid">
              <article className="outcome-item outcome-score">
                <span className="outcome-index">01 / MATCH</span>
                <div className="outcome-graphic score-mini">
                  <strong>82</strong>
                  <span>match score</span>
                </div>
                <h3>See your role match</h3>
                <p>
                  Get an overall score showing how closely your resume aligns
                  with the job description.
                </p>
              </article>
              <article className="outcome-item outcome-skills">
                <span className="outcome-index">02 / SKILLS</span>
                <div className="outcome-graphic skill-mini">
                  <span>Matched</span>
                  <i />
                  <span>Partial</span>
                  <i />
                  <span>Missing</span>
                </div>
                <h3>Spot the skill gaps</h3>
                <p>
                  Separate skills that match, partially match, or are missing
                  from your resume.
                </p>
              </article>
              <article className="outcome-item outcome-prep">
                <span className="outcome-index">03 / PREP</span>
                <div className="outcome-graphic prep-mini">
                  <MessageSquareText size={21} />
                  <span>Role-specific practice</span>
                  <ArrowRight size={15} />
                </div>
                <h3>Prepare with purpose</h3>
                <p>
                  Review strengths, improvement suggestions, and interview
                  questions tailored to the role.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="resume-section process-section">
          <div className="resume-container process-layout">
            <div className="process-intro">
              <div className="resume-section-kicker">Simple by design</div>
              <h2>Go from job post to a sharper application.</h2>
              <p>
                Your analysis uses the resume and job description you provide.
                It does not invent experience or skills.
              </p>
              <Link className="resume-button resume-button-dark" to="/register">
                Create your account <ArrowRight size={16} />
              </Link>
            </div>
            <div className="process-steps">
              <article className="process-step">
                <span className="process-number">01</span>
                <div>
                  <h3>Upload your resume</h3>
                  <p>Choose a PDF or DOCX file up to 5 MB.</p>
                </div>
                <FileText size={19} />
              </article>
              <article className="process-step">
                <span className="process-number">02</span>
                <div>
                  <h3>Add the job description</h3>
                  <p>Paste the role details you want to compare against.</p>
                </div>
                <ScanSearch size={19} />
              </article>
              <article className="process-step">
                <span className="process-number">03</span>
                <div>
                  <h3>Review your analysis</h3>
                  <p>
                    Explore your score, skills, feedback, and interview
                    questions.
                  </p>
                </div>
                <MessageSquareText size={19} />
              </article>
            </div>
          </div>
        </section>

        <section className="resume-cta">
          <div className="resume-container resume-cta-inner">
            <div>
              <span className="resume-section-kicker">
                Your next application starts here
              </span>
              <h2>Make your resume work harder for the role.</h2>
            </div>
            <Link className="resume-button resume-button-light" to="/register">
              Get started <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="resume-footer">
        <div className="resume-container resume-footer-inner">
          <Brand />
          <span>Resume insights for your next opportunity.</span>
          <Link to="/login">
            Sign in <ArrowRight size={14} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
