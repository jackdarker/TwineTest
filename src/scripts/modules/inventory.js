"use strict";

export class Item {
    constructor(name) {
        this.name = name;
        this.desc = '';
    }
    usable() {return(false);}
};

export class Inventory {
    constructor(owner,externlist) {
        this.parent = owner;
        this.list = externlist ? externlist : [];
    }
    postItemChange(inv,id,operation,msg) {
        window.gm.pushLog('Inventory: '+operation+' '+id+' '+msg+'</br>');
    }
    count() {return(this.list.length);}
    countItem(id) {
        var _i = this.findItemSlot(id);
        if(_i<0) return(0);
        return(this.list[_i].count);  
    }
    findItemSlot(id) {
        for (var i = 0; i < this.count(); i++) {
            if(this.list[i].id===id) return(i);
        }
        return(-1);
    }
    getItemId(slot) {
        return(this.list[slot].id);
    }
    getItem(id) {
        var _item = window.gm.ItemsLib[id];
        if(!_item) throw new Error('unknown item: '+id);
        return (window.gm.ItemsLib[id]);
    }
    addItem(id,count=1) {
        var _i = this.findItemSlot(id);
        if(_i<0) this.list.push({'id': id, 'count': count});
        else this.list[_i].count+=count;
        this.postItemChange(this,id,"added","");
    }
    removeItem(id,count=1) {
        var _i = this.findItemSlot(id);
        if(_i<0) return; //just skip if not found
        this.list[_i].count -=count;
        if(this.list[_i].count<1) this.list.splice(_i,1);
        this.postItemChange(this,id,"removed","");
    }
    //convience method to check if item is usable
    usable(id) {
        var _item = this.getItem(id);
        return (_item.usable(this));
    }
    //uses an item by calling item.use
    use(id) {
        var _item = this.getItem(id);
        var result = _item.use(this);
        if(result.OK) {
            this.postItemChange(this,id,"used",result.msg);
        }
        return(result);
    }
};
function defaultCanUse(context) {return({OK:true, msg:'usable'})};
function defaultNoUse(context) {return({OK:false, msg:''})};
function defaultOnUse(context) {return({OK:true, msg:'You used the item.'})};
function defaultCanUnequip(context) {return({OK:true, msg:''});};
function defaultNoUnequip(context) {return({OK:false, msg:'You need to find a key first to be able to remove it!'});};

function canConsumeCoffee(context) {return({OK:true, msg:'drinkable'})};
function onUseCoffee(context) { 
    if(context instanceof Inventory) {
        context.removeItem('CanOfCoffee');
    }
    return({OK:true, msg:'you gulped down a can of iced coffee'});
};

//this is a lookuptable for items
window.gm.ItemsLib = { 
    'LighterDad' : { name: 'Lighter from Dad', desc: 'I got this lighter from my real dad.', usable:defaultCanUse, use:defaultOnUse },
    'LaptopPS' : {name: 'Laptop-PS', desc:'Power converter for laptop.', usable: function(){return ({OK: false, msg:'not usable on its own'})},use: defaultNoUse},
    'CanOfCoffee' : {name: 'Can of coffee', desc: 'Cold coffee in a can. Tasty? Not really!', usable:canConsumeCoffee, use:onUseCoffee },
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
