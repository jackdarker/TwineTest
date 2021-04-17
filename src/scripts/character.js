"use strict";
/* a class to provide methods to work with PC & NPC
*/
export class Character {
    static defaultData() {
        return({
        name: '',
        location : "Home",
        XP: 0,  
        level: 1,  
        inv: [],  //inventory data, needs to be mapped to Inventory-Instance
        wardrobe: [],  //separate wardobe data, needs to be mapped to outfit-Instance
        outfit: [],  // needs to be mapped to outfit-Instance
        stats: [],
        effects: [],
        rel: []
        });
    }
    constructor(externlist) {
        this._data = externlist ? externlist : Character.defaultData();
        this.Outfit = new Outfit(this._data.outfit);
        this.Outfit._parent = window.gm.util.refToParent(this);
        this.Inv = new Inventory(this._data.inv);
        this.Inv._parent = window.gm.util.refToParent(this);
        this.Wardrobe = new Inventory(this._data.wardrobe);
        this.Wardrobe._parent = window.gm.util.refToParent(this);
        this.Stats = new StatsDictionary(this._data.stats);
        this.Stats._parent = window.gm.util.refToParent(this);
        this.Effects = new Effects(this._data.effects);
        this.Effects._parent = window.gm.util.refToParent(this);
        this.Rel = new StatsDictionary(this._data.rel); //Todo Relation similiar to stats?
        this.Rel._parent = window.gm.util.refToParent(this);
        //create basic stats
        stHealth.setup(this.Stats,50,60),stEnergy.setup(this.Stats,30,100),stPAttack.setup(this.Stats,4,100),stPDefense.setup(this.Stats,4,100),
        stAgility.setup(this.Stats,10,100),stIntelligence.setup(this.Stats,10,100),stLuck.setup(this.Stats,10,100);
        stCharisma.setup(this.Stats,10,100),stPerception.setup(this.Stats,10,100),stStrength.setup(this.Stats,10,100),stEndurance.setup(this.Stats,10,100);
        stPerversion.setup(this.Stats,1,15),stArousal.setup(this.Stats,1,100);

        this.Effects.addItem(effNotTired.name, new effNotTired()); //depending on sleep Tired will be set to NotTired or Tired
        window.storage.registerConstructor(Character);
    }
    toJSON() {return window.storage.Generic_toJSON("Character", this); };
    static fromJSON(value) { 
        var _x = window.storage.Generic_fromJSON(Character, value.data);
        _x.Effects._relinkItems();
        _x.Stats._relinkItems();
        _x.Inv._relinkItems();
        _x.Outfit._relinkItems();
        _x.Wardrobe._relinkItems();
        _x.Rel._relinkItems();
        return(_x);
    };
    static calcXPToLevel(XP) {
        return(Math.abs(Math.SQRT2(XP/100+0.25)-0.5));
    }
    static calcLevelToXP(lvl) {
        return(100*lvl*(lvl+1)/2); //Gauss-Sum
    }
    get name() {
        return(this._data.name);    
    }
    set name(name) {this._data.name=name;}
    get location() {
        return(this._data.location);    
    }
    set location(name) {this._data.location=name;}
    get level() {
        return(this._data.level);
    }
    get levelPoints() {
        //for each attribute('strength','perception','endurance','charisma','intelligence','agility','luck','willpower')
        //we start with 10pts at lvl1 and for each lvl receive 2pts
        return(this._data.level-1*2+7*10);
    }
    get canLevelUp() {
        return(Character.calcXPToLevel(this._data.XP)!==this._data.level);
    }
    addXP(XP) {
        this._data.XP+=XP;
    }
    //upgrade level by 1;this will increase level even if not enough XP !
    levelUp() {
        var reqXP=Character.calcLevelToXP(this._data.level+1);
        this._data.XP=reqXP;
        this._data.level+=1;
    }
    health() {
        return({value:this.Stats.get('health').value, max:this.Stats.get('healthMax').value, min:0});
    }
    energy() {
        return({value:this.Stats.get('energy').value, max:this.Stats.get('energyMax').value, min:0});
    }

    addEffect(id,effect) {
        this.Effects.addItem(id,effect);
    }
    //helper function to change Relation 
    gainRelation(char,val) {
        var _idx = this.Rel.findItemSlot(char);
        if(_idx<0) {
            var _rel = stRelation.setup(this.Rel,val,100,char);
        } else {
            this.Rel.increment(char,val);
        }
    }
    //combat related
    _canAct() {
        var result = {OK:true,msg:''};
        if(this.Effects.findItemSlot("effStunned")>=0) {
            result.OK=false;
            result.msg =this.name+ " is stunned and cannot react."
            return(result);
        }
        return(result);
    }
}