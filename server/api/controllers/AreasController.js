/**
 * AreasController
 *
 * @description :: Server-side logic for managing areas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var async = require('async');

module.exports = {
    getCityData: function (req, res) {
        Areas.find({level: 1}).sort('sort ASC').exec(function (err, provinces) {
            async.forEach(provinces, function (province, callback) {
                Areas.find({level: 2, parentId: province.id}).sort('sort ASC').exec(function (err, cities) {
                    async.map(cities, function (city, callback) {
                        Areas.find({level: 3, parentId: city.id}).sort('sort ASC').exec(function (err, areas) {
                            city.sub = areas;
                            callback(null, city);
                        });
                    }, function (err, cities) {
                        province.sub = cities;
                        callback();
                    });
                });
            }, function (err) {
                res.ok(provinces);
            });
        });
    },
    getStreetData: function (req, res) {
        //if (req.body.cityCode) {
        //    Areas.find({level: 4, parentId: req.body.cityCode}).sort('sort ASC').exec(function (err, streets) {
        //        if (err) res.badRequest(err);
        //        res.ok(streets);
        //    });
        //}
        //else {
            Areas.find({level: 4}).sort('id ASC').exec(function (err, streets) {
                if (err) res.badRequest(err);
                res.ok(streets);
            });
        //}
    }
};

