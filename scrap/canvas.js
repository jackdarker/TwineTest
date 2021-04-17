window.gm.combat.printCombatScreen = function() { //prints scene-bg and enemy to canvas      
  var canvas = document.getElementById("exampleCanvas");
  var ctx = canvas.getContext("2d");
  var img = new Image();
  img.src = "assets/bg_park.png";   //todo the loading o image takes a while and it will not refreh automatically
  ctx.drawImage(img, 0, 0);
  img = new Image();
  img.src = "assets/bird.gif";   //todo the loading o image takes a while and it will not refreh automatically
  ctx.drawImage(img, 0, 0);
}