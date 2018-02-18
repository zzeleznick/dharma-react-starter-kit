import React, { Component } from 'react'
import promisify from "tiny-promisify"
import Dharma from "@dharmaprotocol/dharma.js";
import BigNumber from "bignumber.js";

import { Button, FormGroup, ControlLabel, FormControl, HelpBlock } from "react-bootstrap";
import { withAlert } from 'react-alert'

import DebtKernel from '../build/contracts/DebtKernel.json'
import RepaymentRouter from '../build/contracts/RepaymentRouter.json'
import TokenTransferProxy from '../build/contracts/TokenTransferProxy.json'
import TokenRegistry from '../build/contracts/TokenRegistry.json'
import DebtToken from '../build/contracts/DebtToken.json'
import TermsContractRegistry from "../build/contracts/TermsContractRegistry.json"

import getWeb3 from './utils/getWeb3'

import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.handlePrincipalAmountChange = this.handlePrincipalAmountChange.bind(this);
    this.handlePrincipalTokenChange = this.handlePrincipalTokenChange.bind(this);
    this.handleInterestRateChange = this.handleInterestRateChange.bind(this);
    this.handleInstallmentsTypeChange = this.handleInstallmentsTypeChange.bind(this);
    this.handleTermLengthChange = this.handleTermLengthChange.bind(this);

    this.onGenerateDebtOrder = this.onGenerateDebtOrder.bind(this);
    this.onSignDebtOrder = this.onSignDebtOrder.bind(this);

    this.state = {
      web3: null,
      dharma: null,
      principalAmount: new BigNumber(0),
      principalTokenSymbol: "REP",
      amortizationUnit: "hours",
      interestRate: new BigNumber(0),
      termLength: new BigNumber(0)
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    // throw new Error('test error wrapper');

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateDharma()
    })
    .catch((e) => {
      console.log('Error instantiating Dharma contracts:' + e);
    })

  }

  static eventToBigNumber(e) {
    return new BigNumber(e.target.value || 0)
  }

  handlePrincipalAmountChange(e) {
      this.setState({
          principalAmount: App.eventToBigNumber(e)
      });
  }

  handlePrincipalTokenChange(e) {
      this.setState({
          principalTokenSymbol: e.target.value
      });
  }

  handleInterestRateChange(e) {
      this.setState({
          interestRate: App.eventToBigNumber(e)
      });
  }

  handleInstallmentsTypeChange(e) {
      this.setState({
          amortizationUnit: e.target.value
      });
  }

  handleTermLengthChange(e) {
      this.setState({
          termLength:  App.eventToBigNumber(e)
      });
  }
  static validateDebtOrder({ principalAmount, principalTokenSymbol,
                             interestRate, amortizationUnit, termLength }) {
      if (principalAmount <= 0) {
        throw new Error(`Principals must be > 0, not ${principalAmount}`)
      } else if (interestRate <= 0) {
        throw new Error(`interestRate must be > 0, not ${interestRate}`)
      } else if (termLength <= 0) {
        throw new Error(`termLength must be > 0, not ${termLength}`)
      }
  }
  async onGenerateDebtOrder(e) {
      const { principalAmount, principalTokenSymbol, interestRate, amortizationUnit, termLength } = this.state;
      // MARK: validate state
      try {
        App.validateDebtOrder({ principalAmount, principalTokenSymbol,
                                interestRate, amortizationUnit, termLength })
      } catch(err) {
         this.props.alert.error(`${err}`)
         return
      }
      const dharma = this.state.dharma;

      const tokenRegistry = await dharma.contracts.loadTokenRegistry();
      const principalToken = await tokenRegistry.getTokenAddress.callAsync(principalTokenSymbol);

      const simpleInterestLoan = {
          principalToken,
          principalAmount,
          interestRate,
          amortizationUnit,
          termLength
      };

      const debtOrder = await dharma.adapters.simpleInterestLoan.toDebtOrder(simpleInterestLoan);

      this.setState({ debtOrder: JSON.stringify(debtOrder) });
  }
  static validateDebtOrderObj(debtOrder) {
      if (!debtOrder) {
          throw new Error("No debt order has been generated yet!");
      }
      return JSON.parse(debtOrder);
  }

  async onSignDebtOrder(e) {
      let debtOrder;
      try {
        debtOrder = App.validateDebtOrderObj(this.state.debtOrder);
      } catch(err) {
        this.props.alert.error(`${err}`)
        return
      }

      debtOrder.principalAmount = new BigNumber(debtOrder.principalAmount);
      debtOrder.debtor = this.state.accounts[0];

      // Sign as debtor
      const debtorSignature = await this.state.dharma.sign.asDebtor(debtOrder);
      const signedDebtOrder = Object.assign({ debtorSignature }, debtOrder);

      this.setState({ debtOrder: JSON.stringify(signedDebtOrder) });
  }

  async instantiateDharma() {
    const networkId = await promisify(this.state.web3.version.getNetwork)();
    const accounts = await promisify(this.state.web3.eth.getAccounts)();

    if (!(networkId in DebtKernel.networks &&
          networkId in RepaymentRouter.networks &&
          networkId in TokenTransferProxy.networks &&
          networkId in TokenRegistry.networks &&
          networkId in DebtToken.networks &&
          networkId in TermsContractRegistry.networks)) {
        throw new Error("Cannot find Dharma smart contracts on current Ethereum network.");
    }

    const dharmaConfig = {
        kernelAddress: DebtKernel.networks[networkId].address,
        repaymentRouterAddress: RepaymentRouter.networks[networkId].address,
        tokenTransferProxyAddress: TokenTransferProxy.networks[networkId].address,
        tokenRegistryAddress: TokenRegistry.networks[networkId].address,
        debtTokenAddress: DebtToken.networks[networkId].address,
        termsContractRegistry: TermsContractRegistry.networks[networkId].address
    }

    const dharma = new Dharma(this.state.web3.currentProvider, dharmaConfig);

    this.setState({ dharma, accounts });
  }

  render() {
    return (
      <div className="App">
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
            <h1>ShortSell App</h1>
            <h3><b>Generate a simple loan request:</b></h3>
            <form>
               <FormGroup
                 controlId="formBasicText"
               >
                 <ControlLabel>Principal Amount</ControlLabel>
                 <FormControl
                   type="number"
                   placeholder="100.3"
                   onChange={this.handlePrincipalAmountChange}
                 />
                 <HelpBlock>Enter the amount of tokens you would like to borrow.</HelpBlock>
               </FormGroup>
               <FormGroup controlId="formControlsSelect">
                  <ControlLabel>Principal Token</ControlLabel>
                  <FormControl
                    componentClass="select"
                    placeholder="select"
                    onChange={this.handlePrincipalTokenChange}
                >
                    <option value="REP">Augur (REP)</option>
                    <option value="MKR">Maker DAO (MKR)</option>
                    <option value="ZRX">0x Token (ZRX)</option>
                  </FormControl>
                  <HelpBlock>Choose which token you would like to borrow.</HelpBlock>
                </FormGroup>
                <FormGroup controlId="formControlsSelect">
                   <ControlLabel>Interest Rate</ControlLabel>
                   <FormControl
                     type="number"
                     step="0.001"
                     placeholder="8.12%"
                     onChange={this.handleInterestRateChange}
                   />
                   <HelpBlock>Specify your desired interest rate.</HelpBlock>
                 </FormGroup>
                 <FormGroup controlId="formControlsSelect">
                    <ControlLabel>Intstallments Type</ControlLabel>
                    <FormControl
                        componentClass="select"
                        placeholder="select"
                        onChange={this.handleInstallmentsTypeChange}
                    >
                      <option value="hours">Hourly</option>
                      <option value="days">Daily</option>
                      <option value="weeks">Weekly</option>
                      <option value="months">Monthly</option>
                      <option value="years">Yearly</option>
                    </FormControl>
                    <HelpBlock>Specify how often you would like repayments to be due.</HelpBlock>
                  </FormGroup>
                  <FormGroup
                    controlId="formBasicText"
                  >
                    <ControlLabel>Term Length</ControlLabel>
                    <FormControl
                      type="number"
                      placeholder="3"
                      onChange={this.handleTermLengthChange}
                    />
                    <HelpBlock>Enter the length of the entire debt agreement, in units of the chosen installments (e.g. a term length of 2 with an installment type of "monthly" would be equivalent to a 2 month long loan)</HelpBlock>
                  </FormGroup>
                  <Button
                    bsStyle="primary"
                    onClick={this.onGenerateDebtOrder}
                  >
                    Generate Debt Order
                  </Button>
                  <br/><br/>
                  <Button
                    bsStyle="primary"
                    onClick={this.onSignDebtOrder}
                  >
                    Sign Debt Order
                  </Button>
                  <code>{this.state.debtOrder}</code>

             </form>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default withAlert(App)
