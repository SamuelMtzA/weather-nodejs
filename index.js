//Variables de entorno, uso de dotenv para leer las variables
require('dotenv').config()

const {
  leerInput,
  inquirerMenu,
  inquirerPausa,
  listarLugares,
} = require("./helpers/inquirer");
const { Busquedas } = require("./models/busquedas");

// ? console.log(process.env.MAPBOX_KEY); variables de entorno globales


const main = async () => {
  let opt;
  const busquedas = new Busquedas();

  do {
    opt = await inquirerMenu();
    console.log({ opt });

    switch (opt) {
      case 1:
        //mostrar mensaje input
        const busqueda = await leerInput("Ciudad: ");
        //buscar los lugares
        const lugares = await busquedas.ciudad(busqueda);
        //seleccionar el lugar 
        const id = await listarLugares(lugares);
        if (id === "0") continue;// regresar al menu princi[pa]l

        const lugarSel = lugares.find(lugar => lugar.id === id)
        const {nombre, lng,lat} = lugarSel
        //Guardar en DB el nombre que se desea encontrar
        busquedas.agregarHistorial(nombre)

        //datos del clima
        const clima = await busquedas.climaLugar(lat,lng);
        //desestrcturar el objeto clima
        const { desc, min, max, temp} = clima;
        //mostrar resultados
        console.clear();
        console.log("Informacion de la ciudad\n".blue);
        console.log("Ciudad: ", nombre.green);
        console.log("Lat: ", lat);
        console.log("Long: ", lng);
        console.log("Temperatura: ",temp);
        console.log("Minima: ",min);
        console.log("Maxima: ",max);
        console.log("Descripcion del clima: ",desc.red);

        break;

        case 2:
          busquedas.historialCapitalizado.map((lugar, i )=> {
            const idx = `${ i + 1 }.`.blue
            console.log(`${idx} ${lugar}`);
          })
        break;

      default:
        break;
    }

    if (opt !== 0) await inquirerPausa();
  } while (opt !== 0);
};

main();
