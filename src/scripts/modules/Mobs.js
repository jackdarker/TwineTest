"use strict";

class Mole extends Mob {
    constructor() {
        super();
        this.name = 'Mole';
        this.pic= 'assets/mole.jpg';
        this.Stats.increment('healthMax',-1*(this.health().max-20));
    }
    
};
class Mechanic extends Mob {
    constructor() {
        super();
        this.name = 'Mechanic-Guy';
        this.pic= 'assets/mechanic.jpg';
    }
    calcCombatMove(){
        var result = this._canAct();
        if(window.story.state.combat.turnCount<3) {
            result=window.gm.Encounter.execCombatCmd(window.gm.combat.moveStun);
            result.msg =this.name+" trys to hit your head whith his wrench.</br>"+result.msg;
            return(result);
        }
        return(super.calcCombatMove());
    }
};
//this looks weird but works; use this as template how to add more mobs
window.gm.Mobs = (function (Mobs) {
    // Private Objekte
    /*var privateVariable = "privat";
    function privateFunktion () {
        alert("privateFunktion wurde aufgerufen\n" +
            "Private Variable: " + privateVariable);
    }*/

    Mobs.Mole = function () { return new Mole();  };    //add Mole-constructor to Mob-ollection
    Mobs.Mechanic = function () {return new Mechanic();};
    return Mobs; 
}(window.gm.Mobs || {}));