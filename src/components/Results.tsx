import React, { useState, useEffect} from "react";
import { makeStyles } from "@material-ui/styles";
import {
  TextField,
  GridListTile,
  GridListTileBar,
  IconButton,
  LinearProgress
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import GridList from "@material-ui/core/GridList";
import useAxios from "axios-hooks";

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0
  },
  searchBar: {
    border: 0,
    color: "white",
    fontSize: 48,
    width: 600,
    textAlign: "center",
    outline: "none",
    backgroundSize: 125
  },
  inputStyle: {
    fontFamily: "Lucida Sans Unicode, Lucida Grande, sans-serif",
    color: "white"
  },
  gridList: {
    width: 600,
    height: 300
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)"
  }
}));

interface ITile {
    images: any
    title: string
    source_tld: string
}

interface IProps {
  term: string
  inputRef: any
  setTerm: Function
  showGifs: Function
}
const Results = ({ term, inputRef, setTerm, showGifs}: IProps) => {
  const classes = useStyles();
  let tileData = [];
  const [results, setResults] = useState<any>([])
  const [fetched, setFetched] = useState(false);
  const [page, setPage] = useState(0);
  var remote = require('electron').remote;   
  const token = remote.getGlobal('token');
  const [{ data, loading, error }, refetch] = useAxios(
    `https://api.giphy.com/v1/gifs/search?api_key=${token}&q=${term}`
  );

  const handleKeyPress = (e:any) => {
    e.stopPropagation();
    e.preventDefault();
    document.removeEventListener("keydown", handleKeyPress, true);
    if(e.key === 'Backspace') {
        const newPage = page - 1;
        if(newPage >= 0) {
            setPage(newPage);
        } else {
          setPage(page);
        }
        return;
    }
    if(e.key === 'Tab') {
        const newPage = page + 1;
        const newStartIndex = ((page + 1) * 6);
        if(newStartIndex < results.length) {
            // Okay, we have enough to keep going
            setPage(newPage);
        } else {
          setPage(page);
        }
        return; 
    }   
    
    if(/^[a-zA-Z0-9-_ ]$/.test(e.key)) {
        inputRef.focus();
        showGifs(false);
        setTerm(e.key);
        
    }
    
};

  useEffect(() => {
        document.addEventListener("keydown", handleKeyPress, true);
       
  }, [page, results, term]);

  if (loading) {
    return <LinearProgress variant="query" color="secondary" />;
  }

  if (data && fetched === false) {
    setFetched(true);
    setResults(data.data);
  }

  for (let i = (page * 6); i < Math.min(results.length, (page + 1) * 6); i++) {
    tileData.push({
      img: results[i].images.fixed_width_downsampled.url,
      title: results[i].title,
      author: results[i].source_tld,
      fullSize: results[i].images.original.url
    });
  }

  if (error) {
    return <div>Error loading gifs</div>;
  }

  return (
    <GridList cellHeight={180} className={classes.gridList}>
      {tileData.map(tile => (
        <GridListTile
          style={{ height: "150px", width: "200px" }}
          key={tile.img}
        >
          <img src={tile.img} alt={tile.title} />
          <GridListTileBar
            title={tile.title}
            subtitle={<span>by: {tile.author}</span>}
            actionIcon={
              <IconButton
                aria-label={`info about ${tile.title}`}
                className={classes.icon}
              >
                <InfoIcon />
              </IconButton>
            }
          />
        </GridListTile>
      ))}
    </GridList>
  );
};

export { Results };
