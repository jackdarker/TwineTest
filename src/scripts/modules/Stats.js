"use strict";

/* classes to affect...: 
    - the state of a character like     'tired'
    - stats of a character like healthMax
    - 
 */
///////////////////////////////////////////////////////////////
export class StatsDictionary extends Inventory {  //Todo a collection of Stats is similiar to Inventory?
    constructor(owner,externlist) {
        super(owner,externlist);
    }
    get(id) {
        var _i = this.findItemSlot(id);
        if(_i<0) throw new Error('unknown stat: '+id);
        var _item=this.getItem(id);
        _item.Calc(this);
        return(this.list[_i]);
    }
    getRaw(id) {
        var _i = this.findItemSlot(id);
        if(_i<0) throw new Error('unknown stat: '+id);
        return(this.list[_i]);
    }
    // {id:Tired:NotTired, bonus: 10}
    addModifier(id, modifier) {

    }
    removeModifier(id,modifier) {

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
        if(_i<0) this.list.push({id: id, base: 0,value: 0, limits: [],modifier:[]});
    }
    //override
    removeItem(id) {
        var _i = this.findItemSlot(id);
        if(_i<0) return; //just skip if not found
        this.list.splice(_i,1);
    }
    increment( id, value) {
        var attr = this.getRaw(id);
        attr.base += value;
        Stat.Calc(this,id);
    }
}
class Stat {
    static Calc(context, id) {
        var attr = context.getRaw(id);
        
        var min = -99999;
        var max = 99999;
        for(var k=0;k<attr.limits.length;k++) {
            if (attr.limits[k].min!=='') min= Math.max(context.getRaw(attr.limits[k].min).value,min); //this might behave odly if any min>max
            if (attr.limits[k].max!=='') max= Math.min(context.getRaw(attr.limits[k].max).value,max); 
        }
        attr.base = Math.max(min,Math.min(max,attr.base));
        var value =  attr.base;
        for(var i=0;i<attr.modifier.length;i++) {
            value += attr.modifier[i].bonus + attr.modifier[i].multi*attr.base; 
        }
        var _new = Math.max(min,Math.min(max,value));
        
        if(_new-attr.value>0) {
            window.gm.pushLog('<statup>'+id+" regenerated by "+(_new-attr.value).toString()+"</statup></br>");
        } else if(_new-attr.value<0) {
            window.gm.pushLog('<statdown>'+id+" decreased by "+(_new-attr.value).toString()+"</statdown></br>");
        }
        attr.value = _new;
    }
}
class stHealth {
    static setup(context, base,max) {
        var _i = context.findItemSlot('health');
        if(_i<0) context.list.push({id: 'health', base: base,value: base, limits : [{max:'healthMax',min:''}], modifier:[]});
        _i = context.findItemSlot('healthMax');
        if(_i<0) context.list.push({id: 'healthMax', base: max,value: max,limits : [], modifier:[]});
        stHealth.Calc(context);
    }
    static Calc(context) {
        Stat.Calc(context,'health');
    }
}
class stEnergy {
    static setup(context, base,max) {
        var _i = context.findItemSlot('energy');
        if(_i<0) context.list.push({id: 'energy', base: base,value: base, limits: [{max:'energyMax',min:''}], modifier:[]});
        _i = context.findItemSlot('energyMax');
        if(_i<0) context.list.push({id: 'energyMax', base: max,value: max,limits: [], modifier:[]});
        stEnergy.Calc(context);
    }
    static Calc(context) {
        Stat.Calc(context,'energy');
    }
}
class stFitness {
    static setup(context, base,max) {
        var _i = context.findItemSlot('fitness');
        if(_i<0) context.list.push({id: 'fitness', base: base,value: base, limits: [], modifier:[]});
    }
    static Calc(context) {
        Stat.Calc(context,'fitness','');
    }
}


/////////////////////////////////////////////////////////////////////////
export class Effects extends Inventory {  //Todo a collection of Stats is similiar to Inventory?
    constructor(owner,externlist) {
        super(owner,externlist);
    }
    //override
    getItem(id) {
        var _item = window.gm.EffectLib[id];
        if(!_item) throw new Error('unknown effect: '+id);
        return (window.gm.EffectLib[id]);
    }
    getData(slot){
        return(this.list[slot]);
    }
    //findItemslot uses id, this one finds all effects of one type
    findEffect(name) {
        var _items = [] ;
        for (var i = 0; i < this.count(); i++) {
            if(this.list[i].name===name) _items.push(i);
        }
        return(_items);
    }
    removeItem(id) {
        var _i = this.findItemSlot(id);
        if(_i<0) return; //just skip if not found
        window.gm.EffectLib[this.list[_i].name].onRemove(this,this.list[_i]);
        this.list.splice(_i,1);
        this.postItemChange(this,id,"removed","");
    }
    addItem(id,effect) {
        var _i = this.findItemSlot(id);
        var res;
        //if effect with same id is already present, merge them
        if(_i>-1) {
            res =window.gm.EffectLib[this.list[_i].name].merge(this,this.list[_i],effect,effect.dataPrototype());
            if(res!=null) {
                if(res===true) {}
                else res(this); //should be a function
                this.postItemChange(this,id,"merged","");
                return;
            }  
        }
        //or if there are similiar effects try to erge with them
        var _k = this.findEffect(effect.name);
        for(var i=0;i<_k.length;i++) {
            res =window.gm.EffectLib[this.list[__k].name].merge(this,this.list[_i],effect,effect.dataPrototype());
            if(res!=null) {
                if(res===true) {}
                else res(this); //should be a function
                this.postItemChange(this,id,"merged","");
                break;
            }  
        }
        //else add it to list
        var data = effect.dataPrototype();
        data.id=id;
        this.list.push(data);
        effect.onApply(this,data);
        this.postItemChange(this,id,"added","");
    }
    replace(id, neweffect,newdata) {
        var _i = this.findItemSlot(id);
        newdata.id = id;
        this.list[_i] = newdata;
        neweffect.onApply(this,newdata);
    }
    updateTime() {
        var now =window.gm.getTime();
        for(var i=0;i<this.list.length;i++){
            var foo = window.gm.EffectLib[this.list[i].name].onTimeChange(this,this.list[i],now);
            if(foo) foo(this);
        }
    }
    //override
    postItemChange(inv,id,operation,msg) {
        window.gm.pushLog('Effects: '+operation+' '+id+' '+msg+'</br>');
    }
}


//! because of the save-problem we dont use objects, just static methods
class Effect {  
    /*constructor(parent,name) {
        this.parent = parent;
        this.name = name;
        this.desc = name;
        this.time = window.gm.getTime();
    }*/
    //static get name() { return('Effect');}
    //static get desc() {return(Effect.name);}
    static dataPrototype() {
        return({id:'xxx', name: Effect.name, ts: 0, duration:60});
    }
    //is called when a effect is applied to check if the new effect can be combined with an exisitng one
    //return null if no merge occured
    //return true if the neweffect was merged into existing one; no other effects are then checked for mergeability
    //or return function that has to be executed: (function(Effects){ Effects.replace(data.id,window.gm.EffectLib.NotTired,newdata);}));
    static merge(context,data,neweffect,newdata) {
        return(null);
    }
    static onTimeChange(context,data,time) {
        return(null);
    }
    static onApply(context,data){}
    static onRemove(context,data){}
}
class effEnergized extends Effect {
   /*constructor(parent) {
        super(parent,'Energized');
    }*/
    static get name() { return('Energized');}
    static get desc() {return(effEnergized.name);}
    static dataPrototype() {
        return({id:'Energized', name: effEnergized.name, ts: 0, duration:120});
    }
    static onTimeChange(context,data,time) {
        //+ 10Energy per hour
        var delta = window.gm.getDeltaTime(time,data.time);
        data.time = time;
        data.duration-= delta;
        if(data.duration<0) delta = delta+data.duration; // if delta is 20 but remaining duration is only 5, delta should be capped to 5
        context.parent.Stats.increment('energy',10*delta/60);
        if(data.duration<=0) {
        return((function(Effects){ 
            Effects.removeItem(data.id);}));
        }
        return(null);
    }
    static onApply(context,data){
        //+10 energy
        data.duration = 120;
        data.time = window.gm.getTime();
        context.parent.Stats.increment('energy',10);
    }
    static merge(context,data,neweffect,newdata) {
        if(neweffect.name===data.name) {
            effEnergized.onApply(context,data);
            return(true);
        }
    }
}
class effNotTired extends Effect {
    /*constructor(parent) {
        super(parent,'NotTired');
    }*/
    static get name() { return('NotTired');}
    static get desc() {return(effNotTired.name);}
    static dataPrototype() {
        return({id:effNotTired.name, name: effNotTired.name, ts: 0, duration:120});
    }
    static onTimeChange(context,data,time) {
        //Tired after 12h
        data.duration-= window.gm.getDeltaTime(time,data.time);
        data.time = time;
        if(data.duration<=0) {
        return((function(Effects){ 
            var newdata =window.gm.EffectLib.Tired.dataPrototype();
            newdata.id=data.id;
            newdata.time = time;
            Effects.replace(data.id,window.gm.EffectLib.Tired,newdata);}));
        }
        return(null);
    }
    static onApply(context,data){
        //+10 energy
        data.duration = 600;
        data.time = window.gm.getTime();
    }
    static merge(context,data,neweffect,newdata) {
        if(neweffect.name===data.name) {
            neweffect.onApply(context,data);
            return(true);
        }
    }
}
class effTired extends Effect {
    /*constructor(parent) {
        super(parent,'Tired');
    }*/
    static get name() { return('Tired');}
    static get desc() {return(effTired.name);}
    static dataPrototype() {
        return({id:effTired.name, name: effTired.name, ts: 0, duration:120});
    }
    static onTimeChange(context,data,time) {
        //-10 max energy after 12h, but only up to 3 times
    }
    static onApply(context,data){
        //-10 maxenergy
        data.duration = 720;
        data.time = window.gm.getTime();
    }
    static merge(context,data,neweffect,newdata) {
        if(neweffect.name==='NotTired') {
            return((function(Effects){ 
                Effects.replace(data.id,window.gm.EffectLib.NotTired,newdata);}));
        }
        if(neweffect.name===data.name) {
            //just ignore
            return(true);
        }
    }
}

//////////////////////////////////////////////////////////////
/*export class BaseAttribute {   
    constructor(id,value, multiplier = 0) {
        this._id =id;
        this._baseValue = value;
        this._baseMultiplier = multiplier;
    }    
    get id(){return(this._id);}
    get baseValue(){ return _baseValue;  }   
    get baseMultiplier(){ return _baseMultiplier; }
}
export class RawBonus extends BaseAttribute   {
    constructor(value = 0, multiplier = 0) {
        super(value, multiplier);
    }
 }
 export class Attribute extends BaseAttribute {     
    constructor(id,startingValue){ //baseMultiplier for simple Attribut is 0
        super(id,startingValue);    
        _rawBbonuses = new Map();
        _finalBonuses = new Map();    
        _finalValue = baseValue;
    }        
    addRawBonus(bonus) {
        _rawBonuses.set(bonus.id ,bonus);
    }        
    addFinalBonus(bonus)  {
        _finalBonuses.set(bonus.id ,bonus);
    }       
    removeRawBonus(bonus)    {
        _rawBonuses.delete(bonus.id);
    }      
    removeFinalBonus(bonus)   {
        _finalBonuses.delete(bonus.id);
    }     
    _applyBonuses(Bonuses)   {
        // Adding value from raw
        var BonusValue = 0;
        var BonusMultiplier = 0;          
        for (let bonus of Bonuses.values()) {  
            BonusValue += bonus.baseValue;
            BonusMultiplier += bonus.baseMultiplier;
        }
        _finalValue += BonusValue;
        _finalValue *= (1 + BonusMultiplier);
    }
    applyRawBonuses() {
        // Adding value from raw
        this._applyBonuses(_rawBonuses);
    }    
    applyFinalBonuses() {
        // Adding value from final
        this._applyBonuses(_finalBonuses);
    }      
    calculateValue()    {
        _finalValue = baseValue;      
        applyRawBonuses();      
        applyFinalBonuses();      
        return _finalValue;
    }    
    finalValue() {
        return calculateValue();
    }
}
 export class DependantAttribute extends Attribute   {       
    constructor(id,startingValue) {
        super(id,startingValue);    
        _otherAttributes = [];
    }
    addAttribute(attr) {
        _otherAttributes.set(attr.id ,attr);
    }   
    removeAttribute(attr) {
        _otherAttributes.delete(attr.id);
    }
    //you need to override calculate and do something with the added attributes
}
class HealthMax extends DependantAttribute {
    constructor(startingValue) {
        super('healthMax',startingValue);
    }
}
class Health extends DependantAttribute {
    constructor(startingValue) {
        super('health',startingValue);
        this.addAttribute()
    }
}
export class AttackStrength extends DependantAttribute  {
    constructor(startingValue) {
        super(startingValue);
    }
        
    calculateValue() {
        _finalValue = baseValue;
        var strength = _otherAttributes.get('strength').calculateValue();
        _finalValue += int(strength / 5);   
        applyRawBonuses();    
        applyFinalBonuses();        
        return _finalValue;
    }
}*/



