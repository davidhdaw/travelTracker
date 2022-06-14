# Travel Tracker

## Table of Contents
- [Introduction](#introduction)
- [Technologies](#technologies)
- [Set Up](#set-up)
- [Deployment Link](#deployment-link)
- [Features](#features)
- [Reflection](#reflection)
- [Future Features](#future-features)
- [Contributors](#contributors)
- [Project Specifications](#project-specifications)

### Introduction
Have you ever had trouble keeping track of all your trips? Then it's time to try **Travel Tracker** is here for you!

Travel Tracker helps keep track of your past and upcoming vacations. From your destination and number of travelers to the duration of your trip and even its total cost!

### Technologies
- JavaScript
- HTML
- CSS

### Set Up
1. Clone this [repository](https://github.com/davidhdaw/travelTracker).
2. `cd` into the directory.
3. run `npm install` then `npm start`
4. clone down and run this local server [repository](https://github.com/turingschool-examples/travel-tracker-api) for the site's api.
5. go to `http://localhost:8080/` in your browser.

### Features
- A login screen with error handling for missing or incorrect passwords or usernames.
![Page Layout](/src/images/TT-login.gif)
- A running tally of how much the user has spent on vacations for this year.
- data on all a users travels including layouts for their past, future and pending vacations.
- dynamic dates to next and last vacation using day.js integration.
![Page Layout](/src/images/TT-layouts.gif)
- A form for creating new vacations that are immediately written to the user's info on the server side.
![ChartSwap](/src/images/TT-vacationForm.gif)



### Reflections
- A lot of the data model and planning for this project revolved around the async nature of the required fetch and post calls to communicate with the project api. While the site's functionality is very clean I hope to be able to write clearer/DRYer functions using fetch/post functionality in the future.
- This project was really a lesson in time management and minimum viable product. There's a lot more I'd like to do in terms of both polish and additional functionality with Travel Tracker but by focusing on the core features I was able to get the basic project finished extremely quickly.


### Future Features
- A separate admin layout for travel agents with the ability to approve and delete posts.
- Allow users to dynamically expand the mini layout for trips into a larger expanded view similar to the "hero" trip above.
- Additional data validation for the vacation planner.
- revised styling to use brighter color scheme while still passing accessibility tests in lighthouse.

### Contributors
- [David Daw](https://github.com/davidhdaw)[LinkedIn](https://www.linkedin.com/in/david-daw-04aa36237/)


### Project Specifications
- Made for Turing School of Software and Design
![Turing Logo](/src/images/turing-logo.png)
- Project specs are located [here](https://frontend.turing.edu/projects/travel-tracker.html).
