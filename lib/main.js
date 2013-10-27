// -*- coding: utf-8-unix -*-
enchant();

var Pane = enchant.Class.create(Group, {
    initialize: function(width, height){
        EventTarget.call(this); // これがないと boardLayout.addChild(lanePane) に失敗する。
        Group.call(this);
        this.width = width;
        this.height = height;
        sprite = new Sprite(this.width, this.height);
        surface = new Surface(this.width, this.height);
        sprite.image = surface;
        context = surface.context;
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(this.width, 0);
        context.lineTo(this.width, this.height);
        context.lineTo(0, this.height);
        context.lineTo(0, 0);
        context.closePath();
        context.stroke();
        this.addChild(sprite);
    }
});

var LanePane = enchant.Class.create(Pane, {
    initialize: function(width, height, slotSize){
        Pane.call(this, width, height);
        this.slotSize = slotSize;
        sprite = new Sprite(this.width, this.height);
        surface = new Surface(this.width, this.height);
        sprite.image = surface;
        context = surface.context;
        for(var slotCount = 0; slotCount < slotSize; slotCount++){
            context.beginPath();
            var x = this.width / slotSize * slotCount;
            context.moveTo(x, 0);
            context.lineTo(x, this.height);
            context.closePath();
            context.stroke();
        }
        this.addChild(sprite);
    }
});

var BoxLayout = enchant.Class.create(Group, {
    initialize: function(parentGroup){
        this.parentGroup = parentGroup;
        this.child_x = 0;
        this.child_y = 0;
    },
    addChild: function(childNode){
        this.parentGroup.addChild(childNode);
        childNode.x = this.child_x;
        childNode.y = this.child_y;
        this.child_y += childNode.height;
    }
});

window.onload = function(){
    var game_x = 640;
    var game_y = 960;
    var game = new Game(game_x, game_y);

    var card_width = 64;
    var card_height = 160;

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
        label.x = scene.width / 4;
        label.y = scene.height / 2;

        var sceneLayout = new BoxLayout(scene);

        var boardPane = createBoardPane(sceneLayout);

        var handPane = new LanePane(card_width * 10, card_height, 10);
        // handPane.backgroundColor = 'rgba(255, 200, 80, 1)';
        handPane.addChild(new Label("handPane"));
        sceneLayout.addChild(handPane);

        var scorePane = new Pane(card_width * 10, card_height);
        // scorePane.backgroundColor = 'rgba(255, 200, 120, 1)';
        scorePane.addChild(new Label("scorePane"));
        sceneLayout.addChild(scorePane);

        // この関数内で作ったシーンを呼び出し元に返します(return)
        return scene;
    };

    function createBoardPane(sceneLayout) {
        var boardPane = new Pane(card_width * 5, card_height * 4);
        // boardPane.backgroundColor = 'rgba(255, 200, 40, 1)';
        boardPane.addChild(new Label("boardPane"));
        sceneLayout.addChild(boardPane);

        var boardLayout = new BoxLayout(boardPane);
        var lanePaneArray = [
            new LanePane(boardPane.width, boardPane.height / 4, 5),
            new LanePane(boardPane.width, boardPane.height / 4, 5),
            new LanePane(boardPane.width, boardPane.height / 4, 5),
            new LanePane(boardPane.width, boardPane.height / 4, 5)
        ];
        for(var i = 0; i < lanePaneArray.length; i++){
            boardLayout.addChild(lanePaneArray[i]);
        }
    }

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
