"use strict";
/* a player has an outfit describing which Equipment (wardrobe,utilities,..) he has equiped
*/
export class Equipment {
    constructor(name) {
        this.name = name;
        this.desc = name;
        this.tags = [];
        this.slotUse = [];
    }
    canEquip(context) {return({OK:false, msg:'unusable'});}
    canUnequip(context) {return({OK:false, msg:'unusable'});}
    onEquip(context) {return({OK:true, msg:'equipped'});}
    onUnequip(context) {return({OK:true, msg:'unequipped'});}
}
export class Leggings extends Equipment {
    constructor() {
        super('Leggings');
        this.tags = ['cloth'];
        this.slotUse = ['Legs'];
        this.desc = 'Spandex-leggings for sport. (Fitness+)'
    }
    canEquip(context) {return({OK:true, msg:'equipable'});}
    canUnequip(context) {return({OK:true, msg:'unequipable'});}
    onEquip(context) {
        context.parent.Stats.addModifier('fitness',{id:'fitness:Leggings', bonus:5});
        return({OK:true, msg:'equipped'});}
    onUnequip(context) {
        context.parent.Stats.removeModifier('fitness',{id:'fitness:Leggings'});
        return({OK:true, msg:'unequipped'});}
}
export class Jeans extends Equipment {
    constructor() {
        super('Jeans');
        this.tags = ['cloth'];
        this.slotUse = ['Legs'];
    }
    canEquip(context) {return({OK:true, msg:'equipable'});}
    canUnequip(context) {return({OK:true, msg:'unequipable'});}
}
export class TankShirt extends Equipment {
    constructor() {
        super('Tank-shirt');
        this.tags = ['cloth'];
        this.slotUse = ['Torso'];
    }
    canEquip(context) {return({OK:true, msg:'equipable'});}
    canUnequip(context) {return({OK:true, msg:'unequipable'});}
}
export class Pullover extends Equipment {
    constructor() {
        super('Pullover');
        this.tags = ['cloth'];
        this.slotUse = ['Torso','Arms'];
    }
    canEquip(context) {return({OK:true, msg:'equipable'});}
    canUnequip(context) {return({OK:true, msg:'unequipable'});}
}
export class Outfit {
    constructor(owner,externlist) {
        this.parent = owner;
        this.list = externlist ? externlist : [];
        //create each slot
        for(var i=0; i<window.gm.OutfitSlotpLib.SLOTMAX;i++) {
            if(this.list.length-1 < i) {
                this.list.push({id:''});        // {id:'Leggings'}
            }
        }
    }
    postItemChange(inv,id,operation,msg) {
        window.gm.pushLog('Outfit: '+operation+' '+id+' '+msg+'</br>');
    }
    count() {return(this.list.length);}

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
    getItemId(slot) {
        return(this.list[slot].id);
    }
    getItem(id) {
        var _item = window.gm.ItemsLib[id];//EquipLib[id];
        if(!_item) throw new Error('unknown item: '+id);
        return (_item);
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
        var result = _item.canUnequip(id);
        for(var i=0; i<_idx.length;i++) {
            var _tmp = this.canUnequipSlot(_idx[i]);
            if(!_tmp.OK) result.msg +=_tmp.msg+" ";
            result.OK = result.OK && _tmp.OK;
        }
        return(result);
    }
    addItem(id, force) {
        var _idx = this.findItemSlot(id);
        if(_idx.length>0) return; //already equipped
        var _item = this.getItem(id);
        _idx = _item.slotUse.map((function(cv, ix, arr) { return (window.gm.OutfitSlotpLib[cv]);  }));
        var _oldIDs = [];
        var _oldSlots = [];
        var result = {OK: true, msg:''};
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
        if(!result.OK) {
            this.postItemChange(this,id,"equip_fail:",result.msg);
            return;
        }
        for(var i=0; i<_oldSlots.length;i++) {
            this.__clearSlot(_oldSlots[i]);
        }
        for(var m=0;m<_oldIDs.length;m++){
            this.getItem(_oldIDs[m]).onUnequip(this);
        }
        for(var k=0; k<_idx.length;k++) {
            this.list[_idx[k]].id = id;
        }  
        result=_item.onEquip(this);
        this.postItemChange(this,id,"equipped",result.msg);
    }
    //assumme that it was checked before that unequip is allowed
    __clearSlot(slot, force) {
        this.list[slot].id = '';
    }
    removeItem(id, force) {
        var _idx = this.findItemSlot(id);
        if(_idx.length===0) return; //already unequipped
        var result =this.canUnequipItem(id);
        if(!result.OK) {
            this.postItemChange(this,id,"unequip_fail",result.msg);
            return;
        }
        result=this.getItem(id).onUnequip(this);
        for(var i=0; i<_idx.length;i++) {
            this.__clearSlot(_idx[i]);
        }
        this.postItemChange(this,id,"removed",result.msg);
    }
    isNaked() {
        if(this.getItemId(window.gm.OutfitSlotpLib.Legs)==='' || this.getItemId(window.gm.OutfitSlotpLib.Torso)==='') 
        {
            return(true);
        }
        return(false);
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

