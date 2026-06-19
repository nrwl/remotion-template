# Nx Remotion Template

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

Programmatic video in a monorepo - shared React + Remotion compositions rendered to MP4 for social and embedded live on a website via `@remotion/player`, with Nx smart task orchestration. Built for teams that treat video like code.
<!-- BEGIN: nx-cloud -->
🚀 If you haven't connected to Nx Cloud yet, [complete your setup here](https://cloud.nx.app/get-started). Get faster builds with remote caching, distributed task execution, and self-healing CI. [See how your workspace can benefit](#nx-cloud).
<!-- END: nx-cloud -->

## Quick Start

### Use this template

```sh
npx create-nx-workspace@latest my-workspace --template nrwl/remotion-template
```

### Or clone and go

```sh
git clone <this-repo> my-videos
cd my-videos
npm install
```

### Run the website (compositions embedded live via @remotion/player)

```sh
npx nx run @remotion-template/website:serve
```

### Open Remotion Studio for the social videos

```sh
npx nx run @remotion-template/social:studio
```

### Render a social video to MP4

```sh
npx nx run @remotion-template/social:render
```

### Run tasks across all projects

```sh
npx nx run-many -t typecheck
```

### See the project graph

```sh
npx nx graph
```

---

## What's Inside

```
remotion-template/
  apps/
    website/          - Marketing site embedding compositions live via @remotion/player (Vite)
    social/           - Standalone vertical (9:16) videos rendered to MP4 (Remotion)
  packages/
    compositions/     - Reusable scenes (IntroCard, CountUp) + composition descriptors
    ui/               - Presentational components (LogoMark, AccentBar, ProgressRing, GridBackground)
    animations/       - Timing primitives: <FadeIn>, <ScaleIn>, easing functions
    theme/            - Design tokens (colors, fonts, sizes, radii) - pure data
```

Dependency layering (high -> low): `app -> compositions -> ui + animations -> theme`.
Run `npx nx graph` to see it.

### apps/* (the two ways to consume Remotion)

Both apps pull the same scenes from `packages/compositions` - one renders them, the
other plays them live:

- **`social`** - a Remotion render app. `src/index.ts` calls `registerRoot`, `Root.tsx`
  registers `<Composition>`s by spreading shared descriptors. Output is MP4 files.
  Targets: `studio`, `render`, `bundle`, `typecheck`.
- **`website`** - a Vite + React app that embeds compositions live with `<Player>` (no
  render step - they play in the browser). Targets: `serve`, `build`, `typecheck`.

### packages/* (shared libs)

| Package | Exports | Notes |
|---------|---------|-------|
| `compositions` | `IntroCard`, `CountUp` + `introCardComposition`, `countUpComposition` descriptors | reusable scenes; apps register the descriptors |
| `ui` | `LogoMark`, `AccentBar`, `ProgressRing`, `GridBackground` | presentational only - take computed values, no frame logic |
| `animations` | `<FadeIn>`, `<ScaleIn>`, `easeInOut`, `easeOutQuart`, `spring`, `linear` | timing: `useCurrentFrame` + `interpolate` |
| `theme` | `colors`, `fonts`, `fontSizes`, `radii` | pure data, no React/Remotion |

Libs are non-buildable: `main`/`types` point at `src/index.ts`, and `react`/`remotion`
are peer dependencies so the app owns a single resolved copy.

```tsx
import { easeOutQuart } from '@remotion-template/animations';

const opacity = interpolate(frame, [0, 20], [0, 1], {
  extrapolateRight: 'clamp',
  easing: easeOutQuart,
});
```

---

## Structure & Scaling

The single most important rule: **the unit of scale is the composition, not the app.**

- **Add a video -> add a composition.** One app = one entry point -> one `Root.tsx`
  -> many `<Composition>`s -> one bundle. Vary output with input props, not new apps.
  ("Bundle once, render many" - calling `bundle` per video is a Remotion anti-pattern.)
- **Add an app when the product or consumption mode diverges** - a different output
  shape (`social` is vertical 9:16), a different way of consuming (render pipeline vs
  `website`'s live `<Player>` embed), a different dependency footprint (e.g. a Three.js/
  R3F video), or a separate deliverable. Not for "another video".
- **Share pure components + plain data; keep `registerRoot` and `<Composition>` JSX
  in the app.** A `<Composition>` needs the app's registry context, so libs export
  *descriptors* (`packages/compositions/src/descriptors.ts`). The render app spreads
  them into `<Composition>`; the website adapts them for `<Player>` via `toPlayerProps`
  - one source of truth, both consumers:

  ```tsx
  import { introCardComposition, toPlayerProps } from '@remotion-template/compositions';

  // apps/social/src/Root.tsx - reuse the scene at a vertical cut, render to MP4
  <Composition {...introCardComposition} id="IntroCardVertical" width={1080} height={1920} />

  // apps/website/src/App.tsx - same scene, live in the browser
  <Player {...toPlayerProps(introCardComposition)} controls loop />
  ```

When you need them, natural next packages are `fonts` (load once, shared), `assets`
(brand images/audio), `data` (loaders + Zod prop schemas), and a `render-server` app
for SSR/Lambda rendering. Add them as reuse materializes - don't pre-build the list.

---

## Add a New Composition (the common case)

1. Add the scene to `packages/compositions/src/MyScene.tsx` (component + props type)
2. Add a descriptor in `packages/compositions/src/descriptors.ts`, export it from `src/index.ts`
3. Register it in an app's `Root.tsx`: `<Composition {...myScene} />`
4. Preview in Studio: `npx nx run @remotion-template/social:studio`, or on the site:
   `npx nx run @remotion-template/website:serve`

For a one-off scene used by a single app, put it in that app's `src/compositions/`
instead (see `apps/social/src/compositions/PromoCard.tsx`).

---

## Featured Nx Capabilities

### Smart Caching

Nx caches `bundle` and `typecheck` outputs. Re-run the same task twice - second run is instant. Bundle outputs are cached under `apps/<app>/out/bundle`.

```sh
npx nx run @remotion-template/social:bundle   # slow first run
npx nx run @remotion-template/social:bundle   # instant cache hit
```

Caching defaults live in `nx.json` -> `targetDefaults`. Note `render` is intentionally
**not cached** (`cache: false`): video encoding is non-deterministic, artifacts are
large, and a cache hit could hand back a stale video when only runtime data changed.

### Affected Tasks

Only re-run tasks for code that actually changed since the last commit:

```sh
npx nx affected -t typecheck
```

Editing `packages/theme` re-checks `ui`, `compositions`, and both apps; editing
`apps/social` re-checks only itself - Nx tracks the dependency graph.

### Module Boundary Tags

Projects are tagged on two axes - `type:*` (what it is) and `scope:*` (which product):

| Project | Tags |
|---------|------|
| `website` | `type:app`, `scope:website` |
| `social` | `type:app`, `scope:social` |
| `compositions` | `type:composition`, `scope:shared` |
| `ui` | `type:ui`, `scope:shared` |
| `animations` | `type:animations`, `scope:shared` |
| `theme` | `type:theme`, `scope:shared` |

Tags currently document the intended layering and color the graph. To *enforce* them
(e.g. stop an app importing another app, or `ui` reaching into `compositions`), add
`@nx/eslint` + `@nx/eslint-plugin` and `@nx/enforce-module-boundaries` depConstraints:
`app -> composition -> ui -> animations/theme`, and let each product see only itself
plus `scope:shared`.

### Nx Console (VS Code / IntelliJ)

Install [Nx Console](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console) for a GUI to run targets, generate code, and browse the project graph.

---

## Nx Cloud

- **Remote cache** - Every `nx run @remotion-template/social:bundle` output is stored in the remote cache. When another developer (or CI) runs the same task with the same inputs, the output is replayed instantly - no re-render, no re-bundle.
- **Distributed task execution (DTE)** - When your pipeline has many compositions to render, DTE distributes the work across multiple CI agents automatically. Nx Cloud schedules tasks, agents pick them up, and results flow back to the orchestrator.
- **Flaky task detection** - Remotion renders can be environment-sensitive. Nx Cloud tracks task history and flags tasks that non-deterministically fail, so you can investigate before they block your team.

Docs: https://nx.dev/nx-cloud

---

## Remotion Reference

| Command | What it does |
|---------|-------------|
| `npx nx run @remotion-template/website:serve` | Run the site with compositions embedded via `<Player>` |
| `npx nx run @remotion-template/website:build` | Build the static site (Vite) |
| `npx nx run @remotion-template/social:studio` | Open the interactive Remotion Studio (vertical) |
| `npx nx run @remotion-template/social:render` | Render `PromoCard` to `apps/social/out/social-promo.mp4` |
| `npx nx run @remotion-template/social:bundle` | Bundle for Lambda / server-side rendering |
| `npx nx run-many -t typecheck` | TypeScript check every project |

Remotion docs: https://www.remotion.dev/docs

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/docs/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## 🔗 Learn More

- [Nx Documentation](https://nx.dev/docs)
- [Crafting Your Workspace Tutorial](https://nx.dev/docs/getting-started/tutorials/crafting-your-workspace)
- [Module Boundaries](https://nx.dev/docs/features/enforce-module-boundaries)
- [Remotion Documentation](https://www.remotion.dev/docs)
- [Nx Cloud](https://nx.dev/nx-cloud)

## 💬 Community

Join the Nx community:

- [Discord](https://go.nx.dev/community)
- [X (Twitter)](https://twitter.com/nxdevtools)
- [LinkedIn](https://www.linkedin.com/company/nrwl)
- [YouTube](https://www.youtube.com/@nxdevtools)
- [Blog](https://nx.dev/blog)
