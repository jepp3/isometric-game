define(["json!./../../resources/mapOne.json","utils/IsometricMap"],function(map,IsometricMap) {

  var LoadingScreen = function(options) {
      this.options = options;

  };

  LoadingScreen.prototype.start = function() {
      this.canvas = generateCanvas.call(this);
      resizeCanvas(this.canvas);
      loadMap.call(this);

  };

  function resizeCanvas(canvas) {
    console.log("resizing");
      canvas.width = window.innerWidth    //ie8>= doesn't have innerWidth/Height
      canvas.height = window.innerHeight  //but they don't have canvas

  }
  /**
  * get the map as json from the backend.
  *
  **/
  function loadMap() {
      var isometricMap = new IsometricMap(this.canvas,map);
      isometricMap.printOutTilesOnCanvas();
  };

  function generateCanvas() {

      var rawElement = this.options.canvas.get(0);
      var ctx = rawElement.getContext("2d");
      return ctx;
  };
  /**
  * load the assets from the backen, so we know what images
  **/
  function loadAssets() {

  };

  return LoadingScreen;

});
