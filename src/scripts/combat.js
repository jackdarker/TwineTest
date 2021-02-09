"use strict";
/* bundles some operations related to combat */
window.gm = window.gm || {};
window.gm.initCombat = function(id) { //setup enemy for encounter
    var s=window.story.state;
    s.enemy.name = id;
    s.combat.activeTurn =false;
    s.combat.combatState='battling';
};

window.gm.hideCombatOption= function() {
    document.querySelector("#combatmenu").remove();
};
window.gm.printCombatOption= function() { //creates a list of possible moves
  var elmt="<form id='combatmenu'>";
  elmt +="<a0 id='RunAway' onclick='(function($event){window.gm.triggerCombat($event.id);})(this);'>Try to flee</a></br>";
  elmt +="<a0 id='Attack' onclick='(function($event){window.gm.triggerCombat($event.id);})(this);'>Attack</a></br>";
  //elmt +="<a0 id='Guard' onclick='(function($event){window.gm.execCombatCmd($event.id);"+next+"})(this);'>Guard</a></br>";
  //elmt +="<a0 id='showItems' onclick='(function($event){window.gm.execCombatCmd($event.id);"+next+"})(this);'>Item</a></br>";
  elmt +="</form>";
  return(elmt);

};
window.gm.printCombatScreen = function() { //prints scene-bg and enemy to canvas 
  var canvas = document.getElementById("exampleCanvas");
  var ctx = canvas.getContext("2d");
  var img = new Image();
  img.src = "assets/bg_park.png";   //todo the loading o image takes a while and it will not refreh automatically
  ctx.drawImage(img, 0, 0);
  img = new Image();
  img.src = "assets/bird.gif";   //todo the loading o image takes a while and it will not refreh automatically
  ctx.drawImage(img, 0, 0);

}
window.gm.triggerCombat= function(id) {  //called by combatmenu-buttons
  window.gm.hideCombatOption();
  var msg=window.gm.execCombatCmd(id);
  window.gm.printOutput(msg+window.gm.printPassageLink("Next","EncounterStartTurn"));
  window.gm.printCombatHud();
};
window.gm.calcEnemyCombat= function() { //calculates which combat-cmd the enemy should execute
  var rnd = _.random(1,100);
  var enemy = window.story.state.enemy;
  var msg = '';
  if(rnd>30) {
    msg +=enemy.name+" try to attack you.</br>";
    msg +=window.gm.execCombatCmd('Attack');
  } else {
    msg +=enemy.name+" takes a defensive stance.</br>";
    msg +=window.gm.execCombatCmd('Guard');
  }
  return(msg+"</br>");
};
window.gm.execCombatCmd = function(id) { //executes a combat-cmd
  var enemy = window.gm.enemy;
  var player = window.gm.player;
  var s = window.story.state;
  var rnd = _.random(1,100);
  var msg = '';
  if(s.combat.activeTurn) {
    if(id ==='Attack') {
      if(rnd > 30) {
        msg += s.enemy.name +" hits you in the face.";
        player.health().value = player.health().value-2;
      } else {
        msg += s.enemy.name +"s attack missed.";
      }
    }
  } else {
    if(id ==='Attack') {
      if(rnd > 30) {
        msg += "You hit your foe.";
        enemy.health().value = enemy.health().value-2;
      } else {
        msg += s.enemy.name +" evaded your attack.";
      }
    } else if(id === 'RunAway') {
      if(rnd >40) {
        msg += "You escaped the fight.";
        s.vars.combatState = 'fleeing';  //just setting the flag, you have to take care of handling!
      } else {
        msg += "Your attempts to escape failed.";
      }
    }
  }
  s.combat.activeTurn =!s.combat.activeTurn;  //toggle whos turn
  return(msg+"</br>");
};
window.gm.printCombatHud= function() { //prints the Stats and Effects of the Player&Enemy
    renderToSelector("#playerstats", "playerstats");
    renderToSelector("#enemystats", "enemystats");
};