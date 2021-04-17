"use strict";
/* bundles some utility operations*/

window.gm.getSaveVersion= function(){
    var version = [0,1,0];
      return(version);    
};
// reimplement to setup the game
window.gm.initGame= function(forceReset,NGP=null) {
  //var toast = new Toasty();
//toast.info("Here is some information!");

    //this does not work because hidden is called to late
    /*$(window).on('sm.passage.hidden', function(event, eventObject) {
      
      if(eventObject.passage) {// No passage to hide when story starts
          console.log('hiding'+eventObject.passage.name);        
      }
    });*/
    $(window).on('sm.passage.showing', function(event, eventObject) {
        // Current Passage object
        $("tw-passage").fadeIn(500);  //fade in if was previously faded out
      console.log('showing '+eventObject.passage.name);
    });
    // Render the passage named HUD into the element todo replace with <%=%>??
    $(document).on('sm.passage.shown', function (ev,eventObject) { window.gm.updateOtherPanels();});
    
    var s = window.story.state; //s in template is window.story.state from snowman!
    if (!s.vars||forceReset) { // storage of variables that doesnt fit player
        s.vars = {
        debug : true,   //TODO set to 0 for distribution !   see debug passage for meaning
        dbgShowCombatRoll: false,
        version : window.gm.getSaveVersion(),
        log : [],
        passageStack : [], //used for passage [back] functionality
        defferedStack : [], //used for deffered events
        time : 700, //represented as hours*100 +minutes
        day : 1,
        activePlayer : 'Ratchel', //id of the character that the player controls currently
        //queststates
        qLaptop : 0,   // see passage _Laptop_
        qDogSit : 0,   // see park
        qUnlockCampus : 0,  //see passage into city
        qUnlockPark : 0,
        qUnlockMall : 0,
        qUnlockBeach : 0,
        qUnlockDowntown : 0,
        qUnlockRedlight : 0,
        qUnlockBeach : 0,
        hairGrow: 0,
        crowBarLeft: 1,
        debugInv: new Inventory()
        }; 
        s.vars.debugInv._parent = window.gm.util.refToParent(null);
        s.vars.debugInv.addItem(new Money(),200);

    }
    if (!s.tmp||forceReset) { 
      // storage of temporary variables; dont use them in stacking passages or deffered events      
      s.tmp = {
        rnd : 0,  // can be used as a random variable for use in CURRENT passage
        args: []  // can be used to set arguments before another passage is called (passage-arguments) 
      }
  }
    if (!window.gm.achievements||forceReset) {  //outside of window.story !
      window.gm.achievements= {
        moleKillerGoldMedal: false //add your flags here
      }
      window.storage.loadAchivementsFromBrowser();
    }
    if (!s.enemy||forceReset) { //actual/last enemy
      s.enemy = new Character();
    }
    if (!s.combat||forceReset) { //see encounter & combat.js
      s.combat = {
        newTurn : false,
        enemyFirst : false, //if true, enemy moves first
        enemyTurn : false, //true if enemys turn
        state : ""  , //internal state
        playerFleeing : false,
        playerSubmitting : false,
        turnCount: 0,
        scenePic : 'assets/bg_park.png'
      }
    }
    if (!s.mom||forceReset) {
      s.mom = {
        location : "Kitchen",
        coffeeStore : 5,
        foodStore : 3,
        foodMaxStore : 4
      };
    }
    if (!s.Cyril||forceReset) {  //alternative player character
      window.gm.Cyril = new Character()
      window.gm.Cyril.name="Cyril";
      //add some basic inventory
      window.gm.Cyril.Wardrobe.addItem(new Jeans());
      window.gm.Cyril.Wardrobe.addItem(new TankShirt());
      window.gm.Cyril.Outfit.addItem(new Jeans());
      window.gm.Cyril.Outfit.addItem(new TankShirt());
      window.gm.Cyril.Stats.increment('strength',3);
      s.Cyril = window.gm.Cyril;
      //delete window.gm.Cyril; 
    }
    if (!s.Ratchel||forceReset) {  
        /*s.Ratchel = Character.defaultData(); //get default struct and add some special data
        s.Ratchel.name = 'Ratchel',
        s.Ratchel.skillPoints = 2,    //no. of free skillpoints on game-start  
        s.Ratchel.skSporty = 0,//perklevels ,name should match perkId
        s.Ratchel.skCook = 0,
        s.Ratchel.skSlacker = 0,
        s.Ratchel.skMoneymaker = 0,
        s.Ratchel.skTechy = 0;*/
        //window.gm.Ratchel = new Character(s.Ratchel);
        window.gm.Ratchel = new Character();
        window.gm.Ratchel.name="Ratchel";
        window.gm.Ratchel.gainRelation('Mom',10);
        window.gm.Ratchel.Effects.addItem(skCooking.name,new skCooking());
        //add some basic inventory
        window.gm.Ratchel.Inv.addItem(new Money(),20);
        window.gm.Ratchel.Inv.addItem(new LighterDad());
        window.gm.Ratchel.Wardrobe.addItem(new Jeans());
        window.gm.Ratchel.Wardrobe.addItem(new Leggings());
        window.gm.Ratchel.Wardrobe.addItem(new TankShirt());
        window.gm.Ratchel.Wardrobe.addItem(new Pullover());
        window.gm.Ratchel.Wardrobe.addItem(new TailRibbon());
        //window.gm.Ratchel.Outfit.addItem(new TailCat());
        window.gm.Ratchel.Outfit.addItem(new Jeans());
        window.gm.Ratchel.Outfit.addItem(new Pullover());
        s.Ratchel=window.gm.Ratchel;
    }      
    window.gm.switchPlayer(s.Ratchel.name); //start-player
    if(NGP) { window.story.state.vars.crowBarLeft = NGP.crowBarLeft; }
    NGP=null; //release memory
}
// lookup function for scene background
window.gm.getScenePic = function(id){
  if(id==='Garden' || id ==='Park')   return('assets/bg_park.png');
  return('assets/bg_park.png');//todo placehodler
}
window.gm.giveCyrilFood=function(){
    if(window.gm.player.Inv.countItem('SimpleFood')>0) {
        var res=window.gm.player.Inv.use('SimpleFood', window.story.state.Cyril);
        window.gm.printOutput(res.msg);
    } else {
        window.gm.printOutput("you have no food to spare");
    }
}


//prints a list of todo quest
window.gm.printTodoList= function() {
    var elmt='<form><ul style=\"list-style-type: none\" >';
    var s= window.story.state;
    var list=['qDogSit'];
    elmt +="<li><label><input type=\"checkbox\" name=\"y\" value=\"x\" readonly disabled>always: keep the fridge filled</label></li>";
    for(var i=0; i<list.length; i++) {
        var val = s.vars[list[i]];
        var msg ='';
        if(list[i]==='qDogSit') {       //todo we could use <%=> instead
        if(val<=0) {  
        } else if(val<=0x100) {
            msg = 'There was this dogsit-ad in the park. Maybe you should call there to earn some money.';
        } else if(val<=0x200) {
            msg = 'You called dogsit but didnt get a response...';
        }else if(val<=0x300) {
            msg = 'Get a task from dogsit!';
        }
        }
        if(msg!='') elmt +="<li><label><input type=\"checkbox\" name=\"y\" value=\"x\" readonly disabled>"+msg+"</label></li>";
    }
        elmt +="</ul></form></br>";
        return(elmt);
};
//prints a list of perks for unlock
window.gm.printUnlockPerk= function(id, descr) {
    var elmt='';
    var s= window.story.state;
        if(window.gm.player[id]==0 && window.gm.player.skillPoints>0) {
            elmt +=''.concat("<a0 id='"+id+"' onclick='(function ( $event ) { unlockPerk($event.id); })(this);'>"+descr+"</a>");
        elmt +=''.concat("    [[Info|"+id+"]]");
        } else if(window.gm.player[id]>0) {
            elmt +=id+": "+descr;
        }
        elmt +=''.concat("</br>");
        return(elmt);
};

