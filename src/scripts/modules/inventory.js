"use strict";

export class Item {
    constructor(name) {
        this.name = name;
        this.desc = '';
    }
    usable() {return(false);}
};

export class Inventory {
    constructor(externlist) {
        this.list = externlist ? externlist : [];
    }
    postItemChange(inv,id,operation) {
        console.log('Inventory: '+operation+' '+id);
    }
    count() {return(this.list.length);}
    countItem(id) {
        var _i = this.findItemSlot(id);
        if(_i<0) return(0);
        return(this.list[_i].count);  
    }
    findItemSlot(id) {
        for (var i = 0; i < this.count(); i++) {
            if(this.list[i].name===id) return(i);
        }
        return(-1);
    }
    getItemId(slot) {
        return(this.list[slot].name);
    }
    getItem(id) {
        var _item = window.gm.ItemsLib[id];
        if(!_item) throw new Error('unknown item: '+id);
        return (window.gm.ItemsLib[id]);
        /*var _i = this.findItemSlot(id);
        if(_i<0) return(null);
        return(this.list[_i]);*/
    }
    addItem(id,count=1) {
        var _i = this.findItemSlot(id);
        if(_i<0) this.list.push({'name': id, 'count': count});
        //todo else this.list[_i].count+=count;
        this.postItemChange(this,id,"added");
    }
    removeItem(id,count=1) {
        var _i = this.findItemSlot(id);
        if(_i<0) return;
        this.list.splice(_i,1); //todo remove count 
        this.postItemChange(this,id,"removed");
    }
};
function defaultCanUse(id) {return({OK:true, msg:'usable'})};
function defaultNoUse(id) {return({OK:false, msg:''})};
function defaultOnUse(id) {return({OK:true, msg:'You used the item.'})};
function defaultCanUnequip(id) {return({OK:true, msg:''});};
function defaultNoUnequip(id) {return({OK:false, msg:'You need to find a key first to be able to remove it!'});};
//this is a lookuptable for items
window.gm.ItemsLib = { 
    'LighterDad' : { name: 'Lighter from Dad', desc: 'I got this lighter from my real dad.', usable:defaultCanUse, use:defaultOnUse },
    'LaptopPS' : {name: 'Laptop-PS', desc:'Power converter for laptop.', usable: function(){return ({OK: false, msg:'not usable on its own'})},use: defaultNoUse},
    'CanOfCoffee' : {name: 'Can of coffee', desc: 'Cold coffee in a can. Tasty? Not really!', usable:defaultCanUse, use:defaultOnUse },
    'SimpleFood' : {name: 'food ration', desc: 'You can eat this.', usable:defaultCanUse, use:defaultOnUse },
//.. and Wardrobe
    'Leggings' : { name: 'Sport-Leggings', desc: 'Spandex-leggings for sport.', tags: ['cloth'], slotUse: ['Legs'],canEquip:defaultCanUse, canUnequip:defaultCanUnequip },
    'Tank-shirt' : {name: 'White Tank-shirt', desc:'White Tank-shirt.',tags: ['cloth'],slotUse: ['Torso','Arms'],canEquip:defaultCanUse, canUnequip:defaultCanUnequip },
    'Jeans' : {name: 'Bluejeans', desc: 'Thight fitting blue jeans.',tags: ['cloth'], slotUse: ['Legs'],canEquip:defaultCanUse, canUnequip:defaultCanUnequip  },
    'Pullover' : {name: 'Pullover', desc: 'A warm pulloer.', tags: ['cloth'],slotUse: ['Torso','Arms'],canEquip:defaultCanUse, canUnequip:defaultCanUnequip },
//special wardrobe-item combination
    'Crowbar'  : {name: 'Crowbar', desc: 'A durable crowbar.', tags: ['tool', 'weapon'], slotUse: ['RHand'],usable:defaultCanUse, use:defaultOnUse,canEquip:defaultCanUse, canUnequip:defaultCanUnequip },
    'Shovel'  : {name: 'Shovel', desc: 'A shovel for the dirty work.', tags: ['tool', 'weapon'], slotUse: ['RHand','LHand'],usable:defaultCanUse, use:defaultOnUse, canEquip:defaultCanUse, canUnequip:defaultCanUnequip },
    'Handcuffs' : {name: 'Handcuffs', desc: 'You cannot use your hand.', tags: ['restrain'], slotUse: ['RHand','LHand'],usable:defaultCanUse, use:defaultOnUse, canEquip:defaultCanUse, canUnequip:defaultNoUnequip }
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
