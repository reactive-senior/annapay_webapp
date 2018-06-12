import React 			from 'react';

class TopMenu extends React.Component {

	constructor(props) {
		super(props);
		this.onLogOut = this.onLogOut.bind(this)
	}
	state = {};

	onLogOut(){
		console.log("Logout")
		this.props.firebase.auth().signOut().then(function() {
			console.log("Déconnecté")
		  }).catch(function(error) {
			console.log("Erreur. "+error)
		  });
	}

	render() {
		
		return  (
			<nav class="navbar navbar-inverse navbar-fixed-top">
				<div class="mobile-only-brand pull-left">
					<div class="nav-header pull-left">
						<div class="logo-wrap">
							<a href="index.html">
								<span class="brand-text">Danapay</span>
							</a>
						</div>
					</div>	
					{/* <a id="toggle_nav_btn" class="toggle-left-nav-btn inline-block ml-20 pull-left" href="javascript:void(0);"><i class="zmdi zmdi-menu"></i></a>
					<a id="toggle_mobile_search" data-toggle="collapse" data-target="#search_form" class="mobile-only-view" href="javascript:void(0);"><i class="zmdi zmdi-search"></i></a>
					<a id="toggle_mobile_nav" class="mobile-only-view" href="javascript:void(0);"><i class="zmdi zmdi-more"></i></a> */}
					{/* <form id="search_form" role="search" class="top-nav-search collapse pull-left">
						<div class="input-group">
							<input type="text" name="example-input1-group2" class="form-control" placeholder="Search"/>
							<span class="input-group-btn">
							<button type="button" class="btn  btn-default"  data-target="#search_form" data-toggle="collapse" aria-label="Close" aria-expanded="true"><i class="zmdi zmdi-search"></i></button>
							</span>
						</div>
					</form> */}
				</div>
				<div id="mobile_only_nav" className="mobile-only-nav pull-right">
					<ul className="nav navbar-right top-nav pull-right">
						<li>
							<a id="open_right_sidebar" href="#" onClick={this.onLogOut}><i className="zmdi zmdi-power top-nav-icon"></i><span> Se déconnecter</span></a>
						</li>
						{/* <li className="dropdown app-drp">
							<a href="#" className="dropdown-toggle" data-toggle="dropdown"><i className="zmdi zmdi-apps top-nav-icon"></i></a>
							<ul className="dropdown-menu app-dropdown" data-dropdown-in="slideInRight" data-dropdown-out="flipOutX">
								
							</ul>
						</li>
						<li className="dropdown alert-drp">
							<a href="#" className="dropdown-toggle" data-toggle="dropdown"><i className="zmdi zmdi-notifications top-nav-icon"></i><span className="top-nav-icon-badge">5</span></a>
							<ul  className="dropdown-menu alert-dropdown" data-dropdown-in="bounceIn" data-dropdown-out="bounceOut">
								<li>
									<div className="notification-box-head-wrap">
										<span className="notification-box-head pull-left inline-block">notifications</span>
										<a className="txt-danger pull-right clear-notifications inline-block" href="javascript:void(0)"> clear all </a>
										<div className="clearfix"></div>
										<hr className="light-grey-hr ma-0"/>
									</div>
								</li>
								<li>
									<div className="streamline message-nicescroll-bar">
										<div className="sl-item">
											<a href="javascript:void(0)">
												<div className="icon bg-green">
													<i className="zmdi zmdi-flag"></i>
												</div>
												<div className="sl-content">
													<span className="inline-block capitalize-font  pull-left truncate head-notifications">
													New subscription created</span>
													<span className="inline-block font-11  pull-right notifications-time">2pm</span>
													<div className="clearfix"></div>
													<p className="truncate">Your customer subscribed for the basic plan. The customer will pay $25 per month.</p>
												</div>
											</a>	
										</div>
										<hr className="light-grey-hr ma-0"/>
										<div className="sl-item">
											<a href="javascript:void(0)">
												<div className="icon bg-yellow">
													<i className="zmdi zmdi-trending-down"></i>
												</div>
												<div className="sl-content">
													<span className="inline-block capitalize-font  pull-left truncate head-notifications txt-warning">Server #2 not responding</span>
													<span className="inline-block font-11 pull-right notifications-time">1pm</span>
													<div className="clearfix"></div>
													<p className="truncate">Some technical error occurred needs to be resolved.</p>
												</div>
											</a>	
										</div>
										<hr className="light-grey-hr ma-0"/>
										<div className="sl-item">
											<a href="javascript:void(0)">
												<div className="icon bg-blue">
													<i className="zmdi zmdi-email"></i>
												</div>
												<div className="sl-content">
													<span className="inline-block capitalize-font  pull-left truncate head-notifications">2 new messages</span>
													<span className="inline-block font-11  pull-right notifications-time">4pm</span>
													<div className="clearfix"></div>
													<p className="truncate"> The last payment for your G Suite Basic subscription failed.</p>
												</div>
											</a>	
										</div>
										<hr className="light-grey-hr ma-0"/>
										<div className="sl-item">
											<a href="javascript:void(0)">
												<div className="sl-avatar">
													<img src={require('../img/avatar.jpg')}/>
												</div>
												<div className="sl-content">
													<span className="inline-block capitalize-font  pull-left truncate head-notifications">Sandy Doe</span>
													<span className="inline-block font-11  pull-right notifications-time">1pm</span>
													<div className="clearfix"></div>
													<p className="truncate">Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit</p>
												</div>
											</a>	
										</div>
										<hr className="light-grey-hr ma-0"/>
										<div className="sl-item">
											<a href="javascript:void(0)">
												<div className="icon bg-red">
													<i className="zmdi zmdi-storage"></i>
												</div>
												<div className="sl-content">
													<span className="inline-block capitalize-font  pull-left truncate head-notifications txt-danger">99% server space occupied.</span>
													<span className="inline-block font-11  pull-right notifications-time">1pm</span>
													<div className="clearfix"></div>
													<p className="truncate">consectetur, adipisci velit.</p>
												</div>
											</a>	
										</div>
									</div>
								</li>
								<li>
									<div className="notification-box-bottom-wrap">
										<hr className="light-grey-hr ma-0"/>
										<a className="block text-center read-all" href="javascript:void(0)"> read all </a>
										<div className="clearfix"></div>
									</div>
								</li>
							</ul>
						</li>
						<li className="dropdown auth-drp">
							<a href="#" className="dropdown-toggle pr-0" data-toggle="dropdown"><img src={require('../img/user1.png')} alt="user_auth" className="user-auth-img img-circle"/><span className="user-online-status"></span></a>
							<ul className="dropdown-menu user-auth-dropdown" data-dropdown-in="flipInX" data-dropdown-out="flipOutX">
								<li>
									<a href="profile.html"><i className="zmdi zmdi-account"></i><span>Profile</span></a>
								</li>
								
								<li>
									<a href="inbox.html"><i className="zmdi zmdi-email"></i><span>Inbox</span></a>
								</li>
								<li>
									<a href="#"><i className="zmdi zmdi-settings"></i><span>Settings</span></a>
								</li>
								<li className="divider"></li>
								<li className="sub-menu show-on-hover">
									<a href="#" className="dropdown-toggle pr-0 level-2-drp"><i className="zmdi zmdi-check text-success"></i> available</a>
									<ul className="dropdown-menu open-left-side">
										<li>
											<a href="#"><i className="zmdi zmdi-check text-success"></i><span>available</span></a>
										</li>
										<li>
											<a href="#"><i className="zmdi zmdi-circle-o text-warning"></i><span>busy</span></a>
										</li>
										<li>
											<a href="#"><i className="zmdi zmdi-minus-circle-outline text-danger"></i><span>offline</span></a>
										</li>
									</ul>	
								</li>
								<li className="divider"></li>
								<li>
									<i className="zmdi zmdi-power" onClick={this.logOut}></i><span>Log Out</span>
								</li>
							</ul>
						</li> */}
					</ul>
				</div>
			</nav>
		)
	}
	
}

export default TopMenu;
