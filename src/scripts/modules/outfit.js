"use strict";
/* a player has an outfit describing which Equipment (wardrobe,utilities,..) he has equiped
*/
export class Equipment {
    constructor(name) {
        this.name = name;
        this.desc = '';
    }
    usable() {return(false);}
}

export class Outfit {
    constructor(externlist) {
        this.list = externlist ? externlist : [];
        //create each slot
        for(var i=0; i<window.gm.OutfitSlotpLib.SLOTMAX;i++) {
            if(this.list.length-1 < i) {
                this.list.push('');
            }
        }
    }
    postItemChange(inv,id,operation) {
        console.log('Outfit: '+operation+' '+id);
    }
    count() {return(this.list.length);}
    countItem(id) {
        var _i = this.findItemSlot(id);
        if(_i<0) return(0);
        return(this.list[_i].count);  
    }
    //detect which slots are used by a item
    findItemSlot(id) {
        var _idx =[];
        for (var i = 0; i < this.count(); i++) {
            if(this.list[i].name===id) _idx.push(i);
        }
        return(_idx);
    }
    getItemId(slot) {
        return(this.list[slot].name);
    }
    getItem(id) {
        var _item = window.gm.ItemsLib[id];//EquipLib[id];
        if(!_item) throw new Error('unknown item: '+id);
        return (_item);
    }
    canEquip(id) {
        return(true);
    }
    canUnequipSlot(slot) {
        return(true);
    }
    canUnequipItem(id, force) {
        var _idx = this.findItemSlot(id);
        var _allowUnequip = true;
        for(var i=0; i<_idx.length;i++) {
            _allowUnequip = _allowUnequip && this.canUnequipSlot(_idx[i]);
        }
        return(_allowUnequip);
    }
    addItem(id, force) {
        var _idx = this.findItemSlot(id);
        if(_idx.length>0) return; //already equipped
        var _item = this.getItem(id);
        _idx = _item.slotUse.map((function(cv, ix, arr) { return (window.gm.OutfitSlotpLib[cv]);  }));
        var _allowUnequip = this.canUnequipItem(id);;
        if(!_allowUnequip) {
            this.postItemChange(this,id,"equip_fail");
            return;
        }
        for(var i=0; i<_idx.length;i++) {
            this.__clearSlot(_idx[i]);
        }
        for(var k=0; k<_idx.length;k++) {
            this.list[_idx[k]] = _item.name;
        }  
        this.postItemChange(this,id,"equipped");
    }
    //assumme that it was checked before that unequip is allowed
    __clearSlot(slot, force) {
        this.list[slot] = '';
    }
    removeItem(id, force) {
        var _idx = this.findItemSlot(id);
        if(_idx.length===0) return; //already unequipped
        var _allowUnequip = this.canUnequipItem(id);
        if(!_allowUnequip) {
            this.postItemChange(this,id,"unequip_fail");
            return;
        }
        for(var i=0; i<_idx.length;i++) {
            this.__clearSlot(_idx[i]);
        }
        this.postItemChange(this,id,"removed");
    }
}
//this is a lookuptable
window.gm.OutfitSlotpLib = { 
    Legs    : 1,
    Feet    : 2,
    Arms    : 3,
    Torso   : 4,
    LHand   : 5,
    RHand   : 6,
    UWTop   : 7,
    UWGroin : 8,
    UWFeet  : 9,
    UWLegs  : 10,
    Hat     : 11,
    Neck    : 12,
    Eys     : 13,
    SLOTMAX : 50
};

/*
export class LighterDad extends Item {
    constructor() {
        super('Lighter from Dad');
        this.desc = 'I got this lighter from my real dad.';
    }
};

export class LaptopPS extends Item {
    static create() {
        return new LaptopPS();
    }
    constructor() {
        super('Laptop-PS');
        this.desc = 'Power converter for laptop.';
    }
};

export class CanOfCoffee extends Item {
    constructor() {
        super('Can of coffee');
        this.desc = 'Cold coffee in a can. Tasty? Not really!';
    }
    usable() {
        return ('drinkable');
    }
};*/
