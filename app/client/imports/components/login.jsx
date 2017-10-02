import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { IonContent, IonButton, IonList, IonItem, IonLabel, IonInput, IonItemCheckBox, IonItemRadio, IonSelect, IonIcon, IonItemToggle, IonRange } from 'reactionic';

import { Accounts } from '../../../imports/api/core.js';

// App component - represents the whole app
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: 'Account id',
      password: 'Password'
    };
  }

  render() {
    var ionUpdatePopup = this.context.ionUpdatePopup;
    return (
      <IonContent customClasses=""
                  {...this.props}>
        <IonList>
          <IonItem divider>Account ID</IonItem>
          <div className="item">
            <input
                type="text"
                value={this.state.account}
                onChange={(v) => {
                  this.setState({
                    account: v.currentTarget.value
                  });
                }}
            />
          </div>

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
          
          <br/><br/>
          
          <div style={{'textAlign': 'center'}}>
            <IonButton size="large" onClick={(event) => {
                event.preventDefault();
                if (this.state.account !== undefined && this.state.password !== undefined) {
                  var account = Accounts.findOne({ account: this.state.account, password: this.state.password });
                  if (account) {
                    Accounts.update({_id : account._id},{$set: {loggnedIn : true}});
                    browserHistory.push('/tabs/one');
                  } else {
                    ionUpdatePopup({
                      popupType: 'alert',
                      title: 'Login Error',
                      template: 'Your account id and/or password is not correct!',
                      okText: 'Let me try again!',
                      onOk: function() {}
                    })
                  }
                }           
              }}>Login</IonButton>
          </div>

          <br/><br/>

          <div style={{'textAlign': 'center'}}>
            <IonButton size="large" onClick={(event) => {
                event.preventDefault();
                browserHistory.push('/register');
              }}>Register</IonButton>
          </div>
        </IonList>

      </IonContent>
    );
  }
}

Login.contextTypes = {
  ionUpdatePopup: React.PropTypes.func
};

Login.propTypes = {
  ionSetTransitionDirection: React.PropTypes.func
};

export default createContainer(() => {
  Meteor.subscribe('accounts');

  return {
    ionSetTransitionDirection: null
  };
}, Login);
