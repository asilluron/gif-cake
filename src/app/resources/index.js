var translateResource = require('./translate');

var resources = angular.module('pi.resources', ['ngResource']);
resources.service('translateResource', translateResource);

module.exports = resources;
