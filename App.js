import React, { useState, createContext} from 'react';
import { NativeRouter as Router, Switch, Route, Link } from "react-router-native";


import Main from './components/Main';
import SearcheCity from './components/SearcheCity';

//export const DataContext = createContext();

export default function App() {


//  const [fragment, setFragment] = useState(1);

//  let child;

//  const toggleFragments = () => {
     //if(fragment === 1){
      //setFragment(2);
      //child = <SearcheCity/>;}
  //  }else if(fragment === 2){
  //    setFragment(1);
  //    //child = <Main/>;
  //  }
  // alert(fragment);
  // console.log('test');
//  }

//  if(fragment === 1){
//    child = <Main />
//  }else if(fragment === 2){
//    child = <SearcheCity />
//  }

  return (
    // <DataContext.Provider value={{page:fragment, toggleFragments:toggleFragments}} >
    //   {child}
    // </DataContext.Provider>
    <Router>
      <>
        <Switch>
          <Route exact path='/' component={Main} />
          <Route exact path='/search' component={SearcheCity} />
        </Switch>
      </>
    </Router>

  );
}


