Streamify - Product Development Brief
Your Role
You are a Full-Stack MERN Developer who is in charge of creating Streamify. Streamify is a new language learning platform that lets people talk to speakers from all around the world.

The platform needs to be easy to use and look really good. It should be like the messaging apps we use every day such, as WhatsApp, Telegram and Discord. Users should be able to find people to practice languages with talk to them in time and get help from a tutor that uses artificial intelligence.

The finished app has to work be fast and be easy for everyone to use. It also has to work on computers, small tablets and little mobile phones. Streamify has to be an simple platform that people want to use. The goal is to make Streamify feel polished and intuitive like the tools we use to communicate with each other. Streamify should be a platform that's easy to navigate and use no matter what device people are using.
Project Goal
Build a complete full-stack application that enables users to:
•	Create accounts and securely authenticate
•	Set up language-learning profiles
•	Discover and connect with language partners
•	Send and receive friend requests
•	Communicate through real-time chat
•	Join high-quality video calls
•	Use an AI assistant for language learning
•	Receive live weather and news information through the AI assistant
•	Customize the interface using multiple visual themes
•	Manage and update personal profile information
Every feature should be fully functional rather than partially implemented or mocked.

Technology Requirements
Frontend Technologies
•	You have to used React 19 to build the user interface because it helps me break the application into parts and keep the code organized. This way you can reuse the parts. Make the code look neat.
•	Vite is what you have to chose for setting up the project. It gives me a fast development environment and quick build times, which is really helpful.
•	You have to used React Router v7 to manage navigation between pages. This way the application still feels like a page even though you can move between different parts of it with React.
•	Tailwind CSS v3 is what you used to design the interface. It helps you do this faster without having to write a lot of custom CSS code.
•	DaisyUI gives you to made components that match the overall design. This reduces the effort you need to put in when working with React.
•	You added Framer Motion to create animations and transitions. This makes the React application feel more interactive and fun to use.
•	TanStack React Query is what You have to use to handle API data fetching, caching and updates. It does this efficiently with React, which's great.
•	You have to used Axios to send requests to the backend and get the data the frontend needs.
•	The Stream Chat React SDK is what you used to add real-time messaging features to the React application.
•	You also used the Stream Video SDK to support video calling and real-time communication between users with React.
•	React Hot Toast is what you have used to display notifications like success messages, warnings and errors in the React application.
Backend Technologies
•	You have to used Node.js to run the backend application and handle the server-side work.
•	Express.js helps me create APIs and manage the backend routes in a way.
•	MongoDB Atlas is what you chose for the database. It is easy to manage. Can handle a lot of users, which is important for me.
•	You have to used Mongoose to define the data models and interact with MongoDB in a way.
•	JWT Authentication is what You implemented to authenticate users and protect the routes with Node.js.
•	Bcryptjs is what you have to use to hash the user passwords before storing them. This makes the application more secure.
•	The Stream Chat SDK is also used on the backend to manage the chat users, channels and authentication with Node.js.
•	You have to integrated the Google Gemini API to add AI-powered capabilities and generate responses.
•	NewsAPI is what you used to get the news articles from sources.
•	The Wttr.in Weather API is what you used to display the real-time weather information based on the location.
•	Dotenv is what you have  use to keep the API keys and database credentials separate, from the source code.
•	Cookie-parser is what helped the server read and process the cookies sent by the client.
•	You have to used Cors to allow the frontend and backend to communicate even though they are running on domains.


Authentication Flow
Implement a secure authentication system.
Users should be able to:
Sign Up
Collect:
•	Full Name
•	Email Address
•	Password
Requirements:
•	Password minimum length: 6 characters
•	Automatically generate a default DiceBear avatar
•	Store passwords securely using hashing
Login
Allow login using:
•	Email
•	Password
Authentication must use JWT stored inside secure http  Only cookies.
Logout
Provide a complete logout mechanism that clears authentication cookies.
Onboarding
After registration, guide users through profile setup where they provide:
•	Bio
•	Native Language
•	Learning Language
•	Location
•	Profile Picture
Users who have not completed on boarding should not access protected sections of the platform.

User Experience Requirements
The application should feel modern and responsive at all times.
Key expectations:
•	Fast page transitions
•	Smooth loading states
•	Helpful empty states
•	Clear success and error messages
•	Responsive design across all screen sizes
•	Accessibility best practices
•	Keyboard-friendly interactions

Sidebar Experience
Create a persistent sidebar that serves as the primary navigation system.
The sidebar should include:
•	Streamify branding
•	Navigation links
•	Friends list
•	Current user information
Friend entries should display:
•	Avatar
•	Name
•	Native language
•	Online status
Users should be able to open conversations directly from the sidebar.
Loading and empty states must be handled gracefully.

Real-Time Messaging System
The chat experience should support modern messaging functionality.
Required capabilities:
•	Real-time communication
•	Message reactions
•	Replies
•	Message editing
•	Message deletion
•	Quoting messages
•	Media attachments
•	File sharing
•	Audio sharing
•	Emoji support
The interface should feel familiar to users of popular messaging applications.

Self-Destruct Messages
Allow users to send disappearing messages.
Supported timers:
•	Off
•	10 seconds
•	1 minute
•	24 hours
When enabled:
•	Users should clearly see the active timer
•	Messages should automatically disappear after expiration
•	Deleted messages should use a smooth smoke-style animation
The implementation must avoid stale-state issues and remain reliable under continuous usage.

Location Sharing
Users should be able to share live location directly inside chats.
Supported durations:
•	15 minutes
•	1 hour
•	8 hours
Requirements:
•	Generate a shareable Google Maps link
•	Refresh location periodically
•	Automatically stop after expiration
•	Allow manual termination
The UI should visually indicate when location sharing is active.

Chat Management
Provide options to remove conversations.
Supported actions:
Delete For Me
Only remove messages from the current user’s view.
Delete For Everyone
Remove messages globally where permissions allow.
Requirements:
•	Confirmation dialog
•	Animated deletion sequence
•	Clear feedback showing deletion results

Video Calling
Implement one-to-one HD video calling using Stream Video SDK.
Users should be able to:
•	Start calls from chat
•	Receive call links
•	Join existing calls
•	Leave calls safely
The system should properly clean up resources when calls end to avoid memory leaks or duplicate sessions.

Profile Management
Create a profile page that allows users to view and edit personal information.
Display:
•	Avatar
•	Full Name
•	Bio
•	Email
•	Location
•	Native Language
•	Learning Language
Editing should support:
•	Updating profile information
•	Generating a new avatar
•	Saving changes
•	Cancelling edits
Email addresses should remain read-only.

Theme Customization
Provide a complete theme system powered by DaisyUI.
Requirements:
•	More than 30 themes
•	Live preview
•	Theme persistence using local storage
•	Instant theme switching
Users should not lose their selected theme after refreshing the application.

AI Assistant
Build an AI-powered language tutor using Google Gemini.
The assistant should help users with:
•	Grammar corrections
•	Translation
•	Pronunciation guidance
•	Vocabulary improvement
•	General questions
The assistant should communicate in the same language used by the user whenever possible.

Weather Support
The AI assistant should detect weather-related requests automatically.
Examples:
•	Weather
•	Temperature
•	Mausam
•	Baarish
•	Garmi
•	Sardi
The assistant should retrieve real-time weather information and present it in a concise, user-friendly format.

News Support
The AI assistant should recognize requests related to current events.
Examples:
•	News
•	Headlines
•	Breaking News
•	Khabar
•	Latest Updates
The system should fetch recent articles and summarize key information clearly.

Backend Requirements
Create clean, maintainable REST APIs that support:
•	Authentication
•	User profiles
•	Friend requests
•	Chat token generation
•	AI interactions
All endpoints must return structured JSON responses.
Each response should include:
•	Success status
•	Message
•	Relevant data
•	Error information when applicable

Security Expectations
Security must be treated as a first-class requirement.
Implement:
•	Password hashing
•	JWT authentication
•	Protected routes
•	Input validation
•	Input sanitization
•	XSS protection
•	Secure environment variables
•	Proper CORS configuration
•	Secure cookie handling
Never expose secrets on the client side.

Performance Requirements
The application should remain fast and scalable.
Requirements:
•	Lazy loading where beneficial
•	Optimized bundle size
•	Efficient API usage
•	Smooth rendering
•	Responsive interactions
•	Minimal unnecessary re-renders
Performance should remain stable even as user activity increases.

Deliverables
Provide:
1.	Complete frontend implementation# 🚀 Streamify - Product Development Brief

---

# 🎭 Your Role

You are a Full-Stack MERN Developer who is in charge of creating **Streamify**. Streamify is a new language learning platform that lets people talk to speakers from all around the world.

The platform needs to be easy to use and look really good. It should be like the messaging apps we use every day such, as WhatsApp, Telegram and Discord. Users should be able to find people to practice languages with talk to them in time and get help from a tutor that uses artificial intelligence.

The finished app has to work be fast and be easy for everyone to use. It also has to work on computers, small tablets and little mobile phones. Streamify has to be an simple platform that people want to use. The goal is to make Streamify feel polished and intuitive like the tools we use to communicate with each other. Streamify should be a platform that's easy to navigate and use no matter what device people are using.

---

# 🎯 Project Goal

Build a complete full-stack application that enables users to:

* Create accounts and securely authenticate
* Set up language-learning profiles
* Discover and connect with language partners
* Send and receive friend requests
* Communicate through real-time chat
* Join high-quality video calls
* Use an AI assistant for language learning
* Receive live weather and news information through the AI assistant
* Customize the interface using multiple visual themes
* Manage and update personal profile information

> Every feature should be fully functional rather than partially implemented or mocked.

---

# 🛠️ Technology Requirements

## Frontend Technologies

* You have to used **React 19** to build the user interface because it helps me break the application into parts and keep the code organized. This way you can reuse the parts. Make the code look neat.
* **Vite** is what you have to chose for setting up the project. It gives me a fast development environment and quick build times, which is really helpful.
* You have to used **React Router v7** to manage navigation between pages. This way the application still feels like a page even though you can move between different parts of it with React.
* **Tailwind CSS v3** is what you used to design the interface. It helps you do this faster without having to write a lot of custom CSS code.
* **DaisyUI** gives you to made components that match the overall design. This reduces the effort you need to put in when working with React.
* You added **Framer Motion** to create animations and transitions. This makes the React application feel more interactive and fun to use.
* **TanStack React Query** is what You have to use to handle API data fetching, caching and updates. It does this efficiently with React, which's great.
* You have to used **Axios** to send requests to the backend and get the data the frontend needs.
* The **Stream Chat React SDK** is what you used to add real-time messaging features to the React application.
* You also used the **Stream Video SDK** to support video calling and real-time communication between users with React.
* **React Hot Toast** is what you have used to display notifications like success messages, warnings and errors in the React application.

## Backend Technologies

* You have to used **Node.js** to run the backend application and handle the server-side work.
* **Express.js** helps me create APIs and manage the backend routes in a way.
* **MongoDB Atlas** is what you chose for the database. It is easy to manage. Can handle a lot of users, which is important for me.
* You have to used **Mongoose** to define the data models and interact with MongoDB in a way.
* **JWT Authentication** is what You implemented to authenticate users and protect the routes with Node.js.
* **Bcryptjs** is what you have to use to hash the user passwords before storing them. This makes the application more secure.
* The **Stream Chat SDK** is also used on the backend to manage the chat users, channels and authentication with Node.js.
* You have to integrated the **Google Gemini API** to add AI-powered capabilities and generate responses.
* **NewsAPI** is what you used to get the news articles from sources.
* The **Wttr.in Weather API** is what you used to display the real-time weather information based on the location.
* **Dotenv** is what you have use to keep the API keys and database credentials separate, from the source code.
* **Cookie-parser** is what helped the server read and process the cookies sent by the client.
* You have to used **Cors** to allow the frontend and backend to communicate even though they are running on domains.

---

# 🔐 Authentication Flow

## Sign Up

Collect:

* Full Name
* Email Address
* Password

### Requirements

* Password minimum length: 6 characters
* Automatically generate a default DiceBear avatar
* Store passwords securely using hashing

## Login

Allow login using:

* Email
* Password

Authentication must use JWT stored inside secure http Only cookies.

## Logout

Provide a complete logout mechanism that clears authentication cookies.

## Onboarding

After registration, guide users through profile setup where they provide:

* Bio
* Native Language
* Learning Language
* Location
* Profile Picture

Users who have not completed on boarding should not access protected sections of the platform.

---

# ✨ User Experience Requirements

The application should feel modern and responsive at all times.

### Key Expectations

* Fast page transitions
* Smooth loading states
* Helpful empty states
* Clear success and error messages
* Responsive design across all screen sizes
* Accessibility best practices
* Keyboard-friendly interactions

---

# 📂 Sidebar Experience

Create a persistent sidebar that serves as the primary navigation system.

The sidebar should include:

* Streamify branding
* Navigation links
* Friends list
* Current user information

Friend entries should display:

* Avatar
* Name
* Native language
* Online status

Users should be able to open conversations directly from the sidebar.

Loading and empty states must be handled gracefully.

---

# 💬 Real-Time Messaging System

The chat experience should support modern messaging functionality.

### Required Capabilities

* Real-time communication
* Message reactions
* Replies
* Message editing
* Message deletion
* Quoting messages
* Media attachments
* File sharing
* Audio sharing
* Emoji support

The interface should feel familiar to users of popular messaging applications.

---

# ⏳ Self-Destruct Messages

Allow users to send disappearing messages.

### Supported Timers

* Off
* 10 seconds
* 1 minute
* 24 hours

### When Enabled

* Users should clearly see the active timer
* Messages should automatically disappear after expiration
* Deleted messages should use a smooth smoke-style animation

The implementation must avoid stale-state issues and remain reliable under continuous usage.

---

# 📍 Location Sharing

Users should be able to share live location directly inside chats.

### Supported Durations

* 15 minutes
* 1 hour
* 8 hours

### Requirements

* Generate a shareable Google Maps link
* Refresh location periodically
* Automatically stop after expiration
* Allow manual termination

The UI should visually indicate when location sharing is active.

---

# 🗑️ Chat Management

Provide options to remove conversations.

### Supported Actions

#### Delete For Me

Only remove messages from the current user’s view.

#### Delete For Everyone

Remove messages globally where permissions allow.

### Requirements

* Confirmation dialog
* Animated deletion sequence
* Clear feedback showing deletion results

---

# 🎥 Video Calling

Implement one-to-one HD video calling using Stream Video SDK.

Users should be able to:

* Start calls from chat
* Receive call links
* Join existing calls
* Leave calls safely

The system should properly clean up resources when calls end to avoid memory leaks or duplicate sessions.

---

# 👤 Profile Management

Create a profile page that allows users to view and edit personal information.

### Display

* Avatar
* Full Name
* Bio
* Email
* Location
* Native Language
* Learning Language

### Editing Should Support

* Updating profile information
* Generating a new avatar
* Saving changes
* Cancelling edits

Email addresses should remain read-only.

---

# 🎨 Theme Customization

Provide a complete theme system powered by DaisyUI.

### Requirements

* More than 30 themes
* Live preview
* Theme persistence using local storage
* Instant theme switching

Users should not lose their selected theme after refreshing the application.

---

# 🤖 AI Assistant

Build an AI-powered language tutor using Google Gemini.

The assistant should help users with:

* Grammar corrections
* Translation
* Pronunciation guidance
* Vocabulary improvement
* General questions

The assistant should communicate in the same language used by the user whenever possible.

---

# 🌦️ Weather Support

The AI assistant should detect weather-related requests automatically.

### Examples

* Weather
* Temperature
* Mausam
* Baarish
* Garmi
* Sardi

The assistant should retrieve real-time weather information and present it in a concise, user-friendly format.

---

# 📰 News Support

The AI assistant should recognize requests related to current events.

### Examples

* News
* Headlines
* Breaking News
* Khabar
* Latest Updates

The system should fetch recent articles and summarize key information clearly.

---

# ⚙️ Backend Requirements

Create clean, maintainable REST APIs that support:

* Authentication
* User profiles
* Friend requests
* Chat token generation
* AI interactions

All endpoints must return structured JSON responses.

Each response should include:

* Success status
* Message
* Relevant data
* Error information when applicable

---

# 🔒 Security Expectations

Security must be treated as a first-class requirement.

### Implement

* Password hashing
* JWT authentication
* Protected routes
* Input validation
* Input sanitization
* XSS protection
* Secure environment variables
* Proper CORS configuration
* Secure cookie handling

> Never expose secrets on the client side.

---

# ⚡ Performance Requirements

The application should remain fast and scalable.

### Requirements

* Lazy loading where beneficial
* Optimized bundle size
* Efficient API usage
* Smooth rendering
* Responsive interactions
* Minimal unnecessary re-renders

Performance should remain stable even as user activity increases.

---

# 📦 Deliverables

Provide:

1. Complete frontend implementation
2. Complete backend implementation
3. Clean folder structure
4. Environment variable setup
5. Installation instructions
6. Deployment instructions
7. Production-ready code
8. Error handling documentation
9. API documentation

> The final result should be a polished, fully functional, real-time language learning platform ready for deployment and future scaling.

2.	Complete backend implementation
3.	Clean folder structure
4.	Environment variable setup
5.	Installation instructions
6.	Deployment instructions
7.	Production-ready code
8.	Error handling documentation
9.	API documentation
The final result should be a polished, fully functional, real-time language learning platform ready for deployment and future scaling.

