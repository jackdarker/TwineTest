"use strict";

export class Item {
    constructor(name) {
        this.name = name;
        this.desc = '';
    }
    usable() {return(false);}
};

export class Inventory {
    constructor() {
        this.list = [];
    }

    postItemChange(inv,id,operation) {
        console.log('Inventory: '+operation+' '+id);
    }
    count() {return(this.list.length);}
    countItem(id) {
        var _i = this.findItemSlot(id);
        if(_i<0) return(0);
        return(1);  //todo count
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
        var _i = this.findItemSlot(id);
        if(_i<0) return(null);
        return(this.list[_i]);
    }
    addItem(item,count=1) {
        var _i = this.findItemSlot(item.name);
        if(_i<0) this.list.push(item);
        //todo else this.list[_i].count+=count;
        this.postItemChange(this,item.name,"added");
    }
    removeItem(id,count=1) {
        var _i = this.findItemSlot(id);
        if(_i<0) return;
        this.list.splice(_i,1); //todo remove count 
        this.postItemChange(this,id,"removed");
    }
};

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
};