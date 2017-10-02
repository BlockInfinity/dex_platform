import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { IonContent, IonButton, IonList, IonItem, IonLabel, IonInput, IonItemCheckBox, IonItemRadio, IonSelect, IonIcon, IonItemToggle, IonRange } from 'reactionic';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { LineChart, ScatterChart } from 'react-d3';

import { 
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
class OrderHistory extends Component {
  constructor(props) {
    super(props);
    if (!props.account) {
      browserHistory.push('/login');
    }
  }

  render() {
  	let userOrdersData = [];
  	if (this.props.userAskOrders.length > 0) {
  		userOrdersData.push({
		    name: "My Ask Orders",
		    values: this.props.userAskOrders.map(order => {
		    	return {x:order.period, y:order.price};
		    })
		  }
		);
  	}
  	if (this.props.userBidOrders.length > 0) {
  		userOrdersData.push({
		    name: "My Bid Orders",
		    values: this.props.userBidOrders.map(order => {
		    	return {x:order.period, y:order.price};
		    })
		  }
		);
  	}
  	if (this.props.allMatchingPrices.length > 0) {
  		userOrdersData.push({
		    name: "Matching Prices",
		    values: this.props.allMatchingPrices.map(period => {
		    	return {x:period.period, y:period.price};
		    })
		  }
		);
  	}

  	let ordersData = []
  	if (this.props.allAskOrders.length > 0) {
		ordersData.push(
	 	  {
		    name: "All Ask Orders",
		    values: this.props.allAskOrders.map(order => {
		    	return {x:order.period, y:order.price};
		    })
		  }
		);
  	}
  	if (this.props.allBidOrders.length > 0) {
		ordersData.push(
	 	  {
		    name: "All Bid Orders",
		    values: this.props.allBidOrders.map(order => {
		    	return {x:order.period, y:order.price};
		    })
		  }
		);
  	}

	let reserveOrdersData = []
  	if (this.props.allAskReserveOrders.length > 0) {
		reserveOrdersData.push(
	 	  {
	    	name: "All Ask Reserve Orders",
		    values: this.props.allAskOrders.map(order => {
		    	return {x:order.period, y:order.price};
		    })
		  }
	    );
  	}
  	if (this.props.allBidReserveOrders.length > 0) {
		reserveOrdersData.push(
	 	  {
	    	name: "All Bid Reserve Orders",
		    values: this.props.allBidOrders.map(order => {
		    	return {x:order.period, y:order.price};
		    })
		  }
	    );
  	}

    return (
    	<IonContent customClasses=""
                  {...this.props}>
	    	<div  style={{'textAlign': 'center'}}>
	    		{ userOrdersData.length > 0 && (
					<div>
						<LineChart colorAccessor={(d, idx) => {
			    			return idx;
			    		}} colors={idx => {
	        				return ['#408E2F','#2F4073','#AAA439','#AA3C39'][idx];
	    				}} legend={true} data={userOrdersData} width='95%' height={400} viewBoxObject={{x:0, y:0, width:400, height:400}} title="My Orders / Matching Price (last 1k data points only)" yAxisLabel="Prices" xAxisLabel="Period" domain={{x: [0,100], y: [0,100]}} gridHorizontal={true}/>
					</div>
	    		)}

	    		{ ordersData.length > 0 && (
					<div>
						<ScatterChart colorAccessor={(d, idx) => {
							return idx;
			    		}} colors={idx => {
	        				return ['#408E2F','#2F4073','#AAA439','#AA3C39'][idx];
	    				}} legend={true} data={ordersData} width='95%' height={400} viewBoxObject={{x:0, y:0, width:400, height:400}} title="Ask/Bid Orders (last 1k data points only)" yAxisLabel="Prices" xAxisLabel="Period" domain={{x: [0,100], y: [0,100]}} gridHorizontal={true} />
					</div>
	    		)}

	    		{ reserveOrdersData.length > 0 && (
					<div>
						<ScatterChart colorAccessor={(d, idx) => {
							return idx;
			    		}} colors={idx => {
	        				return ['#408E2F','#2F4073','#AAA439','#AA3C39'][idx];
	    				}} legend={true} data={reserveOrdersData} width='95%' height={400} viewBoxObject={{x:0, y:0, width:400, height:400}} title="Ask/Bid ReserveOrders (last 1k data points only)" yAxisLabel="Prices" xAxisLabel="Period" domain={{x: [0,100], y: [0,100]}} gridHorizontal={true}/>
					</div>
	    		)}
	    	</div>
	    </IonContent>
    );
  }
}

OrderHistory.propTypes = {
  ionSetTransitionDirection: React.PropTypes.func,
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
}, OrderHistory);