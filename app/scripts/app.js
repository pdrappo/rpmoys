'use strict';

/**
 * @ngdoc overview
 * @name sgaApp
 * @description
 * # sgaApp
 *
 * Main module of the application.
 */
 var app =
angular
  .module('sgaApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngRoute',
    'ui-notification'
  ]).constant('myConfig',{api:"http://localhost:8000/"});
