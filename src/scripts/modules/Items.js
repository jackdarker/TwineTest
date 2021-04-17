"use strict";
class LighterDad extends Item {
    constructor() {
        super('LighterDad');
        this.desc = 'I got this lighter from my real dad.';
    }
    toJSON() {return window.storage.Generic_toJSON("LighterDad", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(LighterDad, value.data);};
};
class Money extends Item {
    constructor() {
        super('Money');
        this.desc = 'shiny,clinky coin.';
    }
    toJSON() {return window.storage.Generic_toJSON("Money", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(Money, value.data);};
};

class LaptopPS extends Item {
    constructor() {
        super('Laptop-PS');
        this.desc = 'Power converter for laptop.';
    }
    toJSON() {return window.storage.Generic_toJSON("LaptopPS", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(LaptopPS, value.data);};
};
class Dildo_small extends Item {
    constructor() {
        super('Dildo_small');
        this.desc = 'A dildo, smaller than an average dong, made from rubbery plastic.';
    }
    toJSON() {return window.storage.Generic_toJSON("Dildo_small", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(Dildo_small, value.data);};
};
class Lube extends Item {
    constructor() {
        super('Lube');
        this.desc = 'Slippery lubricant for personal use.';
    }
    toJSON() {return window.storage.Generic_toJSON("Lube", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(Lube, value.data);};
};
class Battery extends Item {
    constructor() {
        super('Battery');
        this.desc = 'Provides electricity for devices.';
    }
    toJSON() {return window.storage.Generic_toJSON("Battery", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(Battery, value.data);};
};
class CanOfCoffee extends Item {
    constructor() {
        super('Can of coffee');
        this.desc = 'Cold coffee in a can. Tasty? Not really!';
    }
    toJSON() {return window.storage.Generic_toJSON("CanOfCoffee", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(CanOfCoffee, value.data);};
    usable(context) {return({OK:true, msg:'drink'});}
    use(context) { 
        if(context instanceof Inventory) {
            context.removeItem('CanOfCoffee');
            if(context.parent instanceof Character){
                context.parent.addEffect('CanOfCoffee:Energized',new effEnergized());    //apply over-time-effect instead directly changing stat
            return({OK:true, msg:context.parent.name+' gulped down a can of iced coffee.'});
            }
        } else throw new Error('context is invalid');
    }
};
class SimpleFood extends Item {
    constructor() {
        super('SimpleFood');
        this.desc = 'Something to eat.';
    }
    toJSON() {return window.storage.Generic_toJSON("SimpleFood", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(SimpleFood, value.data);};
    usable(context,on=null) {return({OK:true, msg:'eat'});}
    use(context,on=null) { 
        var _gaveAway=false;
        if(context instanceof Inventory) {
            if(on===null) on=context.parent;
            else _gaveAway=true;
            context.removeItem('Simple food');
            if(on instanceof Character){
                on.addEffect('Simple food:Energized',new effEnergized());
            return({OK:true, msg:on.name+' ate some plain foods.'});
            }
        } else throw new Error('context is invalid');
        
    }
}

window.gm.ItemsLib = (function (ItemsLib) {
    // Private Objekte
    /*var privateVariable = "privat";
    function privateFunktion () {
        alert("privateFunktion wurde aufgerufen\n" +
            "Private Variable: " + privateVariable);
    }*/
    window.storage.registerConstructor(LighterDad);
    window.storage.registerConstructor(Money);
    window.storage.registerConstructor(LaptopPS);
    window.storage.registerConstructor(Battery);
    window.storage.registerConstructor(Dildo_small);
    window.storage.registerConstructor(Lube);
    window.storage.registerConstructor(CanOfCoffee);
    window.storage.registerConstructor(SimpleFood);
    
    ItemsLib['Money'] = function () { return new Money();};
    ItemsLib['LighterDad'] = function () { return new LighterDad();};
    ItemsLib['LaptopPS'] = function () { return new LaptopPS();};
    ItemsLib['Battery'] = function () { return new Battery();};
    ItemsLib['Dildo_small'] = function () { return new Dildo_small();};
    // consumables
    ItemsLib['Lube'] = function () { return new Lube();};
    ItemsLib['CanOfCoffee'] = function () { return new CanOfCoffee(); };
    ItemsLib['SimpleFood'] = function () { return new SimpleFood(); };

    return ItemsLib; 
}(window.gm.ItemsLib || {}));