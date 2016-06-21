require.config({
    paths: {
        jquery: 'bower_components/jquery/dist/jquery.min',
        ko: 'bower_components/knockout/dist/knockout',
        sammy: 'bower_components/sammy/lib/sammy',
        materialize: 'bower_components/Materialize/dist/js/materialize.min',
        text: 'bower_components/text/text'
    },
    map: {
        '*': {
            'css': 'bower_components/require-css/css.min'
        }
    },
    shim: {
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
                'css!bower_components/Materialize/dist/css/materialize.min.css'
            ]
        }
    }
});

require(['materialize', 'app'], function(_, App) {
    window.App = App;
    App.init();
});
