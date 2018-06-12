
import React 						from 'react';
import Request						from 'superagent';
import _							from 'lodash';
import axios						from 'axios'
import async, { concat, compose } 	from 'async';
import driver, { Transaction }  						from 'bigchaindb-driver';

import requestManager                from '../utils/requestManager'

const EUR_CFA_RATE = 1

class Transactions extends React.Component {
	constructor(props) {
	    super(props);
		this.updateTransactions = this.updateTransactions.bind(this);
		this.handleSenderNumChange = this.handleSenderNumChange.bind(this)
		this.handleAmountCFAChange = this.handleAmountCFAChange.bind(this)
		this.handleSecretCodeChange = this.handleSecretCodeChange.bind(this)
		this.onGenerateSecretCode = this.onGenerateSecretCode.bind(this)
		this.onCashOut = this.onCashOut.bind(this)
		
	}

	state = {
				userId : "TAlmXmrOALQO9E3rVUiNQyzquDY2",
				userNum : "0033651215694",
				userTag : "Ets SANGARE",
				senderNum : "",
				amountCFA : "",
				amountEUR: "",
				secretCode: "", 
				secretCodeSent : false,
				displayModalWarn : false,
				displayModalErr : false,
				displayModalInfo: false,
				warningMessage: "",
				errorMessage: "",
				infoMessage: "",
				receivedTransactions : "",
			};
	
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

	componentWillMount()
	{
		this.updateTransactions();
	}

	handleSenderNumChange(e) {
		this.setState({
			senderNum: e.target.value
		});
	}

	handleAmountCFAChange(e) {
		this.setState({
			amountCFA: e.target.value,
			amountEUR: e.target.value/EUR_CFA_RATE
		});
	}

	handleSecretCodeChange(e){
		this.setState({
			secretCode: e.target.value
		});
	}



	updateTransactions(event){
		requestManager.getUserReceivedTransactions(this.state.userId, this.state.userNum)
        .then((_transactions) => {
			console.log("Retrieved transactions")
			console.log(JSON.stringify(_transactions))
			this.setState({
				receivedTransactions : _transactions,
			})
        })
        .catch((err) => {
          console.log("Serveur indisponible. Impossible de charger les transferts reçus "+err);
        })
	};

	onGenerateSecretCode(event){
		let tokenId = (Math.random()*100).toFixed(0).toString();
		requestManager.getUser(this.state.senderNum)
		.then((sender) => {
			requestManager.generateSecretCode(tokenId, sender.gId, this.state.senderNum, sender.lname+" "+sender.fname, this.state.userId, this.state.userNum, this.state.userTag, this.state.amountEUR)
			.then(()=>{
				console.log("Secret code sent")
				this.setState({
					secretCodeSent : true
				})
				this.discardMessages()
			})
			.catch((err) => {
				if(err === "Sender has not sufficiant tokens")
				{
					this.onWarning("Votre client ne dispose pas d'un solde suffisant. Vérifiez le montant")
				}
				if(err === "Serveur indisponible. Veuillez essayer dans quelques instants")
				{
					this.onError("Serveur indisponible. Contactez l'administrateur")
				}
			  })
		})
		.catch((err) => {
			this.onError("Serveur indisponible. Contactez l'administrateur")
			console.log("Impossible de récupérer l'utilisateur. "+err);
		  })
	}

	onCashOut(event){
		let tokenId = (Math.random()*100000).toFixed(0).toString();
		requestManager.getUser(this.state.senderNum)
		.then((sender) => {
			requestManager.cashOut(tokenId, sender.gId, this.state.senderNum, sender.lname+" "+sender.fname, this.state.userId, this.state.userNum, this.state.userTag, this.state.amountEUR, this.state.secretCode)
			.then((response)=>{
				switch(response.data){
					case "Invalid key" : 
						this.onWarning("Code secret invalide")
						break;
					case "Key and sendernum mismatched" : 
						this.onWarning("Code secret invalide. Ne correspond pas au numéro renseigné")
						break;
					case "Key and amount mismatched" : 
						this.onWarning("Code secret invalide. Ne correspond pas au montant renseigné")
						break;
					case "Your key has expired" : 
						this.onWarning("Le code secret a expiré. Regénérez le")
						break;
					case "Transaction has been succefully taken account" : 
						this.onInfo("Transfert autorisé. Vous pouvez procéder à la remise du cash")
						break;
					default : 
						this.onError("Impossible de faire le cashout. Contactez l'administrateur")
						console.log("Message reçu: "+response.data)
						break;
				}
				
				this.setState({
					secretCodeSent : false
				})
			})
			.catch((err) => {
				this.onError("Impossible de faire le cashout. Contactez l'administrateur")
			  })
		})
		.catch((err) => {
			console.log("Impossible de récupérer l'utilisateur "+err);
		  })
	}

	render(){
		
		var transactions = _.map(this.state.receivedTransactions, (transaction) => {
			return (
				<tr key={transaction._id}>
					<td key='0'>
						<span className="txt-dark weight-500">{transaction._id}</span> 
					</td>
					<td key='1'>
						<span className="">{transaction.date}</span> 
					</td>
					<td key='2'>
						<span className="">{transaction.senderTag}</span> 
					</td>
					<td key='3'>
						<span className="">{transaction.senderNum}</span> 
					</td>
					<td key='4'>
						<span className="">{transaction.amountEUR*EUR_CFA_RATE}</span> 
					</td>
					<td key='5'>
						<span>
							{
								transaction.status == "starting" ?  "En attente" : 
								transaction.status == "reload" ?  "Contacter Danapay" : 
								transaction.status == "buy" ? "Contacter Danapay" : 
								transaction.status == "sell" ? "Contacter Danapay" : 
								transaction.status == "transfer" ? "Autorisé" : 
								transaction.status == "done" ? "Validé" : "Contacter Danapay"
							}
						</span>
					</td>
				</tr>)
		});
		
		return (
			<div className="panel panel-default card-view panel-refresh">
				<div className="refresh-container">
					<div className="la-anim-1"></div>
				</div>
				<div className="panel-heading">
					<div className="pull-left">
						<h4 className="panel-title txt-dark">Vos transactions</h4>
					</div>
					<div className="pull-right">
						<a href="#" className="pull-left inline-block mr-15" data-toggle="modal" data-target="#create-transaction-modal" >
							<i className="zmdi zmdi-plus"></i>
						</a>
						<a href="#" className="pull-left inline-block refresh mr-15">
							<i className="zmdi zmdi-replay"></i>
						</a>
						<a href="#" className="pull-left inline-block full-screen mr-15">
							<i className="zmdi zmdi-fullscreen"></i>
						</a>
					</div>
					{/* <div className="clearfix"></div>
					<div className="form-group">
						<div className="row">
							<div className="col-md-4 col-sm-12 col-xs-12" style={{paddingBottom : 10}}>
								<input type="text" className="form-control" id="initialAccountBalanceInWei" placeholder={"Seuil paiement automatique ("+this.state.automaticPaymentThresold*100+")"} onChange={this.setAutomaticPaiementThresold}/>
							</div>
						</div>
						<div className="row">
							<div className="col-md-2 col-sm-12 col-xs-12">
								<span className="block txt-success weight-500  font-18" style={{paddingBottom : 10}}>Total : {totalVATTax}</span>
								<button type="button" className="btn btn-success" style={{paddingBottom : 10}} onClick={this.payAll} data-dismiss="modal">Payer toutes les redevances</button>
							</div>
						</div> 
					</div>*/}
					<div className="clearfix"></div>
					<div className="pull-right">
						<div id="create-transaction-modal" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style={{display: 'none'}}>
							<div className="modal-dialog">
								<div className="modal-content">
									<div className="modal-header">
										<button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
										<h3 className="modal-title">Procéder à un retrait</h3>
									</div>
									<div className="modal-body">
										{
											this.state.displayModalInfo ? 
												<div class="alert alert-success alert-dismissable">
													<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
													<i class="zmdi zmdi-check pr-15 pull-left"></i><p class="pull-left">{this.state.infoMessage}</p> 
													<div class="clearfix"></div>
												</div> : null
										}
										{
											this.state.displayModalWarn ? 
												<div class="alert alert-warning alert-dismissable">
													<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
													<i class="zmdi zmdi-check pr-15 pull-left"></i><p class="pull-left">{this.state.warningMessage}</p> 
													<div class="clearfix"></div>
												</div> : null
										}
										{
											this.state.displayModalErr ? 
												<div class="alert alert-danger alert-dismissable">
													<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
													<i class="zmdi zmdi-check pr-15 pull-left"></i><p class="pull-left">{this.state.errorMessage}</p> 
													<div class="clearfix"></div>
												</div> : null
										}
										<form>
											<div className="form-group">
												<input type="text" className="form-control" id="phoneNum" placeholder="N° de téléphone" onChange={this.handleSenderNumChange}/>
											</div>
											<div className="form-group">
												<input type="text" className="form-control" id="secretCode" placeholder="Montant (CFA)" onChange={this.handleAmountCFAChange}/>	
											</div>
											<div className="form-group">
												<input type="text" className="form-control" id="secretCode" placeholder="Code secret" onChange={this.handleSecretCodeChange} disabled={!this.state.secretCodeSent}/>
											</div>
										</form>
									</div>
									<div className="modal-footer">
									
										<button type="button" className="btn btn-default" data-dismiss="modal">Fermer</button>
										<button type="button" className="btn btn-success" onClick={this.onGenerateSecretCode}>Générer le code secret</button>
										<button type="button" className="btn btn-danger" onClick={this.onCashOut} disabled={!this.state.secretCodeSent}>Valider</button>
									</div>
								</div>
							</div>
						</div>
						
					</div>
					<div className="clearfix"></div>
				</div>
				<div className="panel-wrapper collapse in">
					<div className="panel-body row pa-0">
						<div className="table-wrap">
							<div className="table-responsive">
								<table className="table table-hover mb-0">
									<thead>
										<tr>
											<th>N° transaction</th>
											<th>Date</th>
											<th>Client</th>
											<th>N° Tel client</th>
											<th>Montant (CFA)</th>
											<th>Statut</th>
										</tr>
									</thead>
									<tbody>
										{transactions}
									</tbody>
								</table>
							</div>
						</div>	
					</div>	
				</div>
			</div>
		);
	}
}

export default Transactions;