# Interview Assignment
### In this assignment, you are to create a live instant messaging application, with authorization, and a simple frontend client.

## App Specification

The app is a single page, and contains a few sections:
1. Left pane:
   a. Shows my email
   b. Shows a list of all the currently online users in the system
2. Main pane: Show the chat with the selected user
3. Bottom pane: Message box, where you type in messages
   These are the desired behaviors:
1. As a user, I must login or register to use the app. No anonymous access.
2. When I’m logged in and the app is open, other users should see me in the online
   user’s list
3. I can block a user, so I won’t show up on his users list anymore.
4. All users can chat with each other (unless blocked)
5. If I have no open windows for the app, I should disappear from the list
6. If I have multiple windows open for the app, the state should be the EXACT same for
   each
   ### Technical Requirements:
   ● Use Node.js + Typescript (with any library/framework) for the API
   ● Use Auth0 for authentication (or any other EXTERNAL Auth provider, DO NOT
   implement your own auth).
   ● Use React for frontend (Typescript is optional)
   ● Use any database as the single source of truth.
   The database should store all of the interactions between the users.
   ● The frontend app state changes should be triggered in real time. The app should
   not rely on polling (interval requests).
   ● Deploy the app. Use a free Heroku account to publish the app. We will not install
   and build the app locally.
   ● MAJOR BONUS: For the message performance to be better, use any
   message-queue or in-memory solutions, like Redis, RabbitMQ, Kafka... (but the
   Database should still be the single-source-of-truth)
   General requirements:
   ● Submitting: The final result should be shared as a single email with 2 links:
   ○ Link to working deployed app
   ○ Link to the codebase
   (If you’re using a private GitHub repository, you need to add
   shahar4499@gmail.com as a member)

● DO NOT send pre-made chat project you did in school/side project, or found in
Github. We can spot that.
Be true to us and to yourself.
● README: Make a README for the repo, and write anything we should know