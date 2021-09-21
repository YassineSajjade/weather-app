import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, TextInput, Image, Text, TouchableWithoutFeedback, FlatList, BackHandler } from 'react-native';
import * as Progress from 'react-native-progress';

function SearcheCity(props) {

  const [childData, setChildData] = useState(false);
  const [cities, setCities] = useState([]);
  const [citiesFiltered, setCitiesFiltered] = useState([]);
  const [cityName, setCityName] = useState('');
  const [showList, setshowList] = useState('none');
  const [dataOfCity, setdataOfCity] = useState();

  const [uv, setUV] = useState('');
  const [sunRise, setSunRise] = useState('');
  const [sunSet, setSunSet] = useState('');

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


  const getCities = () => {
    fetch('https://raw.githubusercontent.com/russ666/all-countries-and-cities-json/6ee538beca8914133259b401ba47a550313e8984/countries.min.json')
      .then((response) => response.json())
      .then((responseJson) => {

        const citiesArray = Object.values(responseJson);
        const arr = [];
        for (let i = 0; i < citiesArray.length; i++) {
          for (let j = 0; j < citiesArray[i].length; j++) {
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
        console.log('getCities ERROR: ' + error);
      });
  }

  const searcheCity = (text) => {
    setCityName(text);
    if (cityName != null) {
      setshowList('flex');
      const cityUppper = text.toUpperCase();

      const newCity = cities.filter(city => {
        const cityListUpper = city.toUpperCase();
        return cityListUpper.match(cityUppper)
      })
      setCitiesFiltered(newCity);
    }

  }

  const handleSearch = () => {
    if (cityName.length > 0) {

      fetch('https://api.weatherapi.com/v1/current.json?key=ad4b8f61a78d45a598293412210308&q=' + cityName + '&aqi=no')
        .then((response) => response.json())
        .then((responseJson) => {
          setUV(responseJson.current.uv);
          //console.log(uv);
        })
        .catch((error) => {
          console.error('UV ERROR: ' + error);
        });

      fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=243b73dbf2837d9b3bfb97b87b1879dd&units=metric')
        .then((response) => response.json())
        .then((responseJson) => {
          //console.log(responseJson);
          setdataOfCity(responseJson);
          setChildData(true);
          setCityName('');
          let sunset = new Date(parseInt(responseJson.city.sunset + '000')).getUTCHours();
          let sunsetMin = new Date(parseInt(responseJson.city.sunset + '000')).getUTCMinutes();
          let sunrise = new Date(parseInt(responseJson.city.sunrise + '000')).getUTCHours();
          let sunriseMin = new Date(parseInt(responseJson.city.sunrise + '000')).getUTCMinutes();
          console.log(sunsetMin+' / '+sunriseMin);
          if (sunset < 10) {
            setSunSet('0'+sunset+':'+sunsetMin);
          } else {
            setSunSet(sunset+':'+sunsetMin);
          }

          if (sunrise < 10) {
            setSunRise('0'+sunrise+':'+sunriseMin);
          } else { 
            setSunRise(sunrise+':'+sunriseMin);
          }

        })
        .catch((error) => {
          console.log('SearchCity ERROR: ' + error);
        });
    } else {
      alert('Enter city name first..');
    }

  }

  useEffect(() => {
    getCities();
  }, []);

  const backAction = () => {
    props.history.push('/');
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => {
      BackHandler.addEventListener('hardwareBackPress', backAction);
    }
  }, [])


  


  return (
    <>
      {!childData
        ?
        <View style={styles.container}>
          <StatusBar />

          <View style={styles.searchBar} >
            <TextInput style={styles.textInput}
              placeholder='City name'
              onChangeText={(text) => searcheCity(text)}
              value={cityName} />
            <TouchableWithoutFeedback onPress={handleSearch}>
              <Image style={styles.searchIcon} source={require('../assets/icons8-search-50.png')} />
            </TouchableWithoutFeedback>
          </View>

          {/* FlatList for showing list of cities */}
          <View style={{ display: showList }}>
            <FlatList
              style={styles.flatListCities}
              data={citiesFiltered}
              renderItem={({ item }) =>
                <TouchableWithoutFeedback onPress={() => {
                  setCityName(item);
                  setshowList('none');
                }}>
                  <Text style={{ padding: 5, borderBottomWidth: 1, borderBottomColor: "#d0d0d0" }}>{item}</Text>
                </TouchableWithoutFeedback>}
              keyExtractor={(item, index) => index.toString()} />
          </View>
        </View>
        :
        <View style={styles.container}>
          <StatusBar />

          <View style={styles.searchBar} >
            <TextInput style={styles.textInput}
              placeholder='City name'
              onChangeText={(text) => searcheCity(text)}
              value={cityName} />
            <TouchableWithoutFeedback onPress={handleSearch}>
              <Image style={styles.searchIcon} source={require('../assets/icons8-search-50.png')} />
            </TouchableWithoutFeedback>
          </View>

          {/* FlatList for showing list of cities */}
          <View style={{ display: showList }}>
            <FlatList
              style={styles.flatListCities}
              data={citiesFiltered}
              renderItem={({ item }) =>
                <TouchableWithoutFeedback onPress={() => {
                  setCityName(item);
                  setshowList('none');
                }}>
                  <Text style={{ padding: 5, borderBottomWidth: 1, borderBottomColor: "#d0d0d0" }}>{item}</Text>
                </TouchableWithoutFeedback>}
              keyExtractor={(item, index) => index.toString()} />
          </View>

          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <Text style={{ fontSize: 20, color: '#202c58', fontWeight: 'bold' }}> { dataOfCity.city.name }, { dataOfCity.city.country } </Text>
            <Text style={{ fontSize: 15, color: '#202c58bf', fontWeight: '700' }}>
            { days[new Date( parseInt(dataOfCity.list[0].dt+'000') ).getDay()]}, { new Date( parseInt(dataOfCity.list[0].dt+'000') ).getDate()} { months[new Date( parseInt(dataOfCity.list[0].dt+'000') ).getMonth()] }
            </Text>
          </View>

          <View style={{ marginTop: 25 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 70, color: '#202c58', flex: 1, textAlignVertical: 'center', textAlign: 'center' }}>{ dataOfCity.list[0].main.temp.toFixed(0) }°</Text>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Image style={{ width: 95, height: 95 }} source={{ uri: 'https://openweathermap.org/img/wn/'+dataOfCity.list[0].weather[0].icon+'@4x.png' }} />
              </View>
            </View>

            <View style={{ flexDirection: 'row' }} >
              <Text style={{ flex: 1, textAlign: 'left', fontWeight: 'bold', color: '#202c58' }}> { dataOfCity.list[0].weather[0].description }  </Text>
              <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', color: '#202c58bf' }}> {dataOfCity.list[0].main.temp_max.toFixed(0)}° / {dataOfCity.list[0].main.temp_min.toFixed(0)}°</Text>
              <Text style={{ flex: 1, textAlign: 'right', fontWeight: 'bold', color: '#202c58bf' }}> Feels like {dataOfCity.list[0].main.feels_like.toFixed(0)}°</Text>
            </View>
          </View>
          


          <View style={{ marginTop: 40, flexDirection: 'row' }}>

            <View style={{ flex: 1, alignItems: 'flex-start' }}>
              <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                <Image style={styles.imgs} source={require('../assets/weather-icons/icons8-sunrise-100.png')} />
                <Text style={styles.texts}>{sunRise + ''}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Image style={styles.imgs} source={require('../assets/weather-icons/icons8-wet-100.png')} />
                <Text style={styles.texts}>{dataOfCity.list[0].main.humidity} %</Text>
              </View>
            </View>

            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                <Image style={styles.imgs} source={require('../assets/weather-icons/icons8-sunset-100.png')} />
                <Text style={styles.texts}>{sunSet + ''}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Image style={styles.imgs} source={require('../assets/weather-icons/ultraviolet.png')} />
                <Text style={styles.texts}> {uv} UV </Text>
              </View>
            </View>

            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                <Image style={styles.imgs} source={require('../assets/weather-icons/icons8-wind-100.png')} />
                <Text style={styles.texts}>{(dataOfCity.list[0].wind.speed * 3.6).toFixed(0)} Km/h</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Image style={styles.imgs} source={require('../assets/weather-icons/icons8-pressure.png')} />
                <Text style={styles.texts}>{dataOfCity.list[0].main.pressure} hPa </Text>
              </View>
            </View>

          </View>

          

        </View>
      }




    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    //justifyContent: 'flex-start',
    backgroundColor: 'rgb(91, 225, 255)',
    paddingStart: 20,
    paddingEnd: 20,
  },
  searchBar: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 5,

  },
  textInput: {
    flex: 1,
    height: 35,
    padding: 5,
    backgroundColor: '#fdfdfd',
    marginRight: 5
  },
  searchIcon: {
    width: 35,
    height: 35,
    padding: 5
  },
  flatListCities: {
    height: 120,
    backgroundColor: '#fdfdfd',
  },
  imgs: {
    height: 20,
    width: 22,
    marginRight: 7
  },
  texts: {
    color: '#202c58',
    fontWeight: 'bold',
    //marginLeft: '5px'
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