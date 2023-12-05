

/*global window*/


let miroData;

let sprintsInterval = setInterval(() => {
   let sprints = document.querySelector('.jira-data')?.dataset?.sprints;

   if (sprints) {
      const parsedSprints = JSON.parse(sprints);

      chrome.runtime.sendMessage({ sprints: parsedSprints });

      document.querySelector('.jira-data')?.remove()
      parsedSprints?.length && clearInterval(sprintsInterval);
   }
}, 2000)

setInterval(() => {
   const issues = document.querySelector('.jira-data')?.dataset?.issues;

   if (issues) {
      const parsedIssues = JSON.parse(issues);

      chrome.runtime.sendMessage({ issues: parsedIssues });

      document.querySelector('.jira-data')?.remove()
   }
}, 2000)

// setInterval(() => {
//    const jira = document.querySelector('.jira-data')?.dataset?.issue;

//    if (jira) {
//       const d = JSON.parse(jira);

//       chrome.runtime.sendMessage(d);

//       document.querySelector('.jira-data')?.remove()
//    }
// }, 2000);

const addShapesData = (data) => {
   const prev = document.querySelector('.miro-data');
   prev?.remove();

   const miroData = document.createElement('div');
   miroData.classList.add('miro-data')
   miroData.dataset.tasks = JSON.stringify(data);
   document.body.appendChild(miroData);
}

const getJiraData = () => {
   const injectJS = document.createElement('script');
   injectJS.type = 'text/javascript';
   injectJS.src = chrome.runtime.getURL("get-jira.js");
   document.body.appendChild(injectJS);
}

const getJiraIssues = (id) => {
   const sprintId = document.createElement('div');
   sprintId.classList.add('sprint-id');
   sprintId.dataset.id = id;

   const injectJS = document.createElement('script');
   injectJS.type = 'text/javascript';
   injectJS.src = chrome.runtime.getURL("get-jira-issues.js");
   document.body.appendChild(injectJS);
}

const createMiroShapes = () => {
   const injectJS = document.createElement('script');
   injectJS.type = 'text/javascript';
   injectJS.src = chrome.runtime.getURL("test.js");
   document.body.appendChild(injectJS);
}

const image = document.createElement('img');

image.onclick = () => {
   document.querySelector('.miro-data').dataset.active = 'true';
}

const iconInterval = setInterval(() => {
   const menu = document.querySelector('[class^=boxPanel]')

   if (!menu) return;

   image.src = chrome.runtime.getURL('/samolet.png');
   image.style.maxWidth = '26px';
   image.style.borderRadius = '20px';
   image.style.padding = '5px';

   menu.appendChild(image);
   clearInterval(iconInterval);
}, 3000)

createMiroShapes();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
   console.log(sender, request)

   if (request.jira) {
      getJiraData();

   } else if (request.issues) {
      getJiraIssues(request.issues);
   } else {
      addShapesData(request);
   }

   console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

   if (request?.greeting === "hello") sendResponse({ farewell: "goodbye 343" });
});
