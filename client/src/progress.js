import { CircularProgress, makeStyles, createStyles } from "@material-ui/core";
import { useState, useEffect } from "react";

//https://webdevassist.com/reactjs-materialui/material-ui-progress-bar

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(30),
    },
  })
);

function App() {
  const classes = useStyles();
  const [level, setLevel] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLevel((newLevel) => (newLevel >= 100 ? 0 : newLevel + 10));
    }, 700);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={classes.root}>
      <CircularProgress color="secondary" variant="determinate" value={level} />
    </div>
  );
}

export default App;