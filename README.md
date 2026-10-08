# MCPS 4 All

> **Learn it. Build it. Break it. Improve it. Share it.**

**MCPS 4 All** is an open-source collection of practical Model Context
Protocol (MCP) servers built for learning, experimentation, automation,
and real-world use.

The project starts small on purpose: understand MCP fundamentals, build
useful tools, test them through real MCP clients, and improve the
architecture as the project grows.

## Why MCPS 4 All?

The goal is not to build a giant server that does everything. MCPS 4 All
is intended to become a collection of focused MCP servers that can be
understood, tested, reused, and extended independently.

The first implementation focuses on **QA and API testing**, a domain
where we can concentrate on learning MCP itself while building something
practical.

## Main Stack

  Area                       Technology
  -------------------------- ------------------------------------------------
  Language                   TypeScript
  Runtime                    Node.js
  MCP                        Official Model Context Protocol TypeScript SDK
  Schema validation          Zod
  Package manager            npm
  Unit testing               Vitest
  HTTP                       Native Fetch API
  E2E / Browser automation   Playwright *(planned)*
  Databases                  PostgreSQL / SQL Server *(planned)*
  Configuration              Environment variables / `.env`
  Linting                    ESLint
  Formatting                 Prettier
  CI/CD                      GitHub Actions
  Containers                 Docker *(planned)*
  Distribution               GitHub, with npm distribution considered later

**Project rule:** technologies are added when they are actually used,
not just to make the stack look bigger.

## Project Architecture

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

The repository may evolve into multiple independent servers as the
project grows. We will avoid premature abstractions and restructure only
when there is a real need.

## First MCP: QA / API

The first server will expose small, focused tools for API testing and
validation.

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

## v0.1.0 Scope

The first milestone is intentionally small.

### MCP capabilities

-   MCP server written in TypeScript
-   stdio transport
-   Zod schemas
-   Basic error handling
-   Real MCP client execution

### Initial tools

-   `health_check`
-   `api_request`
-   `validate_status_code`
-   `validate_json_property`

### Engineering

-   Unit tests
-   MCP tool tests
-   ESLint
-   Prettier
-   Installation documentation
-   Usage examples

A feature is not considered complete simply because it works locally.
The milestone must be usable through a real MCP client.

## Initial Roadmap

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

The roadmap is directional, not a contract. Versions and priorities may
change as we learn.

## Engineering Principles

-   Keep MCP tools small and focused.
-   Use TypeScript strict mode.
-   Define explicit schemas for tool inputs and outputs.
-   Separate MCP protocol handling from business logic.
-   Avoid unnecessary dependencies.
-   Add tests early.
-   Prefer working software over premature architecture.
-   Document decisions that future contributors need to understand.
-   Never advertise a technology as part of the project until it is
    actually implemented.

## Definition of Done

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

## Repository Structure

The initial repository should stay intentionally simple:

``` text
mcps-4-all/
│
├── src/
│   ├── index.ts
│   ├── server.ts
│   ├── tools/
│   │   ├── health/
│   │   └── api/
│   ├── services/
│   │   ├── http/
│   │   └── validation/
│   ├── schemas/
│   └── utils/
│
├── tests/
├── docs/
├── examples/
├── .github/
│   └── workflows/
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
├── package.json
├── tsconfig.json
├── eslint.config.js
├── prettier.config.js
└── vitest.config.ts
```

If multiple independent MCP servers justify it later, the repository can
evolve toward a monorepo-style structure.

## Status

🚧 **Early development / learning project**

The initial QA/API MCP is the first planned implementation.

## License

MIT is the intended license for MCPS 4 All.
