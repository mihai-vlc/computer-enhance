import { test, expect } from "vitest";
import { decodeInstructions } from "./main";

test("can decode a single instruction", () => {
    const output = decodeInstructions(Buffer.from([0x89, 0xd9]));
    expect(output).toBe(`bits 16

mov cx, bx
`);
});

test("can decode multiple instructions", () => {
    const output = decodeInstructions(
        Buffer.from([
            0x89, 0xd9, 0x89, 0xc8, 0x89, 0xd9, 0x89, 0xd9, 0x88, 0xe5, 0x89,
            0xda, 0x89, 0xde, 0x89, 0xfb, 0x88, 0xc8, 0x88, 0xed, 0x89, 0xc3,
            0x89, 0xf3, 0x89, 0xfc, 0x89, 0xc5,
        ])
    );
    expect(output).toBe(`bits 16

mov cx, bx
mov ax, cx
mov cx, bx
mov cx, bx
mov ch, ah
mov dx, bx
mov si, bx
mov bx, di
mov al, cl
mov ch, ch
mov bx, ax
mov bx, si
mov sp, di
mov bp, ax
`);
});
