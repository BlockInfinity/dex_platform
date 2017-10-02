import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { IonContent, IonList, IonItem, IonIcon } from 'reactionic';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Apps, Accounts } from '../../../imports/api/core.js';

// App component - represents the whole app
class MyApps extends Component {
  constructor(props) {
    super(props);
    if (!props.account) {
      browserHistory.push('/login');
    }
  }

  render() {
    var appsProcessed = this.props.apps.map(function(page) {
      if (page.path == '/') return null;
      if (page.dontindex) return null;
      var checkmark = page.done ? "ios-checkmark-outline" : "ios-circle-outline"
      return (
        <IonItem link={page.path} iconLeft iconRight key={page.path}>
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
        <IonItem divider>Installed Apps</IonItem>
        {appsProcessed}
      </IonList>
      </IonContent>
    );
  }
}

MyApps.propTypes = {
  ionSetTransitionDirection: React.PropTypes.func,
  apps: PropTypes.array.isRequired,
  account: PropTypes.object.isRequired
};

export default createContainer(() => {
  Meteor.subscribe('apps');
  Meteor.subscribe('accounts');

  return {
    ionSetTransitionDirection: null,
    apps: Apps.find({ installed: true }).fetch(),
    account: Accounts.findOne({ loggedIn : true })
  };
}, MyApps);