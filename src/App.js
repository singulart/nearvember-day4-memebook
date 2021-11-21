import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import Form from './components/Form';
import SignIn from './components/SignIn';
import Messages from './components/Messages';

const SUGGESTED_DONATION = '0';
const BOATLOAD_OF_GAS = Big(9).times(10 ** 14).toFixed();

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  const [messages, setMessages] = useState([]);
  const [contractError, setContractError] = useState([]);
  const [showCallInProgress, setShowCallInProgress] = useState(false);


  useEffect(() => {
    // TODO: don't just fetch once; subscribe!
    contract.getMessages().then(setMessages);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    const { fieldset, message, donation } = e.target.elements;

    fieldset.disabled = true;

    // TODO: optimistically update page with new message,
    // update blockchain data in background
    // add uuid to each message, so we know which one is already known
    var reader  = new FileReader();
    reader.onloadend = function () {
      setShowCallInProgress(true);
      contract.addMessage(
        { text: reader.result },
        BOATLOAD_OF_GAS,
        Big(donation.value || '0').times(10 ** 24).toFixed()
      ).then(() => {
        contract.getMessages().then(messages => {
          setMessages(messages);
          message.value = '';
          donation.value = SUGGESTED_DONATION;
          fieldset.disabled = false;
          message.focus();
          setShowCallInProgress(false);
        });
      }).catch((error) => {
        console.log(error);
        setShowCallInProgress(false);
        if(error.kind.ExecutionError) {
          setContractError(error.kind.ExecutionError);
        } else if (error.kind.ActionsValidation) {
          setContractError('Your meme doesn\'t fit into blockchain! Try smaller one');
        }
      })
    }
    reader.readAsDataURL(message.files[0]);

  };

  const signIn = () => {
    wallet.requestSignIn(
      nearConfig.contractName,
      'NEAR Guest Book'
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <main>
      <header>
        <h1>NEAR Guest Book</h1>
        { currentUser
          ? <button onClick={signOut}>Log out</button>
          : <button onClick={signIn}>Log in</button>
        }
      </header>
      { currentUser
        ? <Form onSubmit={onSubmit} currentUser={currentUser} showCallInProgress={showCallInProgress}/>
        : <SignIn/>
      }
      { !!currentUser && !!messages.length && <Messages messages={messages} contractError={contractError} /> }
    </main>
  );
};

App.propTypes = {
  contract: PropTypes.shape({
    addMessage: PropTypes.func.isRequired,
    getMessages: PropTypes.func.isRequired
  }).isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  }),
  nearConfig: PropTypes.shape({
    contractName: PropTypes.string.isRequired
  }).isRequired,
  wallet: PropTypes.shape({
    requestSignIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  }).isRequired
};

export default App;
