import React from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import spinner from '../../assets/spinner.gif';

export default function Form({ onSubmit, currentUser, showCallInProgress }) {
  return (
    <form onSubmit={onSubmit}>
      <fieldset id="fieldset">
        <p>Send your meme, { currentUser.accountId }!</p>
        <p className="highlight">
          <label htmlFor="message">Meme:</label>
          <input
            autoFocus
            id="message"
            type="file"
            required
          />
        </p>
        <p>
          <label htmlFor="donation">Pay $$$ to Win!</label>
          <input
            autoComplete="off"
            defaultValue={'0'}
            id="donation"
            max={Big(currentUser.balance).div(10 ** 24)}
            min="0"
            step="0.01"
            type="number"
          />
          <span title="NEAR Tokens">Ⓝ</span>
        </p>
        <button type="submit" disabled={showCallInProgress}>
          To the moon!
        </button>
        {showCallInProgress && <img src={spinner} width='20px' height='20px'/>}
      </fieldset>
    </form>
  );
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  })
};
