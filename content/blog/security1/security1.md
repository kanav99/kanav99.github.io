---
title: "Security Proofs #1: Motivation and Preliminaries"
description: How to prove security of cryptographic protocols
date: 2026-06-14
---

## (Blog Under Construction 🏗️ 🚧🦺)

## Introduction

What is encryption? What are digital signatures? What's homomorphic encryption? You might be aware of these objects in cryptography. But what exact security properties do these objects provide? And how do researchers argue that the constructions they came up with necessarily provides these guarantees? What exactly do we mean by "secure" in the first place? 

In this blog series, we will go through the answers (or at-least attempts) to these questions and develop the necessary mathematical/logic skills to understand or come up with security definitions and proofs.

## Preliminaries: Logic Concepts

We will briefly review some basic logic topics which occur a lot in crypto: implications, double implication, contrapositives, quantified statements, negation rules for quantifiers.

__Statements and Theorems__. A statement is any assertion with a truth value; it could be true or false. A theorem is a statement that is shown to be true.

__Implications__. For some two statements A and B, theorem "A implies B" or $A \implies B$ means that A is a sufficient condition for B to be true. That is, if A is true, B is for sure true. No claims can be made about B if A is false. It is similar to "if-then" in regular coding.

__Contrapositive__. Suppose we have theorem that $A \implies B$. It can't be the case that B is false but A is true. So if B is false, A has to be false. This is also an implication but flipped: $\neg B \implies \neg A$. This is called the contrapositive rule: $A \implies B$ is logically equivalent to $\neg B \implies \neg A$.

__Double Implication__.  A theorem $A \iff B$ means that $A \implies B$ and $B \implies A$, at the same time. With a little help of contrapositive rule, we can show that this means that A and B have same truth value every time. An example of double implication is the contrapositive rule itself: $(A \implies B) \iff (\neg B \implies \neg A)$.

__Quantified Statements__. We are in the boolean world till now. How do we argue about numbers (or any group for that matter)? For that, we have two types of quantified statements: existential ($\exists$) and universal ($\forall$). Let $\mathbb{Z}$ denote the set of integers and $f$ be some function from integer to boolean truth value. Then theorem "$\exists x \in \mathbb{Z}, f(x)$", means that "there exists an integer $x$ for which $f(x)$ is true". Similarly, theorem $\forall x \in \mathbb{Z}, f(x)$, means that "for all integers $x$, $f(x)$ is true".

