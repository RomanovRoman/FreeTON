const fs = require('fs')
const shell = require('shelljs')
const sha256 = require('js-sha256')

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git')
  shell.exit(1)
}

const smcNames = [
  'Calculator',
  'CalculatorDebot',
  'Calculator2',
  'CalculatorDebot2',
]

const smcHashes = {}

const compileScripts = []

smcNames.forEach((name) => {
  const raw = fs.readFileSync(`./contracts/${name}.sol`)
  const hash = sha256(raw)
  if (hash !== smcHashes[name]) {
    smcHashes[name] = hash
    compileScripts.push(`npx tondev sol compile ./contracts/${name}.sol`)
    compileScripts.push(`mv ./contracts/${name}.abi.json ./build/${name}.abi.json`)
    compileScripts.push(`mv ./contracts/${name}.tvc ./build/${name}.tvc`)
    // compileScripts.push(`npx tondev sol compile -o ./build ./contracts/${name}.sol`);
  }
})

compileScripts.forEach((script) => {
  shell.exec(script)
})

smcNames.forEach((name) => {
  const abiRaw = fs.readFileSync(`./build/${name}.abi.json`);
  const abi = JSON.parse(abiRaw);
  const image = fs.readFileSync(`./build/${name}.tvc`, {
    encoding: "base64",
  });

  fs.writeFileSync(
    `./ton-packages/${name}.package.ts`,
    `export default ${JSON.stringify({ abi, image })}`
  );
});

shell.exit(0)
