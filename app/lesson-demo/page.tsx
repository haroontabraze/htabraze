"use client";

import { useState } from "react";
import Link from "next/link";

const answers = [
  "It determines whether an item is included in the financial statements.",
  "It determines only the date when cash is received.",
  "It applies only to items measured at fair value."
];

export default function LessonDemoPage() {
  const [selected, setSelected] = useState("");
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [videoFinished, setVideoFinished] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);

  return <div className="lesson-demo-page">
    <div className="lesson-breadcrumb wrap"><Link href="/dashboard">My learning</Link><span>›</span><Link href="/courses">Foundations of Financial Reporting</Link><span>›</span><span>Lesson 3</span></div>
    <div className="lesson-layout wrap">
      <aside className="lesson-outline">
        <div className="outline-kicker">FOUNDATIONS OF FINANCIAL REPORTING</div><h2>Course outline</h2>
        <div className="outline-unit"><span>UNIT 2</span><b>Recognition and measurement</b></div>
        <div className="outline-link done"><i>✓</i><span><b>The purpose of reporting</b><small>Lesson · 12 min</small></span></div>
        <div className="outline-link done"><i>✓</i><span><b>Recognising the transaction</b><small>Video · 18 min</small></span></div>
        <div className="outline-link current"><i>3</i><span><b>Applying the criteria</b><small>Interactive · 20 min</small></span></div>
        <div className="outline-link"><i>4</i><span><b>Practice and review</b><small>Quiz · 10 questions</small></span></div>
        <div className="outline-progress"><div className="progress-caption"><span>Course progress</span><b>58%</b></div><div className="progress-line"><span style={{ width: "58%" }} /></div></div>
      </aside>
      <article className="lesson-content">
        <div className="lesson-content-heading"><div><div className="eyebrow">UNIT 2 · LESSON 3</div><h1>Applying the recognition criteria</h1><p>Learn how to decide when an item should be recognised in the financial statements.</p></div><button className="save-state"><i /> Progress saved</button></div>
        <div className="lesson-reading"><h2>Recognition begins with the transaction</h2><p>Before an item is recognised, the entity considers the rights and obligations created by the transaction. The accounting follows the substance and requirements of the relevant reporting framework.</p><div className="note-box"><span>KEY IDEA</span><p>Recognition determines whether an item is included in the financial statements. Measurement determines the amount at which it is recorded.</p></div><h2>Watch and consider</h2><p>Watch the short explanation. At the checkpoint, consider which condition supports recognition.</p></div>
        <div className="video-mock"><div className="video-topline"><span className="video-label">VIDEO LESSON · 06:42</span><button className="video-menu" aria-label="Video options">•••</button></div><div className="video-screen"><div className="video-play">{videoFinished ? "✓" : "▶"}</div><div className="video-caption">Understanding recognition<br/><small>{videoFinished ? "Video complete" : "Course video"}</small></div><div className="video-checkpoint"><span className="checkpoint-marker">✦</span><b>Knowledge check</b><small>Checkpoint at 02:18</small></div><div className="video-controls"><span>{videoFinished ? "✓" : "▶"}</span><div className="video-track"><i style={{ width: videoFinished ? "100%" : "32%" }} /><b style={{ left: videoFinished ? "100%" : "32%" }} /></div><span>{videoFinished ? "06:42 / 06:42" : "02:05 / 06:42"}</span><span>⛶</span></div></div></div>
        {!answered ? <section className="checkpoint-card"><div className="checkpoint-heading"><span className="checkpoint-icon">✦</span><div><span className="course-kicker">VIDEO CHECKPOINT · 02:18</span><h2>Check your understanding</h2><p>The video pauses here until you answer this question.</p></div></div><fieldset className="question-options"><legend>Which statement best describes recognition?</legend>{answers.map((option, i) => <label className={`option-row ${selected === String(i) ? "option-selected" : ""}`} key={option}><input type="radio" name="checkpoint" value={i} checked={selected === String(i)} onChange={(event) => { setSelected(event.target.value); setFeedback(""); }} /><span className="radio-visual" /><span>{option}</span></label>)}</fieldset>{feedback && <p className="form-feedback" role="alert">{feedback}</p>}<button className="button" disabled={!selected} onClick={() => selected === "0" ? setAnswered(true) : setFeedback("Not quite. Review the key idea above and try again.")}>Check answer <span>→</span></button><small className="checkpoint-help">You can retry if your answer is incorrect.</small></section> : <section className="checkpoint-card checkpoint-success"><div className="checkpoint-heading"><span className="success-icon">✓</span><div><span className="course-kicker">{videoFinished ? "VIDEO COMPLETE" : "CHECKPOINT COMPLETE"}</span><h2>{videoFinished ? "Required video activity complete." : "Good work. Continue the lesson."}</h2><p>{videoFinished ? "Your required checkpoint and video are complete." : "Your answer and place in the video have been saved."}</p></div></div>{!videoFinished && <button className="button" onClick={() => setVideoFinished(true)}>Finish video <span>▶</span></button>}</section>}
        <div className="lesson-footer-actions"><button className="button button-quiet">← Previous lesson</button><button className="button button-quiet" disabled={!answered || !videoFinished} onClick={() => setLessonComplete(true)}>{lessonComplete ? "Lesson complete" : "Complete lesson"} <span>✓</span></button></div>
      </article>
    </div>
  </div>;
}
