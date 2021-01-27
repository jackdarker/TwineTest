"use strict";
/* bundles some operations related to combat */
window.gm2 = window.gm2 || {};
window.gm2.initCombat = function(id) { //setup enemy for encounter
    var s=window.story.state;
    s.enemy.name = id;
    s.enemy.activeTurn =false;
    s.enemy.combatState='battling';
};