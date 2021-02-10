"use strict";
/* bundles some utility operations*/
window.gm = window.gm || {};

window.gm.refreshScreen= function() {
    window.story.show(window.passage.name);
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
    window.gm.player.Inv.addItem(itemid);
    window.gm.pushLog("added "+itemid+" to inventory.</br>");
    if(cbAfterPickup) cbAfterPickup.call();
    window.story.show(window.passage.name);
};
//prints an item with description; used in inventory
window.gm.printItem= function( id,descr) {
    var elmt='';
    var s= window.story.state;
    var _inv = window.gm.player.Inv;
    var _count =_inv.countItem(id);
    elmt +=`<a0 id='${id}' onclick='(function($event){document.querySelector(\"div#${id}\").toggleAttribute(\"hidden\");})(this);'>${id} (x${_count})</a>`;
    if(_count>0 && _inv.usable(id).OK) {
        elmt +=`<a0 id='${id}' onclick='(function($event){window.gm.player.Inv.use(\"${id}\"); window.gm.refreshScreen();}(this))'>Use</a>`;
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
        elmt +=`<a0 id='${id}' onclick='(function($event){window.gm.player.Outfit.addItem(\"${id}\"); window.gm.refreshScreen();}(this))'>Equip</a>`;
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
    for(var k=0;k<window.gm.player.Rel.count();k++){
        var data = window.gm.player.Rel.get(window.gm.player.Rel.getItemId(k));
        result+='<tr><td>'+data.id+':</td><td>'+data.value+'</td></tr>';
    }
    result+='</table>';
    return(result);
};
//prints a string listing equipped items
window.gm.printEffectSummary= function() {
    var elmt='';
    var s= window.story.state;
    var result ='';
    var ids = [];
    result+='<table>';
    for(var k=0;k<window.gm.player.Stats.count();k++){
        var data = window.gm.player.Stats.get(window.gm.player.Stats.getItemId(k));
        result+='<tr><td>'+data.id+':</td><td>'+data.value+'</td></tr>';
    }
    result+='</table>';
    result+='</br>Active Effects:<table>'
    for(var i=0;i<window.gm.player.Effects.count();i++){
        var data = window.gm.player.Effects.getData(i);
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
