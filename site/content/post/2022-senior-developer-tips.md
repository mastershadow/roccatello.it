+++
authors = []
date = "2022-08-20"
lastmod = "2022-08-20"
title = "Six software development tips from a senior software engineer"
summary = "If you know how to learn from experienced people you will always be getting big perks from your work and relations. So here are a few tips for you."
tags = ["tips", "tech", "learning", "development"]
language = "en"
draft = false
mermaid = false
slug = "senior-developer-tips"

+++

I have been developing software since 1995, and professionally since 1999, when I started a collaboration with a local automation company, near where I used to live in the past.

Since the beginning of my developer journey, I founded three companies, freelanced a lot and now I am working as the CTO of my GIS company.
I used to manage a lot of middle-sized projects, coordinating the team and reporting to stakeholders, but still being involved to the development side.
Since a couple of years, I'm very focused on research and development at 3DGIS, so I'm almost always designing and developing new things.
I am proficient in a few different programming languages, especially C/C++, Typescript, Java and Python.

I think I could name myself a seasoned senior developer, so I want to give you some tips about software development.

# Keep your names consistent and self-explanatory

* Variables, methods and classes should be named with concise but self-explanatory names.
* Avoid abbreviations if not well established among the organization.
* You can keep short names (i,j,k) for loop indices or if you are naming a variable relative to a math formula or to coordinates (x, y, z).
* Use intermediate variables to improve readability (critical code optimization will be done after everything is working). If you want to avoid them, use helper stateless functions.
* Name classes using the intended role (what that class will do? will be used in more than a scope?).

# Reduce abstraction to the minimum

* Keep abstractions clean, minimal and understandable.
* Dumb code is more debuggable than a complex abstraction.
* Choose your abstractions in terms of flexibility (will this change?), decoupling, maintainability (how indirect is it?) and simplicity (is this understandable?).

# Solve problems

Your job is to solve problems.

The code you write daily is a medium to achieve problem resolutions, so your main aim is to implement features to solve an issue and to create a feasible solution.

* Try to solve problems without changing the existent infrastructure too much
* Solve infrastructure issues as a specific problem (not as a dependency of another task)
* You may think solving infrastructural issues will make things faster if done before the original task (your problem). This will lead to a disaster: a broken infrastructure, an unsolved problem and, of course, you will be late with the scheduling.

# Always decouple if possibile

* Keep objects decoupled as much as possible
* Use interfaces to improve modularity
* Decoupling allows easier extensibility
* Decoupling allows testing
* Take a look at abstract factory and chain of responsibility design patterns

# Choose your dependencies wisely

* When doing software selection, evaluate open-source projects first, as you can inspect source code.
* Avoid libraries with viral licenses, if possible.
* Always respect licenses and other people work.
* If possible, use a library with a large user base (fewer bugs, more updates and features).
* Adopt and embrace essential but small libraries, so you will be able to maintain them if they get abandoned.
* Avoid trivial libraries (remember the number padding library that broke the whole node ecosystem a few years ago?).
* Know your libraries (for real, so implement something before importing any in to your project).

# Think about future iterations

Ask yourself:

* Is my code readable?
* Will I understand this, after a few months I don't see it?
* Are my abstractions simple enough to be understandable?
* Is the scope of any object correct?
* Is everything encapsulated well?
* Is my code easy to use?

> Always remember that writing software is a craft art, so good software is up to you.