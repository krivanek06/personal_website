# Patches

This folder holds `pnpm patch` files that fix issues in our dependencies before
they are fixed upstream. They are registered in `pnpm-workspace.yaml` under
`patchedDependencies`, so `pnpm install` reapplies them automatically.

## @analogjs/router@2.7.1 — stop `src/content` files from becoming routes

### Why

Our blog posts live in `src/content/blog/*.md` and are loaded through
`injectContent` / `injectContentFiles` and rendered by the `blog/[slug].page.ts`
component. This is the standard Analog blog setup and it worked on Analog 1.x.

After upgrading to Analog 2.7.1, every markdown file under `src/content/` was also
registered as a markdown content route by the router. Those auto-generated routes
shadowed the `blog/[slug].page.ts` page route, so opening a post rendered Analog's
raw `analog-markdown-route` component instead of our styled page. That is why the
text looked unstyled (no `prose` wrapper, no cover image, no reading progress bar).

This looks like an upstream regression. The Analog docs still say content files
live in `src/content/` and are loaded with `injectContent`, while content routes
are markdown files in `src/app/pages/`.

### What the patch does

It keeps `src/content/**` files available to `injectContent`, but filters them out
of route generation so they no longer shadow the page components:

```js
createRoutes({
  ...ANALOG_ROUTE_FILES,
  ...Object.fromEntries(
    Object.entries(ANALOG_CONTENT_ROUTE_FILES)
      .filter(([key]) => !key.includes('/src/content/'))
  ),
});
```

### When to remove

Remove this patch once Analog fixes content-route scanning, so that files under
`src/content/**/*.md` no longer auto-register as routes. To remove it:

1. Delete the entry from `patchedDependencies` in `pnpm-workspace.yaml`.
2. Delete `patches/@analogjs__router@2.7.1.patch`.
3. Run `pnpm install`.
