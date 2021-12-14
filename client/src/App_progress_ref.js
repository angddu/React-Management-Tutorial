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
  await sleep(60000);
  return body;
};

function App(props) {
  const didMount = useDidMount();  
  const [state, setState] = useState({customers: null, completed: 0});
  const completed_ref = useRef(0);

  //console.log('App mounted');

  const stateRefresh = () => {
    setState({
      customers: ''
    });
    callApi()
    .then(res => setState({customers: res}))
    .catch(err => console.log(err));
  }

  useEffect(() => {
    function progress(){
      completed_ref.current += 5;

      if (completed_ref.current > 100)
        completed_ref.current = 0;

      setState({completed: completed_ref.current})
      //console.log("completed : ", completed_ref.current);
    }
   
    if (didMount) {
      const timer = setInterval(progress, 200);

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
              <TableCell>번호</TableCell>
              <TableCell>이미지</TableCell>
              <TableCell>이름</TableCell>
              <TableCell>생년월일</TableCell>
              <TableCell>성별</TableCell>
              <TableCell>직업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { 
              //state.customers && state.customers.map(c => { return <Customer key={c.id} id={c.id} image={c.image} name={c.name} birthday={c.birthday} gender={c.gender} job={c.job}/>}) 
              state.customers ? state.customers.map(c => {
                return (<Customer key={c.id} id={c.id} image={c.image} name={c.name} birthday={c.birthday} gender={c.gender} job={c.job}/>)
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