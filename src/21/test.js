let registers0, registers2, registers3, registers4, registers5;

do {
  registers4 = (123 & 456) === 72;
} while (registers4 === 0);

registers4 = 0; // seti 0 2 4
registers3 = registers4 | 65536; //bori 4 65536 3
registers4 = 10552971; //seti 10552971 1 4
registers5 = registers3 & 255; // bani 3 255 5
registers4 += registers5; // addr 4 5 4
registers4 &= 16777215; // bani 4 16777215 4
registers4 *= 65899; // muli 4 65899 4
registers4 &= 16777215; // bani 4 16777215 4
registers5 = 256 > registers3; // gtir 256 3 5
if (registers5) {
  console.log('hello');
  if (registers4 === registers0) return;
  // go back to bori 4
}
registers5 = 0; // seti 0 1 5
do {
  registers2 = registers5 + 1; // addi 5 1 2
  registers2 *= 256; // muli 2 256 2
  registers2 = registers2 > registers3; // gtrr 2 3 2
  if (registers2) {
    registers3 = registers5; //setr 5 7 3
    // go back to seti 10552971 1 4
  }
  registers5++; // addi 5 1 5
} while (true);
