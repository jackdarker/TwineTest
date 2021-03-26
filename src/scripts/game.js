"use strict";

//var window = window || {};  //to supress lint-errors
//import * as con from "const.js";
//import {Inventory} from './inventory.js'; //already included??


window.gm = window.gm || {}; //game related operations
window.gm.getSaveVersion= function(){
  var version = [0,1,0];
    return(version);    
};

window.gm.initGame= function(forceReset) {
  createItemLookups();
    //this does not work because hidden is called to late
    /*$(window).on('sm.passage.hidden', function(event, eventObject) {
      
      if(eventObject.passage) {// No passage to hide when story starts
          console.log('hiding'+eventObject.passage.name);        
      }
    });*/
    $(window).on('sm.passage.showing', function(event, eventObject) {
        // Current Passage object
        $("tw-passage").fadeIn(500);  //fade in if was previously faded out
      console.log('showing '+eventObject.passage.name);
    });
    // Render the passage named HUD into the element todo replace with <%=%>??
    $(document).on('sm.passage.shown', function (ev,eventObject) { window.gm.updateOtherPanels();});
    
    var s = window.story.state; //s in template is window.story.state from snowman!
    if (!s.vars||forceReset) { // storage of variables that doesnt fit player
        s.vars = {
        debug : true,   //TODO set to false for distribution !   
        version : window.gm.getSaveVersion(),
        log : [],
        passageStack : [],
        time : 700, //represented as hours*100 +minutes
        day : 1,
        activePlayer : 'Ratchel', //id of the character that the player controls currently
        //queststates
        qLaptop : 0,   // see passage _Laptop_
        qDogSit : 0,   // see park
        qUnlockCampus : 0,  //see passage into city
        qUnlockPark : 0,
        qUnlockMall : 0,
        qUnlockBeach : 0,
        qUnlockDowntown : 0,
        qUnlockRedlight : 0,
        qUnlockBeach : 0,
        hairGrow: 0,
        crowBarLeft: 1,
        debugInv: new Inventory()
        }; 
        s.vars.debugInv._parent = window.gm.util.refToParent(null);
        s.vars.debugInv.addItem(new Money(),200);

    }
    if (!s.enemy||forceReset) { //actual/last enemy
      s.enemy = Character.defaultData();
      s.enemy = new Character();
    }
    if (!s.combat||forceReset) { //see encounter & combat.js
      s.combat = {
        enemyTurn : false, //true if enemys turn
        combatState : ""  ,
        turnCount: 0,
        scenePic : 'assets/bg_park.png'
      }
    }
    if (!s.mom||forceReset) {
      s.mom = {
        location : "Kitchen",
        coffeeStore : 5,
        foodStore : 3,
        foodMaxStore : 4
      };
    }
    if (!s.Cyril||forceReset) {  //alternative player character
      window.gm.Cyril = new Character()
      //add some basic inventory
      window.gm.Cyril.Wardrobe.addItem(new Jeans());
      window.gm.Cyril.Wardrobe.addItem(new TankShirt());
      window.gm.Cyril.Outfit.addItem(new Jeans());
      window.gm.Cyril.Outfit.addItem(new TankShirt());
      window.gm.Cyril.Stats.increment('strength',3);
      s.Cyril = window.gm.Cyril;
      //delete window.gm.Cyril; 
    }
    if (!s.Ratchel||forceReset) {  
        /*s.Ratchel = Character.defaultData(); //get default struct and add some special data
        s.Ratchel.name = 'Ratchel',
        s.Ratchel.skillPoints = 2,    //no. of free skillpoints on game-start  
        s.Ratchel.skSporty = 0,//perklevels ,name should match perkId
        s.Ratchel.skCook = 0,
        s.Ratchel.skSlacker = 0,
        s.Ratchel.skMoneymaker = 0,
        s.Ratchel.skTechy = 0;*/
        //window.gm.Ratchel = new Character(s.Ratchel);
        window.gm.Ratchel = new Character();
        window.gm.Ratchel.name="Ratchel";
        window.gm.Ratchel.gainRelation('Mom',10);
        window.gm.Ratchel.Effects.addItem(skCooking.name,new skCooking());
        //add some basic inventory
        window.gm.Ratchel.Inv.addItem(new Money(),20);
        window.gm.Ratchel.Inv.addItem(new LighterDad());
        window.gm.Ratchel.Wardrobe.addItem(new Jeans());
        window.gm.Ratchel.Wardrobe.addItem(new Leggings());
        window.gm.Ratchel.Wardrobe.addItem(new TankShirt());
        window.gm.Ratchel.Wardrobe.addItem(new Pullover());
        window.gm.Ratchel.Outfit.addItem(new Jeans());
        window.gm.Ratchel.Outfit.addItem(new Pullover());
        s.Ratchel=window.gm.Ratchel;
    }      
    window.gm.switchPlayer(s.Ratchel.name); //start-player
}
window.gm.switchPlayer = function(playername) {
  var s = window.story.state;
  window.gm.player= s[playername]; 
  s.vars.activePlayer = playername;
}
window.gm.rebuildObjects= function(){ //Reconnect the objects after load!  
  var s = window.story.state;
  //window.gm.Ratchel = new Character(s.Ratchel);
  //window.gm.Cyril = new Character(s.Cyril);
  window.gm.switchPlayer(s.vars.activePlayer);
}
//returns timestamp sine start of game
window.gm.getTime= function() {
  return(window.story.state.vars.time+2400*window.story.state.vars.day);
}
//calculates timedifference for hhmm time format
window.gm.getDeltaTime = function(a,b){
  var m=a%100;         
  var h=((a-m)/100);
  var m2=b%100;         
  var h2=((b-m2)/100);
  return((h*60+m)-(h2*60+m2));
}
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
  window.gm.player.Effects.updateTime();
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
  } else if(v.time>=1000 && v.time<1400) {
    daytime = 'noon';
  } else if(v.time>=1400 && v.time<1800) {
    daytime = 'afternoon';
  } else if(v.time>=1800 && v.time<2200) {
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
  var regen = min>420 ? 999 : min/60*15;  //todo scaling of regeneration
  window.gm.player.Stats.increment('health',regen);
  window.gm.player.Stats.increment('energy',regen);
  window.gm.pushLog(msg);
  return(msg);
};

//Todo
window.gm.rollExplore= function() {
  var s=window.story.state;
  var places=[];   
  var r = _.random(0,100);
  //todo:depending of your actual location you have a chance to find connected locations or end up in a known one
  if(window.gm.player.location=='Park')   places = ['Mall','Beach'];
  if(window.gm.player.location=='Mall')   places = ['Park','Beach','Downtown']; 
  if(window.gm.player.location=='Beach')   places = ['Park','Mall']; 
  if(window.gm.player.location=='Downtown')   {
    places.push('Pawn shop'); 
  }
  if(places.length==0) places = [window.gm.player.location]; //fallback if unspeced location
  r = _.random(1, places.length)-1; //chances are equal
  window.gm.addTime(20);
  window.story.show(places[r]);
};

//---------------------------------------------------------------------------------
//TODO Deferred Event is incomplete
//maybe you sometimes dont want to trigger an event immediatly, 
//f.e. if you send a email, it might take some time until you get a response-email 
//(you can receive email at anytime on your phone, so we would have to add checks on ALL passages)
//use this function to push a passage to a stack of deffered events; 
//the passage will trigger under the given condition: minimum time, location-tag, at a certain time-window
//the passage will show when a new passage is requested and will be removed from stack
//if this passage is already pushed, only its condition will be updated
window.gm.pushDeferredEvent=function(id) {
  var cond = {waitTime: 6,
              locationTags: ['Home','City'],      //Never trigger in Combat
              dayTime: [1100,600]
            },
      cond2 = { waitTime: 60,
                locationTags: ['Letterbox'],
      };

  var xcond = [cond,cond2]; //passage is executed if any of the conds is met
  window.story.state.vars.hairGrow = 10;
};
window.gm.hasDeferredEvent = function() {
  if(window.story.state.vars.hairGrow===10) return(true);
  return(false);
}
window.gm.showDeferredEvent= function() {
  var msg = '';

  var namenext = window.passage.name;
  var tagsnext = window.story.passage(namenext).tags;
  
  if(window.story.state.vars.hairGrow===10) {
    window.story.state.vars.hairGrow =0;
    msg += "You notice that your hair has grown quite a bit.</br>"
    msg += window.gm.printPassageLink("Next",window.gm.player.location);
  }
  return msg;
}
//when show is called the previous passage is stored if the new has [_back]-tag
//if the new has no back-tag, the stack gets cleared
window.gm.pushPassage=function(id) {
  if(!window.story.state.hasOwnProperty("vars")) return;  //vars exist only after initGame
  if(window.story.state.vars.passageStack.length>0 && window.story.state.vars.passageStack[window.story.state.vars.passageStack.length-1]===id){
    //already pushed
  } else {
    window.story.state.vars.passageStack.push(id);
  }
};
//call on [_back]-passages to get the previous passage
window.gm.popPassage=function() {
    var pass = window.story.state.vars.passageStack.pop();
    if(!pass) return('nothing to pop from stack');
    return(pass);
};
//overriding show:
//- to enable back-link
//- to intercept with deffered events
var _origStoryShow = window.story.__proto__.show;
window.story.__proto__.show = function(idOrName, noHistory = false) {
  var next = idOrName;
  if(idOrName === '_back') { //going back
    next = window.gm.popPassage();
  } else {  //going forward
    var tagsnext = window.story.passage(next).tags;
    var namenext = window.story.passage(next).name;
    if(tagsnext.indexOf('_back')>=0 ) { //push on stack but only if not re-showing itself
      if(namenext!=window.passage.name) window.gm.pushPassage(window.passage.name); 
    } else if(window.story.state.hasOwnProperty("vars")) {
      window.story.state.vars.passageStack.splice(0,window.story.state.vars.passageStack.length);
    }
}
  //Todo
  //before entering a new passage check if there is a defferedEvent that we should do first
  //if so, push the normal-passage onto stack, show deffered passage
  //after the deffered passage(s) finish, make sure to show the original passage
  //this is a problem?how do I know the deffered passage is done? 
  _origStoryShow.call(window.story,next, noHistory);
};
//---------------------------------------------------------------------------------