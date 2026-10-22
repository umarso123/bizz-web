# Homepage content review

Proposed copy changes for the homepage. **Nothing here has been applied.** Mark each item ✅ approve, ✏️ edit, or ❌ reject, and I'll apply only the approved ones.

Rules followed: every suggestion uses facts already on the site or in `content/legacy-site.md`. No new numbers, clients, results or dates. Items marked **(confirm)** depend on a fact only you can check.

Section numbers match the labels on the page (01 Hero … 11 Let's connect).

---

## 1. Duplicates

### 1.1 Industries appear three times

| Where | Current |
|---|---|
| 01 Hero readout | "Industries served — 5" |
| 02 Marquee | Healthcare · Educational · Fintech · Fitness · eCommerce |
| 05 Industries | IND-01 to IND-05 list with product images |

**Suggestion:** keep **05** (it's the only one that shows work for each industry). Remove the hero stat (see 4.1), and turn the marquee into a technologies strip: KOTLIN · C# · FLUTTER · PYTHON · HTML · RUBY. That way the strip adds a fact instead of repeating one.

### 1.2 Healthcare appears four times

| Where | Current |
|---|---|
| 01 Hero headline | "Digital products that move healthcare forward." |
| 01 Hero card | "Industry 01 — Healthcare · Clinical tools, telemedicine & interoperability" |
| 03 Healthcare | Full section with five solutions |
| 04 "What we do" panel | Large word "Healthcare." |
| 05 Industries | IND-01 Healthcare, "Lead industry" |

**Suggestion:** keep the headline and **03**. Make the hero card a short pointer to 03 ("5 healthcare solutions ↓", scrolling to the section) instead of a second summary. Remove the "What we do" panel (see 1.4). Keep 05's row as is; it's one line.

### 1.3 "With our team of skilled experts…" is used twice

> "With our team of skilled experts, we're not just about lines of code; we're about building relationships."

Used in **08 How we work** (second paragraph) and **09 Team** (intro).

**Suggestion:** keep it in **09 Team**, where it's about people. Remove it from 08.

### 1.4 "What we do" and "What we make" vs Services

| Where | Current | Overlaps with |
|---|---|---|
| 04 "What we do" panel | Healthcare. / Design / Development / Branding | 03 Healthcare and 07 Services |
| 04 "What we make" card | Website, Logo, UI/UX, Product, Dashboard (project types) | Partly 07 Services |

**Suggestion:** remove the "What we do" panel; it repeats 03 and 07 in four words. Keep "What we make": the project types are legacy content that appears nowhere else. (It's already restyled as a compact paper spec list.)

---

## 2. Generic lines to rewrite

| # | Where | Current | Suggested |
|---|---|---|---|
| 2.1 | 07 Services intro | Propel your business to new heights and unlock its true potential today. | Native Android and iOS, cross-platform Flutter, web front and back ends, and cloud, built by one team. |
| 2.2 | 03 Healthcare intro (2nd sentence) | Experience the power of innovation, and let us attune our interactive services to elevate your healthcare business's digital presence. | We build clinical decision support, telemedicine, health information exchange and EHR software, and connect it to the systems care teams already use. |
| 2.3 | 03 HC-01 (CDS) | Leverage data-driven insights to streamline decision-making… | See 5. Healthcare accordion |
| 2.4 | 07 SVC-04 Web Development | Crafting exceptional websites that captivate and drive results. | Marketing sites and web apps, designed and built by the same team. |
| 2.5 | 07 SVC-01 Android | Proficient Android app development service, crafting outstanding mobile solutions tailored to your business needs. | Native Android apps in Kotlin, built around your product. **(confirm Kotlin)** |
| 2.6 | 07 SVC-02 iOS | Leading iOS app development service, turning your vision into captivating and functional mobile experiences. | Native iOS apps, from first design to App Store release. |
| 2.7 | 07 SVC-03 Flutter | Experience the future of mobile with expert Flutter app development, empowering your ideas with cutting-edge solutions. | One Flutter codebase for iOS and Android. |
| 2.8 | 07 SVC-05 Frontend & Backend | Expert front and back-end development services for a powerful and seamless web presence. | Front ends, and the APIs and services behind them. |
| 2.9 | 07 SVC-06 Cloud | Experience the power of scalable cloud solutions with our expert development service. | Cloud infrastructure and services that grow with your product. |
| 2.10 | 04 Selected work intro | Explored our projects yet? Have a look. | Products we've shipped in healthcare, education and fitness. |

---

## 3. Contradiction: presence

| Where | Current |
|---|---|
| 10 Heading | "Now extending to numerous cities throughout the world." |
| 10 Label | "2 locations" |

Two locations don't support "numerous cities".

**Suggestion (pick one):**
- **A.** "Built in Austin. Delivering from Dubai." **(confirm what Dubai is: an office, a team, or a partner)**
- **B.** "Two locations, one team: Austin, Texas and Dubai."
- **C.** Keep the legacy line and add your other real locations to `src/content/presence.ts`.

Also remove the "Online" status on that row; it doesn't say anything specific.

---

## 4. Weak stats

### 4.1 Hero readout

| Current | Problem |
|---|---|
| Platforms — Mobile · Web · Cloud | Fine as a fact, but not a number |
| Core services — 6 | A count of menu items, not an achievement |
| Industries served — 5 | Repeats 02 and 05 |

**Suggestion:** replace the readout with facts you can confirm **(confirm each)**:
- Year founded
- Products shipped (a real count)
- Team size
- Locations — Austin · Dubai (already true)

Otherwise, remove the readout and let the healthcare card take its place.

### 4.2 Section counts

"6 services", "5 solutions", "4 projects", "4 people" and "2 locations" in the label rows are fine as plain counts. (The old "Cloud — 1 service" card count is already gone in the new Services layout.)

---

## 5. Healthcare accordion (03): three-line versions

Each is a shorter version of the legacy paragraph, with no new claims.

| Row | Current (first words) | Suggested |
|---|---|---|
| HC-01 Clinical Decision Support | "Grow your healthcare business with Bizaffix's advanced Clinical Decision Support System services. Leverage data-driven insights…" (4 sentences) | Evidence-based recommendations in real time, inside the clinical workflow, so clinicians decide faster and spend their time on care. |
| HC-02 Telemedicine | "Embrace the future of healthcare with our Telemedicine Development solutions…" (4 sentences) | Personalised telemedicine platforms that connect patients and providers and fit into the systems you already run. |
| HC-03 Health Information Exchange | "Revolutionize healthcare data sharing with our cutting-edge HIE Development services. Secure, scalable, and tailored to your needs." | Secure, scalable health information exchange, built around how your organisation shares data. |
| HC-04 Electronic Health Records | "Streamline your healthcare practice with our user-friendly EHR System solutions…" (3 sentences) | User-friendly EHR systems that replace paperwork, fit the clinical workflow and protect patient data. |
| HC-05 Integration and Interoperability | "Break healthcare data barriers with our Integration and Interoperability services…" (4 sentences) | Integration that moves data between your systems, reduces errors and replaces silos with one connected record. |

The current 03 intro paragraph (5 lines) could also become just the first sentence plus 2.2.

---

## 6. Footer social links

| Network | In the codebase? | Shown in footer now? |
|---|---|---|
| LinkedIn | Yes, `src/content/contact.ts` | Yes |
| Facebook | Yes: facebook.com/bizaffix | **No** |
| Twitter / X | Named in the legacy footer, but **no URL anywhere** | No |

**Suggestion:** add Facebook to the footer (the URL already exists). For Twitter/X, send the profile link if the account is still active; otherwise leave it out.
