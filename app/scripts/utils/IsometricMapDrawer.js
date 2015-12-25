define(["utils/Session","utils/MapWalker"],function(session,MapWalker) {


    var IsometricMapDrawer = function() {


    };

    IsometricMapDrawer.drawMap = function (map) {
      console.log(map.length)
      map.forEach(function(layer) {
          console.log("layer")
        MapWalker.map(layer,function(tileSpecification,row,column) {
            console.log("tile drawn")
            drawTile(tileSpecification);

        });

      });

    };


    function drawTile(tileSpecification) {
        console.log(session.getStage());
        var crop = new createjs.Bitmap(tileSpecification.tileset.image);
      // [x=0]  [y=0]  [width=0]  [height=0]
        crop.sourceRect = new createjs.Rectangle(
        tileSpecification.x,
        tileSpecification.y,
        tileSpecification.tileset.tilewidth,
        tileSpecification.tileset.tileheight);
        session.getStage().addChild(crop);
        crop.y = isometricPoint.y;
        crop.x = isometricPoint.x;

        return {
            "tileSpecification":tileSpecification,
            "element": crop
        }


    };

    return IsometricMapDrawer;

});
