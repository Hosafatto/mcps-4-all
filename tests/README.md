
# Testing Guide

This directory contains the automated tests for **MCPS 4 All**.

The project uses **Vitest** to validate application logic, API behavior, input validation, and MCP protocol interactions.

Our goal is to maintain a reliable, deterministic, and maintainable test suite as the project evolves.

## 1. Testing Stack

| Technology | Purpose |
| --- | --- |
| Vitest | Test runner, assertions, and mocking |
| TypeScript | Type-safe test implementation |
| MCP SDK | MCP client/server integration testing |
| InMemoryTransport | Testing MCP communication without external processes |
| Native Fetch API | HTTP behavior and response handling |
| Zod | Runtime input validation |

Tests should remain independent of external services whenever possible.

## 2. Test Structure

Current test files:

```text
tests/
├── README.md
├── server.test.ts
├── api-request.test.ts
└── mcp-integration.test.ts
```

### Responsibilities

**server.test.ts**

Tests basic server-related behavior, including health-check results and timestamp generation.

**api-request.test.ts**

Tests the HTTP request functionality, including successful responses, HTTP errors, security restrictions, response parsing, and request failures.

**mcp-integration.test.ts**

Tests MCP protocol interactions using the official SDK Client and InMemoryTransport.

It verifies tool discovery, execution, validation, and error handling.

As the project grows, tests may be organized into subdirectories by feature or testing layer.

## 3. Running Tests

Install project dependencies:

```bash
npm ci
```

### Run all tests

```bash
npm test
```

Executes the test suite once and exits.

### Watch mode

```bash
npm run test:watch
```

Re-runs affected tests when files change.

### Run a specific test file

```bash
npx vitest run tests/api-request.test.ts
```

### Run tests matching a name

```bash
npx vitest run -t "should reject"
```

### Additional quality checks

```bash
npm run lint
npm run build
```

These commands validate linting rules and TypeScript compilation.

## 4. Testing Strategy

We follow a layered testing approach.

### Unit Tests

Validate individual functions or modules in isolation.

Examples:

- Successful HTTP response handling.
- HTTP 404 response handling.
- JSON and text response parsing.
- Request timeout behavior.
- Health-check result generation.

External dependencies should be mocked when appropriate.

### Integration Tests

Validate interactions between application components.

For MCP integration tests, use:

- MCP SDK Client.
- MCP server implementation.
- InMemoryTransport.

Examples:

- Discover registered tools using `tools/list`.
- Execute tools using `tools/call`.
- Verify Zod input validation.
- Verify MCP error responses.

Integration tests should validate the public MCP behavior rather than relying exclusively on internal implementation details.

### Manual Testing

Use MCP Inspector to verify real client/server communication over stdio.

Manual verification complements automated testing but does not replace it.

## 5. Naming Conventions

### Test Files

Use the following convention:

```text
<feature-name>.test.ts
```

Examples:

```text
health.test.ts
api-request.test.ts
mcp-integration.test.ts
```

Use descriptive, lowercase, kebab-case filenames.

### Test Suites

Use `describe()` to group related scenarios.

### Test Cases

Use `it()` or `test()` with descriptive names.

Recommended pattern:

```text
should <expected behavior> when <condition>
```

Example:

```typescript
import { describe, expect, it } from 'vitest';

describe('Health Check', () => {
  it('should return an OK status', () => {
    const result = { status: 'ok' };

    expect(result.status).toBe('ok');
  });
});
```

Avoid vague test names such as:

```text
test 1
works correctly
check API
```

## 6. Test Design Principles

### Arrange, Act, Assert (AAA)

Organize test cases into three logical steps:

1. Arrange: Prepare inputs, mocks, and expected values.
2. Act: Execute the functionality being tested.
3. Assert: Verify the actual result.

Example:

```typescript
import { describe, expect, it } from 'vitest';

describe('HTTP Status Validation', () => {
  it('should identify a successful HTTP response', () => {
    // Arrange
    const response = { status: 200, ok: true };

    // Act
    const isSuccessful = response.ok;

    // Assert
    expect(isSuccessful).toBe(true);
  });
});
```

This is an illustrative example, not a test of the production HTTP implementation.

### Test Independence

Each test must:

- Run independently.
- Avoid depending on execution order.
- Avoid shared mutable state.
- Clean up mocks and resources.
- Produce consistent results.

### Deterministic Execution

Automated tests should not depend on:

- Uncontrolled public APIs.
- Unstable network connections.
- Real-time delays without controlled clocks.
- Random values without controlled inputs.
- External service availability.

Use mocks and fixtures when appropriate.

## 7. Mocking Guidelines

Vitest provides utilities such as:

- `vi.fn()`
- `vi.spyOn()`
- `vi.stubGlobal()`
- `vi.restoreAllMocks()`
- `vi.unstubAllGlobals()`

Use mocking to isolate external dependencies.

Example:

```typescript
import { afterEach, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it('should mock an HTTP response', async () => {
  const mockFetch = vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  );

  vi.stubGlobal('fetch', mockFetch);

  const response = await fetch('https://example.com');
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body).toEqual({ success: true });
  expect(mockFetch).toHaveBeenCalledOnce();
});
```

Mocks must be restored after execution to prevent test contamination.

This example demonstrates mocking mechanics; production tests should call the application code under test.

## 8. API Testing Guidelines

API-related tests should cover positive, negative, and boundary scenarios.

### Positive Scenarios

- Successful HTTP GET requests.
- Valid JSON responses.
- Valid text responses.
- Correct response metadata.

### Negative Scenarios

- HTTP error responses.
- Invalid URLs.
- Disallowed hosts.
- Unsupported protocols.
- Request execution failures.
- Timeout and abort behavior.

### Boundary Scenarios

- Minimum allowed timeout.
- Maximum allowed timeout.
- Values outside accepted ranges.
- Missing optional parameters.
- Invalid input types.

The current `api_request` implementation restricts requests to HTTPS and an explicitly allowed hostname.

Tests must verify these restrictions rather than bypass them.

## 9. MCP Integration Testing

MCP integration tests should verify communication through the protocol.

Recommended scenarios:

| Scenario | Expected Behavior |
| --- | --- |
| List tools | Registered tools are discoverable |
| Call health_check | Returns a valid health result |
| Call api_request | Returns the expected response |
| Invalid input | Zod rejects invalid arguments |
| Disallowed hostname | Tool reports an error |
| HTTP failure | Failure is handled consistently |

Use `InMemoryTransport` for automated integration tests.

This allows the MCP client and server to communicate without starting external processes.

Ensure client and server resources are properly closed after each test.

## 10. Adding New Tests

When implementing a new feature:

1. Identify expected behavior and acceptance criteria.
2. Define positive, negative, and boundary scenarios.
3. Choose the appropriate testing layer.
4. Create or extend the relevant `.test.ts` file.
5. Mock external dependencies when appropriate.
6. Execute the relevant tests.
7. Run the complete test suite.
8. Run linting and TypeScript compilation.
9. Update documentation when behavior changes.

New tests should validate observable behavior rather than implementation details whenever possible.

## 11. Definition of Done

A feature is considered test-ready when:

- [ ] Acceptance criteria are understood.
- [ ] Positive scenarios are covered.
- [ ] Relevant negative scenarios are covered.
- [ ] Boundary conditions are considered.
- [ ] Tests are independent and deterministic.
- [ ] External dependencies are appropriately mocked.
- [ ] MCP integration behavior is tested when applicable.
- [ ] All existing tests pass.
- [ ] ESLint passes.
- [ ] TypeScript compilation passes.
- [ ] Documentation is updated.

Not every feature requires every testing layer. Test coverage should reflect functionality, risk, and complexity.

## 12. Test Quality Guidelines

Prefer:

- Small, focused tests.
- Clear assertions.
- Descriptive test names.
- Reusable fixtures when useful.
- Explicit error validation.
- Stable and deterministic execution.

Avoid:

- Unnecessary mocks.
- Hardcoded execution delays.
- Tests dependent on other tests.
- Assertions without meaningful verification.
- Testing private implementation details unnecessarily.
- Ignoring failing tests.
- Adding tests solely to increase coverage percentages.

A passing test suite is valuable only when its assertions meaningfully validate expected behavior.

## 13. Current Test Coverage

The root README documents the latest locally verified baseline:

| Test Area | Tests |
| --- | ---: |
| Health | 1 |
| HTTP/API | 6 |
| MCP Integration | 5 |
| **Total** | **12** |

These figures represent the documented baseline, not a continuously updated coverage report.

No minimum code-coverage percentage is currently enforced.

Future improvements may include coverage reporting and additional test layers.

## 14. Future Testing Improvements

Potential improvements include:

- Shared test fixtures.
- Parameterized tests.
- Automated coverage reporting.
- Additional security-focused scenarios.
- Expanded MCP integration tests.
- Playwright integration tests.
- Database integration tests.
- CI test reporting.

These are planned improvements, not existing capabilities.

## 15. Development Workflow

Before submitting changes, run:

```bash
npm test
npm run lint
npm run build
```

Follow the repository's branch and commit conventions.

Use meaningful commit messages and keep unrelated changes separate.

For additional project information, refer to:

- [Main README](../README.md)
- [Project Context](../Contexto.MD)
- [Copilot Instructions](../.github/copilot-instructions.md)

---

**Testing philosophy**

> Test behavior, not assumptions. Keep tests independent, meaningful, and maintainable.
