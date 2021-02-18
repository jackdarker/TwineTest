"use strict";

//operations for save/reload

window.onload = function() {
  
  
};

window.storage = {  
  // A list of constructors the smart reviver should know about  
  // you need to register the class of each object that you want to serialize to this list
  // and each class also has to have a method toJSON and static method fromJSON (calling Generic_-versions, see below )
  constructors : {}, 
  // A generic "smart reviver" function.
  // Looks for object values with a `ctor` property and
  // a `data` property. If it finds them, and finds a matching
  // constructor that has a `fromJSON` property on it, it hands
  // off to that `fromJSON` fuunction, passing in the value.
  Reviver: function(key, value) {
    console.info( 'reviver with key =' + key )
    var ctor;
    
    if (typeof value === "object" &&
        typeof value.ctor === "string" &&
        typeof value.data !== "undefined") {
      ctor = window.storage.constructors[value.ctor] || window[value.ctor];
      if (typeof ctor === "function" &&
          typeof ctor.fromJSON === "function") {
        return ctor.fromJSON(value);
      }
    }
    return value;
  },
    
  // A generic "toJSON" function that creates the data expected by Reviver.
  // `ctorName`  The name of the constructor to use to revive it
  // `obj`       The object being serialized
  // `keys`      (Optional) Array of the properties to serialize,
  //             if not given then all of the objects "own" properties
  //             that don't have function values will be serialized.
  //             (Note: If you list a property in `keys`, it will be serialized
  //             regardless of whether it's an "own" property.)
  // Returns:    The structure (which will then be turned into a string
  //             as part of the JSON.stringify algorithm)
  // Stringify it with a replacer: var str = JSON.stringify(myObj);
  Generic_toJSON: function(ctorName, obj, keys) {
    var data, index, key;
    
    if (!keys) {
      keys = Object.keys(obj); // Only "own" properties are included
    }
    
    data = {};
    for (index = 0; index < keys.length; ++index) {
      key = keys[index];
      data[key] = obj[key];
    }
    return {ctor: ctorName, data: data};
  },
  
  // A generic "fromJSON" function for use with Reviver: Just calls the
  // constructor function with no arguments, then applies all of the
  // key/value pairs from the raw data to the instance.
  // Only useful for constructors that can be reasonably called without arguments!
  // `ctor`      The constructor to call
  // `data`      The data to apply
  // Returns:    The object
  Generic_fromJSON: function(ctor, data) {
    var obj, name, setter, setter2;
    
    obj = new ctor();
    for (name in data) {
      setter = "set"+name[0].toUpperCase()+name.substr(1); // we get the name of the setter for that property (e.g. : key=property => setter=setProperty
      // that kind of names cannot be found in obj??? setter2 = "set "+name.substr(1); // e.g. : key=_property => setter=set property   (javascript style setter)
      if(setter in obj){ // if the setter exists 
        obj[setter](data[name]); // we call the setter
     // } else if(setter2 in obj){ // ..or...
     //   obj[setter2](data[name]); 
      } else { // if not, we set it directly
        obj[name] = data[name];
      }
    }
    return obj;
  },
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