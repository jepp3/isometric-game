define(["utils/MapHandler","utils/Session","utils/Printable"],function(MapHandler,session,Printable) {



    function Cursor(options) {
        this.options = options;

        this.selectedArea = undefined;
        addEventListnersForMouseEvents.call(this);
    };

    var p = Cursor.prototype;

    p.destroy = function() {

        console.log("remove event handlers and so on!");

    };

    /**
    *
    * if currently selecting a area, redraw that area.
    **/
    function pressup() {

        if(this.selectedArea) {
          var selectedAreaBounds =  this.selectedArea.getBounds();
          this.selectedAreaGlobalCordinates = {
            "x":this.selectedArea.x ,
            "y":this.selectedArea.y,
            "width":selectedAreaBounds.width,
            "height":selectedAreaBounds.height
          };

          session.getStage().localToGlobal(selectedAreaBounds.x, selectedAreaBounds.y,this.selectedAreaGlobalCordinates);

      //      this.selectedArea.localToGlobal(selectedAreaBounds.x - 32, selectedAreaBounds.y - 96,this.selectedAreaGlobalCordinates);

          this.options.onSelect(this.selectedAreaGlobalCordinates);


          session.getStage().removeChild(this.selectedArea); // we need to remove the selected area every time we intend to redraw it

          // clean up to next time
          this.selectedArea = undefined;
          this.selectedAreaGlobalCordinates = undefined;
          session.updateOfCanvasNeeded();

        }
  };

  p.checkIntersection = function(outsideRect) {

    return checkIntersection(this.selectedAreaGlobalCordinates,outsideRect)

  };
  /**
  * this method does not work as intended, its poor and bad!
  **/
  function checkIntersection (rect1,rect2) {

      if ( rect1.x >= rect2.x + rect2.width || rect1.x + rect1.width <= rect2.x || rect1.y >= rect2.y + rect2.height || rect1.y + rect1.height <= rect2.y ) return false;
      return true;

  };

  function pressmove(ev) {

    if(this.selectedArea === undefined) {

        this.pressmove = session.getStage().globalToLocal(ev.stageX,ev.stageY);
        this.selectedArea = createSelectArea();
        MapHandler.copyCordinates(this.pressmove,this.selectedArea);
        session.getStage().addChild(this.selectedArea);

    }

    var currentMousePosition = session.getStage().globalToLocal(ev.stageX,ev.stageY);
    this.selectedArea.graphics.clear().beginFill("#000").drawRect(0,0,  currentMousePosition.x - this.pressmove.x,currentMousePosition.y - this.pressmove.y);

    this.selectedArea.setBounds(this.pressmove.x,this.pressmove.y,  currentMousePosition.x - this.pressmove.x,currentMousePosition.y - this.pressmove.y);
    session.updateOfCanvasNeeded();
  };

  function createSelectArea()  {

      var selectedArea = new createjs.Shape();
      selectedArea.graphics.clear().beginFill("#000").drawRect(0,0, 0, 0);
      selectedArea.alpha = 0.4;
      return selectedArea;
  };

  function addEventListnersForMouseEvents() {

    session.getStage().on("pressmove",pressmove.bind(this));
    session.getStage().on("pressup",pressup.bind(this));

  };
  return Cursor;

});
