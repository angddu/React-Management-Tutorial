import Customer from './components/Customer';
import './App.css';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
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
  }
});

function useDidMount() {
  const didMountRef = useRef(true);

  useEffect(() => {
    didMountRef.current = false;
  }, []);
  return didMountRef.current
};

const callApi = async () => {
  const response = await fetch('/api/customers');
  const body = await response.json();
  return body;
};

function App(props) {
  const didMount = useDidMount();  
  const [state, setState] = useState({customers: null});

  console.log('App mounted');

  useEffect(() => {
    if (didMount) {
      console.log('mounted');
      callApi()
      .then(res => setState({customers: res}))
      .catch(err => console.log(err));
    } else {
      console.log('state updated');
    }
  }, [state, didMount]);

  const { classes } = props
  return (
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
            { state.customers && state.customers.map(c => { return <Customer key={c.id} id={c.id} image={c.image} name={c.name} birthday={c.birthday} gender={c.gender} job={c.job}/>}) }
          </TableBody>
        </Table>
      </Paper>
  );
}

export default withStyles(styles)(App);