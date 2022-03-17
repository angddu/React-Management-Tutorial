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

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from "@material-ui/icons/Menu";
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { alpha } from '@material-ui/core/styles';

const theme = unstable_createMuiStrictModeTheme();
const styles = theme => ({
  root: {
    width: '100%',
    minWidth: 1080
  },
  table: {
    minWidth: 1080
  },
  progress: {
    margin: theme.spacing(2)
  },
  menu: {
    marginTop: 15,
    marginBottom: 15,
    display: 'flex',
    justifyContent: 'center'
  },
  paper: {
    marginLeft: 18,
    marginRight: 18
  },
  grow: {
    flexGrow: 1,
  },
  tableHead: {
    fontSize: '1.0rem'
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(9),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(10),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
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
  const [searchKeyword, setSearchKeyword] = useState('');
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
      completed: 0,
    });
    setRefresh(true);
    setSearchKeyword('');
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

  const handleValueChange = (e) => {
    console.log("KEUN1 :" + e.target.value);
    setSearchKeyword(e.target.value);
  }

  const fillteredComponents = (data) => {
    console.log("KEUN T : "+ searchKeyword);
    data = data.filter((c) => {
      return c.name.indexOf(searchKeyword) > -1;
    });
    return data.map((c) =>{
      return (<Customer  stateRefresh={stateRefresh} key={c.id} id={c.id} image={c.image} name={c.name} birthday={c.birthday} gender={c.gender} job={c.job}/>)
    });
  }

  const { classes } = props;
  const cellList = [
    {id: 1, name: "번호"}, 
    {id: 2, name: "프로필 이미지"}, 
    {id: 3, name: "이름"}, 
    {id: 4, name: "생년월일"}, 
    {id: 5, name: "성별"}, 
    {id: 6, name: "직업"}, 
    {id: 7, name: "설정"}
  ]
  return (
    <div className={classes.root}>      
      <AppBar position="static">
        <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer">
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" color="inherit" noWrap>
          고객 관리 시스템
          </Typography>
          <div className={classes.grow} />
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="검색하기"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                name="searchKeyword"
                value={searchKeyword}
                onChange={handleValueChange} 
              />
            </div>
        </Toolbar>
      </AppBar>
      {isInit ? 
        (<div>
        <div className={classes.menu}>
          <CustomerAdd stateRefresh={stateRefresh} />
        </div>
        <Paper className={classes.paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {cellList.map((c, index) => { 
                return <TableCell className={classes.tableHead} key={index}>{c.name}</TableCell>
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              { 
                state.customers ?
                fillteredComponents(state.customers)
                : 
                <TableRow>
                  <TableCell colSpan="6" align="center">
                    <CircularProgress className={classes.progress} variant="determinate" value={state.completed} />
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </Paper>
        </div>) : (<div>(
        ' 동기화 중입니다.'
      )</div>)}
    </div>
  );
}

export default withStyles(styles)(App);