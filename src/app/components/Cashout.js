// Code React
import React 			from 'react';
import Transactions		from './Transactions';
import Board 			from './Board'

class Cashout extends React.Component {

	constructor(props) {
	    super(props);
		
	}

	state = {
		loggedIn : false
	};

	componentWillMount()
	{

	}

	render() {
		return  (
			<div class="page-wrapper">
				<div class="container-fluid pt-25">
					<div>
						<div className="row">
							<div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
								<Board/>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<Transactions />		
							</div>
						</div>
					</div>
					<footer class="footer container-fluid pl-30 pr-30">
						<div class="row">
							<div class="col-sm-12">
								<p>2018 &copy; Danapay. Portail distributeurs</p>
							</div>
						</div>
					</footer>
				</div>
			</div>
			)
		
	}
}
export default Cashout;

