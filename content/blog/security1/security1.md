---
title: "Security Proofs #1: Motivation and Preliminaries"
description: An introduction to the logic of security proofs, reduction direction, and a worked Diffie–Hellman example.
date: 2026-06-14
---

## Introduction

You might already know what encryption, digital signatures, or homomorphic encryption do. But what does it mean to say that one of these constructions is *secure*? Secure against whom? What counts as a successful attack? And how can we prove something about attacks nobody has thought of yet?

A security proof starts by making those questions precise. We specify what an attacker can do and what it means for the attacker to win. Then we show that an attacker who wins too often would give us an algorithm for a problem we assume is hard.

That last step is called a **reduction**, and it is the main idea of this post. Before we get there, we will review the logic that makes the argument work. We will finish with a small proof about Diffie–Hellman key exchange.

You only need basic algebra to follow most of the post. The Diffie–Hellman example also uses modular exponentiation, which we will introduce as we go.

## Logic Concepts

### Statements and implications

A **statement** is an assertion that is either true or false. A **theorem** is a statement proved from stated assumptions and definitions. For example, “every even integer is divisible by two” is a true statement; “every integer is even” is false.

For two statements $P$ and $Q$, the implication

$$
P \implies Q
$$

means “if $P$ is true, then $Q$ is true.” We call $P$ a **sufficient** condition for $Q$, and $Q$ a **necessary** condition for $P$.

An implication is false only when $P$ is true and $Q$ is false. When $P$ is false, the implication places no restriction on $Q$.

For example, for an integer $n$,

$$
4 \mid n \implies 2 \mid n,
$$

where $a \mid n$ means “$a$ divides $n$.” Every multiple of four is even. But the **converse**, $2 \mid n \implies 4 \mid n$, is false: take $n=6$.

This distinction matters in cryptography. Showing that one particular attack breaks a scheme does not show that every attack must work that way.

### Contrapositives

The symbol $\neg P$ means “not $P$.” The **contrapositive** of $P \implies Q$ is

$$
\neg Q \implies \neg P.
$$

These two implications are logically equivalent. If $P$ guarantees $Q$, then $Q$ being false rules out $P$ being true.

In our divisibility example, the contrapositive says that if $n$ is not even, then it is not divisible by four. This follows from the original statement; the converse does not.

Security proofs use this equivalence constantly. We want to prove

$$
\text{a problem is hard} \implies \text{a scheme is secure}.
$$

We often do so by proving the contrapositive:

$$
\text{the scheme can be broken} \implies \text{the problem can be solved}.
$$

The second statement gives us something concrete to build: an algorithm that turns an attack into a solver.

### Double implications

The statement $P \iff Q$, read “$P$ if and only if $Q$,” means that both $P \implies Q$ and $Q \implies P$ hold. To prove it, we must prove both directions.

For example, an integer $n$ is even if and only if there exists an integer $k$ such that $n=2k$. This is a characterization of evenness, rather than just a sufficient condition for it.

Similarly, claiming that two computational problems are equivalent requires reductions in both directions. One reduction alone does not establish equivalence.

### Quantifiers and their order

A **predicate** is a statement with a variable, such as $P(x)$: “$x$ is even.” A quantifier tells us which values of the variable the assertion covers:

- $\forall x \in S,\ P(x)$ means “for every $x$ in the set $S$, $P(x)$ holds.”
- $\exists x \in S,\ P(x)$ means “there exists an $x$ in $S$ for which $P(x)$ holds.”

For example, $\forall x \in \mathbb{Z},\ x^2 \geq 0$ is true, as is $\exists x \in \mathbb{Z},\ x^2=4$. Here $\mathbb{Z}$ is the set of integers.

The order of quantifiers matters. Compare

$$
\forall x \in \mathbb{Z},\ \exists y \in \mathbb{Z},\ y>x
$$

with

$$
\exists y \in \mathbb{Z},\ \forall x \in \mathbb{Z},\ y>x.
$$

The first is true: after seeing $x$, choose $y=x+1$. The second is false: no single integer is larger than every integer. In the first statement, $y$ may depend on $x$; in the second, one $y$ must work for all $x$.

This is why security definitions say things like “for every efficient attacker.” Defeating one attacker we chose in advance is a much weaker claim.

### Negating quantified statements

To negate a quantified statement, flip the quantifier and negate the predicate:

$$
\neg\bigl(\forall x \in S,\ P(x)\bigr)
\iff
\exists x \in S,\ \neg P(x),
$$

$$
\neg\bigl(\exists x \in S,\ P(x)\bigr)
\iff
\forall x \in S,\ \neg P(x).
$$

“Not every integer is even” means that *some* integer is not even. It does not mean that no integer is even. One counterexample disproves a universal claim.

With nested quantifiers, apply the rule at every level:

$$
\neg\bigl(\forall x\,\exists y,\ P(x,y)\bigr)
\iff
\exists x\,\forall y,\ \neg P(x,y).
$$

Two other useful rules are **De Morgan's laws**:

$$
\neg(P \land Q) \iff (\neg P \lor \neg Q),
\qquad
\neg(P \lor Q) \iff (\neg P \land \neg Q),
$$

where $\land$ means “and” and $\lor$ means “or.” Also, negating an implication gives $\neg(P \implies Q) \iff P \land \neg Q$: a counterexample must satisfy the hypothesis and violate the conclusion.

## Reductions

### Which way does a reduction go?

We say that **problem $A$ reduces to problem $B$** if we can solve $A$ using a solver for $B$. We write

$$
A \leq B.
$$

Here we mean an efficient reduction that may call the solver as a subroutine. Other settings use more specific reduction notions, so the symbol alone does not tell the whole story.

The reduction is itself an algorithm. It receives an instance of $A$, uses a solver for $B$, and turns the result into a solution to its original instance. The useful way to read the notation is: **a solver for the problem on the right helps solve the problem on the left**.

Consequently,

$$
B\text{ is easy} \implies A\text{ is easy}.
$$

Taking the contrapositive gives

$$
A\text{ is hard} \implies B\text{ is hard}.
$$

So $B$ is at least as hard as $A$, in the sense captured by the reduction. The two arrows can feel backwards at first: algorithms transfer from right to left, while hardness transfers from left to right.

### Turning an attacker into a solver

In a security proof, $A$ is usually a computational problem, and $B$ is the task of breaking a particular security property of a construction. The goal is to show

$$
A \leq \text{breaking the construction}.
$$

We assume we have an attacker $\mathcal{A}$ and construct a solver $\mathcal{R}$ that uses it. Typically, $\mathcal{R}$ embeds its hard-problem instance into an interaction with $\mathcal{A}$, answers the attacker's allowed queries, and extracts a solution from its output.

We must justify three things:

1. **The attacker's view:** the interaction has the distribution required by the security definition, or is sufficiently close in a precisely justified sense.
2. **Success:** the attacker's success gives the solver a solution with a useful probability.
3. **Efficiency:** the solver runs efficiently whenever the attacker does.

We do not need to implement the hypothetical attacker or know how it works. We need to show how to use *any* attacker satisfying the assumed success guarantee.

The resulting guarantee is conditional: the reduction does not prove that $A$ is hard. It proves that a successful attack would also defeat our hardness assumption.

Proving the reverse direction would not establish security: an algorithm that breaks a construction using a solver for a hard problem only demonstrates one way to attack it. There could be easier attacks.

### What do “efficient” and “hard” mean?

An algorithm can always try every possible key in a finite key space. Security therefore cannot mean that success is mathematically impossible.

In the usual asymptotic treatment, a **security parameter** $\lambda$ controls the sizes of keys and other parameters. An efficient algorithm is a probabilistic polynomial-time algorithm: its running time is bounded by a polynomial in $\lambda$, and it may use randomness.

A function $\nu(\lambda)$ is **negligible** if, for every positive integer $c$, there is a threshold $N$ such that

$$
\lambda \geq N \implies \nu(\lambda)<\frac{1}{\lambda^c}.
$$

For example, $2^{-\lambda}$ is negligible, while $1/\lambda$ is not. “Negligible” describes how a function shrinks as the parameter grows; it does not simply mean a small number at one chosen parameter.

For a search problem, a typical hardness assumption says that **every efficient algorithm has negligible probability of finding a valid solution on a randomly sampled instance**. This is an average-case claim about a specified distribution, rather than a claim that every individual instance is difficult.

For the key-recovery property below, security has the same form: every efficient attacker recovers the secret only with negligible probability. Its negation is that there exists an efficient attacker whose success probability is not negligible. For other properties, such as distinguishing an encrypted bit, we instead measure the attacker's advantage over guessing.

A reduction must preserve enough success probability to make that argument work. If it turns an attack with non-negligible success into a solver with only negligible success, there is no contradiction to the hardness assumption. This is why we track probabilities as well as running time.

## A Worked Example: Diffie–Hellman

### The protocol and the property

Alice and Bob want to agree on a shared secret while an eavesdropper watches their messages. Let $G=\langle g\rangle$ be a cyclic group of prime order $q$, with public generator $g$. This means that the elements of $G$ are the powers of $g$, with exponents taken modulo $q$. We assume group operations are efficient.

For a concrete picture, we could use a subgroup of the nonzero integers modulo a prime $p$. Then the powers below are computed modulo $p$. We will use group notation so that the argument does not depend on that particular representation.

The exchange works as follows:

1. Alice samples $a$ uniformly from $\mathbb{Z}_q=\{0,\ldots,q-1\}$ and sends $X=g^a$.
2. Bob independently samples $b$ uniformly from $\mathbb{Z}_q$ and sends $Y=g^b$.
3. Alice computes $Y^a$, and Bob computes $X^b$.

They obtain the same value because

$$
Y^a=(g^b)^a=g^{ab}=(g^a)^b=X^b.
$$

Call this shared group element $K$. The equality proves **correctness**: honest participants agree. It does not yet prove secrecy.

We will prove one specific property: a **passive eavesdropper**, given the public parameters and transcript $(X,Y)$, cannot efficiently recover the entire value $K$ with non-negligible probability. The eavesdropper observes one honest exchange and does not modify its messages.

### The assumption

The **computational Diffie–Hellman (CDH) problem** is to compute $g^{ab}$ given $(g,g^a,g^b)$, for independently uniform $a,b \in \mathbb{Z}_q$.

The CDH assumption says that every efficient algorithm succeeds only with negligible probability, for the chosen family of groups as $\lambda$ grows. A prime-order group does not automatically satisfy this assumption; hardness is an additional assumption about the group family. Notice how closely the problem matches the eavesdropper's task. That is what makes this first reduction especially simple.

### The reduction

Suppose an efficient attacker $\mathcal{A}$ recovers $K$ from an honest transcript with probability $\varepsilon(\lambda)$. We build a CDH solver $\mathcal{R}$:

1. Receive a CDH challenge $(g,U,V)$, where $U=g^a$ and $V=g^b$. The exponents $a$ and $b$ are unknown to $\mathcal{R}$.
2. Give $\mathcal{A}$ the public group parameters and transcript $(X,Y)=(U,V)$.
3. Receive the attacker's candidate shared secret $\widehat{K}$ and output it as the CDH solution.

Why does this work? The challenge exponents have exactly the distribution used by honest Alice and Bob. Therefore, $\mathcal{A}$ sees exactly the transcript distribution on which its success guarantee applies. Whenever it recovers the shared secret, its output is

$$
\widehat{K}=g^{ab},
$$

which solves the CDH challenge. Thus,

$$
\Pr[\mathcal{R}\text{ solves CDH}]
=\Pr[\mathcal{A}\text{ recovers }K]
=\varepsilon(\lambda).
$$

The probability includes the random challenge and the attacker's randomness. The reduction makes one call to $\mathcal{A}$ and performs only a small amount of extra work, so it is efficient whenever $\mathcal{A}$ is efficient.

We have proved

$$
\text{CDH} \leq \text{recovering the DH shared secret}.
$$

If $\varepsilon$ were non-negligible, our solver would contradict the CDH assumption. Consequently, under that assumption, passive recovery of the shared secret has negligible success probability.

The reduction barely changes the input because we deliberately chose a property that closely matches the assumption. More involved proofs use the same structure, but need additional work to simulate the attacker's environment or translate its output.

### What the proof establishes

The precise property matters. Inability to recover all of $K$ does not imply that an attacker learns nothing about it. A stronger question asks whether the attacker can distinguish the real $K$ from an independent uniform element of $G$, given the transcript. This is the **decisional Diffie–Hellman (DDH)** problem, involving the distributions

$$
(g,g^a,g^b,g^{ab})
\quad\text{and}\quad
(g,g^a,g^b,g^c),
$$

where $a,b,c$ are independently uniform in $\mathbb{Z}_q$. Assuming CDH alone does not establish this indistinguishability property.

Our proof also says nothing about an attacker who changes messages. Unauthenticated Diffie–Hellman permits a man-in-the-middle attack: an attacker can replace the public shares and establish separate secrets with Alice and Bob. The attacker never needs to solve the CDH challenge from an honest exchange. This illustrates why the attack model is part of the theorem.

### A tempting argument in the wrong direction

What if we tried to justify secrecy by saying that discrete logarithms are hard?

The **discrete logarithm (DL) problem** is to recover $a$ from $g$ and $g^a$. If we had a DL solver, we could solve CDH: recover $a$ from $g^a$, then compute $(g^b)^a=g^{ab}$. This gives

$$
\text{CDH} \leq \text{DL}.
$$

It proves that easy discrete logarithms make CDH easy. Its contrapositive says that hard CDH implies hard discrete logarithms. This reduction does **not** prove that hard discrete logarithms imply hard CDH: there might be a way to compute $g^{ab}$ without recovering either exponent.

That is the same logical mistake as reversing an implication. A security argument must show that *any successful attack yields a solver for the assumed hard problem*, rather than merely exhibit an attack that uses such a solver.

## Reading a Security Proof

When reading a reduction proof, keep four questions in mind:

1. What exactly does the attacker get to see and do, and what counts as winning?
2. Which problem is assumed hard, and how are its instances sampled?
3. How does the reduction turn the attacker into a solver without knowing the hidden solution itself?
4. What running time and success probability does the solver achieve?

For our Diffie–Hellman example, each answer is short enough to check directly. These same questions will guide us when we introduce formal security games and prove properties of more involved constructions.

_Note:_ AI used for polishing text and finding bugs.