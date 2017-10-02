import ReactDOM from 'react-dom';
import React from 'react';
import _ from 'lodash';
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router';
import App from './imports/components/app.jsx';
import Layout from './imports/components/layouts/main.jsx';
import Index from './imports/components/index.jsx';
import { Tabs } from './imports/components/tabs.jsx';
import Home from './imports/components/home.jsx';
import MyApps from './imports/components/myApps.jsx';
import AppStore from './imports/components/appstore.jsx';
import ManualOrders from './imports/components/manualOrders.jsx';
import OrderHistory from './imports/components/orderHistory.jsx';
import OrderBot from './imports/components/orderbot.jsx';
import Balance from './imports/components/balance.jsx';
import Login from './imports/components/login.jsx';
import Register from './imports/components/register.jsx';

var main = function () {
  var pageList = [
    { path:'/', component:Index, title:'React Ionic', done:true},
    { path:'/login', component:Login, title:'Login', done:true},
    { path:'/register', component:Register, title:'Register', done:true},    
    { path:'/tabs/one', component:Home, title:'DEX Platform', done:true, childRoutes:
      [
        { path:'/tabs/one', component:Home, title:'Home', done:false, indexRoute:true},
        { path:'/tabs/two', component:MyApps, title:'My Apps', done:false, indexRoute:true},
        { path:'/tabs/third', component:AppStore, title:'AppStore', done:false},
      ]
    },
    { path:'/manualOrders', component:ManualOrders, title:'Manual Orders', done:true},
    { path:'/orderHistory', component:OrderHistory, title:'Order History', done:true},
    { path:'/orderBot', component:OrderBot, title:'Order Bot', done:true},
    { path:'/balance', component:Balance, title:'Balance', done:true}
  ];

  var tabRoutes;
  const pageRoutes = pageList.map(function(page) {
    if(page.childRoutes) {
      tabRoutes = page.childRoutes.map(function(cpage) {
        return <Route path={cpage.path} component={cpage.component} key={cpage.path} />;
      });
    } else {
      return <Route path={page.path} component={page.component} key={page.path} />;
    }
  });

  var PageList = pageList.map(function(page, idx, pageArray) {
    // strip the page components
    delete page.component;
    return page;
  });

  let mainRoute = (
    <Route component={Layout}>
      <IndexRoute component={Index} />
      {pageRoutes}
    </Route>
  );

  let tabRoute = (
    <Route path="/tabs" component={Tabs}>
      <IndexRoute component={Home} />
      {tabRoutes}
    </Route>
  );

  var routes = (
    <Route path="/" component={App} pageList={PageList}>
      <IndexRedirect to="/tabs/one" />
      { mainRoute }
      { tabRoute }
    </Route>
  );
  
  ReactDOM.render(<Router history={browserHistory}>{routes}</Router>, document.getElementById('render-target')) ;
};

if (typeof Meteor !== 'undefined') {
  Meteor.startup(main);
} else {
  main();
}
