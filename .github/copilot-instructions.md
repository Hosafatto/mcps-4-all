# MCPS 4 All --- GitHub Copilot Instructions

These instructions define how GitHub Copilot should assist with
development in the **MCPS 4 All** repository.

The goal is not only to produce working code. This repository is also a
hands-on learning project for understanding, designing, testing,
debugging, and explaining Model Context Protocol (MCP) servers.

------------------------------------------------------------------------

## 1. Read Project Context First

Before making a significant change, read `Contexto.MD`.

Treat it as the project's source of truth for:

-   Project purpose and philosophy
-   Current architecture
-   Technology stack
-   Current scope
-   Roadmap
-   MCP tool contracts
-   Repository organization
-   Engineering rules
-   Security considerations
-   Definition of Done
-   Learning objectives
-   Current project state
-   Major architectural decisions

Do not assume planned functionality already exists.

When repository code and `Contexto.MD` appear inconsistent, inspect the
implementation before proceeding and explicitly identify the
inconsistency rather than silently choosing one version.

------------------------------------------------------------------------

## 2. Learning Comes Before Blind Generation

MCPS 4 All is a learning project.

Do not default to generating large amounts of implementation code
without explaining important new concepts or decisions.

When implementing something that introduces a new MCP or engineering
concept:

1.  Briefly explain what is being introduced.
2.  Explain why it is needed here.
3.  Identify the files that need to change.
4.  Prefer small, understandable implementation steps.
5.  Explain important design decisions and tradeoffs.
6.  After implementation, explain how the developer can verify that it
    works.

Avoid unnecessary tutorial-level explanations for concepts already
established in the repository.

The developer should remain able to explain, debug, modify, and extend
code added with Copilot assistance.

------------------------------------------------------------------------

## 3. Do Not Overengineer

Prefer the simplest design that satisfies the current requirement.

Do not introduce:

-   speculative abstractions
-   unnecessary frameworks
-   unused dependencies
-   premature monorepo infrastructure
-   generic factories without a demonstrated need
-   unnecessary wrapper layers
-   technologies that exist only to make the stack look larger

Refactor when actual duplication, complexity, or new requirements
justify it.

Do not design infrastructure for hypothetical future features unless
explicitly requested.

------------------------------------------------------------------------

## 4. Technology Rules

The current primary stack is:

-   TypeScript
-   Node.js
-   Official Model Context Protocol TypeScript SDK
-   Zod
-   npm
-   Vitest
-   Native Fetch API
-   ESLint
-   Prettier
-   GitHub Actions

Planned technologies such as Playwright, PostgreSQL, SQL Server, and
Docker must not be treated as implemented until they actually exist in
the repository.

Before adding a new production dependency:

1.  Determine whether the existing platform or dependencies already
    solve the problem.
2.  Explain why the new dependency is justified.
3.  Avoid adding packages for trivial functionality.

------------------------------------------------------------------------

## 5. TypeScript Rules

Use TypeScript strict mode.

Prefer:

-   explicit domain types
-   inferred local types when obvious
-   narrow types
-   typed errors/results where useful
-   schema-derived types when appropriate

Avoid:

-   `any` used merely to bypass compiler errors
-   unsafe type assertions without justification
-   unnecessary non-null assertions
-   broad object types when a precise contract is known
-   duplicated types that can safely derive from an existing schema

If an unsafe operation is genuinely required, make the reason clear.

------------------------------------------------------------------------

## 6. MCP Tool Design

MCP tools should be small, explicit, and focused.

Every tool should have a clear contract covering:

-   name
-   purpose
-   description
-   input schema
-   output structure
-   expected errors
-   side effects, if any

Prefer focused tools such as:

`validate_status_code`

over ambiguous tools such as:

`do_everything_with_this_api_and_figure_it_out`

Tool descriptions are part of the interface presented to MCP clients and
should be written carefully.

Do not expose dangerous or excessively broad capabilities merely because
they are technically possible.

------------------------------------------------------------------------

## 7. Separate MCP Code From Application Logic

Prefer:

``` text
MCP Tool
   ↓
Service
   ↓
External System
```

MCP registration and transport code should remain thin.

Do not place protocol handling, validation, HTTP logic, domain logic,
formatting, and error handling into one large tool function.

Business logic should be testable independently from an MCP client
whenever practical.

------------------------------------------------------------------------

## 8. Schema and Validation Rules

Validate externally supplied input.

Use Zod schemas where appropriate for MCP tool contracts and runtime
validation.

Schemas should:

-   communicate intent clearly
-   reject invalid input early
-   avoid unnecessarily broad fields
-   provide useful descriptions when exposed through MCP
-   remain synchronized with TypeScript types

Do not silently accept malformed input when the contract can validate it
explicitly.

------------------------------------------------------------------------

## 9. Error Handling

Errors should be useful to both developers and MCP clients.

When designing errors:

-   distinguish validation failures from execution failures
-   preserve useful debugging context
-   avoid leaking credentials or secrets
-   avoid exposing unnecessary internal implementation details
-   prefer structured error information where appropriate
-   provide actionable messages

Do not swallow exceptions without a documented reason.

------------------------------------------------------------------------

## 10. Security Rules

Consider security before expanding MCP capabilities.

Pay particular attention to:

-   SSRF risks in HTTP tools
-   URL validation and restrictions
-   authentication credentials
-   environment variables and secrets
-   request timeouts
-   response-size limits
-   sensitive logging
-   database permissions
-   read-only versus write access
-   filesystem access
-   browser automation boundaries
-   shell or command execution
-   externally supplied paths
-   tool side effects

Never commit secrets, tokens, passwords, private keys, or real
credentials.

Use `.env.example` only for safe placeholder configuration.

When a requested feature introduces meaningful security risk, identify
the risk before or while implementing it and prefer a safer design.

------------------------------------------------------------------------

## 11. Testing Rules

Add or update tests when behavior changes.

Tests should prioritize meaningful regression protection over artificial
coverage percentages.

Where appropriate, test:

-   normal behavior
-   invalid inputs
-   expected failures
-   edge cases
-   service behavior independently from MCP registration
-   MCP tool behavior at the protocol boundary

A passing test suite alone does not prove an MCP feature is complete.

MCP functionality must also be exercised through a real MCP client when
required by the project's Definition of Done.

------------------------------------------------------------------------

## 12. Definition of Done

Use this flow as the default completion model:

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

Do not describe MCP functionality as complete if it has never been
exercised through a real MCP client when such verification is
applicable.

------------------------------------------------------------------------

## 13. Context Maintenance Rule

After completing a task, determine whether the work introduced, removed,
or changed a significant project decision.

Update `Contexto.MD` when work materially changes:

-   Architecture
-   Technology stack
-   Project scope
-   Roadmap
-   MCP tool contracts
-   Repository organization
-   Security rules
-   Definition of Done
-   Learning objectives
-   Distribution strategy
-   Major architectural decisions
-   Major rejected approaches and why they were rejected
-   Current project state

Do **not** update `Contexto.MD` merely for:

-   formatting changes
-   typo fixes
-   trivial refactors
-   routine bug fixes that do not change behavior or direction
-   dependency patch updates with no architectural impact
-   implementation details that do not affect project direction

When a context update is required:

1.  Update the relevant existing section whenever possible.
2.  Avoid duplicating information.
3.  Update **Current Project State** when project progress materially
    changed.
4.  Keep implemented functionality clearly separated from planned
    functionality.
5.  Remove or revise information that is no longer true.
6.  Preserve the reasoning behind important decisions.
7.  Do not turn `Contexto.MD` into a chronological changelog.

Git history is the changelog.

`Contexto.MD` explains what the project is, why it is designed that way,
its current state, and where it is intended to go.

------------------------------------------------------------------------

## 14. README Maintenance Rule

Update `README.md` when a change affects information that repository
users need to know, including:

-   installation
-   prerequisites
-   configuration
-   available MCP servers
-   available MCP tools
-   usage
-   supported functionality
-   public architecture
-   commands
-   compatibility
-   important limitations

Do not advertise roadmap items as implemented features.

Keep the README useful to someone encountering the repository for the
first time.

Internal reasoning and development history belong in `Contexto.MD`, Git
history, issues, or other development documentation rather than
cluttering the README.

------------------------------------------------------------------------

## 15. Documentation Honesty Rule

Documentation must describe the repository as it actually exists.

Never claim that MCPS 4 All supports a technology, integration,
transport, database, client, feature, or workflow solely because it
appears on the roadmap.

Clearly distinguish:

-   implemented
-   experimental
-   planned
-   deprecated

Portfolio value comes from demonstrable functionality, not keyword
volume.

------------------------------------------------------------------------

## 16. Repository Changes

Before creating new directories or reorganizing the repository:

1.  Check the structure documented in `Contexto.MD`.
2.  Determine whether the change solves a current problem.
3.  Avoid restructuring solely for aesthetic reasons.
4.  Update `Contexto.MD` when the organization materially changes.

Prefer incremental evolution over large speculative reorganizations.

------------------------------------------------------------------------

## 17. Code Review Behavior

When asked to review code, do not automatically rewrite everything.

First identify:

-   correctness issues
-   MCP protocol issues
-   type-safety problems
-   security concerns
-   test gaps
-   unnecessary complexity
-   maintainability concerns
-   documentation inconsistencies

Distinguish between:

-   must fix
-   should improve
-   optional improvement

Explain why a change matters.

Do not recommend patterns merely because they are fashionable.

------------------------------------------------------------------------

## 18. When a Requested Change Conflicts With Existing Context

Do not blindly reject the request and do not silently ignore
`Contexto.MD`.

If the developer intentionally requests a new direction:

1.  Treat the request as the new decision.
2.  Implement the change.
3.  Update affected documentation.
4.  Update `Contexto.MD`.
5.  Remove or revise obsolete assumptions.

If intent is ambiguous and the change would materially alter
architecture, security, or scope, ask before making the architectural
change.

------------------------------------------------------------------------

## 19. Current Initial Scope

The initial MCPS 4 All implementation focuses on a QA/API MCP server.

The planned initial tools are:

-   `health_check`
-   `api_request`
-   `validate_status_code`
-   `validate_json_property`

Initial transport:

-   stdio

Initial objective:

Build the smallest useful MCP server, understand how it works, connect
it to a real MCP client, test it, and only then expand its capabilities.

Do not implement the entire roadmap at once unless explicitly requested.

------------------------------------------------------------------------

## 20. Preferred Development Loop

For meaningful new capabilities, prefer this workflow:

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

Keep changes small enough to understand and review.

------------------------------------------------------------------------

## 21. Final Principle

The desired outcome is not:

``` text
Prompt
  ↓
Large generated implementation
  ↓
Copy
  ↓
Commit
```

The desired outcome is:

``` text
Understand
  ↓
Design
  ↓
Implement
  ↓
Test
  ↓
Break
  ↓
Debug
  ↓
Improve
  ↓
Explain
  ↓
Share
```

Copilot is a development assistant for MCPS 4 All, not a substitute for
understanding the project.
