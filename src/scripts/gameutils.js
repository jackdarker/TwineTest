"use strict";
/* bundles some utility operations*/
window.gm = window.gm || {};
window.gm.util = window.gm.util || {};
//updates all panels
window.gm.refreshScreen= function() {
    window.story.show(window.passage.name);
};
//updates only sidepanle,logpanel
window.gm.updateOtherPanels = function(){
    renderToSelector("#sidebar", "sidebar");renderToSelector("#LogPanel", "LogPanel"); 
};
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
        elmt +=`<a0 id='${id}' onclick='(function($event){window.gm.player.Outfit.addItem(new window.storage.constructors[\"${id}\"]()); window.gm.refreshScreen();}(this))'>Equip</a>`;
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
//prints a list of todo quest
window.gm.printTodoList= function() {
    var elmt='<form><ul style=\"list-style-type: none\" >';
    var s= window.story.state;
    var list=['qDogSit'];
    elmt +="<li><label><input type=\"checkbox\" name=\"y\" value=\"x\" readonly disabled>always: keep the fridge filled</label></li>";
    for(var i=0; i<list.length; i++) {
        var val = s.vars[list[i]];
        var msg ='';
        if(list[i]==='qDogSit') {       //todo we could use <%=> instead
        if(val<=0) {  
        } else if(val<=0x100) {
            msg = 'There was this dogsit-ad in the park. Maybe you should call there to earn some money.';
        } else if(val<=0x200) {
            msg = 'You called dogsit but didnt get a response...';
        }else if(val<=0x300) {
            msg = 'Get a task from dogsit!';
        }
        }
        if(msg!='') elmt +="<li><label><input type=\"checkbox\" name=\"y\" value=\"x\" readonly disabled>"+msg+"</label></li>";
    }
        elmt +="</ul></form></br>";
        return(elmt);
};
//prints a list of perks for unlock
window.gm.printUnlockPerk= function(id, descr) {
    var elmt='';
    var s= window.story.state;
        if(window.gm.player[id]==0 && window.gm.player.skillPoints>0) {
            elmt +=''.concat("<a0 id='"+id+"' onclick='(function ( $event ) { unlockPerk($event.id); })(this);'>"+descr+"</a>");
        elmt +=''.concat("    [[Info|"+id+"]]");
        } else if(window.gm.player[id]>0) {
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
// use child._parent = window.gm.util.refToParent(parent);
window.gm.util.refToParent = function(me){ return function(){return(me);}};