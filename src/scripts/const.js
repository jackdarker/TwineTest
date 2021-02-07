"use strict";

//import {LighterDad} from './Items.js'; //why is this not working
//constant declarations
//this is a lookuptable for items

function getVersion(){return("0,0,0,");} 

function createItemLookups(){
    window.gm.ItemsLib = {};
    //window.gm.ItemsLib = { 
    window.gm.ItemsLib['LighterDad'] = new LighterDad();// { name: 'Lighter from Dad', desc: 'I got this lighter from my real dad.', usable:defaultCanUse, use:defaultOnUse },
    window.gm.ItemsLib['LaptopPS'] = new LaptopPS();//{name: 'Laptop-PS', desc:'Power converter for laptop.', usable: function(){return ({OK: false, msg:'not usable on its own'})},use: defaultNoUse};
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
    'pAttack' :stPAttack,
    'pDefense':stPDefense,
    'health': stHealth,//{name: 'Health', desc: 'How healthy you are.',onChange: defaultOnChange,onApply:defaultOnApply, onRemove:defaultOnRemove},
    'healthMax': stHealth,
    'energy': stEnergy,
    'energyMax': stEnergy//{name: 'Energy', desc: 'How much energy you have.',onChange: defaultOnChange,onApply:defaultOnApply, onRemove:defaultOnRemove}
}
    //lookup table 
    window.gm.EffectLib = { 
    'NotTired':  effNotTired,
    'Tired':  effTired,//{name: 'Tired', desc: 'You feel tired',onTimeChange: defaultTimeChange,onApply:defaultOnApply, onRemove:defaultOnRemove},
    'Energized':  effEnergized//{name: 'Energized', desc: 'You feel energized',onTimeChange: defaultTimeChange,onApply:defaultOnApply, onRemove:defaultOnRemove}
    };

}