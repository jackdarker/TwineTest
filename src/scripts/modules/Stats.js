"use strict";

/* classes to affect...: 
    - the state of a character like     'tired'
    - stats of a character like healthMax
    - 
 */
export class Effects extends Inventory {  //Todo a collection of Stats is similiar to Inventory?
    constructor(owner,externlist) {
        super(owner,externlist);
    }
    //override
    getItem(id) {
        var _item = window.gm.EffectLib[id];
        if(!_item) throw new Error('unknown state: '+id);
        return (window.gm.EffectLib[id]);
    }
    //override
    postItemChange(inv,id,operation,msg) {
        window.gm.pushLog('States: '+operation+' '+id+' '+msg+'</br>');
    }
}
function defaultTimeChange(context) {;};
function defaultOnApply(context) {;};
function defaultOnRemove(context) {;};
//lookup table 
window.gm.EffectLib = { 
    'Tired': {name: 'Tired', desc: 'You feel tired',onTimeChange: defaultTimeChange,onApply:defaultOnApply, onRemove:defaultOnRemove},
    'Energized': {name: 'Energized', desc: 'You feel energized',onTimeChange: defaultTimeChange,onApply:defaultOnApply, onRemove:defaultOnRemove}
};

export class Stats extends Inventory {  //Todo a collection of Stats is similiar to Inventory?
    constructor(owner,externlist) {
        super(owner,externlist);
    }
    get(id) {
        var _i = this.findItemSlot(id);
        if(_i<0) throw new Error('unknown stat: '+id);
        return(this.list[_i]);
    }
    //override
    getItem(id) {
        var _item = window.gm.StatsLib[id];
        if(!_item) throw new Error('unknown stat: '+id);
        return (window.gm.StatsLib[id]);
    }
    //override
    postItemChange(inv,id,operation,msg) {
        window.gm.pushLog('Stats: '+operation+' '+id+' '+msg+'</br>');
    }
    //override; only use to create new stats !
    addItem(id) {
        var _i = this.findItemSlot(id);
        if(_i<0) this.list.push({'id': id, min:0,max:0,value:0});
    }
    //override
    removeItem(id) {
        var _i = this.findItemSlot(id);
        if(_i<0) return; //just skip if not found
        this.list.splice(_i,1);
    }
}

function defaultOnChange(context){;};
//lookup table 
window.gm.StatsLib = { 
    'health': {name: 'Health', desc: 'How healthy you are.',onChange: defaultOnChange,onApply:defaultOnApply, onRemove:defaultOnRemove},
    'energy': {name: 'Energy', desc: 'How much energy you have.',onChange: defaultOnChange,onApply:defaultOnApply, onRemove:defaultOnRemove}
};
