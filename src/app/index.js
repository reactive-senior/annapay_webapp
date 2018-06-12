// Code React
import React 		from 'react';
import {render} 	from 'react-dom';
import 					 'jquery-slimscroll';
import 					 'owl.carousel';
import 					 'bootstrap';

// const io = require('socket.io')();
// import 					 'counterup';
// import 					 'waypoints';


import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import './css/vendors/bower_components/morris.js/morris.css';
import './css/vendors/bower_components/datatables/media/css/jquery.dataTables.min.css'
import './css/vendors/bower_components/jquery-toast-plugin/dist/jquery.toast.min.css'
import './css/vendors/bower_components/jquery.counterup/jquery.counterup.min.js'
import './css/vendors/bower_components/waypoints/lib/jquery.waypoints.min.js'
import './css/style.css';

import './lib/simpleweather-data.js'
import './lib/dropdown-bootstrap-extended.js'
import './lib/init.js'
import './lib/dashboard-data.js'


import TopMenu 		from './components/TopMenu';
import App 			from './components/App';
import Login		from './components/Login'


// render (
// 	<TopMenu />,
// 	document.getElementById('topMenu')
// )

render (
	<Login />,
	document.getElementById('login')
)