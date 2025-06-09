# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).



// instrctions to set up

Satellite Tracker (Frontend)
A React-based frontend application for searching, filtering, and analyzing space objects. This application allows users to search for satellites by name or NORAD ID, apply filters by object type and orbit code, sort results, and select up to 10 satellites for further review. This README focuses solely on the frontend setup and usage.
Features

Search: Search satellites by name or NORAD ID.
Filters: Filter by object type (e.g., PAYLOAD, ROCKET BODY) and orbit code (e.g., LEO, GEO).
Virtualized List: Efficiently display large datasets using a virtualized list for better performance.
Sorting: Sort results by name, NORAD ID, or launch date.
Selection: Select up to 10 satellites and view them on a dedicated page.
Persistence: Selected satellites are saved to localStorage.
Responsive Design: Mobile-friendly layout with CSS media queries.

Project Structure
DRT_REACT_AMBATI-HARI-PRASAD/
├── digantara/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FiltersSection.tsx
│   │   │   ├── SearchSection.tsx
│   │   │   ├── SelectedList.tsx
│   │   │   ├── VirtualList.tsx
│   │   ├── mainComponent/
│   │   │   ├── SatelliteTracker.tsx
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   ├── setupTests.ts
│   │   ├── styles.css
│   │   ├── types.ts
│   ├── gitignore
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── tsconfig.json

Prerequisites

Node.js: Version 18 or higher.
npm: Version 9 or higher (comes with Node.js).
A modern web browser (e.g., Chrome, Firefox).

Setup Instructions
1. Clone the Repository
git clone <repository-url>
cd DRT_REACT_AMBATI-HARI-PRASAD/digantara

2. Install Dependencies
Install the required npm packages:
npm install

Required dependencies:

react and react-dom: For building the UI.
lucide-react: For icons used in the interface.

You can verify these in your package.json. A minimal example:
{
  "name": "satellite-tracker",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}

3. Update App.tsx
Ensure App.tsx renders the SatelliteTracker component. Update src/App.tsx to:
import React from 'react';
import SatelliteTracker from './mainComponent/SatelliteTracker';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <SatelliteTracker />
    </div>
  );
};

export default App;

Running the Application
Development Mode
Start the development server:
npm start


Open http://localhost:3000 in your browser.
The app will hot-reload on code changes.

Production Build
Create an optimized production build:
npm run build

Serve the built files using a static server, or deploy the build/ folder to a hosting service.
Usage

Search: Enter a satellite name or NORAD ID in the search fields and press Enter to fetch results.
Filter: Select object types and orbit codes from the filter section and click "Apply Filters".
Sort: Click column headers (Name, NORAD ID, Launch Date) to sort the results.
Select: Check up to 10 satellites to select them. Selected satellites are saved to localStorage.
View Selected: Click "Proceed" to view selected satellites on a separate page.
Reset: Click "Reset Filters" to clear all filters and search inputs.

Troubleshooting

Styles Not Loading: Ensure styles.css is correctly imported in components.
TypeScript Errors: Run tsc to check for TypeScript errors:npx tsc


Component Not Rendering: Verify that App.tsx correctly renders SatelliteTracker and that all imports are correct.

Development Notes

Components: The app is split into reusable components (VirtualList, SelectedList, FiltersSection, SearchSection) located in src/components/.
Main Component: The SatelliteTracker component is in src/mainComponent/.
Types: All TypeScript interfaces and constants are in src/types.ts.
CSS: All styles are centralized in src/styles.css for easy maintenance.
Virtualization: The VirtualList component uses virtualization to handle large datasets efficiently.

Contributing

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for details (if applicable).
Contact
For questions or support, contact the project maintainer at [ambati.hariprasad7@gmail.com].
