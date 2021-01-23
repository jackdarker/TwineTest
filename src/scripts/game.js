window.storage = {
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
window.gm = {
getSaveVersion: function(){
    return('1.0.0');
},
initGame: function() {
    var s = window.story.state; //s in template is window.story.state from snowman!
    if (!s.vars) { // not working ??  s.vars = s.vars | {cabinetkey : false};
        s.vars = {
        cabinetkey : true,
        time : 700, 
        day : 1
        }; 
    }
    if (!s.player) { 
        s.player = {
        location : "",
        money : 5,
        energy : 55,
        maxEnergy : 100,

        }; 
    }
},
    addTime: function(min) {
    window.story.state.vars.time += min;
    if(window.story.state.vars.time>2400){
    window.story.state.vars.time -= 2400;
    window.story.state.vars.day += 1;
    }
    document.querySelector("output").textContent = window.story.state.vars.time;
},
dropBanana: function() {
    window.story.state.vars.bananas -=1;
    return(window.story.state.vars.bananas);
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