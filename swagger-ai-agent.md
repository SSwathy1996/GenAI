Summary of your choices — key design decisions

Execution engine topology: Hybrid — Node.js orchestrator + language-specific execution workers (Node workers + optional Java/RestAssured workers).

Spec ingestion: File-only upload (users upload .yaml/.json). Platform becomes the source of truth.

Spec versioning: Hybrid — system auto-versions (v1, v2, ...) + user-defined labels (prod, uat, release-2025).

Test definition format: Cucumber / Gherkin as canonical test artifact.

Feature file lifecycle: Hybrid — auto-generate feature skeletons, full editability inside platform, and AI-assisted authoring/refinement.

Tech stack & constraints: API-first, Node.js + TypeScript + Express core; Java/RestAssured allowed as optional worker; exact folder structure and “one file / one module” rules enforced; every platform API must have Postman entry + unit tests.

High-level architecture (words + components)

System purpose: take an uploaded Swagger/OpenAPI file, validate and normalize it, map endpoints to execution capabilities (MCP adapters), allow QA to author/adjust Gherkin feature files (AI-assisted), execute tests via workers, generate test code (Axios/Playwright/RestAssured), and produce reports + rerun capabilities.

Components (logical)

Ingress / API Gateway (Express)

Receives file uploads, API requests. Hosts the mandatory platform endpoints (feature, mapping, execution, llm, mcp). Thin controllers only.

Auth & Request Middlewares

Validation, auth, request logging, rate limiting.

Domain Layer

Pure TypeScript models (Feature, Scenario, Step, MappedStep, Locator, TestPlan, SpecSnapshot, ExecutionRun, Artifact). No infra dependencies.

Application / Use Cases

Orchestrators implementing business flows: ingestSpec, validateSpec, normalizeSpec, mapEndpoints, generateFeatureSkeleton, aiRefineFeature, planRun, enqueueRun, executeRun, collectArtifacts, generateTestCode, reportRun.

Persistence (Infrastructure)

Minimal initial: file store (fs) for spec snapshots + artifacts; a thin metadata store (Mongo or SQLite). Stores normalized models, version history, labels, run metadata, artifacts references. (Stateless controllers; DB-centric domain persistence.)

Worker/Execution Layer

Node worker pool (Axios-based) for fast API calls / lightweight runs.

Java RestAssured worker(s) as optional containerized microservice(s) for heavy API tests (if chosen per-run).

Workers pull jobs from a queue (Redis / BullMQ or RabbitMQ). Workers are disposable, stateless processes that report run status.

MCP Adapter Layer

Adapter interface + concrete adapters: Playwright MCP (existing), Generic HTTP adapter (Axios runner), RestAssured adapter (Java) — each adapter wraps execution and returns normalized results & artifacts.

LLM Service (infrastructure)

Thin wrapper(s) for LLM providers used for: payload suggestion, negative-case generation, feature refinement, locator healing. Always called from use-cases, never from controllers.

Test-Code Generator

Module that converts successful run metadata / mapped steps into code templates for:

Node test code: Axios + Jest or Playwright test specs (TypeScript)

Java test code: RestAssured + JUnit (optional)

Stores generated specs under artifacts and optionally in spec writer.

Artifacts & Storage

Organized artifacts directory: artifacts/{specId|runId} containing logs, traces, screenshots, spec files, generated code. Optional S3 backing later.

Reporting & Rerun Service

Aggregates run results, stores reports, supports reruns (selective or full). Exposes /execution/status/:runId and /execution/retry-step.

Postman & Unit Test Generator

For each API endpoint the platform exposes, a Postman collection entry is created and unit test stubs are produced. Unit tests stored with codebase and CI runs them.

React UI (future)

API-first: UI consumes stable backend APIs. UI will provide editors for Gherkin, run orchestration, reports and developer tools for mapping endpoints.

Component diagram (in words)
Client (curl/Postman/React UI)
  ↕
Express API (controllers -> use-cases)
  ↕
Domain + UseCase Layer
  ↕
Infrastructure:
  - Persistence (Mongo/FS)
  - Queue (Redis/BullMQ)
  - LLM wrapper
  - MCP Adapters (Playwright, HTTP/Axios, Java RestAssured)
  - Worker pool (Node workers, Java workers)
  - Artifacts FS / S3
  ↕
Workers execute jobs -> return results -> UseCases generate reports/code -> Persistence/Artifacts updated

Core modules and responsibilities (mapped to your folder structure)

(You must not deviate from the provided exact folder structure — below I tie each core module to folders and files.)

src/core/

app.ts, server.ts, config.ts, env.ts, types.ts

errors/ and middlewares/ (auth, validation, error handling, logging)

src/api/

routes/ — route declarations for mandatory APIs:

feature.routes.ts → POST /feature/parse, POST /feature/validate-syntax

mapping.routes.ts → POST /mapping/map-step, POST /mapping/map-scenario, POST /mapping/check-step

execution.routes.ts → POST /execution/run, GET /execution/status/:runId, POST /execution/retry-step

llm.routes.ts and mcp.routes.ts for LLM/MCP interactions if needed

controllers/ thin controllers that call use-cases in application/; never call infra directly.

dto/, validators/ — request/response shapes + Joi/Zod validators.

src/application/

feature/ — ingestSpec.usecase.ts, validateSpec.usecase.ts, normalizeSpec.usecase.ts, manageSpecVersion.usecase.ts.

mapping/ — mapEndpoint.usecase.ts, mapScenario.usecase.ts, synonymResolver.ts.

execution/ — planRun.usecase.ts, enqueueRun.usecase.ts, runOrchestrator.usecase.ts, collectArtifacts.usecase.ts, generateTestCode.usecase.ts.

llm/ — generatePayload.usecase.ts, refineFeature.usecase.ts, healStep.usecase.ts.

src/domain/

models/ — Feature.ts, Scenario.ts, Step.ts, MappedStep.ts, Locator.ts, TestPlan.ts, ExecutionRun.ts.

repositories/ — interfaces for SpecRepository, RunRepository, ArtifactRepository, LabelRepository. Domain uses interfaces only.

src/infrastructure/

mcp/

common/ — adapter interface: IMcpAdapter.ts

playwright/ — Playwright MCP client and tools (existing)

http/ or axios/ — Axios execution adapter

restassured/ (optional) — Java worker client wrapper (RPC/HTTP)

llm/ — LLM clients & orchestration (providers pluggable)

persistence/ — Mongo (or lightweight DB), file storage implementations, snapshot stores

logging/ — winston config

http/ — HTTP helpers

messaging/ — queue (BullMQ / RabbitMQ) producers/consumers

src/utils/ and src/tests/

Utilities and unit/integration tests.

Data flow: Swagger → Normalized Model → Test Cases → Execution → Reports

Upload (POST /feature/parse)

User uploads Swagger file. Controller passes to ingestSpec use-case.

Use-case stores raw file snapshot (fs), creates a SpecSnapshot entry (auto-versioned), and returns version id.

Validation (POST /feature/validate-syntax)

validateSpec use-case runs OpenAPI validator (Swagger-parser), returns errors/warnings.

Normalization

normalizeSpec extracts canonical model: endpoints, methods, parameters, request/response schemas, security schemes. Converts both OpenAPI 2.x and 3.x to a normalized internal model.

Mapping

mapEndpoint maps each endpoint to capabilities and to MCP tool types (HTTP call, browser flow, or hybrid). Uses rules + user-defined MCP profiles.

Feature skeleton generation

generateFeatureSkeleton creates candidate Gherkin scenarios per endpoint/tag; stores them as editable .feature files in spec writer. Because you selected Cucumber + editable + AI, skeletons are auto-generated but editable.

AI-assisted refinement

aiRefineFeature can enhance steps, suggest payloads using LLM (only on explicit user request), not create new scenarios beyond skeletons unless user approves edits.

Plan run

planRun selects scope (single endpoint, tag, full smoke — since you chose hybrid ingestion with file uploads, include run scope options in UI/API). Creates TestPlan entity, enqueues to queue.

Execution

Worker picks job: for HTTP endpoints use Node Axios worker; for Java-preferred runs jobs dispatch to RestAssured worker via HTTP/gRPC. Execution results normalized into a RunResult model (status, assertions, response payloads, timings).

Post-execution

generateTestCode translates successful flows into code templates (Axios/Playwright/RestAssured) and writes to artifacts/specs.

Reporting & Reruns

Reports aggregated, stored in DB; rerun uses same TestPlan or can retry specific failing steps via /execution/retry-step.

Separation of concerns

Domain: Pure models & interfaces. No infra or external calls. (src/domain/*)

Application: Orchestration & use-cases implementing business logic. Controllers call these. (src/application/*)

Infrastructure: Everything that talks to external systems (DB, queue, LLMs, MCPs). No domain logic here. (src/infrastructure/*)

API: Thin controllers, DTOs, and validation only. (src/api/*)

Core: App bootstrap, configs, middlewares. (src/core/*)

Phased implementation roadmap (detailed)

Each phase implements minimal, testable deliverables. Follow “one file / one module” rule for code generation.

Phase 1 — Project skeleton & core Express setup (MUST)

Create repo with exact folder structure provided.

Implement src/core/app.ts, server.ts, config.ts, env.ts, types.ts.

Add logger (winston), error middleware, request logger.

Add basic health endpoint /health.
First file to implement: src/core/app.ts

Phase 2 — Domain models & repository interfaces

Implement domain models: Feature, Scenario, Step, MappedStep, Locator, TestPlan, ExecutionRun.

Create repository interfaces in src/domain/repositories/*.
First file: src/domain/models/Feature.ts

Phase 3 — Infrastructure skeleton & persistence

Add persistence interfaces and an initial in-memory / file-backed implementation (fs + low-req DB like SQLite or in-memory mock).

Add queue skeleton (BullMQ adapters stubbed).

Add MCP adapter interface src/infrastructure/mcp/common/IMcpAdapter.ts.
First file: src/infrastructure/persistence/FileSpecRepository.ts (implements SpecRepository interface)

Phase 4 — Feature parsing & validation

Implement parse-feature.usecase.ts and validateFeatureSyntax.usecase.ts under src/application/feature/.

Add controllers & routes (src/api/controllers/feature.controller.ts, src/api/routes/feature.routes.ts).

Unit tests for parser and validator.
First file: src/application/feature/parse-feature.usecase.ts

Phase 5 — Endpoint mapping & feature skeleton generation

Implement map-step + map-scenario use-cases, synonym utilities, and auto Gherkin skeleton generator.

src/api/mapping controller + routes.
First file: src/application/mapping/mapSingleStep.usecase.ts

Phase 6 — Execution planner & Node execution worker

Implement planRun.usecase.ts, run enqueuing, Node Axios worker for HTTP execution.

Implement src/api/controllers/execution.controller.ts endpoints.

Add run metadata persistence.
First file: src/application/execution/planRun.usecase.ts

Phase 7 — Test-code generation (Node)

Implement generator for Axios + Playwright spec templates. Implement src/application/execution/generateTestCode.usecase.ts.

Add SpecWriter to src/infrastructure/playwright/spec-writer.ts (as per your Phase 12 notes).
First file: src/application/execution/generateTestCode.usecase.ts

Phase 8 — Java RestAssured worker + MCP wiring (optional)

Implement containerized Java RestAssured worker and an adapter (src/infrastructure/mcp/restassured/*) to call it.

Add queue routing logic to send heavy API tests to Java workers.
First file: src/infrastructure/mcp/restassured/RestAssuredAdapter.ts (stub)

Phase 9 — LLM integration (AI-assisted editing)

Implement LLM wrappers (src/infrastructure/llm/*) and use-cases for suggestPayload, refineFeature, healStep.
First file: src/infrastructure/llm/OpenAiClient.ts (wrapper stub)

Phase 10 — Artifacts, reports & rerun workflows

Implement artifact collection, artifact storage (local -> S3), report generation UI endpoints, rerun APIs.
First file: src/application/execution/collectArtifacts.usecase.ts

Phase 11 — Hardening & testing

Add rate limiting, retries, structured logs, concurrent execution handling, unit & integration tests.

Produce Postman collection and unit test coverage for every public API.

Phase 12+ — React UI & advanced features

React UI for spec/version management, Gherkin editor (with AI buttons), run dashboards. Backend APIs remain stable (API-first).

Run scope & environment model (operational choices)

Run scope options: single endpoint, tag-based runs, full smoke, interactive selection via UI or API.

Environment model: DB-backed environment definitions (dev/qa/stage/prod) with templated variables for baseUrl, headers, auth tokens. Runs bind to an environment snapshot (stateless run execution: workers receive all env values needed).

Auth & secrets: store tokens in vault (or encrypted DB). Controllers pass ephemeral tokens to workers; never persist raw tokens in logs.

Test-generation & payload strategies (based on your choices)

Test generation: produce Gherkin skeletons from endpoints; allow manual editing + AI refine.

Payload generation: default = schema-only + fixture library. Optional LLM-assisted payload variants for richer negative-case and edge-case payloads.

Test templates: template-based code with placeholders (configurable). Generated files in artifacts/{runId}/specs/{scriptId}.spec.ts.

Postman + Unit Test approach (mandatory)

For every platform API (feature/mapping/mcp/llm/execution), generate:

A Postman collection folder with requests and sample bodies.

Unit test skeletons (Jest + Supertest).

CI step must run unit tests and run a Postman/Newman smoke collection against a local dev server.

Failure handling, retries & reruns

Workers return normalized error objects (status code, error type, stack, artifacts).

Orchestrator persists failure reasons and marks failing steps.

Rerun API supports:

retry step (POST /execution/retry-step) — only replays failing step(s) with same environment snapshot.

rerun plan — re-enqueue whole TestPlan.

Copilot-ready implementation prompt (brief + rules)

Use this when asking Copilot to implement code:

Project: Enterprise Swagger AI Agent
Stack: Node.js 20+, TypeScript, Express, Mongo (or SQLite dev), BullMQ (Redis) optional, Playwright MCP present.

Rules:
1) Follow exact folder structure provided in master spec.
2) One file at a time. Generate only the single file requested.
3) Controllers must be thin: validate -> call one use-case -> return response.
4) Use dependency injection for infra in use-cases (pass repository/adapters interfaces).
5) Domain layer must have zero external dependencies.
6) Add JSDoc for exported functions & interfaces.
7) Add unit test for every file produced using Jest; tests in src/tests/.
8) For any external integration (LLM, MCP, DB), implement an interface and a local in-memory stub.
9) Always create DTOs & validators for API endpoints.
10) Return errors using AppError subclasses.

Start implementing phase-by-phase. For Phase N, implement file X first.

Copilot-first-file recommendations (what to implement first in each phase)

Phase 1: src/core/app.ts

Phase 2: src/domain/models/Feature.ts

Phase 3: src/infrastructure/persistence/FileSpecRepository.ts

Phase 4: src/application/feature/parse-feature.usecase.ts

Phase 5: src/application/mapping/mapSingleStep.usecase.ts

Phase 6: src/application/execution/planRun.usecase.ts

Phase 7: src/application/execution/generateTestCode.usecase.ts

Phase 8: src/infrastructure/mcp/restassured/RestAssuredAdapter.ts (stub)

Phase 9: src/infrastructure/llm/OpenAiClient.ts (stub)

Phase 10: src/application/execution/collectArtifacts.usecase.ts

Example API contract snippets (concise)

POST /feature/parse
Request:

{
  "fileName": "petstore.yaml",
  "content": "<file content>",
  "label": "v1.0.0"
}


Response:

{ "specId": "spec-123", "version": "v1", "labels": ["staging"] }


POST /execution/run
Request:

{
  "specId": "spec-123",
  "scope": { "type": "tag", "value": "smoke" },
  "environment": "qa",
  "scriptId": "checkout-flow-v2",
  "options": { "recordVideo": false, "preferRestAssured": false }
}


Response:

{ "runId": "run-123", "status": "queued" }


GET /execution/status/:runId
Response:

{
  "runId": "run-123",
  "status": "completed",
  "items": [ { "scenario": "Checkout", "status": "failed", "logs": "..." } ],
  "artifactsPath": "./artifacts/run-123"
}

Operational notes & recommendations

Start with a file-backed spec store + in-memory queue in dev; swap to Mongo + BullMQ + Redis in staging/production.

Containerize Java RestAssured worker as optional; call via HTTP/gRPC — start with HTTP to keep integration simple.

Keep LLM usage explicit and attach prompts to audit logs (avoid silent LLM changes).

Secure secrets with vault or env-encrypted values. Do not log raw tokens.

Build Postman collection and unit test stubs during Phase 1–4 to ensure API-first discipline.

If you’d like, next I can:

Produce the full Instructions.md text that exactly matches this architecture (ready to download), or

Generate the first file (src/core/app.ts) content now (one file at a time), with tests and Postman sample, per your “one file at a time” rule.