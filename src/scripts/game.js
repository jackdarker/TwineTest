"use strict";
/*
core functionality
*/


window.gm = window.gm || {}; //game related operations
window.gm.util = window.gm.util || {};  //utility functions
// define save-game-file-version 1

window.gm.switchPlayer = function(playername) {
  var s = window.story.state;
  window.gm.player= s[playername]; 
  s.vars.activePlayer = playername;
}
//you might need to reimplement this to handle version upgrades on load
window.gm.rebuildObjects= function(){ 
  var s = window.story.state;
  window.gm.switchPlayer(s.vars.activePlayer);
}
//returns timestamp since start of game
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
// DoW = DayOfWeek  7 = Sunday, 1 = Monday,...6 = Saturday 
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
  var DoW = window.story.state.vars.day%7;
  return({'hour':h,'min':m, 'daytime': daytime, 'DoW':DoW});
};

window.gm.getDateString= function() {
  var v=window.story.state.vars;
  const DoW=['Monday', 'Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  return v.day.toString()+". day "+ DoW[(v.day%7)-1];
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
  if(min===0) { //if sleep from 700 to 700, its a day
    min=24*60;
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
window.gm.newGamePlus = function() {
  var NGP = { //be mindful if adding complex objects to NGP, they might not work as expected ! simple types are ok 
    crowBarLeft: window.story.state.vars.crowBarLeft
    }
  window.gm.initGame(true,NGP);
  window.story.show('Home');
};

// use child._parent = window.gm.util.refToParent(parent);
window.gm.util.refToParent = function(me){ return function(){return(me);}};
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
    var cond1 = {waitTime: 6,
                locationTags: ['Home','City'],      //Never trigger in Combat
                dayTime: [1100,600]
              },
        cond2 = { waitTime: 60,
                  locationTags: ['Letterbox'],
        };
  
    var cond = [cond1,cond2]; //passage is executed if any of the conds is met
    window.story.state.vars.defferedStack.push({id:id,cond:cond});
  };
  window.gm.removeDefferedEvent=function(id=""){
    if(id!=="") {
      for(var i=window.story.state.vars.defferedStack.length-1;i>0;i--) {
        if(window.story.state.vars.defferedStack[i].id===id) 
        window.story.state.vars.defferedStack.splice(i,1);
      }
    }else {
      window.story.state.vars.defferedStack = [];
    }
  }
  window.gm.hasDeferredEvent = function(id="") {
    if(id!=="") {
      for(var i=0;i<window.story.state.vars.defferedStack.length;i++) {
        if(window.story.state.vars.defferedStack[i].id===id) return(true);
      }
      return(false);
    } else {
      return(window.story.state.vars.defferedStack.length>0);
    }
  }
  window.gm.showDeferredEvent= function() {
    var msg = '';
  
    var namenext = window.passage.name;
    var tagsnext = window.story.passage(namenext).tags;
    var evt = window.story.state.vars.defferedStack.shift();
    if(evt!==null) {
      msg += window.gm.printPassageLink("Next",evt.id);
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
  //updates all panels
window.gm.refreshScreen= function() {
  window.story.show(window.passage.name);
};
//updates only sidepanle,logpanel
window.gm.updateOtherPanels = function(){
  renderToSelector("#sidebar", "sidebar");renderToSelector("#LogPanel", "LogPanel"); 
};
window.gm.pushLog=function(msg,Cond=true) {
  if(!Cond) return;
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
window.gm.roll=function(n,sides) { //rolls n x dies with sides
  var rnd = 0;
  for(var i=0;i<n;i++) {
      rnd += _.random(1,sides);
  }
  return(rnd); 
}
window.gm.printOutput= function(text) {
  document.querySelector("section article div output").innerHTML = text;
};
//connect to onclick to toggle selected-style for element + un-hiding related text
//the elmnt (f.e.<img>) needs to be inside a parentnode f.e. <div id="choice">
//ex_choice is jquery path to fetch all selectable elmnt
//for a table in a div this could be "div#choice table tbody tr td *"
//text-nodes needs to be inside a parent node f.e. <div id="info"> and have matching id of elmnt
//ex_info is jquery path to fetch all info elmnt
//for a <p> in div this could be "div#info  
window.gm.onSelect = function(elmnt,ex_choice,ex_info) {
  var all = $(ex_choice);//[0].children;
  for(var i=0;i<all.length;i++) {
    if(all[i].id === elmnt.id) {
      all[i].classList.add("selected");
    }
    else all[i].classList.remove("selected");
  }
  all = $(ex_info)[0].children;
  for(var i=0;i<all.length;i++) {
      if(all[i].id === elmnt.id) {
        all[i].hidden=false;
      }
      else all[i].hidden=true;
  }
};
//call this onclick to make the connected element vanish and to unhide another one (if the passage is revisited the initial state will be restored)
//unhidethis needs to be jquery-path to a div,span,.. that is initially set to hidden
//cb can be a function(id) that gets called
window.gm.printTalkLink =function(elmt,unhideThis,cb=null) {
  elmt.toggleAttribute("hidden");
  if(cb!==null) cb(elmt.id);
$(unhideThis)[0].toggleAttribute("hidden");
}
//prints the same kind of link like [[Next]] but can be called from code
window.gm.printPassageLink= function(label,target) {
  return("<a href=\"javascript:void(0)\" data-passage=\""+target+"\">"+label+"</a></br>");
};
//dynamically build a link representing a buy option including display of cost and restriction
//count specifys how any items you get for cost
//cbCanBuy points to a function fn(itemid) that returns if can buy {OK:false,msg:'too expensive'} 
//cbPostBuy points to a function fn(itemid) that is called after buying ; 
window.gm.printShopBuyEntry= function(itemid,count,cbCanBuy,cbPostBuy=null){
  var desc2=itemid+ 'out of stock</br>';
  var entry = document.createElement('a');    // entry is a link that will expand to item description
  entry.id=itemid;
  entry.href='javascript:void(0)';
  var showDesc=function($event){var elmt =document.querySelector("div#"+$event.srcElement.id);
      elmt.innerHTML =window.gm.ItemsLib[$event.srcElement.id].desc+"</br>";
      elmt.toggleAttribute("hidden");};
  entry.addEventListener("click", showDesc, false);
  var div = document.createElement('div');
  div.id=itemid;
  div.hidden=true;
  var entryBuy = document.createElement('a'); //entryBuy is a link that actual buys something or shows why not
  entryBuy.id=itemid;
  entryBuy.href='javascript:void(0)';
  entryBuy.textContent="Buy";
  if(count>0) {
      var result = cbCanBuy(itemid);
      desc2 = itemid+" (x"+count+")";
      if(result.OK===false) {
          desc2 = desc2 + " "+ result.msg;
      } else {
          desc2+= " "+result.msg;
          var foo = function($event){window.gm.buyFromShop(itemid,count,cbPostBuy)};
          entryBuy.addEventListener("click", foo, false);
      }
  }
  entry.textContent=desc2;
  $("div#panel")[0].appendChild(entry);
  $("div#panel")[0].appendChild(entryBuy);
  $("div#panel")[0].appendChild(document.createElement('br'));
  $("div#panel")[0].appendChild(document.createElement('br'));
  $("div#panel")[0].appendChild(div);
};

//a callback function to check if you can buy something;
//should return {OK:true,msg:'',postBuy:null} where message will be displayed either as reason why you cannot buy or cost
//unused because makes it unoverridable ->postboy is {fn:foo, cost:x} where fn points to a function that is called after buying (fn(itemid,x));  
//this implementation checks: money
window.gm.defaultCanBuy =function(itemid,cost){
  var result ={OK:true,msg:''};//, postBuy:null};
  var money= window.gm.player.Inv.countItem('Money');
  if(money>=cost) {
      result.msg='buy for '+cost+'$';
      //result.postBuy = function(x){ return (function(item,y=x){window.gm.defaultPostBuy(item,y);})}(cost);
      //result.postBuy = {fn:window.gm.defaultPostBuy, cost:cost};
  } else {
      result.OK=false;
      result.msg='requires '+cost+'$';
  };
  return(result);
};
window.gm.defaultCanSell =function(itemid,cost){
  var result ={OK:true,msg:''};   //todo check equipped item
  result.msg='sell for '+cost+'$';
  return(result);
};
//requires a <div id='choice'> </div> for displaying bought-message
window.gm.defaultPostSell =function(itemid,cost){
  window.gm.player.Inv.addItem(new Money(),cost);
  $("div#choice")[0].innerHTML='You sold '+ itemid; 
  $("div#choice")[0].classList.remove("div_alarm");
  $("div#choice")[0].offsetWidth; //this forces the browser to notice the class removal
  $("div#choice")[0].classList.add("div_alarm");
};
//requires a <div id='choice'> </div> for displaying bought-message
window.gm.defaultPostBuy =function(itemid,cost){
  window.gm.player.Inv.removeItem('Money',cost);
  $("div#choice")[0].innerHTML='You bought '+ itemid; 
  $("div#choice")[0].classList.remove("div_alarm");
  $("div#choice")[0].offsetWidth; //this forces the browser to notice the class removal
  $("div#choice")[0].classList.add("div_alarm");
};
window.gm.cbCanBuyPerverse = function(itemid,cost,pervcost) {
  var result = window.gm.defaultCanBuy(itemid,cost);
  if(window.gm.player.Stats.get('perversion').value<pervcost) {
      result.msg += ' ; requires Perversion> '+pervcost;
      result.OK=false;
  }
  return(result);
};
//this will add item to player; money-deduct or other cost has to be done in cbPostBuy ! 
window.gm.buyFromShop=function(itemid, count,cbPostBuy) {
  window.gm.player.Inv.addItem(new window.storage.constructors[itemid](),count);   //Todo item or wardrobe
  if(cbPostBuy) cbPostBuy(itemid);
  //window.gm.refreshScreen(); dont refresh fullscreen or might reset modified textoutput
  window.gm.updateOtherPanels(); //just update other panels
  renderToSelector("#panel", "listsell");
};
//this will remove item from player; money-deduct or other cost has to be done in cbPostSell ! 
window.gm.sellToShop=function(itemid, count,cbPostSell) {
  window.gm.player.Inv.removeItem(itemid,count);
  if(cbPostSell) cbPostSell(itemid);
  //window.gm.refreshScreen(); dont refresh fullscreen or might reset modified textoutput
  window.gm.updateOtherPanels(); //just update other panels
  renderToSelector("#panel", "listsell");
};
//dynamically build a link representing a sell option including display of cost
//count defines how many of this item you have to trade in
window.gm.printShopSellEntry= function(itemid,count,cbCanSell,cbPostSell){
  var _available = window.gm.player.Inv.countItem(itemid); //only items the player has can be sold
  if(_available<=0) return; 
  var entry = document.createElement('a');
  entry.id=itemid;
  entry.href='javascript:void(0)';
  var showDesc=function($event){var elmt =document.querySelector("div#"+$event.srcElement.id);
      elmt.innerHTML =window.gm.ItemsLib[$event.srcElement.id].desc+"</br>";
      elmt.toggleAttribute("hidden");};
  entry.addEventListener("click", showDesc, false);
  var div = document.createElement('div');
  div.id=itemid;
  div.hidden=true;
  var entrySell = document.createElement('a'); //a link where you can sell
  entrySell.id=itemid;
  entrySell.href='javascript:void(0)';
  entrySell.textContent="Sell";
  var desc2 = itemid+" (x"+count+")";
  if(_available>=count) {
      var result = cbCanSell(itemid);
      if(result.OK===false) {
          desc2 = desc2 + " "+ result.msg;
      } else {
          desc2+= " "+result.msg;
          var foo = function($event){window.gm.sellToShop(itemid,count,cbPostSell)};
          entrySell.addEventListener("click", foo, false);
      }
  } else desc2 = desc2 + " not enough items"

  entry.textContent=desc2;
  $("div#panel")[0].appendChild(entry);
  $("div#panel")[0].appendChild(entrySell);
  $("div#panel")[0].appendChild(document.createElement('br'));
  $("div#panel")[0].appendChild(document.createElement('br'));
  $("div#panel")[0].appendChild(div);
};
//prints a link that when clicked picksup an item and places it in the inventory, if itemleft is <0, no link appears
window.gm.printPickupAndClear= function(itemid, desc,itemleft,cbAfterPickup=null) {
  var elmt='';
  var s= window.story.state;
  if(!(itemleft>0)) return(elmt);
  var desc2 = desc+" ("+itemleft+" left)";
  var msg = 'took '+itemid;
  elmt +="<a0 id='"+itemid+"' onclick='(function($event){window.gm.pickupAndClear(\""+itemid+"\", \""+desc+"\","+itemleft+","+cbAfterPickup+")})(this);'>"+desc2+"</a></br>";
  return(elmt);
};
window.gm.pickupAndClear=function(itemid, desc,itemleft,cbAfterPickup=null) {
  window.gm.player.Inv.addItem(new window.storage.constructors[itemid]());
  //window.gm.pushLog("added "+itemid+" to inventory.</br>");
  if(cbAfterPickup) cbAfterPickup();
  window.gm.refreshScreen();
};
//prints an item with description; used in inventory
window.gm.printItem= function( id,descr) {
  var elmt='';
  var s= window.story.state;
  var _inv = window.gm.player.Inv;
  var _count =_inv.countItem(id);
  elmt +=`<a0 id='${id}' onclick='(function($event){document.querySelector(\"div#${id}\").toggleAttribute(\"hidden\");})(this);'>${id} (x${_count})</a>`;
  var useable = _inv.usable(id);
  if(_count>0 && useable.OK) {

      elmt +=`<a0 id='${id}' onclick='(function($event){var _res=window.gm.player.Inv.use(\"${id}\"); window.gm.refreshScreen();window.gm.printOutput(_res.msg);}(this))'>${useable.msg}</a>`;
  }
  elmt +=`</br><div hidden id='${id}'>${descr}</div>`;
  if(window.story.passage(id))  elmt +=''.concat("    [[Info|"+id+"]]");  //Todo add comands: drink,eat, use
      elmt +=''.concat("</br>");
      return(elmt);
};
//prints an equipment with description; used in wardrobe
window.gm.printEquipment= function( id,descr) {
  var elmt='';
  var s= window.story.state;
  elmt +=`<a0 id='${id}' onclick='(function($event){document.querySelector(\"div#${id}\").toggleAttribute(\"hidden\");})(this);'>${id}</a>`;
  if(window.gm.player.Outfit.countItem(id)<=0) {
      //elmt +=`<a0 id='${id}' onclick='(function($event){window.gm.player.Outfit.addItem(new window.storage.constructors[\"${id}\"]()); window.gm.refreshScreen();}(this))'>Equip</a>`;
      elmt +=`<a0 id='${id}' onclick='(function($event){window.gm.player.Outfit.addItem(window.gm.player.Wardrobe.getItem(\"${id}\")); window.gm.refreshScreen();}(this))'>Equip</a>`;
  } else {
      elmt +=`<a0 id='${id}' onclick='(function($event){window.gm.player.Outfit.removeItem(\"${id}\"); window.gm.refreshScreen();}(this))'>Unequip</a>`;
  }
  elmt +=`</br><div hidden id='${id}'>${descr}</div>`;

  if(window.story.passage(id))  elmt +=''.concat("    [[Info|"+id+"]]");  //Todo add comands: drink,eat, use
      elmt +=''.concat("</br>");
      return(elmt);
};

//prints a string listing equipped items
window.gm.printEquipmentSummary= function() {
  var elmt='';
  var s= window.story.state;
  var result ='';
  var ids = [];
  for(var i=0;i<window.gm.player.Outfit.count();i++){
      if(i>=window.gm.OutfitSlotpLib.bTorso) continue; //skip bodyparts
      var id = window.gm.player.Outfit.getItemId(i);
      if(id!='' && ids.indexOf(id)<0) {
          ids.push(id);
          result+=id+',';
      }
  }
  return(result);
};
//prints a string listing equipped items
window.gm.printRelationSummary= function() {
  var elmt='';
  var s= window.story.state;
  var result ='';
  var ids = [];
  result+='<table>';
  var ids = window.gm.player.Rel.getAllIds();
  ids.sort();
  for(var k=0;k<ids.length;k++){
      if(ids[k].split("_").length===1) {   //ignore _min/_max
          var data = window.gm.player.Rel.get(ids[k]);
          result+='<tr><td>'+data.id+':</td><td>'+data.value+' of '+window.gm.player.Rel.get(ids[k]+"_Max").value+'</td></tr>';
      }
  }   //todo print mom : 10 of 20
  result+='</table>';
  return(result);
};
//prints achievements
window.gm.printAchievements= function() {
  var elmt='';
  var result ='';
  var ids = [];
  result+='<table>';
  var ids = Object.keys(window.gm.achievements);
  ids.sort();
  for(var k=0;k<ids.length;k++){
      if(ids[k].split("_").length===1) {   //ignore _min/_max
          result+='<tr><td>'+ids[k]+':</td><td>'+window.gm.achievements[ids[k]]+'</td></tr>';
      }
  }   //todo print mom : 10 of 20
  result+='</table>';
  return(result);
};
//prints a string listing stats and effects
window.gm.printEffectSummary= function(who='player') {
  var elmt='';
  var s= window.story.state;
  var result ='';
  var ids = [];
  result+='<table>';
  var ids =window.gm[who].Stats.getAllIds();
  ids.sort(); //Todo better sort
  for(var k=0;k<ids.length;k++){
      var data = window.gm[who].Stats.get(ids[k])
      if(data.hidden!==4) {
          result+='<tr><td>'+((data.hidden & 0x1)?'???':data.id)+':</td><td>'+((data.hidden & 0x2)?'???':data.value)+'</td></tr>';
      }
  }
  result+='</table>';
  result+='</br>Active Effects:<table>'
  ids = window.gm[who].Effects.getAllIds();
  ids.sort(); //Todo better sort
  for(var i=0;i<ids.length;i++){
      var data = window.gm[who].Effects.get(ids[i]);
      result+='<tr><td>'+data.id+':</td><td>'+data.name+'</td></tr>';
  }
  result+='</table>';
  return(result);
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