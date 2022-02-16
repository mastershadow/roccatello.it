+++
authors = []
date = "2022-02-09"
lastmod = "2022-02-09"
title = "Passing environment variables to a docker container using docker-compose "
summary = "Suppose you have a containerized script which you want behave differently based on configuration. Let's see how to do that!"
tags = ["coding", "docker"]
language = "en"
draft = false
slug = "passing-environment-variables-docker-using-docker-compose"

+++

I'm doing a complete revision of our backup verification system, and I'm trying to automatize checks whenever possible.

Automation is good for a variety of reason:
* it can be carried out by a machine (you can schedule it);
* it is less error prone;
* it avoids password and password files around systems.

### What I've done
* I've written a Python application, which does a lot of things automatically.
* I've built a container in order to execute it
* I needed to parametrize the execution, as we use Borg Backup which I want to verify with a different schedule and policy than the regular database backup.

### Step 0: Define what you need
I need to pass two parameters to the script:
* if I want to run borg verify
* what is the store to verify.

Let's define BORG (integer) to enable the verification and STORE (string) to select the store we want to verify.

### Step 1: Declare environment variables in docker-compose.yml

```yaml
environment:
  - BORG=${BORG:-0}
  - STORE=${STORE:-}
```
This will collect BORG and STORE env variables from the command line, using 0 and "" as default values.

### Step 2: Use env variables into the Dockerfile
Actually, this is complex that you would expect.
Initially, I've used a naive approach: I put the script call directly into the **ENTRYPOINT**.

We need a wrapper here in order to evaluate variables.
So, I've replaced my existing ENTRYPOINT with a call to /usr/bin/run.sh, which is a simple bash script.

Add it to the container as follows:
```dockerfile
COPY ./run.sh /usr/bin/run.sh
RUN chmod +x /usr/bin/run.sh
```

Let's take a look to run.sh

```bash
#!/bin/sh
if [ ${BORG} -eq 1 ]; then 
  python app -b ${STORE}
else
  python app
fi
```

Build the container with **docker-compose build**

### Step 3: Call the container with environment variables as parameters
You can now call the container using environment variables as follows:
```bash
BORG=1 STORE="catserver" docker-compose up
```

Done :)