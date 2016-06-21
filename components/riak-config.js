define([
    'jquery',
    'ko',
    'text!templates/riak-config.html'
], function($, ko, RiakConfigTemplate) {
    var RiakConfigViewModel = function(app) {
        var self = this;

        self.app = app;
        self.riak_addr = self.app.riak_addr;
    };

    return {
        name: 'riak-config',
        cls: function(app) {
            this.template = RiakConfigTemplate;
            this.viewModel = function() {
                return new RiakConfigViewModel(app);
            };
        }
    };
});
