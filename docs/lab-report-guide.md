# CampusCart: lab-report and viva guide

This is a writing guide, not a completed report or a personal reflection to submit unchanged. It describes the project as implemented on 30 October 2026 and separates existing evidence from planned work. Recheck the status before submitting.

## 1. What the assignment is assessing

The lab asks for a non-trivial application developed through the SDLC, with at least five functional modules, persistent storage, three design patterns from at least two categories, TDD, mocks, coverage, Git evidence, and an independently learned tool or technique. Its rubric also explicitly names Selenium and CI.

CampusCart is relevant because shopping provides clear requirements, state changes, data relationships, validation rules, external dependencies, and opportunities for extension. A polished interface supports product quality, but it cannot replace testing, design, learning, and development evidence.

## 2. Current status: claims you can and cannot make

| Requirement | Existing evidence | Work still needed |
| --- | --- | --- |
| At least five functional modules | Catalogue and cart are functional | Accounts, checkout, customer orders, inventory administration |
| Persistent storage | Products, prices, stock and image paths stored in Neon through Prisma | Persistent carts and actual saved orders |
| Requirements and process | Initial plan in docs/project-plan.md; incremental implementation history | Final requirements, acceptance criteria, dated prototype evidence and traceability |
| Three patterns in two categories | Proposed in the plan | Implement justified patterns and draw the actual class diagram |
| Unit tests and coverage | Six cart tests; coverage reporting configured | Broader business-rule coverage and student-owned TDD examples |
| Mocks | Cart tests have no external dependencies | Mock an actual database/payment boundary in service tests |
| Selenium | Not implemented | Add automated browser scenarios and record results |
| CI | GitHub Actions runs lint, type checks, coverage and build | Include hosted results for the final submitted commit; add integration/browser jobs |
| Git workflow | Feature branches, focused commits, merge history, README | Actual PR reviews, an accepted and revised/rejected PR, conflict-resolution evidence |
| New tool or technique | Several tools used, but eligibility is unconfirmed | Select something new to your sessional experience, compare an alternative, demonstrate your own learning |
| Learning log and reflection | Blank learning-log template | Genuine dated entries, resource evaluation and personal 500–700-word reflection |

Neither a database table nor a header, toast or credits page should be counted as a complete business module. Having User and Order models does not mean login and checkout are implemented.

## 3. Suggested report structure

### Cover and project overview

Include course/lab title, project name, student details, submission date and repository URL. A suitable title is “CampusCart: Development of a Campus E-commerce Application Using an Incremental SDLC.”

State the problem: students need a simple way to browse campus essentials and manage purchases. Describe the current scope and planned final scope separately. Do not claim that real students were surveyed unless you actually conducted and recorded that research.

### Functional requirements and user stories

Use numbered requirements so tests and screenshots can refer to them.

| ID | Requirement | Acceptance example |
| --- | --- | --- |
| FR-01 | Browse the catalogue | Products retrieved from Neon display name, image, category and price |
| FR-02 | Search and filter products | Selecting Stationery excludes other categories; an unmatched query shows an empty state |
| FR-03 | Manage bag quantities | Adding a product twice produces one line with quantity two; decreasing to zero removes it |
| FR-04 | Receive operation feedback | Successful addition shows a toast naming the product; View bag opens the sidebar |
| FR-05 | Authenticate and authorize users (planned) | Customer identity is verified; only administrators can change inventory |
| FR-06 | Place orders (planned) | Server validates stock and prices and saves the order atomically |
| FR-07 | View order history (planned) | Customers can see only their own orders |
| FR-08 | Manage inventory (planned) | Administrators create products and update stock and prices |

Example story: “As a student, I want to change the quantity in my bag so that I can buy exactly the number of notebooks I need.” Connect the story to FR-03, the cart unit tests, and a bag screenshot.

### Non-functional requirements

Describe quality properties and how you verified them. Examples: responsive rendering at an explicitly tested mobile width; accessible labels and keyboard dismissal for the bag; server-only database access; integer money calculations; reproducible dependency installation; reusable UI components.

Use measured values only when you measured them. Do not invent a response-time target achievement, load-test result, accessibility audit score, or security certification. Client-side stock limits improve the interface; they are not sufficient protection for future checkout. That validation must run again on the server.

### Process model and prototype

Incremental development matches the actual history: scaffold; initial catalogue/cart; Neon integration; sidebar and icons; product photography and typography; shared header and notifications. Each increment delivered a reviewable improvement.

Explain why it fits: a smaller working version can be tested and refined before completing the full purchase flow. Do not describe daily stand-ups, sprint reviews, or stakeholder interviews that did not happen.

Include a wireframe or initial screenshot and the current interface. If the wireframe is created now, label it as a retrospective design illustration rather than presenting it as an earlier artifact. Explain why the bag became a sidebar, why the header is shared, and why toasts provide immediate feedback.

### Technology choices and architecture

| Choice | Role | Explanation and trade-off |
| --- | --- | --- |
| Next.js and TypeScript | Pages, server rendering and typed components | One application can render the interface and read the database; client/server boundaries need care |
| Prisma | Typed database queries and migrations | Easier query authoring and repeatable schema changes; generated code and migrations still need understanding |
| Neon PostgreSQL | Persistent relational storage | Appropriate for products, users and orders; depends on a network connection |
| Tailwind and shadcn/ui | Styling and reusable controls | Consistent components and fewer custom interaction implementations; customization and accessibility still need verification |
| React Context | Shared in-memory bag state | Keeps the header and page in sync without another state library; refresh resets the bag |
| Vitest | Unit tests and coverage | Fast tests for pure business logic; does not by itself verify the database or browser |
| GitHub Actions | Automated validation | Checks every pushed branch/PR; passing checks cover only configured tests |

Current request flow: browser requests the shop; the server page calls Prisma; Prisma queries Neon; selected product fields are passed to the client storefront. Clicking Add then updates shared client state and shows a toast. This does not reserve stock or create an order.

Relevant files:

- src/app/layout.tsx: common fonts, provider, header and toast host.
- src/app/page.tsx: request-time, server-side product query.
- src/components/site-header.tsx: consistent navigation and bag trigger.
- src/components/shop-provider.tsx: shared bag state and notifications.
- src/components/storefront.tsx: search, filters and product display.
- src/components/bag-sidebar.tsx: shadcn Sheet and quantity controls.
- src/lib/cart.ts: pure quantity and total functions.
- src/lib/db.ts: server-only Prisma client.
- prisma/schema.prisma and prisma/migrations/: database design and schema history.

Keep credentials out of reports and screenshots. Show a redacted configuration example, not the real connection string.

### Database design

Draw an ER diagram from the actual schema: User has many Orders; Order has many OrderItems; Product has many OrderItems. The current catalogue uses Product. The other models support planned functionality.

Explain primary keys, the unique user email, foreign keys, and indexes. Product price and OrderItem unitPrice use integer paisa: BDT 120 is stored as 12000. This avoids ordinary floating-point money rounding problems.

OrderItem stores a name and price snapshot so later catalogue edits do not rewrite historical purchases. This schema intention is implemented, but order creation is not yet working. Photos are local static files; Neon stores image paths, not image binary data.

### Design patterns and UML class diagram

The required three patterns are not yet implemented. A defensible plan is:

1. Strategy (behavioral): a DiscountStrategy interface with interchangeable NoDiscount and StudentDiscount rules. Solves expanding discount rules. Compare with a long conditional in checkout. Explain how the caller selects a strategy and how a new strategy is added.
2. Adapter (structural): a payment-provider adapter translates your PaymentGateway contract into a provider-specific API. Compare with directly calling the provider throughout checkout. A simulated external API may be used if clearly labeled; the adapter must perform actual translation, not merely be an unused class.
3. Builder (creational): an OrderBuilder assembles validated items, address and price snapshots. Compare with a constructor taking many arguments. Use it only if the implemented construction is complex enough to justify it; otherwise choose another appropriate creational pattern.

For each pattern include the problem, class responsibilities, a small real call-site excerpt, benefit, rejected alternative, and trade-off. Draw the UML from implemented interfaces/classes with dependencies and relationships. An ER diagram is not a replacement for a class diagram. React components, Context, and shadcn wrappers do not automatically satisfy the requested pattern count.

### Testing and TDD

Current tests cover repeated additions, stock limits, removal at zero, invalid quantities, immutable quantity updates, and an empty total. Explain Arrange–Act–Assert using a notebook costing 12000 paisa: add twice and expect one line, quantity two, total 24000.

The latest measured coverage for src/lib/cart.ts is 95% statements, 88.88% branches, 100% functions and 100% lines. Six tests pass. These figures are not whole-application coverage and do not prove correctness. Include the final HTML/text report and state exactly which files are included.

Explain TDD as red → green → refactor. The repository includes a test-specification commit before the implemented cart commit, but Git ordering alone is not full proof of a TDD process. Disclose AI assistance and record your own next red/green/refactor cycle with real test output. Do not rewrite history to imply work or learning you did not do.

Mocks are still needed. A future CheckoutService test could inject an inventory dependency that reports one item available, request two, and assert that order saving is never called. A successful-case mock might assert the saved order has the expected price snapshot. Those are proposed tests, not existing results.

Separately test real database behavior against an isolated test database, particularly transaction rollback. Mocked tests cannot demonstrate actual SQL persistence or atomicity.

Selenium scenarios to implement: search/filter; add and change quantities; toast and View bag; cross-page bag retention; keyboard close; later customer checkout and administrator restrictions. Existing interactive browser checks should be reported as manual/browser-assisted verification, not Selenium automation.

### Configuration management and CI

Include actual branch and commit screenshots. Explain feat/<topic> branches and focused commit messages. CI installs locked dependencies, generates Prisma Client, runs ESLint, TypeScript, coverage, and the production build, then uploads coverage.

Use a final hosted CI result tied to the submitted commit. The current CI does not test live Neon writes or a complete purchase flow.

The repository's direct branch merges do not satisfy the requirement for PR reviews. Obtain genuine feedback on future PRs, show one accepted and one revised/rejected example, and explain the resulting changes. Likewise, merge commits do not prove that a merge conflict occurred. Document a real conflict when it occurs, or an instructor-approved practice exercise accurately labeled as such. The migration naming correction is not a Git merge conflict.

### New tool or technique and self-directed learning

Choose something not previously practiced in your sessional; confirm instructor approval where needed. A framework being unfamiliar does not automatically make it an eligible new software-engineering technique.

OpenAPI is a candidate once actual Route Handlers exist: document request/response schemas and validation failures, compare with manual README API documentation, and show real usage. GitHub Actions is a candidate only if it was not already practiced. In either case, explain selection, resources, learning attempts, problems, application, evaluation and limits.

Being present in AI-generated code is not evidence that you independently learned a tool. Reproduce the setup, make a small change yourself, diagnose a failure and explain the outcome.

### Learning log and 500–700-word reflection

Use a dated table: goal; resource; experiment; obstacle; resolution; evidence; remaining question. Record your own work as it happens. Possible topics include understanding migrations, tracing shared cart state, writing a failing test, or modifying a CI job.

For a roughly 600-word reflection, allocate approximately: 80 words to goal and context; 120 to a technical decision and alternative; 140 to one actual challenge and resolution; 120 to evaluation of learning resources; 80 to limitations and lessons; 60 to the next skill and a measurable learning plan. The actual assignment range is 500–700 words.

Do not invent personal struggles, successful experiments, feedback, or independent work. Cite AI assistance and any reused code. Reflect on what you can now explain and what you cannot yet do independently.

### Conclusion, limitations and references

Summarize achieved behavior, honestly list missing modules, and identify the next implementable increment. Cite official framework/tool documentation, stock-photo credits and other resources actually used. Keep the code, diagrams, results and written claims synchronized.

## 4. Five-minute demo and viva

Suggested sequence: 30 seconds problem/scope; 60 seconds catalogue, toast and bag; 60 seconds architecture and database; 60 seconds patterns and tests once implemented; 60 seconds Git/CI/new tool; 30 seconds learning and next steps.

Be ready to explain:

- Why Prisma is an ORM while Neon is the database service.
- Where product data persists and why the bag currently resets on refresh.
- Why database code runs on the server and why DATABASE_URL is not public.
- Why the shared layout keeps the header and provider stable across client navigation.
- Why money uses integer paisa.
- Why a disabled Add button cannot replace future server-side validation.
- What a migration changes versus what a seed supplies.
- What each test proves and what its mocks leave untested.
- Why coverage alone does not guarantee correctness.
- How each actual design pattern solves a specific problem.
- Which work was AI-assisted and which changes you completed yourself.

## 5. Recommended completion order

1. Confirm the new technique and the instructor's interpretation of the rubric.
2. Implement accounts/roles, database-backed checkout, order history and inventory administration, giving at least five meaningful modules.
3. Add the three justified patterns as those modules take shape.
4. Complete TDD evidence, mocks, integration tests and Selenium tests; extend CI.
5. Use genuine reviewed PRs and preserve conflict-resolution evidence.
6. Update diagrams and requirement-to-test traceability, then write the report and personal reflection from actual evidence.

The brief has a 10-mark heading but a 20-mark rubric; clarify the intended grading scale. Submit the GitHub link, project report, learning log, 500–700-word reflection, and live demo/viva as requested.
