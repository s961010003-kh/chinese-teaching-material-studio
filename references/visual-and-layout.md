# Visual generation and layout

## Scene + Framework

- **Scene:** ImageGen-created raster image that makes setting, action, objects, emotion, or consequences visible.
- **Framework:** editable HTML text and CSS geometry for exact labels, examples, arrows, boxes, color coding, comparisons, and reasoning.

Use both only when each has a learning job. Decorative images are optional; precise structure is not. The strongest sequence is not “picture plus explanation,” but “picture causes noticing or uncertainty; student acts; framework names and tests the emerging idea.”

For image-led materials, also read [image-as-instruction.md](image-as-instruction.md).

## ImageGen specification

Generate one distinct image per distinct scene. Ask for 16:9 landscape unless the output requires another ratio. Specify intended teaching use, subjects, action, period or environment, composition, mood, negative space, and constraints. Default constraints:

- no text, letters, labels, logos, watermarks, interface, or modern objects when historically inappropriate;
- visually organized, age-appropriate, and legible at presentation distance;
- culturally and historically respectful;
- no claim of photographic or archaeological accuracy.

Copy selected images into `assets/` and create `imagegen_prompts.md` with the final prompt set and intended instructional function.

## HTML deck baseline

- Fixed `.slide` size: 1600×900 CSS pixels.
- 16:9; one idea per slide; minimum comfortable classroom body text normally 22–24 px.
- Keep text out of generated imagery.
- Use real HTML text, semantic headings, and restrained color roles.
- Reserve a footer safe zone. Top-level content must end at least 10 px above the footer.
- Keep editable HTML and project-local relative asset paths.

The starter in `assets/html-starter/index.html` is a structural baseline, not a mandatory visual theme.

## Deterministic export

1. Render at a 1600×900 viewport using `scripts/render_slides.mjs`.
2. Fail if any slide is not exactly 1600×900, top-level content leaves the slide, or content enters the footer safe zone.
3. Capture each slide to PNG.
4. Run `scripts/build_pdf_from_png.py` to place one PNG on each 960×540 pt PDF page.
5. Render the final PDF back to PNG with Poppler `pdftoppm`.
6. Create a contact sheet and visually inspect every page. Inspect dense pages individually at full size.

Direct browser “Print to PDF” is not the preferred path for fixed teaching decks because font metrics, print media rules, page margins, and fragmentation can shift content.
