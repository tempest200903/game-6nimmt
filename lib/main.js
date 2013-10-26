enchant();
window.onload = function(){
    var game = new Game(320, 320); 

    var label = new Label('Hello, enchant.js!...');
    game.rootScene.addChild(label);

    game.start();
}
