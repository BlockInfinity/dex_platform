import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { IonContent, IonButton, IonList, IonItem, IonLabel, IonInput, IonItemCheckBox, IonItemRadio, IonSelect, IonIcon, IonItemToggle, IonRange, IonSpinner } from 'reactionic';

import { Accounts } from '../../../imports/api/core.js';

// App component - represents the whole app
class ManualBids extends Component {
  constructor(props) {
    super(props);
    this.state = {
      askVolume : 1,
      askPrice: 1,
      bidVolume: 1,
      bidPrice: 1,
      loading: false
    };
    if (!props.account) {
      browserHistory.push('/login');
    }
  }

  render() {
    var ionUpdatePopup = this.context.ionUpdatePopup;
    var self = this;
    return (
      <IonContent customClasses=""
                  {...this.props}>

        {this.state.loading && (
          <div style={{'textAlign': 'center'}}>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <IonSpinner icon="lines" />
          </div>
        )}

        {!this.state.loading && (     
          <div>
        <IonList>
          <IonItem divider>Bid Order Volume</IonItem>
          <div className="item">
            <input
                type="number"
                value={this.state.bidVolume}
                onChange={(v) => {
                  this.setState({
                    bidVolume: parseInt(v.currentTarget.value)
                  });
                }}
            />
          </div>

          <IonItem divider>Bid Order Price</IonItem>
          <div className="item">
            <input
                type="number"
                value={this.state.bidPrice}
                onChange={(v) => {
                  this.setState({
                    bidPrice: parseInt(v.currentTarget.value)
                  });
                }}
            />
          </div>

          <div style={{'textAlign': 'center'}}>
            <IonButton size="large" onClick={(event) => {
                event.preventDefault();
                if (this.props.account && this.state.bidVolume !== undefined && this.state.bidPrice !== undefined) {
                  self.setState({
                    loading: true
                  })
                  Meteor.call('submitBid', this.props.account._id, this.state.bidVolume, this.state.bidPrice, function(error, result) {
                    if (result) {
                      console.log(result)
                      ionUpdatePopup({
                        popupType: 'alert',
                        title: 'Submit Bid Order',
                        template: 'Submit Bid Order was successful',
                        okText: 'Ok.',
                        onOk: function() {
                          self.setState({
                            askVolume: 1,
                            askPrice: 1,
                            loading: false
                          });
                        }
                      })
                    } else {
                      console.log(error)
                      ionUpdatePopup({
                        popupType: 'alert',
                        title: 'Submit Bid Order',
                        template: error.error,
                        okText: 'Try again.',
                        onOk: function() {
                          self.setState({
                            loading: false
                          });  
                        }
                      })
                    }
                  });
                }           
              }}>Submit Bid Order</IonButton>
          </div>
        </IonList>

        <br/><br/>

        <IonList>
          <IonItem divider>Ask Order Volume</IonItem>
          <div className="item">
            <input
                type="number"
                value={this.state.askVolume}
                onChange={(v) => {
                  this.setState({
                    askVolume: parseInt(v.currentTarget.value)
                  });
                }}
            />
          </div>

          <IonItem divider>Ask Order Price</IonItem>
          <div className="item">
            <input
                type="number"
                value={this.state.askPrice}
                onChange={(v) => {
                  this.setState({
                    askPrice: parseInt(v.currentTarget.value)
                  });
                }}
            />
          </div>

          <div style={{'textAlign': 'center'}}>
            <IonButton size="large" onClick={(event) => {
                event.preventDefault();
                if (this.props.account && this.state.askVolume !== undefined && this.state.askPrice !== undefined) {
                  Meteor.call('submitAsk', this.props.account._id, this.state.askVolume, this.state.askPrice, function(error, result) {
                    if (result) {
                      ionUpdatePopup({
                        popupType: 'alert',
                        title: 'Submit Ask Order',
                        template: 'Submit Ask Order was successful',
                        okText: 'Ok.',
                        onOk: function() {
                          self.setState({
                            askVolume: 1,
                            askPrice: 1,
                            loading: false
                          });
                        }
                      })
                    } else {
                      ionUpdatePopup({
                        popupType: 'alert',
                        title: 'Submit Ask Order',
                        template: error.error,
                        okText: 'Try again.',
                        onOk: function() {
                          self.setState({
                            loading: false
                          })
                        }
                      })
                    }
                  });
                }           
              }}>Submit Ask Order</IonButton>
          </div>

        </IonList></div>)}

      </IonContent>
    );
  }
}

ManualBids.contextTypes = {
  ionUpdatePopup: React.PropTypes.func
};

ManualBids.propTypes = {
  ionSetTransitionDirection: React.PropTypes.func,
  account: PropTypes.object.isRequired
};

export default createContainer(() => {
  Meteor.subscribe('accounts');

  return {
    ionSetTransitionDirection: null,
    account: Accounts.findOne({ loggedIn : true })
  };
}, ManualBids);
