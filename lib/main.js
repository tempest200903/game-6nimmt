// -*- coding: utf-8-unix -*-
enchant();
window.onload = function(){
    var game_x = 640;
    var game_y = 960;
    var game = new Game(game_x, game_y); 

    /**
     * タイトルシーンを作り、返す関数
     */
    var createTitleScene = function() {
        var scene = new Scene();                // 新しいシーンを作る

        var label = new Label('タイトルシーン タッチでゲームシーンへ');
        label.x = game_x / 2;
        label.y = game_y / 2;
        scene.addChild(label);

        var north = new Label('North');
        north.x = game_x / 2;
        north.y = 0;
        scene.addChild(north);

        var south = new Label('South');
        south.x = game_x / 2;
        south.y = game_y - 15;
        scene.addChild(south);

        var east = new Label('East');
        east.x = game_x - 36;
        east.y = game_y / 2;
        scene.addChild(east);

        var west = new Label('West');
        west.x = 0;
        west.y = game_y / 2;
        scene.addChild(west);

        scene.backgroundColor = 'rgba(255, 230, 0, 1)';      // シーンの背景色を設定
        scene.addEventListener(Event.TOUCH_START, function(e) { // シーンにタッチイベントを設定
            //現在表示しているシーンをゲームシーンに置き換えます
            game.replaceScene(createGameScene());
        });
        // この関数内で作ったシーンを呼び出し元に返します(return)
        return scene;
    };

    /**
     * ゲームシーンを作り、返す関数
     */
    var createGameScene = function() {
        var scene = new Scene();                // 新しいシーンを作る
        var label = new Label('ゲームシーン タッチでゲームオーバーシーンを重ねる');        // 新しいラベル(文字)を作る
        scene.addChild(label);                  // シーンにラベルに追加
        scene.backgroundColor = 'rgba(255, 200, 0, 1)';      // シーンの背景色を設定
        scene.addEventListener(Event.TOUCH_START, function(e) { // シーンにタッチイベントを設定
            //現在表示しているシーンの上にゲームオーバーシーンを重ねて表示します
            game.pushScene(createGameoverScene());
        });
        // この関数内で作ったシーンを呼び出し元に返します(return)
        return scene;
    };

    /**
     * ゲームオーバーシーンを作り、返す関数
     */
    var createGameoverScene = function() {
        var scene = new Scene();                // 新しいシーンを作る
        var label = new Label('ゲームオーバーシーン タッチでゲームシーンに戻る');      // 新しいラベル(文字)を作る
        label.x = 0;                            // 横位置調整
        label.y = 20;                           // 縦位置調整
        scene.addChild(label);                  // シーンにラベルに追加
        scene.backgroundColor = 'rgba(0, 0, 255, 0.5)';      // シーンの背景色を設定
        scene.addEventListener(Event.TOUCH_START, function(e) { // シーンにタッチイベントを設定
            //現在表示しているシーンを外し、直前のシーンを表示します
            game.popScene();
        });
        // この関数内で作ったシーンを呼び出し元に返します(return)
        return scene;
    };

    // ゲームの_rootSceneをタイトルシーンに置き換えます
    game.replaceScene(createTitleScene());

    game.start();
}
