import React from 'react';
import { pure } from 'recompose';

// @material-ui/core
import TextField from '@material-ui/core/TextField';

const AutoSuggestInput = (inputProps) => {
    const { classes, inputRef = () => {}, ref, ...other } = inputProps;
    console.log('inputProps', inputProps);
    return (
        <TextField
            fullWidth
            InputProps={{
                inputRef: node => {
                    ref(node);
                    inputRef(node);
                },
                // classes: {
                //     input: classes.input,
                // },
            }}
            {...other}
        />
    );
}

// export default pure(AutoSuggestInput);

export default AutoSuggestInput;
