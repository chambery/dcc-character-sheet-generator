A simple app to fill character sheet PDFs with generated valid data.

~~Currently only~~ Supports Mark Anticole's 1st+ level Weird Frontiers character sheets, plus a bunch of the funnel 4-ups from [Julio's RPG Cove](https://juliosrpgcove.com/resources/#:~:text=CAMPAIGN%20SUPPLEMENTS-,CHARACTER,-SHEETS), ([Purple Sorceror pretty much has everything else covered](https://purplesorcerer.com/create_party.php)) but you can fill any PDF:


1. Use the [grid](https://github.com/chambery/dcc-character-sheet-generator/blob/052d387cb07f2af17190e3b889cf1d9234b5651f/src/assets/PDF%20Coordinates.png) as an overlay in a image editor to get field coordinates.  Alternatively, run the generator with 'coords' to generate a "coordinated" pdf.
2. Copy your blank sheet to `src/assets`
3. Create a file in `src/character_sheets` that follows the pattern of one of the existing files
   - set the `filename` attribute to the name of the file you copied to `src/assets`
5. Run `bun src/main.ts classname level`, eg. `bun src/main.ts classname 0`

## Designer
Open the `designer.html` file in your browser to get (close) coordinates on your sheet.  For best results, remember to select the point of the lower left corner of the text to drawn.


# Bun + TypeScript
1. Install [Bun](https://bun.sh/)
2. Install dependencies
   1. Run `bun install`
3. Copy pdf files (eg. `luchador_blank_v1.pdf`) to the `assets` folder
4. Run the app
   - From the root of the project, run `bun src/main.ts [class-name]`, eg `bun src/main.ts luchador`
5. it will output the full path of the filled-out character sheet, eg. `/Users/chambery/projects/dcc-character-sheets-generator/out/luchador-20250501132734.pdf`

## Fonts
Fonts from Google need to be downloaded from the Github repo, not https://fonts.google.com.  Eg. https://github.com/google/fonts/blob/bcc7728b619035379330e8a404e0ba6051126414/ofl/reeniebeanie/ReenieBeanie.ttf

Otherwise, you'll get an error from pdf-lib.

n.b. you can print directly to the default printer (in `fish`) using `lpr (bun src/main.ts luchador)`



Special thanks to the greatest TTRPG of the modern era, [Dungeon Crawl Classics](https://goodman-games.com/dungeon-crawl-classics-rpg/) and its excellent designers Goodman Games!
