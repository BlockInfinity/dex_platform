import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

const Fiber = require('fibers');

import { 
  Accounts,
  Apps,
  UserAskOrders, 
  UserBidOrders, 
  UserAskSettleVolume, 
  UserBidSettleVolume, 
  AllAskOrders, 
  AllBidOrders, 
  AllAskReserveOrders, 
  AllBidReserveOrders, 
  AllMatchingPrices
} from '../imports/api/core.js';

// import app specific code

import '../imports/api/simpleBot.js';

// helper
getRandomArbitrary = function(min, max) {
    return Math.random() * (max - min) + min;
}

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('accounts', function accountsPublication() {
    return Accounts.find({});
  });
  Meteor.publish('apps', function appsPublication() {
    return Apps.find({});
  });
  Meteor.publish('userAskOrders', function userAskOrdersPublication() {
    return UserAskOrders.find({}, {sort: {period: -1}, limit: 1000});
  });
  Meteor.publish('userBidOrders', function userBidOrdersPublication() {
    return UserBidOrders.find({}, {sort: {period: -1}, limit: 1000});
  });
  Meteor.publish('userAskSettleVolume', function userAskSettleVolumePublication() {
    return UserAskSettleVolume.find({}, {sort: {period: -1}, limit: 1000});
  });
  Meteor.publish('userBidSettleVolume', function userBidSettleVolumePublication() {
    return UserBidSettleVolume.find({}, {sort: {period: -1}, limit: 1000});
  });
  Meteor.publish('allAskOrders', function allAskOrdersPublication() {
    return AllAskOrders.find({}, {sort: {period: -1}, limit: 1000});
  });
  Meteor.publish('allBidOrders', function allBidOrdersPublication() {
    return AllBidOrders.find({}, {sort: {period: -1}, limit: 1000});
  });
  Meteor.publish('allAskReserveOrders', function allAskReserveOrdersPublication() {
    return AllAskReserveOrders.find({}, {sort: {period: -1}, limit: 1000});
  });
  Meteor.publish('allBidReserveOrders', function allBidReserveOrdersPublication() {
    return AllBidReserveOrders.find({}, {sort: {period: -1}, limit: 1000});
  });
  Meteor.publish('allMatchingPrices', function allMatchingPricesPublication() {
    return AllMatchingPrices.find({}, {sort: {period: -1}, limit: 1000});
  });

  // some default inserts
  Accounts.remove({});
  Apps.remove({});
  UserAskOrders.remove({});
  UserBidOrders.remove({}); 
  UserAskSettleVolume.remove({});
  UserBidSettleVolume.remove({});
  AllAskOrders.remove({});
  AllBidOrders.remove({});
  AllAskReserveOrders.remove({}); 
  AllBidReserveOrders.remove({}); 
  AllMatchingPrices.remove({});

  Apps.insert({ name: 'orderBot', path:'/orderBot', headerTitle:'Order Bots', installed: false, bidOrderAuto: false, askOrderAuto: false });

  // query block energy api
  // askOrders
 //  period = 0;
 //  var interval = 5;

 //  bidOrderAutoInterval = setInterval(function(){ 
 //  	Fiber(function() { 
	// 	for (var i=0; i<50; i++) {
	// 		AllAskOrders.insert({ price: getRandomArbitrary(1, 100), volume: getRandomArbitrary(1, 100), period: period });
	// 		AllBidOrders.insert({ price: getRandomArbitrary(1, 100), volume: getRandomArbitrary(1, 100), period: period });
	// 		AllAskReserveOrders.insert({ price: getRandomArbitrary(1, 100), volume: getRandomArbitrary(1, 100), period: period });
	// 		AllBidReserveOrders.insert({ price: getRandomArbitrary(1, 100), volume: getRandomArbitrary(1, 100), period: period });
	// 	}
	// 	AllMatchingPrices.insert({ price: getRandomArbitrary(1, 100), period: period });
	// }).run();
	// period++;
 //  }, interval*1000);
}
