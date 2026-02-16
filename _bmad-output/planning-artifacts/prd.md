---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish']
inputDocuments: ['PRD-todo.md']
workflowType: 'prd'
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 0
  projectDocs: 0
  userProvided: 1
classification:
  projectType: web_app
  domain: general
  complexity: low
  projectContext: greenfield
---

# Product Requirements Document - todo-bmad

**Author:** Sam
**Date:** 2026-02-16

## Executive Summary

A simple, no-bloat Todo application for casual users who want to manage personal tasks without accounts, onboarding, or unnecessary complexity. The product thesis: other todo apps are too bloated — this one does exactly one thing and does it well.

**Product type:** Single Page Application (SPA) with RESTful backend API
**Target user:** Casual individual managing personal tasks
**Project context:** Greenfield learning project, solo developer, no V2 planned
**Differentiator:** Radical simplicity — zero friction from first visit to first completed task

## Success Criteria

### User Success

- A new user can create, complete, and delete a task within 60 seconds of first opening the app — zero onboarding required
- User completes a full task lifecycle (create → complete → verify), refreshes the page, and sees data unchanged — instant trust in the system
- Typical session flow works seamlessly: open app → review tasks → check off completed ones → add new tasks → close browser → return later with everything intact
- Completed tasks are visually distinct from active tasks at a glance

### Business Success

- Learning project — success measured by implementation quality, not market metrics
- Final product feels complete and polished despite minimal scope
- No V2 planned — V1 is the final version

### Technical Success

- API responses under 150ms for all CRUD operations
- UI updates within 100ms of user action
- Stable across page refreshes and browser sessions — zero data loss
- New developer can add a feature (e.g., task priorities) within one day
- Failures degrade gracefully without breaking user flow

### Measurable Outcomes

| Metric | Target |
|--------|--------|
| Time to first completed task flow (new user) | < 60 seconds |
| API response time (CRUD operations) | < 150ms |
| UI update latency | < 100ms |
| Data persistence across refresh | 100% reliability |
| New developer feature addition time | < 1 day |

## Product Scope

### MVP (= Final Product)

**MVP Approach:** The MVP *is* the final product. No phased rollout, no expansion roadmap. Ship one thing, ship it well.

**Core capabilities:**
- Create a todo item with text description
- View all todos (active and completed)
- Mark a todo as complete / uncomplete
- Delete a todo
- Visual distinction between active and completed tasks
- Persistent storage across sessions
- Responsive design (desktop + mobile)
- Empty state, loading state, and error state handling
- RESTful API with full CRUD support
- Keyboard navigable interface

**Resource:** Solo developer. No team coordination required.

### Explicitly Out of Scope

User accounts, authentication, task prioritization, deadlines, notifications, collaboration, real-time sync. The architecture should not prevent these from being added, but none are planned.

### Risk Mitigation

- **Technical:** Near zero risk — well-understood stack, standard patterns. Primary risk is over-engineering; mitigate by keeping architecture simple
- **Resource:** Solo developer scope matches this feature set. Nothing left to cut without compromising core experience

## User Journeys

### Journey 1: Alex — The Casual User (Happy Path)

**Alex**, 28, freelance graphic designer. Has tried Todoist, Notion, TickTick — every one wanted him to create an account, pick a plan, configure labels. He just wants to write down "buy milk" and check it off later.

**Opening Scene:** Monday morning. Three things rattling around his head — pick up a package, email the client, buy groceries. He opens the Todo app.

**Rising Action:** The page loads instantly. No signup. No onboarding. Just an empty state with a clear input field. He types "Pick up package" and hits enter. It appears immediately. He adds two more. Total time: about 15 seconds.

**Climax:** That evening, he opens the app on his phone. All three tasks are there. He taps the checkbox next to "Pick up package" — it visually strikes through, clearly done. Two things left.

**Resolution:** Next morning, everything is exactly as he left it. He deletes the completed task, adds a new one. No friction, no bloat. The app does one thing well.

**Requirements revealed:** Instant load, clear empty state, single input creation, toggle completion with visual feedback, delete capability, data persistence, responsive layout.

---

### Journey 2: Alex — The Bad Day (Edge Cases & Errors)

**Opening Scene:** Alex is on the bus, spotty connection. He opens the app to add "Call dentist" before he forgets.

**Rising Action:** He types the task and hits enter. The request fails. He sees a clear error: "Couldn't save. Try again." His text is still in the input.

**Climax:** Connection returns, task saves. He accidentally taps delete on the wrong task — given the low stakes, he re-adds it in 3 seconds.

**Resolution:** He opens the app once when the backend is down. Instead of a blank screen, he sees: "Something went wrong. We'll keep trying." The app communicates honestly.

**Requirements revealed:** Graceful error handling, human-readable error messages, input preservation on failure, loading states, server-down state, no data corruption.

---

### Journey 3: Jamie — The Developer Extending the Codebase

**Jamie**, junior developer, tasked with adding task priorities (low/medium/high) as a learning exercise.

**Opening Scene:** Jamie clones the repo. The README covers the stack, local setup, and project structure.

**Rising Action:** App running locally within 5 minutes. Code is conventional — frontend components map to screen elements, API routes map to CRUD operations, data model in one obvious place.

**Climax:** Jamie adds a `priority` field to the data model, extends the API, adds a dropdown to creation UI, applies a visual indicator. Existing patterns make it obvious where each change goes. Total time: about half a day.

**Resolution:** Everything works. Existing tests pass. The new feature fits naturally. No framework, state library, or build system knowledge needed.

**Requirements revealed:** Clean project structure, clear layer separation, predictable patterns, simple local setup (< 5 min), extensible architecture.

---

### Journey Requirements Summary

| Capability Area | Revealed By |
|----------------|------------|
| Task CRUD (create, read, complete, delete) | Alex — Happy Path |
| Instant visual feedback on actions | Alex — Happy Path |
| Data persistence across sessions | Alex — Happy Path |
| Responsive design (desktop + mobile) | Alex — Happy Path |
| Empty state UI | Alex — Happy Path |
| Network error handling & recovery | Alex — Bad Day |
| Loading & error state communication | Alex — Bad Day |
| Input preservation on failure | Alex — Bad Day |
| Server-down graceful degradation | Alex — Bad Day |
| Clean, maintainable code architecture | Jamie — Developer |
| Simple local dev setup | Jamie — Developer |
| Extensible data model and API | Jamie — Developer |

## Web App Specific Requirements

### Architecture

Single Page Application (SPA) with RESTful backend API. Frontend handles all UI rendering and state management client-side, communicating via JSON REST endpoints. No server-side rendering, no real-time protocols, no SEO needs.

### Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | Latest 2 versions |
| Firefox | Latest 2 versions |
| Safari | Latest 2 versions |
| Edge | Latest 2 versions |

No IE11 or legacy browser support. Modern JavaScript (ES2020+) and CSS (flexbox, grid, custom properties) without polyfills.

### Responsive Design

- **Desktop:** Primary experience (1024px+)
- **Tablet:** Functional (768px–1023px)
- **Mobile:** Full functionality (320px–767px)
- Fluid layout with touch-friendly tap targets (minimum 44x44px)

### Implementation Constraints

- JSON for all API communication
- Simple state management — no complex state library needed
- Standard HTTP request-response only (no WebSockets, SSE, or polling)
- No authentication — all endpoints open. Architecture allows adding auth middleware later without restructuring

## Functional Requirements

### Task Management

- **FR1:** User can create a new todo by entering a text description
- **FR2:** User can view a list of all existing todos
- **FR3:** User can mark an active todo as complete
- **FR4:** User can mark a completed todo as active (uncomplete)
- **FR5:** User can delete a todo permanently
- **FR6:** User can distinguish between active and completed todos visually

### Data Persistence

- **FR7:** System persists all todos across browser sessions
- **FR8:** System persists all todos across page refreshes
- **FR9:** System maintains todo state (active/completed) accurately after any interruption
- **FR10:** Each todo stores a text description, completion status, and creation timestamp

### User Interface States

- **FR11:** User can see a clear empty state when no todos exist
- **FR12:** User can see a loading indicator while data is being fetched
- **FR13:** User can see a meaningful error message when an operation fails
- **FR14:** User can see a meaningful error state when the server is unreachable
- **FR15:** User's input text is preserved if a create operation fails

### Responsive Experience

- **FR16:** User can perform all task operations on a desktop browser
- **FR17:** User can perform all task operations on a mobile browser
- **FR18:** User can interact with all controls via touch on mobile devices
- **FR19:** User can navigate and operate all features using only a keyboard

### API

- **FR20:** System exposes an endpoint to create a todo
- **FR21:** System exposes an endpoint to retrieve all todos
- **FR22:** System exposes an endpoint to update a todo's completion status
- **FR23:** System exposes an endpoint to delete a todo
- **FR24:** All API endpoints accept and return JSON

## Non-Functional Requirements

### Performance

- **NFR1:** API endpoints respond within 150ms for all CRUD operations under normal conditions
- **NFR2:** UI updates render within 100ms of user interaction
- **NFR3:** First Contentful Paint under 1.5 seconds on modern broadband
- **NFR4:** Time to Interactive under 2 seconds on modern broadband
- **NFR5:** Lighthouse Performance score above 90
- **NFR6:** Frontend bundle size small enough to not impact load times

### Security

- **NFR7:** API validates and sanitizes all input to prevent injection attacks
- **NFR8:** API returns appropriate HTTP status codes without leaking implementation details
- **NFR9:** CORS configured to restrict API access to the frontend origin only

### Reliability

- **NFR10:** Zero data loss — all successfully created todos persist until explicitly deleted
- **NFR11:** Graceful recovery from temporary network interruptions without data corruption
- **NFR12:** Backend restarts do not affect persisted data
- **NFR13:** Concurrent browser tabs do not cause data inconsistency (last-write-wins acceptable)

### Accessibility

- **NFR14:** All interactive elements reachable and operable via keyboard (Tab, Enter, Space, Escape)
- **NFR15:** Visible focus indicators on all interactive elements
- **NFR16:** Semantic HTML for all structural and interactive elements
- **NFR17:** Color contrast ratios minimum 4.5:1 for text and status indicators
- **NFR18:** ARIA labels on controls that lack visible text labels

### Maintainability

- **NFR19:** Consistent, conventional code patterns understandable by a new developer within 1 hour
- **NFR20:** Local development environment setup and running within 5 minutes
- **NFR21:** Adding a new data field (e.g., priority) requires no architectural restructuring
- **NFR22:** README documents setup, architecture overview, and project structure
