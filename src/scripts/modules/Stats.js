"use strict";
//this is special stat used together with Relation-collection
//person is used as id instead of stat-name
class stRelation extends Stat {
    static setup(context, base,max,person) {    //todo Max-Limit
        var _stat = new stRelation();
        var _n = _stat.data;
        _n.id=person+"_Max",_n.base=max, _n.value=max;
        context.addItem(_stat);
        _stat = new stRelation();
        _n = _stat.data;
        _n.id=person+"_Min",_n.base=0, _n.value=0;
        context.addItem(_stat);
        _stat = new stRelation();
        _n = _stat.data;
        _n.id=person,_n.base=base, _n.value=base,_n.limits=[{max:person+"_Max",min:person+"_Min"}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
    }
    toJSON() {return window.storage.Generic_toJSON("stRelation", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stRelation, value.data);};
    formatMsgStatChange(attr,_new,_old) {
        if((_new-_old)>0) {
            return('<statup>Your relation to '+attr.id+" improved by "+(_new-_old).toFixed(1).toString()+"</statup></br>");
        } else if ((_new-_old)<0) {
            return('<statdown>Your relation to '+attr.id+" worsend by "+(_new-_old).toFixed(1).toString()+"</statdown></br>");
        } else {
            return('Your relation to '+attr.id+" wasnt affected at all by your behaviour.</br>");
        }
    };
}
class stHealthMax extends Stat {
    static setup(context, max) {
        var _stat = new stHealthMax();
        var _n = _stat.data;
        _n.id='healthMax',_n.base=max, _n.value=max,_n.modifys=[{id:'health'}];
        context.addItem(_stat);
        //_stat.Calc(); cause problem because health not yet present
    }
    constructor() {
        super();
    }
    toJSON() {return window.storage.Generic_toJSON("stHealthMax", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stHealthMax, value.data);};
}
class stHealth extends Stat {
    static setup(context, base,max) {
        stHealthMax.setup(context,max);
        var _stat = new stHealth();
        var _n = _stat.data;
        _n.id='health',_n.base=base, _n.value=base,_n.limits=[{max:'healthMax',min:''}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
    }
    toJSON() {return window.storage.Generic_toJSON("stHealth", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stHealth, value.data);};
}
class stEnergyMax extends Stat {
    static setup(context, max) {
        var _stat = new stEnergyMax();
        var _n = _stat.data;
        _n.id='energyMax',_n.base=max, _n.value=max,_n.modifys=[{id:'energy'}];;
        context.addItem(_stat);
        //_stat.Calc();
    }
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stEnergyMax", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stEnergyMax, value.data);};
}
class stEnergy extends Stat {
    static setup(context, base,max) {
        stEnergyMax.setup(context,max);

        var _stat = new stEnergy();
        var _n = _stat.data;
        _n.id='energy',_n.base=base, _n.value=base,_n.limits=[{max:'energyMax',min:''}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stEnergy", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stEnergy, value.data);};
}
class stArousalMax extends Stat {
    static setup(context, max) {
        var _stat = new stArousalMax();
        var _n = _stat.data;
        _n.id='arousalMax',_n.base=max, _n.value=max, _n.hidden=3;
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stArousalMax", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stArousalMax, value.data);};
}
class stArousalMin extends Stat {
    static setup(context, max) {
        var _stat = new stArousalMin();
        var _n = _stat.data;
        _n.id='arousalMin',_n.base=0, _n.value=0, _n.hidden=1;
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stArousalMin", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stArousalMin, value.data);};
}
class stArousal extends Stat{
    static setup(context, base,max) {
        stArousalMax.setup(context,max);
        stArousalMin.setup(context,0);
        var _stat = new stArousal();
        var _n = _stat.data;
        _n.id='arousal', _n.hidden=3,_n.base=base, _n.value=base,_n.limits=[{max:'arousalMax',min:'arousalMin'}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stArousal", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stArousal, value.data);};
}
class stPerversionMax extends Stat {
    static setup(context, base,max) {
        var _stat = new stPerversionMax();
        var _n = _stat.data;
        _n.id='perversionMax', _n.hidden=3,_n.base=base, _n.value=base,_n.limits=[{max:'',min:''}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stPerversionMax", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stPerversionMax, value.data);};
}
class stPerversion extends Stat {
    static setup(context, base,max) {
        stPerversionMax.setup(context,max);
        var _stat = new stPerversion();
        var _n = _stat.data;
        _n.id='perversion', _n.hidden=3,_n.base=base, _n.value=base,_n.limits=[{max:'perversionMax',min:''}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stPerversion", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stPerversion, value.data);};
}
class stAgility extends Stat { // core attribute
    static setup(context, base,max) { 
        var _stat = new stAgility();
        var _n = _stat.data;
        _n.id='agility',_n.base=base, _n.value=base, _n.modifys=[{id:'energyMax'}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stAgility", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stAgility, value.data);};
    updateModifier() {
        this.parent.addModifier('energyMax',{id:'agility', bonus:this.parent.get('agility').value});
    };
}
class stPerception extends Stat { // core attribute
    static setup(context, base,max) { 
        var _stat = new stPerception();
        var _n = _stat.data;
        _n.id='perception',_n.base=base, _n.value=base;
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stPerception", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stPerception, value.data);};
    updateModifier() {
    };
}
class stLuck extends Stat { // core attribute
    static setup(context, base,max) { 
        var _stat = new stLuck();
        var _n = _stat.data;
        _n.id='luck',_n.base=base, _n.value=base;
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stLuck", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stLuck, value.data);};
    updateModifier() {
    };
}
class stCharisma extends Stat { // core attribute
    static setup(context, base,max) { 
        var _stat = new stCharisma();
        var _n = _stat.data;
        _n.id='charisma',_n.base=base, _n.value=base;
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stCharisma", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stCharisma, value.data);};
    updateModifier() {
    };
}
class stIntelligence extends Stat { // core attribute
    static setup(context, base,max) { 
        var _stat = new stIntelligence();
        var _n = _stat.data;
        _n.id='intelligence',_n.base=base, _n.value=base;
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stIntelligence", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stIntelligence, value.data);};
    updateModifier() {
    };
}
class stStrength extends Stat { // core attribute
    static setup(context, base,max) { 
        var _stat = new stAgility();
        var _n = _stat.data;
        _n.id='strength',_n.base=base, _n.value=base, _n.modifys=[{id:'healthMax'},{id:'pAttack'}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stStrength", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stStrength, value.data);};
    updateModifier() {
        this.parent.addModifier('healthMax',{id:'strength', bonus:this.parent.get('strength').value*4});
        this.parent.addModifier('pAttack',{id:'strength', bonus:this.parent.get('strength').value%4});
    };
}
class stEndurance extends Stat { // core attribute
    static setup(context, base,max) { 
        var _stat = new stAgility();
        var _n = _stat.data;
        _n.id='endurance',_n.base=base, _n.value=base, _n.modifys=[{id:'healthMax'},{id:'pDefense'}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
       
    }
    toJSON() {return window.storage.Generic_toJSON("stEndurance", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stEndurance, value.data);};
    updateModifier() {
        this.parent.addModifier('healthMax',{id:'endurance', bonus:this.arent.get('endurance').value*4});
        this.parent.addModifier('pDefense',{id:'strength', bonus:this.parent.get('endurance').value%4});
    };
}
class stPAttack extends Stat {   //physical attack
    static setup(context, base,max) {
        var _stat = new stPAttack();
        var _n = _stat.data;
        _n.id='pAttack',_n.base=base, _n.value=base;
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();

    }
    toJSON() {return window.storage.Generic_toJSON("stPAttack", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stPAttack, value.data);};
}
class stPDefense extends Stat {   //physical defense
    static setup(context, base,max) {
        var _stat = new stPAttack();
        var _n = _stat.data;
        _n.id='pDefense',_n.base=base, _n.value=base;
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();

    }
    toJSON() {return window.storage.Generic_toJSON("stPDefense", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stPDefense, value.data);};
}

//effects
class effEnergized extends Effect {
    constructor() {
        super();
        this.data.id = this.data.name= effEnergized.name, this.data.duration = 120;
    }
    toJSON() {return window.storage.Generic_toJSON("effEnergized", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effEnergized, value.data);};
     get desc() {return(effEnergized.name);}

    onTimeChange(time) {
        //+ 10Energy per hour
        var delta = window.gm.getDeltaTime(time,this.data.time);
        this.data.time = time;
        this.data.duration-= delta;
        if(this.data.duration<0) delta = delta+this.data.duration; // if delta is 20 but remaining duration is only 5, delta should be capped to 5
        //Effects impact Stats:  Effect->Effects->Character->Stats    is there a prettier wy?
        this.parent.parent.Stats.increment('energy',10*delta/60);
        if(this.data.duration<=0) { //remove yourself
            return(function(me){
                return function(Effects){ Effects.removeItem(me.data.id);}}(this));
        }
        return(null);
    }
    onApply(){
        //+10 energy
        this.data.duration = 120;
        this.data.time = window.gm.getTime();
        this.parent.parent.Stats.increment('energy',10);
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) {
            this.onApply(); //refresh 
            return(true);
        }
    }
}
class effNotTired extends Effect {
    constructor() {
        super();
        this.data.id = this.data.name= effNotTired.name, this.data.duration = 120, this.data.hidden=4;
    }
    toJSON() {return window.storage.Generic_toJSON("effNotTired", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effNotTired, value.data);};
    get desc() {return(effNotTired.name);}

    onTimeChange(time) {
        //Tired after xxh
        this.data.duration-= window.gm.getDeltaTime(time,this.data.time);
        this.data.time = time;
        if(this.data.duration<=0) {
        return(function(me){
            return (function(Effects){ 
            var newdata =new effTired(); Effects.replace(me.data.id,newdata);});
            }(this));
        }
        return(null);
    }
    onApply(){
        this.data.duration = 120;// todo 600;
        this.data.time = window.gm.getTime();
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) {
            this.onApply(); //refresh
            return(true);
        }
    }
}
class effTired extends Effect {
    constructor() {
        super();
        this.data.id = this.data.name= effTired.name, this.data.duration = 120, this.data.hidden=0;
    }
    toJSON() {return window.storage.Generic_toJSON("effTired", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effTired, value.data);};
    get desc() {return(effTired.name);}

    onTimeChange(time) {  
        //duration not used -> will never expire unless replaced
        var delta = window.gm.getTime()-this.data.time;
        //-10 max energy after 12h, but only up to 3 times
        if(delta>60) this.parent.parent.Stats.addModifier('energyMax',{id:'energyMax:Tired', bonus:-10});
    }
    onApply(){
        this.data.time = window.gm.getTime();
    }
    onRemove(){
        this.parent.parent.Stats.removeModifier('energyMax',{id:'energyMax:Tired'});
    }
    merge(neweffect) {
        if(neweffect.name==='NotTired') {
            return(function(me){
                return (function(Effects){ 
                var newdata =new effNotTired(); Effects.replace(me.data.id,newdata);});
                }(this));
        }
        if(neweffect.name===this.data.name) {
            //just ignore
            return(true);
        }
    }
}
class effMutateCat extends Effect {
    constructor() {
        super();
        this.data.id = this.data.name= effMutateCat.name, this.data.duration = 60, this.data.hidden=0;

    }
    toJSON() {return window.storage.Generic_toJSON("effMutateCat", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effMutateCat, value.data);};
    get desc() {return(effMutateCat.name);}

    onTimeChange(time) {
        //after some time you mutate a bit
        this.data.duration-= window.gm.getDeltaTime(time,this.data.time);
        this.data.time = time;
        if(this.data.duration<=0) {
        return(function(me){
            return (function(Effects){ 
                window.gm.pushDeferredEvent("MutateTailCat");
                window.gm.pushDeferredEvent("CatHabit");
                Effects.removeItem(me.data.id);});
            }(this));
        }
        return(null);
    }
    onApply(){
        this.data.duration = 60;
        this.data.time = window.gm.getTime();
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) {
            //dont refresh
            return(true);
        }
    }
}
//combateffect
class effStunned extends CombatEffect {
    constructor() {
        super();
        this.data.id = this.data.name= effStunned.name, this.data.duration = 2;
    }
    toJSON() {return window.storage.Generic_toJSON("effStunned", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effStunned, value.data);};
    get desc() {return(effStunned.name);}
    get shortDesc() {return(this.desc+" for " + this.data.duration+" turns");}
    onApply(){
        this.data.duration = 2;
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) {    //extends stun
            this.onApply();
            return(true);
        }
    }
    onCombatEnd() {
        this.parent.removeItem(this.data.id);
    }
    onTurnStart() {
        this.data.duration-=1;
        if(this.data.duration<=0) this.parent.removeItem(this.data.id);
    }
} 
//skills
class skCooking extends Effect {
    constructor() {
        super();
        this.data.id = this.data.name= skCooking.name;
    }
    toJSON() {return window.storage.Generic_toJSON("skCooking", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(skCooking, value.data);};

    get desc() {return(skCooking.name);}
}
window.gm.StatsLib = (function (StatsLib) {
    //...stats
    window.storage.registerConstructor(stHealthMax);
    window.storage.registerConstructor(stHealth);
    window.storage.registerConstructor(stRelation);
    window.storage.registerConstructor(stEndurance);
    window.storage.registerConstructor(stStrength);
    window.storage.registerConstructor(stAgility);
    window.storage.registerConstructor(stLuck);
    window.storage.registerConstructor(stCharisma);
    window.storage.registerConstructor(stPerception);
    window.storage.registerConstructor(stEnergyMax);
    window.storage.registerConstructor(stEnergy);
    window.storage.registerConstructor(stArousalMax);
    window.storage.registerConstructor(stArousalMin);
    window.storage.registerConstructor(stArousal);
    window.storage.registerConstructor(stPerversionMax);
    window.storage.registerConstructor(stPerversion);
    window.storage.registerConstructor(stPAttack);
    window.storage.registerConstructor(stPDefense);
    //...effects
    window.storage.registerConstructor(effNotTired);
    window.storage.registerConstructor(effTired);
    window.storage.registerConstructor(effEnergized);
    window.storage.registerConstructor(effStunned);
    window.storage.registerConstructor(effMutateCat);
    StatsLib.effMutateCat = function () { return new effMutateCat();  };  
    window.storage.registerConstructor(skCooking);

    return(StatsLib); 
}(window.gm.StatsLib || {}));