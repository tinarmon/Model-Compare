# Model-Compare

Offline report comparing **68 self-hostable LLMs** (strict OSI licence: `MIT` or `Apache-2.0`, `≤ 350 GB` at Q4) against two DeepSeek baselines (`DeepSeek-V4.1-Flash-1017`, `DeepSeek-V4-Flash-0731`). Data snapshot: **2026-11-27**.

Open `index.html` in a browser. No server, build step or internet needed.

## Using these stats

Read this before you quote or reuse the numbers.

- **Cite the source.** Every score in `data.js` carries a source URL. Quote the primary source, not this page.
- **Snapshot, not live.** Scores change as vendors re-run benchmarks. Check the date (`2026-11-27`) and re-verify before relying on a number.
- **`—` means not measured.** Nothing is estimated or interpolated. 5 models have no comparable score.
- **Benchmark versions are never mixed.** For example, `Terminal-Bench 4.0` is not `2.1`, and `SWE-bench Pro v1` is not `v2`. Off-version results appear in notes only.
- **Scores come from different harnesses.** Vendor-reported and third-party results (Vals, Artificial Analysis, LMArena) are not equivalent. Treat small gaps as noise.
- **Sizes are Q4 disk estimates.** They are not a hardware recommendation.
- **Licence scope.** Only `MIT` / `Apache-2.0` models are listed as candidates. Others appear under "คัดออก" with the reason. Confirm the licence on the model card before commercial use.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page entry |
| `styles.css` | Styling |
| `data.js` | All model data and sources (edit here to update) |
| `app.js` | Tables, charts, groups, sorting |
| `assets/fonts/` | Bundled fonts (offline) |

## Updating data

Edit `data.js`. Every non-null score needs a finite number, a source name and an `https://` URL. Keep `meta` counts in sync with the model lists.
