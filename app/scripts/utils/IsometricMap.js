define([],function(){

    var IsometricMap = function(canvas,tiledMap) {
        this.canvas = canvas;
        this.tiledMap = tiledMap;
    };

    /**
    * Print the isometric tiles on the canvas
    **/
    IsometricMap.prototype.printOutTilesOnCanvas = function() {

      // 1. select the first layer
      var backgroundLayer = selectLayer.call(this,"background");
      var tileset = selectTileset.call(this,"snowplains");
      iterateOverRows(backgroundLayer.data,0,backgroundLayer,this.tiledMap,tileset);

/*
      for(i, loop through rows)
        for(j, loop through columns)
          x = j * tile width
          y = i * tile height
          tileType = levelData[i][j]
          placetile(tileType, twoDToIso(new Point(x, y)))
*/
        console.log(this.tiledMap);

    };

    function iterateOverRows(flatListOfElements,row,layer,map,tileset) {

        flatListOfElements.slice(0,map.width).forEach(function(column,index) {
            var twoDPoint = {};
            twoDPoint.x = column * tileset.tilewidth;
            twoDPoint.y = row * tileset.tileheight;

            var tileSpecification = retriveTileSpecification(column,tileset);
            placeTile(tileSpecification,twoDToIso(twoDPoint));

        });
        if(flatListOfElements.length >= map.width)
            iterateOverRows(flatListOfElements.slice(map.width),row+1,layer,map,tileset);
    };

    function retriveTileSpecification(column,tileset) {

        var numberOfTilesInARow = tileset.imagewidth/tileset.tilewidth;
        console.log(column + " -> " +"x" +getXPos(column,numberOfTilesInARow,tileset.tilewidth) + ", y" + getYPos(column,numberOfTilesInARow,tileset.tileheight,0));
        return {
            "tileset": tileset,
            "x":getXPos(column,numberOfTilesInARow,tileset.tilewidth),
            "y":getYPos(column,numberOfTilesInARow,tileset.tileheight,0)
        };
    };

    function getYPos(column,numberOfTilesInARow,tileheight,rowsCollected) {

        if(column < numberOfTilesInARow) {

            return rowsCollected * tileheight;

        } else {

            return getYPos(column - numberOfTilesInARow, numberOfTilesInARow,tileheight,rowsCollected+1);
        }

    };

    function getXPos(column,numberOfTilesInARow,tilewidth) {

        if(column < numberOfTilesInARow) {

            return (column * tilewidth) - tilewidth;

        } else {

            return getXPos(column - numberOfTilesInARow,numberOfTilesInARow,tilewidth);

        }
    };

    function twoDToIso(pt){

        var tempPt = {};
        tempPt.x = pt.x - pt.y;
        tempPt.y = (pt.x + pt.y) / 2;
        return tempPt;

    };

    function isoTo2D(pt) {
        var tempPt = {};
        tempPt.x = (2 * pt.y + pt.x) / 2;
        tempPt.y = (2 * pt.y - pt.x) / 2;
        return tempPt;
    }

    function renderImage(canvas,x, y) {
      c.drawImage(img, ox + (x - y) * spriteWidth/2, oy + (y + x) * gridHeight/2-(spriteHeight-gridHeight),spriteWidth,spriteHeight)
    }

    function convertFlatPointToIsometric() {

        return {
          "x":"123",
          "y":"1233"
        }
    };

    function createTile(tileSpecification) {


    };

    function placeTile(tileSpecification, isometricPoint) {


    };

    function selectTileset(name) {

      return this.tiledMap.tilesets.filter(function(e) {
          return e.name === name;
      })[0];

    };
    function selectLayer(layerName) {
        return this.tiledMap.layers.filter(function(e) {
            return e.name === layerName;
        })[0];
    };
    return IsometricMap;
});
