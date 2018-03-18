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
      },
      {
        name: "Um número pertencente ao inrevalo fechado [a, b]",
        value: ":"
      }
    ]
  },
  {
    type: "input",
    name: "x",
    message: "Qual o número alvo (x)?",
    when: answers => answers.type !== ":",
    validate
  },
  {
    type: "input",
    name: "a",
    message: "Qual o número a do intervalo [a, b]?",
    when: answers => answers.type === ":",
    validate
  },
  {
    type: "input",
    name: "b",
    message: "Qual o número b do intervalo [a, b]?",
    when: answers => answers.type === ":",
    validate
  }
];

const FILTERS = {
  "=": target => e => e === target,
  ">": target => e => e >= target,
  "<": target => e => e <= target,
  ":": (_, a, b) => e => e >= a && e <= b
};

const findPossibilities = (N, Z) => {
    const mkArr = () => Array.from(Array(Z).keys()).map(e => e + 1);
    const choose = Array.from(Array(N).keys()).map(mkArr);
    return product(choose);
};

inquirer.prompt(questions).then(answers => {
    const { N, Z, type, x, a, b } = answers;
    const Ni = parseInt(N);
    const Zi = parseInt(Z);
    const xi = parseInt(x);
    const ai = parseInt(a);
    const bi = parseInt(b);

    const possibilities = findPossibilities(Ni, Zi);
    const sums = possibilities.map(e => e.reduce((a, b) => a + b));

    const total = possibilities.length;
    const amount = sums.filter(FILTERS[type](xi, a, b)).length;
    console.log(`Total de acertos: ${amount}.\nEspaço amostral: ${total}.\nProbabilidade: ${amount/total}.`);
});