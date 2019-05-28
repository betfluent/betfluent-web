import React from 'react';
import { connect } from 'react-redux';
import V0MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import { DepositService } from '../Services/BackendService';
import { getNewUid } from '../Services/DbService'
import { gMuiTheme } from './Styles';
import FakeDeposit from './FakeDeposit';

class Deposit extends React.Component {
    constructor() {
        super();
        this.state = { value: 20 }
        this.handleChange = this.handleChange.bind(this);
    }
    
    componentDidMount() {
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
                <div className="deposit-page">
                    <TextField
                        className="deposit-input"
                        style={{ display: 'block' }}
                        value={this.state && this.state.value}
                        onChange={this.handleChange}
                        type="number"
                    />
                    <div className={`error ${!this.state.error && 'hidden'}`}>You must depost more than $10 to initiate a transaction.</div>
                    {this.state.error && <FakeDeposit />}
                    <div id="paypal-button-container" className={`deposit-buttons ${this.state.error && 'hidden'}`} />
                </div>
            </V0MuiThemeProvider>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user && state.user.user.id || ''
})

export default connect(mapStateToProps)(Deposit);