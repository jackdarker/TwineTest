"use strict";
/* bundles some operations related to combat */
window.gm = window.gm || {};
window.gm.initCombat = function(id) { //setup enemy for encounter
    var s=window.story.state;
    s.enemy.name = id;
    s.vars.activeTurn =false;
    s.vars.combatState='battling';
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
  window.gm.triggerCombat= function(id) {
    window.gm.hideCombatOption();
    var msg=window.gm.execCombatCmd(id);
    window.gm.printOutput(msg+window.gm.printPassageLink("Next","EncounterStartTurn"));
    window.gm.printCombatHud();
  };
  window.gm.calcEnemyCombat= function() {
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
  window.gm.execCombatCmd = function(id) { //setup enemy for encounter
    var enemy = window.gm.enemy;
    var player = window.gm.player;
    var s = window.story.state;
    var rnd = _.random(1,100);
    var msg = '';
    if(s.vars.activeTurn) {
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
    s.vars.activeTurn =!s.vars.activeTurn;  //toggle whos turn
    return(msg+"</br>");
  };
  window.gm.printCombatHud= function() {
      renderToSelector("#playerstats", "playerstats");
      renderToSelector("#enemystats", "enemystats");
  };