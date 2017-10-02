import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { IonContent, IonButton, IonList, IonItem, IonLabel, IonInput, IonItemCheckBox, IonItemRadio, IonSelect, IonIcon, IonItemToggle, IonRange, IonSpinner } from 'reactionic';

import { Accounts } from '../../../imports/api/core.js';

// App component - represents the whole app
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: 'Password',
      loading: false
    };
  }

  render() {
    var self = this;
    var ionUpdatePopup = this.context.ionUpdatePopup;
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
        <IonList>

          <IonItem divider>Password</IonItem>
          <div className="item">
            <input
                type="text"
                value={this.state.password}
                onChange={(v) => {
                  this.setState({
                    password: v.currentTarget.value
                  });
                }}
            />
          </div>

          <div style={{'textAlign': 'center'}}>
            <IonButton size="large" onClick={(event) => {
                event.preventDefault();
                if (this.state.password !== undefined) {
                  self.setState({
                    loading: true
                  })
                  Meteor.call('register', this.state.password, function(error, result) {
                    if (result) {
                      Accounts.update({_id : result},{$set: { loggedIn : true }}, function(error, rows) {
                        if (rows === 1) {
                            var account = Accounts.findOne({ _id : result, loggedIn : true });
                            if (account) {
                              ionUpdatePopup({
                                popupType: 'alert',
                                title: 'Register Success',
                                template: 'Your Account Id: ' + account.account,
                                okText: 'Got It.',
                                onOk: function() {
                                  self.setState({
                                    loading: false
                                  })
                                  browserHistory.push('/tabs/one');
                                }
                              })
                            } else {
                              ionUpdatePopup({
                                popupType: 'alert',
                                title: 'Register Error',
                                template: 'Unable to register your account!',
                                okText: 'Got It.',
                                onOk: function() {
                                  self.setState({
                                    loading: false
                                  })
                                  browserHistory.push('/tabs/one');
                                }
                              })
                            }
                        } else {
                          ionUpdatePopup({
                            popupType: 'alert',
                            title: 'Register Error',
                            template: 'Unable to register your account!',
                            okText: 'Got It.',
                            onOk: function() {
                              self.setState({
                                loading: false
                              })
                              browserHistory.push('/tabs/one');
                            }
                          })
                        }
                      });
                    } else {
                      ionUpdatePopup({
                        popupType: 'alert',
                        title: 'Register Error',
                        template: error.error,
                        okText: 'Got It.',
                        onOk: function() {
                          self.setState({
                            loading: false
                          })
                          browserHistory.push('/tabs/one');
                        }
                      })                    
                    }
                  });  
                }           
              }}>Register</IonButton>
          </div>
        </IonList>)}
        
      </IonContent>
    );
  }
}

Register.contextTypes = {
  ionUpdatePopup: React.PropTypes.func
};

Register.propTypes = {
  ionSetTransitionDirection: React.PropTypes.func
};

export default createContainer(() => {
  Meteor.subscribe('accounts');

  return {
    ionSetTransitionDirection: null
  };
}, Register);
