// Raw
window.onload = function() {
  
  // A generic "smart reviver" function.
  // Looks for object values with a `ctor` property and
  // a `data` property. If it finds them, and finds a matching
  // constructor that has a `fromJSON` property on it, it hands
  // off to that `fromJSON` fuunction, passing in the value.
  function Reviver(key, value) {
    console.info( 'reviver with key =' + key )
    var ctor;
    
    if (typeof value === "object" &&
        typeof value.ctor === "string" &&
        typeof value.data !== "undefined") {
      ctor = Reviver.constructors[value.ctor] || window[value.ctor];
      if (typeof ctor === "function" &&
          typeof ctor.fromJSON === "function") {
        return ctor.fromJSON(value);
      }
    }
    return value;
  }
  Reviver.constructors = {}; // A list of constructors the smart reviver should know about  
  
  // A generic "toJSON" function that creates the data expected
  // by Reviver.
  // `ctorName`  The name of the constructor to use to revive it
  // `obj`       The object being serialized
  // `keys`      (Optional) Array of the properties to serialize,
  //             if not given then all of the objects "own" properties
  //             that don't have function values will be serialized.
  //             (Note: If you list a property in `keys`, it will be serialized
  //             regardless of whether it's an "own" property.)
  // Returns:    The structure (which will then be turned into a string
  //             as part of the JSON.stringify algorithm)
  function Generic_toJSON(ctorName, obj, keys) {
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
  }
  
  // A generic "fromJSON" function for use with Reviver: Just calls the
  // constructor function with no arguments, then applies all of the
  // key/value pairs from the raw data to the instance. Only useful for
  // constructors that can be reasonably called without arguments!
  // `ctor`      The constructor to call
  // `data`      The data to apply
  // Returns:    The object
  function Generic_fromJSON(ctor, data) {
    var obj, name;
    
    obj = new ctor();
    for (name in data) {
      obj[name] = data[name];
    }
    return obj;
  }
  
  // `Foo` is a constructor function that integrates with Reviver
  // but doesn't need anything but the generic handling.
  function Foo() {
  }
  Foo.prototype.nifty = "I'm the nifty inherited property.";
  Foo.prototype.spiffy = "I'm the spiffy inherited property.";
  Foo.prototype.toJSON = function() {
    return Generic_toJSON("Foo", this);
  };
  Foo.fromJSON = function(value) {
    return Generic_fromJSON(Foo, value.data);
  };
  Reviver.constructors.Foo = Foo;
  
  // `Bar` is a constructor function that integrates with Reviver
  // but has its own custom JSON handling for whatever reason.
  function Bar(value, count) {
    this.value = value;
    this.count = count;
  }
  Bar.prototype.nifty = "I'm the nifty inherited property.";
  Bar.prototype.spiffy = "I'm the spiffy inherited property.";
  Bar.prototype.toJSON = function() {
    // Bar's custom handling *only* serializes the `value` property
    // and the `spiffy` or `nifty` props if necessary.
    var rv = {
      ctor: "Bar",
      data: {
        value: this.value,
        count: this.count
      }
    };
    if (this.hasOwnProperty("nifty")) {
      rv.data.nifty = this.nifty;
    }
    if (this.hasOwnProperty("spiffy")) {
      rv.data.spiffy = this.spiffy;
    }
    return rv;
  };
  Bar.fromJSON = function(value) {
    // Again custom handling, for whatever reason Bar doesn't
    // want to serialize/deserialize properties it doesn't know
    // about.
    var d = value.data;
        b = new Bar(d.value, d.count);
    if (d.spiffy) {
      b.spiffy = d.spiffy;
    }
    if (d.nifty) {
      b.nifty = d.nifty;
    }
    return b;
  };
  Reviver.constructors.Bar = Bar;
  
  // An object with `foo` and `bar` properties:
  var before = {
    foo: new Foo(),
    bar: new Bar("testing", 42)
  };
  before.foo.custom = "I'm a custom property";
  before.foo.nifty = "Updated nifty";
  before.bar.custom = "I'm a custom property"; // Won't get serialized!
  before.bar.spiffy = "Updated spiffy";
  
  // Use it
  display("before.foo.nifty = " + before.foo.nifty);
  display("before.foo.spiffy = " + before.foo.spiffy);
  display("before.foo.custom = " + before.foo.custom + " (" + typeof before.foo.custom + ")");
  display("before.bar.value = " + before.bar.value + " (" + typeof before.bar.value + ")");
  display("before.bar.count = " + before.bar.count + " (" + typeof before.bar.count + ")");
  display("before.bar.nifty = " + before.bar.nifty);
  display("before.bar.spiffy = " + before.bar.spiffy);
  display("before.bar.custom = " + before.bar.custom + " (" + typeof before.bar.custom + ")");
  
  // Stringify it with a replacer:
  var str = JSON.stringify(before);
  
  // Show that
  display("The string: " + str);
  
  // Re-create it with use of a "reviver" function
  var after = JSON.parse(str, Reviver);
  
  // Use the result
  display("after.foo.nifty = " + after.foo.nifty);
  display("after.foo.spiffy = " + after.foo.spiffy);
  display("after.foo.custom = " + after.foo.custom + " (" + typeof after.foo.custom + ")");
  display("after.bar.value = " + after.bar.value + " (" + typeof after.bar.value + ")");
  display("after.bar.count = " + after.bar.count + " (" + typeof after.bar.count + ")");
  display("after.bar.nifty = " + after.bar.nifty);
  display("after.bar.spiffy = " + after.bar.spiffy);
  display("after.bar.custom = " + after.bar.custom + " (" + typeof after.bar.custom + ")");
  
  display("(Note that after.bar.custom is undefined because <code>Bar</code> specifically leaves it out.)");

  // === Basic utility functions
  
  function display(msg) {
    var p = document.createElement('p');
    p.innerHTML = msg;
    document.body.appendChild(p);
  }
  
};

/* if you want to call setters instead of assign properties directly

Obj.createFromJSON = function(json){
   if(typeof json === "string") // if json is a string
      json = JSON.parse(json); // we convert it to an object
   var obj = new Obj(), setter; // we declare the object we will return
   for(var key in json){ // for all properties
      setter = "set"+key[0].toUpperCase()+key.substr(1); // we get the name of the setter for that property (e.g. : key=property => setter=setProperty
      // following the OP's comment, we check if the setter exists :
      if(setter in obj){
         obj[setter](json[key]); // we call the setter
      }
      else{ // if not, we set it directly
         obj[key] = json[key];
      }
   }
   return obj; // we finally return the instance
};
*/

----------------------------------------------------------------------------------------
generic function to use Object.assign to rebuild a nested object/array

example:
function Msg(data) {
    //... your init code
    this.data = data //can be another object or an array of objects of custom types. 
                     //If those objects defines `this.__type', their types will be assigned automatically as well
    this.__type = "Msg"; // <- store the object's type to assign it automatically
}

Msg.prototype = {
    createErrorMsg: function(errorMsg){
        return new Msg(0, null, errorMsg)
    },
    isSuccess: function(){
        return this.errorMsg == null;
    }
}

var responseMsg = //json string of Msg object received;
responseMsg = assignType(responseMsg);

if(responseMsg.isSuccess()){ // isSuccess() is now available
      //furhter logic
      //...
}

you need this:
function assignType(object){
    if(object && typeof(object) === 'object' && window[object.__type]) {
        object = assignTypeRecursion(object.__type, object);
    }
    return object;
}

function assignTypeRecursion(type, object){
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            var obj = object[key];
            if(Array.isArray(obj)){
                 for(var i = 0; i < obj.length; ++i){
                     var arrItem = obj[i];
                     if(arrItem && typeof(arrItem) === 'object' && window[arrItem.__type]) {
                         obj[i] = assignTypeRecursion(arrItem.__type, arrItem);
                     }
                 }
            } else  if(obj && typeof(obj) === 'object' && window[obj.__type]) {
                object[key] = assignTypeRecursion(obj.__type, obj);
            }
        }
    }
    return Object.assign(new window[type](), object);
}
