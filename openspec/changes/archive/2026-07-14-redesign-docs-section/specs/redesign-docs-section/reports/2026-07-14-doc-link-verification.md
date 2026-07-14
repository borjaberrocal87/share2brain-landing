# Doc link verification — redesign-docs-section

**Date:** 2026-07-14
**Repository (source of truth):** `github.com/borjaberrocal87/share2brain` (public, default branch `main`)
**Method:** `gh api` recursive git tree for file existence; heading extraction for anchor resolution.

## Result: all links resolve — no corrections required

| Group | Item | href (path[#anchor]) | File exists | Anchor resolves | Verdict |
|---|---|---|---|---|---|
| Empezar / Getting started | Quick start | `README.md#quick-start` | ✅ | ✅ `## Quick start` | resolves |
| Empezar / Getting started | Self-hosting guide | `docs/self-hosting.md` | ✅ | n/a | resolves |
| Empezar / Getting started | Environment & config | `docs/self-hosting.md#environment-variables-and-config` | ✅ | ✅ `## Environment variables and config` | resolves |
| Empezar / Getting started | Discord app & RBAC | `docs/self-hosting.md` | ✅ | n/a | resolves |
| Arquitectura / Architecture | Architecture Spine | `docs/context/ARCHITECTURE-SPINE.md` | ✅ | n/a | resolves |
| Arquitectura / Architecture | Technical Design | `docs/context/TECHNICAL-DESIGN.md` | ✅ | n/a | resolves |
| Arquitectura / Architecture | Data model | `docs/data-model.md` | ✅ | n/a | resolves |
| Arquitectura / Architecture | PRD | `docs/context/PRD.md` | ✅ | n/a | resolves |
| API y Agente / API & Agent | API specification | `docs/api-spec.yml` | ✅ | n/a | resolves |
| API y Agente / API & Agent | RAG agent (LangGraph) | `docs/context/TECHNICAL-DESIGN.md` | ✅ | n/a | resolves |
| API y Agente / API & Agent | Event-driven ingestion | `docs/context/ARCHITECTURE-SPINE.md` | ✅ | n/a | resolves |
| API y Agente / API & Agent | RBAC in the vector query | `docs/context/TECHNICAL-DESIGN.md` | ✅ | n/a | resolves |
| Desarrollo / Development | Development guide | `docs/development_guide.md` | ✅ | n/a | resolves |
| Desarrollo / Development | Contributing | `CONTRIBUTING.md` | ✅ | n/a | resolves |
| Desarrollo / Development | Standards | `docs/base-standards.md` | ✅ | n/a | resolves |
| Desarrollo / Development | Roadmap | `ROADMAP.md` | ✅ | n/a | resolves |

All hrefs are prefixed with `https://github.com/borjaberrocal87/share2brain/blob/main/` (the app repository), satisfying the `content-accuracy` requirement that links target the application repository.

## Notes
- The two anchored links were confirmed against the live headings: `README.md` → `## Quick start`; `docs/self-hosting.md` → `## Environment variables and config`. GitHub slugifies these to `quick-start` and `environment-variables-and-config` respectively.
- No item needed to be corrected or dropped. The design's paths ship verbatim.
