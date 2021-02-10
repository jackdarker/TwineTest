While working on the game I learned several things and I would like to share my insights here.
<h1>Links</h1>
Some links with information to javascript/html/css:</br>
https://developer.mozilla.org/en-US/docs/Web/Reference</br>
https://wiki.selfhtml.org/  (german) </br>
https://api.jquery.com/</br>
</br>
Some links with information to twine/tweego/snowman:</br>
http://twinery.org/cookbook/</br>
https://videlais.github.io/snowman/2</br>
http://underscorejs.org/</br>
</br>

<h1>Passages, Locations, Events</h1>
Passages contains the text to display on the screen. This text can be plain text or html-code including script and style partitions.

If you enter something like "[[Next|Encounter]]" it will be converted when the passage is RENDERED to 
<a href="javascript:void(0)" data-passage="Encounter">Next</a>
If you have to create dynamic passage links by adding them to html you cannot use [[]] but have to create the <a> on yourself.
Instead of using the <a> above you could also do something like this: fadeout, the passage change (yyou have to do fadeIn on sm.passage.showing-event)
<a href="javascript:void(0)" onclick='($("tw-passage").fadeOut(2000, function() {window.story.show("SleepUntilEvening");}));'>Sleep Until Evening</a> </br>

If you have a choice in a passage but you dont want to add a own passage for a choice you can change the current passage in place:
<div id="choice">
<a href="javascript:void(0)" id="yes" onclick='choice(this,"div#choice")'>Yes I will come by.</a></br>
<a href="javascript:void(0)" id="no" onclick='choice(this,"div#choice")'>Im not sure about this.</a></br>
</div>
<script>
function choice(elmt,replaceThis) {
	var msg ='';
	if(elmt.id==="yes") {
	window.story.state.vars.qDogSit=0x300;
	msg = "You aggreed to visit them.</br>";
	} else {
		window.story.state.vars.qDogSit=0x300;
		msg = "You have to think about this. You can pay them a visit anyway.</br>";
	}
	$(replaceThis).replaceWith(msg+window.gm.printPassageLink("Next","Kitchen"));
}
</script>

To add a comment in passage:
in html-code:   '<!-- Your comment -->'
in script/ template methods:    '// your comment'

Snowman supports this style-markup:
            *Emphasis* or _Emphasis_.
            **Strong emphasis** or __Strong emphasis__.
            ~~Strikethrough~~
            1. First ordered list item
            2. Another item

            # H1
            ## H2
            ### H3
            #### H4
            ##### H5
            ###### H6

            Escaped code line.
            Another line of code.

            |    Tables     |    Are        |     Cool      |
            | ------------- |:-------------:| -------------:|
            | col 3         |   is          | right-aligned |
            | col 2         |   is          |   centered    |
            | col 1         |   is          |  left-aligned |

            > Blockquotes are useful.
            > This line is part of the same quote.


<h1>Running code</h1>
Template-method from snowman to be used inside html-code:
Use <% foo(); bar(); %> to execute code
Use <%= bar.x %> to print the content into html-page. There should be no terminating ;
Use <%- to combine both of the above%>    <-- this is not working ?!

Trigger operations by connecting onclick of a empty link with a function definition:
<a0 onclick='myFunc'>Button</a>
If you want to:
- send event-parameters 
- or call multiple functions
you have to wrap the call into anonymous function. Dont forget encasing () + parameter-() and note the use of ' and "
<a0 id='money' onclick='(function ( $event,value ) { alert("alert ".concat($event.id+value)); })(this,"5");'>Get much money</a>
If you want to build content via scriptcode dont forget to add \" where necessary:
elmt +="<a0 onclick='(function($event){$event.replaceWith(\""+msg+"\");})(this);'>"+desc2+"</a></br>";

! if you add a <script>-section to passage, make sure it has no empty lines. Or you will get misleading errors in browser ! 

<h1>Closure problem<h1>
If you add scripts to .\src\scripts, they get compiled and bundled together. And inside those scripts they see each other even without import.
But as stated in the snowman description, the template method and also <script>-sections inside a passage only see window (like f.e. window.story.state) !
You dont have access to variables, functions,.. that are not added to window.

My workaround:
- in the game.js I create a window.gm-object that is a holder for all common used functions
- global variable data is stored in window.story.state.player or another structure below state. This is required because snowman saves data only from window.story.state
- create window.gm.libItems as a lookup for Item-constructors f.e. window.gm.libItems: { LaptopPS: function(){return new LaptopPS();},...}. 
Then you can call window.gm.libItems.LaptopPS() or window.gm.libItems['LaptopPS']() from templete-methods.

<h1>Adding external scripts</h1>
Place external modules in src/modules. They will be added to <head>-section. 
If they execute a function when loading the file, this should register them in a GlobalScope.
F.e. functions from FileSaver.js can be called just like entering "saveAs(...);" .

<h1>Debugging code</h1>
Debugging code within Templates or even <script>-sections seems impossible. Since this data is embedded into passage sections, it is not seen by the debugger until the page is rendered. If there happens an error then, the DOM will only contain a error message without the script.

You should stick to write user-scripts and call those scripts from templates. Then you can set breakpoints in this user-script like usual.

<h1>Saving/restoring data<h1>
Snowman creates a hash that is used to reconstruct the values of the variables.
This doesnt work if your variables consist of objects that have their own functions. Those functions will be missing after restore.
F.e. if you add window.story.state.playerInv = new Inventory(); after restore playerInv might have data but no Inventory-Methods
choices?
- dont use objects with methods
- only store data in window.story.state and link them to classes in window.gm
- after restore use Object.assign(new Inventory(),olddata) to recreate objects (how to do with nested objects?)
- rebuild the objects with the parse-revive option ?
- use a different saving-mechanism 

<h1>Showing additional info</h1>
Sometimes you want to show some more details/tooltips.

- on passageentry memorize your actual passagename f.e like <%s.player.location=window.passage.name%>
- add a passage where you describe the info and create a link like that: [[Back|<%=s.player.location%>]]
- create a link to the info-passage in the actual passage

Use hidden attribut and toggle to show additional information. f.e. this creates a link that shows/hides a <p> when clicked:
elmt +=`<a0 id='${id}' onclick='(function($event){document.querySelector(\"div#${id}\").toggleAttribute(\"hidden\");})(this);'>${id}</a><div hidden id='${id}'>${descr}</div>`;

You can also use css-classchange to hide/display parts:
//this will add class div to all <div> with class div_hidden and will therefore override visibility
<a0 onclick='(function ( $event ) { $( "div.div_hidden" ).toggleClass("div"); })(this);'>Info</a>
<div class="div_hidden">You are sporty<div/></br>
(add in css
    .div_hidden { visibility: hidden; }
    .div { visibility: visible; }
)

<h1>How to display a image scene</h1>
If you want to display stacked images, f.e. a enemy goblin.jpg standing before his cave.jpg, you have those options:
- use a canvas-element and let a function draw the images like this. 
The drawback here is that images are start loading on the first execution and it might require several more executions until they show up.
And animated gifs will not be animated.
<canvas id="exampleCanvas" width="240" height="225"></canvas> 
<script>
function onimage(imgsrc) {
    var canvas = document.getElementById("exampleCanvas");
    var ctx = canvas.getContext("2d");
    var img = new Image();
    img.src = imgsrc;
    ctx.drawImage(img, 0, 0);
};
onimage("assets/bird.gif");
</script>

- use background-styling; animated gifs can be used
Note that the urls get filled out by simple template-methods - not a single line of code is necessary to show the enemy-image before a scene-image 
<div id='combatCanvas' style='height:300px; background: url(<%=s.enemy.pic%>) no-repeat center,url(<%=s.combat.scenePic%>) no-repeat center;color:black;'></div>