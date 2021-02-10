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
  var result = {};
  if(s.combat.activeTurn) {
    if(id ==='Attack') {
      result=window.gm.calcAttack(s.combat.activeTurn);
      msg+=result.msg;
    }
  } else {
    if(id ==='Attack') {
      result=window.gm.calcAttack(s.combat.activeTurn);
      msg+=result.msg;
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
window.gm.calcAttack = function(enemysTurn) { //calculates damage of attack
  var attacker = enemysTurn ? window.gm.enemy  :window.gm.player;
  var defender = enemysTurn ? window.gm.player :window.gm.enemy;
  var s = window.story.state;
  var OK = false;
  var msg = '';
  var crit= false,hit=false,block=false;
  var def = defender.Stats.get('pDefense').value;
  var att = attacker.Stats.get('pAttack').value;
  //GURPS-Lite ? this would means all skills are limited to 20!
  //atacker rolls 3d6; if < Attackskill you hit; if 3or4 you have critical hit; else you missed completely
  var rnd = window.gm.roll(3, 6);
  if(rnd==3 || rnd==4) {
    crit=hit=true;
    msg+= attacker.name+' landed a critical hit.</br>';
  } else if(rnd<= att) {
    hit=true;
  } else {
    msg+= attacker.name+' missed his target.</br>';
  }
  //defender rolls 3d6 (no roll on critical hit); if < Defense, the hit was avoided
  rnd = window.gm.roll(3, 6);
  if(crit==false) {
    if(rnd==3 || rnd==4) {
      hit=false;
      msg+= defender.name+' avoided beeing hit.</br>';
    } else if(rnd<= def) {
      block=true;
      msg+= defender.name+' was hit but shrugged of the damage.</br>';
    }
  }
  //attacker rolls dies according to weapon; damage is the result reduced by DR
  if(hit==true && block==false) {
    rnd = Math.max(0,rnd = window.gm.roll(1, 6)+1-0);  //todo
    defender.Stats.increment('health',-1*rnd);
    msg+= attacker.name+' dealt '+rnd+' damage to '+defender.name+'.</br>';
  }

  return({OK:hit&& !block , msg:msg})
}
window.gm.printCombatHud= function() { //prints the Stats and Effects of the Player&Enemy
    renderToSelector("#playerstats", "playerstats");
    renderToSelector("#enemystats", "enemystats");
};