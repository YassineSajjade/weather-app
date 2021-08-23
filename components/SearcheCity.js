import React, {useState, useEffect} from 'react';
import { StyleSheet, View, StatusBar, TextInput, Image, Text, TouchableWithoutFeedback } from 'react-native';
import AutocompleteInput from 'react-native-autocomplete-input';

function SearcheCity(props) {

    const [childData, setChildData] = useState(false);
    const [cities, setCities] = useState([]);
    const [citiesFiltered, setCitiesFiltered] = useState([]);
    const [cityName, setCityName] = useState('');

    const toggleChildData = () => {
        const city_name = cityName.toUpperCase();
        
        for(let i=0; i<citiesFiltered.length; i++){
            for(let j=0; j<citiesFiltered[i].length; j++){
                // if(citiesFiltered[i][j].toUpperCase() === city_name){
                //     console.log(citiesFiltered[i][j].toUpperCase());
                //     //setCityName('');
                //     setChildData(true);
                //     break;
                //  }
                //  //
                // else{
                //     setChildData(false);
                // }
                console.log(citiesFiltered[i][j].length);
            }
           
        }
        
        // if(!childData){
        //     setChildData(!childData);
        // }
    }

    // const textInputHandler = (event) => {
    //     const name = event.target.value;
    //     //setcityName(name);
    //     console.log(name);
    // }
    
    
    const getCities = () => {
        fetch('https://raw.githubusercontent.com/russ666/all-countries-and-cities-json/6ee538beca8914133259b401ba47a550313e8984/countries.min.json')
          .then((response) => response.json())
          .then((responseJson) => {
            //setCities(responseJson);
            
            const citiesArray = Object.values(responseJson);
            const arr = [];
             for(let i=0; i<citiesArray.length; i++){
                //  for(let j=0; j<citiesArray[i].length; j++){
                //     //console.log(citiesArray[i][j]);
                //     arr.push(citiesArray[i][j]);
                //  }
                arr.push(citiesArray[i]);
                
            }
            setCitiesFiltered(arr);
          //console.log(arr);
          })
          .catch((error) => {
            console.error('Cities ERROR: ' + error);
          });
      }

      const handleData = () =>{
        const data =[];
        for(let i=0; i<citiesFiltered.length; i++){
            for(let j=0; j<citiesFiltered[i].length; j++){
                if(citiesFiltered[i][j].toUpperCase() === cityName.toUpperCase()){
                    data.push(citiesFiltered[i][j]);
                }
            }
        }
        console.log(data);
        //setCities(data);
        return data;
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
                        {/* <TextInput style={styles.textInput} placeholder='City name' onChangeText={(text) => setCityName(text)} /> */}
                        <AutocompleteInput
                            containerStyle={styles.AutocompleteStyle}
                            placeholder= 'City name...'
                            placeholderTextColor= '#202c58'
                            //value={cityName}
                            data= {handleData()}
                            flatListProps={{
                                keyExtractor: (_, idx) => idx,
                                renderItem: ({ item }) => <Text>{item}</Text>,
                              }}
                            />
                        <TouchableWithoutFeedback onPress={toggleChildData}>
                            <Image style={styles.searchIcon} source={require('../assets/icons8-search-50.png')} />
                        </TouchableWithoutFeedback>
                    </View>
                    </View>
                :
                    <View style={styles.container}>
                    <StatusBar />

                    <View style={styles.searchBar} >
                        <TextInput style={styles.textInput} placeholder='City name' />
                        <TouchableWithoutFeedback onPress={toggleChildData}>
                            <Image style={styles.searchIcon} source={require('../assets/icons-search.png')} />
                        </TouchableWithoutFeedback>
                    </View>
                    
                    <View style={{ width: '300px', alignItems: 'center' }}>
                        <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#202c58' }}>Casablanca, MA</Text>
                        <Text style={{ fontSize: '15px', fontWeight: '700', color: '#202c58bf' }}>Monday, 09 Aug</Text>
                    </View>

                    <View style={{ width: '300px' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: '70px', marginRight: 50, color: '#202c58' }}>19°</Text>
                            <Image style={{ width: '70px', height: '70px', marginLeft: 50 }} source={require('../assets/weather-icons/sun-240.png')} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ marginRight: '10px', fontWeight: 'bold', color: '#202c58' }}>Sunny day</Text>
                            <Text style={{ marginRight: '40px', fontWeight: 'bold', color: '#202c58bf' }}>26° / 11°</Text>
                            <Text style={{ marginLeft: '20px', fontWeight: 'bold', color: '#202c58bf' }} >Feels like 21°</Text>
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
        padding: 5,
        margin: 10,
    },
    AutocompleteStyle: {
        flex: 1,
    //     left: 0,
    //     position: 'absolute',
    //     right: 0,
    //     top: 0,
    //     zIndex: 1,
        // color: 'rgb(32, 44, 88)',
        marginRight: 5,
      },
    // textInput: {
    //     flex: 1,
    //     height: 30,
    //     padding: 5
    // },
    searchIcon: {
        width: 42,
        height: 42
    }
});

export default SearcheCity
