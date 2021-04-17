"use strict";
/* bundles some operations related to combat */
window.gm = window.gm || {};
window.gm.combat = window.gm.combat || {};

class CombatSetup {
  constructor() {
    this.EnemyFirst=false;
    this.EnemyFunc = null;  //a ctor of Mob
    this.Location = ''  //your actual location-name
    this.scenePic = ''  //bg-image to use
    this.onDefeat = null;
    this.onVictory = null;
    this.onFlee = null;
    this.onSubmit = null;
  }
  onSubmit() {
    return('You submitted to '+s.enemy.name+" completely.</br>"+ window.gm.printPassageLink('GameOver','GameOver'));
  }
  //setup encounter; this calls the Encounter-passage !
initCombat() {
  var s=window.story.state;
  s.enemy = window.gm.Encounter.EnemyFunc();
  s.combat.location = window.gm.Encounter.location;
  s.combat.scenePic = window.gm.Encounter.scenePic;
  s.combat.playerFleeing = false;
  s.combat.playerSubmitting = false;
  s.enemyFirst= window.gm.Encounter.EnemyFirst;
  s.combat.enemyTurn =false;
  s.combat.newTurn = true;
  s.combat.turnCount=0;
  s.combat.state='battling';
  window.story.show("Encounter");
}

hideCombatOption() {
  document.querySelector("#combatmenu").remove();
}
//creates a list of possible moves for player
printCombatOption() { 
var elmt="<form id='combatmenu'>";
//Todo create list based on abilitys
var canAct = window.gm.player._canAct();
if(canAct.OK===true) {
elmt +="<a0 id='moveFlee'           onclick='(function($event){window.gm.Encounter.triggerCombat($event.id);})(this);'>Try to flee</a></br>";
elmt +="<a0 id='movePhysicalAttack' onclick='(function($event){window.gm.Encounter.triggerCombat($event.id);})(this);'>Attack</a></br>";
elmt +="<a0 id='moveUltraKill' onclick='(function($event){window.gm.Encounter.triggerCombat($event.id);})(this);'>KillYaAll</a></br>";
elmt +="<a0 id='moveGuard'          onclick='(function($event){window.gm.Encounter.triggerCombat($event.id);})(this);'>Guard</a></br>";
elmt +="<a0 id='moveStun'           onclick='(function($event){window.gm.Encounter.triggerCombat($event.id);})(this);'>Stun</a></br>";
elmt +="<a0 id='moveSubmit'         onclick='(function($event){window.gm.Encounter.triggerCombat($event.id);})(this);'>Submit</a></br>";
//Todo Item-use on self or enemy
//elmt +="<a0 id='showItems' onclick='(function($event){window.gm.execCombatCmd($event.id);"+next+"})(this);'>Item</a></br>";
} else {
  elmt +=canAct.msg+"</br>";
}
elmt +="<a0 id='moveNOP'          onclick='(function($event){window.gm.Encounter.triggerCombat($event.id);})(this);'>Do nothing</a></br>";
elmt +="</form></br>";
return(elmt);
}
//prints the Stats and Effects of the Player&Enemy
printCombatHud() { 
renderToSelector("#playerstats", "playerstats");
renderToSelector("#enemystats", "enemystats");
};
//creates a list of active effects for combat display
printCombatEffects(char) {
var list=[];
var effects = char.Effects.getAllIds();
for(var i=0; i<effects.length; i++) {
  var effect = char.Effects.get(effects[i]);
  if(effect.onCombatEnd!==null && effect.onCombatEnd!==undefined) {
    list.push(effect.shortDesc);
  }
}
return(list.reduce((sum, current) => sum + current +', ', ''));
}
triggerCombat(id) {  //called by combatmenu-buttons expects a functioname
this.hideCombatOption();
var result=window.gm.Encounter.execCombatCmd(window.gm.combat[id]);
window.gm.printOutput(result.msg+window.gm.printPassageLink("Next","EncounterStartTurn"));
this.printCombatHud();
}
//calculates and executes combat-cmd of enemy
calcEnemyCombat() { 
var enemy = window.story.state.enemy;
var move = enemy.calcCombatMove();
return(move.msg+"</br>");
}
//executes a combat-cmd for player/enemy
execCombatCmd(move) { 
var s = window.story.state;
var result = move();
s.combat.enemyTurn =!s.combat.enemyTurn;  //toggle whos turn
if(!(s.combat.enemyTurn ^ s.combat.enemyFirst)) s.combat.newTurn = false;
return(result);
}
startRound() {
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
endCombat(){
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
//returns false if battle should continue
battle() {
var s=window.story.state;
var result = {OK:false, msg:''};
//check if battle done...
if(s.combat.playerFleeing===true) { 
  result.OK=true;
  result.msg = 'You sucessfully escaped '+s.enemy.name+"</br>";
  result.msg += window.gm.printPassageLink('Next',window.gm.player.location);
} 
if(s.combat.playerSubmitting===true) {  
  result.OK=true;
  result.msg = this.onSubmit();
} 
if(s.enemy.health().value<=0) { 
  result.OK=true;
  s.combat.state = 'victory';
  result.msg = 'You defeated '+s.enemy.name+"</br>";
  result.msg += window.gm.printPassageLink('Next',window.gm.player.location);
}
if(window.gm.player.health().value<=0){ 
  result.OK=true;
  s.combat.state = 'defeat';    
  result.msg = 'You where defeated by'+s.enemy.name+"</br>";
  result.msg += window.gm.printPassageLink('GameOver','GameOver');
}
if(result.OK) {this.endCombat(); }
else{   //or continue combat                
  if(s.combat.newTurn===false && !(s.combat.enemyTurn ^ s.combat.enemyFirst)) {
    s.combat.newTurn = true;
    result.msg += 'new turn</br>';
    window.gm.Encounter.startRound();
  }
  if(s.combat.enemyTurn) { 
    result.msg += this.calcEnemyCombat();
    result.msg += window.gm.printPassageLink('Next','EncounterStartTurn');
  }else{ 
    result.msg += this.printCombatOption();
  }
  //todo how to know endRound
}
return(result);
}
}
//calculates if target can evade the attack 
/*requires minimum Poise
Evasion depends on Agility & Endurance:
- mallus for heavy armor & weapon
- mallus for Effects like Prone, Frozen
- bonus for Skills: Flying, Dancer
Stunned/Bound Chars can not evade */
// on evasion returns false and a message
window.gm.combat.calcEvasion=function(attacker,target, attack) {
  var result = {OK:true,msg:''}
  var rnd = window.gm.roll(1,100);

  if(target.Effects.findItemSlot(effStunned.name)>=0) {
    result.OK = true; 
    result.msg = target.name+' is stunned and cannot evade. '
    attack.crit = true; //when stunned always critical hit
    return(result);
  }

  var lvlDiff = target.level-attacker.level;
  var chance = target.Stats.get("agility").value + target.Stats.get("endurance").value;
  chance += lvlDiff*4;
  window.gm.pushLog(`evasion roll:${chance} vs ${rnd} `,window.story.state.vars.dbgShowCombatRoll);
  if(chance>rnd) {
    result.OK = false;
    result.msg += 'Using agility, '+ target.name +' was able to dodge the attack. '
  }
  return(result);
}
/*If evasion-roll fails, their is a chance that parry is rolled:
- consumes some poise
- parry only works for weapon of similiar size: a Zweihänder is to slow to parry a saber, a dagger is to light to deflect a club
- requires minimum weapon-skill (f.e. projectile deflection )
otherwise continue chain
parry-result depends on agility+perception
- bonus for skills
- bonus for some weapons
on critical fail- full damage, poise damage
on fail - full damage
on success no damage is taken (might consume weapon-stability)
if a critical is rolled, 50% of the attackers damage is reflected to him*/
window.gm.combat.calcParry=function(attacker,target, attack) {
  var result = {OK:true,msg:'',foo:null}
  var rnd = _.random(1,100);

  if(target.Effects.findItemSlot(effStunned.name)>=0) {
    result.OK = true; 
    result.msg = target.name+' is stunned and cannot parry or block. '
    attack.crit = true; //when stunned always critical hit
    return(result);
  }

  var lvlDiff = target.level-attacker.level;
  var chance = target.Stats.get("agility").value + target.Stats.get("perception").value;
  chance += lvlDiff*4;
  window.gm.pushLog(`parry roll:${chance} vs ${rnd} `,window.story.state.vars.dbgShowCombatRoll);
  if(chance>rnd && rnd<10) {
    result.OK = false;
    if(rnd<10) {
      result.msg = target.name +' parried the attack and was even able to land a hit.'  //todo how to add textual variation based on used weapon and skill?
      // foo should reflect fraction of attack back to attacker
      result.foo = function(attacker,attack){ return(function(attacker,attack){ attacker.Stats.increment('health',-0.5*attack.value);});}(attacker,attack);
    } else {
      result.msg = target.name +' parried the attack.'
    }
  } else {
    result.OK = true;
    if(rnd>90) {
      attack.crit = true;
    }
  }
  return(result);
}
/*if all else failed you have to absorb the hit:
DR = sum of armor (with individual skill-bonus) + magic armor
attack = weapon damage formula + weakness-bonus
attack increases on critical
hp-dmg = attack -DR but min.1 */
window.gm.combat.calcAbsorb=function(attacker,defender, attack) {
  var result = {OK:true,msg:'',foo:null}
  var rnd = _.random(1,100);
  var def = defender.Stats.get('pDefense').value;
  //todo weakness bonus
  var dmg = Math.max(1,attack.value* (attack.crit?4:1)-def);
  window.gm.pushLog(`absorb roll:${dmg} vs ${def} `,window.story.state.vars.dbgShowCombatRoll);
  result.msg = defender.name +' got hit by '+attacker.name+' and suffered '+dmg+ (attack.crit?' critical ':'')+'damage. '
  attack.total = dmg;
  //foo should add fraction of attack to defender-health
  result.foo = function(defender,attack){ return(function(){ defender.Stats.increment('health',-1*attack.total);});}(defender,attack);
  return(result);
}
// calculates the damage of an attack and applies it
window.gm.combat.calcAttack=function(attacker,defender, attack) {

  var result = window.gm.combat.calcEvasion(attacker,defender,attack);
  if(result.OK===false) { return(result);  }
  var _tmp = result.msg;
  result = window.gm.combat.calcParry(attacker,defender,attack);  //todo or block
  if(result.foo!==null) result.foo(attacker,attack);
  if(result.OK===false) {    return(result);  }
  _tmp += result.msg;
  result = window.gm.combat.calcAbsorb(attacker,defender,attack);
  if(result.foo!==null) result.foo(defender,attack);
  _tmp += result.msg;
  result.msg = _tmp;
  return(result);
}
/////////////////////////////////////////////////////////////
/*  generic combat moves */
//used to skip turn
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
//stun caused by blunt weapon, shock
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
    if(rnd >40) { //Todo fleeing chance calculation
      result.msg += "You escaped the fight.";
      s.combat.playerFleeing = true;  //just setting the flag, you have to take care of handling!
    } else {
      result.msg += "Your attempts to escape failed.";
      result.OK=false;
    }
  }
  return(result);
}
window.gm.combat.moveSubmit = function() { 
  var s = window.story.state;
  var result= {OK:true,msg:''};
  var rnd = _.random(1,100);
  if(s.combat.enemyTurn) { //todo enemy?
  } else {
    if(rnd >0) { //Todo fleeing chance calculation
      result.msg += "You submit to your foe.";
      s.combat.playerSubmitting = true;  //just setting the flag, you have to take care of handling!
    } else {
      result.msg += "Your attempts to submit failed.";
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
  var def = defender.Stats.get('pDefense').value;
  var att = attacker.Stats.get('pAttack').value;
  var result = window.gm.combat.calcAttack(attacker,defender,{value:att,total:att});
  return({OK:result.OK,msg:result.msg});
}
//OBSOLETE
window.gm.combat.movePhysicalAttack_old = function() { 
  var s = window.story.state;
  var attacker = s.combat.enemyTurn ? window.story.state.enemy  :window.gm.player;
  var defender = s.combat.enemyTurn ? window.gm.player :window.story.state.enemy;
  var msg = '';
  var crit= false,hit=false,block=false;
  var def = defender.Stats.get('pDefense').value;
  var att = attacker.Stats.get('pAttack').value;
//??  Erfolgswahrscheinlichkeit skalieren mit Differenz der Attribute Player-Enemy
// gleiche Attribute = Wahrscheinlichkeit*100%; Attribut-Diff +2 = *100%*2; Attribut-Diff +4 = *200%

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

  return({OK:hit&& !block , msg:msg});
};
window.gm.combat.moveUltraKill = function() { 
  var s = window.story.state;
  var attacker = s.combat.enemyTurn ? window.story.state.enemy  :window.gm.player;
  var defender = s.combat.enemyTurn ? window.gm.player :window.story.state.enemy;
  var msg = '';
  var rnd = 30;
  defender.Stats.increment('health',-1*rnd);
  msg+= attacker.name+' dealt '+rnd+' damage to '+defender.name+'.</br>';
  return({OK:true , msg:msg})
};