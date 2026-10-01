# Tikkum

Tikkum is a Material UI prototype for a multi-vendor local commerce and shared delivery marketplace.

## Workspaces

- **Super admin:** tenant plans, billing metrics, geo-zone coverage, fleet payouts, driver incentives, and onboarding.
- **Merchant:** branded store settings, opening hours, local inventory, live order progression, and shared-fleet pickup requests.
- **Picker:** a timed packing checklist with item locations and handoff confirmation.
- **Driver:** multi-merchant pickup batches, delivery proof, route progress, and earnings incentives.
- **Customer:** grocery, restaurant, and bakery discovery, search, favorites, cart, delivery/pickup selection, and a sample order-tracking state.

Use the workspace tabs at the top of the page to switch roles.

## Project structure

```text
src/
  components/       Shared workspace navigation
  data/             Seed marketplace and operations data
  features/
    operations/     Admin, merchant, picker, and driver workspaces
  types/            Shared workspace types
  App.tsx           Role selection and customer marketplace
```

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`.

The current screens use local demo state only. Authentication, persistence, live mapping/routing, payment, and backend order dispatch are not connected.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
