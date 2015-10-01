import translateResource from './translate';

var resources = angular.module('pi.resources', ['ngResource']);
resources.service('translateResource', translateResource);

export default resources;
