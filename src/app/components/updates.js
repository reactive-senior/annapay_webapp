import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:3005');


module.exports = {
	onTransactionCreated : function(fn) {
		socket.on('userCreated', () => fn(null));
	},

	onAdminEtherBalanceChanged : function(fn) {
		socket.on('adminEtherBalanceChanged', () => fn(null));
	},

	onUserEtherBalanceChanged : function(fn) {
		socket.on('userEtherBalanceChanged', () => fn(null));
	},

	onAdminTokenBalanceChanged : function(fn) {
		socket.on('adminTokenBalanceChanged', () => fn(null));
	},

	onUserTokenBalanceChanged : function(fn) {
		socket.on('userTokenBalanceChanged', () => fn(null));
	},

	onParametersChanged: function(fn) {
		socket.on('parametersChanged', () => fn(null));
	},

}
