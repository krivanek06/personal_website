---
name: eduard-personal-website-blog-skill
description: "Use when writing, drafting, planning, or editing a blog post for Eduard Krivanek's personal website (eduardkrivanek.com) — technical tutorials, deep dives, and honest notes on web development (Angular, Vue, RxJS, TypeScript, CSS, GraphQL, Node), AI, or related developer topics. Apply whenever a new article must match this site's markdown content format: the frontmatter schema, file and slug naming, cover image, and in-article image conventions under src/content/blog. Triggers: blog post, new article, write a post, tech blog, tutorial, deep dive, eduard blog, personal website content."
---

# Eduard Personal Website — Blog Writing Skill

## Overview

This is a **reference + recipe** skill for producing a new markdown post that drops into the Analog.js (Angular) content pipeline of this website with zero rework. It encodes the exact, observed conventions of the 50 existing posts in `src/content/blog/` so a future post is structurally identical to the rest of the site.

The site renders markdown with Analog's `MarkdownComponent` + Prism highlighter, and derives routes/SEO/meta entirely from the frontmatter (see `src/app/post-attributes.ts` and `src/app/pages/blog/*.page.ts`). Get the frontmatter and file name right and the post "just works."

## When to Use

Use this skill when the task is to **create a new post for this website**, or to **reformat a draft so it fits this site**. It is *not* a general blog-writing style guide — for broader voice/AEO guidance pair it with the `blog-writing-specialist` skill, but the file layout, frontmatter, and image rules below are authoritative for this repo.

## Content Location

| What | Path |
|---|---|
| Post markdown | `src/content/blog/<order>_<slug>.md` |
| Cover images | `public/article-cover/<slug>.<ext>` |
| In-article images | `public/article-images/<slug>_<name>.<ext>` |

## File & Slug Naming

- File name is `<order>_<kebab-case-slug>.md`, placed directly in `src/content/blog/` (flat, no subfolders).
- `order` is a sequential integer. As of the last analysis the highest is `50`, so the next post is `51`. **Always check the existing files for the current maximum before choosing the number.**
- `slug` is the URL segment: the route is `/blog/<slug>` (see the `prerender` transform in `vite.config.ts`).
- The frontmatter `slug` value must equal the file name **minus the `.md`**, including the numeric prefix. Example:

```text
file:  51_building-a-graphql-api-with-nestjs.md
slug:  51_building-a-graphql-api-with-nestjs
order: 51
```

## Frontmatter Schema (required, in this order)

Every existing post uses these exact fields. Match them 1:1 — the `PostAttributes` interface and the card/page templates read all of them.

```yaml
---
title: 'Building a GraphQL API with NestJS'
seoTitle: 'Building a GraphQL API with NestJS'
seoDescription: 'A step-by-step guide to wiring a type-safe GraphQL API in NestJS, from schema to resolver.'
slug: 51_building-a-graphql-api-with-nestjs
tags: nestjs, graphql, typescript
order: 51
datePublished: 23.08.2026
readTime: 9
coverImage: article-cover/51_building-a-graphql-api-with-nestjs.webp
---
```

Field rules:

| Field | Rule |
|---|---|
| `title` | Human title in single quotes, Title Case. This is the H1 shown on the page and card. |
| `seoTitle` | Usually identical to `title`. |
| `seoDescription` | One or two sentences. This is the `<meta name="description">` AND the card excerpt. Make it specific and click-worthy. |
| `slug` | `'<order>_<kebab-case>'`, must match the filename (minus `.md`). |
| `tags` | Comma-separated, **lowercase, no spaces**, 2–4 tags (e.g. `angular, signals, performance`). Hyphens allowed (`full-stack`). The card shows the first 3. |
| `order` | Integer equal to the filename's numeric prefix. |
| `datePublished` | String in `DD.MM.YYYY` format. |
| `readTime` | Integer, minutes. Estimate 200–250 words/min. |
| `coverImage` | `article-cover/<slug>.<ext>` (no leading `./`). File lives in `public/article-cover/`. |

## Image Conventions

### Cover image

- Reference: `coverImage: article-cover/<slug>.<ext>`
- File: `public/article-cover/<slug>.<ext>`
- Prefer `.webp`, then `.png`/`.jpg`. The site renders it at the top of the post and on the blog card.

### In-article images

- Reference in markdown: `![alt text](./article-images/<slug>_<name>.<ext>)`
- File: `public/article-images/<slug>_<name>.<ext>`
- Naming: `<slug>_<short-description>.<ext>` (e.g. `51_graphql-schema.png`, `36_article-form-validity-util-result.png`).

### Image placeholders — NEVER generate image files

You cannot produce real image files. Whenever the post needs an image — a cover, a diagram, a screenshot, a result animation — **do not fabricate a file path or a URL**. Instead, inline a placeholder in exactly this form:

```html
<img description={here goes the image description that will be added to the AI} />
```

Replace the `{...}` with the precise prompt a later AI image generator will receive. Make it concrete: subject, style, colors, layout. Example:

```html
<img description={Dark themed technical diagram comparing Zone.js global change-detection ticks against zoneless signal-based scheduling in Angular, flat vector style, dark background, neon green accents} />
```

Rules for placeholders:

- One `<img description={...} />` per intended image, placed exactly where the image should appear in the article.
- For the **cover**, keep `coverImage:` pointing at the intended file path (`article-cover/<slug>.<ext>`) and put the cover's `<img description={...} />` as the first element after the frontmatter, so a later step knows both the prompt and where to drop the generated file.
- Use the placeholder even when a section feels incomplete without the visual — it records the intent instead of skipping it.

## Markdown Features & Code Highlighting

- Sections use `##`, sub-points use `###`.
- Fenced code blocks with a language tag for Prism. Common tags in this repo: `typescript`, `javascript`, `bash`, `html`, `css`, `sql`, `graphql`, `yaml`, `markdown` (the latter five are enabled via `prismOptions.additionalLangs` in `vite.config.ts`).
- Use bullet lists, numbered lists, `**bold**`, inline code, and links. Raw HTML is allowed (needed for the image placeholder above).

## Writing Style (observed in existing posts)

- Open with a concrete hook, not meta-preamble ("You know that feeling when…", "Every Angular developer eventually gets here.").
- Conversational, second-person, first-person experience is welcome.
- Practical and evidence-based: name the problem, show the code, explain the *why*.
- One idea per `##` section; keep paragraphs short.
- Optional short closing section that summarizes what the article covered.

## Language & Tone

- **Humanize the language.** Write the way a person talks to a colleague, not like a whitepaper or documentation page. Use plain, everyday words, contractions, and short sentences. Avoid overly formal or "professional" phrasing.
- **No dash punctuation.** Do not use the em dash (`—`) or en dash (`–`), and do not use a dash/hyphen (`-`) as a sentence-level punctuation mark in the prose. If a sentence needs a pause, use a comma, a period, or split it into two sentences. This applies to running text only: hyphens inside code, file names, slugs, CLI flags, and compound technical terms stay exactly as they are.
- **Code is exempt.** Code blocks, inline code, commands, and file paths keep their exact characters. The humanization and no-dash rules apply to prose, never to code or examples.

## New Post Checklist

1. Read `src/content/blog/` to find the current max `order`; use `max + 1`.
2. Choose a kebab-case slug; create `src/content/blog/<order>_<slug>.md`.
3. Write the full frontmatter block (all 9 fields above).
4. Write the body: hook → `##` sections → code → optional summary. Keep the prose human and plain, and use no dash punctuation in the running text.
5. For every needed image, inline `<img description={...} />` (cover first, then in-article).
6. Set `coverImage:` to `article-cover/<slug>.<ext>` and record in-article paths as `./article-images/<slug>_<name>.<ext>`.
7. Sanity-check: slug matches filename, `order` matches the prefix, tags are lowercase comma-separated, date is `DD.MM.YYYY`, and the prose has no em dash (`—`), en dash (`–`), or dash punctuation.

## Common Mistakes

| Mistake | Fix |
|---|---|
| `slug` doesn't match the filename | Slug must equal `<order>_<kebab-case>` exactly. |
| `order` out of sequence | Scan existing files; use the next integer. |
| Tags with uppercase or spaces | Lowercase, comma-separated, no spaces. |
| `coverImage` with a leading `./` or wrong dir | Use `article-cover/<slug>.<ext>`, file in `public/article-cover/`. |
| Fabricating an image URL or file | Use `<img description={...} />` placeholder instead. |
| Fenced code without a language | Add a Prism-supported language tag for highlighting. |
| Overly formal, stiff, or "professional" prose | Write like a person talking to a colleague: plain words, contractions, short sentences. |
| Em dash (`—`), en dash (`–`), or dash as punctuation in prose | Rewrite with a comma, a period, or split into two sentences. Dashes inside code and paths stay. |
