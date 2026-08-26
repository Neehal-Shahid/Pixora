# Pixora: A Fast and Beautiful Image Search Engine

**Overview**
I built a custom image discovery platform called Pixora. It helps people find high-quality photos fast. The app pulls data directly from the Unsplash API. I designed it to feel premium, responsive, and easy to use.

**The Goal**
I wanted to build an app that solves real problems. It needed to handle large amounts of image data smoothly. It had to look perfect on mobile phones. I also wanted to add personalized features like custom user collections. 

**Tech Stack**
* **Frontend:** React, Vite
* **Styling:** Tailwind CSS
* **State Management:** React Context API
* **Routing:** React Router

**Key Features**
* **Masonry Grid:** Images fit together perfectly without weird gaps.
* **Custom Collections:** Users can create folders and save their favorite photos. 
* **Smart Search:** Live search results with orientation filters.
* **Dynamic SEO:** Page titles update automatically based on what the user searches for.

### Challenges and Solutions

**Challenge 1: Strict API Limits**
Unsplash limits free accounts to just 50 requests per hour. A user could hit this limit in a few minutes of browsing. The app would break.
**The Fix:** I wrote a custom caching system. It saves the API response for five minutes. If a user goes back to the home page, the app loads the saved data instead of calling the API again. This kept the app running smoothly and stopped the errors.

**Challenge 2: Tricky Image Layouts**
Photos come in all different sizes. Standard CSS grids stretch the images or leave ugly blank spaces. 
**The Fix:** I built a custom masonry layout engine. It calculates the height of each image and places it into the shortest column. This creates a flawless, Pinterest-style grid on any screen size.

**Challenge 3: Managing Saved Photos**
I wanted users to save photos into specific named folders. This gets complicated when passing data across many different pages.
**The Fix:** I used the React Context API to manage the collections globally. I combined this with local storage. Now, a user can create a folder, save a photo, and see it there the next day. 

**What I Learned**
Building Pixora pushed my frontend skills forward. I learned how to protect an app against strict API rate limits. I learned how to build complex UI components from scratch. Most importantly, I learned how to manage global state cleanly without needing heavy tools like Redux.
