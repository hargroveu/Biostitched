# BioStitched Builder’s Guide website

The website for BioStitched, an open-source CNC tambour embroidery machine.

## What’s in this folder

- `index.html`: all the words on the page. Edit this to change text.
- `styles.css`: colours, fonts and layout.
- `script.js`: the stitch-cycle walkthrough, the test-code viewer and the blog links.
- `prototype-2-render.png`, `sequin-drop-mechanism.png`: your renders.
- `embellishments-all.png` and `emb-01` to `emb-06`: the embellishment render and the six shapes cut out of it.
- `01_flash_test.ino` to `05_stitch_cycle.ino`: the Arduino test sketches.

## Update the live site

1. In the repository, click **Add file**, then **Upload files**.
2. Drag in every file from this folder and click **Commit changes**. Files with the same name replace the old ones.
3. Delete the three old images: open `sketch-top.png`, click the **…** menu, choose **Delete file** and commit. Do the same for `render-carriage.png` and `render-side.png`.
4. Wait a few minutes, then reload the site. If you still see the old version, hold Shift while you reload.

## Fill in the placeholders

Open `index.html` and search for `[`:

- `[DATE]`: when the files will be released
- `[LICENCE]`: the licence for the hardware, the guide and the code
- `[COST SUMMARY]`: the total cost to build
- `[EMAIL OR INSTAGRAM]`: how people can contact you

## Replace a placeholder image with your own photo

Upload your photo, then in `index.html` replace one whole `<div class="ph">…</div>` block with:

    <div class="frame"><img src="your-photo.jpg" alt="Describe the photo"></div>

## Switch on a download in the Files section

Upload the file, then change its button from

    <a class="btn btn--ghost btn--small is-disabled" aria-disabled="true">Download coming soon</a>

to

    <a class="btn btn--ghost btn--small" href="your-file.stl" download>Download</a>

For the embellishments, change each card’s `href` from the `.png` to the `.stl` file and the text from “Download preview” to “Download STL”.

## Turn on the open blog

1. In the repository, go to **Settings**, then **General**. Under **Features**, tick **Discussions**.
2. The blog buttons on the site now open the build log (Discussions). Posts go in the **Show and tell** category, and people can attach photos, videos and code.
3. Optional, to show posts on the website itself: install the giscus app from github.com/apps/giscus on this repository, then go to giscus.app, enter the repository, choose a category, and copy the `<script>` it gives you. Paste it into `index.html` where it says `GISCUS`.
