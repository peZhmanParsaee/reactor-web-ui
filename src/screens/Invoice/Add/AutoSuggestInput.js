import React from 'react';
// import { pure } from 'recompose';

// @material-ui/core
import TextField from '@material-ui/core/TextField';

const AutoSuggestInput = (inputProps) => {
  const {
    inputRef = () => {}, ref, ...other
  } = inputProps;
  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: (node) => {
          ref(node);
          inputRef(node);
        }
      }}
      {...other}
    />
  );
};

// export default pure(AutoSuggestInput);

export default AutoSuggestInput;
