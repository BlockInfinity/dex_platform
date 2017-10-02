import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Apps } from './core.js';

const Fiber = require('fibers');

askOrderAutoInterval = null;
bidOrderAutoInterval = null;

function gaussian(mean, stdev) {
    var y2;
    var use_last = false;
    return function() {
        var y1;
        if(use_last) {
           y1 = y2;
           use_last = false;
        }
        else {
            var x1, x2, w;
            do {
                 x1 = 2.0 * Math.random() - 1.0;
                 x2 = 2.0 * Math.random() - 1.0;
                 w  = x1 * x1 + x2 * x2;               
            } while( w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w))/w);
            y1 = x1 * w;
            y2 = x2 * w;
            use_last = true;
       }

       var retval = mean + stdev * y1;
       if(retval > 0) 
           return retval;
       return -retval;
   }
}

Meteor.methods({
  'submitAskOrderAuto'(askVolumeMean, askVolumeStd, askPriceMean, askPriceStd, askInterval) {
    if (Meteor.isServer) {
      check(askVolumeMean, Number);
      check(askVolumeStd, Number);
      check(askPriceMean, Number);
      check(askPriceStd, Number);
      check(askInterval, Number);

      var askOrderAutoStatus = Apps.findOne({ name: 'orderBot' });
      if (askOrderAutoStatus.askOrderAuto) {
        console.log('askOrderAuto is active. terminating now...');
        if (askOrderAutoInterval)
          clearInterval(askOrderAutoInterval);
        Apps.update({ name: 'orderBot' }, { $set: {askOrderAuto : false}});
        console.log('askOrderAuto terminated.');
      
      } else {
        console.log('askOrderAuto starting now...');
        Apps.update({ name: 'orderBot' }, { $set: {askOrderAuto : true}});
        var askVolume = gaussian(askVolumeMean, askVolumeStd);
        var askPrice = gaussian(askPriceMean, askPriceStd);

        console.log('askOrderAuto started.');
        askOrderAutoInterval = setInterval(function(){ 
          Fiber(function() {
            Meteor.call('submitAsk', askVolume(), askPrice());
          }).run();
        }, askInterval*1000);
      } 
    }
  },
  'submitBidPriceAuto'(bidVolumeMean, bidVolumeStd, bidPriceMean, bidPriceStd, bidInterval) {
    if (Meteor.isServer) {
      check(bidVolumeMean, Number);
      check(bidVolumeStd, Number);
      check(bidPriceMean, Number);
      check(bidPriceStd, Number);
      check(bidInterval, Number);

      var bidOrderAutoStatus = Apps.findOne({ name: 'orderBot' });
      console.log(bidOrderAutoStatus);
      if (bidOrderAutoStatus.bidOrderAuto) {
        console.log('bidOrderAuto is active. terminating now...');
        if (bidOrderAutoInterval)
          clearInterval(bidOrderAutoInterval);
        Apps.update({ name: 'orderBot' }, { $set: {bidOrderAuto : false}});
        console.log('bidOrderAuto terminated.');
      
      } else {
        console.log('bidOrderAuto starting now...');
        Apps.update({ name: 'orderBot' }, { $set: {bidOrderAuto : true}});
        var bidVolume = gaussian(bidVolumeMean, bidVolumeStd);
        var bidPrice = gaussian(bidPriceMean, bidPriceStd);

        console.log('bidOrderAuto started.');
        bidOrderAutoInterval = setInterval(function(){ 
          Fiber(function() {
            Meteor.call('submitBid', bidVolume(), bidPrice());
          }).run();
        }, bidInterval*1000);
      } 
    }
  }
});
