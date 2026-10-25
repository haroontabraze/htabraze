import Link from "next/link";

const posts = [
  { date: "October 18, 2026", category: "Learning", title: "Why the best questions make learning stick", excerpt: "A well-placed question gives learners a moment to connect a concept with what they already know.", tone: "post-teal" },
  { date: "October 02, 2026", category: "Professional practice", title: "Building judgement through practical examples", excerpt: "Examples help move ideas from the page into the decisions professionals make every day.", tone: "post-gold" },
  { date: "September 12, 2026", category: "Teaching", title: "Designing a course one clear step at a time", excerpt: "A thoughtful learning sequence can make complex subjects easier to approach.", tone: "post-lilac" }
];

export default function BlogPage() {
  return <div className="public-content wrap"><div className="eyebrow">Notes on learning and professional practice</div><div className="blog-title-row"><div><h1>The learning journal</h1><p>Ideas, reflections and resources for thoughtful learning.</p></div><Link className="arrow-link" href="/about">About the author <span>→</span></Link></div><div className="blog-grid">{posts.map((post) => <article className="blog-card" key={post.title}><div className={`blog-art ${post.tone}`}><span>✳</span></div><div className="blog-meta">{post.category}<i />{post.date}</div><h2>{post.title}</h2><p>{post.excerpt}</p><Link href="/blog">Read article <span>→</span></Link></article>)}</div></div>;
}
