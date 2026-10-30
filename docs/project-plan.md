# Scope and lab evidence

## Requirements

Planned roles: customer and administrator. Six modules: accounts, catalogue, cart, checkout, orders, inventory administration. Initial payment method: cash on delivery.

| Story | Acceptance criterion | Status |
| --- | --- | --- |
| Browse and search products | Search and category filters show matching products | Neon-backed catalogue implemented |
| Manage my bag | Add, increase, decrease, and remove lines without exceeding stock | In-memory implemented |
| Sign in | Customer identity is verified; admin access is enforced on the server | Planned |
| Place an order | Server recalculates prices and atomically saves the order and reduces stock | Planned |
| View my orders | A customer can see only their own order history | Planned |
| Manage inventory | Only administrators can change products and stock | Planned |

Non-functional goals: responsive layout at mobile and desktop widths; keyboard-accessible controls; secrets kept server-side; server-side validation and role checks; atomic stock updates; reproducible setup; automated tests for business rules.

## Process

Use incremental delivery. Increment 1: scaffold, Neon-backed catalogue, preview cart, Prisma setup, Lucide icons. Increment 2: authentication and persistent carts. Increment 3: checkout, order history, administration. Increment 4: tests, patterns, diagrams, report, demo.

Implement one complete purchase flow before adding optional features. Avoid microservices, a separate backend application, a global state library, and generic repository hierarchies unless a concrete need appears.

## Design pattern plan (not implemented yet)

Proposed patterns: discount Strategy (behavioral), payment Adapter (structural), and order Builder (creational). Validate the need for each while implementing checkout. Document the problem, class relationships, rejected alternative, and actual call sites. Draw the UML class diagram from the final code, not from this proposal.

## Evidence still required

- Requirements and wireframe screenshots; final architecture, database and class diagrams.
- More TDD examples and mocks isolating database/payment dependencies.
- Real database integration tests and Selenium purchase/access-control tests.
- Coverage summary with honest scope and limitations.
- GitHub PR reviews: accepted and revised/rejected examples; conflict-resolution note.
- New technique beyond prior sessional practice: OpenAPI is a candidate, subject to the student's syllabus history. It is not implemented yet.
- Dated learning log, actual resource evaluation, 500–700-word personal reflection, and AI-use disclosure.
- Working live demo and a rehearsed five-minute explanation.

The assignment heading says 10 marks while its marking table totals 20; clarify with the instructor.
