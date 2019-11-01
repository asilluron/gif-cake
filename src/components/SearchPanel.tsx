import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  TextField,
} from "@material-ui/core";
import {Results} from './Results';

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0
  },
  searchBar: {
    border: 0,
    color: "white",
    fontSize: 48,
    width: '600px',
    textAlign: "center",
    outline: "none",
    backgroundSize: 125
  },
  searchBarHidden: {
    width: '1px',
    height: '1px',
    float: 'left',
  },
  inputStyle: {
    fontFamily: "Lucida Sans Unicode, Lucida Grande, sans-serif",
    color: "white",
    textAlign: "center"
  },
  gridList: {
    width: 600,
    height: 300
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)"
  }
}));

const SearchPanel = () => {
  const classes = useStyles();
  const [displayGifs, showGifs] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputRef, setInputRef] = useState<any>(null);
  const _handleInput = (e: any) => {    
    if (e.key === "Enter") {
      showGifs(true);
    }
  };

  const handleChange = (e: any) => {
      if(displayGifs === true) {
        console.log('CLEARING SLATE')
        showGifs(false);
        setSearchTerm('');
        const val = e.target.value;
        setSearchTerm(val.substr(val.length -1, 1));
      } else {
        setSearchTerm(e.target.value);
      }
    
  };

  const focusUsernameInputField = (input:any) => {
    
    if(input && !inputRef) {
      setInputRef(input)
    }
  };



  return (
    <div id="panel">
      
        <TextField
          onChange={e => handleChange(e)}
          value={searchTerm}
          onKeyPress={e => _handleInput(e)}
          inputProps={{ style: {textAlign: 'center', color: 'white', fontSize: 48} }}
          type={"text"}
          fullWidth={true}
          autoFocus={true}
          inputRef={focusUsernameInputField}
          className={displayGifs ? classes.searchBarHidden : classes.searchBar }
        />

      {displayGifs ? (
        <Results term={searchTerm} inputRef={inputRef} setTerm={setSearchTerm} showGifs={showGifs}></Results>
      ) : null}
    </div>
  );
};

export { SearchPanel };
