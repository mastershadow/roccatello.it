+++
authors = []
date = "2018-12-23"
lastmod = "2018-12-23"
summary = "Is agile project management really always great? Let's take a deep breath and dive in!"
tags = ["Development", "Project Management"]
title = "A praise and a rant towards Agile project management and its applications on SME businesses"
[header]
caption = ""
image = "posts/sheep.jpg"

+++

It's almost Xmas and I really need a break about forced politeness, so I'll shout here a secret I really would have told you before.

# Agile sucks. But it's great for you!

Agile project management actually works quite well. It's great compared to waterfall approach when applied to computer software development, as it helps PMs to take uncertainty in account and keep the delivery pace high enough in order not to sleep at night. Joking :)

Using a sprint based approach you could really keep production under control. There is plenty of literature about this and I'm not the right person to give you lessons about this (probably I could but let's keep this out for a moment).

At 3DGIS we currently use the great Atlassian tool called JIRA, which is actually perfect when used with Tempo Timesheet and Tempo Planner. We also use Confluence, Gliffy and some other nice tools.

We tried to use integrated planning tools. Actually managing Epics, Stories and even single issues with Tempo planner seemed to be great at the beginning. It was a time where the workload was manageable. This is not that time anymore.

# Great! But, it's not.

What if I told you that approach were (is) working perfectly in a sane enterprise environment but in the common case it is not?

Agile project management tools are designed with big corporations in mind. You are a project manager. You have people dedicated to the project and you are managing a complex and changing environment (requirements, accidents, unexpected childish boss or customer behaviour, ... so on). I'm not telling this is a easy peasy thing, but you have tools designed to a fit a streamlined procedure.

If you scale this down to SME's reality, you could see how things get worse. You have to manage multiple small projects but your resources are limited and shared between projects themselves. Time schedule is unfeasible but work needs to be carried out in the shortest time as possible. Small projects also usually have very volatile requirements. That's a nightmare :smile:

**The above project management tools won't work in this situation.** We tried to figure out how to try manage this kind of mess. We ditched Tempo Planner, replacing it with a custom planner tool which is based on our experience. We kept all the rest. Also all tools are integrated with our custom ERP which collects performance indicators and helps us find out performance bottlenecks.

Currently our project management pipeline is almost always done in the following way, and it is accurately documented in our quality management system. I'll skip the documentation part.

    1)   A project is collected in the ERP, which assigns it a code.
         This code is unique and shared between management apps.
    1.a) A specific JIRA project is created, if the requirements need it.
    2)   JIRA issues are created within the project and
         they have a reference to the project code.
    3)   Issues are orchestrated in Sprints which corresponds to milestones,
         something that would be called a "deliverable" in real life.
    4)	 Sprints are assigned on a weekly base and people could be
         assigned to multiple sprints (macro managing).
    4.a) Sprints have deadlines which are hard but
         duration is based on working time:
         so if you have 2 projects elapsed time is twice.
    5)   Once ready, deliverables get delivered to their destination,
         which responds with a feedback.
    6)   Development receives feedbacks and
         iterates 2-6 until project completion or new planning.

This approach is probably not perfect, and will be refined in the future, but it has some crucial advantages:

- **Delegation / micromanagement**  
  People who is working with you is also responsible for themselves and are allowed to managed their time.
- **Preemption support**  
  A new project can fit in the schedule quite easily. Obviously other project's timeline gets stretched.
- **Can be used with intermittent projects**  
  Given you are working in a pipeline it doesn't matter if a stage is not ready yet. You keep working on other things.

As I was telling you it's not perfect, and these are some drawbacks:

- People needs to able to manage themselves.
- Multitasking lowers performance, so keep it lowest as possible.
- Projects timing needs more supervising as it is less predictable.

As always please tell me what you think :)
