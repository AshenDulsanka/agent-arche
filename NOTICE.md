# Attribution notice

Agent Arche is an original integration that adapts ideas and, in some skill packages, workflow structure from the projects below. Upstream projects remain governed by their own licenses and attribution requirements.

| Area in Agent Arche | Credit |
|---|---|
| Engineering, planning, debugging, review, and deep-module workflow foundations | [mattpocock/skills](https://github.com/mattpocock/skills) |
| Fixed-height grouped skill selector and terminal redraw design | [vercel-labs/skills `search-multiselect.ts`](https://github.com/vercel-labs/skills/blob/main/src/prompts/search-multiselect.ts) |
| Sparse machine-searchable source breadcrumb and deterministic harvesting inspiration | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) |
| Design workflow inspiration | [cyxzdev/Uncodixfy](https://github.com/cyxzdev/Uncodixfy), [pbakaus/impeccable](https://github.com/pbakaus/impeccable), [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| Explicit compressed communication mode | [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) |
| Karpathy-style coding guardrails and PostgreSQL patterns | [Akindu23/my-agent-skills](https://github.com/Akindu23/my-agent-skills) |
| CLI prompt and color libraries | [Clack](https://github.com/bombshell-dev/clack), [picocolors](https://github.com/alexeyraspopov/picocolors) |
| Codex hook, custom-agent, and subagent configuration behavior | [Official OpenAI Codex documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents) |
| Bundled `shopify-admin`, `shopify-liquid`, `shopify-custom-data`, `shopify-use-shopify-cli`, and `shopify-dev` skills | [Shopify AI Toolkit](https://github.com/Shopify/shopify-ai-toolkit), v1.7.0 snapshot at `51a7d6cbed88fec14658f4e2d243dcdab128cf77`, copyright Shopify Inc., MIT License in `licenses/SHOPIFY_AI_TOOLKIT_LICENSE`; unsupported cross-agent `compatibility` and `hooks` frontmatter removed for Codex validation |

The installed versions are intentionally adapted for selective installation, bounded context retrieval, and opt-in orchestration; they should not be treated as verbatim upstream distributions. See each linked repository for its current license and original authorship. Agent Arche itself is distributed under the repository's MIT license.

The five Shopify skills listed above preserve the cited snapshot's instructions, scripts, assets, and telemetry notices; only unsupported cross-agent frontmatter was removed. The Claude copies under `claude/skills/` also run their scripts through `node "${CLAUDE_SKILL_DIR}/scripts/..."` so they resolve from any working directory. Their scripts may send usage telemetry to Shopify as disclosed inside each skill; set `OPT_OUT_INSTRUMENTATION=true` to opt out.
