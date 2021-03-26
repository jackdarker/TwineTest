"use strict";
/* bundles some operations related to combat */
window.gm = window.gm || {};
window.gm.combat = window.gm.combat || {};
window.gm.combat.initCombat = function(combatSetup) { //setup enemy for encounter
    var s=window.story.state;
    s.enemy = combatSetup();
    //s.enemy.name = window.gm.enemy.name;  
    //s.enemy.pic = window.gm.enemy.pic;
    s.combat.enemyTurn =false;
    s.combat.turnCount=0;
    s.combat.combatState='battling';
};

window.gm.combat.hideCombatOption= function() {
    document.querySelector("#combatmenu").remove();
};
window.gm.combat.printCombatOption= function() { //creates a list of possible moves
  var elmt="<form id='combatmenu'>";
  //Todo create list based on abilitys
  var canAct = window.gm.player._canAct();
  if(canAct.OK===true) {
  elmt +="<a0 id='moveFlee'           onclick='(function($event){window.gm.combat.triggerCombat($event.id);})(this);'>Try to flee</a></br>";
  elmt +="<a0 id='movePhysicalAttack' onclick='(function($event){window.gm.combat.triggerCombat($event.id);})(this);'>Attack</a></br>";
  elmt +="<a0 id='moveGuard'          onclick='(function($event){window.gm.combat.triggerCombat($event.id);})(this);'>Guard</a></br>";
  elmt +="<a0 id='moveStun'           onclick='(function($event){window.gm.combat.triggerCombat($event.id);})(this);'>Stun</a></br>";
  //Todo Item-use on self or enemy
  //elmt +="<a0 id='showItems' onclick='(function($event){window.gm.execCombatCmd($event.id);"+next+"})(this);'>Item</a></br>";
  } else {
    elmt +=canAct.msg+"</br>";
  }
  elmt +="<a0 id='moveNOP'          onclick='(function($event){window.gm.combat.triggerCombat($event.id);})(this);'>Do nothing</a></br>";
  elmt +="</form></br>";
  return(elmt);

};
//creates a list of active effects for combat display
window.gm.combat.printCombatEffects= function(char) {
  var list=[];
  var effects = char.Effects.getAllIds();
  for(var i=0; i<effects.length; i++) {
    var effect = char.Effects.get(effects[i]);
    if(effect.onCombatEnd!==null && effect.onCombatEnd!==undefined) {
      list.push(effect.shortDesc);
    }
  }
  return(list.reduce((sum, current) => sum + current +', ', ''));
};
//UNUSED
window.gm.combat.printCombatScreen = function() { //prints scene-bg and enemy to canvas      
  var canvas = document.getElementById("exampleCanvas");
  var ctx = canvas.getContext("2d");
  var img = new Image();
  img.src = "assets/bg_park.png";   //todo the loading o image takes a while and it will not refreh automatically
  ctx.drawImage(img, 0, 0);
  img = new Image();
  img.src = "assets/bird.gif";   //todo the loading o image takes a while and it will not refreh automatically
  ctx.drawImage(img, 0, 0);

}
window.gm.combat.triggerCombat= function(id) {  //called by combatmenu-buttons expects a functioname
  window.gm.combat.hideCombatOption();
  var result=window.gm.combat.execCombatCmd(window.gm.combat[id]);
  window.gm.printOutput(result.msg+window.gm.printPassageLink("Next","EncounterStartTurn"));
  window.gm.combat.printCombatHud();
};
//calculates and executes combat-cmd of enemy
window.gm.combat.calcEnemyCombat= function() { 
  var enemy = window.story.state.enemy;
  var move = enemy.calcCombatMove();
  return(move.msg+"</br>");
};
//executes a combat-cmd for player/enemy
window.gm.combat.execCombatCmd = function(move) { 
  var s = window.story.state;
  var result = move();
  s.combat.enemyTurn =!s.combat.enemyTurn;  //toggle whos turn
  return(result);
}
window.gm.combat.startRound = function() {
  var s = window.story.state;
  s.combat.turnCount+=1;
  //update combateffects
  var list = [window.story.state.enemy, window.gm.player];
  for(var k=0; k<list.length;k++){
    var effects = list[k].Effects.getAllIds();
    for(var i=0; i<effects.length; i++) {
      var effect = list[k].Effects.get(effects[i]);
      if(effect.onCombatEnd!==null && effect.onCombatEnd!==undefined) {  //typeof effect === CombatEffect doesnt work? so we check presencse of attribut
        effect.onTurnStart();
      }
    }
  }
};
window.gm.combat.endRound = function() {
};
window.gm.combat.endCombat = function(){
  //remove combateffects
  var list = [window.story.state.enemy, window.gm.player];
  for(var k=0; k<list.length;k++){
    var effects = list[k].Effects.getAllIds();
    for(var i=0; i<effects.length; i++) {
      var effect = list[k].Effects.get(effects[i]);
      if(effect.onCombatEnd!==null && effect.onCombatEnd!==undefined) {
        effect.onCombatEnd();
      }
    }
  }
};

//OBSOLETE executes a combat-cmd for player/enemy
window.gm.combat.execCombatCmd2 = function(id) { 
  var s = window.story.state;
  var rnd = _.random(1,100);
  var msg = '';
  var result = {};
  if(s.combat.enemyTurn) {
    if(id ==='Attack') {
      result=window.gm.calcAttack(s.combat.enemyTurn);
      msg+=result.msg;
    }
  } else {
    if(id ==='Attack') {
      result=window.gm.calcAttack(s.combat.enemyTurn);
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
  
};
//does nothing
window.gm.combat.moveNOP = function() { 
  var result= {OK:false,msg:''};
  return(result);
}
//increase defense
window.gm.combat.moveGuard = function() { 
  //Todo
  var s = window.story.state;
  var result= {OK:true,msg:''};
  if(s.combat.enemyTurn) {
  } else {
  }
  return(result);
}
window.gm.combat.moveStun = function() { 
  var s = window.story.state;
  var attacker = s.combat.enemyTurn ? window.story.state.enemy  :window.gm.player;
  var defender = s.combat.enemyTurn ? window.gm.player :window.story.state.enemy;
  var result= {OK:true,msg:''};
  var rnd = _.random(1,100);
  if(rnd >4) {
    result.msg += defender.name+" got stunned by "+attacker.name;
    defender.addEffect(effStunned.name,new effStunned())
  } else {
    result.msg += "Attempt to stun "+defender.name +" failed.";
    result.OK=false;
  }
  return(result);
}
window.gm.combat.moveFlee = function() { 
  //Todo
  var s = window.story.state;
  var result= {OK:true,msg:''};
  var rnd = _.random(1,100);
  if(s.combat.enemyTurn) { //todo fleeing enemy?
  } else {
    if(rnd >40) {
      result.msg += "You escaped the fight.";
      s.vars.combatState = 'fleeing';  //just setting the flag, you have to take care of handling!
    } else {
      result.msg += "Your attempts to escape failed.";
      result.OK=false;
    }
  }
  return(result);
}
//calculates damage of attack
window.gm.combat.movePhysicalAttack = function() { 
  var s = window.story.state;
  var attacker = s.combat.enemyTurn ? window.story.state.enemy  :window.gm.player;
  var defender = s.combat.enemyTurn ? window.gm.player :window.story.state.enemy;
  var msg = '';
  var crit= false,hit=false,block=false;
  var def = defender.Stats.get('pDefense').value;
  var att = attacker.Stats.get('pAttack').value;
//??  Erfolgswahrscheinlichkeit skalieren mit Differenz der Attribute Player-Enemy
// gleiche Attribute = Wahrscheinlichkeit*100%; Attribut-Diff +2 = *100%*2; Attribut-Diff +4 = *200%
/*
=100^((100+2*C4)/100) =100^((25+C4)/25)
0	100	100
1	109,6478196143	120,2264434617
2	120,2264434617	144,5439770746
4	144,5439770746	208,9296130854
-1	91,2010839356	83,1763771103
-2	83,1763771103	69,1830970919
-4	69,1830970919	47,8630092323
*/
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
window.gm.combat.printCombatHud= function() { //prints the Stats and Effects of the Player&Enemy
    renderToSelector("#playerstats", "playerstats");
    renderToSelector("#enemystats", "enemystats");
};