define(['jquery', 'ko', 'components'], function($, ko, components) {
    var App = function() {
        this.riak_addr = ko.observable('');
    };

    App.prototype.init = function() {
        var self = this;

        $.each(components, function(idx, comp) {
            ko.components.register(comp.name, new comp.cls(self));
        });

        ko.applyBindings();
    };

    return new App();
});
