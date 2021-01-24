"use strict";
// modded version of simple-inventory.min.js for SugarCube 2 by Chapel
!function(){
  var c={
      tryGlobal:!0,
      defaultStrings:{empty:"The inventory is empty...",listDrop:"Discard",separator:"\n"}
  };
  function s(i,r,t,n){
    $(document).trigger({type:"initialized"===n?":inventory-init":":inventory-update",instance:i,receiving:r,moved:t,context:n})
  }
  function a(i){
      if(i=i?(i=[].slice.call(arguments)).flatten():[],!(this instanceof a))
        return new a(i);
      this.inv=i,s(this,null,i=i.length?i:null,"initialized")
  }
  Object.assign(a,{
  is:function(i){return i instanceof a},
  log:function(i){return a.is(i)?"Inventory.log() -> "+i.toArray().join(" - "):"Inventory.log() -> object is not an inventory..."},
  removeDuplicates:function(i){if(a.is(i)){var r,t=i.toArray();return r=[],t.forEach(function(i){r.includes(i)||r.push(i)}),r}}}),
  
  Object.assign(a.prototype,{
  transfer:function(i){if(arguments.length<2)return this;if(!a.is(i))return this;for(var r=[].slice.call(arguments),t=[],n=0,e=(r=r.slice(1).flatten()).length;n<e;n++)this.inv.includes(r[n])&&(this.inv.delete(r[n]),t.push(r[n]));return t.length&&(i.inv=i.inv.concat(t),s(this,i,t,"transfer")),this}
  ,has:function(){var i=[].slice.call(arguments).flatten();return!(!i||!i.length)&&this.inv.includesAny(i)}
  ,hasAll:function(){var i=[].slice.call(arguments).flatten();return!(!i||!i.length)&&this.inv.includesAll(i)}
  ,pickUp:function(i){var r,t=[].slice.call(arguments).flatten(),n=this;return t&&t.length&&("unique"!==i&&"unique"!==t[0]||(t=t.splice(1),r=[],t.forEach(function(i){n.inv.includes(i)||r.includes(i)||r.push(i)}),t=r),this.inv=this.inv.concat(t),s(this,null,t,"pickup")),this}
  ,drop:function(){var r,i=[].slice.call(arguments).flatten(),t=this;if(i&&i.length){var n=[];i.forEach(function(i){t.has(i)&&(n.push(i),r=t.inv.indexOf(i),t.inv.deleteAt(r))}),s(this,null,n,"drop")}return this}
  ,sort:function(){return this.inv=this.inv.sort(),s(this,null,null,"sort"),this}
  ,show:function(i){return i&&"string"==typeof i||(i=c.defaultStrings.separator),this.inv.length?this.inv.join(i):c.defaultStrings.empty}
  ,empty:function(){var i=clone(this.inv);return this.inv=[],s(this,null,i,"drop"),this}
  ,toArray:function(){return this.inv}
  ,count:function(r){if(r&&"string"==typeof r){var t=0;return this.toArray().forEach(function(i){i===r&&t++}),t}return this.toArray().length}
  ,isEmpty:function(){return 0===this.toArray().length}
  ,linkedList:function(o,l){o&&a.is(o)||(o=!1);var i=this.toArray(),h=this,u=$(document.createElement("span"));return i&&i.length?i.forEach(function(i,r,t){var n=$(document.createElement("span")),e=$(document.createElement("a")),s=l||c.defaultStrings.drop,a=function(i,r){var t=Math.random().toString(36).substring(7);return arguments.length<2&&(i=Math.random().toString(36).substring(7),r=random(99)),"simple-inv-"+r+"-"+Date.now()+"-"+i.replace(/[^A-Za-z0-9]/g,"")+"-"+t}(i,r);e.wiki(s).addClass("simple-inv drop-link"),e.ariaClick(function(){o?h.transfer(o,i):h.drop(i),$("#"+a).empty()}),n.attr("id",a).addClass("simple-inv link-listing").wiki(i+" ").append(e),r<t.length-1&&n.wiki("<br />"),u.append(n)}):u.wiki(c.defaultStrings.empty),u}
  ,constructor:a
  ,toJSON:function(){return JSON.reviveWrapper("new setup.Inventory("+JSON.stringify(this.inv)+")")}
  ,clone:function(){return new a(this.inv)}}),
  
  setup.Inventory=a,
  setup.simpleInv={inventory:a},
  c.tryGlobal&&(window.Inventory=window.Inventory||a); /*,
  Macro.add("newinventory",{handler:function(){if(this.args.length<1)return this.error("incorrect number of arguments");var i=this.args[0].trim();if("$"!==i[0]&&"_"!==i[0])return this.error('variable name "'+this.args[0]+'" is missing its sigil ($ or _)');Wikifier.setValue(i,new a(this.args.slice(1).flatten()))}}),
  Macro.add("pickup",{handler:function(){if(this.args.length<2)return this.error("incorrect number of arguments");var i=this.args[0].trim();if("$"!==i[0]&&"_"!==i[0])return this.error('variable name "'+this.args[0]+'" is missing its sigil ($ or _)');var r=Wikifier.getValue(i);if(!a.is(r))return this.error("variable "+i+" is not an inventory!");r.pickUp(this.args.slice(1).flatten())}}),
  Macro.add("drop",{handler:function(){if(this.args.length<2)return this.error("incorrect number of arguments");var i=this.args[0].trim();if("$"!==i[0]&&"_"!==i[0])return this.error('variable name "'+this.args[0]+'" is missing its sigil ($ or _)');var r=Wikifier.getValue(i);if(!a.is(r))return this.error("variable "+i+" is not an inventory!");r.drop(this.args.slice(1).flatten())}}),
  Macro.add("transfer",{handler:function(){if(this.args.length<3)return this.error("incorrect number of arguments");var i=this.args[0].trim();if("$"!==i[0]&&"_"!==i[0])return this.error('variable name "'+this.args[0]+'" is missing its sigil ($ or _)');var r=Wikifier.getValue(i);if(!a.is(r))return this.error("variable "+i+" is not an inventory!");var t=this.args[1].trim();if("$"!==t[0]&&"_"!==t[0])return this.error('variable name "'+this.args[1]+'" is missing its sigil ($ or _)');var n=Wikifier.getValue(t);if(!a.is(n))return this.error("variable "+t+" is not an inventory!");r.transfer(n,this.args.slice(2).flatten())}}),
  Macro.add("dropall",{handler:function(){if(1!==this.args.length)return this.error("incorrect number of arguments");var i=this.args[0].trim();if("$"!==i[0]&&"_"!==i[0])return this.error('variable name "'+this.args[0]+'" is missing its sigil ($ or _)');var r=Wikifier.getValue(i);if(!a.is(r))return this.error("variable "+i+" is not an inventory!");r.empty()}}),
  Macro.add("clear","dropall",!1),Macro.add("sort",{handler:function(){if(1!==this.args.length)return this.error("incorrect number of arguments");var i=this.args[0].trim();if("$"!==i[0]&&"_"!==i[0])return this.error('variable name "'+this.args[0]+'" is missing its sigil ($ or _)');var r=Wikifier.getValue(i);if(!a.is(r))return this.error("variable "+i+" is not an inventory!");r.sort()}}),
  Macro.add("inventory",{handler:function(){if(this.args.length<1||2<this.args.length)return this.error("incorrect number of arguments");var i=this.args[0].trim();if("$"!==i[0]&&"_"!==i[0])return this.error('variable name "'+this.args[0]+'" is missing its sigil ($ or _)');var r=Wikifier.getValue(i);if(!a.is(r))return this.error("variable "+i+" is not an inventory!");var t=$(document.createElement("span")),n=!!this.args[1]&&this.args[1];t.wiki(r.show(n)).addClass("macro-"+this.name).appendTo(this.output)}}),
  Macro.add("linkedinventory",{handler:function(){if(this.args.length<2||3<this.args.length)return this.error("incorrect number of arguments");var i=!1,r="",t=this.args[1].trim(),n="string"==typeof this.args[0]&&this.args[0];if(!n)return this.error("first argument should be the link text");if("$"!==t[0]&&"_"!==t[0])return this.error('variable name "'+this.args[1]+'" is missing its sigil ($ or _)');var e=Util.slugify(t);e=this.name+"-"+e;var s=Wikifier.getValue(t);if(!a.is(s))return this.error("variable "+t+" is not an inventory!");if(2<this.args.length){if("$"!==(r=this.args[2].trim())[0]&&"_"!==r[0])return this.error('variable name "'+this.args[2]+'" is missing its sigil ($ or _)');if(i=Wikifier.getValue(r),!a.is(i))return this.error("variable "+r+" is not an inventory!")}s.linkedList(i,n).attr({id:e,"data-rec":r,"data-self":t,"data-action":n}).addClass("macro-"+this.name).appendTo(this.output)}})
  */
  };
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
    if (!s.vars||forceReset) { // not working ??  s.vars = s.vars | {cabinetkey : false};
        s.vars = {
        cabinetkey : true,
        time : 700, //represented as hours*100 +minutes
        day : 1,
        //queststates
        qLaptop : 0   // see passage _Laptop_
        }; 
    }
    if (!s.player||forceReset) {  //
        s.player = {
        location : "",
        money : 5,
        energy : 55,
        maxEnergy : 100,
        skillPoints : 2,    //no. of free skillpoints on game-start
        //skilllevels
        skSporty : 0,
        skCook : 0,
        skSlacker : 0,
        skMoneymaker : 0,
        skTechy : 0
        }; 
    }
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
addItem(item,count) {
  window.Inventory.pickup(item);
},
dropBanana: function() {
    window.story.state.vars.bananas -=1;
    return(window.story.state.vars.bananas);
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
