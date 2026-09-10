/**
 * "Technical problems I've solved" — short, self-contained engineering stories.
 * These are separate from project case studies: each one is a single problem,
 * its investigation and its outcome.
 *
 * 01 and 02 come from the Vya cross-application testing work. 03 and 04 are
 * drawn from code you authored in the AgriEco backend.
 */
export type TechnicalCase = {
  number: string;
  title: string;
  domain: string;
  problem: string;
  investigation: string;
  approach: string;
  result: string;
  /**
   * Optional pipeline diagram rendered as a row of labelled steps,
   * e.g. ["Input", "Calculation", "Rounding", "Expected result"].
   */
  flow?: string[];
};

export const technicalCases: TechnicalCase[] = [
  {
    number: "01",
    title: "Smarter regression test selection",
    domain: "Automation platform — Xorstack",
    problem:
      "Running the full regression suite after every code change is slow, and most of the run has nothing to do with what changed. Narrowing it is only safe if a skipped test can be shown to be unaffected.",
    investigation:
      "The question is not \u201cwhich tests are slow\u201d but \u201cwhich tests could this change possibly break\u201d. That turns into a dependency problem: resolve the changed files into the modules that depend on them, then find the scenarios whose coverage touches those modules.",
    approach:
      "Changed files are resolved through a dependency graph into a deterministic set of affected modules, and only scenarios declaring coverage of those modules are selected. A scenario with no coverage tags cannot be judged, so it runs anyway and is flagged \u2014 selection stays sound rather than optimistic.",
    result:
      "A change runs a targeted set of tests instead of the whole suite, and the run reports what was skipped rather than hiding it.",
    flow: ["Changed files", "Dependency graph", "Affected modules", "Selected scenarios"],
  },
  {
    number: "02",
    title: "Reliable iOS test execution",
    domain: "Automation platform — Xorstack",
    problem:
      "Runs were reporting outcomes that did not match what happened on the device. A suite that reports the wrong answer is worse than no suite: it costs the team time and teaches them to ignore failures.",
    investigation:
      "The causes were infrastructural rather than in the tests: agents reaching past the API, device resolution that assumed one Mac, WebDriverAgent sessions and simulator state outliving their run, and a schema Alembic did not really own.",
    approach:
      "Put the agents behind the backend API so one place decides what a run may do; made device resolution machine-aware so an agent only allocates iPhones and simulators on its own Mac; gave runs a real process lifecycle with device reservation covering WebDriverAgent sessions; and made Alembic authoritative over the schema.",
    result:
      "Runs report what actually happened on the device, two runs cannot claim the same iPhone or simulator, and a fresh Mac rebuilds its database from migrations.",
  },
  {
    number: "03",
    title: "Cross-application VAT calculation inconsistency",
    domain: "Application testing — Xorstack",
    problem:
      "The Vya Consumer and Business applications each produce invoices for the same purchase, and their VAT lines have to agree exactly. Most comparisons matched \u2014 the work was isolating the ones that did not and understanding why.",
    investigation:
      "Take Jever Fun \u00d72 at 25% VAT. The invoice total of \u20ac8.42 was correct, which is what makes it interesting: the headline figure gives nothing away. Rounding the per-unit excluding-VAT price before multiplying gives \u20ac3.69 \u00d7 2 = \u20ac7.38, and that carries through to VAT of \u20ac1.04 instead of \u20ac1.03.",
    approach:
      "I recomputed the expected values by hand rather than treating either application as the reference, and compared invoices across different VAT rates to separate a rounding-order problem from a rate-handling one. The comparisons were re-run as regression checks.",
    result:
      "The inconsistency was traced to premature per-unit rounding rather than a difference in rates or pricing, with a worked case showing how a correct total can accompany an incorrect tax line.",
    flow: [
      "Unit price excl. VAT",
      "Round per unit",
      "\u00d7 quantity = \u20ac7.38",
      "VAT \u20ac1.04 \u2260 \u20ac1.03",
    ],
  },
  {
    number: "04",
    title: "Delivery-distance calculation and location updates",
    domain: "Food delivery application",
    problem:
      "Whether a restaurant delivers to an address depends on the distance between two points. The delivery range was not behaving correctly when the selected map location changed.",
    investigation:
      "I followed the flow end to end: the pin dropped on the map, the address resolved from it, the coordinates stored for the user and the restaurant, and the distance computed from those. Coordinates arriving as strings rather than numbers, or a distance computed from a stale pin, both produce a plausible-looking wrong answer.",
    approach:
      "Validated the coordinates on both sides, made the distance function coerce its inputs to numbers and return infinity when any coordinate is missing rather than throwing, and made sure the distance recomputes when the pin moves. The Haversine result is then compared against the restaurant's configured maximum radius.",
    result:
      "Delivery range is decided from the currently selected location, and a missing coordinate fails closed \u2014 out of range \u2014 instead of erroring or silently passing.",
    flow: ["Map pin", "Coordinates", "Haversine distance", "Compare to radius"],
  },
  {
    number: "05",
    title: "Backend that runs before its dependencies exist",
    domain: "AgriEco — academic project",
    problem:
      "The backend loaded trained model files at import time. While those files were still being produced by another team member, starting the API raised an import error, so the frontend could not develop against it at all.",
    investigation:
      "The problem was not machine learning. Every route had a hard dependency on an artefact whose arrival nobody controlled, resolved at the worst moment: process startup, where one missing file takes down all seven route modules including those needing no model.",
    approach:
      "Moved every loader behind a lazy accessor returning None when the file is absent, and made each route convert that into a 503 naming the exact path it is waiting for. A health endpoint reports which models have landed.",
    result:
      "The service and its documentation ran correctly against an empty models directory, so frontend and backend work continued in parallel instead of queueing behind the ML work.",
    flow: ["Request", "Lazy loader", "Model present?", "Predict / 503 with path"],
  },
  {
    number: "06",
    title: "Proving one account cannot reach another's data",
    domain: "AgriEco — academic project",
    problem:
      "Farms, soil records and crop sessions all hang off a farmer id. Any endpoint taking a farm_id from the request body could be pointed at another farmer's farm unless every handler remembered to check ownership.",
    investigation:
      "Per-handler checks hold until someone adds an eighth route and forgets. The safer place for the rule is the lookup itself, which every caller must go through \u2014 and the only way to know it holds is a test that tries to break it.",
    approach:
      "Scoped the farm lookup by farmer id so a mismatched owner returns nothing, and had routes translate that into a 404 rather than a 403 \u2014 a stranger's record should not be confirmed to exist. The test registers a second account and asserts it gets 404 writing against the first account's farm.",
    result:
      "Ownership is enforced in one function instead of repeated across handlers, covered by an assertion that fails if a later change weakens it.",
    flow: ["Token", "Resolve farmer", "Scoped lookup", "404 if not owner"],
  },
];
