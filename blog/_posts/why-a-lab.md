title: Why a lab, and why in the open
date: 2026-09-09
site: tlp
summary: The interface layer between humans and frontier models doesn’t have a settled shape yet. Pretending otherwise is how you ship the wrong thing confidently.
---
We call it a lab because the honest version of this work is research: the interface layer between humans and frontier models doesn’t have a settled shape yet, and pretending otherwise is how you ship the wrong thing confidently.

So we build in public, ship what works, and keep the code where you can read it.

The first thing we shipped toward promptless is [Switchboard](/switchboard/): an agentic interface layer for macOS that runs AI apps on your own AI, your own context, and your own data. Not in a walled tab, but across the machine where your work actually happens. It sees your screen, holds what matters, and acts with your permission.

If Switchboard is the layer, wrapps are what run on it: small, sharp, single-purpose tools that don’t start cold. Because they sit on the layer, they inherit your context and permissions instead of demanding them line by line.

Every wrapp is a bet that a whole category of prompting can be retired: not by making the box smarter, but by making the box unnecessary for that job.

The measure isn’t how impressive the demo is. It’s how much explaining a real person stops having to do.
