import React 			from 'react';
import requestManager   from '../utils/requestManager'

class Board extends React.Component {

	
	constructor(props) {
	    super(props);
	}

	state = {
		Balance : "",
	};
	
	componentWillMount()
	{
		requestManager.getUser("0033651215694")
		.then((user)=>{
			this.setState({
				Balance : user.tokenBalance
			})
		})
		.catch((err)=>{
			console.log("Error. "+err)
		})
	}

	render(){
		return (
			<div className="panel panel-default card-view panel-refresh">
						<div className="panel-heading">
							<div className="pull-left">
								<h6 className="panel-title txt-dark">Informations <a href="#" className="" ><i className="zmdi zmdi-help"></i></a></h6>
							</div>
							<div className="clearfix"></div>
						</div>
						<div className="panel-wrapper collapse in">
							<div className="panel-body row mb-15">
								<div className="col-md-4 col-sm-12 col-xs-12 form-group">
									<span className="block">Votre solde retirable</span>
									<span className="font-15 head-font txt-dark weight-500"><span className="counter-anim">{this.state.Balance}</span></span>
								</div>
								<div className="clearfix"></div>
							</div>
						</div>						
					</div>
		);
	}
}

export default Board;