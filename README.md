# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

# Stack

CreateT3, NextJS, TRPC, Prisma, Postgres, Typescript, Tailwind, Clerk, Vercel

# Intro

I built this to learn NextJS with CreatT3 and put it on my CV. This is a Full Stack issue tracker application. It's connected to a Postgres database and uses Clerk for authentication. The Authentication requires your github account. This application is hosted on Vercel which also hosts the database.

# Important !

If you wish to run this application locally make sure correctly set all the env variables following the example env. You need to have Postgres installed.You will need to install node modules and run `npx prisma db push` to establish connection to the database and create neseccary tables.

# Start locally

```
npm install
npx prisma db push
npm run dev
```

# Description

This is an issue tracker application. It contains 2 models, issue and comment with CRUD operations for both. Authentication is handled by Clerk. This application contains 3 pages; dashboard, create, and view issue by id.

# Pages

Dashboard

- The dashboard is the home page. It contains a tabled list of created issues. It displays the title, status and when it was created.
- Clicking on an issue in the list with take you to the view issue by id page.
- Clicking on the create button will take you to the create issue page.
- The status of an issue is color coded depending on its enum.

Creat

- Here you create your issue. The issue requires a title and description.
- The status is automatically set to open as its a new issue.
- once an issue is created you are redirected to the dashboard where it is added to the list

View by id

- This page is the most complex. It contains all the details of an issue, you can also update and delete the issue here. Below you can create and view comments made on the issue by different users.
- Only the original creator can edit or delete their comment. This is checked with clerk as the github user id is set as the author id for the comment.
- Comments are time stammped

# Models

model Issue {\
id Int @id @default(autoincrement())\
title String @db.VarChar(255)\
description String @db.Text\
status Status @default(OPEN)\
createdAt DateTime @default(now())\
updatedAt DateTime @updatedAt\
assignedToUserId String? @db.VarChar(255)\
authorId String\
}

model Comment {\
id Int @id @default(autoincrement())\
issueId Int\
description String\
createdAt DateTime @default(now())\
authorId String\
@@index([issueId])\
}

# Comments

In this project I experimented with using V0.dev which is a component creating platform. It uses AI and creates a UI based on a text prompt. This project will require furthur development but I believe it's reached a stage where I can show it off and add it to my CV.
