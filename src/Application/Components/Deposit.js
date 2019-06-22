import React from 'react';
import { connect } from 'react-redux';
import V0MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import MobileTopHeaderContainer from '../Containers/MobileTopHeaderContainer';
import { DepositService } from '../Services/BackendService';
import { getNewUid } from '../Services/DbService'
import { gMuiTheme, mobileBreakPoint } from './Styles';
import FakeDeposit from './FakeDeposit';
import './Deposit.css';

class Deposit extends React.Component {
    constructor() {
        super();
        this.state = { value: 20 }
        this.handleChange = this.handleChange.bind(this);
    }
    
    componentDidMount() {
        window.mixpanel.track("Visit deposit page");
        window.paypal.Buttons({
            createOrder: (data, actions) => {
                // Set up the transaction
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: this.state.value || 0
                        }
                    }]
                });
            },
            onApprove: (data, actions) => {
                const sessionRequest = {
                    id: getNewUid(),
                    orderID: data.orderID,
                    userId: this.props.userId
                }
                return actions.order.capture().then(() => {
                    // Call your server to save the transaction
                    window.mixpanel.track("Complete Deposit");
                    return DepositService(sessionRequest)
                        .then(({ status }) => {
                            if (status === 'success')
                                this.props.history.push('/');
                        });
                });
            }
        }).render('#paypal-button-container')
    }

    handleChange(e) {
        let error = false;
        if (e.target.value < 10) error = true;
        this.setState({ value: e.target.value, error });
    }

    render() {
        return (
            <V0MuiThemeProvider muiTheme={gMuiTheme}>
                <React.Fragment>
                    {this.props.size < mobileBreakPoint ? (
                        <MobileTopHeaderContainer />
                    ) : null}
                    <div className="deposit-wrapper">
                    <h1 className="deposit-funds">DEPOSIT FUNDS</h1>
                    <h4>For access to immediate funds, we recommend using "Pay with Debit or Credit Card" Option on the PayPal list.</h4>
                        <div className="deposit-page">
                            <TextField
                                className="deposit-input"
                                style={{ display: 'block' }}
                                inputStyle={{ width: 232 }}
                                value={this.state && this.state.value}
                                onChange={this.handleChange}
                                type="number"
                            />
                            <div className={`error ${!this.state.error && 'hidden-space'}`}>You must depost more than $10 to initiate a transaction.</div>
                            {this.state.error && <FakeDeposit />}
                            <div id="paypal-button-container" className={`deposit-buttons ${this.state.error && 'hidden'}`} />
                        </div>
                    </div>
                </React.Fragment>
            </V0MuiThemeProvider>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user && state.user.user.id || ''
})

export default connect(mapStateToProps)(Deposit);