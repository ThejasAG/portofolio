export type Project = {
  slug: string;
  number: string;
  title: string;
  category: string;
  /** One or two lines shown in the work list. */
  description: string;
  /** Longer paragraph for the project block. */
  longDescription: string;
  role: string;
  technologies: string[];
  /** Path under /public. Leave null for a typographic placeholder panel. */
  image: string | null;
  imageAlt: string;
  /** Optional second layer for the parallax image stack. */
  imageBack?: string | null;
  github: string | null;
  live: string | null;
  /** Set true to generate /work/<slug> with the caseStudy content below. */
  caseStudy: boolean;
  featured: boolean;
  /** Editorial variation: alternating layouts keep the section from feeling uniform. */
  layout: "wide" | "split" | "stack";
  study?: {
    overview: string;
    problem: string;
    context: string;
    role: string;
    approach: string[];
    implementation: string[];
    challenges: string[];
    validation: string[];
    result: string;
    lessons: string[];
  };
};

/**
 * Ordered as a progression: real-world product work first, then the
 * automation platform, then the AI project, then the academic backend.
 *
 * Repository URLs are read from the actual git remotes and the ThejasAG
 * GitHub account — none are guessed.
 */
export const projects: Project[] = [
  {
    slug: "vya",
    number: "01",
    title: "Vya",
    category: "Consumer & business applications",
    description:
      "Two applications issue invoices for the same purchase. Making sure their VAT calculation and rounding agree — and understanding the cases where they did not.",
    longDescription:
      "Vya ships a Consumer app and a Business app over the same commercial workflows. I have been testing both and comparing their behaviour and outputs, with invoice and VAT correctness as the sharpest surface: the same basket should produce the same tax, to the cent, on either side. Most invoices matched. The work was isolating the ones that did not, and establishing why.",
    role: "CONTENT_REQUIRED — your internship title at Xorstack (the employer) while working on Vya.",
    technologies: [
      "Invoice validation",
      "VAT calculation validation",
      "Regression testing",
      "Real-device testing",
      "Parallel testing",
      "API validation",
      "Debugging",
    ],
    image: null,
    imageAlt:
      "CONTENT_REQUIRED — describe a Vya screenshot once one is added.",
    imageBack: null,
    github: null,
    live: null,
    caseStudy: true,
    featured: true,
    layout: "wide",
    study: {
      overview:
        "Cross-application validation of the Vya Consumer and Business apps: comparing workflows and outputs, with invoice totals, VAT calculation and rounding behaviour as the primary correctness surface.",
      problem:
        "The Consumer and Business applications each produce invoices for the same underlying purchase. Their totals need to agree exactly — a tax line that differs by a single cent between two views of one transaction is a correctness problem, not a display artefact.",
      context:
        "Both applications cover overlapping commercial workflows across multiple VAT rates. Invoices from each side were compared directly against one another. It is worth stating plainly that most of these comparisons matched; the objective was to find and understand the cases that did not.",
      role:
        "CONTENT_REQUIRED — your internship title at Xorstack. What follows describes the work itself.",
      approach: [
        "Compared Consumer and Business invoices for the same purchases, across different VAT rates, rather than checking either application in isolation.",
        "Reproduced the arithmetic by hand for cases that disagreed, so the expected value was established independently of what either application reported.",
        "Treated the order of operations as the variable under test — specifically, at which stage a value gets rounded.",
        "Ran the comparisons as regression checks, since rounding behaviour can change with any pricing or tax-handling work.",
      ],
      implementation: [
        "Validated invoice workflows end to end across both applications, including API responses where applicable.",
        "Exercised the applications on real devices rather than emulators alone, so the behaviour under test was the behaviour users actually get.",
        "Evaluated running multiple applications and devices in parallel, including where that approach stops being practical.",
      ],
      challenges: [
        "A concrete case: Jever Fun ×2 at 25% VAT. The total of €8.42 was correct, but rounding the per-unit excluding-VAT price prematurely gives €3.69 × 2 = €7.38, which yields VAT of €1.04 rather than the expected €1.03.",
        "The failure is invisible from the total alone — the headline figure was right, and only the tax line disclosed that an intermediate value had been rounded a step too early.",
        "Because most invoices matched, the discrepancies only appeared for particular quantity and rate combinations, so the comparisons had to be deliberate rather than sampled.",
      ],
      validation: [
        "Compared invoices from both applications for the same purchases across multiple VAT rates.",
        "Recomputed expected VAT independently for the cases that disagreed, instead of trusting either application as the reference.",
        "Re-ran the comparisons as regression checks to confirm behaviour stayed consistent between the two applications.",
      ],
      result:
        "The inconsistencies were identified and traced to premature per-unit rounding rather than a difference in tax rates or pricing, with a worked case demonstrating exactly how a correct total can accompany an incorrect VAT line.",
      lessons: [
        "A correct total does not mean a correct invoice — the intermediate values decide whether the tax line survives.",
        "When two systems disagree, neither is the reference. Recomputing the expected value independently is the only way to establish which one is wrong.",
        "Rounding is an ordering problem. Where it happens matters more than how it is done.",
      ],
    },
  },
  {
    slug: "automation-platform",
    number: "02",
    title: "Test Orchestration Platform",
    category: "Automation & reliability engineering",
    description:
      "A platform for running mobile automation across real devices — and the reliability work that stopped its runs from reporting results that weren't true.",
    longDescription:
      "A distributed test orchestration system: a FastAPI backend, a React dashboard, and execution agents that drive real Android and iOS devices through Appium. Projects are registered from a Git URL and run on demand or from a GitHub webhook. The engineering that mattered most was not adding features but making results trustworthy — device allocation that is aware of which machine it is on, a process lifecycle that cleans up after itself, and a schema that Alembic actually owns rather than one that drifts.",
    role: "Built and maintained the platform: backend API, execution agents, device allocation, database migrations and the reliability work.",
    technologies: [
      "Python",
      "FastAPI",
      "Appium",
      "Selenium",
      "SQLAlchemy",
      "Alembic",
      "PostgreSQL",
      "React",
      "GitPython",
    ],
    image: null,
    imageAlt:
      "CONTENT_REQUIRED — describe a dashboard screenshot once one is added.",
    imageBack: null,
    github: "https://github.com/ThejasAG/AutomationTesting",
    live: null,
    caseStudy: true,
    featured: true,
    layout: "split",
    study: {
      overview:
        "An orchestration platform for mobile test automation: a FastAPI backend and React dashboard coordinating execution agents that drive real devices through Appium, with runs triggered manually or by GitHub webhook.",
      problem:
        "An automation suite is only worth having if a failure means something. Runs were reporting outcomes that did not reflect what happened on the device, and a suite that lies is worse than no suite — it costs the team time and teaches them to ignore red builds.",
      context:
        "Real devices, more than one machine, and tests for two applications. Device allocation, process cleanup and schema state all had to hold across machines that were not identical.",
      role:
        "I built and maintained the platform and led the reliability work: the agent architecture, device reservation, process lifecycle and the database migration reconciliation.",
      approach: [
        "Put the agent behind the backend API rather than letting it reach into the database directly, so there is one place that decides what a run is allowed to do.",
        "Made device resolution machine-aware, so an agent allocates devices that actually exist on the host it is running on.",
        "Gave runs a real process lifecycle with device reservation, so two runs cannot claim the same device and orphaned processes do not linger.",
        "Made Alembic authoritative over the schema and reconciled the drift it had been papering over, so a fresh machine reproduces the same database.",
      ],
      implementation: [
        "FastAPI backend with SQLAlchemy models and Alembic migrations owning the schema.",
        "Execution agents driving Android and iOS devices through Appium and Selenium.",
        "React dashboard for registering projects, triggering runs and reading reports.",
        "GitHub webhook integration so a push can start a run, with the fix that stopped one push creating duplicate runs.",
      ],
      challenges: [
        "Runs that reported results not matching device behaviour — the failure mode that makes an entire suite untrustworthy.",
        "A schema Alembic did not truly own, so a new machine could not be reproduced reliably.",
        "iOS device discovery and Appium waits behaving differently from Android, needing platform-specific handling rather than one shared path.",
      ],
      validation: [
        "Reproduced each reliability bug before fixing it, so the fix could be shown to address the actual cause.",
        "Verified a fresh machine could be brought up from the migrations alone.",
        "Confirmed webhook-triggered runs create exactly one run rather than duplicates.",
      ],
      result:
        "Runs report what actually happened on the device, device allocation works across machines, and the database can be rebuilt from migrations on a new host.",
      lessons: [
        "A test suite that reports the wrong answer is a liability, not an asset — reliability comes before coverage.",
        "Migrations are only authoritative if nothing else is allowed to change the schema.",
        "Routing agents through the API instead of the database gives one place to enforce the rules.",
      ],
    },
  },
  {
    slug: "medical-voice-bot",
    number: "03",
    title: "Medical Voice Assistant",
    category: "AI / voice interface",
    description:
      "A voice assistant that listens to spoken symptoms, classifies them with a trained model, and refers the user to the right kind of hospital.",
    longDescription:
      "A multilingual voice medical assistant built around a spoken loop: speech recognition takes the symptom description, a Logistic Regression classifier trained on a symptom dataset categorises it, and offline text-to-speech answers. It handles conditions from fever and migraine through to chest pain and fractures, routing each to an appropriate specialist referral. A filter keeps it inside its remit — non-medical questions get a refusal rather than an invented answer.",
    role: "Sole developer — the FastAPI backend, symptom classification model, voice pipeline, translation layer and React dashboard.",
    technologies: [
      "Python",
      "FastAPI",
      "scikit-learn",
      "NLTK",
      "pandas",
      "SpeechRecognition",
      "pyttsx3",
      "React",
      "Vite",
    ],
    image: null,
    imageAlt:
      "CONTENT_REQUIRED — describe a dashboard screenshot once one is added.",
    github: "https://github.com/ThejasAG/MedicalVoice-BOT",
    live: null,
    caseStudy: false,
    featured: true,
    layout: "stack",
  },
  {
    slug: "agrieco-backend",
    number: "04",
    title: "AgriEco",
    category: "Backend & data platform",
    description:
      "The API and data layer behind a farming advisory platform — built to run correctly before any of the machine learning it serves existed.",
    longDescription:
      "AgriEco is a final-year engineering project that turns soil readings, weather and market data into crop guidance for farmers. I built the backend: a FastAPI service with token auth, a relational schema for farmers, farms and crop sessions, and seven route modules that serve another team member's models to the frontend. The interesting constraint was sequencing — the API had to be usable weeks before the trained models were ready.",
    role: "Backend and database developer. I authored the FastAPI application, the SQLAlchemy schema, the auth layer and the smoke test suite.",
    technologies: [
      "Python",
      "FastAPI",
      "SQLAlchemy",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Pydantic",
      "JWT",
      "pytest",
    ],
    image: null,
    imageAlt:
      "CONTENT_REQUIRED — describe an AgriEco screenshot once one is added.",
    imageBack: null,
    github: "https://github.com/ThejasAG/agrivers",
    live: null,
    caseStudy: true,
    featured: true,
    layout: "stack",
    study: {
      overview:
        "A FastAPI backend serving crop, disease, irrigation, market and chat predictions to a React frontend, backed by Postgres for relational data, MongoDB for documents and Redis for caching.",
      problem:
        "Four people were building one system in parallel. The machine learning models were the slowest part, and everything else — the API, the database, the frontend — depended on them. Built naively, the backend would import a missing .pkl file and crash on startup, blocking the frontend work for weeks.",
      context:
        "Final-year B.E. project at Dr. Ambedkar Institute of Technology, Bengaluru. Work was split across four branches with pull requests into a shared dev branch; I owned the backend and database directory.",
      role:
        "I designed and wrote the entire backend: application setup, the relational schema, the authentication layer, seven route modules, the model-loading layer and the test suite.",
      approach: [
        "Made every model loader lazy and null-returning, so the service boots and its docs work with an empty models directory.",
        "Made routes translate a missing model into a 503 with the specific file path that is absent, rather than an opaque import error.",
        "Treated the two optional datastores the same way: without MONGO_URL or REDIS_URL the helpers no-op and fall back in-process, so nobody needs three databases running to test one endpoint.",
        "Scoped every farm lookup by the authenticated farmer's id, so ownership is enforced in the data layer rather than remembered at each call site.",
      ],
      implementation: [
        "FastAPI application with CORS driven by environment configuration and routers mounted per domain: auth, soil, disease, irrigation, market, chat, weather.",
        "SQLAlchemy models for farmers, farms, soil records, crop sessions, irrigation, market predictions and weather, created on startup.",
        "Token authentication with a current_farmer dependency that resolves and validates the caller on every protected route.",
        "Password hashing via pbkdf2_sha256 — chosen over bcrypt deliberately, as a pure-Python scheme that installs cleanly on every teammate's machine.",
        "Pydantic schemas that bound each input to a physically sensible range, so malformed readings are rejected before they reach a model.",
      ],
      challenges: [
        "Serving models that did not exist yet without letting their absence break the running service.",
        "Keeping a three-datastore design workable for teammates who only had one of them installed.",
        "Ensuring one farmer could not read or write another farmer's records once multiple accounts existed.",
      ],
      validation: [
        "A smoke test that runs against a temporary SQLite database and a deliberately empty models directory — the exact state of the repository during early development.",
        "Covers registration, duplicate-phone rejection, login with correct and incorrect passwords, and access to a protected route with and without a token.",
        "Asserts that a missing model returns 503 rather than crashing, and that out-of-range input is rejected with 422 before reaching a model.",
        "Registers a second account and asserts it receives 404 when writing against the first account's farm, proving tenant scoping holds.",
      ],
      result:
        "The backend and its documentation were usable while the models directory was still empty, so the frontend and ML work could proceed in parallel rather than in sequence. The test suite runs with no external services configured.",
      lessons: [
        "Designing for the absence of a dependency is cheaper than coordinating around its arrival.",
        "A degraded response that names the missing file is worth far more to a teammate than a stack trace.",
        "Authorisation belongs in the query, not in a check each caller has to remember.",
      ],
    },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const caseStudies = projects.filter((p) => p.caseStudy && p.study);
