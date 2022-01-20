---
title: Find the Function End in Assembly code
usemathjax: true
---

I have one more interesting problem in NP-Completeness.

## Problem

Suppose you have an infinitely long text section of assembly code, be it of any modern ISA. Forget everything about virtual addressing, every address is either relatively addressed or with base at the start of this assembly code. At the beginning of the assembly code, you have a function. You have to find the end of this function - that is, the maximum address of instruction where the execution could reach without following function calls.

We can also convert it into a decision problem - given $$n$$ instructions, can the execution ever reach the $$n+1$$-th instruction without following function calls?

## Intution

I have a strong intution that this problem is very much related to Halting Problem.

## Where do you see this problem?

When C code compiled with GCC, the function ends are not stored inside the binary generated. Function starts can be found using exported symbol table.

## Interested?

Hit me up :) Insights of people who develop reverse engineer tools would be much appreciated :)
