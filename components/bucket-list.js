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
        self.dirty = ko.observable(true);

        ko.computed(function() {
            var dirty = self.dirty();

            var p = new Promise(function(resolve, reject) {
                var list = self.app.riak_addr() + '/types/' + self.bucket_type() + '/buckets?buckets=true';

                $.getJSON(list).then(function(data) {
                    var promises = [];

                    $.each(data.buckets, function(idx, bucketname) {
                        var bucket = self.app.riak_addr() + '/types/' + self.bucket_type() + '/buckets/' + bucketname + '/props';

                        promises.push($.getJSON(bucket));
                    });

                    $.when.apply($, promises).then(function() {
                        var buckets = [],
                            responses = arguments;

                        if(responses.length === 3 && !$.isArray(responses[2])) {
                            responses = [responses];
                        }

                        $.each(responses, function(idx, response) {
                            var data = response[0].props;

                            data.show_keys = ko.observable(false);
                            data.bucket_type = self.bucket_type();
                            data.editBucket = function() {
                                self.editBucket(data);
                            };

                            buckets.push(data);
                        });

                        resolve(buckets);
                    }, reject);
                }, reject);
            });

            p.then(function(buckets) {
                self.buckets(buckets);

                if(dirty) {
                    self.dirty(false);
                }
            });
        }, self);

        self.editedbucket = {
            name: ko.observable('default'),
            n_val: ko.observable(3),
            allow_mult: ko.observable(false),
            last_write_wins: ko.observable(false),
            r: ko.observable('quorum'),
            w: ko.observable('quorum'),
            dw: ko.observable('quorum'),
            rw: ko.observable('quorum')
        };

        self.newkey = {
            bucket: ko.observable('default'),
            key: ko.observable(''),
            value: ko.observable('')
        };
    };

    BucketListViewModel.prototype.setData = function(registry, bucket) {
        $.each(bucket, function(key, val) {
            if(registry[key] !== undefined) {
                registry[key](val);
            }
        });
    };

    BucketListViewModel.prototype.getData = function(registry) {
        var bucket = {};

        $.each(registry, function(key, observable) {
            bucket[key] = observable();
        });

        return bucket;
    };

    BucketListViewModel.prototype.saveEditedBucket = function() {
        var self = this;

        var bucket = self.getData(self.editedbucket);
        var url = self.app.riak_addr() + '/types/' + self.bucket_type() + '/buckets/' + bucket.name + '/props';

        delete bucket.name;

        $.ajax({
            url: url,
            method: 'PUT',
            data: JSON.stringify({
                props: bucket
            }),
            contentType: 'application/json'
        }).then(function() {
            $('#edited-bucket').closeModal();

            self.dirty(true);
        });
    };

    BucketListViewModel.prototype.editBucket = function(bucket) {
        this.setData(this.editedbucket, bucket);

        $('#edited-bucket').openModal();
    };

    BucketListViewModel.prototype.newKey = function() {
        $('#new-key').openModal();
    };

    BucketListViewModel.prototype.saveKey = function() {
        var self = this;

        var key = self.getData(self.newkey);

        var url = self.app.riak_addr() + '/types/' + self.bucket_type() + '/buckets/' + key.bucket + '/keys',
            method = 'POST';

        if(key.key !== '') {
            url = url + '/' + key.key;
            method = 'PUT';
        }

        $.ajax({
            url: url,
            method: method,
            data: key.value,
            contentType: 'application/json'
        }).then(function() {
            self.setData(self.newkey, {
                bucket: 'default',
                key: '',
                value: ''
            });

            $('#new-key').closeModal();

            self.dirty(true);
        });
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
