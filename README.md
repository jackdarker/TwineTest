This is a Twine/Twee - testgame based on the setup from ChapelR/tweego-setup.
Its not a realgame but a testground.

Setting up everything
--------------------------------
You need to install nm,gulp and tweego according to ChapelR's description (README_old.md) and dont forget "npm install".

This project uses storyformat "snowman2" (included in tweego). Run format.bat and select the storyformat snowman-2.

How to Edit this
--------------------------------
Use an texteditor to edit twee's here .\project\twee. I use VSCode with Twee3 language tools.
Place additional css/ js in the styles/scripts-folders.
Place images/sounds,... here ./dist/assets
Then execute run build.bat. This will compile the html in ./dist and should open the game in your browser.

If you have a project in twine editor you can export an archiv and use tweego to create a twee: 
tweego -d -o archiv.twee archiv.html
You can load the html created by tweego into twine-editor