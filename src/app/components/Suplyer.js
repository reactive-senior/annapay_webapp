
import React 				from 'react';
import Request				from 'superagent';
import _					from 'lodash';
import axios				from 'axios'
import async, { concat, compose } 	from 'async';

var calls = [];
var assets;
var vendorID = "00010";
var vendorKey = "4nz3XD9WtD8ZxsbSkTjYen9abQxU6iHC8aRQpWqAV9uj";
var vendorPrivateKey = "J8dxB92EjMpRPcUP2hUEdCCtBEuu27k69iiGEhs7P8kC"
var pspPublicKey = "FWkuNN8ug7JMY7NCsdctMe2MBiT3Ux7gP54yUbWp3oHD"
var vendorName = "eshop.rw"

class Users extends React.Component {
	constructor(props) {
	    super(props);
		this.createSaleTransaction = this.createSaleTransaction.bind(this);
		this.createPurchaseTransaction = this.createPurchaseTransaction.bind(this);
		this.updateTransactions = this.updateTransactions.bind(this);
		this._authorizePayment = this._authorizePayment.bind(this);
		this.setAutomaticPaiementThresold = this.setAutomaticPaiementThresold.bind(this)
		this.payAll = this.payAll.bind(this)
		
	}

	state = {
				transactions : "", 
				transactionsCount : "",
				automaticPaymentThresold : 100,
				filter : "all",
				product1Price : (Math.random()*100).toFixed(0).toString(), 
				product2Price : (Math.random()*100).toFixed(0).toString()
			};

	componentWillMount()
	{
		this.updateTransactions();
	}

	_precisionRound(numberStr, precision) {
		var factor = Math.pow(10, precision);
		return Math.round(parseFloat(numberStr) * factor) / factor;
	  }

	_authorizePayment(_transactionID){
		console.log("Autorisation du paiement "+_transactionID)
		let query = 'http://localhost:7000/api/authorizePayment'; 
		let params = {
			transactionID : _transactionID,
			vendorID : vendorID,
			pspPublicKey : pspPublicKey,
			vendorPrivateKey : vendorPrivateKey
		}
		axios.post(query, params, )
        .then((response) => {
            console.log('Resultat :'+JSON.stringify(response.data));
            console.log('Http Code :'+response.status);
			if(response.status == 200 && response.data.message != "Unable to authorize payment") {
				this._transferFunds(response.data.transactionID)
            }else console.log("Payment not authorized")
        })
        .catch(function(error) {
            console.log("Error while authorizing payment");
			console.log(error)
        });
	}

	_transferFunds(_transactionID){
		console.log("Autorisation du paiement "+_transactionID)
		let query = 'http://localhost:7001/api/TransferFounds'; 
		let params = {
			taxTransactionId : _transactionID,
			TokenId :"0100",
			senderId :vendorName,
			senderNum :"0033650478753",
			senderTag : vendorName,
			recipientId :"RRA",
			recipientNum :"0033651215693",
			recipientTag : "Rwanda Revenue Authority"
		}
		axios.post(query, params, )
        .then((response) => {
            console.log('Resultat :'+JSON.stringify(response.data));
			console.log('Http Code :'+response.status);
			this.updateTransactions()
        })
        .catch(function(error) {
            console.log("Error while transfering funds");
			console.log(error)
        });
	}


	createSaleTransaction() {
		let query = 'http://localhost:7000/api/calculateVAT'; 
		let params = { 
			vendorKey: vendorKey,
			vendorID: vendorID,
			vendorName: vendorName,
			products: {
				product1 : {
					Name : "Chaussure verte",
					Quantity : "2",
					Price : this.state.product1Price	
				},
				product2 : {
					Name : "Chemise bleue",
					Quantity : "1",
					Price : this.state.product2Price
				}
			}
		}
		axios.post(query, params, {
			headers: { 'Content-Type': 'application/json' }
		  } )
        .then( (response) => {
            console.log('Resultat :'+JSON.stringify(response.data));
			console.log('Http Code :'+response.status);
			console.log('Transaction Id :'+response.data.transactionID);			
            if(response.status == 200 && response.data.transactionID != "") {
                console.log("VAT successfully created");
				if(response.data.VATAmount < this.state.automaticPaymentThresold)
				{
					console.log("Automatic paiement")
					this.pay(response.data.transactionID)
				}
				else
				{
					console.log("Defered paiement :"+this.state.automaticPaymentThresold)
					this.updateTransactions()
				}
					
            }else console.log("Unable to retrieve VAT Tax")
        })
        .catch(function(error) {
            console.log("Error while creating VAT");
			console.log(error)
        });
	}

	createPurchaseTransaction() {
		let query = 'http://localhost:7000/api/calculatePurchaseVAT'; 
		let params = { 
			vendorID: vendorID,
			senderTag : vendorName,
			products: {
				product1 : {
					Name : "Chaussure verte",
					Quantity : "2",
					Price : this.state.product1Price	
				},
				product2 : {
					Name : "Chemise bleue",
					Quantity : "1",
					Price : this.state.product2Price
				}
			}
		}
		axios.post(query, params, {
			headers: { 'Content-Type': 'application/json' }
		  })
        .then( (response) => {
            console.log('Resultat :'+JSON.stringify(response.data));
            console.log('Http Code :'+response.status);
            if(response.status == 200) {
                console.log("VAT deduction successfully created");
				this.updateTransactions()
            }
        })
        .catch(function(error) {
            console.log("Error while creating deduction VAT");
			console.log(error)
        });
	}

	

	updateTransactions(event){
		//On transforme les citations en array
		
		var url1 = 'https://test.bigchaindb.com/api/v1/assets?search='+vendorID;
		Request.get(url1).then((response) => {
			assets = response.body.reverse()
			for(let asset in response.body)
			{
				// console.log(response.body[asset])
				let assetId = response.body[asset].id;
				let url = 'https://test.bigchaindb.com/api/v1/transactions?asset_id='+assetId;
				// console.log("Url: "+url)
				calls.push(function(callback) {
					Request.get(url)
					.then((response) => {
						// console.log("Url :"+url)
						
						for(let transaction in response.body)
						{
							assets[asset].transactionId = response.body[transaction].id;
							assets[asset].status = response.body[transaction].metadata.status;
						}
						return callback();
					})
				})
				// console.log(calls.length)
			}
			async.parallel(calls, (err) => {
				// console.log("Assets: "+JSON.stringify(assets))
				
				this.setState ({
					transactions : assets, 
					transactionsCount : assets.length				
				});
			})
		})
		console.log(this.state);
	};


	pay(_transactionID){
		this._authorizePayment(_transactionID);
	}

	payAll(){
		for(var transaction in this.state.transactions)
		{
			if(this.state.transactions[transaction].status == "Authorized" || this.state.transactions[transaction].status == "Init")
			{
				this.pay(this.state.transactions[transaction].transactionId);
			}
		}
	}

	resetBillValues(){
		this.setState({
			product1Price : (Math.random()*1000).toFixed(0).toString(), 
			product2Price : (Math.random()*1000).toFixed(0).toString()
		})
	}

	
	setAutomaticPaiementThresold(e) {
		this.setState ({
			automaticPaymentThresold: e.target.value/100
		});
	 }

	render(){
		var totalVATTax = 0;
		for(var transaction in this.state.transactions)
		{
			// console.log(this.state.transactions[transaction].status)
			if(this.state.transactions[transaction].status == "Authorized" || this.state.transactions[transaction].status == "Init")
			{
				totalVATTax += parseFloat(this.state.transactions[transaction].data.vatAmount)
				
			}
				
		}
		
		totalVATTax = this._precisionRound(totalVATTax.toString(), 1)*100

		
		var transactions = _.map(this.state.transactions, (transaction) => {
								// console.log(JSON.stringify(transaction));
								return (
									<tr key={transaction.id}>
										<td key='0'>
											<span className="txt-dark weight-500">{transaction.id.substring(0,24)+"..."}</span> 
										</td>
										<td key='1'>
											<span className={transaction.data.type == "Purchase" ? "label label-danger" : "label label-success"} >{transaction.data.type == "Purchase" ? "Achat" : transaction.data.type == "Sale" ? "Vente" : "Non défini"}</span> 
										</td>
										<td key='2'>
											<span className="">{transaction.data.date}</span> 
										</td>
										<td key='3'>
											<span className="">{transaction.data.vatPercentage*100+"%"}</span> 
										</td>
										<td key='4'>
											<span className={transaction.data.type == "Purchase" ? "badge badge-danger transparent-badge weight-500" : transaction.data.type == "Sale" ? "badge badge-success transparent-badge weight-500" : "badge transparent-badge weight-500"}>{this._precisionRound(transaction.data.vatAmount, 1)*100}</span> 
										</td>
										<td key='5'>
											<button type="button" disabled={transaction.status != "Init"} className="btn btn-default" onClick={()=>this.pay(transaction.transactionId)} data-dismiss="modal">{
													transaction.status == "Authorized" ?  "Autorisé" : 
													transaction.status == "Payed" ? "Payé" : 
													transaction.status == "ToDeduct" ? "A déduire" : 
													transaction.status == "Deducted" ? "Déduit" : "Payer"}
											</button>
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
						<h4 className="panel-title txt-dark">Utilisateurs</h4>
					</div>
					<div className="pull-right">
						<a href="#" className="pull-left inline-block mr-15" data-toggle="modal" data-target="#create-user-modal" >
							<i className="zmdi zmdi-plus"></i>
						</a>
						<a href="#" className="pull-left inline-block refresh mr-15" onClick={this.resetBillValues}>
							<i className="zmdi zmdi-replay"></i>
						</a>
						<a href="#" className="pull-left inline-block full-screen mr-15">
							<i className="zmdi zmdi-fullscreen"></i>
						</a>
					</div>
					<div className="clearfix"></div>
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
					</div>
					<div className="clearfix"></div>
					<div className="pull-right">
						<div id="create-user-modal" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style={{display: 'none'}}>
							<div className="modal-dialog">
								<div className="modal-content">
									<div className="modal-header">
										<button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
										<h3 className="modal-title">Simulateur facture</h3>
									</div>
									<div className="modal-body">
										<form>
											<h4 className="modal-title">Produit 1</h4>
											<div className="form-group">
												<span className="block">Nom</span>
												<span className="font-15 head-font txt-dark weight-500"><span className="pull-left">Chaussure verte</span></span>
												<br/>
											</div>
											<div className="form-group">
												<span className="block">Quantité</span>
												<span className="font-15 head-font txt-dark weight-500"><span className="pull-left">2</span></span>												
												<br/>
											</div>
											<div className="form-group">
												<span className="block">Prix (RWF)</span>
												<span className="font-15 head-font txt-dark weight-500"><span className="pull-left">{this.state.product1Price*100}</span></span>
												<br/>
											</div>
											<h4 className="modal-title">Produit 2</h4>
											<div className="form-group">
												<span className="block">Nom</span>
												<span className="font-15 head-font txt-dark weight-500"><span className="pull-left">Chemise bleue</span></span>
												<br/>
											</div>
											<div className="form-group">
												<span className="block">Quantité</span>
												<span className="font-15 head-font txt-dark weight-500"><span className="pull-left">1</span></span>												
												<br/>
											</div>
											<div className="form-group">
												<span className="block">Prix (RWF)</span>
												<span className="font-15 head-font txt-dark weight-500"><span className="pull-left">{this.state.product1Price*100}</span></span>
												<br/>
											</div>
										</form>
									</div>
									<div className="modal-footer">
									
										<button type="button" className="btn btn-default" data-dismiss="modal">Fermer</button>
										<button type="button" className="btn btn-success" onClick={this.createSaleTransaction} data-dismiss="modal">Facture Vente</button>
										<button type="button" className="btn btn-danger" onClick={this.createPurchaseTransaction} data-dismiss="modal">Facture Achat</button>
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

											<th>ID redevance</th>
											<th>Type transaction</th>
											<th>Date</th>
											<th>Pourcentage TVA</th>
											<th>Montant redevance (RWF)</th>
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

export default Users;