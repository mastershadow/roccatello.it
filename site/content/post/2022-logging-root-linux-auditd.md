+++
authors = []
date = "2022-02-11"
lastmod = "2022-02-11"
title = "Logging root commands on Linux using Linux Audit Framework"
summary = "Sometimes, for law compliance or internal security policy, you may need to log everything a system administrator does on a Linux box. Here is how."
tags = ["sysop", "linux"]
language = "en"
draft = false

+++

I want to enforce my security policies, so my desiderata is to log everything a root use does on a linux server.
Linux kernel contains a feature called Linux Audit Framework, which is obviously a framework to allow auditing events on a system.

It seems like it can can serve our purpose. Let's dig in.

## Enable Linux Audit Framework
Linux Audit Framework is already enabled in recent kernels, so your linux distro should already be compatible.
You just need to ensure you have **auditd** installed and running.
Auditd is the responsible for audit data collection, which is stored in /var/log/auditd.log.

In ubuntu you can install it using the following command, which also installs related useful tools:
```bash
sudo apt install auditd
```

The main tools you will need are: **auditctl** (the auditd client) and **ausearch** (the event viewer client).

The framework also includes the following tools: audispd, aureport, autrace, aulast, aulastlog, ausyscall, auvirt.

## Enable root execve syscall logging
Out main objective is to monitor the execve syscall, whenever the effective UID (user ID) is 0 (root).
This allow us to log both root shells and sudo commands.

```bash
auditctl -a exit,always -F euid=0 -F arch=b64 -S execve -k root-exevce
auditctl -a exit,always -F euid=0 -F arch=b32 -S execve -k root-exevce
```

These commands will:
* set a rule which applies at the exit of the syscall, with always policy
* filter for effective UID equal to 0
* filter for binary architecture (one row for 64 bit syscalls, one for 32 bit syscalls)
* filter for syscall execve
* tag events as root-commands

## Enable stricter root actions logging
If we want enforce logging to all actions involving root, we could use a permission based filter as follows:

```bash
auditctl -a exit,always -F euid=0 -F perm=awx -S all -k root-actions
```

The logic is the same above but we enable a filter on **permissions** and enable a wildcard on the syscalls.
In this case we are logging:
* command executions
* file writing
* file attribute changes

> Take a look to **man auditctl** to discover all Linux Audit Framework capabilities.

## List rules
You can list rules using:
```bash
auditctl -l
```

## Delete a rule or all rules
You can delete a rule using **-d** instead of **-a**, followed by the full input of the rule.

You can also clear rules with:
```bash
auditctl -D
```

## Using the event viewer: ausearch
If you are looking for an event, you can use **ausearch**.

```bash
ausearch -k TAG_NAME
```

TAG_NAME is root-execve or root-actions, as we defined before.

**ausearch** command is quite complex so take a look to its man page.