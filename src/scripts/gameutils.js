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
    elmt +=`<a0 id='${id}' onclick='(function($event){document.querySelector(\"div#${id}\").toggleAttribute(\"hidden\");})(this);'>${id}</a><div hidden id='${id}'>${descr}</div>`;

    if(window.story.passage(id))  elmt +=''.concat("    [[Info|"+id+"]]");  //Todo add comands: drink,eat, use
        elmt +=''.concat("</br>");
        return(elmt);
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
        if(val<=0) {  ;
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
