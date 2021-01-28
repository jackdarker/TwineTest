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
    /* this does not work because hidden is called to late
    $(window).on('sm.passage.hidden', function(event, eventObject) {
      
      if(eventObject.passage) {// No passage to hide when story starts
          console.log('hiding'+eventObject.passage.name);
          $("tw-passage").fadeOut(2000).hide(0);
        
      }
    });*/
    $(window).on('sm.passage.showing', function(event, eventObject) {
        // Current Passage object
        $("tw-passage").fadeIn(500);  //fade in if was previously faded out
      console.log('showing '+eventObject.passage.name);
    });
    // Render the passage named HUD into the element todo replace with <%=%>??
    $(document).on('sm.passage.shown', function (ev) {	renderToSelector("#sidebar", "sidebar");  });
    var s = window.story.state; //s in template is window.story.state from snowman!
    if (!s.vars||forceReset) { // storage of variables that doesnt fit player
        s.vars = {
        log : [],
        deffered : [],
        time : 700, //represented as hours*100 +minutes
        day : 1,
        //queststates
        qLaptop : 0,   // see passage _Laptop_
        qDogSit : 0,   // see 
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
};
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
//maybe you sometimes dont want to trigger an event immediatly, 
//f.e. if you send a email, it might take some time until you get a response-email 
//(you can receive email at anytime on your phone, so we would have to add checks on ALL passages)
//use this function to push a passage to a stack of deffered events; 
//the passage will trigger under the given condition: minimum time, location-tag, at a certain time-window
//the passage will show when a new passage is requested and will be removed from stack
//if this passage is already pushed, only its condition will be updated
window.gm.pushDefferedEvent=function(id) {
  var cond = {waitTime: 6,
              locationTags: [Home,City],      //Never trigger in Combat
              dayTime: [1100,600]
            },
      cond2 = { waitTime: 60,
                locationTags: [Letterbox],
      }

  var xcond = [cond,cond1]; //passage is executed if any of the conds is met
};

