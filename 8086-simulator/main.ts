import fs from "fs";

const input = fs.readFileSync("input.o");

for (let i = 0; i < input.length; i += 2) {
    const data = input.readUint16BE(i);
    console.log(processInstruction(data));
    logBinaryData(data);
}

type Bit = 0 | 1;
type OpCode = number;
type Register = number;

// stored as W REG
enum REG {
    // if W = 0
    AL = 0,
    CL = 1,
    DL = 2,
    BL = 3,
    AH = 4,
    CH = 5,
    DH = 6,
    BH = 7,
    // if W = 1
    AX = 8,
    CX = 9,
    DX = 10,
    BX = 11,
    SP = 12,
    BP = 13,
    SI = 14,
    DI = 15,
}

enum RegisterMode {
    MEM_0 = 0, // memory mode, no displacement
    MEM_8 = 1, // memory mode, 8 bit displacement
    MEM_16 = 2, // memory mode, 16 bit displacement
    REG = 3, // register mode, no displacement
}

type Instruction = {
    opCode: OpCode;
    d: Bit;
    w: Bit;
    mode: RegisterMode;
    register: Register;
    rm: Register;
};

// opCode D W  MOD  REG R/M
// 100010 0 1   11  011 001   = mov cx,bx
// 100010 0 1   11  001 000   = mov ax,cx

function processInstruction(data: number) {
    const instruction: Instruction = {
        opCode: (data & 0b1111110000000000) >> 10,
        d: ((data & 0b0000001000000000) >> 9) as Bit,
        w: ((data & 0b0000000100000000) >> 8) as Bit,
        mode: (data & 0b0000000011000000) >> 6,
        register: (data & 0b0000000000111000) >> 3,
        rm: (data & 0b0000000000000111) >> 0,
    };
    return instruction;
}

function logBinaryData(data: number) {
    console.log(data.toString(2).replace(/(\d{8})/, "$1 "));
}
