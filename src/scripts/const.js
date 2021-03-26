"use strict";

//import {LighterDad} from './Items.js'; //why is this not working
//constant declarations
//this is a lookuptable for items

function getVersion(){return("0,0,0,");} 

function createItemLookups(){
    window.gm.ItemsLib = {};
    //window.gm.ItemsLib = { 
    window.gm.ItemsLib['Money'] = new Money();
    window.gm.ItemsLib['LighterDad'] = new LighterDad();// { name: 'Lighter from Dad', desc: 'I got this lighter from my real dad.', usable:defaultCanUse, use:defaultOnUse },
    window.gm.ItemsLib['LaptopPS'] = new LaptopPS();//{name: 'Laptop-PS', desc:'Power converter for laptop.', usable: function(){return ({OK: false, msg:'not usable on its own'})},use: defaultNoUse};
    window.gm.ItemsLib['Battery'] = new Battery();
    window.gm.ItemsLib['Dildo_small'] = new Dildo_small();
    // consumables
    window.gm.ItemsLib['Lube'] = new Lube();
    window.gm.ItemsLib['CanOfCoffee'] = new CanOfCoffee(); // {name: 'Can of coffee', desc: 'Cold coffee in a can. Tasty? Not really!', usable:canConsumeCoffee, use:onUseCoffee };
    window.gm.ItemsLib['SimpleFood'] = new SimpleFood(); //{name: 'food ration', desc: 'You can eat this.', usable:defaultCanUse, use:defaultOnUse };
    //.. and Wardrobe
    window.gm.ItemsLib['Leggings'] = new Leggings();//{ name: 'Sport-Leggings', desc: 'Spandex-leggings for sport.', tags: ['cloth'], slotUse: ['Legs'],canEquip:defaultCanUse, canUnequip:defaultCanUnequip };
    window.gm.ItemsLib['Tank-shirt'] = new TankShirt(); //{name: 'White Tank-shirt', desc:'White Tank-shirt.',tags: ['cloth'],slotUse: ['Torso','Arms'],canEquip:defaultCanUse, canUnequip:defaultCanUnequip };
    window.gm.ItemsLib['Jeans'] = new Jeans();// {name: 'Bluejeans', desc: 'Thight fitting blue jeans.',tags: ['cloth'], slotUse: ['Legs'],canEquip:defaultCanUse, canUnequip:defaultCanUnequip  };
    window.gm.ItemsLib['Pullover'] = new Pullover();//{name: 'Pullover', desc: 'A warm pulloer.', tags: ['cloth'],slotUse: ['Torso','Arms'],canEquip:defaultCanUse, canUnequip:defaultCanUnequip };
    //special wardrobe-item combination
    window.gm.ItemsLib['Crowbar']  = new Crowbar();//{name: 'Crowbar', desc: 'A durable crowbar.', tags: ['tool', 'weapon'], slotUse: ['RHand'],usable:defaultCanUse, use:defaultOnUse,canEquip:defaultCanUse, canUnequip:defaultCanUnequip };
    window.gm.ItemsLib['Shovel']  = {name: 'Shovel', desc: 'A shovel for the dirty work.', tags: ['tool', 'weapon'], slotUse: ['RHand','LHand'],usable:defaultCanUse, use:defaultOnUse, canEquip:defaultCanUse, canUnequip:defaultCanUnequip };
    window.gm.ItemsLib['Handcuffs'] = {name: 'Handcuffs', desc: 'You cannot use your hand.', tags: ['restrain'], slotUse: ['RHand','LHand'],usable:defaultCanUse, use:defaultOnUse, canEquip:defaultCanUse, canUnequip:defaultNoUnequip };
    //};

    //lookup table 
    window.gm.StatsLib = { 
    'strength':stStrength,
    //'perception':stPerception,
    'endurance':stEndurance,
    //'charisma':stCharisma,
    //'intelligence':stIntelligence,
    'agility': stAgility,
    //'luck':stLuck,
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
}
    //register constructors for reviver or your loaded save will not work !
    //...items
    window.storage.registerConstructor(LighterDad);
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
    //window.storage.registerConstructor(Handcuffs);
    //...stats
    window.storage.registerConstructor(stHealthMax);
    window.storage.registerConstructor(stHealth);
    window.storage.registerConstructor(stRelation);
    //...effects
    window.storage.registerConstructor(effNotTired);
    window.storage.registerConstructor(effTired);
    window.storage.registerConstructor(effEnergized);
    window.storage.registerConstructor(effStunned);
    window.storage.registerConstructor(skCooking);
  
    window.gm.EnemyLib = {
        'Mole': {name: 'Mole',pic:'assets/mole.jpg'}, //new Mole(),
        'Mechanic' : {name: 'Mechanic-Guy',pic:'assets/mechanic.jpg'}
    }
    //mapping from passage-locations to background images
    window.gm.ScenePic = {
        'Garden': {pic:'assets/bg_park.png'},
        'Park' : {pic:'assets/bg_park.png'}
    }
}