"use strict";

//import {LighterDad} from './Items.js'; //why is this not working
//constant declarations
//this is a lookuptable for items

//this will make sure the item-ctor are registered and it can be used as a lookup 
function createItemLookups(){
    /*window.gm.ItemsLib = {};
    window.gm.ItemsLib['Money'] = new Money();
    window.gm.ItemsLib['LighterDad'] = new LighterDad();
    window.gm.ItemsLib['LaptopPS'] = new LaptopPS();
    window.gm.ItemsLib['Battery'] = new Battery();
    window.gm.ItemsLib['Dildo_small'] = new Dildo_small();
    // consumables
    window.gm.ItemsLib['Lube'] = new Lube();
    window.gm.ItemsLib['CanOfCoffee'] = new CanOfCoffee(); 
    window.gm.ItemsLib['SimpleFood'] = new SimpleFood(); 
    //.. and Wardrobe
    window.gm.ItemsLib['Leggings'] = new Leggings();
    window.gm.ItemsLib['Tank-shirt'] = new TankShirt(); 
    window.gm.ItemsLib['Jeans'] = new Jeans();
    window.gm.ItemsLib['Pullover'] = new Pullover();
    //special wardrobe-item combination
    window.gm.ItemsLib['Crowbar']  = new Crowbar();
    window.gm.ItemsLib['Shovel']  = new Shovel();//{name: 'Shovel', desc: 'A shovel for the dirty work.', tags: ['tool', 'weapon'], slotUse: ['RHand','LHand'],usable:defaultCanUse, use:defaultOnUse, canEquip:defaultCanUse, canUnequip:defaultCanUnequip };
    window.gm.ItemsLib['Handcuffs'] = new HandCuffs();//{name: 'Handcuffs', desc: 'You cannot use your hand.', tags: ['restrain'], slotUse: ['RHand','LHand'],usable:defaultCanUse, use:defaultOnUse, canEquip:defaultCanUse, canUnequip:defaultNoUnequip };
    window.gm.ItemsLib['TailNone'] = new TailNone();
    window.gm.ItemsLib['TailCat'] = new TailCat();
*/
    //lookup table 
   /* window.gm.StatsLib = { 
    'strength':stStrength,
    'perception':stPerception,
    'endurance':stEndurance,
    'charisma':stCharisma,
    'intelligence':stIntelligence,
    'agility': stAgility,
    'luck':stLuck,
    //'willpower':stWillpower,
    'pAttack' :stPAttack,
    'pDefense':stPDefense,
    'health': stHealth,
    'healthMax': stHealth,
    'energy': stEnergy,
    'energyMax': stEnergy,
    'arousal': stArousal,
    'arousalMin': stArousal,
    'arousalMax': stArousal,
    'perversion': stPerversion,
    'perversionMax': stPerversion
}*/
    //register constructors for reviver or your loaded save will not work !
    //...items
   /* window.storage.registerConstructor(LighterDad);
    window.storage.registerConstructor(Money);
    window.storage.registerConstructor(LaptopPS);
    window.storage.registerConstructor(Battery);
    window.storage.registerConstructor(Dildo_small);
    window.storage.registerConstructor(Lube);
    window.storage.registerConstructor(CanOfCoffee);
    window.storage.registerConstructor(SimpleFood);
    // ...wardrobe
    window.storage.registerConstructor(Leggings);
    window.storage.registerConstructor(TankShirt);
    window.storage.registerConstructor(Jeans);
    window.storage.registerConstructor(Pullover);
    window.storage.registerConstructor(Crowbar);
    window.storage.registerConstructor(Shovel);
    //window.storage.registerConstructor(Handcuffs);*/
    /*//...stats
    window.storage.registerConstructor(stHealthMax);
    window.storage.registerConstructor(stHealth);
    window.storage.registerConstructor(stRelation);
    //...effects
    window.storage.registerConstructor(effNotTired);
    window.storage.registerConstructor(effTired);
    window.storage.registerConstructor(effEnergized);
    window.storage.registerConstructor(effStunned);
    window.storage.registerConstructor(skCooking);
  */
    //mapping from passage-locations to background images
    

    /*window.gm.test=function(dies) {
        var list={};
        var _com = [];
        var die =33;
        var total = Math.pow(die,dies);
        for(var a=1;a<=die;a++) {
            for(var b=1;b<=die;b++) {
                for(var c=1;c<=die;c++) {
                    if(list[a+b+c]) list[a+b+c]+=1;
                    else list[a+b+c] =1;
                }
            }
        }
        
        var list2 = Object.keys(list);
        for(var i=0;i<list2.length;i++) {
            list[list2[i]] *=1/total;
        }
        console.log(list);
    }*/
}