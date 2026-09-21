title: HTML won
date: 2026-09-22
site: switchboard
summary: Every AI lab picked the same output format for generated apps — one HTML file. That choice decides how software gets distributed next.
---
"It's just HTML" has always been a dismissal. Look at what happened while nobody was defending it.

When the labs built products that generate working software, they all converged on the same output format. Claude renders Artifacts as a single HTML file. ChatGPT's Canvas, v0, Gemini — same choice. Not because anyone loves HTML, but because it is the one format a model can write whole and a person can run with nothing installed. No build step, no toolchain, no deploy pipeline. One file.

Developers were already drifting this way before the labs made it official. [htmx out-starred React on GitHub in 2024](https://www.wearedevelopers.com/en/magazine/537/is-htmx-worth-learning-in-2025-537), and the [2025 State of JS](https://devtoolswatch.com/en/htmx-vs-react-2026) shows React still everywhere — 83.6% usage — but with satisfaction falling on the weight of its own ecosystem. The no-build movement isn't a takeover. It's fatigue, measured.

Here's why the format choice matters more than it looks.

The number that should worry anyone shipping AI apps: paying subscribers keep AI apps at [21.1% after a year, against 30.7% for everything else](https://techcrunch.com/2026/03/10/ai-powered-apps-struggle-with-long-term-retention-new-report-shows/). For AI products under $50 a month, [77% of revenue is gone within twelve months](https://chartmogul.com/reports/saas-retention-the-ai-churn-wave/). People try; they don't stay. And a large part of what kills the first try sits before the product even runs — sign up, connect an API key, hit a paywall, trust a new company with your data. Roughly [one in five people abandon the moment they're forced to create an account](https://baymard.com/learn/ux-statistics), and that's for things they had already decided to buy.

A single HTML file carries none of that. Nothing to install, nothing to deploy, no server to fund, no key to protect. AI collapsed the cost of writing an app to one file. The same file collapses the cost of distributing it.

There's one honest gap. A bare HTML file can't act. No model, no tools, no memory. It's a page, not a program that does work for you.

That gap is exactly what Switchboard fills. A wrapp is one HTML file, and window.claude hands it the user's own AI — Claude Code or Codex, already on their machine — plus tools, files and storage, through a consent broker the user controls. No API key in your code. No inference bill; [inference eats around 23% of revenue at scaling AI companies](https://www.thesaascfo.com/how-to-calculate-the-inference-efficiency-ratio/), and here it's carried by the subscription the user already pays for. No sign-up wall between someone clicking a link and the app working. The user's first app costs one setup. Every app after costs a click.

We call them HTML harnesses. [Brandbrain](https://brandbrain.thelastprompt.ai) — a full brand studio, market research to deck to website to ads — is built this way. So is every app in the store.

"It's just HTML" was supposed to be the insult. It turned out to be the distribution strategy.

The file grew hands. [The code is open](https://github.com/sameeeeeeep/switchboard) — and if you want to build yours with someone beside you, that is [what the workshops are for](/workshops/).
