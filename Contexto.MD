# MCPS 4 All --- Project Context

> **Learn it. Build it. Break it. Improve it. Share it.**

This document is the persistent working context for **MCPS 4 All**. Its
purpose is to preserve the project's intent, architecture, decisions,
rules, roadmap, and learning objectives so development can be resumed
without reconstructing previous discussions.

Unlike `README.md`, this file is primarily an **internal project
reference**. It may contain plans, decisions, working assumptions,
future ideas, and development philosophy that do not need to appear on
the public-facing project page.

------------------------------------------------------------------------

## 1. Project Identity

**Project name:** MCPS 4 All\
**Repository name:** `mcps-4-all`

### Public description

> An open-source collection of practical Model Context Protocol (MCP)
> servers built for learning, experimentation, automation, and
> real-world use.

### Tagline

> **Learn it. Build it. Break it. Improve it. Share it.**

### Core idea

MCPS 4 All is not intended to be one enormous MCP server.

It is a learning and engineering project where focused MCP servers are
designed, implemented, broken, tested, improved, documented, and
eventually made reusable by other people.

The project begins with QA/API tooling because that domain allows us to
focus on learning MCP while working with familiar testing concepts.

Over time, the repository may contain multiple MCP servers for different
purposes.

------------------------------------------------------------------------

## 2. Real Objective

The objective is **not** simply to add "MCP" to a résumé.

The objective is to reach the point where the developer can confidently
explain and demonstrate:

-   What MCP is.
-   What problem an MCP server solves.
-   How an MCP client communicates with a server.
-   How tools are registered and discovered.
-   How tool input and output schemas work.
-   How validation is handled.
-   How errors are represented and propagated.
-   How transports work.
-   How MCP-specific code is separated from application logic.
-   How MCP tools are tested.
-   How a server is debugged.
-   How external systems are integrated safely.
-   How architectural decisions were made.
-   How to design another MCP server without depending on a tutorial.

The intended progression is:

``` mermaid
flowchart LR
    A["I followed<br/>an MCP tutorial"]
    B["I built<br/>an MCP"]
    C["I understand<br/>how it works"]
    D["I can design<br/>MCP tools"]
    E["I can test &<br/>debug them"]
    F["I can explain<br/>the architecture"]
    G["I can build<br/>another one"]

    A --> B --> C --> D --> E --> F --> G
```

The project becomes meaningful portfolio experience when the final
stages are reached---not merely when code exists in GitHub.

------------------------------------------------------------------------

## 3. Development Philosophy

MCPS 4 All serves four purposes.

### 3.1 Learning

Understand MCP rather than blindly copying SDK examples.

Conceptually:

``` text
Client
  ↓
Protocol
  ↓
Server
  ↓
Tool / Resource / Prompt
  ↓
External system
  ↓
Structured response
  ↓
Client
```

Every important part should eventually be explainable in plain language.

### 3.2 Experimentation

Small experiments are encouraged.

Some experiments will become permanent features.

Others may exist only to answer questions such as:

-   Does this design make sense?
-   Is this abstraction useful?
-   What happens when the tool fails?
-   How should the schema be structured?
-   Is MCP actually the right interface for this operation?

Failed experiments are useful if the reason for failure is understood.

### 3.3 Real-world tooling

Useful experiments should progressively become reliable tools:

``` text
experiment
    ↓
working prototype
    ↓
tests
    ↓
error handling
    ↓
documentation
    ↓
CI
    ↓
reusable MCP
```

### 3.4 Portfolio

The repository should eventually be something another engineer or
recruiter can inspect and run.

A user should ultimately be able to do something conceptually similar
to:

``` bash
git clone <repository>
cd mcps-4-all
npm install
npm test
npm run build
```

The repository should demonstrate actual engineering decisions rather
than only contain generated sample code.

------------------------------------------------------------------------

## 4. Main Stack

The guiding principle is to keep the surrounding technology familiar so
the primary learning challenge is MCP itself.

  -----------------------------------------------------------------------
  Area                    Technology              Reason
  ----------------------- ----------------------- -----------------------
  Language                TypeScript              Familiar language and
                                                  strong typing

  Runtime                 Node.js                 Natural TypeScript
                                                  ecosystem

  MCP                     Official Model Context  Direct implementation
                          Protocol TypeScript SDK of MCP

  Schema validation       Zod                     Explicit runtime
                                                  schemas with TypeScript
                                                  integration

  Package manager         npm                     Simple and widely
                                                  supported

  Unit testing            Vitest                  Lightweight
                                                  TypeScript-friendly
                                                  testing

  HTTP                    Native Fetch API        Avoid unnecessary
                                                  dependencies initially

  E2E / Browser           Playwright              Planned integration and
  automation                                      existing expertise

  Databases               PostgreSQL / SQL Server Planned data-validation
                                                  integrations

  Configuration           Environment variables / Configuration and
                          `.env`                  secrets

  Linting                 ESLint                  Static quality controls

  Formatting              Prettier                Consistent formatting

  CI/CD                   GitHub Actions          Automated build, lint,
                                                  and tests

  Containers              Docker                  Planned when
                                                  distribution benefits
                                                  from it

  Distribution            GitHub → potentially    Source first,
                          npm                     simplified installation
                                                  later
  -----------------------------------------------------------------------

### Stack rule

Do not add technology for résumé keywords or README decoration.

If Docker, PostgreSQL, Playwright, a cloud platform, or any other
technology appears as part of the implemented stack, the repository must
actually use it.

------------------------------------------------------------------------

## 5. High-Level Architecture

The long-term concept is a collection of focused servers.

``` mermaid
flowchart TD
    A["MCP Clients / AI Agents"]

    A --> B["MCPS 4 All"]

    B --> C["QA / API MCP"]
    B --> D["Database MCP"]
    B --> E["Playwright MCP"]
    B --> F["Future MCPs"]

    C --> G["REST APIs"]
    D --> H["PostgreSQL"]
    D --> I["SQL Server"]
    E --> J["Web Applications"]

    F --> K["Whatever useful stuff we build next"]
```

The exact repository structure does not need to reflect this
architecture immediately.

We should **not build a monorepo architecture before multiple servers
actually exist**.

------------------------------------------------------------------------

## 6. First Implementation: QA / API MCP

The first server focuses on API testing and validation.

This domain was selected because it is familiar enough that development
effort can focus on MCP fundamentals rather than simultaneously learning
a new business domain.

### Initial architecture

``` mermaid
flowchart LR
    A["MCP Client"]

    A -->|"Tool call"| B["MCPS 4 All<br/>QA/API Server"]

    B --> C["Tool Registry"]

    C --> D["health_check"]
    C --> E["api_request"]
    C --> F["validate_status_code"]
    C --> G["validate_json_property"]

    E --> H["HTTP Service"]
    F --> I["Validation Service"]
    G --> I

    H --> J["REST API"]

    J --> H
    H --> B
    I --> B

    B -->|"Structured MCP response"| A
```

### Intended separation

Preferred:

``` text
MCP Tool
   ↓
Service
   ↓
External System
```

Avoid:

``` text
MCP Tool
   ↓
Hundreds of lines of protocol + validation + business logic + HTTP code
```

MCP registration should remain thin enough that services can be tested
independently.

------------------------------------------------------------------------

## 7. v0.1.0 Scope

The first version must be deliberately small.

### Core

-   TypeScript MCP server.
-   stdio transport.
-   Zod validation.
-   Basic error handling.
-   Real execution from an MCP client.

### Initial tools

#### `health_check`

Purpose: confirm that the MCP server is running and capable of
responding.

#### `api_request`

Purpose: execute a controlled HTTP request and return structured
information useful for testing.

The exact supported methods, headers, body handling, security
restrictions, timeouts, and response limits must be designed during
implementation rather than assumed prematurely.

#### `validate_status_code`

Purpose: compare an actual HTTP status code against an expected value
and return a structured validation result.

#### `validate_json_property`

Purpose: validate an expected property/value in JSON data.

The first implementation should remain intentionally simple. More
sophisticated JSON-path, schema, contract, and multi-assertion behavior
belongs in later iterations.

### Engineering requirements

-   Unit tests.
-   MCP tool tests.
-   ESLint.
-   Prettier.
-   Installation instructions.
-   Usage examples.
-   Real MCP client verification.

### v0.1.0 completion rule

Passing `npm test` alone is not enough.

The server must be connected to and successfully exercised through a
real MCP client.

------------------------------------------------------------------------

## 8. Initial Roadmap

``` mermaid
flowchart LR
    A["v0.1<br/>MCP Fundamentals<br/>API Tools"]
    B["v0.2<br/>API Validation"]
    C["v0.3<br/>Playwright"]
    D["v0.4<br/>Database"]
    E["v0.5<br/>Test Generation"]
    F["v0.6<br/>Reporting &<br/>Failure Analysis"]
    G["v1.0<br/>Stable Toolkit"]

    A --> B --> C --> D --> E --> F --> G
```

The version numbers are a working direction, not a contract.

  Phase   Main learning target
  ------- ------------------------------------------------
  v0.1    MCP fundamentals
  v0.2    Tool design and schemas
  v0.3    MCP + browser automation
  v0.4    MCP + external data systems
  v0.5    AI-assisted testing
  v0.6    Observability, reporting, and failure analysis
  v1.0    Distribution and stability

Priorities may change as actual implementation exposes better ideas.

------------------------------------------------------------------------

## 9. Initial Repository Structure

Start simple:

``` text
mcps-4-all/
│
├── src/
│   ├── index.ts
│   ├── server.ts
│   │
│   ├── tools/
│   │   ├── health/
│   │   └── api/
│   │
│   ├── services/
│   │   ├── http/
│   │   └── validation/
│   │
│   ├── schemas/
│   └── utils/
│
├── tests/
│
├── docs/
├── examples/
│
├── .github/
│   └── workflows/
│
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
├── Contexto.MD
├── package.json
├── tsconfig.json
├── eslint.config.js
├── prettier.config.js
└── vitest.config.ts
```

If multiple independent MCPs eventually justify it, the project may
evolve toward:

``` text
mcps-4-all/
│
├── servers/
│   ├── qa-api/
│   ├── database/
│   ├── playwright/
│   └── ...
│
├── packages/
│   └── shared/
│
├── docs/
├── examples/
└── ...
```

Do not create this complexity until it solves a real problem.

------------------------------------------------------------------------

## 10. Engineering Rules

### 10.1 TypeScript strict mode

Strict typing is part of the learning and quality strategy.

Avoid using `any` merely to bypass compiler errors.

### 10.2 Explicit tool contracts

Every tool should have clearly defined:

``` text
name
description
input schema
output
errors
```

A tool's description and schema are part of its interface and deserve
the same care as an API contract.

### 10.3 Small, focused tools

Prefer focused operations such as:

``` text
validate_status_code
```

over ambiguous mega-tools such as:

``` text
do_everything_with_this_api_and_figure_it_out
```

### 10.4 Separate protocol from domain logic

MCP-specific registration and transport code should not contain all
application behavior.

Business logic belongs in services/modules that can be tested without an
MCP client.

### 10.5 Tests early

100% coverage is not a requirement.

Useful regression protection is.

Tests should make it difficult to accidentally break existing behavior
without noticing.

### 10.6 Avoid premature abstraction

Do not build infrastructure for hypothetical future requirements.

Refactor when duplication, complexity, or a real new use case
demonstrates the need.

### 10.7 Honest technology claims

Never claim the project uses a technology merely because it appears in
the roadmap.

README topics, résumé descriptions, and project summaries should reflect
actual implemented functionality.

------------------------------------------------------------------------

## 11. Definition of Done

``` mermaid
flowchart TD
    A["Idea"] --> B["Implementation"]
    B --> C["Works locally"]
    C --> D["Tests"]
    D --> E["Documentation"]
    E --> F["Real MCP client test"]
    F --> G["Code review"]
    G --> H["Merge"]
    H --> I["Done"]
```

A feature is considered done when:

1.  Its intended behavior is implemented.
2.  It works locally.
3.  Appropriate tests exist and pass.
4.  User/developer-facing behavior is documented where necessary.
5.  It works through a real MCP client when MCP behavior is involved.
6.  The implementation has been reviewed for obvious design, security,
    maintainability, and correctness problems.
7.  It is merged into the main development line.

------------------------------------------------------------------------

## 12. GitHub Metadata

### Suggested topics at project start

``` text
mcp
model-context-protocol
mcp-server
typescript
nodejs
ai-tools
developer-tools
open-source
```

### Add when QA/API functionality exists

``` text
software-testing
qa-automation
api-testing
sdet
```

### Add when Playwright integration actually exists

``` text
playwright
test-automation
```

### License

Intended license: **MIT**.

The license should be added explicitly to the repository before treating
the project as a published open-source project.

------------------------------------------------------------------------

## 13. Future Ideas

These are possibilities, not commitments.

### API / QA

-   Richer HTTP requests.
-   Headers and authentication strategies.
-   JSON-path validation.
-   JSON Schema validation.
-   OpenAPI-aware validation.
-   Response-time assertions.
-   API chaining.
-   Test collections.
-   Reusable environments.
-   Better failure output.

### Playwright

-   Execute predefined Playwright tests.
-   Run suites by tag/project.
-   Return structured test results.
-   Capture useful failure artifacts.
-   Inspect failed tests.
-   Controlled browser operations where MCP is actually beneficial.

### Database

-   Read-only database queries.
-   PostgreSQL adapter.
-   SQL Server adapter.
-   Source/target comparison.
-   Data-quality validation.
-   API-to-database validation.
-   Query result comparison.

Database tooling must be designed with strong safety boundaries before
arbitrary query execution is considered.

### Test generation

-   Generate candidate test cases from requirements.
-   Generate test data.
-   Suggest edge cases.
-   Translate API contracts into candidate validations.

Generated testing content should remain reviewable; AI-generated tests
are not automatically considered correct.

### Reporting and failure analysis

-   Summarize failed executions.
-   Normalize errors.
-   Compare current and previous results.
-   Produce machine-readable and human-readable reports.
-   Analyze logs/artifacts when available.

### Distribution

Potential future options:

-   npm package.
-   `npx` execution.
-   Docker image.
-   Example client configurations.
-   Release automation.

Distribution work should come after the server provides enough value to
justify easier installation.

------------------------------------------------------------------------

## 14. Security Considerations

Security should be considered as capabilities are added, especially
because MCP tools can trigger external actions.

Areas requiring explicit design include:

-   URL restrictions and SSRF considerations for HTTP tools.
-   Authentication and secret handling.
-   Request and response size limits.
-   Timeouts.
-   Logging without leaking credentials.
-   Database permissions.
-   Read-only versus write operations.
-   File-system access.
-   Browser automation boundaries.
-   Command execution.
-   Tool descriptions that accurately communicate side effects.
-   Validation of all externally supplied inputs.

The first version should avoid broad or dangerous capabilities merely
for convenience.

------------------------------------------------------------------------

## 15. Learning Workflow

The preferred workflow is collaborative rather than "generate the entire
project and copy it."

A healthy development loop is:

``` mermaid
flowchart TD
    A["Choose one small capability"]
    B["Understand the MCP concept"]
    C["Design the tool contract"]
    D["Implement it"]
    E["Run it"]
    F["Break / test it"]
    G["Review the code"]
    H["Refactor if justified"]
    I["Document what matters"]
    J["Commit"]

    A --> B --> C --> D --> E --> F --> G --> H --> I --> J
    J --> A
```

The developer should remain able to explain code that enters the
repository.

AI assistance can be used for:

-   Explaining MCP concepts.
-   Researching documentation.
-   Architecture discussion.
-   Code review.
-   Debugging.
-   Test design.
-   Refactoring suggestions.
-   Comparing implementation alternatives.
-   Documentation.
-   Getting unstuck.

The goal is not to avoid AI-generated code entirely. The goal is to
avoid having a repository whose owner cannot explain, debug, or extend
the code.

------------------------------------------------------------------------

## 16. Portfolio Success Criteria

The project becomes strong portfolio evidence when the developer can:

-   Clone and set it up from scratch.
-   Explain the architecture without reading a prepared script.
-   Add a new tool independently.
-   Explain the input/output schema.
-   Trace a tool call through the system.
-   Debug a failed tool call.
-   Write or modify tests.
-   Explain why the selected transport is used.
-   Explain why services are separated from MCP registration.
-   Discuss security implications.
-   Describe tradeoffs and rejected approaches.
-   Demonstrate the MCP from a real client.
-   Build a second MCP using the concepts learned from the first.

At that point, a résumé statement such as the following is supportable:

> **Hands-on experience designing and developing MCP servers with
> TypeScript.**

The repository itself should provide evidence behind that statement.

------------------------------------------------------------------------

## 17. Current Project State

**Current phase:** planning / repository initialization.

### Decisions already made

-   Project name: **MCPS 4 All**.
-   Repository: `mcps-4-all`.
-   Tagline: **Learn it. Build it. Break it. Improve it. Share it.**
-   Language: TypeScript.
-   Runtime: Node.js.
-   Initial domain: QA/API.
-   Initial transport: stdio.
-   Initial testing framework: Vitest.
-   Initial API client approach: native Fetch API.
-   Planned CI/CD: GitHub Actions.
-   Initial four tools:
    -   `health_check`
    -   `api_request`
    -   `validate_status_code`
    -   `validate_json_property`
-   Project should remain simple until real complexity justifies
    restructuring.
-   The repository should be honest about what is implemented versus
    planned.
-   Real MCP client execution is part of Definition of Done.

### Immediate next milestone

Create the repository foundation and implement the smallest possible
working MCP server, then connect it to a real MCP client before
expanding the toolset.

------------------------------------------------------------------------

## 18. Context Maintenance Rule

This file should evolve with the project.

Update `Contexto.MD` when we make decisions that materially change:

-   Architecture.
-   Stack.
-   Scope.
-   Roadmap.
-   Tool contracts.
-   Repository organization.
-   Security rules.
-   Definition of Done.
-   Learning objectives.
-   Distribution strategy.
-   Major rejected approaches and the reasons they were rejected.

Do not turn this file into a commit log. Git already does that.

Its purpose is to preserve **why the project looks the way it does and
where it is intended to go**.
