<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax


<!-- nx configuration end-->

# Remotion monorepo conventions

This is a Remotion (programmatic video) monorepo. Follow these rules when adding
or changing code. They mirror Remotion's own conventions and standard Nx layout.

## The core mental model

- The unit of scale is the COMPOSITION, not the app. One Remotion app = one entry
  point (`src/index.ts` calls `registerRoot`) -> one `Root.tsx` -> many
  `<Composition>`s -> one bundle. Variation comes from input props, not new apps.
- Add a NEW app only when the product or consumption mode genuinely diverges: a
  different output shape (vertical 9:16 vs landscape 16:9), a different way of
  consuming (a render pipeline vs a live `<Player>` embed), a different dependency
  footprint (e.g. a Three.js/R3F video), or a separate deliverable. The two apps
  show this: `social` renders to MP4, `website` embeds the same scenes live.
- To add a video, add a composition - do NOT scaffold an app per video.

## apps/ vs packages/

- `apps/*` - runnable products. A RENDER app (`social`) owns `registerRoot`, the
  `<Composition>` JSX, `remotion.config.ts`, and `studio`/`render`/`bundle`. A WEB
  app (`website`) is Vite + React and embeds compositions via `<Player>` (no
  `registerRoot`), with `serve`/`build`. Keep both thin - nothing reusable.
- `packages/*` - importable, non-runnable libs. Current layering (high -> low):
  `compositions` -> `ui` + `animations` -> `theme`. `theme` is a pure-data leaf.
- Heuristic: if it is only ever imported (no entry point, no build output of its
  own), it is a lib; if you run or ship it, it is an app.

## Load-bearing rules (easy to get wrong)

- Share PURE visual components and plain data. `registerRoot`, `<Composition>`
  JSX, the renderer, and data-fetching stay at the app boundary. A shared lib must
  not call `registerRoot` or render `<Composition>` (it needs the app's registry
  context). See `packages/compositions/src/descriptors.ts`: libs export descriptor
  objects; the render app spreads them into `<Composition {...descriptor} />` (and
  may override props per product - `social` reuses IntroCard at a vertical cut),
  while `website` adapts them for `<Player>` via `toPlayerProps`. One descriptor,
  both consumers.
- Libs are NON-buildable: `main`/`types`/`exports` point at `./src/index.ts`;
  `react`/`remotion` are `peerDependencies` so the app owns one resolved copy
  (duplicate React/Remotion breaks Remotion's hooks/registry). There is no
  `tsconfig.base.json` - imports resolve through the npm-workspace symlink. Only
  add a `build` target if you publish a lib to npm.
- Animation = timing (`useCurrentFrame`/`interpolate`/easings) lives in
  `packages/animations`. ui components are presentational: they take a computed
  value (e.g. `widthPct`, `progress`) and render - no frame logic inside ui.
- No CSS transitions/animations and no Tailwind animation classes - they do not
  render deterministically. Animate via `useCurrentFrame()` + `interpolate()`.

## Nx targets + caching

- No official `@nx/remotion` plugin exists. Targets are `nx:run-commands` wrappers
  around the Remotion CLI. Keep per-project targets to just `command` + `cwd`;
  cache/inputs/outputs live in `nx.json` -> `targetDefaults`.
- `bundle` is cacheable (deterministic build). `render` is `cache: false` on
  purpose: encoder output is non-deterministic, artifacts are large, and a cache
  hit could return a STALE video when only runtime data changed.
- Run tasks via `nx` (`nx run ...`, `nx run-many -t typecheck`, `nx affected`).
  Editing a lib only re-runs the apps that depend on it (see `nx graph`).

## Tags

- Two axes: `type:*` (`app`, `composition`, `ui`, `animations`, `theme`) and
  `scope:*` (`website`, `social`, `shared`). Tags currently document the intended
  layering and color the graph. They are NOT enforced yet - to enforce, add
  `@nx/eslint` + `@nx/eslint-plugin` and `@nx/enforce-module-boundaries`
  depConstraints (app -> composition -> ui -> animations/theme; products see
  themselves + `scope:shared`).