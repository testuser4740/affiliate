import { test } from "node:test";
import assert from "node:assert/strict";

import { config, isProduction, isDevelopment } from "../src/config";
import { NotFoundError, ValidationError, ConflictError } from "../src/exceptions";
import { ApplicantFilter } from "../src/repositories/applicant.repository";

test("config loads DB defaults from env with fallbacks", () => {
  assert.equal(config.db.name, process.env.DB_NAME ?? "gajab_affiliate");
  assert.equal(typeof config.port, "number");
  assert.equal(isDevelopment(), !isProduction());
});

test("typed exceptions carry correct HTTP status", () => {
  assert.equal(new NotFoundError().httpCode, 404);
  assert.equal(new ValidationError().httpCode, 422);
  assert.equal(new ConflictError().httpCode, 409);
});

test("applicant filter type is a valid contract", () => {
  const filter: ApplicantFilter = { q: "riya", status: "All", state: "All States", city: "All Cities" };
  assert.equal(filter.q, "riya");
});
