# Issue tracker: Local Markdown

Issues and planning handoffs for this repo live as markdown files in the repo.

This template must be customized during setup. Do not assume a hidden or default directory; use the path the repo already uses, or the path the user chooses.

## Configured location

- **Base directory:** `<fill during setup, e.g. docs/issues/, issues/, or tasks/>`
- **Issue file pattern:** `<fill during setup, e.g. <NN>-<slug>.md or <slug>.md>`
- **Planning/spec files:** `<fill during setup, e.g. docs/prds/, specs/, or same directory>`

## Conventions

- One issue per markdown file unless the configured workflow says otherwise.
- Triage state is recorded as either frontmatter, a `Status:` line, or an equivalent field chosen during setup.
- Use `triage-labels.md` for the allowed role strings.
- Comments and conversation history append to the bottom of the issue file under a `## Comments` heading unless the configured workflow says otherwise.
- Preserve existing file naming, headings, and metadata conventions if files already exist.

## When a skill says "publish to the issue tracker"

Create a new markdown file under the configured base directory, following the configured file pattern.

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path, slug, or issue number directly.
