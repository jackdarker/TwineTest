While working on the game I learned several things and I would like to share my insights here.

<h1>Passages, Locations, Events</h1>



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
