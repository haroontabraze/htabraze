# Flexible Learning Management System

## Functional specification

**Version:** 0.1  
**Status:** Initial working specification  
**Date:** 25 October 2026

## 1. Purpose

Build a flexible, easy-to-use learning management system for courses, academic programmes and professional training. The system should support structured lessons, assessments, question banks, learner progress, teaching teams, administration, reporting, and a public profile and blog.

The system should offer broad configuration for administrators and instructors while keeping routine tasks straightforward. Common settings should have sensible defaults. Advanced settings should be available when needed.

## 2. Product principles

1. **Flexible structure:** A course may be standalone or part of one or more programmes. A reusable course design may have multiple scheduled or self-paced offerings.
2. **Completion is recorded:** A lesson is complete only when its required content and activities meet the configured completion rules.
3. **Progress follows the learner:** Saved progress should follow an authenticated learner across devices.
4. **Mobile-first usability:** Pages, lesson content, video, quizzes and authoring controls should adapt to phones, tablets and laptops.
5. **Reusable learning content:** Lessons, resources and questions may be reused where permitted, with edits and versions managed deliberately.
6. **Scoped access:** Staff access is limited to the programmes, courses or offerings they are assigned to, unless they also hold an administrative role.
7. **Extensible content and question types:** New activity and question types can be added without redesigning the whole LMS.
8. **Clear separation of public and private content:** Public profile and blog pages are separate from authenticated learning and student records.

## 3. User roles

Roles may be combined for one account. Permissions are assigned at an appropriate scope, such as institution, programme, course or course offering.

### 3.1 Platform administrator

- Manage users, roles, programmes, courses, offerings and site settings.
- Assign instructors and teaching assistants.
- Manage enrolments and access rules.
- View institution-wide reports and audit history.
- Configure default settings, enabled features and public pages.

### 3.2 Programme administrator or coordinator

- Manage assigned programmes and their offerings.
- View programme-level enrolments, progress and results.
- Assign or recommend course staff, subject to administrative policy.

### 3.3 Instructor

- Create and edit assigned course designs or offerings, according to granted permissions.
- Build lessons, add learning activities and resources, create assessments, and use question banks.
- Manage assigned students, review progress, grade work and provide feedback.
- Assign permitted tasks to teaching assistants.

### 3.4 Teaching assistant

- Access only assigned offerings and permitted student information.
- Support discussion, monitor progress, review submissions and grade or comment where authorised.
- Cannot change institutional settings, enrolment rules or grades outside the granted scope.

### 3.5 Student

- View enrolled offerings and learning activities.
- Complete lessons and assessments, download permitted resources, and view personal progress and results.
- Resume an unfinished lesson from its saved position and state.

### 3.6 Public visitor

- View published profile and blog pages without an LMS account.
- Cannot access courses, student information or private learning records.

## 4. Learning structure

The system should use these distinct concepts:

- **Programme:** Optional grouping of courses, such as a certificate or training programme.
- **Course design:** Reusable course description, structure, lessons, resources and assessment design.
- **Course offering:** A particular scheduled or self-paced run of a course. It holds dates, enrolment, staff assignments, student activity and results.
- **Learning unit:** An optional section, topic or module within a course.
- **Lesson:** An ordered learning experience made from content and activity blocks.
- **Activity or resource block:** A discrete item within a lesson, such as text, video, file, question, assignment or discussion.

A course may be standalone. A course design may be reused for multiple offerings. Programme membership should not prevent a course from also being offered independently.

## 5. Course and lesson authoring

### 5.1 Course authoring

Instructors should be able to:

- Set course title, description, image, learning outcomes, level, language and estimated duration.
- Arrange learning units and lessons by drag-and-drop or accessible move controls.
- Copy a course, unit, lesson or activity, subject to permissions.
- Save drafts, preview as a student, publish changes and archive a course or offering.
- Use course templates and reusable content.
- Set which features are available in each offering.

Published changes should not silently alter completed student attempts. The system should retain enough version history to identify the content and assessment settings that applied to a learner's recorded attempt.

### 5.2 Lesson blocks

A lesson is an ordered sequence of blocks. Initial block types should include:

- Formatted text, headings, links, images, tables and callouts.
- Embedded YouTube and Vimeo video, with the option to add other providers later.
- Uploaded or linked downloadable resources.
- Question or question set.
- Assignment or submission prompt.
- Discussion or reflection prompt.
- Interactive video checkpoint containing required text, a question or another supported interaction.

Each block may be marked required or optional. The instructor may configure lesson-level completion rules from required blocks and required activities.

### 5.3 Draft, preview and publication

- Instructors can preview lessons at phone, tablet and laptop widths.
- Draft content is not visible to students until published, unless an offering is explicitly in a preview state.
- Publishing an edit creates a new content version or otherwise preserves prior assessment records and completion evidence.
- The system should warn an instructor when an edit could affect learners who have already started the lesson.

## 6. Interactive video and saved progress

### 6.1 Video interactions

- Instructors can place one or more checkpoints at defined video timestamps.
- A checkpoint may show required context text, an image or table, a question, or a combination.
- The instructor can configure whether the video pauses at the checkpoint.
- A required checkpoint must be completed before the LMS records the lesson as complete.
- The instructor can select whether an answer must be correct to continue, whether retries are allowed, and whether feedback or hints appear.
- Optional interactions may be skipped without preventing lesson completion.
- The learner sees clear progress indicators for completed, pending and optional checkpoints.

### 6.2 Playback and resume

- Save the learner's last playback position periodically and when playback pauses, the page loses focus, or the learner leaves the lesson.
- Save completed checkpoint states, answers, quiz attempt state and the current lesson block.
- When the learner returns, resume at the saved position. If a required checkpoint was open and incomplete, reopen that checkpoint.
- Progress should synchronise to the learner's account so that a learner can continue on a different authenticated device.
- Handle interrupted connectivity by retaining pending progress locally and synchronising it when the connection returns.
- Do not mark a lesson complete merely because its page was opened or its video was started.

### 6.3 Playback enforcement modes

Offer two instructor-selectable modes:

1. **Checkpoint mode:** Pause for required interactions and record their completion. The learner may use available video seeking controls; completion still requires all required checkpoints.
2. **Sequential mode:** Restrict forward progress beyond the next required checkpoint where the selected player permits reliable control. If a provider does not permit dependable enforcement, warn the instructor and offer a more controlled video source for that lesson.

The LMS should distinguish interaction completion from proof of attention. It can record that a required reading block was reached or acknowledged, but cannot prove that the learner read or understood it without an associated activity.

## 7. Question banks and assessment

### 7.1 Question bank

- Questions may be organised by institution, programme, course, topic, unit, difficulty and tags.
- Questions may be reused across courses while access and ownership rules are respected.
- Store question versions so later edits do not rewrite historic attempts.
- Allow instructors to select individual questions or define a quiz blueprint that draws questions by category, tag, difficulty or point value.

### 7.2 Extensible question types

The design should allow additional question types to be added. Initial supported types should include:

- Single-answer multiple choice.
- Multiple-response selection.
- True or false.
- Short answer and essay.
- Fill in the blank.
- Matching and ordering.
- Numerical answer and tolerance-based answer.
- Select from a list or label an image.
- Drag-and-drop, where usable on both touch and pointer devices.
- File upload or assignment submission.

Question types should specify whether they are automatically marked, manually marked or support both. Every type should have a usable keyboard and touch interaction where applicable.

### 7.3 Quiz settings

Allow instructors to configure:

- Open and close dates, time limit and availability window.
- Number of attempts and the score rule, such as highest, latest or average.
- Randomised question order and random selection from a question bank.
- Whether learners may revisit questions before submission.
- Pass mark, scoring, partial credit and penalties where applicable.
- Feedback timing, answer visibility and review settings.
- Accommodations such as extra time or extended access for selected learners.
- Manual grading, moderation and regrading procedures.

All settings should use clear defaults and be visible in the quiz preview before publication.

## 8. Enrolment and course delivery

Support multiple enrolment methods, configurable per offering:

- Administrator enrolment.
- Self-enrolment.
- Enrolment code or invitation.
- Approval-based enrolment.
- Capacity limit and enrolment dates.
- Import from a spreadsheet.

An offering may be self-paced or scheduled with start and end dates, deadlines and a cohort calendar. Allow late enrolment and withdrawal according to administrator settings. Payment integration and prerequisites can be added as optional modules later.

## 9. Progress, grading and reports

### 9.1 Student progress

Track, at minimum:

- Enrolment status.
- Lesson and unit completion.
- Required block and checkpoint completion.
- Video resume position.
- Quiz attempts, scores and submission state.
- Manually graded work and feedback.
- Overall course completion status.

Students should see their own progress, upcoming work and feedback. Instructors and TAs should see only records for assigned offerings and the fields permitted by their role.

### 9.2 Reports

Provide reports with filters for programme, course design, offering, instructor, TA, student, date and status. Initial reports should include:

- Enrolment and withdrawal lists.
- Lesson, unit and course completion.
- Incomplete or overdue activity.
- Quiz attempt and score distribution.
- Student-level learning history.
- Teaching team activity and grading workload where permitted.

Allow CSV or spreadsheet export with role-based access checks. Reports should define how completion and scores are calculated.

## 10. Administration and communication

The administration area should support:

- User, role and permission management.
- Programme, course and offering management.
- Enrolment import and bulk actions.
- Default policies for completion, privacy and retention.
- Announcements and notifications.
- Calendar and deadlines.
- Audit history for important actions, including publication, role changes, enrolment changes, grading changes and exports.
- Data export and account deactivation procedures.

Email notifications, calendar integrations, certificates, discussion tools and payment features should be modular and configurable.

## 11. Public profile and blog

- Provide a public author profile with biography, credentials, photograph and selected links.
- Provide public blog posts with title, summary, body, image, categories, tags, author, publication date, draft and publication status.
- Support search-engine-friendly titles and descriptions, social sharing metadata and accessible images.
- Keep blog administration behind authenticated accounts and keep private LMS records out of public pages.

## 12. Responsive design and accessibility

The interface must adapt fluidly to mobile phones, tablets and laptops. It should not be a desktop layout merely scaled down.

- Use layouts that reflow without horizontal scrolling at common screen widths.
- Ensure video, text, tables, downloads, quizzes and progress indicators fit and remain usable on touch screens.
- Provide appropriately sized touch targets and avoid interactions that require hovering.
- Support keyboard navigation, visible focus, screen readers, semantic headings and accessible error messages.
- Support video captions and transcripts, alternative text, sufficient colour contrast and zoom.
- Preserve lesson position when screen orientation changes or the browser is interrupted.
- Test representative iOS, Android, iPad/tablet and desktop browsers before release.

## 13. Security, privacy and reliability

- Enforce role and course-scope permissions in the database as well as in the interface.
- Protect student records and assessment results from unauthorised access.
- Keep secrets out of source control and store credentials in deployment environment settings.
- Use secure sign-in, account recovery and session controls.
- Log significant administrative and grading changes.
- Define retention, export and deletion policies for student records and uploaded files.
- Maintain backups and document recovery procedures before production use.
- Use separate development and production environments; test database changes before applying them to production.

## 14. Suggested implementation stages

### Stage 1: Core learning platform

Accounts and scoped roles; programmes, reusable courses and offerings; enrolment; responsive course catalogue and dashboards; lesson builder; text, downloadable resources and embedded video; basic quizzes and question bank; required completion rules; saved progress and resume; basic reports; public profile and blog.

### Stage 2: Rich assessment and teaching tools

Expanded question types; timestamped interactive video; attempts, grading and feedback controls; assignment submissions; TA workflows; cohort calendar, announcements and more detailed reports; content version history.

### Stage 3: Optional integrations and advanced features

Certificates; payment; single sign-on; external content standards or interactive-content integrations; additional video providers; advanced analytics; multilingual interface; API and external system integrations.

Each stage should be usable and reviewed before the next is added. The data model should allow later stages without requiring a redesign of core learner records.

## 15. Screen map

The interface should present separate, role-based routes while allowing one person to hold more than one role.

### 15.1 Public website

- Home or landing page.
- Author profile.
- Blog index with categories and search.
- Blog post page.
- Sign-in and account recovery.

### 15.2 Student area

- **Student dashboard:** enrolled offerings, next activities, recent feedback and progress.
- **Course catalogue:** searchable public or restricted offerings and programmes, with enrolment action when allowed.
- **Programme page:** programme description, courses and completion progress.
- **Offering overview:** dates, instructor team, announcements, course outline and enrolment status.
- **Course outline:** units, lessons, completion markers, due dates and estimated effort.
- **Lesson player:** responsive lesson content, block navigation, video, checkpoint prompts, downloads, save/resume status and next/previous lesson controls.
- **Assessment player:** instructions, questions, timer where applicable, save status, question navigation and submission confirmation.
- **Results and feedback:** permitted scores, instructor feedback, attempt history and review of answers where enabled.
- **Profile and accessibility preferences:** account details, language and display preferences where supported.

### 15.3 Instructor and teaching assistant area

- **Teaching dashboard:** assigned offerings, upcoming deadlines, learner activity and work awaiting grading.
- **Offering workspace:** course outline, staff assignments, roster, announcements, dates and progress summaries.
- **Course and lesson editor:** create and reorder units, lessons and content blocks; preview at phone, tablet and laptop widths; save drafts and publish.
- **Interactive video editor:** attach provider link or media source, preview playback, add timestamped context/questions, set required status and completion behaviour.
- **Question bank:** search, filter, tag, edit, version and reuse questions.
- **Quiz builder:** compose from selected questions or a question-bank blueprint, configure settings, preview and publish.
- **Grading workspace:** filter submissions, grade, provide feedback and record grading changes.
- **Reports:** learner progress, completion, attempts and results for assigned offerings, with permitted exports.

Teaching assistants see only the pages and actions allowed by their assignments. A teaching assistant who has grading permission sees grading tools; one with view-only permission does not.

### 15.4 Administration area

- **Administration dashboard:** system activity, enrolment and operational alerts.
- **User and access management:** accounts, roles, scoped assignments and account status.
- **Programme and course management:** course designs, programme membership and templates.
- **Offering management:** dates, enrolment methods, staff, capacity and publication status.
- **Bulk enrolment and import:** upload, validate, preview and confirm roster changes.
- **Reports and audit history:** institution-level reports, exports and important change records.
- **Site and policy settings:** defaults, enabled modules, retention, accessibility and public profile/blog controls.

## 16. First-pass data model

The database should separate reusable course design from each delivery of that course. Names below are conceptual; implementation may refine them while preserving the relationships and behaviour.

### 16.1 Identity and access

- **profiles:** one application profile per authenticated account.
- **role_assignments:** user, role, scope type and scope identifier. Supports institution-wide administrators and course- or offering-scoped staff.
- **staff_assignments:** links instructors and teaching assistants to offerings, with explicit permissions for grading, learner support, editing and reporting.

### 16.2 Academic structure

- **programmes:** programme title, description, status and optional completion rules.
- **courses:** reusable course design and catalogue information.
- **programme_courses:** many-to-many relationship between programmes and reusable courses, with optional sequence/order and programme-specific rules.
- **course_offerings:** a delivery of a course design, including self-paced or scheduled mode, dates, time zone, enrolment policy, capacity and status.
- **units:** ordered sections of a course design.
- **lessons:** lesson identity and ordering within a unit.
- **lesson_versions:** immutable or versioned published lesson content and completion rules.
- **lesson_blocks:** ordered, typed content/activity blocks within a lesson version. Provider-specific and question-type-specific settings use validated structured data, with schema versions.

### 16.3 Enrolment and teaching staff

- **enrolments:** student, offering, status, source, enrolment date and completion state.
- **offering_staff:** instructor or teaching assistant assignment to an offering and its permission set.
- **enrolment_events:** optional history for enrolment, withdrawal, reactivation and completion changes.

### 16.4 Questions and assessment

- **question_banks:** owner/scope, title and access policy.
- **questions:** stable question identity, type, tags, bank membership and current version.
- **question_versions:** versioned prompt, options, answer key, marking rules, feedback and accessibility content.
- **quizzes:** stable assessment identity and offering or course association.
- **quiz_versions:** published instructions, settings, question-selection rules and scoring policy.
- **quiz_attempts:** learner, offering, quiz version, state, timing, score and finalisation status.
- **attempt_items:** question version presented in an attempt, order, points and any randomised values.
- **responses:** learner response, save state, marking result, feedback and marker information.
- **submissions:** files or written work for manually graded activities, with status and feedback.

Attempts should preserve the exact published question and quiz versions used. Editing a question or quiz should not rewrite previous results.

### 16.5 Progress and video resume

- **lesson_progress:** learner, offering, lesson version, current block, status, completion timestamps and last activity.
- **block_progress:** learner progress for each required or optional block, including started/completed state and stored interaction state.
- **video_progress:** learner, lesson block/version, provider, last confirmed playback position, duration if available, last synchronisation time and next required checkpoint.
- **checkpoint_attempts:** checkpoint, learner, response or acknowledgement, attempt count, correctness where applicable and completion state.

Progress records should be keyed to the learner and offering, not only to a browser or device. Save updates safely when the same learner uses multiple devices, and avoid overwriting a newer server position with stale local state.

### 16.6 Files and public content

- **resources:** title, description, file storage path or external URL, access policy, size, media type and version.
- **resource_links:** association of a resource with a course, offering, lesson block or blog post.
- **blog_posts:** public profile/blog content, draft/publication state, author, publication date, tags, image and search metadata.

### 16.7 Operations and reporting

- **notifications:** recipient, type, content, delivery/read state and related course activity.
- **audit_events:** actor, action, affected record, timestamp and relevant change summary.
- **reporting views or queries:** defined metrics for enrolment, completion, assessment and grading, based on the underlying records rather than manually maintained totals.

### 16.8 Data access rules

The application should enforce access at the database layer. Students may read and update only their own permitted learning records. Instructors and teaching assistants may access records only for assigned offerings and according to their permissions. Public pages should query published public content only. Administrative access should be explicitly assigned and logged.

## 17. Working defaults and decisions to confirm

These defaults keep work moving and can be revised:

- Support both self-paced and scheduled offerings.
- Allow a course to stand alone or belong to one or more programmes.
- Allow administrators to enrol students and enable self-enrolment or codes per offering.
- Require completion of all required lesson blocks and checkpoints; allow optional blocks to be skipped.
- Make correctness requirements, retries and feedback configurable by activity.
- Resume across authenticated devices from the last saved position and state.
- Keep the blog public and LMS learning records private.
- Use an extensible question-type system rather than promising an unlimited number of built-in types.
- Use externally hosted YouTube/Vimeo video as an option; use a more controlled video source when strict forward-seek restriction is essential.
- Defer payments, certificates, external standards integrations and advanced analytics until the core learning workflow is established.

Before creating a production database or inviting students, confirm the expected learner audience and country, data retention policy, whether payment/certificates are required, and the required degree of video seek restriction.

## 18. Technical reference points

- [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
- [Vimeo Player SDK](https://developer.vimeo.com/player/sdk/reference)
- [H5P Interactive Video](https://h5p.org/interactive-video)

