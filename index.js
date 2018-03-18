const inquirer = require("inquirer");
const product = require("cartesian-product");

console.log("Olá, bem vindo ao calculador de probabilidades!");

const validate = value => {
  var pass = value.match(/^[1-9]\d*$/);
  if (pass) {
    return true;
  }
  return "Por favor entre um inteiro positivo válido.";
};

var questions = [
  {
    type: "input",
    name: "N",
    message: "Quantos dados deseja jogar (N)?",
    validate
  },
  {
    type: "input",
    name: "Z",
    message: "Quantas faces cada dado (Z)?",
    validate
  },
  {
    type: "list",
    name: "type",
    message: "Qual probabilidade deseja?",
    choices: [
      {
        name: "Exatamente um número",
        value: "="
      },
      {
        name: "Um número ou menos",
        value: "<"
      },
      {
        name: "Um número ou mais",
        value: ">"
      }
    ]
  },
  {
    type: "input",
    name: "x",
    message: "Qual o número alvo (x)?",
    validate
  }
];

const FILTERS = {
  "=": target => e => e === target,
  ">": target => e => e >= target,
  "<": target => e => e <= target
};

const findPossibilities = (N, Z) => {
    const mkArr = () => Array.from(Array(Z).keys()).map(e => e + 1);
    const choose = Array.from(Array(N).keys()).map(mkArr);
    return product(choose);
};

inquirer.prompt(questions).then(answers => {
    const { N, Z, type, x } = answers;
    const Ni = parseInt(N);
    const Zi = parseInt(Z);
    const xi = parseInt(x);

    const possibilities = findPossibilities(Ni, Zi);
    const sums = possibilities.map(e => e.reduce((a, b) => a + b));

    const total = possibilities.length;
    const amount = sums.filter(FILTERS[type](xi)).length;
    console.log(`Total de acertos: ${amount}.\nEspaço amostral: ${total}.\nProbabilidade: ${amount/total}.`);
});