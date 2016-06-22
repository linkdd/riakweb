require.config({
    paths: {
        jquery: 'bower_components/jquery/dist/jquery.min',
        ko: 'bower_components/knockout/dist/knockout',
        sammy: 'bower_components/sammy/lib/sammy',
        hammerjs: 'bower_components/Materialize/js/hammer.min',
        materialize: 'bower_components/Materialize/dist/js/materialize.min',
        text: 'bower_components/text/text'
    },
    map: {
        '*': {
            'css': 'bower_components/require-css/css.min'
        }
    },
    shim: {
        jquery: {
            exports: '$'
        },
        ko: {
            exports: 'ko'
        },
        sammy: {
            deps: [
                'jquery'
            ],
            exports: 'Sammy'
        },
        materialize: {
            deps: [
                'jquery',
                'hammerjs',
                'css!bower_components/Materialize/dist/css/materialize.min.css',
                'css!stylesheets/material-icons.css',
                'css!bower_components/font-awesome/css/font-awesome.min.css'
            ]
        }
    }
});

require(['materialize', 'app'], function(_, App) {
    window.App = App;
    App.init();
});
