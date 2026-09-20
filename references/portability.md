# Portability and installation

## Portable project rules

- Use project-relative asset paths.
- Do not embed `/Users/...`, `$HOME`, runtime-cache paths, or machine-specific browser paths in generated files.
- Discover the bundled Node/Python and document/PDF libraries through the workspace dependency loader when available.
- Pass the Playwright module path and browser executable to `render_slides.mjs` as arguments or environment-specific values.
- Prefer Poppler `pdftoppm` for PDF render QA; locate it before use.
- Check Traditional Chinese font availability and specify fallbacks such as Noto Sans TC, PingFang TC, Microsoft JhengHei, and sans-serif.

## Transfer bundle

Transfer the whole `chinese-teaching-material-studio` directory or its zip archive. Install by copying the directory into the target Codex skills directory (normally `~/.codex/skills/`) without nesting it inside an extra folder. Restart or refresh Codex so discovery metadata reloads.

## Target-machine smoke test

1. Confirm `SKILL.md` and `agents/openai.yaml` exist.
2. Run Skill Creator's `quick_validate.py` if available.
3. Invoke `$chinese-teaching-material-studio` on a short sample.
4. Generate a two-slide HTML deck without ImageGen first.
5. Run DOM QA and screenshot rendering.
6. Build and render a sample PDF.
7. When images are requested, confirm ImageGen output is copied into the sample project's `assets/` folder.

If a required runtime is unavailable, preserve the editable HTML and report exactly which export or QA stage could not run. Do not claim the PDF passed visual QA.
