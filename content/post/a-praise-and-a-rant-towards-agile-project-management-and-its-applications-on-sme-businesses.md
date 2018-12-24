+++
authors = []
date = "2018-12-23T23:00:00+00:00"
draft = true
lastmod = "2018-12-23T23:00:00+00:00"
summary = ""
tags = ["Development", "Project Management"]
title = "A praise and a rant towards Agile project management and its applications on SME businesses"
[header]
caption = ""
image = "https://res.cloudinary.com/roccatello/image/upload/v1545491229/samples/sheep.jpg"

+++
It's almost Xmas folks and I really need a break about forced politeness, so I'll shout here a secret I really would have told you before:

> **Agile sucks. But it's great for you!**

Agile project management actually works quite well. It's great compared to waterfall approach when applied to computer software development, as it helps PMs to take uncertainty in account and keep the delivery pace high enough in order not to sleep at night. Joking :)

Using a sprint based approach you could really keep production under control. There is plenty of literature about this and I'm not the right person to give you lessons about this (probably I could but let's keep this out for a moment).

At 3DGIS we currently use the great Atlassian tool called JIRA, which is actually perfect when used with Tempo Timesheet and Tempo Planner. We also use Confluence, Gliffy and some other nice tools.

All this stuff is integrated with our custom ERP which collects performance indicators and help us find out performance bottlenecks.

Our project management pipeline is almost always done in the following way, and it is accurately documented in our quality management system. I'll skip the documentation part.

    1)   A projects is collected in the ERP, which assigns it a code. 
         This code is unique and shared between management apps.
    1.a) A specific JIRA project is created, if the requirements need it.
    2)   JIRA issues are created within the project and 
         they have a reference to the project code.
    3)   Issues are orchestrated in Sprints which corresponds to milestones, 
         something that would be called a "deliverable" in real life.
    4)   Deliverables get delivered to their destination, which responds with a feedback.
    5)   Development receives feedbacks and iterates 2-5 until project completion.