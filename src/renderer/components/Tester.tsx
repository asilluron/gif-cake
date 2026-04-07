import React, { useState } from 'react';
import { TextField } from "@mui/material";

const Tester = () => {
  const [displayGifs, showGifs] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    setSearchTerm('');
    console.log(displayGifs);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      showGifs(true);
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
      />
    </div>
  );
};

export { Tester };
