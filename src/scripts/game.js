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
window.gm = window.gm || {}; //game related operations
window.gm.getSaveVersion= function(){
    return('1.0.0');
};
window.gm.initGame= function(forceReset) {
    $(window).on('sm.passage.hidden', function(event, eventObject) {
      
      if(eventObject.passage) {// No passage to hide when story starts
          console.log('hiding'+eventObject.passage.name);
          $("tw-passage").fadeOut(2000).hide(0);
        
      }
    });
    $(window).on('sm.passage.showing', function(event, eventObject) {
        // Current Passage object
        $("tw-passage").hide(0).fadeIn(2000);
        
      console.log('showing '+eventObject.passage.name);
    });
    // Render the passage named HUD into the element 
    $(document).on('sm.passage.shown', function (ev) {	renderToSelector("#sidebar", "sidebar");  });
    var s = window.story.state; //s in template is window.story.state from snowman!
    if (!s.vars||forceReset) { // storage of variables that doesnt fit player
        s.vars = {
        log : [],
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
        location : "Kitchen",
        coffeeStore : 5,
        foodStore : 3,
        foodMaxStore : 4
      };
    }
    if (!s.enemy||forceReset) { 
      s.enemy = { //actual enemy in combat
        Name : "",
        health : 10,
        healthMax : 10,
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
        energyMax : 100,
        health : 10,
        healthMax : 10,
        skillPoints : 2,    //no. of free skillpoints on game-start
        //perklevels ,name should match perkId
        skSporty : 0,
        skCook : 0,
        skSlacker : 0,
        skMoneymaker : 0,
        skTechy : 0,
        //relation to others, name should match charID
        relMom : 20,
        relJake : 0,
        relCyril : 0
        }; 
        window.gm.playerInv = new Inventory(s.player.inv);
        window.gm.playerInv.addItem('LighterDad');
    }
};
window.gm.refreshScreen= function() {
    window.story.show(window.passage.name);
};
//adds MINUTES to time
window.gm.addTime= function(min) {
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
};
window.gm.getTimeString= function() {
  var c=window.gm.getTimeStruct();
  return (c.hour<10?"0":"")+c.hour.toString()+":"+(c.min<10?"0":"")+c.min.toString()+"("+c.daytime+")";
};
window.gm.getTimeStruct=function() {
  var v=window.story.state.vars;
  var m=v.time%100;
  var h=((v.time-m)/100);
  var daytime = '';
  if(v.time>500 && v.time<1000) {
    daytime = 'morning';
  } else if(v.time>1000 && v.time<1400) {
    daytime = 'noon';
  } else if(v.time>1400 && v.time<1800) {
    daytime = 'afternoon';
  } else if(v.time>1800 && v.time<2200) {
    daytime = 'evening';
  } else {
    daytime = 'night';
  }
  return({'hour':h,'min':m, 'daytime': daytime});
};
window.gm.getDateString= function() {
  var v=window.story.state.vars;
  return v.day.toString().concat(". day");
};
//forward time to until (1025 = 10:25), regenerate player
//warning dont write 0700 because this would be take as octal number
window.gm.sleep=function(until) {
  var v=window.story.state.vars;
  var msg='';
  var m=v.time%100;
  var h=((v.time-m)/100);
  var m2=until%100;
  var h2=((until-m)/100);
  var min = (h2-h)*60+(m2-m);
  //if now is 8:00 and until 10:00 we assume you want to sleep 2h and not 2+24h
  //if now is 10:00 and until is 9:00 we assume sleep for 23h
  if(until<v.time) {
    min = 24*60-(h-h2)*60+(m-m2);
  }
  msg+="</br>Slept for "+min/60+" hours.</br>";
  window.gm.addTime(min);
  var regen = min>420 ? 999 : min/60*15;  //todo
  window.gm.gainStat('health',regen);
  window.gm.gainStat('energy',regen);
  window.gm.pushLog(msg);
  return(msg);
};
window.gm.gainStat= function(stat,val) {
  var player = window.story.state.player;
  var old = player[stat]; 
  player[stat] = Math.max(0,Math.min(player[stat+'Max'],player[stat]+val));
  if(player[stat]-old>=0) {
    window.gm.pushLog('<statup>'+stat+" regenerated by "+(player[stat]-old).toString()+"</statup></br>");
  } else {
    window.gm.pushLog('<statdown>'+stat+" decreased by "+(player[stat]-old).toString()+"</statdown></br>");
  }
}
window.gm.gainRelation= function(char,val) {
  var player = window.story.state.player;
  var stat= 'rel'+char;
  var old = player[stat]; 
  player[stat] += val;
  if(player[stat]-old>=0) {
    window.gm.pushLog('<statup>Your relation to '+char+" improved by "+(player[stat]-old).toString()+"</statup></br>");
  } else {
    window.gm.pushLog('<statdown>Your relation to '+char+" worsend by "+(player[stat]-old).toString()+"</statdown></br>");
  }
}
window.gm.pushLog=function(msg) {
  var log = window.story.state.vars.log;
  log.unshift(msg);
  if(log.length>10) {
    log.splice(log.length-1,1);
  }
};
window.gm.getLog=function() {
  var log = window.story.state.vars.log;
  var msg ='';
  for(var i=0;i<log.length;i++) {
    msg+=log[i];
  }
  return(msg);
};
window.gm.clearLog=function() {
  var log = window.story.state.vars.log;
  var msg ='';
  for(var i=0;i<log.length;i++) {
    msg+=log[i];
  }
  window.story.state.vars.log = [];
  return(msg);
};
window.gm.rollExplore= function() {
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
};
window.gm.printOutput= function(text) {
  document.querySelector("section article div output").innerHTML = text;
};
//prints the same kind of link like [[Next]] but can be called from code
window.gm.printPassageLink= function(label,target) {
  return("<a href=\"javascript:void(0)\" data-passage=\""+target+"\">"+label+"</a></br>");
};

//prints a link that when clicked picksup an item and places it in the inventory
window.gm.printPickupAndClear= function(itemid, desc,itemleft,cbAfterPickup=null) {
  var elmt='';
  var s= window.story.state;
  if(!(itemleft>0)) return(elmt);
  var desc2 = desc+" ("+itemleft+" left)";
  var msg = 'took '+itemid;
  elmt +="<a0 id='"+itemid+"' onclick='(function($event){window.gm.pickupAndClear(\""+itemid+"\", \""+desc+"\","+itemleft+","+cbAfterPickup+")})(this);'>"+desc2+"</a></br>";
  //elmt +="<a0 id='"+itemid+"' onclick='(function($event){window.gm.playerInv.addItem(\""+itemid+"\");$event.replaceWith(\""+msg+"\");window.gm.pushLog(\"added "+itemid+" to inventory.</br>\");window.story.show(window.passage.name);})(this);'>"+desc2+"</a></br>";
  return(elmt);
};
window.gm.pickupAndClear=function(itemid, desc,itemleft,cbAfterPickup=null) {
  window.gm.playerInv.addItem(itemid);
  window.gm.pushLog("added "+itemid+" to inventory.</br>");
  if(cbAfterPickup) cbAfterPickup.call();
  window.story.show(window.passage.name);
};
//prints an item with description; used in inventory
window.gm.printItem= function( id,descr) {
  var elmt='';
  var s= window.story.state;
  //elmt +=''.concat("<a0 id='"+id+"' onclick='(function($event){document.querySelector(\".div_hidden\").classList.toggle(\"div\");})(this);'>"+id+"</a><div class=\'div_hidden\' id='"+id+"'>"+descr+"</div>");
  elmt +=`<a0 id='${id}' onclick='(function($event){document.querySelector(\"div#${id}\").toggleAttribute(\"hidden\");})(this);'>${id}</a><div hidden id='${id}'>${descr}</div>`;
  
  if(window.story.passage(id))  elmt +=''.concat("    [[Info|"+id+"]]");  //Todo add comands: drink,eat, use
	elmt +=''.concat("</br>");
	return(elmt);
};
//prints a list of perks for unlock
window.gm.printUnlockPerk= function(id, descr) {
  var elmt='';
  var s= window.story.state;
	if(s.player[id]==0 && s.player.skillPoints>0) {
		elmt +=''.concat("<a0 id='"+id+"' onclick='(function ( $event ) { unlockPerk($event.id); })(this);'>"+descr+"</a>");
    elmt +=''.concat("    [[Info|"+id+"]]");
	} else if(s.player[id]>0) {
		elmt +=id+": "+descr;
	}
	elmt +=''.concat("</br>");
	return(elmt);
};
///show/hides a dialog defined in body
window.gm.toggleDialog= function(id){ 
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
};
