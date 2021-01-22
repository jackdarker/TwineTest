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
    save: function(slot,hash) {
      window.localStorage.setItem(slot, hash);
    },
    restore: function(slot) {
      return window.localStorage.getItem(slot);
    },
    delete: function(slot) {
      window.localStorage.removeItem(slot);
    },
      getSaveInfo: function(slot) {
          var _blob;
        if(window.storage.ok()) {
            _blob =window.storage.restore(slot);		
        }
      if(!_blob.info) {
          return('??');
        } else {
            return(_blob.info);
        }
        
    },
      saveBrowser: function(slot) {
      var hash =window.story.save();	
      var info = new Date().toString();	
      var _blob={info:new Date().toString(),
        hash:window.story.save()};		
      document.querySelector("output").textContent = hash;
          window.storage.save(slot,_blob);
    },
      loadBrowser: function(slot) {
          var _blob;
          if(window.storage.ok()) {
              _blob=window.storage.restore(slot);	
              window.story.restore(hash) ; 
              document.querySelector("output").textContent = _blob.info;
          }
    }
  };
  window.gm = {
      addTime: function(min) {
      window.story.state.vars.time += min;
      document.querySelector("output").textContent = window.story.state.vars.time;
    },
    dropBanana: function() {
      window.story.state.vars.bananas -=1;
      return(window.story.state.vars.bananas);
      }
  };