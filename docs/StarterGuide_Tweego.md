While working on the game I learned several things and I would like to share my insights here.

<h1>Passages, Locations, Events</h1>
Passages contains the text to display on the screen. This text can be plain text or html-code including script and style partitions.

To add a comment 
in html-code:   '<!-- Your comment -->'
in script/ template methods:    '// your comment'

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


<h1>Closure problem<h1>
If you add scripts to .\src\scripts, they get compiled and bundled together. And inside those scripts they see each other even without import.
But as stated in the snowman description, the template method and also <script>-sections inside a passage only see window (like f.e. window.story.state) !
You dont have access to variables, functions,.. that are not added to window.

My workaround:
- in the game.js I create a window.gm-object that is a holder for all common used functions
- global variable data is stored in window.story.state.player or another structure below state. This is required because snowman saves data only from window.story.state
- create window.gm.libItems as a lookup for Item-constructors f.e. window.gm.libItems: { LaptopPS: function(){return new LaptopPS();},...}. 
Then you can call window.gm.libItems.LaptopPS() or window.gm.libItems['LaptopPS']() from templete-methods.
- 

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

You can also use css-classchange to hide/display parts:
//this will add class div to all <div> with class div_hidden and will therefore override visibility
<a0 onclick='(function ( $event ) { $( "div.div_hidden" ).toggleClass("div"); })(this);'>Info</a>
<div class="div_hidden">You are sporty<div/></br>

(add in css
    .div_hidden { visibility: hidden; }
    .div { visibility: visible; }
)
