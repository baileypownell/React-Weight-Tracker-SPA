let contentDiv = document.getElementById('content');
const onNavigate = (pathname) => {
  window.history.pushState(
  {},
  pathname,
  window.location.origin + pathname
  )
  contentDiv.innerHTML = routes[pathname];
}
window.onpopstate = () => {
contentDiv.innerHTML = routes[window.location.pathname]
}


let homePage = `
<div id="ui">
  <h2>It's never been <span id="fancy">easier </span> to see your progress</h2>
  <button>LOG YOUR WEIGHT</button>
</div>
`;

let createUser = `
  <div id="ui">
    <h2>First Name:</h2>
    <input type="text"></input>
    <h2>Last Name:</h2>
    <input type="text"></input>
    <h2>Gender: </h2>
    <select>
      <option vlaue="male">Male</option>
      <option vlaue="male">Feale</option>
    </select>
  </div>
`;

let logWeight = `
<div id="ui">
  <h2>Today's weight: </h2>
  <input type="number"></input>
</div>
`;

let viewHistory = `
<div id="ui">
  <h2>Call to history to display all weight logs</h2>
</div>
`;



routes = {
  '/Weight-Tracker-SPA-Web-App/index.html': homePage,
  '/Weight-Tracker-SPA-Web-App/createUser': createUser,
  '/Weight-Tracker-SPA-Web-App/logWeight': logWeight,
  '/Weight-Tracker-SPA-Web-App/viewHistory': viewHistory
};



contentDiv.innerHTML = routes[window.location.pathname];
