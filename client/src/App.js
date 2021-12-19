import Customer from './components/Customer';
import CustomerAdd from './components/CustomerAdd'
import './App.css';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import React, { useState, useRef, useEffect } from 'react';
import { ThemeProvider, unstable_createMuiStrictModeTheme } from '@material-ui/core'
const theme = unstable_createMuiStrictModeTheme();

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  table: {
    minWidth: 1080
  },
  progress: {
    margin: theme.spacing(2)
  }
});

function useDidMount() {
  const didMountRef = useRef(true);

  useEffect(() => {
    didMountRef.current = false;
  }, [didMountRef]);

  return didMountRef.current
};

/*
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 
*/

const callApi = async () => {
  const response = await fetch('/api/customers');
  const body = await response.json();
  /* await sleep(6000); */
  return body;
};

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function App(props) {
  let didMount = useDidMount();  
  const [isInit, setisInit] = useState(true);
  const [state, setState] = useState({customers: null, completed: 0});
  const waitCnt = useRef(0);

  const [refresh, setRefresh] = useState(false);

  console.log('App mounted');

  const [delay, setDelay] = useState(100);
  const [isRunning, setIsRunning] = useState(false);

  if (refresh === true)
    didMount = true;

  useInterval(() => {
    setDelay(delay);
    if (waitCnt.current <= 0  && state.completed === 100)
      waitCnt.current = 4; 
    else if (waitCnt.current > 0)
      waitCnt.current -= 1;

    if (waitCnt.current <= 0)
      setState({completed: (state.completed > 100) ? 0 : state.completed + 5});
    else
      setState({completed: 0});
  }, isRunning ? delay : null);

  const stateRefresh = () => {
    setState({
      customers: '',
      completed: 0
    });

    setRefresh(true);
  }

  useEffect(() => {
    if (didMount) {
      setRefresh(false);
      setIsRunning(true);

      callApi()
      .then(res => setState({customers: res}))
      .catch(err => console.log(err))
      .finally(() =>setIsRunning(false));
    } else {
      console.log('state updated');
    }
  }, [state, didMount, refresh]);

  const { classes } = props
  return (
    <div>      
      {isInit ? (
      <ThemeProvider theme={theme}>
      <Paper className={classes.root}>
       <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>번호</TableCell>
              <TableCell>이미지</TableCell>
              <TableCell>이름</TableCell>
              <TableCell>생년월일</TableCell>
              <TableCell>성별</TableCell>
              <TableCell>직업</TableCell>
              <TableCell>설정</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { 
              state.customers ? state.customers.map(c => {
                return (<Customer  stateRefresh={stateRefresh} key={c.id} id={c.id} image={c.image} name={c.name} birthday={c.birthday} gender={c.gender} job={c.job}/>)
              }) : 
              <TableRow>
                <TableCell colSpan="6" align="center">
                  <CircularProgress className={classes.progress} variant="determinate" value={state.completed} />
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </Paper>
      <CustomerAdd stateRefresh={stateRefresh} />
      </ThemeProvider>
      ) : (
        ' 동기화 중입니다.'
      )}
    </div>
  );
}

export default withStyles(styles)(App);