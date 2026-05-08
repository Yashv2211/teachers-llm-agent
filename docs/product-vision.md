# Product Vision — Nuru

## 1. Vision & Mission

### Vision Statement

A world where the quality of a child's education is determined by their curiosity, not their postcode.

### Mission Statement

Nuru gives any teacher in any country the power to deploy a free, personalized AI voice tutor their students can access instantly — no login, no app, no cost.

### Founder's Why

Yash grew up in India and went through its education system — overcrowded classrooms, teachers stretched thin, limited access to individualized help. Then he studied abroad in the UK, and the contrast was not subtle. It was not about the subjects being taught or the intelligence of the students. It was about attention, resources, and access. Students in London had tutors, study tools, and teachers who could actually spend time with them. Students in India had a shared textbook and a teacher managing sixty kids.

That gap is not a mystery. It is a resource problem. And increasingly, it is a solvable one — because the resource that makes individual attention possible is no longer just human time. It is compute. And compute is getting cheaper by the month.

Yash is not a career EdTech founder. He comes from political science, data science, and risk analysis — disciplines that train you to look at systems, find where they break, and design interventions that work in the real world, not just in controlled pilots. He knows what it takes for something to actually be adopted in low-resource environments. And he knows, from lived experience, exactly what a student loses when the system fails them.

Nuru is not a product Yash dreamed up from a whiteboard. It is the product he would have wanted to exist when he was fifteen years old in a classroom that could not give him enough time.

### Core Values

**Free means free.** Nuru will never charge teachers or students. Ever. Not a freemium model with a paid tier creeping upward. Not "free for now." Free as a founding constraint, not a marketing position. Every architectural and business decision gets filtered through this: does it require teachers or students to pay? If yes, it does not ship.

**Build for the lowest common denominator — and mean it.** Nuru's target user is a teacher in rural Ghana accessing the product on a 3G connection on a five-year-old Android phone. Not a teacher in a well-funded school with reliable WiFi. When we say "low-resource," we mean it has to work there, or it does not count. This rules out features that require fast connections, modern devices, or IT infrastructure.

**The teacher stays in the loop.** AI does not replace the teacher — it multiplies the teacher. Nuru is designed so teachers understand what their students are asking, can see patterns in those questions, and can adjust their agents accordingly. The AI is the assistant; the teacher is the expert. Every feature reinforces this.

**Ship working software, not demos.** With a two-person team (Yash and Claude Code) and £50 of runway, there is no room for features that almost work. Every shipped feature must be production-ready for a real teacher in a real classroom. Partial implementations that look good in a demo but break in the field are worse than not shipping at all.

**Multilingual is not an afterthought.** Nuru's users do not speak English as a first language. Swahili, Hindi, Arabic, Spanish, French, Portuguese — these are not future nice-to-haves. They are baseline requirements for the product to matter. Every design decision should work in a language the developer does not speak.

### Strategic Pillars

**Access over features.** When forced to choose between a richer experience for teachers who already have good infrastructure and a simpler experience that works for teachers who don't, always choose the latter. Reach matters more than depth at this stage.

**Teacher trust before student engagement.** The student does not choose Nuru — the teacher does. If teachers don't trust the product, students never see it. Every feature should make the teacher feel more confident, more in control, and more respected.

**Grants and governments fund the mission; the product earns the right to ask.** Nuru cannot go to a foundation or a ministry of education with a pitch deck. It needs real teachers, real students, real usage data, and real outcomes. The product is the fundraising strategy.

**Do not optimize for the demo — optimize for the 30th day.** The magic moment (a teacher creates an agent in 10 minutes) is important. But the product survives based on whether that teacher is still using it a month later. Every decision should favor long-term habit formation over first-impression polish.

### Success Looks Like

Twelve months from now: 1,000 teachers across 15 countries have created agents on Nuru. Students in Kenya, India, Brazil, and the Philippines are having conversations with AI tutors built by their own teachers — in Swahili, Hindi, Portuguese, and Tagalog. At least one government ministry of education has signed an MOU to pilot Nuru in a formal school program. The first grant from a major education foundation has landed. Student-direct access is live — curious students who found Nuru through a friend are creating their own learning paths without waiting for a teacher to set things up. Yash is not the only person working on Nuru anymore.

---

## 2. User Research

### Primary Persona

**Amara, 34 — Primary school teacher, Accra, Ghana.**

Amara teaches English, mathematics, and basic science to a class of 58 students aged 9–11. She has been teaching for nine years. She is excellent at her job — patient, creative, deeply committed to her students — and completely overwhelmed by the scale of what she is asked to do.

Her school day starts at 7am and ends at 3pm. After that, she spends two to three hours marking homework and preparing lessons, often at home with her phone as her only internet-connected device. She has a personal laptop but it is old and slow. She has reliable mobile data for about three hours a day before she hits her plan limit.

She has heard of ChatGPT but finds it overwhelming and is unsure if it is appropriate for her students. She uses WhatsApp for teacher community groups where she shares lesson plans and gets advice. She has never used a product that required creating an account for her students — the idea of managing 58 student logins is a non-starter.

What Amara wants is simple: she wants her students who are falling behind to get more help than she can physically give them. She knows which five students need extra attention on fractions. She just has no time to give it to them. If something could give those students ten minutes of patient, personalized explanation every evening, she would use it without hesitation — as long as it was free, worked on their parents' phones, and did not require her to do extensive setup.

Her switching threshold is low — she will try anything free that does not add to her administrative burden. Her abandonment threshold is also low — if it fails once in front of a student, she will not recommend it again.

### Secondary Personas

**The Curious Student (Rafi, 16, Jakarta, Indonesia).** Rafi is academically ambitious and regularly outpaces his class. He finds his school's curriculum too slow and uses YouTube to supplement his learning, but he wants something interactive — something that answers back. He would use Nuru without a teacher's involvement if he could access it directly. He represents Nuru's future student-direct user and the product's highest-engagement cohort.

**The NGO Education Coordinator (Priya, 41, New Delhi).** Priya manages a network of 200 teachers across rural Rajasthan for an education-focused NGO. She is always looking for tools she can recommend and roll out at scale without requiring IT support. She evaluates tools on three criteria: Does it work on low-end devices? Can teachers use it without training? Is it free? She is a force multiplier — if she adopts Nuru, 200 teachers follow.

**The Ministry of Education Official (Carlos, 52, Bogotá, Colombia).** Carlos oversees digital education initiatives for a regional government. He is cautious, bureaucratic, and deeply skeptical of EdTech vendors who promise transformation and deliver PowerPoints. He responds to evidence: usage data, teacher testimonials, learning outcome improvements. He will not sign anything without a working pilot. If he does sign, it is a government contract that funds Nuru's operations for years.

### Jobs To Be Done

**Functional jobs:** Give individual students explanations the teacher does not have time to give. Extend learning time beyond school hours without requiring a school device or connection. Allow teachers to embed their own curriculum materials into student-facing tools. Generate a shareable access point (QR code or link) that requires no student setup.

**Emotional jobs:** Feel like a capable, modern teacher even without access to expensive tools. Feel confident that the AI is teaching what the teacher would teach, not something off-brand or inappropriate. Feel proud to show other teachers something that works for their classroom specifically.

**Social jobs:** Be seen as an innovator in their teacher community. Have something concrete to share when colleagues ask "how do you manage with so many students?" Be the teacher who found the thing that helps the whole school.

### Pain Points

**Pain 1 — Inability to provide individual attention at scale (Severity: Critical).** Amara cannot give each of 58 students individual explanations. This is a daily, constant pain. Its consequence is that struggling students stay struggling and the teacher carries guilt about it. Currently: nothing. The pain is accepted as structural.

**Pain 2 — Students fall behind and there is no catch-up mechanism (Severity: High).** When a student misses a concept, there is no structured way for them to catch up outside class. Consequence: compounding gaps that become insurmountable. Currently: peer tutoring (inconsistent), after-school help (teacher has no time), or parental support (often unavailable).

**Pain 3 — No tools designed for their reality (Severity: High).** Every EdTech tool Amara has seen requires either institutional accounts, reliable WiFi, English fluency, or an app download. None of these are reliable for her students. Consequence: she stops exploring options. Currently: printed materials, WhatsApp groups.

**Pain 4 — No visibility into what students are struggling with (Severity: Medium).** Amara finds out a student is lost when they fail a test, not before. She has no ongoing signal. Currently: test scores and classroom observation, both lagging indicators.

**Pain 5 — Language barrier in educational materials (Severity: Medium).** Most quality educational content is in English. Many of Amara's students are not English-first. Currently: translation by Amara, which takes time she does not have.

### Current Alternatives & Competitive Landscape

**Khan Academy.** Does well: excellent curriculum coverage, free, high production quality. Falls short: requires reliable internet and an English-friendly interface, student accounts needed, designed for a student who is self-motivated and already digitally literate. Switching cost: low, but usage rate among Nuru's target teachers is already very low.

**WhatsApp study groups.** Does well: already installed, familiar, works on low-end phones, teachers trust it. Falls short: unstructured, no AI, scales poorly, no curriculum grounding. This is Nuru's real incumbent — not EdTech, but the informal network teachers already use.

**Printed materials.** Does well: works offline, no tech required. Falls short: static, one-way, no interactivity, no personalization. Switching cost: near zero — any digital tool that works on mobile competes with this directly.

**ChatGPT / generic AI.** Does well: highly capable, answers almost any question. Falls short: no teacher-set curriculum context, inappropriate content risks, English-first, intimidating interface, no student-safety guardrails, requires an account. Nuru's advantage over ChatGPT is precisely that it is teacher-configured and context-grounded.

**Do nothing.** The most common alternative. Teachers are overwhelmed and have stopped looking for solutions. Nuru's job is not to win a feature comparison — it is to be so simple to set up that it breaks through the "I'll try it later" barrier.

### Key Assumptions to Validate

1. **We assume teachers will spend 10 minutes setting up an agent without hand-holding.** To validate: run 5 unmoderated usability tests with teachers in target regions. Watch what breaks in the setup flow.

2. **We assume students will use a voice AI tutor without a human in the room.** To validate: deploy agents in 3 classrooms, observe usage patterns over 2 weeks. Are students actually talking to it?

3. **We assume QR code access is sufficient for students with shared family phones.** To validate: interview 10 students about their phone access patterns. How often do they have uninterrupted access to a phone?

4. **We assume Groq's voice quality is acceptable in noisy environments (shared homes, outdoor spaces).** To validate: test with students in actual home environments, not quiet labs.

5. **We assume teachers will trust AI-generated content if they provide the source material.** To validate: ask teachers directly. Would you be comfortable with students getting answers from an AI trained on your PDFs?

6. **We assume multilingual TTS via Web Speech API is good enough for initial launch.** To validate: test Web Speech in Swahili, Hindi, and Spanish with native speakers. Rate intelligibility.

7. **We assume teachers in low-resource countries have email addresses for magic-code auth.** This may not be true. Validate: survey 20 target teachers. Do all of them have email? If not, what's the fallback?

### User Journey Map

**Awareness.** Amara hears about Nuru from a WhatsApp teacher group she is in. Someone has posted a QR code and said "I built an AI tutor for my students in 10 minutes and it's free." Emotion: skeptical but curious.

**Consideration.** She clicks the link, lands on Nuru's homepage. It loads quickly on mobile. She reads the one-liner. She sees that students need no account. She notices it is free. She decides to try creating an account. Emotion: cautious optimism.

**First use — Teacher onboarding.** She enters her email, gets a magic code, logs in. She sees the agent creation form. She fills in the subject (mathematics, Grade 5), selects her language (English with some local language support), uploads a PDF of her term's curriculum. It processes. She selects a few items from the curriculum library as backup. She hits create. Emotion: slightly anxious — will this actually work?

**Magic moment.** She sees a QR code and a link. She tests it herself on her phone. A voice says "Hello! I'm your Maths tutor. What are you working on today?" She asks it to explain fractions. It explains them clearly, patiently, in the way she would explain them. She screenshots the QR code. Emotion: genuine surprise and delight.

**First student use.** She prints the QR code and tapes it to the classroom wall. Three students scan it before school the next morning. She gets a notification showing what they asked. One of them asked about the exact concept she planned to address in next week's lesson. She adjusts her lesson plan. Emotion: excited, validated.

**Habit formation.** Over the next four weeks, she creates two more agents (science and English), shares them with the parents' WhatsApp group, and checks the question logs every Monday. The agents have become part of her weekly teaching rhythm. Emotion: proud, in control.

**Advocacy.** She posts in her teacher WhatsApp group with her own testimonial. Three colleagues sign up that week. Emotion: ownership, pride in having discovered something genuinely useful.

---

## 3. Product Strategy

### Product Principles

**Zero friction for the student.** The student's path from "I need help" to "I'm talking to a tutor" must require no account, no app download, no English fluency, and no internet connection faster than 3G. Any feature that adds friction to this path is suspect.

**The teacher's curriculum, not the internet's.** Nuru's AI tutors should sound like they were trained by the teacher, not by Wikipedia. Teacher-uploaded context must dominate the AI's answers. If the teacher uploads a term plan and the AI ignores it, the product has failed.

**Multilingual by default, not by exception.** Language selection is not a settings menu item hidden three taps deep. It is a primary configuration choice at agent creation. TTS and (where possible) STT should follow the teacher's language choice automatically.

**Trust is earned in the first session.** Teachers are busy and skeptical. If the product does not obviously work correctly in the first ten minutes, it will not be used again. Every first-run experience should be designed for the teacher who has never used AI before and will not give us a second chance.

**Visibility creates retention.** Teachers stay engaged with Nuru because they can see what their students are learning and struggling with. The question log and usage patterns are not analytics features — they are the core value loop that keeps teachers coming back.

**Radical simplicity over rich functionality.** The MVP must be buildable and shippable on a £50 budget with a two-person team. When in doubt, cut the feature. A product with five things that work perfectly beats a product with fifteen things that half-work.

### Market Differentiation

The EdTech market is full of products that were designed for schools with budget, IT departments, and reliable infrastructure, then tried to adapt for low-resource environments. Nuru is designed for Amara's classroom first, and adapts upward, not downward.

Three things make Nuru structurally different. First: zero student friction. No other voice AI platform for education allows a student to access a personalized tutor by scanning a QR code with no account or app required. This is not a minor UX improvement — it is the difference between adoption and abandonment in environments where students share phones and have no consistent internet access.

Second: teacher-grounded context. ChatGPT and generic AI tutors are trained on the internet. Nuru's agents are trained on what the teacher actually uploaded — their term plan, their textbook excerpts, their YouTube links. The AI cannot hallucinate curriculum that the teacher did not provide, because the system prompt grounds it in teacher-supplied material. Teachers trust their own materials. They do not trust the internet.

Third: designed for the actual cost of compute in a grant-funded, low-revenue model. Nuru uses Groq for both LLM and speech-to-text — not OpenAI, not a $0.10/minute voice service. Groq's free tier is aggressive. The entire product can run at meaningful scale without spending money until grant revenue arrives.

This combination — zero friction, teacher-grounded, compute-efficient — is not something any current competitor has chosen to optimize for. They have not because the market they are targeting (well-funded schools, institutional buyers) does not require it. Nuru's market does.

### Magic Moment Design

The magic moment: a teacher creates an agent in under 10 minutes, a student scans a QR code, and immediately gets a patient, curriculum-grounded answer to a question — in their language, with their teacher's knowledge behind it.

For this moment to happen reliably, four things must be true in the product:

1. **Agent creation must not require more than 4 form fields.** Subject, grade level, language, context source. Everything else has a sensible default.

2. **Context processing must be fast enough that the teacher sees a QR code within 60 seconds of hitting "Create."** If they have to wait five minutes, they will assume it failed.

3. **The first thing the AI says must sound like the teacher.** The greeting and initial prompt must reference the subject and grade level. "Hello! I'm your Maths tutor for Grade 5" — not "Hello! I'm an AI assistant. How can I help you?"

4. **The student's first question must get a useful answer.** The agent must not deflect, hallucinate wildly, or respond in a language the student did not choose. This requires solid system prompt design and reliable context retrieval.

The magic moment is achievable in the current MVP. The agent creation flow exists. The QR code exists. The voice interface exists. The work is in tightening each of these four requirements so they are reliable for a first-time user who is not the developer.

### MVP Definition

**Agent creation flow (teacher).** A teacher can create a named AI agent for a specific subject, grade level, and language. They can upload a PDF or Word document, paste a YouTube URL or web URL, or select items from the curriculum library. The system processes the context and generates an agent with a QR code and shareable link. Done means: a teacher who has never used Nuru creates a working agent in under 10 minutes without help.

**Voice student interface (student).** A student scans the QR code or clicks the link and immediately sees a voice interface. They tap to speak, the AI transcribes using Groq Whisper, generates a response grounded in the teacher's context, and speaks it back using Web Speech API (or playai-tts for English). No login, no account, no app. Done means: a student on a 3G connection on an Android phone can have a 5-turn conversation with the tutor without it breaking.

**Teacher dashboard.** A teacher can see all their agents, see which ones have been accessed, and see the last N questions students asked each agent. Done means: a teacher can log in and within 30 seconds understand what their students have been asking.

**Magic code auth (teacher only).** Teachers sign in with their email and a magic code. No password. Done means: a teacher can sign up and log in in under 60 seconds with no password friction.

**Multilingual TTS.** The student interface speaks in the language the teacher configured. Web Speech API handles the language routing. Done means: an agent configured for Swahili speaks in Swahili, not English.

### Explicitly Out of Scope

**Student accounts.** Tempting because it enables personalization and progress tracking. Deferred because it is a fundamental barrier to the zero-friction access model. Students should not need to create anything to use Nuru. Reconsider at 6 months when usage data shows what personalization would actually provide.

**Real-time teacher monitoring.** It would be powerful for teachers to watch live conversations. Deferred because it requires a persistent websocket architecture that increases infrastructure cost and complexity. The question log is sufficient for v1. Reconsider when usage patterns show teachers actually wanting live monitoring.

**Native mobile app.** A React Native app would provide better voice recording quality and offline capability. Deferred because it requires app store submissions, device-specific permissions, and an app download — all friction points that conflict with the zero-setup model. Web is the right platform for v1.

**LMS integrations (Google Classroom, etc.).** Teachers in target markets often do not use these. Even if they do, integration adds engineering complexity that does not serve Amara in Accra. Reconsider when serving institutional buyers with B2G contracts.

**Gamification and progress tracking.** Important for long-term student engagement. Deferred because it requires student accounts and data persistence. Reconsider after student-direct access is launched.

### Feature Priority (MoSCoW)

**Must Have:** Agent creation (subject, grade, language, context upload), QR code and link generation, student voice interface (Whisper STT + Web Speech TTS), teacher dashboard with question log, magic code auth, curriculum library, multilingual TTS via Web Speech.

**Should Have:** PDF and Word document upload, YouTube transcript extraction, URL content extraction, Groq Whisper integration for STT, share link with custom QR code styling, basic usage metrics per agent.

**Could Have:** Student-direct access (onboard without teacher), teacher question log notifications, agent cloning, language detection on student side, agent greeting customization.

**Won't Have (this time):** Student accounts, native mobile app, LMS integrations, live monitoring, gamification, payments, admin dashboard, multi-teacher organizations.

### Core User Flows

**Flow 1 — Teacher creates first agent.**
Trigger: Teacher lands on dashboard for the first time.
Steps: Click "Create Agent" → Enter name and subject → Select grade level → Select language → Upload PDF or select from library → Click "Create" → See QR code and link.
Outcome: A working agent accessible to students.
Success criteria: Completed in under 10 minutes, zero errors, QR code functional on first scan.

**Flow 2 — Student accesses tutor via QR code.**
Trigger: Student scans QR code or receives link from teacher.
Steps: Browser opens student interface → Sees subject name and greeting → Taps microphone → Speaks question → Sees transcript and hears response → Asks follow-up.
Outcome: Student gets curriculum-grounded answer in their language.
Success criteria: First response in under 5 seconds, answer references teacher-uploaded material, TTS in correct language.

**Flow 3 — Teacher reviews student questions.**
Trigger: Teacher opens dashboard the morning after students used an agent.
Steps: Click on agent → See question log → Identify recurring confusion → Note topic to address in next lesson.
Outcome: Teacher has actionable insight for lesson planning.
Success criteria: Question log loads in under 2 seconds, questions are readable and searchable, teacher can identify patterns without analysis tools.

### Success Metrics

**Primary metric:** Active agents (agents that have had at least one student conversation in the last 7 days). This is the one number that matters — it shows real classroom usage, not just sign-ups.

**Secondary metrics:** Teachers who create a second agent (measures onboarding to habit), student conversations per agent per week (measures student engagement), agent creation completion rate (measures onboarding friction), TTS success rate by language (measures multilingual reliability).

**Leading indicators:** Teacher sign-up rate, agent creation rate, time to first student conversation.

Good: 25 active agents at 30 days. Great: 50 active agents with average 10 student conversations per week each at 30 days.

### Risks

**Risk 1 — Low teacher internet access blocks setup (Likelihood: Medium, Impact: High).** Context upload and processing requires internet. If the teacher's connection drops during setup, the experience breaks. Mitigation: make context upload optional with a strong curriculum library default, and add robust retry and state persistence.

**Risk 2 — Groq free tier limits at scale (Likelihood: Medium, Impact: High).** Groq's free tier is generous but not infinite. At 500 teachers with active students, LLM and Whisper costs could exceed the free tier. Mitigation: design with Groq cost visibility from day one; apply for Groq's nonprofit/education program; include projected Groq costs in grant applications.

**Risk 3 — Browser SpeechRecognition unreliable on low-end Android (Likelihood: High, Impact: High).** The browser's Web Speech API varies significantly by Android version and Chrome version. Students on old phones may get poor STT. Mitigation: Groq Whisper for STT (already planned), graceful text input fallback when voice fails.

**Risk 4 — Teachers do not trust AI-generated answers (Likelihood: Medium, Impact: High).** If a teacher hears an agent give an answer they believe is wrong, they will stop using the product and tell other teachers. Mitigation: make the grounding in teacher materials explicit in the UI ("This answer is based on your uploaded materials"), add a report-wrong-answer button, and invest in system prompt robustness.

**Risk 5 — No email address for magic code auth (Likelihood: Medium, Impact: Medium).** Some teachers in target markets may not have email. Mitigation: validate this assumption early; consider WhatsApp OTP as a fallback auth method.

**Risk 6 — Language quality is unacceptable (Likelihood: Medium, Impact: High).** Web Speech TTS in Swahili or Hindi may be robotic or hard to understand. If students cannot understand the tutor, the product fails its core promise. Mitigation: test TTS in target languages before launch; identify fallback TTS providers for critical languages.

**Risk 7 — Regulatory barriers to student data in government pilots (Likelihood: Medium, Impact: Medium).** Government buyers will ask about data storage, student privacy, and GDPR equivalents in their jurisdictions. Mitigation: design with minimal data retention from the start; do not store student conversation content beyond the question log; document the data model for government review.

---

## 4. Brand Strategy

### Positioning Statement

For teachers in low-resource countries who cannot give every student the individual attention they deserve, Nuru is the AI tutor platform that lets any teacher deploy a free, personalized voice tutor their students can access anywhere. Unlike EdTech platforms designed for well-funded schools, Nuru works with a QR code, a phone, and no student accounts — because that is what the world's most important teachers actually have.

### Brand Personality

Nuru is the brilliant friend who grew up in a struggling school system and made it out — and has been furious about the inequality ever since, in the most productive possible way. She is warm and direct. She does not talk about "leveraging AI to optimize pedagogical outcomes." She says "your students asked 23 questions this week — here's what confused them."

She is genuinely excited about what teachers can do. She has seen what happens when a curious student finally gets a patient, unlimited answer to a question, and she wants every student to have that. She is angry about the gap, but she expresses that anger through building and shipping, not through lectures.

She does not perform humility and she does not perform authority. She knows what she is doing and she tells you directly. When something breaks, she says what broke and how to fix it — no corporate deflection. When something works beautifully, she celebrates it.

She would show up to a teacher conference in clean, bright clothes — not a suit, not a hoodie. She would listen first. She would share something concrete before the conversation was over. She would follow up.

### Voice & Tone Guide

**Voice (constant):** Direct, warm, activist, specific. Never corporate, never academic, never condescending.

| Context | DO | DON'T |
|---|---|---|
| Onboarding | "Create your first AI tutor in under 10 minutes. Your students are waiting." | "Welcome to Nuru! We're excited to have you on board. Let's get started on your journey to AI-powered education." |
| Error states | "Your PDF didn't upload — check the file size (max 10MB) and try again." | "An error occurred. Please try again or contact support." |
| Empty states | "No agents yet. Create your first one — it takes about 10 minutes." | "You haven't created any agents yet. Get started by clicking the button below!" |
| Success messages | "Agent created. Share this QR code with your students — they can start right now." | "Congratulations! Your AI tutor agent has been successfully created and is ready to use." |
| Marketing copy | "Every student deserves a tutor who has infinite patience and knows your curriculum. Nuru gives you that — free." | "Nuru leverages cutting-edge AI technology to provide personalized learning experiences for students in underserved communities." |

### Messaging Framework

**Tagline:** Education without borders.

**Homepage headline:** Give every student a tutor. Free, forever.

**Value propositions:**
1. Built for the real world — works on any phone, any connection, with a QR code and no student account.
2. Your curriculum, your voice — every agent is grounded in what you actually teach, not what the internet thinks is relevant.
3. The individual attention you cannot give to 60 students — Nuru can.

**Feature descriptions:**
- Context upload: "Upload your PDFs, word documents, or YouTube links — the AI tutor learns from what you actually teach."
- QR code sharing: "Share a QR code or a link. Students scan it, and they're talking to a tutor. No account. No app. No waiting."
- Question log: "See exactly what your students asked this week. Plan your next lesson around what they actually struggled with."
- Multilingual: "Your students speak Swahili. So does Nuru."

**Objection handlers:**
- "I'm not technical enough." → "If you can fill out a form and upload a PDF, you can deploy an AI tutor. That's all it takes."
- "Is the AI going to say something wrong?" → "The AI only answers based on the materials you upload. It won't make things up if it doesn't have the information — it will say so."
- "My students don't have smartphones." → "Any phone with a browser works. The voice interface is designed for slow connections and basic devices."

### Elevator Pitches

**5 seconds:** Give every student a tutor. Free, forever.

**30 seconds:** Teachers in low-resource schools cannot give individual attention to 60 students. Nuru lets any teacher deploy an AI voice tutor in 10 minutes — trained on their own curriculum — that students access by scanning a QR code. No student accounts. No app. No cost. Free for teachers and students everywhere.

**2 minutes:** There is a teacher in Accra right now with 58 students who all need individual help with fractions. She knows who they are. She knows what they need. She simply does not have the time to give it to them. And that is true for millions of teachers across Africa, Asia, and South America. Meanwhile, students in London and New York already have access to AI tutors. That gap is not closing on its own. Nuru is the answer. A teacher creates an AI tutor in 10 minutes, uploads their curriculum, and gets a QR code. Students scan it on any phone, any browser, no account required, and start talking to a tutor that knows exactly what their teacher is teaching. It speaks in their language. It is patient. It is available at 9pm when the teacher is asleep. And it costs nothing. We are building this with grants and government partnerships — not by charging the teachers and students who need it most. We already have the core product working. We need to put it in front of the teachers who need it.

### Competitive Differentiation Narrative

The EdTech market has spent twenty years building products for schools that can afford them. Khan Academy is excellent — for students who speak English and have reliable internet. Google Classroom is powerful — for schools with G Suite licenses and IT support. Even the most ambitious AI tutoring platforms, like Khanmigo, assume a logged-in student with a stable connection.

Nuru assumes none of that. It was designed from the first line of code for the teacher with 60 students, intermittent mobile data, and a WhatsApp group instead of an IT department. The QR code model exists not because it is a clever product trick, but because it is the only access mechanism that requires nothing of the student except a phone with a browser. The multilingual voice interface exists not as a localization afterthought, but because the teacher in Nairobi's students speak Swahili, and a product that speaks English at them is not a solution.

The question is not whether AI tutoring works — it demonstrably does. The question is who gets access to it. Every AI EdTech product launched in the last two years has answered that question the same way: students in wealthy countries, in well-funded schools, with fast internet. Nuru answers it differently.

---

## 5. Visual Design

Visual design tokens — colors, typography, spacing, components, and motion — live in `docs/design.md`. If that file does not yet exist, run `/plaid design` with image references to generate it before building.
