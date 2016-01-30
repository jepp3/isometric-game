define(["json!./../../resources/snowMapPerformanceTest.json","utils/IsometricMap","utils/CanvasSingleton","utils/MapHandler","utils/Session","easel","utils/Movable","logic/Cursor"],function(map,IsometricMap,canvas,MapHandler,session,createjs,MovableCharacter,SelectArea) {


  var KEYCODE_LEFT = 65,
      KEYCODE_RIGHT = 68,
      KEYCODE_UP = 87,
      KEYCODE_DOWN = 83;


  var LoadingScreen = function(options) {
      this.options = options;

  };

  LoadingScreen.prototype.start = function() {
    this.ii = 0;
      var stage = new createjs.Stage(canvas);
      stage.x = 300;
      stage.y = 100;
      stage.cursor = 'default';
      stage.enableMouseOver(20)
      session.setStage(stage);

      createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
      createjs.Ticker.setFPS(30);
      createjs.Ticker.addEventListener("tick", tick.bind(this)); // todo: remove me, this should be made in the screen

      var mapContainer  = new createjs.Container();
      session.setMapContainer(mapContainer);
      stage.addChild(mapContainer);
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
      this.listOfCharacters  = [];


      for(var i = 0; i < 20; i ++) {

        var p = new MovableHelper(createFakeCharacter());
        p.attachTo({
          "x":4 + i ,
          "y":0
        });

        this.listOfCharacters.push(p);
        session.getMovableObjects().push(p);

      }
      this.listOfSelectedCharacters = [];
      session.getMovableObjects().push(player);
      session.getMovableObjects().push(player1);
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
                    "height":32, // observe that this is set to a custom value
                    "width":bound.width
                  };

                  // make the cordinates to global, these are needed for the comparison
                  e.movable.localToGlobal(bound.x, bound.y+96,rectArea);

                  if(this.selectArea.checkIntersection(rectArea)) {
                      this.listOfSelectedCharacters.push(e);
                  }

              }.bind(this));

          }.bind(this)
      });

      document.onkeydown = keyPressed;

      session.updateOfCanvasNeeded()

  };

  function keyPressed(event) {
    var speed = 17;
    var m = session.getMapContainer();
  //

    switch(event.keyCode) {
  			case KEYCODE_LEFT:
          session.updateOfCanvasNeeded()
  				m.x += speed;
  				break;
  			case KEYCODE_RIGHT:
          session.updateOfCanvasNeeded()
  				m.x -= speed;
  				break;
  			case KEYCODE_UP:
          session.updateOfCanvasNeeded()
  				m.y += speed;
  				break;
  			case KEYCODE_DOWN:
          session.updateOfCanvasNeeded()
  				m.y -= speed;
  				break;

  		}

  };



  function addEventListnersForStage() {

      session.getStage().on("click",onMouseClick.bind(this));

      window.addEventListener('resize', resizeCanvas, false);

  };

  function onMouseClick (ev) {

      var stage = session.getStage();
      // first make the location global
      var rawMousePointer = stage.localToGlobal(ev.stageX,ev.stageY);

      // convert the global to map positions
      rawMousePointer =session.getMapContainer().globalToLocal(ev.stageX,ev.stageY);

      var mousePointer = {
        "x":rawMousePointer.x - 32,
        "y":rawMousePointer.y - 96
      };
      console.log(ev.stageX,ev.stageY);
      var destination = MapHandler.pixleCordinatesToIsometricCordinates(mousePointer);
      this.listOfSelectedCharacters.forEach(function(e) {

          e.goTo(destination);

      }.bind(this));

  };

  function tick() {

      if(session.isUpdateofCanvasNeeded()) {
    //    console.log("canvas updated");
          session.getStage().update();
          session.updateOfCanvasNotNeeded();
      }

      this.listOfCharacters.forEach(function(e) {

          e.update();

      }.bind(this));
      if(this.ii === 100) {
          console.log(Math.round(createjs.Ticker.getMeasuredFPS()) + " fps");

          this.ii = 0;
      }
      this.ii++;

  };


  function resizeCanvas() {

      session.getStage().canvas.width = window.innerWidth;
      session.getStage().canvas.height = window.innerHeight;
      session.updateOfCanvasNeeded();
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
