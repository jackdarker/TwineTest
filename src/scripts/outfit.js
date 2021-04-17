"use strict";
/* a player has an outfit describing which Equipment (wardrobe,utilities,..) he has equiped
*/
//this is a lookuptable for the equipmentslots
window.gm.OutfitSlotpLib = { 
    Legs    : 1,
    Feet    : 2,
    Arms    : 3,
    Torso   : 4,
    LHand   : 5,
    RHand   : 6,
    UWTop   : 7,    //UW  = under wear
    UWGroin : 8,
    UWFeet  : 9,
    UWLegs  : 10,
    Hat     : 11,
    Neck    : 12,
    Eys     : 13,
    TailTip : 14,
    bTorso  : 35,   //b.. = bodyparts
    bSkin    : 36,
    bTailBase   : 37,   
    bBreast : 38,
    //insert more slots here
    SLOTMAX : 50
};
//Todo equip on other char:
//move from own inventory to chars, equip, if impossible undo 
class Equipment extends Item {
    constructor(name) {
        super(name);
        this.tags = [];
        this.slotUse = [];
    }
    // Attention !!
    //_parent will be added dynamical
    get parent() {return this._parent();}
    //for compatibility with item
    usable(context) {return({OK:false, msg:'Useable in wardrobe'});}
    use(context) {return({OK:false, msg:'Cannot use.'});}

    canEquip() {return({OK:false, msg:'unusable'});}
    canUnequip() {return({OK:false, msg:'unusable'});}
    onEquip() {return({OK:true, msg:'equipped'});}
    onUnequip() {return({OK:true, msg:'unequipped'});}
}
//a kind of special inventory for worn equipment
class Outfit extends Inventory{
    constructor(externlist) {
        super(externlist);
        //create each slot
        for(var i=0; i<window.gm.OutfitSlotpLib.SLOTMAX;i++) {
            if(this.list.length-1 < i) {
                this.list.push({id:'', item:null});        // {id:'Leggings'}
            }
        }
        window.storage.registerConstructor(Outfit);
    }
    get parent() {return this._parent();}
    toJSON() {return window.storage.Generic_toJSON("Outfit", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(Outfit, value.data);};
    postItemChange(id,operation,msg) {
        window.gm.pushLog('Outfit: '+operation+' '+id+' '+msg+'</br>');
    }
    //count how many slots are used by an item
    countItem(id) {
        var _i = this.findItemSlot(id);
        return(_i.length);  
    }
    //detect which slots are used by a item
    findItemSlot(id) {
        var _idx =[];
        for (var i = 0; i < this.count(); i++) {
            if(this.list[i].id===id) _idx.push(i);
        }
        return(_idx);
    }
    //override because findItemSlot returns array
    getItem(id) {
        var _idx = this.findItemSlot(id);
        if(_idx.length<0) throw new Error('no such item: '+id);
        return(this.list[_idx[0]].item);
    }
    canEquipSlot(slot) {
        return({OK:true});
    }
    canUnequipSlot(slot) {
        return({OK:true});
    }
    canUnequipItem(id, force) {
        var _idx = this.findItemSlot(id);
        var _item = this.getItem(id);
        var result = _item.canUnequip();
        for(var i=0; i<_idx.length;i++) {
            var _tmp = this.canUnequipSlot(_idx[i]);
            if(!_tmp.OK) result.msg +=_tmp.msg+" ";
            result.OK = result.OK && _tmp.OK;
        }
        return(result);
    }
    //this will equip item if possible
    addItem(item, force) {
        var _idx = this.findItemSlot(item.name);
        if(_idx.length>0) return; //already equipped
        var _item = item;
        _idx = _item.slotUse.map((function(cv, ix, arr) { return (window.gm.OutfitSlotpLib[cv]);  }));
        var _oldIDs = [];
        var _oldSlots = [];
        var result = {OK: true, msg:''};
        //check if equipment is equipable
        result = item.canEquip();
        if(result.OK) {
            for(var l=0; l< _idx.length;l++) {  //check if the current equip can be unequipped
                var oldId = this.getItemId(_idx[l]);
                if(oldId==='') continue;
                if(_oldIDs.indexOf(oldId)<0) {
                    _oldIDs.push(oldId);
                    _oldSlots=_oldSlots.concat(this.getItem(oldId).slotUse.map((function(cv, ix, arr) { return (window.gm.OutfitSlotpLib[cv]);})));
                }
                var _tmp = this.canUnequipItem(oldId);
                if(!_tmp.OK) result.msg += _tmp.msg; //todo duplicated msg if item uses multiple slots
                result.OK = result.OK && _tmp.OK;
                //Todo  check if slot is available fo equip this canEquipSlot(_idx[l])
            }
        }
        if(!result.OK) {
            this.postItemChange(_item.name,"equip_fail:",result.msg);
            return;
        }
        for(var m=0;m<_oldIDs.length;m++){
            this.getItem(_oldIDs[m]).onUnequip(this);
        }
        for(var i=0; i<_oldSlots.length;i++) {
            this.__clearSlot(_oldSlots[i]);
        }
        
        for(var k=0; k<_idx.length;k++) {
            this.list[_idx[k]].id = _item.name;
            this.list[_idx[k]].item = _item;
        }  
        _item._parent = window.gm.util.refToParent(this);       //Todo currently we have 2 copies of equipment - 1 for wardrobe 1 for outfit otherwise this will not work
        result=_item.onEquip();
        this.postItemChange(_item.name,"equipped",result.msg);
    }
    //assumme that it was checked before that unequip is allowed
    __clearSlot(slot, force) {
        this.list[slot].id = '', this.list[slot].item=null;
    }
    removeItem(id, force) {
        var _idx = this.findItemSlot(id);
        if(_idx.length===0) return; //already unequipped
        var result =this.canUnequipItem(id);
        if(!result.OK) {
            this.postItemChange(id,"unequip_fail",result.msg);
            return;
        }
        var _item = this.getItem(id);
        result=_item.onUnequip(this);
        for(var i=0; i<_idx.length;i++) {
            this.__clearSlot(_idx[i]);
        }
        this.postItemChange(id,"removed",result.msg);
        //Todo delete _item;    //un-parent
    }
    isNaked() { //TODO
        if(this.getItemId(window.gm.OutfitSlotpLib.Legs)==='' || this.getItemId(window.gm.OutfitSlotpLib.Torso)==='') 
        {
            return(true);
        }
        return(false);
    }
}

