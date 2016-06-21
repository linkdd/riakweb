define([
    'jquery',
    'ko',
    'text!templates/addr-config.html'
], function($, ko, AddrConfigTemplate) {
    var AddrConfigViewModel = function(app) {
        var self = this;

        self.app = app;
        self.riak_addr = self.app.riak_addr;
    };

    return {
        name: 'addr-config',
        cls: function(app) {
            this.template = AddrConfigTemplate;
            this.viewModel = function() {
                return new AddrConfigViewModel(app);
            };
        }
    };
});
