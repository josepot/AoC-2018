/*
addi 1 16 1
seti 1   5
seti 1   2
mulr 5 2 3
eqrr 3 4 3
addr 3 1 1
addi 1 1 1
addr 5 0 0
addi 2 1 2
gtrr 2 4 3

addr 1 3 1
seti 2   1
addi 5 1 5
gtrr 5 4 3
addr 3 1 1
seti 1   1
mulr 1 1 1
addi 4 2 4
*/

const registers = [0, 2, 0, null, 10551306, 1];
do {
  if (registers[4] % registers[5] === 0) {
    registers[0] += registers[5];
  }
  registers[5]++;
} while (registers[5] <= registers[4]);
