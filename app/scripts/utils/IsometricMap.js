define(["easel","utils/Session","utils/MapHandler"],function(createjs,session,MapHandler){


    /**
    * This class draws a isometric map. It gives you posibilites to add eventHandlers when
    * interacting with different tile types.
    *
    * For example, when adding some custom collision detection or some special enemies, that you want
    * to handle differently, you can do so by giving a function as parameter, that matches that
    * specific condition.
    *s
    * @param tileMap TiledMap
    *
    **/
    var IsometricMap = function(tiledMap) {
          var canvas =  document.getElementById("c");
    };

    /**
    *   Print the isometric tiles on the canvas
    *
    *   Iterate over all the layers, start with the one in the bottom. Then print every layer seperatly.
    *
    *   The tileSets used in a map can be shared between different layers.
    **/
    IsometricMap.prototype.printOutTilesOnCanvas = function(tiledMap) {

        // move this
        this.tiledMap = tiledMap;

        var table =[];
        // 1. select the next layer
        this.tiledMap.layers.forEach(function(layer) {

            if(layer.name ==="rules") {
              // if its an collision layer , then generate a colision data instead
              table.push(collectRules.call(this,layer.data,0,layer,this.tiledMap,this.tiledMap.tilesets));

            } else {

              // if its an normal tile layer do this
              table.push(iterateOverRows.call(this,layer.data,0,layer,this.tiledMap,this.tiledMap.tilesets));

            }

        }.bind(this));

        // return the workable variant of the matrix
        return table;
    };

    /**
    *  This method gives you the correct tileset to use.
    *  Each tileSet has a seed of uid's that only lives inside that tileset.
    *
    * This method will simply check in whats tileSets seed of uid the given gid resists.
    *
    * @param gid uniq identifier for a given tile
    * @param list of tileSets
    **/
    function getTileSetByUid(gid,tileSets) {

        if(gid === 0)
          return undefined;
        if(tileSets.length === 0)
          throw new Error("inconsistent tilemap. the gid " + gid + " " + "was not found in the list of tilesets");
        // if gid is larger than the smallest in current and smaller than the largest in current
        if(gid >= tileSets[0].firstgid  && ( tileSets.length == 1 || tileSets[1].firstgid > gid))
          return tileSets[0];
        else
          return getTileSetByUid(gid,tileSets.slice(1));

    };


    function collectRules(flatListOfElements,row,layer,map,tilesets) {

      var tiles = [];
      flatListOfElements.slice(0,map.width).forEach(function(gid,index) {

            var rule = retriveRule(gid,tilesets);
            tiles.push(rule);

        }.bind(this));

        // continue with next row ( if there are any )
        if(flatListOfElements.length >= map.width) {

            var existingRows = collectRules.call(this,flatListOfElements.slice(map.width),row+1,layer,map,tilesets);
            existingRows.unshift(tiles);
            return existingRows;

        } else {

            var rows = [];
            return rows;

        }

    };

    /**
    * Will return a rule , currently supported is wall, region and pit
    *
    * @param gid raw gid ( no rebase )
    * @param tilesets an array of tilesets to filter from.
    * @returns ruleSpecification
    **/
    function retriveRule(gid,tilesets) {

      var tileset = getTileSetByUid(gid,tilesets);

      if(tileset === undefined)
          return undefined;

      //todo: write generic method for geting a rebased gid
      var rebasedgid = gid - tileset.firstgid +1;

      var ruleSpecification = {};

      switch (rebasedgid) {
        case 1:
          ruleSpecification.type = "REGION";
          break;
        case 2:
          ruleSpecification.type = "VOID";
          break;
        case 3:
          ruleSpecification.type = "FLOOR";
          break;
        case 4:
          ruleSpecification.type = "PIT";
          break;
        case 5:
          ruleSpecification.type = "WALL";
          break;
        default:
          ruleSpecification.type = "UNKOWN";

      }

      return ruleSpecification;

    };

    function iterateOverRows(flatListOfElements,row,layer,map,tilesets) {

      var tiles = [];
      flatListOfElements.slice(0,map.width).forEach(function(column,index) {

            // calculate the x and y position for a the tile we are going to create
            var twoDPoint = {}, tile;
            twoDPoint.x = ( index - row ) * map.tilewidth/2;
            twoDPoint.y = ( index + row ) * map.tileheight/2;

            // get a tile specification that hold information about what image ( tileset image ) to use and
            // what cordinates in that tileset to use to create the tile
            var tileSpecification = retriveTileSpecification(column,tilesets);

            // draw the tile on the canvas if it exists
            if(tileSpecification)
              tile = placeTile.call(this,tileSpecification,twoDPoint);

            tiles.push(tile);

        }.bind(this));

        // continue with next row ( if there are any )
        if(flatListOfElements.length >= map.width) {

            var existingRows = iterateOverRows.call(this,flatListOfElements.slice(map.width),row+1,layer,map,tilesets);
            existingRows.unshift(tiles);
            return existingRows;

        } else {

            var rows = [];
            return rows;

        }

    };

    /**
    * gives you a tilespecification based on the gid
    * @param gid the specific tileid used as query
    * @param tilesets all the tilesets to search through
    * @return a object with the tileset used and the x and y posistions insside that tileset
    **/
    function retriveTileSpecification(gid,tilesets) {

        var tileset = getTileSetByUid(gid,tilesets);


        if(tileset === undefined)
            return undefined;


        var rebasedgid = gid - tileset.firstgid;

        var numberOfTilesInARow = tileset.imagewidth/tileset.tilewidth;
        return {
            "tileset": tileset,
            "x":getXPos(rebasedgid,numberOfTilesInARow,tileset.tilewidth),
            "y":getYPos(rebasedgid,numberOfTilesInARow,tileset.tileheight,0)
        };
    };
    /**
    *
    * gives the Y cordinate for the given gid.
    *
    * @param gid
    * @param numberOfTilesInARow the layers rowLenght in tiles
    * @param tileheight the height of the tiles
    * @param rowsCollected start index
    * @return y cordinate
    **/
    function getYPos(gid,numberOfTilesInARow,tileheight,rowsCollected) {

        if(gid < numberOfTilesInARow)
            return rowsCollected * tileheight;
         else
            return getYPos(gid - numberOfTilesInARow, numberOfTilesInARow,tileheight,rowsCollected+1);

    };
    /**
    * Gives the X position for a gid
    * @param gid the gid that we want to know the x position
    * @param numberOfTilesInARow the row size in the layer
    * @param the tilewidth for the tiles in the map
    **/
    function getXPos(gid,numberOfTilesInARow,tilewidth) {

          var totalLength = numberOfTilesInARow * tilewidth;
          var gidLength = gid * tilewidth;
          var rem = gidLength % totalLength;
          return rem;
    };

    /**
    * creates a rectangle ( tile )
    * draws the image described by the tileSpecification
    * @return void
    **/
    function placeTile(tileSpecification, isometricPoint) {

        var crop = new createjs.Bitmap(tileSpecification.tileset.image);
      // [x=0]  [y=0]  [width=0]  [height=0]
        crop.sourceRect = new createjs.Rectangle(
        tileSpecification.x,
        tileSpecification.y,
        tileSpecification.tileset.tilewidth,
        tileSpecification.tileset.tileheight);
        session.getMapContainer().addChild(crop);
        crop.y = isometricPoint.y;
        crop.x = isometricPoint.x;
        return {
            "tileSpecification":tileSpecification,
            "displayElement": crop
        }

        crop.cache(0,0,64, 128);


    };
    return IsometricMap;
});
