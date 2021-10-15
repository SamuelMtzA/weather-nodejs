const fs = require("fs");
const axios = require("axios");
const { runInThisContext } = require("vm");
//peticiones con axios es un servidor basado en promesas

class Busquedas {
  
  constructor() {
    this.historial = [];
    this.dbPath = "./db/database.json";
    //TODO leer DB si existe
    this.leerDb();
  }
  //parametros a obtener del API
  //los token y ids son generados desde la app y gurdados en variables de entorno
  get paramsMapBox(){
   return { "access_token": process.env.MAPBOX_KEY,
    "limit": 5,
    "language": "es",}
  }
  get paramsWeather(){
    return { appid: process.env.OPENWEATHER_KEY,
     units: "metric",
     lang: "es",}
   }

   //cC
   get historialCapitalizado(){
    return this.historial.map(lugar =>{
      // separar en un arreglo por espacio
      let palabras = lugar.split(' ')
      //capitalizar el primer elemento y realizar un substring despues de la primera letra
      palabras.map(palabra => palabra[0].toUpperCase() + palabra.substring(1));

      //unir las palabras en la ciudad capitalizada
      return palabras.join(" ")
    })
   }

  async ciudad(place = "") {
    //peticion http
    try {
      //instancia para crear la informacion de los, donde se recibe el lugar del usuario
      //se realiza la peticion con los parametros establecidos desde POSTMAN
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
        params: this.paramsMapBox
        
      });
      //peticion de GET al api, para obtener la respuesta
      const resp = await instance.get();
      //se extrae la informacion del lugar que requiera mostrar
      return resp.data.features.map(lugar => {
        return {
          id: lugar.id,
          nombre: lugar.place_name,
          lng: lugar.center[0],
          lat: lugar.center[1],
        }
      })

    } catch (err) {

      return [];
    }
  }

  async climaLugar (lat, lon){

    try{
      //instancia para crear la informacion de los, donde se recibe el lugar del usuario
      //se realiza la peticion con los parametros establecidos desde POSTMAN
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: {...this.paramsWeather, lat, lon},
      });
      //peticion de GET al api, para obtener la respuesta
      const resp = await instance.get();
      //se destructura en dos objetos para obtener los parametros
      const {weather,main } = resp.data

      //se extrae la informacion del lugar que requiera mostrar
        return {
          desc: weather[0].description,
          min: main.temp_min,
          max: main.temp_max,
          temp: main.temp,
        }


    }catch(error){
      console.log(error);
    }
  }

  agregarHistorial(lugar = ''){
    //todo: prevenir duplicados
    //si el lugar esta incluido en el historial se regresa
    if (this.historial.includes(lugar.toLocaleLowerCase())) {
      return; 
    }
    //si no esta incluido, entonces insertamos el lugar en historial
    this.historial.unshift(lugar);
    //grabar en DB
    this.guardarDB();
  }
  guardarDB(){
    //usamos una constante auxiliar para hacer referencia a historial
    const payload = {
      historial: this.historial
    };
    //creamos nuestro Json con la informacion dentro de historial
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }
  leerDb(){
    //verificar que exista el archivo, si no existe el archivo, no hace nada
    if(!fs.existsSync(this.dbPath)) return;

    //si existe, lee el archivo sin los bytes
    const info = fs.readFileSync(this.dbPath,{encoding: "utf-8"})
    //cambia el json a ub objeto
    const data = JSON.parse( info )
    //agrega al historial la informacion que se leyo del json
    this.historial = data.historial
  }

}

module.exports = {
  Busquedas,
};
