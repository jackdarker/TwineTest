
class Leggings extends Equipment {
    constructor() {
        super('Leggings');
        this.tags = ['cloth'];
        this.slotUse = ['Legs'];
        this.desc = 'Spandex-leggings for sport. (agility+)'
        window.storage.registerConstructor(Leggings);
    }
    toJSON() {return window.storage.Generic_toJSON("Leggings", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(Leggings, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
    onEquip() {
        this.parent.parent.Stats.addModifier('agility',{id:'agility:Leggings', bonus:5});
        return({OK:true, msg:'equipped'});}
    onUnequip() {
        this.parent.parent.Stats.removeModifier('agility',{id:'agility:Leggings'});
        return({OK:true, msg:'unequipped'});}
}
class Jeans extends Equipment {
    constructor() {
        super('Jeans');
        this.tags = ['cloth'];
        this.slotUse = ['Legs'];
        this.desc = 'plain old blue jeans';
        window.storage.registerConstructor(Jeans);
    }
    toJSON() {return window.storage.Generic_toJSON("Jeans", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(Jeans, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
}
class TankShirt extends Equipment {
    constructor() {
        super('TankShirt');
        this.tags = ['cloth'];
        this.slotUse = ['Torso'];
        this.desc = 'light blue tank-top'
        window.storage.registerConstructor(TankShirt);
    }
    toJSON() {return window.storage.Generic_toJSON("TankShirt", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(TankShirt, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
}
class Pullover extends Equipment {
    constructor() {
        super('Pullover');
        this.tags = ['cloth'];
        this.slotUse = ['Torso','Arms'];
        this.desc = 'warm pullover'
        window.storage.registerConstructor(Pullover);
    }
    toJSON() {return window.storage.Generic_toJSON("Pullover", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(Pullover, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
}
class HandCuffs extends Equipment {
    constructor() {
        super('HandCuffs');
        this.tags = ['restrain'];
        this.slotUse = ['RHand','LHand'];
        this.desc = 'handcuffs'
        window.storage.registerConstructor(Pullover);
    }
    toJSON() {return window.storage.Generic_toJSON("HandCuffs", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(HandCuffs, value.data));}
    usable(context) {return(this.canEquip());}
    use(context) { //context here is inventory not outfit
        if(this.parent.parent.Outfit.findItemSlot(this.name).length>0) {  
            this.parent.parent.Outfit.removeItem(this.name); 
            return( {OK:true, msg:'unequipped '+ this.name}); //todo
        } else {
            this.parent.parent.Outfit.addItem(this); 
            return( {OK:true, msg:'equipped '+ this.name}); //todo
        }
    }
    canEquip() { 
        if(this.parent.parent.Outfit.findItemSlot(this.name).length>0) return({OK:true, msg:'unequip'});    //todo check for key
        else return({OK:true, msg:'equip'});
    }
    canUnequip() {return({OK:false, msg:'You need to find a key first to be able to remove it!'});}
}
//this is an Inventory-item, not wardrobe
class Crowbar extends Equipment {
    constructor() {
        super('Crowbar');
        this.desc = 'A durable crowbar.';
        this.tags = ['tool', 'weapon'];
        this.slotUse = ['RHand'];
        window.storage.registerConstructor(Crowbar);
    }
    toJSON() {return window.storage.Generic_toJSON("Crowbar", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(Crowbar, value.data));}
    usable(context) {return(this.canEquip());}
    use(context) { //context here is inventory not outfit
        if(this.parent.parent.Outfit.findItemSlot(this.name).length>0) {  
            this.parent.parent.Outfit.removeItem(this.name); 
            return( {OK:true, msg:'unequipped '+ this.name}); //todo
        } else {
            this.parent.parent.Outfit.addItem(this); 
            return( {OK:true, msg:'equipped '+ this.name}); //todo
        }
    }
    canEquip() { 
        if(this.parent.parent.Outfit.findItemSlot(this.name).length>0) return({OK:true, msg:'unequip'});
        else return({OK:true, msg:'equip'});
    }
    canUnequip() {return({OK:true, msg:'unequipable'});}
    onEquip() {
        this.parent.parent.Stats.addModifier('pAttack',{id:'pAttack:Crowbar', bonus:2});
        return({OK:true, msg:'equipped'});}
    onUnequip() {
        this.parent.parent.Stats.removeModifier('pAttack',{id:'pAttack:Crowbar'});
        return({OK:true, msg:'unequipped'});}
}
//this is an Inventory-item, not wardrobe
class Shovel extends Equipment {
    constructor() {
        super('Shovel');
        this.desc = 'A rusty,old shovel.';
        this.tags = ['tool', 'weapon'];
        this.slotUse = ['RHand','LHand'];
        window.storage.registerConstructor(Shovel);
    }
    toJSON() {return window.storage.Generic_toJSON("Shovel", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(Shovel, value.data));}
    usable(context) {return(this.canEquip());}
    use(context) { //context here is inventory not outfit
        if(this.parent.parent.Outfit.findItemSlot(this.name).length>0) {  
            this.parent.parent.Outfit.removeItem(this.name); 
            return( {OK:true, msg:'unequipped '+ this.name}); //todo
        } else {
            this.parent.parent.Outfit.addItem(this); 
            return( {OK:true, msg:'equipped '+ this.name}); //todo
        }
    }
    canEquip() {
        if(this.parent.parent.Outfit.findItemSlot(this.name).length>0) return({OK:true, msg:'unequip'});
        else return({OK:true, msg:'equip'});
    }
    canUnequip() {return({OK:true, msg:'unequipable'});}
    onEquip() {
        this.parent.parent.Stats.addModifier('pAttack',{id:'pAttack:Shovel', bonus:2});
        return({OK:true, msg:'equipped'});}
    onUnequip() {
        this.parent.parent.Stats.removeModifier('pAttack',{id:'pAttack:Shovel'});
        return({OK:true, msg:'unequipped'});}
}
class TailRibbon extends Equipment {
    constructor() {
        super('TailRibbon');
        this.tags = ['cloth'];
        this.slotUse = ['TailTip'];
        this.desc = 'a fancy color band that can be wrapped around someones tailtip';
        window.storage.registerConstructor(TailRibbon);
    }
    toJSON() {return window.storage.Generic_toJSON("TailRibbon", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(TailRibbon, value.data));}
    canEquip() { 
        if(this.parent.parent.Outfit.findItemSlot(this.name).length>0) return({OK:true, msg:'unequip'});    //todo check for key
        else {
            if(this.parent.parent.Outfit.countItem("TailCat")>0) {
                return({OK:true, msg:'equip'}); 
            } else {
                return({OK:false, msg:'This requires a propper tail to attach to!'}); 
            }
        }
    }
    canUnequip() {return({OK:true, msg:'unequipable'});}
}

//a bodypart
class TailNone extends Equipment {
    constructor() {
        super('TailNone');
        this.tags = ['body'];
        this.slotUse = ['bTailBase'];
        this.desc = ''
        window.storage.registerConstructor(TailNone);
    }
    toJSON() {return window.storage.Generic_toJSON("TailNone", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(TailNone, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
}
class TailCat extends Equipment {
    constructor() {
        super('TailCat');
        this.tags = ['body'];
        this.slotUse = ['bTailBase'];
        this.desc = 'a flexible,furred pipe-tail'
        this.growth = 0.10; //in %/100 maxGrowth
        this.maxGrowth = 1.2; //in meter, todo depends on bodysize
        window.storage.registerConstructor(TailCat);
    }
    toJSON() {return window.storage.Generic_toJSON("TailCat", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(TailCat, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
}

window.gm.ItemsLib = (function (ItemsLib) {
    window.storage.registerConstructor(Leggings);
    window.storage.registerConstructor(TankShirt);
    window.storage.registerConstructor(Jeans);
    window.storage.registerConstructor(Pullover);
    window.storage.registerConstructor(Crowbar);
    window.storage.registerConstructor(Shovel);
    window.storage.registerConstructor(TailRibbon);
    //.. and Wardrobe
    ItemsLib['Leggings'] = function () { return new Leggings();};
    ItemsLib['Tank-shirt'] = function () { return new TankShirt(); };
    ItemsLib['Jeans'] = function () { return new Jeans();};
    ItemsLib['Pullover'] = function () { return new Pullover();};
    ItemsLib['TailRibbon'] = function () { return new TailRibbon();};
    //special wardrobe-item combination
    ItemsLib['Crowbar']  = function () { return new Crowbar();};
    ItemsLib['Shovel']  = function () { return new Shovel();};//{name: 'Shovel', desc: 'A shovel for the dirty work.', tags: ['tool', 'weapon'], slotUse: ['RHand','LHand'],usable:defaultCanUse, use:defaultOnUse, canEquip:defaultCanUse, canUnequip:defaultCanUnequip };
    ItemsLib['Handcuffs'] = function () { return new HandCuffs();};//{name: 'Handcuffs', desc: 'You cannot use your hand.', tags: ['restrain'], slotUse: ['RHand','LHand'],usable:defaultCanUse, use:defaultOnUse, canEquip:defaultCanUse, canUnequip:defaultNoUnequip };
    ItemsLib['TailNone'] = function () { return new TailNone();};
    ItemsLib['TailCat'] = function () { return new TailCat();};
    return ItemsLib; 
}(window.gm.ItemsLib || {}));