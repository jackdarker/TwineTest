"use strict";
//import {Item} from './Inventory.js';
/* class definiton of items & Equipment */
class Item {
    constructor(name) {
        this.name = name;
        this.desc = '';
    }
    usable(context) {return({OK:false, msg:'Cannot use.'});}
    use(context) {return({OK:false, msg:'Cannot use.'});}
}
function defaultCanUse(context) {return({OK:true, msg:'usable'})}
function defaultNoUse(context) {return({OK:false, msg:''})}
function defaultOnUse(context) {return({OK:true, msg:'You used the item.'})}
function defaultCanUnequip(context) {return({OK:true, msg:''});}
function defaultNoUnequip(context) {return({OK:false, msg:'You need to find a key first to be able to remove it!'});}

class LighterDad extends Item {
    constructor() {
        super('Lighter from Dad');
        this.desc = 'I got this lighter from my real dad.';
    }
};

class LaptopPS extends Item {
    constructor() {
        super('Laptop-PS');
        this.desc = 'Power converter for laptop.';
    }
};

class CanOfCoffee extends Item {
    constructor() {
        super('Can of coffee');
        this.desc = 'Cold coffee in a can. Tasty? Not really!';
    }
    usable(context) {return({OK:true, msg:'drinkable'});}
    use(context) { 
        if(context instanceof Inventory) {
            context.removeItem('CanOfCoffee');
            if(context.parent instanceof Character){
                context.parent.addEffect('CanOfCoffee:Energized',window.gm.EffectLib.Energized);    //apply over-time-effect instead directly changing stat
            return({OK:true, msg:context.parent.name+' gulped down a can of iced coffee.'});
            }
        } 
    }
};
class SimpleFood extends Item {
    constructor() {
        super('Simple food');
        this.desc = 'Something to eat.';
    }
    usable(context) {return({OK:true, msg:'eatable'});}
    use(context) { 
        if(context instanceof Inventory) {
            context.removeItem('Simple food');
            if(context.parent instanceof Character){
                context.parent.addEffect('Simple food:Energized',window.gm.EffectLib.Energized);
            return({OK:true, msg:context.parent.name+' ate some plan foods.'});
            }
        }
        
    }
}



