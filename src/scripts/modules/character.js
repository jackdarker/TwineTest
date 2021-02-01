"use strict";
/* a class to provide methods to work with PC & NPC
*/
export class Character {
    static defaultData() {
        return({
        location : "Home",
        inv: [],  //inventory data, needs to be mapped to Inventory-Instance
        wardrobe: [],  //separate wardobe data, needs to be mapped to outfit-Instance
        outfit: [],  // needs to be mapped to outfit-Instance
        money : 0,
        energy : 5,
        energyMax : 100,
        health : 10,
        healthMax : 100
        });
    }
    constructor(externlist) {
        this._data = externlist ? externlist : Character.defaultData();
        this.Outfit = new Outfit(this,this._data.outfit);
        this.Inv = new Inventory(this,this._data.inv);
        this.Wardrobe = new Inventory(this,this._data.wardrobe);
    }
}