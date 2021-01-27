"use strict";

//import {Inventory} from 'inventory.js'; already included??

window.storage = {  //operations for save/reload
    ok: function() {
      try {
          var storage = window["localStorage"],
            x = '__storage_test__';
          storage.setItem(x, x);
          storage.removeItem(x);
          return true;
        }
        catch(e) {
          return e instanceof DOMException && (
          // everything except Firefox
          e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
          // acknowledge QuotaExceededError only if there's something already stored
          storage.length !== 0;
        }
    },
    delete: function(slot) {
      window.localStorage.removeItem(slot);
      window.localStorage.removeItem(slot.concat('info'));
    },
      getSaveInfo: function(slot) {
          var info=null;
        if(window.storage.ok()) {
            info =window.localStorage.getItem(slot.concat('info'));		
        }
      if(!info) {
        return('');
      }
      return(info);
        
    },
      saveBrowser: function(slot) {
        //var hash= window.story.save();    this call somehow messes up html and I had to copy the following from snowman script
        var hash = LZString.compressToBase64(JSON.stringify({state:window.story.state,
            history:window.story.history,checkpointName:window.story.checkpointName}));          
        
        var info=new Date().toString();
        window.localStorage.setItem(slot.concat('info'),info);
        window.localStorage.setItem(slot,hash);
        //document.querySelector("output").textContent = info;  //causes problems because page reset to start-Index.html??
        return(info);
    },
      loadBrowser: function(slot) {
        var hash,info;
        if(window.storage.ok()) {
            //not possible to save object {info,hash} ??
            hash=window.localStorage.getItem(slot);
            info=window.storage.getSaveInfo(slot);
            window.story.restore(hash) ; 
            //document.querySelector("output").textContent = (info); 
            window.gm.playerInv = new Inventory(window.story.state.player.inv);
        }
        return(info);
    }
  };
window.gm = { //game related operations
getSaveVersion: function(){
    return('1.0.0');
},
initGame: function(forceReset) {
    var s = window.story.state; //s in template is window.story.state from snowman!
    if (!s.vars||forceReset) { // storage of variables that doesnt fit player
        s.vars = {
        cabinetkey : true,
        time : 700, //represented as hours*100 +minutes
        day : 1,
        //queststates
        qLaptop : 0,   // see passage _Laptop_
        qExploredCity : 0,  //see passage into city
        qUnlockPark : 0,
        qUnlockMall : 0,
        qUnlockRedlight : 0,
        qUnlockBeach : 0
        }; 
    }
    if (!s.mom||forceReset) {
      s.mom = {
        location : "Kitchen"
      };
    }
    if (!s.enemy||forceReset) { 
      s.enemy = { //actual enemy in combat
        Name : "",
        health : 10,
        maxHealth : 10,
        activeTurn : false,
        combatState : ""
      };
    }
    if (!s.player||forceReset) {  
        s.player = {  //player-related variables
        location : "Bedroom",
        inv: [],  //inventory data, needs to be mapped to Inventory-Instance
        money : 5,
        energy : 55,
        maxEnergy : 100,
        health : 10,
        maxHealth : 10,
        skillPoints : 2,    //no. of free skillpoints on game-start
        //skilllevels
        skSporty : 0,
        skCook : 0,
        skSlacker : 0,
        skMoneymaker : 0,
        skTechy : 0,
        //relation to others
        relMom : 20,
        relJake : 0
        }; 
        window.gm.playerInv = new Inventory(s.player.inv);
        window.gm.playerInv.addItem('LighterDad');
        //window.gm.addItem(s.player.inv,'LighterDad');
    }
},
refreshScreen: function() {
    window.story.show(window.passage.name);
},
//adds MINUTES to time
addTime: function(min) {
  var v=window.story.state.vars;
  var m=v.time%100;         
  var h=((v.time-m)/100);
  m= m+min;
  var m2 = m%60;
  var h2 = h+(m-m2)/60;
  window.story.state.vars.time = (h2*100+m2%60);
  while(window.story.state.vars.time>=2400) {
    window.story.state.vars.time -= 2400;
    window.story.state.vars.day += 1;
  }
},
getTimeString: function() {
  var v=window.story.state.vars;
  var m=v.time%100;
  var h=((v.time-m)/100);
  return (h<10?"0":"")+h.toString()+":"+(m<10?"0":"")+m.toString();
},
getDateString: function() {
  var v=window.story.state.vars;
  return v.day.toString().concat(". day");
},
rollExplore: function() {
  var s=window.story.state;
  var places=[];    
  //todo:depending of your actual location you have a chance to find connected locations or end up in a known one
  if(s.player.location=='Park')   places = ['Mall','Beach'];
  if(s.player.location=='Mall')   places = ['Park','Beach','Downtown']; 
  if(s.player.location=='Beach')   places = ['Park','Mall']; 
  if(places.length==0) places = ['Park']; //fallback if unspeced location
  var r = _.random(1, places.length)-1; //chances are equal
  window.gm.addTime(20);
  window.story.show(places[r]);
},

printOutput: function(text) {
  document.querySelector("section article div output").innerHTML = text;
},
printLink(label,target) {
  return("<a href=\"javascript:void(0)\" data-passage=\""+target+"\">"+label+"</a></br>");
},
hideCombatOption: function() {
  document.querySelector("#combatmenu").remove();
},
printCombatOption : function() { //creates a list of possible moves
  var elmt="<form id='combatmenu'>";
  elmt +="<a0 id='RunAway' onclick='(function($event){window.gm.triggerCombat($event.id);})(this);'>Try to flee</a></br>";  //todo replace with regex-replace
  elmt +="<a0 id='Attack' onclick='(function($event){window.gm.triggerCombat($event.id);})(this);'>Attack</a></br>";
  //elmt +="<a0 id='Guard' onclick='(function($event){window.gm.execCombatCmd($event.id);"+next+"})(this);'>Guard</a></br>";
  //elmt +="<a0 id='showItems' onclick='(function($event){window.gm.execCombatCmd($event.id);"+next+"})(this);'>Item</a></br>";
  elmt +="</form>";
  return(elmt);

},
triggerCombat: function(id) {
  window.gm.hideCombatOption();
  var msg=window.gm.execCombatCmd(id);
  window.gm.printOutput(msg+window.gm.printLink("Next","EncounterStartTurn"));
  window.gm.printCombatHud();
},
calcEnemyCombat: function() {
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
},
execCombatCmd : function(id) { //setup enemy for encounter
  var enemy = window.story.state.enemy;
  var player = window.story.state.player;
  var rnd = _.random(1,100);
  var msg = '';
  if(enemy.activeTurn) {
    if(id ==='Attack') {
      if(rnd > 30) {
        msg += enemy.name +" hits you in the face.";
        player.health -=2;
      } else {
        msg += enemy.name +"s attack missed.";
      }
    }
  } else {
    if(id ==='Attack') {
      if(rnd > 30) {
        msg += "You hit your foe.";
        enemy.health -=2;
      } else {
        msg += enemy.name +" evaded your attack.";
      }
    } else if(id === 'RunAway') {
      if(rnd >40) {
        msg += "You escaped the fight.";
        enemy.combatState = 'fleeing';  //just setting the flag, you have to take care of handling!
      } else {
        msg += "Your attempts to escape failed.";
      }
    }
  }
  enemy.activeTurn =!enemy.activeTurn;  //toggle whos turn
  return(msg+"</br>");
},
printCombatHud: function() {
    renderToSelector("#playerstats", "playerstats");
    renderToSelector("#enemystats", "enemystats");
},
//prints a link that when clicked picksup an item and places it in the inventory
printPickupAndClear: function(itemid, desc,itemleft) {
  var elmt='';
  var s= window.story.state;
  if(!(itemleft>0)) return(elmt);
  var desc2 = desc+" ("+itemleft+" left)";
  var msg = 'took '+itemid;
  
  //elmt +="<a0 onclick='(function($event){window.gm.playerInv.addItem('"+itemid+"');$event.replaceWith('"+msg+"');}(this))'>text</a></br>";
  elmt +="<a0 id='"+itemid+"' onclick='(function($event){window.gm.playerInv.addItem(\""+itemid+"\");$event.replaceWith(\""+msg+"\");})(this);'>"+desc2+"</a></br>";
  return(elmt);
},
printItem: function( id,descr) {
  var elmt='';
  var s= window.story.state;
  elmt +=''.concat("<a0 id='"+id+"' onclick='(function( $event){ alert($event.id); })(this);'>"+id+"</a><p>"+descr+"</p>");
  if(window.story.passage(id))  elmt +=''.concat("    [[Info|"+id+"]]");
	elmt +=''.concat("</br>");
	return(elmt);
},
printUnlockPerk: function(id, descr) {
  var elmt='';
  var s= window.story.state;
	if(s.player[id]==0 && s.player.skillPoints>0) {
		elmt +=''.concat("<a0 id='"+id+"' onclick='(function ( $event ) { unlockPerk($event.id); })(this);'>"+descr+"</a>");
    elmt +=''.concat("    [[Info|"+id+"]]");
	} else if(s.player[id]>0) {
		elmt +=''.concat(descr);
	}
	elmt +=''.concat("</br>");
	return(elmt);
},
///show/hides a dialog defined in body
toggleDialog: function(id){ 
    const _id = id;
	var dialog = document.querySelector(id),
    	closebutton = document.getElementById('close-dialog'),
    	pagebackground = document.querySelector('body');
    var div;
	if (!dialog.hasAttribute('open')) {
		// show the dialog 
		div = document.createElement('div');
		div.id = 'backdrop';
		document.body.appendChild(div); 
		dialog.setAttribute('open','open');
		// after displaying the dialog, focus the closebutton inside it
		closebutton.focus();
		closebutton.addEventListener('click',function() {window.gm.toggleDialog(_id);});
	}
	else {		
 		dialog.removeAttribute('open');  
		div = document.querySelector('#backdrop');
		div.parentNode.removeChild(div);
		//??lastFocus.focus();
	}
}
};
