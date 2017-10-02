import React, { Component, PropTypes } from 'react';
import { IonContent, IonList, IonItem, IonIcon, IonButton } from 'reactionic';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';

import { Accounts } from '../../../imports/api/core.js';

class Home extends Component {
  constructor(props) {
    super(props);
    if (!props.account) {
      browserHistory.push('/login');
    }
  }
  render() {
    var pageList = [
      { path:'/manualOrders', headerTitle:'Manual Orders', done: true},
      { path:'/orderHistory', headerTitle:'Order History', done: true},
      { path:'/balance', headerTitle:'Balance', done: true}
    ];
    var items = pageList.map(function(page) {
      if (page.path == '/') return null;
      if (page.dontindex) return null;
      var checkmark = page.done ? "ios-checkmark-outline" : "ios-circle-outline"
      return (
        <IonItem  link={page.path} iconLeft iconRight key={page.path}>
          <IonIcon icon={checkmark} />
          {page.headerTitle}
          <IonIcon icon="ios-arrow-right" />
        </IonItem>        
      );
    });
    return (
      <IonContent customClasses=""
                  {...this.props}>
      <IonList>
        <IonItem divider>Basic Options</IonItem>
        {items}
      </IonList>

      <div style={{'textAlign': 'center'}}>
        <IonButton size="large" onClick={(event) => {
          event.preventDefault();
          Accounts.update({_id : this.props.account._id},{$set: {loggnedIn : false}});
          browserHistory.push('/login');
        }}>Logout</IonButton>
      </div>

      </IonContent>
    );
  }
}

Home.propTypes = {
  ionSetTransitionDirection: React.PropTypes.func,
  account: PropTypes.object.isRequired
};

export default createContainer(() => {
  Meteor.subscribe('accounts');

  return {
    ionSetTransitionDirection: null,
    account: Accounts.findOne({ loggedIn : true })
  };
}, Home);
