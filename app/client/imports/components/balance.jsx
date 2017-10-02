import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { IonContent, IonButton, IonList, IonItem, IonLabel, IonInput, IonItemCheckBox, IonItemRadio, IonSelect, IonIcon, IonItemToggle, IonRange } from 'reactionic';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import { Accounts } from '../../../imports/api/core.js';

class Balance extends Component {
  constructor(props) {
    super(props);
    if (!props.account) {
      browserHistory.push('/login');
    }
  }
  componentDidMount() {
    Meteor.call('balance', this.props.account._id);
  }
  render() {
    return (
      <IonContent customClasses=""
                  {...this.props}>
        <br/><br/>
        <div style={{'textAlign': 'center', 'fontSize': 25}}>
          Balance<br/><br/>{this.props.account.balance}
        </div>
      </IonContent>
    );
  }
}

Balance.propTypes = {
  ionSetTransitionDirection: React.PropTypes.func,
  account: PropTypes.object.isRequired
};

export default createContainer(() => {
  Meteor.subscribe('accounts');

  return {
    ionSetTransitionDirection: null,
    account: Accounts.findOne({ loggedIn: true })
  };
}, Balance);
