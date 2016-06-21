define([
    'jquery',
    'ko',
    'text!templates/item-list.html'
], function($, ko, ItemListTemplate) {
    var ItemListViewModel = function(app, params) {
        var self = this;

        self.app = app;

        self.bucket_type = ko.observable(params.bucket_type || 'default');
        self.bucket = ko.observable(params.bucket || 'default');
        self.keys = ko.observableArray([]);

        ko.computed(function() {
            var keys = self.app.riak_addr() + '/types/' + self.bucket_type() + '/buckets/' + self.bucket() + '/keys?keys=true';

            $.getJSON(keys).then(function(data) {
                self.keys(data.keys);
            });
        }, self);

        self.itemPerPage = ko.observable(5);
        self.paginated = ko.computed(function() {
            var parts = [],
                keys = self.keys();

            for(var i = 0, l = keys.length; i < l; i += self.itemPerPage()) {
                parts.push(keys.slice(i, i + self.itemPerPage()));
            }

            return parts;
        });
        self.pages = ko.computed(function() {
            return self.paginated().length;
        });
        self.currentPage = ko.observable(0);
        self.currentPageItems = ko.computed(function() {
            return self.paginated()[self.currentPage()];
        });
    };

    return {
        name: 'item-list',
        cls: function(app) {
            this.template = ItemListTemplate;
            this.viewModel = function(params) {
                return new ItemListViewModel(app, params);
            };
        }
    };
});
