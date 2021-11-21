import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';


export default function Messages({ messages, contractError }) {
  return (
    <>
      <Snackbar
        open={contractError.length > 0}
        autoHideDuration={6000}
      > 
        <Alert severity="error">{contractError}</Alert>
      </Snackbar>
      <h2>Memes</h2>
      {messages.map((message, i) =>
        // TODO: format as cards, add timestamp
        <p key = {i}>
          <strong>{message.sender} posted on {message.addedAt}</strong>
          <img src={message.text}/>
        </p>
      )}
    </>
  );
}

Messages.propTypes = {
  messages: PropTypes.array
};
