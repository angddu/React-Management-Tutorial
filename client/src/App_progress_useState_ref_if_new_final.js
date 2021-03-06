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

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 

const callApi = async () => {
  const response = await fetch('/api/customers');
  const body = await response.json();
  await sleep(1000);
  return body;
};

function App(props) {
  const didMount = useDidMount();  
  const [state, setState] = useState({customers: null, completed: 0});
  const waitCnt = useRef(0);

  //console.log('App mounted');

  const stateRefresh = () => {
    setState({
      customers: ''
    });

    const timer = setInterval(() => {
        setState((state) => ({completed: (state.completed > 100) ? 0 : state.completed + 20}));
    }, 100);
    callApi()
    .then(res => setState({customers: res}))
    .catch(err => console.log(err))
    .finally(() => clearInterval(timer));
  }

  useEffect(() => {
    if (waitCnt.current <= 0  && state.completed === 100)
      waitCnt.current = 4; 
    else if (waitCnt.current > 0)
      waitCnt.current -= 1;

    const progress = () => {
      if (waitCnt.current <= 0)
        setState((state) => ({completed: (state.completed > 100) ? 0 : state.completed + 20}));
      else 
        setState({completed: 0});
    };

    if (didMount) {
      const timer = setInterval(progress, 100);

      callApi()
      .then(res => setState({customers: res}))
      .catch(err => console.log(err))
      .finally(() => clearInterval(timer));
    } else {
      //console.log('state updated');
    }
  }, [state, didMount]);

  const { classes } = props
  return (
    <div>      
      <Paper className={classes.root}>
       <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>??????</TableCell>
              <TableCell>?????????</TableCell>
              <TableCell>??????</TableCell>
              <TableCell>????????????</TableCell>
              <TableCell>??????</TableCell>
              <TableCell>??????</TableCell>
              <TableCell>??????</TableCell>
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
    </div>
  );
}

export default withStyles(styles)(App);