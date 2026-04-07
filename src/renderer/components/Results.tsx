import React, { useState, useEffect, useCallback, type RefObject } from "react";
import {
  IconButton,
  LinearProgress,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import useAxios from "axios-hooks";
import { cloneDeep } from "lodash";

interface IProps {
  term: string;
  inputRef: RefObject<HTMLInputElement | null>;
  setTerm: (term: string) => void;
  showGifs: (show: boolean) => void;
}

const Results = ({ term, inputRef, setTerm, showGifs }: IProps) => {
  const tileData: Array<{ img: string; copied: boolean; title: string; author: string; fullSize: string }> = [];
  const srcToData: Record<string, { img: string; fullSize: string }> = {};
  const [results, setResults] = useState<any[]>([]);
  const [fetched, setFetched] = useState(false);
  const [page, setPage] = useState(0);
  const [{ data, loading, error }] = useAxios(
    `https://api.giphy.com/v1/gifs/search?api_key=${import.meta.env.VITE_GIPHY_TOKEN}&q=${term}`
  );

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    e.stopPropagation();
    e.preventDefault();
    document.removeEventListener("keydown", handleKeyPress, true);
    if (e.key === "Backspace") {
      setPage((p) => Math.max(0, p - 1));
      return;
    }
    if (e.key === "Tab") {
      setPage((p) => {
        const newStartIndex = (p + 1) * 6;
        return newStartIndex < results.length ? p + 1 : p;
      });
      return;
    }

    if (/^[a-zA-Z0-9-_ ]$/.test(e.key)) {
      inputRef.current?.focus();
      showGifs(false);
      setTerm(e.key);
    }
  }, [results, inputRef, showGifs, setTerm]);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLImageElement;
    if (target.src) {
      const content = srcToData[target.src];
      if (content) {
        window.electronAPI.copyToClipboard(content.fullSize);
        const resultsClone = cloneDeep(results);
        const newResults = resultsClone.map((r: any) => {
          r.copied = r.images.fixed_width_downsampled.url === content.img;
          return r;
        });
        setResults(newResults);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress, true);
    return () => {
      document.removeEventListener("keydown", handleKeyPress, true);
    };
  }, [handleKeyPress]);

  if (loading) {
    return <LinearProgress color="secondary" />;
  }

  if (data && !fetched) {
    setFetched(true);
    setResults(data.data);
  }

  for (let i = page * 6; i < Math.min(results.length, (page + 1) * 6); i++) {
    const smallSource = results[i].images.fixed_width_downsampled.url;
    const tileElemData = {
      img: smallSource,
      copied: !!results[i].copied,
      title: results[i].title,
      author: results[i].source_tld,
      fullSize: results[i].images.original.url,
    };
    tileData.push(tileElemData);
    srcToData[smallSource] = tileElemData;
  }

  if (error) {
    return <div>Error loading gifs</div>;
  }

  return (
    <ImageList
      onClick={handleClick}
      sx={{ width: 600, height: 300 }}
      cols={3}
      rowHeight={150}
    >
      {tileData.map((tile, index) => (
        <ImageListItem
          sx={{ height: '150px', width: '200px' }}
          key={tile.img}
        >
          <img
            style={{ objectFit: 'contain', height: '150px', width: '200px' }}
            data-index={index}
            src={tile.img}
            alt={tile.title}
            loading="lazy"
          />
          <ImageListItemBar
            title={tile.copied ? "Copied" : tile.title}
            subtitle={<span>by: {tile.author}</span>}
            actionIcon={
              <IconButton
                aria-label={`info about ${tile.title}`}
                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
              >
                {tile.copied ? (
                  <AssignmentTurnedInIcon color="primary" />
                ) : (
                  <InfoIcon />
                )}
              </IconButton>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export { Results };
