//se crea la interfaz de usuario del menu y la pausa
const inquirer = require("inquirer");
require("colors");

const preguntas = [
  {
    type: "list",
    name: "opcion",
    message: "Que desea hacer?",
    choices: [
      {
        value: 1,
        name: `${"1.".yellow} Buscar ciudad`,
      },
      {
        value: 2,
        name: `${"2.".yellow} Historial de busqueda`,
      },
      {
        value: 0,
        name: `${"0.".yellow} Salir`,
      },
    ],
  },
];

const inquirerMenu = async () => {
  console.clear();
  console.log(
    `${"======================".green}
${"Seleccione una opcion".yellow}
${"======================".red}\n`
  );

  const { opcion } = await inquirer.prompt(preguntas);

  return opcion;
};

const inquirerPausa = async () => {
  const question = [
    {
      type: "input",
      name: "pausa",
      message: `Preseione ${"ENTER".blue} para continuar`,
    },
  ];

  console.log("\n");

  await inquirer.prompt(question);
};

const leerInput = async (message) => {
  const question = [
    {
      type: "input",
      name: "desc",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Por favor ingrese un valor";
        }
        return true;
      },
    },
  ];

  const { desc } = await inquirer.prompt(question);
  return desc;
};

const listarLugares = async (lugares = []) => {
  //crear menu para elegir cual borrar
  const choices = lugares.map((lugar, i) => {
    const idx = `${i + 1}.`;
    return {
      value: lugar.id,
      name: `${idx} ${lugar.nombre}`,
    };
  });
  //agregar la opcion de salir al principio de choices
  choices.unshift({
    value: "0",
    name: "0.".blue + " cancelar",
  });

  //al dar click a la seleccion despliega la opcion para borrar
  const preguntas = [
    {
      type: "list",
      name: "id",
      message: "Seleccione el lugar:",
      choices,
    },
  ];

  const { id } = await inquirer.prompt(preguntas);
  return id;
};

module.exports = {
  inquirerMenu,
  inquirerPausa,
  leerInput,
  listarLugares,
};
