import React, { useState, useRef } from "react";
import { TextField, Box } from "@mui/material";
import { Results } from './Results';
import image_src from '../../assets/giphy.png';

const SearchPanel = () => {
  const [displayGifs, showGifs] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      showGifs(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (displayGifs) {
      showGifs(false);
      setSearchTerm('');
      const val = e.target.value;
      setSearchTerm(val.substring(val.length - 1, val.length));
    } else {
      setSearchTerm(e.target.value);
    }
  };

  return (
    <div id="panel">
      <TextField
        onChange={handleChange}
        value={searchTerm}
        onKeyDown={handleKeyDown}
        slotProps={{
          input: {
            style: { textAlign: 'center', color: 'white', fontSize: 48 },
          },
        }}
        type="text"
        fullWidth
        autoFocus
        inputRef={inputRef}
        sx={displayGifs ? { width: '1px', height: '1px', float: 'left' } : {
          border: 0,
          color: 'orange',
          fontSize: 48,
          width: '600px',
          textAlign: 'center',
          outline: 'none',
        }}
      />

      {displayGifs ? (
        <Results
          term={searchTerm}
          inputRef={inputRef}
          setTerm={setSearchTerm}
          showGifs={showGifs}
        />
      ) : null}

      <Box
        component="img"
        src={image_src}
        alt="Powered by Giphy"
        sx={{
          position: 'absolute',
          bottom: 2,
          right: 2,
          zIndex: 100,
          height: '18px',
          width: '140px',
        }}
      />
    </div>
  );
};

export { SearchPanel };
