
import React 			from 'react';
import _				from 'lodash';
import firebase         from 'firebase';
import requestManager   from '../utils/requestManager'
import App 				from './App'
  
class Login extends React.Component {
	constructor(props) {
		super(props);
		this.onLoginPress = this.onLoginPress.bind(this)
		this.handleMailChange = this.handleMailChange.bind(this)
		this.handlePasswordChange = this.handlePasswordChange.bind(this)


		this.discardMessages = this.discardMessages.bind(this)

		this.state = {
			loggedIn : false,
			user : "",
			mail : "",
			password : "",
			displayModalWarn: false,
			displayModalErr: false,
			displayModalInfo: false,
		}
	}		

	componentWillMount() {
		if (!firebase.apps.length) {
			firebase.initializeApp({
				apiKey: "AIzaSyCr5uR1gAApN7pal6Pe7gOAPAAqL1adVM4",
				authDomain: "danapay-4d304.firebaseapp.com",
				databaseURL: "https://danapay-4d304.firebaseio.com",
				projectId: "danapay-4d304",
				storageBucket: "danapay-4d304.appspot.com",
				messagingSenderId: "378140996785"
			  });
		}
	}
	
	onInfo(message){
		this.setState({
			displayModalInfo: true,
			infoMessage: message
		});
	}

	onWarning(message){
		this.setState({
			displayModalWarn: true,
			warningMessage: message
		});
	}

	onError(message){
		this.setState({
			displayModaErr: true,
			errorMessage: message
		});
	}
	
	discardMessages(){
		this.setState({
			displayModalWarn: false,
			displayModalErr: false,
			displayModalInfo: false,
		});
	}

	componentDidMount()
	{
	  this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
		if(user) //connecté
		{
		  this.setState({loggedIn:true})
		}
		else //non connecté
		{
		  this.setState({loggedIn:false, user : ""})
		}
	  });
	}

	handleMailChange(e) {
		this.setState({
			mail: e.target.value
		});
	}

	handlePasswordChange(e) {
		this.setState({
			password: e.target.value
		});
	}


	onLoginPress() {
		firebase.auth().signInWithEmailAndPassword(this.state.mail, this.state.password)
			.then((response) => { 
				console.log("UserId :"+response.user.uid)
				requestManager.getUserById(response.user.uid)
				.then((user) => {
					if(user.type === "distributor")
						this.setState({loggedIn: true, user: user})
					else console.log("Unable to login")
				})
				.catch((message)=> {
					this.onError('Serveur indisponible. Veuillez reessayer ultérieurement : '+err)
				})	
			})
			.catch((err) => {
				switch(err.code){
					case "auth/invalid-email" : 
						this.onWarning("Email invalide")
						break;
					case "auth/user-not-found" : 
						this.onWarning("Utilisateur non trouvé")
						break;
					case "auth/user-disabled" :
						this.onWarning("Utilisateur désactivé. Contactez l'administrateur") 
						break;
					case "auth/wrong-password" : 
						this.onWarning("Mot de passe incorrect")
						break;
				}
			});	
	}

	renderLogin(){
		return (
			<div className="wrapper pa-1">
				<header className="sp-header">
					<div className="sp-logo-wrap pull-left">
						<a href="#">
							<img className="brand-img mr-10" src="./img/logo.png" alt="Danapay"/>
						</a>
					</div>
					{/* <div class="form-group mb-0 pull-right">
						<span class="inline-block pr-10">Don't have an account?</span>
						<a class="inline-block btn btn-info btn-success btn-rounded btn-outline" href="signup.html">Sign Up</a>
					</div> */}
					<div className="clearfix"></div>
				</header>
				<div className="page-wrapper pa-0 ma-0 auth-page">
					<div className="container-fluid">
						<div className="table-struct full-width full-height">
							<div className="table-cell vertical-align-middle auth-form-wrap">
								<div className="auth-form  ml-auto mr-auto no-float">
									<div className="row">
										<div className="col-sm-12 col-xs-12">
											{
												this.state.displayModalInfo ? 
													<div class="alert alert-success alert-dismissable">
														<button type="button" class="close" aria-hidden="true" onClick={this.discardMessages}>&times;</button>
														<i class="zmdi zmdi-check pr-15 pull-left"></i><p class="pull-left">{this.state.infoMessage}</p> 
														<div class="clearfix"></div>
													</div> : null
											}
											{
												this.state.displayModalWarn ? 
													<div class="alert alert-warning alert-dismissable">
														<button type="button" class="close"  aria-hidden="true" onClick={this.discardMessages}>&times;</button>
														<i class="zmdi zmdi-check pr-15 pull-left"></i><p class="pull-left">{this.state.warningMessage}</p> 
														<div class="clearfix"></div>
													</div> : null
											}
											{
												this.state.displayModalErr ? 
													<div class="alert alert-danger alert-dismissable">
														<button type="button" class="close"  aria-hidden="true" onClick={this.discardMessages}>&times;</button>
														<i class="zmdi zmdi-check pr-15 pull-left"></i><p class="pull-left">{this.state.errorMessage}</p> 
														<div class="clearfix"></div>
													</div> : null
											}
											<div className="mb-30">
												<h3 className="text-center txt-dark mb-10">Danapay Administration</h3>
												<h6 className="text-center nonecase-font txt-grey">Portail distributeurs</h6>
											</div>
											<div className="form-group">
													<label className="control-label mb-10">Email address</label>
													<input type="email" className="form-control" required="" placeholder="Enter email" onChange={this.handleMailChange}/>
												</div>
											<div className="form-group">
												<label className="pull-left control-label mb-10">Mot de passe</label>
												<div className="clearfix"></div>
												<input type="password" className="form-control" required="" placeholder="Enter pwd" onChange={this.handlePasswordChange}/>
											</div>
											
											<div className="form-group">
												{/* <div className="checkbox checkbox-primary pr-10 pull-left">
													<input id="checkbox_2" required="" type="checkbox"/>
													<label> Rester connecté</label>
												</div> */}
												<div className="clearfix"></div>
											</div>
											<div className="form-group text-center">
												<button type="submit" className="btn btn-info btn-success btn-rounded" onClick={this.onLoginPress}>Se connecter</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	renderApp(){
		return(
			<App user={this.state.user} firebase={firebase}/>
		)
	}

	render(){
		if(this.state.loggedIn === false)
			return(
				<div>
					{this.renderLogin()}
				</div>
			)
		else {
			return(
				<div>
					{this.renderApp()}
					{/* <span>Connecté</span> */}
				</div>
			)
		}
	}
}

export default Login;