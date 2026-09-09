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
    title: "Serving models that did not exist yet",
    domain: "API design / dependency sequencing",
    problem:
      "The backend loaded trained model files at import time. While those files were still being produced by another team member, starting the API raised an import error — so the frontend could not develop against it at all.",
    investigation:
      "The failure was not really about machine learning. Every route had a hard dependency on an artefact whose arrival date nobody controlled, and that dependency was being resolved at the worst possible moment: process startup, where one missing file takes down all seven route modules including the ones that need no model.",
    approach:
      "I moved every loader behind a lazy, cached accessor that returns None when the file is absent, and made each route convert that None into a 503 naming the exact path it is waiting for. A health endpoint reports which models have landed. The absence of a dependency became a runtime state the API reports, rather than a crash.",
    result:
      "The service and its generated documentation ran correctly against an empty models directory, so frontend and backend work continued in parallel instead of queueing behind the ML work.",
    flow: [
      "Request",
      "Lazy loader",
      "Model present?",
      "Predict / 503 with path",
    ],
  },
  {
    number: "02",
    title: "Proving one account cannot reach another's data",
    domain: "Authorisation / test design",
    problem:
      "Farms, soil records and crop sessions all hang off a farmer id. Any endpoint that took a farm_id from the request body could be pointed at another farmer's farm unless every handler remembered to check ownership.",
    investigation:
      "Per-handler checks are the kind of thing that holds until the day someone adds an eighth route and forgets. The safer place for the rule is the lookup itself, where every caller has to go through it — and the only way to know it holds is a test that actively tries to break it.",
    approach:
      "I scoped the farm lookup by farmer id so a mismatched owner returns nothing, and made the routes translate that into a 404 rather than a 403 — a stranger's record should not be confirmed to exist. The smoke test registers a second account and asserts it receives 404 when writing against the first account's farm.",
    result:
      "Ownership is enforced in one function rather than repeated across route handlers, and the boundary is covered by an assertion that fails if a future change weakens it.",
    flow: ["Token", "Resolve farmer", "Scoped lookup", "404 if not owner"],
  },
  {
    number: "03",
    title: "A correct total with the wrong VAT",
    domain: "Invoice correctness / cross-application QA",
    problem:
      "Invoices for the same purchase are produced by both the Vya Consumer and Business applications. Their VAT lines needed to agree exactly. Most did — but some combinations of quantity and rate did not.",
    investigation:
      "Take Jever Fun ×2 at 25% VAT. The invoice total of €8.42 was correct, which is what makes the case interesting: the headline figure gives nothing away. Rounding the per-unit excluding-VAT price before multiplying gives €3.69 × 2 = €7.38, and that carries through to VAT of €1.04 instead of €1.03. The cent is lost at the rounding step, not in the rate.",
    approach:
      "I recomputed the expected values by hand rather than treating either application as the reference, and compared invoices across different VAT rates to separate a rounding-order problem from a rate-handling one. The comparisons were re-run as regression checks, since rounding behaviour is easy to disturb.",
    result:
      "The inconsistency was traced to premature per-unit rounding rather than a difference in rates or pricing, with a concrete worked case showing how a correct total can sit alongside an incorrect tax line.",
    flow: [
      "Unit price excl. VAT",
      "Round per unit",
      "× quantity = €7.38",
      "VAT €1.04 ≠ €1.03",
    ],
  },
  {
    number: "04",
    title: "How far parallel device testing actually goes",
    domain: "Test execution / device coverage",
    problem:
      "Two applications, multiple devices, and validation that has to happen on real hardware rather than emulators — running that sequentially costs time that grows with every device added to the matrix.",
    investigation:
      "I evaluated running multiple applications and devices simultaneously, and where that stops being practical. Parallel execution is not free: the constraint is not only how many devices are available but whether concurrent runs stay independent enough for a failure to still mean something.",
    approach:
      "Assessed real-device execution against the coverage it actually buys, and treated the practical limits of parallelism as a finding in their own right rather than a target to maximise.",
    result:
      "CONTENT_REQUIRED — what you concluded about where parallel execution was and was not worth using.",
  },
];
