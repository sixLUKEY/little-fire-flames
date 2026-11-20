# Little Fire Flames

Little Fire Flames is a school portal. Principals manage classes, teachers, subjects and learners. Teachers enter term results, and Parents Corner displays published results. Local development uses Angular, an Express API and PostgreSQL. AWS deployment has a separate Lambda entry point.

## Run locally

Use Node 22.22.0 (`.nvmrc`), npm 10 and Docker Compose. From the repository root, in a checkout intended for development, run the following commands.

```sh
npm run install:all
docker compose up -d --wait postgres
npm run dev
```

Open <http://localhost:4200>. The API lists registered endpoints at <http://localhost:3000/debug/routes>. The root dev command serves the local frontend without the generated cloud `config.json`. For deliberately testing a configured stack, the frontend's existing `npm start` command serves that file. See the [frontend configuration guide](deploy/ANGULAR-COGNITO.md).

Compose supplies the API's default PostgreSQL settings on port 5432. Export `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` and `DB_PASSWORD` for a different disposable database. The API synchronizes the schema with Sequelize on startup, including column alterations. Check the selected database before starting it. Ctrl-C stops the dev servers. `docker compose stop postgres` stops the database and retains the volume.

## Verify a change

| Command from the root                     | What it checks                                                                                                                                         |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run check`                           | Builds the TypeScript API and production Angular bundle, then runs the frontend tests once. Runs without PostgreSQL, AWS, or generated cloud settings. |
| `npm --prefix api run test:learner`       | With a disposable PostgreSQL running, creates, reads and removes one synthetic learner through the repository. Reads optional `api/.env` settings.     |
| `npm --prefix api run test:routes`        | With the local API running, creates, fetches, lists and removes a synthetic learner over HTTP. `API_URL` defaults to localhost port 3000.              |
| `npm --prefix api run seed:teacher-class` | Creates a teacher and an assigned class through the running API. This leaves sample data in the selected database.                                     |
| `npm run format:check`                    | Reports repository-wide Prettier differences. Run the formatter on the files being changed while the existing backlog is open.                         |

`install:all` performs a clean install of the root, API and frontend lockfiles. The [verification workflow](.github/workflows/check.yml) runs the root check and both learner checks against a temporary PostgreSQL 16 service.

## Find the code

| Change                    | Start here                                                                                                                                                                                                                                                                                                       |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page or role navigation   | [Angular routes](frontend/src/app/app.routes.ts), [learner centre](frontend/src/app/learner-centre), [Parents Corner](frontend/src/app/parents-corner)                                                                                                                                                           |
| Learner fields or results | [Frontend API client](frontend/src/app/api/api.service.ts) → [route definitions and handlers](api/src/routes/learners) → [repository](api/src/routes/learners/repository.ts) → [Sequelize model](api/src/db/models/learner.model.ts). The frontend imports DTOs through [shared types](api/src/types/shared.ts). |
| HTTP startup or hosting   | [Local Express](api/src/server.ts) and [Lambda entry](api/src/index.ts) use the same [route definitions](api/src/routes/routes.ts). See [deployment notes](deploy/README.md) together with the release questions below.                                                                                          |

## Project status · 20 November 2026

The baseline was `main` at `4b7f0ca` with 27 locally modified files, including a database initialization change. The root dev command failed on a missing frontend script. The learner repository smoke check failed on an uninitialized model in that working tree. Four of 22 frontend tests failed and several attempted live HTTP requests.

Local verification now covers clean locked installation, both builds, all 22 frontend tests, startup of both services and both learner smoke checks on PostgreSQL 16. A missing learner response also produced a failing exit code and a cleanup request. Most frontend specs check component creation. End-to-end staff and family journeys remain unverified. Hosted results are available in the [verification runs](https://github.com/sixLUKEY/little-fire-flames/actions/workflows/check.yml). [Onboarding issue #1](https://github.com/sixLUKEY/little-fire-flames/issues/1)

**Release readiness is unresolved.** The checked-in login handler implements development sign-in. Server-side role enforcement and access to the intended learner records need staging evidence. The deployment templates also differ on frontend ownership and Cognito outputs. The active AWS stack, deployed revision, database connectivity and recovery have not been verified here. [Identity and access #2](https://github.com/sixLUKEY/little-fire-flames/issues/2) · [Deployment and recovery #3](https://github.com/sixLUKEY/little-fire-flames/issues/3)

The production build reports two component stylesheet size warnings and CommonJS dependency warnings from the PDF export path. The baseline formatting check flagged 86 files including generated frontend configuration. Generated config is now excluded, and existing source-format differences remain.

## Start an agent session

For frontend work, also read the [Angular contribution guidance](frontend/.github/copilot-instructions.md). Use Sanctuary's Codebase Onboarding for a repository reassessment and GitHub Issue Maintenance for material issue-driven changes when those skills are available.

**Orientation prompt** — “Read the root README and applicable instructions. Trace how a learner result reaches Parents Corner. Identify which claims the existing tests verify and which still need evidence.”

**Task prompt** — “Work on issue #N. Before editing, confirm the applicable instructions and skills, the intended outcome, acceptance criteria and the smallest checks that prove it. Preserve existing local changes. Report the checks run and any remaining criteria.”
