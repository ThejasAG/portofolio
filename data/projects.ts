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
 * Featured work is projects Thejas built. Vya is deliberately absent: it is
 * a product tested during the Xorstack internship, not a personal project,
 * and belongs in data/experience.ts.
 *
 * Repository URLs come from the actual git remotes — none are guessed.
 */
export const projects: Project[] = [
  {
    slug: "test-orchestration-platform",
    number: "01",
    title: "Test Orchestration Platform",
    category: "Automation & reliability engineering",
    description:
      "Running the full regression suite after every change is slow. This platform works out which tests a change can actually affect, and runs only those across real devices.",
    longDescription:
      "A mobile test orchestration platform: a FastAPI backend, a React dashboard, and execution agents that drive real Android and iOS devices through Appium. Its core idea is impact-based selection — a change's files are resolved through a dependency graph into the set of affected modules, and only scenarios whose declared coverage touches those modules are run. Scenarios with no coverage tags are run anyway rather than skipped, so selection never silently drops a test it cannot reason about.",
    role: "Built and maintained the platform during the Xorstack internship: backend API, execution agents, device allocation, migrations and the reliability work.",
    technologies: [
      "Python",
      "FastAPI",
      "Appium",
      "Selenium",
      "SQLAlchemy",
      "Alembic",
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
    layout: "wide",
    study: {
      overview:
        "A platform for orchestrating mobile regression testing: selecting relevant tests from code changes, then coordinating their execution across real devices, with a dashboard for registering projects and reading reports.",
      problem:
        "Running a full regression suite after every code change is slow, and most of it is irrelevant to what actually changed. But narrowing the run is only safe if you can show a skipped test could not have been affected — otherwise you are trading time for missed defects.",
      context:
        "Mobile applications tested on real Android and iOS devices, across more than one machine, with runs triggered manually or from a GitHub webhook.",
      role:
        "I built and maintained the platform: the backend API, execution agents, device allocation, database migrations and the reliability work.",
      approach: [
        "Resolve a change's files through a dependency graph into a deterministic set of affected files and modules.",
        "Select only the scenarios whose declared coverage touches those modules, and report what was skipped rather than hiding it.",
        "Run any scenario that carries no coverage tags, since a test that cannot be reasoned about must not be silently dropped.",
        "Put execution agents behind the backend API rather than the database, so one place decides what a run may do.",
      ],
      implementation: [
        "FastAPI backend with SQLAlchemy models and Alembic owning the schema.",
        "Execution agents driving real devices through Appium and Selenium.",
        "React dashboard for registering projects from a Git URL, triggering runs and reading reports.",
        "Device reservation and process lifecycle, with machine-aware resolution so an agent only allocates devices present on its host.",
      ],
      challenges: [
        "Making selection sound: the value is in tests skipped, but the risk is skipping one that mattered.",
        "Runs reporting outcomes that did not match device behaviour — a suite that reports the wrong answer is worse than none.",
        "A schema Alembic did not truly own, so a fresh machine could not be reproduced reliably.",
      ],
      validation: [
        "Reproduced each reliability bug before fixing it, so the fix addressed the actual cause.",
        "Verified a new machine could be brought up from the migrations alone.",
        "Confirmed a webhook push creates exactly one run rather than duplicates.",
      ],
      result:
        "A centralised automation workflow where a change runs a targeted set of tests instead of the whole suite, execution is coordinated across devices and machines, and the database rebuilds from migrations on a new host.",
      lessons: [
        "Test selection is only useful if it is sound — an untagged scenario must run, not be assumed safe.",
        "A suite that reports the wrong answer costs more than the time it saves.",
        "Migrations are authoritative only if nothing else may change the schema.",
      ],
    },
  },
  {
    slug: "medical-voice-bot",
    number: "02",
    title: "Medical Voice Bot",
    category: "AI / voice interface",
    description:
      "A voice assistant that listens to spoken symptoms, classifies them with a trained model, and points the user toward the right kind of care.",
    longDescription:
      "A voice-driven medical assistant built around a spoken loop: speech recognition takes a symptom description, a scikit-learn Logistic Regression classifier trained on a symptom dataset categorises it, and offline text-to-speech replies. It covers conditions from fever and migraine through chest pain and fractures, mapping each to an appropriate hospital referral. A medical filter keeps it inside its remit — off-topic questions get a refusal rather than an invented answer.",
    role: "Sole developer — FastAPI backend, symptom classification, the voice pipeline, translation layer and React dashboard.",
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
    layout: "split",
  },
  {
    slug: "food-delivery",
    number: "03",
    title: "Food Delivery Application",
    category: "Full-stack application",
    description:
      "A full-stack ordering application — browsing, cart, checkout and order history — with map-based delivery addresses and a per-restaurant delivery radius.",
    longDescription:
      "A Flask API and React client for food ordering. Customers pick a delivery address from a Leaflet map, and the backend decides whether a restaurant will deliver there by measuring the great-circle distance between the two points against that restaurant's configured maximum radius. It has JWT authentication, admin flows for managing restaurants and menus, and a cart-to-order-history flow.",
    role: "Sole developer — Flask API, database models and migrations, React client, and the location and delivery-radius logic.",
    technologies: [
      "Python",
      "Flask",
      "SQLAlchemy",
      "Flask-Migrate",
      "JWT",
      "MySQL",
      "React",
      "Vite",
      "Leaflet",
    ],
    image: null,
    imageAlt:
      "CONTENT_REQUIRED — describe an application screenshot once one is added.",
    github: "https://github.com/ThejasAG/food_delivery",
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
