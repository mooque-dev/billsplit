# Split the Bill

A small, no-build bill-splitting tool for group dinners: split by table, with food / beer / soju shared only among the people who had them, tax and tip, paid tracking, and e-transfer matching. English / 한국어.

**Live:** https://mooque-dev.github.io/billsplit/

## Run locally

No install needed. Either open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 5180
```

Then visit http://localhost:5180.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole app (markup, app styles, JS). Data is saved in your browser's localStorage. |
| `ds.css` | Design system: shadcn/ui-compatible tokens and components in plain CSS. |
| `design-system.html` | Living reference for every token and component. |

## Design system rules

1. Never hard-code colors; use `hsl(var(--token))`.
2. Build screens from the components in `ds.css`.
3. State goes in `data-state`, color intent in `data-tone`.
4. Keep touch targets at least 2rem and focus rings visible; everything reachable by keyboard.
5. New component? Add it to `ds.css` and `design-system.html` first.

## Team roster

The repo ships with **sample names only**. Real rosters are never committed. In the app: **From roster → Edit roster → Import chart** and paste your team chart (headings like `연출팀 (7)` followed by one name per line; `(A)`/`(B)` tags are supported). It is stored only in that browser.

Keep your real chart in `roster.local.txt` (git-ignored).

## Contributing

1. Create a branch: `git checkout -b my-change`
2. Edit, and check it in the browser (Korean and English, phone width, light and dark).
3. Open a pull request. Merging to `main` redeploys the live site.

Please don't commit real names, emails or payment details.
