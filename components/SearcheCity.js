import React, {useState, useEffect} from 'react';
import { StyleSheet, View, StatusBar, TextInput, Image, Text, TouchableWithoutFeedback, FlatList } from 'react-native';
import AutocompleteInput from 'react-native-autocomplete-input';

function SearcheCity(props) {

    const [childData, setChildData] = useState(false);
    const [cities, setCities] = useState([]);
    const [citiesFiltered, setCitiesFiltered] = useState([]);
    const [cityName, setCityName] = useState('');
    const [showList, setshowList] = useState('none');
    const [dataOfCity, setdataOfCity] = useState();

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    
    const getCities = () => {
        fetch('https://raw.githubusercontent.com/russ666/all-countries-and-cities-json/6ee538beca8914133259b401ba47a550313e8984/countries.min.json')
          .then((response) => response.json())
          .then((responseJson) => {
            
            const citiesArray = Object.values(responseJson);
            const arr = [];
             for(let i=0; i<5; i++){
                 for(let j=0; j<citiesArray[i].length; j++){
                    //console.log(citiesArray[i][j]);
                    arr.push(citiesArray[i][j]);
                 }
                //arr.push(citiesArray[i]);
                
            }
            //setCitiesFiltered(arr);
            setCities(arr);
          //console.log(arr);
          })
          .catch((error) => {
            console.error('Cities ERROR: ' + error);
          });
      }

    const searcheCity = (text) => {
      setCityName(text);
      if(cityName != null){
        setshowList('block');
        const cityUppper = text.toUpperCase();
      
        const newCity = cities.filter( city => {
          const cityListUpper = city.toUpperCase();
          return cityListUpper.match(cityUppper) 
        })
      setCitiesFiltered(newCity);
      }
      
    }

    const handleSearch = () =>{
      console.log(cityName);
      
        fetch('https://api.weatherapi.com/v1/forecast.json?key=ad4b8f61a78d45a598293412210308&q='+cityName+'&days=5&aqi=no&alerts=yes')
          .then((response) => response.json())
          .then((responseJson) => {
            setdataOfCity(responseJson);
            setChildData(true);
            setCityName('');
          })
          .catch((error) => {
            console.error('Forecast ERROR: ' + error);
          });
      
    }
   

    useEffect(() => {
      getCities();
    },[])

    return (
            <>
            {!childData
                ? 
                    <View style={styles.container}>
                      <StatusBar />
                      <View style={styles.searchBar} >
                          <TextInput style={styles.textInput} 
                            placeholder='City name' 
                            onChangeText={(text) =>searcheCity(text)} 
                            value={cityName}/>
                          <TouchableWithoutFeedback onPress={handleSearch} >
                              <Image style={styles.searchIcon} source={require('../assets/icons8-search-50.png')} />
                          </TouchableWithoutFeedback>
                      </View>
                      <View style={{display: showList, width: '300px', paddingRight: 5, paddingLeft: 5}}>
                        <FlatList
                          style={styles.flatListCities}
                          data={citiesFiltered}
                          renderItem={({item}) => 
                            <TouchableWithoutFeedback onPress={ () => {
                              setCityName(item);
                              setshowList('none');
                              }}>
                              <Text style={{padding: '5px', borderBottomWidth: 1, borderBottomColor: "#d0d0d0"}}>{item}</Text>
                            </TouchableWithoutFeedback>}
                          keyExtractor={(item,index) => index.toString()}/>
                      </View>
                    </View>
                :
                    <View style={styles.container}>
                    <StatusBar />

                    <View style={styles.searchBar} >
                          <TextInput style={styles.textInput} 
                            placeholder='City name' 
                            onChangeText={(text) =>searcheCity(text)} 
                            value={cityName}/>
                          <TouchableWithoutFeedback onPress={handleSearch} >
                              <Image style={styles.searchIcon} source={require('../assets/icons8-search-50.png')} />
                          </TouchableWithoutFeedback>
                      </View>
                      <View style={{display: showList, width: '300px', paddingRight: 5, paddingLeft: 5}}>
                        <FlatList
                          style={styles.flatListCities}
                          data={citiesFiltered}
                          renderItem={({item}) => 
                            <TouchableWithoutFeedback onPress={ () => {
                              setCityName(item);
                              setshowList('none');
                              }}>
                              <Text style={{padding: '5px', borderBottomWidth: 1, borderBottomColor: "#d0d0d0"}}>{item}</Text>
                            </TouchableWithoutFeedback>}
                          keyExtractor={(item,index) => index.toString()}/>
                      </View>
                    
                    <View style={{ width: '300px', alignItems: 'center' }}>
                        <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#202c58' }}> { dataOfCity.location.name }, { dataOfCity.location.country } </Text>
                        <Text style={{ fontSize: '15px', fontWeight: '700', color: '#202c58bf' }}>
                          { days[new Date( parseInt(dataOfCity.location.localtime_epoch+'000') ).getDay()]}, { new Date( parseInt(dataOfCity.location.localtime_epoch+'000') ).getDate()} { months[new Date( parseInt(dataOfCity.location.localtime_epoch+'000') ).getMonth()] }
                          </Text>
                    </View>

                    <View style={{ width: '300px' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: '70px', marginRight: 50, color: '#202c58' }}>{ dataOfCity.current.temp_c }°</Text>
                            <Image style={{ width: '70px', height: '70px', marginLeft: 50 }} source={{ uri: 'https:'+dataOfCity.forecast.forecastday[0].day.condition.icon }} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ marginRight: '0px', fontWeight: 'bold', color: '#202c58' }}> { dataOfCity.forecast.forecastday[0].day.condition.text } </Text>
                            <Text style={{ marginRight: '20px', fontWeight: 'bold', color: '#202c58bf' }}> {dataOfCity.forecast.forecastday[0].day.maxtemp_c}° / {dataOfCity.forecast.forecastday[0].day.mintemp_c}°</Text>
                            <Text style={{ marginLeft: '0px', fontWeight: 'bold', color: '#202c58bf' }}> Feels like {dataOfCity.current.feelslike_c}°</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: '30px' }}>
                        <View style={{ marginRight: '23px' }}>
                            <View style={{ flexDirection: 'row', marginBottom: '20px' }}>
                                <Image style={{ height: '20px', width: '22px' }} source={require('../assets/weather-icons/icons8-sunrise-100.png')} />
                                <Text style={{ marginLeft: '5px', fontWeight: 'bold', color: '#202c58' }}>07:00 am</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Image style={{ height: '20px', width: '22px' }} source={require('../assets/weather-icons/icons8-wet-100.png')} />
                                <Text style={{ marginLeft: '5px', fontWeight: 'bold', color: '#202c58' }}>07:00 am</Text>
                            </View>
                        </View>
                        <View style={{ marginRight: '23px' }}>
                            <View style={{ flexDirection: 'row', marginBottom: '20px' }}>
                                <Image style={{ height: '20px', width: '22px' }} source={require('../assets/weather-icons/icons8-sunset-100.png')} />
                                <Text style={{ marginLeft: '5px', fontWeight: 'bold', color: '#202c58' }}>07:00 am</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Image style={{ height: '20px', width: '22px' }} source={require('../assets/weather-icons/ultraviolet.png')} />
                                <Text style={{ marginLeft: '5px', fontWeight: 'bold', color: '#202c58' }}>07:00 am</Text>
                            </View>
                        </View>
                        <View>
                            <View style={{ flexDirection: 'row', marginBottom: '20px' }}>
                                <Image style={{ height: '20px', width: '22px' }} source={require('../assets/weather-icons/icons8-wind-100.png')} />
                                <Text style={{ marginLeft: '5px', fontWeight: 'bold', color: '#202c58' }}>07:00 am</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Image style={{ height: '20px', width: '22px' }} source={require('../assets/weather-icons/icons8-pressure.png')} />
                                <Text style={{ marginLeft: '5px', fontWeight: 'bold', color: '#202c58' }}>07:00 am</Text>
                            </View>
                        </View>
                    </View>
                </View>}




        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        //justifyContent: 'flex-start',
        backgroundColor: 'rgb(91, 225, 255)'
    },
    searchBar: {
        width: 300,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
        paddingRight: 5,
        paddingLeft: 5,
    },
    textInput: {
        flex: 1,
        height: 30,
        padding: 5,
        backgroundColor: '#fdfdfd',
        marginRight: 5
    },
    searchIcon: {
        width: 35,
        height: 35,
        padding: 5
    },
    viewListCities: {
      width: '300px',
      paddingRight: 5,
      paddingLeft: 5
    },
    flatListCities: {
      width: '248px',
      height: '120px',
      backgroundColor: '#fdfdfd',
    }
});

export default SearcheCity

//*-**********************************************************************************************************







// // Example of React Native AutoComplete Input
// // https://aboutreact.com/example-of-react-native-autocomplete-input/

// // Import React in our code
// import React, {useState, useEffect} from 'react';

// // Import all the components we are going to use
// import {
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from 'react-native';

// // Import Autocomplete component
// import Autocomplete from 'react-native-autocomplete-input';

// const SearcheCity = () => {
//   // For Main Data
//   const [films, setFilms] = useState([]);
//   // For Filtered Data
//   const [filteredFilms, setFilteredFilms] = useState([]);
//   // For Selected Data
//   const [selectedValue, setSelectedValue] = useState({});

//   useEffect(() => {
//     fetch('https://raw.githubusercontent.com/russ666/all-countries-and-cities-json/6ee538beca8914133259b401ba47a550313e8984/countries.min.json')
//       .then((res) => res.json())
//       .then((json) => {
//         //const {results: films} = json;
//         const citiesArray = Object.values(json);
//              const arr = [];
//               for(let i=0; i<citiesArray.length; i++){
//                   for(let j=0; j<citiesArray[i].length; j++){
//                      //console.log(citiesArray[i][j]);
//                      arr.push(citiesArray[i][j]);
//                   }
// //                 //arr.push(citiesArray[i]);
                
//              }
//         setFilms(arr);
//         //setting the data in the films state
//         //console.log(json)
//       })
//       .catch((e) => {
//         alert(e);
//       });
//   }, []);

//   const findFilm = (query) => {
//     // Method called every time when we change the value of the input
//     if (query) {
//       // Making a case insensitive regular expression
//       const regex = new RegExp(`${query.trim()}`, 'i');
//       // Setting the filtered film array according the query
//       setFilteredFilms(
//           films.filter((film) => film.search(regex) >= 0)
//       );
//     } else {
//       // If the query is null then return blank
//       setFilteredFilms([]);
//     }
//   };

//   return (
//     <SafeAreaView style={{flex: 1}}>
//       <View style={styles.container}>
//         <Autocomplete
//           //autoCapitalize="none"
//           //autoCorrect={false}
//           containerStyle={styles.autocompleteContainer}
//           // Data to show in suggestion
//           data={filteredFilms}
//           // Default value if you want to set something in input
//           // defaultValue={
//           //   JSON.stringify(selectedValue) === '{}' ?
//           //   '' :
//           //   selectedValue
//           // }
//           // Onchange of the text changing the state of the query
//           // Which will trigger the findFilm method
//           // To show the suggestions
//           onChangeText={(text) => findFilm(text)}
//           placeholder="Enter the film title"
//           //renderItem={({item}) => (
//             // For the suggestion view
//             // <TouchableWithoutFeedback
//             //   onPress={
//             //     // setSelectedValue(item);
//             //     // setFilteredFilms([]);
//             //     console.log('test')
//             //   }>
//             //   <Text style={styles.itemText}>
//             //       {/* {item} ! */}
//             //   </Text>
//             // </TouchableWithoutFeedback>
//           //)}
//         />
//         {/* <View style={styles.descriptionContainer}>
//           {films.length > 0 ? (
//             <>
//               <Text style={styles.infoText}>
//                    Selected Data
//               </Text>
//               <Text style={styles.infoText}>
//                 {JSON.stringify(selectedValue)}
//               </Text>
//             </>
//           ) : (
//             <Text style={styles.infoText}>
//                 Enter The Film Title
//             </Text>
//           )}
//         </View> */}
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#F5FCFF',
//     flex: 1,
//     padding: 16,
//     marginTop: 40,
//   },
//   autocompleteContainer: {
//     backgroundColor: '#ffffff',
//     borderWidth: 0,
//   },
//   descriptionContainer: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   itemText: {
//     fontSize: 15,
//     paddingTop: 5,
//     paddingBottom: 5,
//     margin: 2,
//     color: "#F5FCFF"
//   },
//   infoText: {
//     textAlign: 'center',
//     fontSize: 16,
//   },
// });
// export default SearcheCity;