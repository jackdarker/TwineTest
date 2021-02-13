"use strict";

//operations for save/reload

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
    compressLocalSave: false,
    loadFile: function(input){
        let file = input.files[0]; 
        let fileReader = new FileReader(); 
        fileReader.onload = function() {
          window.storage.rebuildFromSave(fileReader.result,compressLocalSave);
          div = document.querySelector('#backdrop'); //todo promise
          div.parentNode.removeChild(div);
        }; 
        fileReader.onerror = function() {
          alert(fileReader.error);
        }; 
      fileReader.readAsText(file);
      return(true);  //todo how to make async
    },
    saveFile: function(){
      var hash = JSON.stringify({state:window.story.state,
        history:window.story.history,checkpointName:window.story.checkpointName});
      if(compressLocalSave) hash = LZString.compressToBase64(hash);
      var filename= window.story.name+"_Save.dat";
      var blob = new Blob([hash], {type: "text/plain;charset=utf-8"});
      saveAs(blob, filename);
    },
      saveBrowser: function(slot) {
        //var hash= window.story.save();    this call somehow messes up html and I had to copy the following from snowman script
        var hash = LZString.compressToBase64(JSON.stringify({state:window.story.state,
            history:window.story.history,checkpointName:window.story.checkpointName}));          
        
        var info=window.story.state.player.location +' - '+ new Date().toString();
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
            window.storage.rebuildFromSave(hash,true);
        }
        return(info);
    },
    rebuildFromSave: function(hash,compressed){
      if(!compressed) hash=LZString.compressToBase64(hash);
        window.story.restore(hash) ;
        window.gm.rebuildObjects();
        window.gm.refreshScreen();
    }
};