import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, StatusBar, TouchableWithoutFeedback} from 'react-native';

function Main(props) {

    const [weatherForecastData, seatWeatherForecastData] = useState();
    const [forecastDays, seatForecastDays] = useState([]);
    const [forecastHours, seatForecastHours] = useState([]);

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  

    const getWeatherForecast = () => {
        // fetch('https://api.openweathermap.org/data/2.5/forecast?q=casablanca&appid=243b73dbf2837d9b3bfb97b87b1879dd')
        // fetch('https://api.weatherapi.com/v1/forecast.json?key=ad4b8f61a78d45a598293412210308&q=casablanca&days=5&aqi=no&alerts=yes')
        //   .then((response) => response.json())
        //   .then((responseJson) => {
        //     seatWeatherForecastData(responseJson);
        //     //console.log(responseJson);
        //     getForecastDays(days[new Date().getDay()]);
        //   })
        //   .catch((error) => {
        //     console.error('Forecast ERROR: ' + error);
        //   });

        fetch('https://api.openweathermap.org/data/2.5/forecast?q=casablanca&appid=243b73dbf2837d9b3bfb97b87b1879&units=metric')
          .then((response) => response.json())
          .then((responseJson) => {
            seatWeatherForecastData(responseJson);
            console.log(responseJson);
          })
          .catch((error) => {
            console.log('openweathermap ERROR: ' + error);
          });
      }
    
      const getForecastDays = (day) => {
        let newArrayDays = []; 
        let newArrayHours = [];
        let flatListArray = [];
    
        for (let i = 0; i < weatherForecastData.forecast.forecastday.length; i++) {
    
          //Forecast Days
          let str = parseInt(weatherForecastData.forecast.forecastday[i].date_epoch + '000');
          let Day = days[new Date(str).getDay()];
          let Month = months[new Date(str).getMonth()];
          let fDate = new Date(str).getDate();
          //let objDay = { "id": i, "day": Day+','+fDate+' '+Month};
          let objDay = { "id": i, "day": Day, "date": fDate+' '+Month};
    
          newArrayDays.push(objDay);
          seatForecastDays(newArrayDays);
    
    
          //Forecast Hours
          for (let j = 0; j < weatherForecastData.forecast.forecastday[i].hour.length; j++) {
    
            let day = days[new Date(parseInt(weatherForecastData.forecast.forecastday[i].hour[j].time_epoch + '000')).getDay()];
            //let hour = weatherForecastData.forecast.forecastday[i].hour[j].time.slice(11, 17);
            let hour = new Date(parseInt(weatherForecastData.forecast.forecastday[i].hour[j].time_epoch + '000')).getHours();
            let icon = weatherForecastData.forecast.forecastday[i].hour[j].condition.icon;
            let temp = weatherForecastData.forecast.forecastday[i].hour[j].temp_c;
            
            let objHours = {};
            //Check what a Day is !!!
            if(day == days[new Date().getDay()]){ //==> If the day == Today
              if(hour >= new Date().getHours()){  //==> If hour of the day >= the hour of Today
                if(hour.toString().length > 1){
                  objHours = { 'id': j, 'day': day, 'hour': hour+':00', 'icon': icon, 'temp': temp };
                 }else{
                   objHours = { 'id': j, 'day': day, 'hour': '0'+hour+':00', 'icon': icon, 'temp': temp };
                 }
              }
            }else{
              if(hour.toString().length > 1){
                objHours = { 'id': j, 'day': day, 'hour': hour+':00', 'icon': icon, 'temp': temp };
               }else{
                 objHours = { 'id': j, 'day': day, 'hour': '0'+hour+':00', 'icon': icon, 'temp': temp };
               }
            }
            newArrayHours.push(objHours);
          }
    
        }
    
        // Fetch in 
          newArrayHours.forEach(element => {
              if (element.day == day) {
                flatListArray.push(element);
              }
            });
          seatForecastHours(flatListArray);
        
    
        
      }
    
    
      useEffect(() => {
        getWeatherForecast();
        
      }, weatherForecastData);
    
    
      const ItemDay = ({ day, date }) => (
        <TouchableWithoutFeedback onPress={() => getForecastDays(day) }>
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
          <Image style={styles.forcastIcon} source={{ uri: 'https:'+icon }} />
          <Text style={styles.forcastTemp} >{temp}°</Text>
        </View>
      );
    
      const renderForcast = ({ item }) => (
        <ItemForcast hour={item.hour} icon={item.icon} temp={item.temp} />
      );


    return (
        <View style={styles.container}>
            <StatusBar />
            {weatherForecastData !== null
                ?
                <>
                    <View style={styles.header} >
                        <Text style={styles.city}></Text>
                        <TouchableWithoutFeedback onPress={props.toggle}>
                          <Image style={{ width: '40px', height: '40px', marginLeft: '70px'}} source={ require('../assets/icons8-search-50.png')} />
                        </TouchableWithoutFeedback>
                    </View>

                    <View style={styles.containerIcon}>
                        {/* <Image style={styles.icon} source={  require('./assets/weather-icons/sun-240.png') } /> */}
                        <Image style={styles.icon} source={{ uri: 'https://openweathermap.org/img/wn/'+weatherForecastData.list[0].weather[0].icon+'@4x.png'}} />
                    </View>

                     <View style={styles.description}>
                        <Text style={styles.descText}>{weatherForecastData.list[0].weather[0].description}</Text>
                    </View>

                    <View style={styles.temperature}>
                        <Text style={styles.temp}>{weatherForecastData.current.temp_c}°</Text>
                    </View>
                  {/*
                    <View style={styles.statistics}>
                        <View style={styles.statisticsChilds}>
                            <Image style={styles.statisticsIcons} source={require('../assets/weather-icons/icons8-wet-100.png')} />
                            <Text style={styles.statisticsText}>{weatherForecastData.current.humidity} %</Text>
                        </View>
                        <View style={styles.statisticsChilds, styles.statisticsChilds2}>
                            <Image style={styles.statisticsIcons} source={require('../assets/weather-icons/icons8-wind-100.png')} />
                            <Text style={styles.statisticsText}> {weatherForecastData.current.wind_kph} Km/h </Text>
                        </View>
                    </View>

                    <View style={styles.viewDays}>
                        <FlatList
                            data={forecastDays}
                            renderItem={renderItemDay}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={{ alignItems: 'center' }}
                            horizontal />
                    </View>

                    <View style={styles.viewForcast}>
                        <FlatList
                            data={forecastHours}
                            renderItem={renderForcast}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={{ alignItems: 'center' }}
                            horizontal />
                    </View> */}
                </>
                : <View><Text>NOTHING</Text></View>}


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      //alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgb(91, 225, 255)'
    },
    header: {
      //backgroundColor: 'blue',
      //alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      padding: 10
    },
    city: {
      fontWeight: 'bold',
      fontSize: 30,
      color: 'rgb(32, 44, 88)',
      marginRight: 50,
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
      alignItems: 'center',
      //backgroundColor: 'red'
    },
    descText: {
      color: 'rgb(54, 113, 155)',
      fontWeight: 'bold',
      fontSize: 20
    },
    temperature: {
      alignItems: 'center'
    },
    temp: {
      color: 'rgb(32, 44, 88)',
      fontWeight: 'bold',
      fontSize: 90
    },
    statistics: {
      //backgroundColor: 'orange',
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'row'
    },
    statisticsChilds: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      //backgroundColor: '#fdf',
      marginRight: 30,
    },
    statisticsChilds2: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      marginLeft: 30
    },
    statisticsIcons: {
      width: 25,
      height: 25,
      marginRight: 15
    },
    statisticsText: {
      color: 'rgb(54, 113, 155)',
      fontWeight: 'bold',
      fontSize: 14
    },
    viewDays: {
      // backgroundColor: 'green',
      padding: 10,
      width: 350,
      marginTop: 15,
      alignItems: 'center',
      justifyContent: 'center',
      alignContent: 'center'
    },
    containerDay: {
      // backgroundColor: 'purple',
      marginRight: 20,
      alignItems: 'center'
    },
    day: {
      fontWeight: 'bold',
      fontSize: 12,
      color: 'rgb(32, 44, 88)',
      alignItems: 'center'
    },
    viewForcast: {
      // backgroundColor: 'red',
      padding: 10,
      width: 350,
    },
    containerForcast: {
      backgroundColor: '#00000015',
      marginRight: 20,
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