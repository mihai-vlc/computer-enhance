import fs from "fs";

type Bit = 0 | 1;

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
    type: InstructionType;
    d: Bit;
    w: Bit;
    mod: RegisterMode;
    reg: number;
    rm: number;
};

enum InstructionType {
    MOV = 0b100010,
    INVALID = 0,
}

// opCode D W  MOD  REG R/M
// 100010 0 1   11  011 001   = mov cx,bx
// 100010 0 1   11  001 000   = mov ax,cx

function processInstruction(data: number) {
    const instruction: Instruction = {
        type: (data & 0b1111110000000000) >> 10,
        d: ((data & 0b0000001000000000) >> 9) as Bit,
        w: ((data & 0b0000000100000000) >> 8) as Bit,
        mod: (data & 0b0000000011000000) >> 6,
        reg: (data & 0b0000000000111000) >> 3,
        rm: (data & 0b0000000000000111) >> 0,
    };
    return instruction;
}

function getRegistersForInstruction(instruction: Instruction) {
    if (instruction.mod == RegisterMode.REG) {
        const source = (instruction.w << 3) | instruction.reg;
        const destination = (instruction.w << 3) | instruction.rm;

        return [REG[destination], REG[source]];
    }

    throw new Error("Unsupported mode: " + instruction.mod);
}

function logBinaryData(data: number) {
    console.log(data.toString(2).replace(/(\d{8})/, "$1 "));
}

export function decodeInstructions(input: Buffer): string {
    let output = "bits 16\n\n";

    for (let i = 0; i < input.length; i += 2) {
        const data = input.readUint16BE(i);
        const instruction = processInstruction(data);
        output += InstructionType[instruction.type].toLowerCase();
        output += " ";
        output += getRegistersForInstruction(instruction)
            .join(", ")
            .toLowerCase();
        output += "\n";
        // logBinaryData(data);
    }

    return output;
}
