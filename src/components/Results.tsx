import React, { useState, useEffect} from "react";
import { makeStyles } from "@material-ui/styles";
import {
  GridListTile,
  GridListTileBar,
  IconButton,
  LinearProgress
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import GridList from "@material-ui/core/GridList";
import useAxios from "axios-hooks";
const {clipboard} = require('electron');
import {cloneDeep} from 'lodash';
//var remote = require('electron').remote;   
//const token = remote.getGlobal('token');



const useStyles = makeStyles(theme => ({
  root: {
    padding: 0
  },
  gifImage: {
    objectFit: 'contain',
    height: "150px",
    width: "200px"
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
    source_tld: string,
    copied: boolean
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
  let srcToData:any = {};
  const [results, setResults] = useState<any>([])
  const [fetched, setFetched] = useState(false);
  const [page, setPage] = useState(0);
  const [{ data, loading, error }, refetch] = useAxios(
    `https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=${term}`
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

  const handleClick = (e:any) => {
    // @ts-ignore
    if (typeof e.target.src !== "undefined") {
        const content = srcToData[e.target.src]
        clipboard.writeText(content.fullSize);
        const resultsClone = cloneDeep(results);
        const newResults = resultsClone.map((r:any) => {
          if(r.images.fixed_width_downsampled.url === content.img) {
            r.copied = true;
          } else {
            r.copied = false;
          }
          return r;
        })
        setResults(newResults);
    }
  }


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
    const smallSource = results[i].images.fixed_width_downsampled.url;

    const tileElemData = {
      img: smallSource,
      copied: results[i].copied ? true : false,
      title: results[i].title,
      author: results[i].source_tld,
      fullSize: results[i].images.original.url
    };


    tileData.push(tileElemData);

    srcToData[smallSource] = tileElemData;
  }

  if (error) {
    return <div>Error loading gifs</div>;
  }

  return (
    <GridList   onClick={ (e) => { handleClick(e) }} cellHeight={180} className={classes.gridList}>
      {tileData.map((tile, index) => (
        <GridListTile
          style={{ height: "150px", width: "200px" }}
          key={tile.img}
        >
          <img className={classes.gifImage} data-index={index} src={tile.img} alt={tile.title} />
          <GridListTileBar
            title={tile.copied ? 'Copied' : tile.title}
            subtitle={<span>by: {tile.author}</span>}
            actionIcon={
              <IconButton
                aria-label={`info about ${tile.title}`}
                className={classes.icon}
              >
                {tile.copied ? <AssignmentTurnedInIcon color="primary"/> : <InfoIcon />}
              </IconButton>
            }
          />
        </GridListTile>
      ))}
    </GridList>
  );
};

export { Results };
