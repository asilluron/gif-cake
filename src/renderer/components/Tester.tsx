import React, {useState} from 'react'
import {
  TextField,
} from "@material-ui/core";


const Tester = () => { 
  const [displayGifs, showGifs] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputRef, setInputRef] = useState<any>(null);
  const handleChange = (e:any) => {
    console.log(e, inputRef)
    setSearchTerm('')
    setInputRef('')
    console.log(displayGifs);
  }
  const _handleInput = (e: any) => {    
    if (e.key === "Enter") {
      showGifs(true);
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
        />
       
      </div>
    );

}

export { Tester };
