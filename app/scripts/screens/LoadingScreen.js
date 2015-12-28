define(["json!./../../resources/snowMapCollision.json","utils/IsometricMap","utils/CanvasSingleton","utils/MapHandler","utils/Session","easel","utils/MovableCharacter"],function(map,IsometricMap,canvas,MapHandler,session,createjs,MovableCharacter) {


  var KEYCODE_LEFT = 65,
      KEYCODE_RIGHT = 68,
      KEYCODE_UP = 87,
      KEYCODE_DOWN = 83;


  var LoadingScreen = function(options) {
      this.options = options;

  };

  LoadingScreen.prototype.start = function() {
      this.fakeCharacterMovmentList = [];

      var stage = new createjs.Stage(canvas);
      stage.x = 300;
      stage.y = 100;

      session.setStage(stage);
      stage.on("click",moveCharacter.bind(this));
      createjs.Ticker.addEventListener("tick", tick.bind(this)); // todo: remove me, this should be made in the screen

      var isometricMap = new IsometricMap();
      session.setMap(isometricMap.printOutTilesOnCanvas(map));
      resizeCanvas(canvas);

      var fakeCharacter = createFakeCharacter();
      this.player = new MovableHelper(fakeCharacter);
      this.player.attachTo({
        "x":8,
        "y":9
      });

  };
  function moveCharacter (ev) {

      var stage = session.getStage();
      var rawMousePointer = stage.globalToLocal(ev.stageX,ev.stageY);

      var mousePointer = {
        "x":rawMousePointer.x - 32,
        "y":rawMousePointer.y - 96
      };
      
      var destination = MapHandler.pixleCordinatesToIsometricCordinates(mousePointer);
      this.player.goTo(destination);
  /*    var source = MapHandler.pixleCordinatesToIsometricCordinates(this.fakeCharacter);
      var destination = MapHandler.pixleCordinatesToIsometricCordinates(mousePointer);
      this.fakeCharacterMovmentList = MapHandler.shortestPath(this.stupidMap[3],source,destination);
      this.fakeCharacterMovmentList.unshift(source);
      */
  };

  function tick() {
/*
      if(this.fakeCharacterMovmentList.length < 2) {
          session.getStage().update();
          return;
      }
      // TODO: MOVE THIS CODE TO THE CharacterHelper ASAP ASAP ASAP!!! REFACTOR
      var update = true;
      var speed = 1.8;
      var subPath = this.fakeCharacterMovmentList[1];
      var subPathPixleCordinates = MapHandler.isometricCordinatesToPixelCordinates(subPath);
      var orientation = checkOrientation(this.fakeCharacterMovmentList[0],this.fakeCharacterMovmentList[1]);
      var c = getMoveCordinates(this.fakeCharacter,orientation,speed);

      if(orientation === "standStill")
          update = false;

      if(orientation === "south") {

          if(c.y >= subPathPixleCordinates.y && c.x <= subPathPixleCordinates.x) {
              copyCordinates(subPathPixleCordinates,c);
              this.fakeCharacterMovmentList.shift();
          }

      } else if(orientation === "west") {

        if(c.y >= subPathPixleCordinates.y && c.x >= subPathPixleCordinates.x) {
            copyCordinates(subPathPixleCordinates,c);
            this.fakeCharacterMovmentList.shift();
        }

      } else if(orientation === "north") {

        if(c.y <= subPathPixleCordinates.y && c.x >= subPathPixleCordinates.x) {
            copyCordinates(subPathPixleCordinates,c);
            this.fakeCharacterMovmentList.shift();
        }

      } else if(orientation === "east") {

        if(c.y <= subPathPixleCordinates.y && c.x <= subPathPixleCordinates.x) {
            copyCordinates(subPathPixleCordinates,c);
            this.fakeCharacterMovmentList.shift();
        }

      }

      if(update === true) {

        this.fakeCharacter.x = c.x;
        this.fakeCharacter.y = c.y;

        updateCharacterDeepSorting.call(this);

        session.getStage().update();

      }
*/
        this.player.update();
        session.getStage().update();

  };


  function resizeCanvas(canvas) {

      canvas.width = 700;//window.outerWidth;    //ie8>= doesn't have innerWidth/Height
      canvas.height =700;//window.outerHeight;  //but they don't have canvas

  };

  function createFakeCharacter() {

      var tileSpecification = { x: 768, y: 896};

      var crop = new createjs.Bitmap("resources/user.png");
    // [x=0]  [y=0]  [width=0]  [height=0]
      crop.sourceRect = new createjs.Rectangle(
      0,
      0,
      64,
      128);
      return crop;


  }


  return LoadingScreen;

});
