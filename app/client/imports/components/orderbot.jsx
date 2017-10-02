import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { IonContent, IonButton, IonList, IonItem, IonLabel, IonInput, IonItemCheckBox, IonItemRadio, IonSelect, IonIcon, IonItemToggle, IonRange } from 'reactionic';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import { 
  Apps,
  UserAskOrders, 
  UserBidOrders, 
  UserAskSettleVolume, 
  UserBidSettleVolume, 
  AllAskOrders, 
  AllBidOrders, 
  AllAskReserveOrders, 
  AllBidReserveOrders, 
  AllMatchingPrices,
  Accounts
} from '../../../imports/api/core.js';

// App component - represents the whole app
class OrderBot extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	bidVolumeMean: 50,
    	bidVolumeStd: 0,
      askVolumeMean: 50,
      askVolumeStd: 0,
      bidPriceMean: 50,
      bidPriceStd: 0,
      askPriceMean: 50,
      askPriceStd: 0,
      askInterval: 10,
      bidInterval: 10,
    	interval: null
    };
    if (!props.account) {
      browserHistory.push('/login');
    }
  }

  render() {
    let app = this.props.app[0];
    return (
      <IonContent customClasses=""
                  {...this.props}>
        <IonList>
          <IonItem divider>Bid Volume Mean</IonItem>
          <div className="item">
            <input
                type="number"
                value={this.state.bidVolumeMean}
                onChange={(v) => {
                  this.setState({
                    bidVolumeMean: parseInt(v.currentTarget.value)
                  });
                }}
            />
          </div>

          <IonItem divider>Bid Volume Std</IonItem>
          <div className="item">
            <input
                type="number"
                value={this.state.bidVolumeStd}
                onChange={(v) => {
                  this.setState({
                    bidVolumeStd: parseInt(v.currentTarget.value)
                  });
                }}
            />
          </div>

          <IonItem divider>Bid Price Mean</IonItem>
          <div className="item">
            <input
                type="number"
                value={this.state.bidPriceMean}
                onChange={(v) => {
                  this.setState({
                    bidPriceMean: parseInt(v.currentTarget.value)
                  });
                }}
            />
          </div>

          <IonItem divider>Bid Price Std</IonItem>
          <div className="item">
            <input
                type="number"
                value={this.state.bidPriceStd}
                onChange={(v) => {
                  this.setState({
                    bidPriceStd: parseInt(v.currentTarget.value)
                  });
                }}
            />
          </div>

          <IonItem divider>Bid Interval</IonItem>
          <div className="item">
            <input
                type="number"
                value={this.state.bidInterval}
                onChange={(v) => {
                  this.setState({
                    bidInterval: parseInt(v.currentTarget.value)
                  });
                }}
            />
          </div>

          <div style={{'textAlign': 'center'}}>
            { !app || (app && !app.bidOrderAuto) && (
              <IonButton size="large" onClick={(event) => {
                  event.preventDefault();
                  if (this.state.bidVolumeMean !== undefined && this.state.bidVolumeStd !== undefined && this.state.bidPriceMean !== undefined && this.state.bidPriceMean !== undefined && this.state.bidInterval !== undefined) {
                    Meteor.call('submitBidPriceAuto', this.state.bidVolumeMean, this.state.bidVolumeStd, this.state.bidPriceMean, this.state.bidPriceStd, this.state.bidInterval);
                    this.setState({
                      bidVolumeMean: 50,
                      bidVolumeStd: 0,
                      bidPriceMean: 50,
                      bidPriceStd: 0,
                      bidInterval: 10
                    });
                  }           
                }}>Start Bid Order Auto</IonButton>)
            }
            { app && app.bidOrderAuto && (
              <IonButton size="large" onClick={(event) => {
                event.preventDefault();
                Meteor.call('submitBidPriceAuto', 0, 0, 0, 0, 0);
                this.setState({
                    bidVolumeMean: 50,
                    bidVolumeStd: 0,
                    bidPriceMean: 50,
                    bidPriceStd: 0,
                    bidInterval: 10
                });
              }}>End Bid Order Auto</IonButton>)
            }
          </div>
        </IonList>

        <IonList>
          <IonItem divider>Ask Price Mean</IonItem>
          <div className="item">
            <input
                type="number"
                value={this.state.askPriceMean}
                onChange={(v) => {
                  this.setState({
                    askPriceMean: parseInt(v.currentTarget.value)
                  });
                }}
            />
          </div>

          <IonItem divider>Ask Price Std</IonItem>
          <div className="item">
            <input
                type="number"
                value={this.state.askPriceStd}
                onChange={(v) => {
                  this.setState({
                    askPriceStd: parseInt(v.currentTarget.value)
                  });
                }}
            />
          </div>

          <IonItem divider>Ask Volume Mean</IonItem>
          <div className="item">
            <input
                type="number"
                value={this.state.askVolumeMean}
                onChange={(v) => {
                  this.setState({
                    askVolumeMean: parseInt(v.currentTarget.value)
                  });
                }}
            />
          </div>

          <IonItem divider>Ask Volume Std</IonItem>
          <div className="item">
            <input
                type="number"
                value={this.state.askVolumeStd}
                onChange={(v) => {
                  this.setState({
                    askVolumeStd: parseInt(v.currentTarget.value)
                  });
                }}
            />
          </div>

          <IonItem divider>Ask Interval</IonItem>
          <div className="item">
            <input
                type="number"
                value={this.state.askInterval}
                onChange={(v) => {
                  this.setState({
                    askInterval: parseInt(v.currentTarget.value)
                  });
                }}
            />
          </div>

          <div style={{'textAlign': 'center'}}>
            { app && !app.askOrderAuto && (
              <IonButton size="large" onClick={(event) => {
                  event.preventDefault();
                  if (this.state.askPriceMean !== undefined && this.state.askPriceStd !== undefined && this.state.askVolumeMean !== undefined && this.state.askVolumeMean !== undefined && this.state.askInterval !== undefined) {
                    Meteor.call('submitAskOrderAuto', this.state.askPriceMean, this.state.askPriceStd, this.state.askVolumeMean, this.state.askVolumeStd, this.state.askInterval);
                    this.setState({
                      askVolumeMean: 50,
                      askVolumeStd: 0,
                      askPriceMean: 50,
                      askPriceStd: 0,
                      askInterval: 10
                    });
                  }           
                }}>Start Ask Order Auto</IonButton>)
            }
            { app && app.askOrderAuto && (
              <IonButton size="large" onClick={(event) => {
                  event.preventDefault();
                  if (this.state.askPriceMean !== undefined && this.state.askPriceStd !== undefined && this.state.askVolumeMean !== undefined && this.state.askVolumeMean !== undefined && this.state.askInterval !== undefined) {
                    Meteor.call('submitAskOrderAuto', 0, 0, 0, 0, 0);
                    this.setState({
                      askVolumeMean: 50,
                      askVolumeStd: 0,
                      askPriceMean: 50,
                      askPriceStd: 0,
                      askInterval: 10
                    });
                  }           
                }}>End Ask Order Auto</IonButton>)
            }
          </div>
        </IonList>

        <div className="text-center">
          <div className="padding"><IonButton size="large" onClick={(event) => {
          		event.preventDefault();
       			Apps.update({_id : this.props.app[0]._id},{$set: {installed : false}});
				browserHistory.push('/tabs/two');
       		}}>Uninstall</IonButton></div>
        </div>
      </IonContent>
    );
  }
}

OrderBot.propTypes = {
  ionSetTransitionDirection: React.PropTypes.func,
  app: PropTypes.array.isRequired,
  userAskOrders: PropTypes.array.isRequired,
  userBidOrders: PropTypes.array.isRequired,
  userAskSettleVolume: PropTypes.array.isRequired,
  userBidSettleVolume: PropTypes.array.isRequired,
  allAskOrders: PropTypes.array.isRequired,
  allBidOrders: PropTypes.array.isRequired,
  allAskReserveOrders: PropTypes.array.isRequired,
  allBidReserveOrders: PropTypes.array.isRequired,
  allMatchingPrices: PropTypes.array.isRequired,
  account: PropTypes.object.isRequired
};

export default createContainer(() => {
  Meteor.subscribe('apps');
  Meteor.subscribe('userAskOrders');
  Meteor.subscribe('userBidOrders');
  Meteor.subscribe('userAskSettleVolume');
  Meteor.subscribe('userBidSettleVolume');
  Meteor.subscribe('allAskOrders');
  Meteor.subscribe('allBidOrders');
  Meteor.subscribe('allAskReserveOrders');
  Meteor.subscribe('allBidReserveOrders');
  Meteor.subscribe('allMatchingPrices');
  Meteor.subscribe('accounts');

  return {
    ionSetTransitionDirection: null,
    app: Apps.find({ path: '/orderBot' }).fetch(),
    userAskOrders: UserAskOrders.find({}, {sort: {period: -1}, limit: 1000}).fetch(),
    userBidOrders: UserBidOrders.find({}, {sort: {period: -1}, limit: 1000}).fetch(),
    userAskSettleVolume: UserAskSettleVolume.find({}, {sort: {period: -1}, limit: 1000}).fetch(),
    userBidSettleVolume: UserBidSettleVolume.find({}, {sort: {period: -1}, limit: 1000}).fetch(),
    allAskOrders: AllAskOrders.find({}, {sort: {period: -1}, limit: 1000}).fetch(),
    allBidOrders: AllBidOrders.find({}, {sort: {period: -1}, limit: 1000}).fetch(),
    allAskReserveOrders: AllAskReserveOrders.find({}, {sort: {period: -1}, limit: 1000}).fetch(),
    allBidReserveOrders: AllBidReserveOrders.find({}, {sort: {period: -1}, limit: 1000}).fetch(),
    allMatchingPrices: AllMatchingPrices.find({}, {sort: {period: -1}, limit: 1000}).fetch(),
    account: Accounts.findOne({ loggedIn : true })
  };
}, OrderBot);