import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, StatusBar, TouchableWithoutFeedback} from 'react-native';

function Main(props) {

    const [weatherForecastData, seatWeatherForecastData] = useState();
    const [forecastDays, seatForecastDays] = useState([]);
    const [forecastHours, seatForecastHours] = useState([]);

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    

    const getWeatherForecast = (dayClicked) => {

        fetch('https://api.openweathermap.org/data/2.5/forecast?q=casablanca&appid=243b73dbf2837d9b3bfb97b87b1879dd&units=metric')
          .then((response) => response.json())
          .then((responseJson) => {
            seatWeatherForecastData(responseJson);
            console.log(responseJson);
            getForecastDays(responseJson, dayClicked);
          })
          .catch((error) => {
            console.log('openweathermap ERROR: ' + error);
          });
      }

      // ****** get ForeCast Days ******
      const getForecastDays = (responseJson, dayClicked) => {
        let newArrayDays = []; 
        let newArrayHours = [];

        let dtStrToInt,day,month,fDate,hour,icon,temp ;
        
        for (let i = 0; i < responseJson.list.length; i++) {

          dtStrToInt = parseInt(responseJson.list[i].dt + '000');
          day = days[new Date(dtStrToInt).getDay()];
          month = months[new Date(dtStrToInt).getMonth()];
          fDate = new Date(dtStrToInt).getDate();

          hour = responseJson.list[i].dt_txt.slice(11, 16);
          icon = responseJson.list[i].weather[0].icon;
          temp = responseJson.list[i].main.temp;
          
          let objDay = { "id": i, "day": day, "date": fDate+' '+month};
          let objHour = {};

          // ****** FlatList of Hours ******
          //Check what a Day is !!!
          if(!dayClicked){
             if(day === days[new Date().getDay()]){ //==> If the day == Today
                objHour = { 'id': i, 'day': day, 'hour': hour, 'icon': icon, 'temp': temp }
                newArrayHours.push(objHour);
            }
          }else if(day === dayClicked){
            objHour = { 'id': i, 'day': day, 'hour': hour, 'icon': icon, 'temp': temp }
            newArrayHours.push(objHour);
          }
         
            

            

          // ****** FlatList of Days ******
          if (newArrayDays.length === 0) {
            newArrayDays.push(objDay);
          }else{
            if(!newArrayDays.some(item => item.day === day)){
                newArrayDays.push(objDay)
            }
          }
          
        }
        seatForecastDays(newArrayDays);
        seatForecastHours(newArrayHours);
        //console.log(newArrayHours);
      }
    
      
    
    
      useEffect(() => {
        getWeatherForecast();
        
      }, []);
    
    
      const ItemDay = ({ day, date }) => (
        <TouchableWithoutFeedback onPress={() => getWeatherForecast(day) }>
          <View style={styles.containerDay}>
            <Text style={styles.day}>{day}, {date}</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    
      const renderItemDay = ({ item }) => (
        <ItemDay day={item.day} date={item.date} />
      );
    
      const ItemForcast = ({ hour, icon, temp }) => (
        <View style={styles.containerForcast}>
          <Text style={styles.forcastHour} >{hour}</Text>
          <Image style={styles.forcastIcon} source={{ uri: 'https://openweathermap.org/img/wn/'+icon+'@2x.png' }} />
          <Text style={styles.forcastTemp} >{temp.toFixed(0)}°</Text>
        </View>
      );
    
      const renderForcast = ({ item }) => (
        <ItemForcast hour={item.hour} icon={item.icon} temp={item.temp} />
      );


    return (
        <View style={styles.container}>
            <StatusBar />
            { weatherForecastData 
              ? 
              <>
                <View style={styles.header} >
                    <Text style={styles.city}>{weatherForecastData.city.name}, {weatherForecastData.city.country}</Text>
                    <TouchableWithoutFeedback onPress={props.toggle}>
                      <Image style={{ width: '40px', height: '40px'}} source={ require('../assets/icons8-search-50.png')} />
                    </TouchableWithoutFeedback>
                </View>
 
                <View style={styles.containerIcon}>
                    <Image style={styles.icon} source={{ uri: 'https://openweathermap.org/img/wn/'+weatherForecastData.list[0].weather[0].icon+'@4x.png'}} />
                </View>

                <View style={styles.description}>
                   <Text style={styles.descText}>{weatherForecastData.list[0].weather[0].main}</Text>
                </View>

                <View style={styles.temperature}>
                    <Text style={styles.temp}>{weatherForecastData.list[0].main.temp.toFixed(0)}°</Text>
                </View>
           
                <View style={styles.statistics}>
                    <View style={styles.statisticsChilds1}>
                        <Image style={styles.statisticsIcons} source={require('../assets/weather-icons/icons8-wet-100.png')} />
                        <Text style={styles.statisticsText}>{weatherForecastData.list[0].main.humidity} %</Text>
                    </View>
                    <View style={styles.statisticsChilds2}>
                        <Image style={styles.statisticsIcons} source={require('../assets/weather-icons/icons8-wind-100.png')} />
                        <Text style={styles.statisticsText}> {(weatherForecastData.list[0].wind.speed * 3.6).toFixed(0)} Km/h </Text>
                    </View>
                </View>
                
                <View style={styles.viewDays}>
                    <FlatList
                        data={forecastDays}
                        renderItem={renderItemDay}
                        keyExtractor={(item) => item.id.toString()}
                        //contentContainerStyle={{ alignItems: 'center' }}
                        horizontal />
                </View>

                <View style={styles.viewForcast}>
                    <FlatList
                        data={forecastHours}
                        renderItem={renderForcast}
                        keyExtractor={(item) => item.id.toString()}
                        //contentContainerStyle={{ alignItems: 'center' }}
                        horizontal />
                </View> 
              </> 
              :
               console.log('null') }


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      //alignItems: 'center',
      //justifyContent: 'center',
      backgroundColor: 'rgb(91, 225, 255)'
    },
    header: {
      //backgroundColor: 'blue',
      //alignItems: 'center',
      
      flexDirection: 'row',
      paddingTop: 10,
      paddingBottom: 10,
      paddingStart: 20,
      paddingEnd: 20,
    },
    city: {
      flex: 1,
      fontWeight: 'bold',
      fontSize: 30,
      color: 'rgb(32, 44, 88)',
      //marginRight: 50,
      //mrginLeft: 50
    },
    containerIcon: {
      // backgroundColor: 'yellow',
      alignItems: 'center',
    },
    icon: {
      padding: 100,
      width: 200,
      height: 200,
    },
    description: {
      //alignItems: 'center',
      //backgroundColor: 'red'
      textAlign:'center'
    },
    descText: {
      color: 'rgb(54, 113, 155)',
      fontWeight: 'bold',
      fontSize: 20,
      alignSelf: 'stretch',
    },
    temperature: {
      //alignItems: 'center'
      textAlign:'center'
    },
    temp: {
      color: 'rgb(32, 44, 88)',
      fontWeight: 'bold',
      fontSize: 90,
      alignSelf: 'stretch',
    },
    statistics: {
      //backgroundColor: 'orange',
      // justifyContent: 'center',
      display: 'flex',
      flexDirection: 'row'
    },
    statisticsChilds1: {
      justifyContent:'flex-start',
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      //backgroundColor: '#fdf',
      marginStart: 30,
    },
    statisticsChilds2: {
      justifyContent:'flex-end',
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      marginEnd: 30
    },
    statisticsIcons: {
      width: 23,
      height: 23,
      marginRight: 15,
      // marginStart:20
    },
    statisticsText: {
      color: 'rgb(54, 113, 155)',
      fontWeight: 'bold',
      fontSize: 14,
    },
    viewDays: {
      // backgroundColor: 'green',
      paddingStart: 20,
      paddingEnd: 20,
      // width: 350,
      marginTop: 15,
      //alignItems: 'center',
      // justifyContent: 'center',
      // alignContent: 'center'
    },
    containerDay: {
      // backgroundColor: 'purple',
      marginEnd: 20,
      // alignItems: 'center'
    },
    day: {
      fontWeight: 'bold',
      fontSize: 12,
      color: 'rgb(32, 44, 88)',
      //alignItems: 'center'
    },
    viewForcast: {
      // backgroundColor: 'red',
      paddingStart: 20,
      paddingEnd: 20,
      marginTop: 15,
      //width: 350,
    },
    containerForcast: {
      width: 90,
      backgroundColor: '#00000015',
      marginEnd: 20,
      alignItems: 'center',
      padding: 10,
      borderRadius: 10
    },
    forcastHour: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'rgb(32, 44, 88)'
    },
    forcastIcon: {
      width: 30,
      height: 30,
      marginTop: 10
    },
    forcastTemp: {
      fontSize: 23,
      fontWeight: 'bold',
      marginTop: 10,
      color: 'rgb(32, 44, 88)'
    }
  });

export default Main;