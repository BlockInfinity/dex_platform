import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { IonContent, IonList, IonItem, IonIcon } from 'reactionic';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import { Apps, Accounts } from '../../../imports/api/core.js';

// App component - represents the whole app
class AppStore extends Component {
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
        <IonItem iconLeft iconRight key={page.path} onClick={(event) => {
        		event.preventDefault();
       			Apps.update({_id : page._id},{$set: {installed : !page.installed}});
       			browserHistory.push('/tabs/two');
       		}}>
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
        <IonItem divider>AppStore</IonItem>
        {appsProcessed}
      </IonList>
      </IonContent>
    );
  }
}

AppStore.propTypes = {
  ionSetTransitionDirection: React.PropTypes.func,
  apps: PropTypes.array.isRequired,
  account: PropTypes.object.isRequired
};

export default createContainer(() => {
  Meteor.subscribe('apps');
  Meteor.subscribe('accounts');

  return {
    ionSetTransitionDirection: null,
    apps: Apps.find({ installed: false }).fetch(),
    account: Accounts.findOne({ loggedIn : true })
  };
}, AppStore);
