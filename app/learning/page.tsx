import Link from "next/link";

const features = [
  { icon: "01", title: "Learn in clear steps", text: "Move through lessons that combine reading, video, resources and questions." },
  { icon: "02", title: "Pick up where you left off", text: "Your lesson position and completed activities follow you across devices." },
  { icon: "03", title: "Teach with flexibility", text: "Instructors can shape each course around its learners and learning outcomes." }
];

export default function HomePage() {
  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> A flexible learning space</div>
          <h1>Learning that moves at <em>your pace.</em></h1>
          <p className="hero-intro">Courses, thoughtful lessons and practical assessments, brought together in one calm place to learn.</p>
          <div className="hero-actions">
            <Link className="button" href="/courses">Explore courses <span aria-hidden="true">↗</span></Link>
            <Link className="button button-quiet" href="/think-tax">Get <em>Think Tax</em></Link>
            <Link className="button button-quiet" href="/dashboard">Open my learning space</Link>
          </div>
          <div className="hero-note"><span className="note-avatar">✓</span><span>Learn on a laptop, tablet or phone</span></div>
        </div>
        <div className="hero-art" aria-label="Illustration of a lesson dashboard">
          <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <div className="lesson-card">
            <div className="lesson-card-top"><span className="live-pill"><i /> IN PROGRESS</span><span className="more-dot">•••</span></div>
            <div className="art-play"><span>▶</span></div>
            <div className="lesson-card-body"><div className="tiny-label">YOUR NEXT LESSON</div><h3>Understanding the essentials</h3><div className="art-progress"><span /></div><div className="progress-caption"><span>Lesson 3 of 6</span><b>52%</b></div></div>
          </div>
          <div className="floating-chip chip-top"><span>✦</span> Progress saved</div>
          <div className="floating-chip chip-bottom"><span className="chip-check">✓</span><div><b>Checkpoint complete</b><small>You are moving forward</small></div></div>
          <div className="art-spark spark-a">✳</div><div className="art-spark spark-b">✦</div>
        </div>
      </section>

      <section className="feature-band">
        <div className="wrap feature-grid">
          {features.map((feature) => <article className="feature" key={feature.title}><span className="feature-number">{feature.icon}</span><h2>{feature.title}</h2><p>{feature.text}</p></article>)}
        </div>
      </section>

      <section className="wrap section-block">
        <div className="section-heading"><div><div className="eyebrow">A good place to begin</div><h2>Explore a course</h2></div><Link className="arrow-link" href="/courses">View all courses <span>→</span></Link></div>
        <div className="course-teasers">
          <article className="teaser-card"><div className="teaser-art teal-art"><span className="course-symbol">◎</span><span className="art-caption">FOUNDATIONS</span></div><div className="teaser-content"><span className="course-kicker">Professional learning</span><h3>Foundations of Financial Reporting</h3><p>Build confidence with core concepts and practical examples.</p><Link href="/courses">View course <span>↗</span></Link></div></article>
          <article className="teaser-card"><div className="teaser-art gold-art"><span className="course-symbol">◈</span><span className="art-caption">PRACTICE &amp; JUDGEMENT</span></div><div className="teaser-content"><span className="course-kicker">Applied learning</span><h3>Professional Ethics in Practice</h3><p>Explore decisions, responsibilities and professional judgement.</p><Link href="/courses">View course <span>↗</span></Link></div></article>
          <article className="teaser-card"><div className="teaser-art lilac-art"><span className="course-symbol">✣</span><span className="art-caption">LEARN BY DOING</span></div><div className="teaser-content"><span className="course-kicker">Skills development</span><h3>Working with Data and Evidence</h3><p>Use structured practice to strengthen analytical skills.</p><Link href="/courses">View course <span>↗</span></Link></div></article>
        </div>
      </section>

      <section className="wrap quote-section"><div className="quote-mark">“</div><blockquote>Good learning is not a race. It is a series of clear steps, useful questions and ideas that stay with you.</blockquote><Link href="/about">About the educator <span>→</span></Link></section>
    </>
  );
}
