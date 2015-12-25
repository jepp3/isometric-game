define([],function() {

    Session = function() {


    };

    /**
    * Sets the stage for the application
    */
    Session.prototype.setStage = function(stage) {

        this.stage = stage;
    };

    Session.prototype.getStage = function() {

        return this.stage;
    };

    // make it a singleton
    
    return new Session();

});
