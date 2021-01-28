This is a Twine/Twee - testgame based on the setup from ChapelR/tweego-setup.
Its not a real game but a testground.

It features:
- interactive fiction where you move through locations
- save-system (browser storage)
- a basic inventory
- very basic combat encounter
- javascript code to make writing passages easier

Todo:
- save-system (file storage)
- outfit-system
- combat logic and calculation
- quest tracker
- ???


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

How to debug this
--------------------------------
After opening the html in browser activate developer tools by pressing F12.
You will not find the scripts on tab sources ! To find a function add a watch for the object containing the function. f.e window.gm
You should see the functions in the watch. And you can right click and select "show function defenition".
Now the script should be shown and you can set breakpoints and debug.