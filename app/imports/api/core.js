import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http'

const BLOCKCHAIN_API = 'http://dexapi.westeurope.cloudapp.azure.com:8080';

export const Accounts = new Mongo.Collection('accounts');

export const Apps = new Mongo.Collection('apps');

// user stuff

export const UserAskOrders = new Mongo.Collection('userAskOrders');
export const UserBidOrders = new Mongo.Collection('userBidOrders');

// -> need this when smartMeter settle is called
export const UserAskSettleVolume = new Mongo.Collection('userAskSettleVolume');
export const UserBidSettleVolume = new Mongo.Collection('userBidSettleVolume');

// blockchain stuff

export const AllAskOrders = new Mongo.Collection('askOrders');
export const AllBidOrders = new Mongo.Collection('bidOrders');
export const AllAskReserveOrders = new Mongo.Collection('askReserveOrders');
export const AllBidReserveOrders = new Mongo.Collection('bidReserveOrders');
export const AllMatchingPrices = new Mongo.Collection('matchingPrices');

Meteor.methods({
  'balance'(_id) {
    if (Meteor.isServer) {
      check(_id, String);

      console.log('Get balance'); 

      var account = Accounts.findOne({ _id: _id });
      if (!account) {
        console.log('no account found for id  + _id')
        throw new Meteor.Error('no account found for id ' + _id)
      }

      try {
        var result = HTTP.call('GET', BLOCKCHAIN_API + '/info/balance?userAddress=' + account.account, { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }});
        if (!result) {
          throw new Meteor.Error('unable to fetch balance')
        }
        var data = JSON.parse(result.content);
        if (data.balance === undefined) {
          throw new Meteor.Error('unable to fetch balance')
        }
        Accounts.update({ _id: _id }, {$set: { balance : data.balance }});
        return data.balance;
      } catch (e) {
        console.log(e);
        throw new Meteor.Error(e.message);
      }
    }
  },
  'submitBid'(_id, volume, price) {
    if (Meteor.isServer) {
      check(_id, String);
      check(volume, Number);
      check(price, Number);

      console.log('Submit Bid to blockchain: volume: ' + volume + ' price: ' + price); 

      var account = Accounts.findOne({ _id: _id });
      if (!account) {
        console.log('no account found for id  + _id')
        throw new Meteor.Error('no account found for id '  + _id)
      }

      var period = null;

      try {
        var result = HTTP.call('GET', BLOCKCHAIN_API + '/info/state', { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }});
        if (!result) {
          throw new Meteor.Error('unable to fetch state info')
        }
        var data = JSON.parse(result.content);
        if (data.state !== 0) {
          throw new Meteor.Error('You can only submit orders in state 0. We are currently in state 1. Try again in a few seconds...')
        }
        if (data.period === undefined) {
          throw new Meteor.Error('unable to fetch period')
        }
        period = data.period;
      } catch (e) {
        console.log(e);
        throw new Meteor.Error(e.message);
      }

      try {
        var result = HTTP.call('POST', BLOCKCHAIN_API + '/trade/submitBidOrder', { data: { accountAddress: account.account, password: account.password, price: price, volume: volume }, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }});
        if (!result) {
          throw new Meteor.Error('unable submit bid order')
        }
        if (!result || result.statusCode !== 200) {
          throw new Meteor.Error('unable submit bid order')
        }        
        UserBidOrders.insert({ account: _id, price: price, volume: volume, period: period });
        return true;
      } catch (e) {
        console.log(e);
        throw new Meteor.Error(e.message);
      }
    }
  },
  'submitAsk'(_id, volume, price) {
    if (Meteor.isServer) {
      check(_id, String);
      check(volume, Number);
      check(price, Number);

      console.log('Submit Ask to blockchain: volume: ' + volume + ' price: ' + price); 

      var account = Accounts.findOne({ _id: _id });
      if (!account) {
        console.log('no account found for id  + _id')
        throw new Meteor.Error('no account found for id ' + _id)
      }

      var period = null;

      try {
        var result = HTTP.call('GET', BLOCKCHAIN_API + '/info/state', { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }});
        if (!result) {
          throw new Meteor.Error('unable to fetch state info')
        }
        var data = JSON.parse(result.content);
        if (data.state !== 0) {
          throw new Meteor.Error('You can only submit orders in state 0. We are currently in state 1. Try again in a few seconds...')
        }
        if (data.period === undefined) {
          throw new Meteor.Error('unable to fetch period')
        }
        period = data.period;
      } catch (e) {
        console.log(e);
        throw new Meteor.Error(e.message)
      }

      try {
        var result = HTTP.call('POST', BLOCKCHAIN_API + '/trade/submitAskOrder', { data: { accountAddress: account.account, password: account.password, price: price, volume: volume }, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }});
        console.log(1)
        console.log(result)
        if (!result) {
          throw new Meteor.Error('unable submit ask order')
        }
        if (!result || result.statusCode !== 200) {
          throw new Meteor.Error('unable submit bid order')
        }     
        UserAskOrders.insert({ account: _id, price: price, volume: volume, period: period });
        return true;
      } catch (e) {
        console.log(e);
        throw new Meteor.Error(e.message);
      }
    }
  },
  'register'(password) {
    if (Meteor.isServer) {
      check(password, String);

      console.log('Register: password: ' + password); 

      try {
        var result = HTTP.call('POST', BLOCKCHAIN_API + '/authority/register', { data: { password: password, type: 'consumer' }, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }});
        var data = JSON.parse(result.content);
        var _id = Accounts.insert({ account: data.userAddress, password: password });
        console.log(_id);
        return _id;
      } catch (e) {
        console.log(e);
        throw new Meteor.Error(e.message);
      }
    }
  }
});
