# BioStitched Builder’s Guide website

The website for BioStitched, an open-source CNC tambour embroidery machine.

## What’s in this folder

- `index.html`: all the words on the page. Edit this to change text.
- `styles.css`: colours, fonts and layout.
- `script.js`: the stitch-cycle walkthrough and the parts checklist.
- `sketch-top.png`, `render-carriage.png`, `render-side.png`: the images.

## Put it online with GitHub Pages

1. Sign in to github.com, or create a free account.
2. Create a new repository called `biostitched`. Make it **Public**.
3. On the new repository’s page, choose **uploading an existing file**.
4. Drag in every file from this folder, then click **Commit changes**.
5. Go to **Settings**, then **Pages** in the left sidebar.
6. Under **Build and deployment**, set the source to **Deploy from a branch**. Choose the `main` branch and the `/ (root)` folder, then click **Save**.
7. Wait a minute or two, then refresh the page. Your site’s address appears at the top: `https://YOUR-USERNAME.github.io/biostitched/`

## Fill in the placeholders

Open `index.html` and search for `[`. Replace each placeholder:

- `[DATE]`: when the files will be released (appears five times)
- `[LICENCE]`: the licence for the hardware, the guide and the code
- `[COST SUMMARY]`: the total cost to build, once you know it
- `[EMAIL OR INSTAGRAM]`: how people can contact you

## Change something later

Open the file on GitHub, click the pencil icon, make your change and click **Commit changes**. The live site updates within a few minutes.

## Notes

- Ticks in the parts checklist are saved in each visitor’s own browser, so nobody sees anyone else’s.
- Fonts load from Google Fonts.
