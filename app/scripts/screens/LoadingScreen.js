define(["json!./../../resources/snowMapCollision.json","utils/IsometricMap","utils/CanvasSingleton","utils/MapHandler","utils/Session","easel","utils/Movable","logic/Cursor"],function(map,IsometricMap,canvas,MapHandler,session,createjs,MovableCharacter,SelectArea) {


  var KEYCODE_LEFT = 65,
      KEYCODE_RIGHT = 68,
      KEYCODE_UP = 87,
      KEYCODE_DOWN = 83;


  var LoadingScreen = function(options) {
      this.options = options;

  };

  LoadingScreen.prototype.start = function() {

      var stage = new createjs.Stage(canvas);
      stage.x = 300;
      stage.y = 100;
      stage.cursor = 'default';

      stage.enableMouseOver(20)
      session.setStage(stage);
      createjs.Ticker.addEventListener("tick", tick.bind(this)); // todo: remove me, this should be made in the screen



      var isometricMap = new IsometricMap();
      session.setMap(isometricMap.printOutTilesOnCanvas(map));
      resizeCanvas(canvas);

      var fakeCharacter = createFakeCharacter();
      var player = new MovableHelper(createFakeCharacter());
      player.attachTo({
        "x":8,
        "y":9
      });

      var player1 = new MovableHelper(createFakeCharacter());
      player1.attachTo({
        "x":4,
        "y":3
      });

      this.listOfSelectedCharacters = [];
      this.listOfCharacters  = [];
      this.listOfCharacters.push(player);
      this.listOfCharacters.push(player1);

      addEventListnersForStage.call(this);


      this.selectArea = new SelectArea({
          "onSelect":function() {
              this.listOfSelectedCharacters = [];
              this.listOfCharacters.forEach(function(e) {

                  var cordinates = e.movable;
                  var bound = e.movable.getBounds();
                  var rectArea = {
                    "x":cordinates.x,
                    "y":cordinates.y,
                    "height":32, // observe that this is set to a custom value
                    "width":bound.width
                  };
                    console.log(this)
                  if(this.selectArea.checkIntersection(rectArea)) {
                      this.listOfSelectedCharacters.push(e);
                  }

              }.bind(this));

          }.bind(this)
      });

  };

  function addEventListnersForStage() {

      session.getStage().on("click",onMouseClick.bind(this));
  };

  function onMouseClick (ev) {

      var stage = session.getStage();
      var rawMousePointer = stage.globalToLocal(ev.stageX,ev.stageY);

      var mousePointer = {
        "x":rawMousePointer.x - 32,
        "y":rawMousePointer.y - 96
      };
      var destination = MapHandler.pixleCordinatesToIsometricCordinates(mousePointer);
      this.listOfSelectedCharacters.forEach(function(e) {

          e.goTo(destination);

      }.bind(this));

  };

  function tick() {


      this.listOfCharacters.forEach(function(e) {

          e.update();

      }.bind(this));

      session.getStage().update();

  };


  function resizeCanvas(canvas) {

      canvas.width = 700;//window.outerWidth;    //ie8>= doesn't have innerWidth/Height
      canvas.height =700;//window.outerHeight;  //but they don't have canvas

  };

  function createFakeCharacter() {
      // todo: move somewhere else
    //  var tileSpecification = { x: 768, y: 896};

      var crop = new createjs.Bitmap("resources/user.png");
      crop.cursor = "pointer";

    // [x=0]  [y=0]  [width=0]  [height=0]
      crop.sourceRect = new createjs.Rectangle(
      0,
      0,
      64,
      128);
      console.log(crop.width)
      return crop;
  }


  return LoadingScreen;

});
