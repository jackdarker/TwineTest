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
//this is a lookuptable for items
window.gm.ItemsLib = { 
    'LighterDad' : { name: 'Lighter from Dad', desc: 'I got this lighter from my real dad.', usable: function(){return ('useable');}},
    'LaptopPS' : {name: 'Laptop-PS', desc:'Power converter for laptop.', usable: function(){return ('');}},
    'CanOfCoffee' : {name: 'Can of coffee', desc: 'Cold coffee in a can. Tasty? Not really!', usable: function(){return ('drinkable');} },
    'SimpleFood' : {name: 'food ration', desc: 'You can eat this.', usable: function(){return ('eatable');} }
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
