+++
authors = []
date = "2022-09-10"
lastmod = "2022-09-10"
title = "You should never fix bugs and do code refactoring at the same time"
summary = "How deep the rabbit hole goes? When coding, you might not want to find it out. Let's see why!"
tags = ["tips", "tech", "learning", "development", "refactoring", "bugfixing"]
language = "en"
draft = false
mermaid = false
ogimage = "img/posts/bugs.jpg"
slug = "bugfixing-and-refactoring"

+++

### Let's briefly describe a scenario

Dling! A new ticket has arrived. It is a bug report about the project you are working on. Medium severity, non blocker, but a major one. You can easily confirm the bug.

You have enough details to create an issue to put in the backlog and discuss it at the next planning meeting.
At the planning meeting, you are requested to give an estimate about the time needed to fix that bug.

Let's say your estimate is about two working days.

### Getting things done

The first thing to do is figure out how to reproduce it and why it happens.

After a while, you find the point where it happens, and you start to reason about the best way to solve that issue.
The problem is quite simple: in the last PR a change request revised some specs and an if branch condition was not updated with the revised specification. You also find out that there is a lot of duplicated code shared between if branches.
Who did that and why? You don't remember, but you can really make it cleaner with some code refactoring, to remove duplicated code.

### Nesting

Instead of simply fix that bug by just copying the code in the incomplete branch, you start refactoring your codebase. But once you start, you start browsing code references and find out that you need to refactor the caller class. And, guess what?, you may need to work on the caller of the caller, and so on, in a potential infinite refactoring loop.
After a while, you are done, but you have edited a lot of code, which needs testing. You may have introduced something wrong or missed some aspects.
The bug is now fixed but, instead of taking two days, a week is passed, and you are past due, and you aren't sure if your solution is 100% OK.

### Bugfix only

My suggestion is to bug fix only. Do not care about cleanliness, perfection and beautiful code when fixing bugs.
It is the best way to bring a success home, and you also may create a immediate issue for future refactoring (so you know it could be better and say that to the team).

Obviously, it may happen that a feature needs refactoring to solve a problem. In that case, you may postpone the fix or discuss with the whole team the pro and cons of the whole operation.

> Always work on bugs and refactor as separate processes. Do not mix ;)