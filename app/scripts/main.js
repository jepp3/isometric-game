require.config({
    paths: {
        easel:"../bower_components/EaselJS/lib/easeljs-0.8.2.min",
        jquery: '../bower_components/jquery/jquery',
        text : '../bower_components/requirejs-plugins/lib/text', //text is required
        json : '../bower_components/requirejs-plugins/src/json', //alias to plugin
        bootstrapAffix: '../bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap/affix',
        bootstrapAlert: '../bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap/alert',
        bootstrapButton: '../bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap/button',
        bootstrapCarousel: '../bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap/carousel',
        bootstrapCollapse: '../bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap/collapse',
        bootstrapDropdown: '../bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap/dropdown',
        bootstrapModal: '../bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap/modal',
        bootstrapPopover: '../bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap/popover',
        bootstrapScrollspy: '../bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap/scrollspy',
        bootstrapTab: '../bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap/tab',
        bootstrapTooltip: '../bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap/tooltip',
        bootstrapTransition: '../bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap/transition'
},
    shim: {
        bootstrapAffix: {
            deps: ['jquery']
        },
        easel: {
            exports: 'createjs'
        },
        bootstrapAlert: {
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapButton: {
            deps: ['jquery']
        },
        bootstrapCarousel: {
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapCollapse: {
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapDropdown: {
            deps: ['jquery']
        },
        bootstrapModal:{
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapPopover: {
            deps: ['jquery', 'bootstrapTooltip']
        },
        bootstrapScrollspy: {
            deps: ['jquery']
        },
        bootstrapTab: {
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapTooltip: {
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapTransition: {
            deps: ['jquery']
        }
    }
});

require(['game', 'jquery'], function (Game, $) {
    'use strict';
    // use app here
    var game = new Game();
    console.log(game);

    game.init();
    console.log('Running jQuery %s', $().jquery);
});
