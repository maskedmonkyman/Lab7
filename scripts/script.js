// script.js

import { router } from './router.js'; // Router imported so you can use it to manipulate your SPA app here
const setState = router.setState;
const settingsButton = document.querySelector('[alt="settings"]');
const mainButton = document.querySelector("h1");
const entryPage = document.querySelector("entry-page");
entryPage.index = -1;

function getEntryPageState()
{
  return {
    entry: entryPage.entry,
    entryIndex: entryPage.index
  };
}

history.replaceState(getEntryPageState(), null, "");

window.onpopstate = function(event){
  setState(event.state);
};

mainButton.onclick = () => {history.pushState((getEntryPageState()), null, "./"); setState()};
settingsButton.onclick = () => {history.pushState((getEntryPageState()), null, "settings"); setState()};

// Make sure you register your service worker here too
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://cse110lab6.herokuapp.com/entries')
    .then(response => response.json())
    .then(entries => {
      entries.forEach(entry => {
        let newPost = document.createElement('journal-entry');
        newPost.entry = entry;
        document.querySelector('main').appendChild(newPost);
        let index = document.querySelector('main').childNodes.length;
        newPost.onclick = () => {
          entryPage.index = index;
          let entryState = {
            entry: entry,
            entryIndex: index
          };
          history.pushState(entryState, null, "entry" + String(index));
          setState(entryState)};
      });
    });
});