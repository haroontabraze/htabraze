import Link from "next/link";

const courses = [
  { title: "Foundations of Financial Reporting", category: "Professional learning", description: "Build a clear understanding of reporting concepts through short lessons and applied practice.", progress: 58, tone: "teal-art", symbol: "◎" },
  { title: "Professional Ethics in Practice", category: "Applied learning", description: "Work through realistic choices and strengthen professional judgement.", progress: 24, tone: "gold-art", symbol: "◈" },
  { title: "Working with Data and Evidence", category: "Skills development", description: "Develop practical skills for organising, interpreting and communicating evidence.", progress: 0, tone: "lilac-art", symbol: "✣" }
];

export default function CoursesPage() {
  return <div className="catalog-page wrap"><div className="catalog-heading"><div><div className="eyebrow">Your learning space</div><h1>Courses</h1><p>Pick up where you left off or explore a new subject.</p></div><div className="catalog-filter"><button className="filter-button">All courses <span>⌄</span></button><button className="search-button" aria-label="Search courses">⌕</button></div></div><div className="catalog-tabs"><button className="tab-active">My courses <span>3</span></button><button>Available to enrol</button><button>Completed</button></div><div className="catalog-list">{courses.map((course, i) => <article className="catalog-card" key={course.title}><div className={`catalog-art ${course.tone}`}><span className="course-symbol">{course.symbol}</span><span className="art-caption">{i === 0 ? "FOUNDATIONS" : i === 1 ? "PRACTICE & JUDGEMENT" : "LEARN BY DOING"}</span></div><div className="catalog-card-copy"><span className="course-kicker">{course.category}</span><h2>{course.title}</h2><p>{course.description}</p><div className="catalog-progress"><div className="progress-line"><span style={{ width: `${course.progress}%` }} /></div><span>{course.progress ? `${course.progress}% complete` : "Not started"}</span></div></div><Link className="button button-quiet" href={i === 0 ? "/lesson-demo" : "/dashboard"}>{course.progress ? "Continue" : "Open course"} <span>→</span></Link></article>)}</div></div>;
}
