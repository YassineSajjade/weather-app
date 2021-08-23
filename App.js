import React, { useState} from 'react';

import Main from './components/Main';
import SearcheCity from './components/SearcheCity';


export default function App() {

 const [fragment, setFragment] = useState(1);

 let child;

 const toggleFragments = () => {
   if(fragment === 1){
     setFragment(2);
     child = <SearcheCity/>;
   }else if(fragment === 2){
     setFragment(1);
     child = <Main/>;
   }
 }

 if(fragment === 1){
   child = <Main page={fragment} toggle={toggleFragments}/>
 }else if(fragment === 2){
   child = <SearcheCity page={fragment} toggle={toggleFragments}/>
 }

  return (
    child
  );
}


