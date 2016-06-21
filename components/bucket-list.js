define([
    'jquery',
    'ko',
    'text!templates/bucket-list.html'
], function($, ko, BucketListTemplate) {
    var BucketListViewModel = function(app) {
        var self = this;

        self.app = app;

        self.bucket_type = ko.observable('default');
        self.buckets = ko.observableArray([]);

        ko.computed(function() {
            var p = new Promise(function(resolve, reject) {
                var list = self.app.riak_addr() + '/types/' + self.bucket_type() + '/buckets?buckets=true';

                $.getJSON(list).then(function(data) {
                    var promises = [];

                    $.each(data.buckets, function(idx, bucketname) {
                        var bucket = self.app.riak_addr() + '/types/' + self.bucket_type() + '/buckets/' + bucketname + '/props';

                        promises.push($.getJSON(bucket));
                    });

                    $.when.apply($, promises).then(function() {
                        var buckets = [];

                        $.each(arguments, function(idx, response) {
                            var data = response[0].props;
                            data.show_keys = ko.observable(false);
                            data.bucket_type = self.bucket_type();
                            buckets.push(data);
                        });

                        resolve(buckets);
                    }, reject);
                }, reject);
            });

            p.then(function(buckets) {
                self.buckets(buckets);
            });
        }, self);
    };

    return {
        name: 'bucket-list',
        cls: function(app) {
            this.template = BucketListTemplate;
            this.viewModel = function() {
                return new BucketListViewModel(app);
            };
        }
    };
});
