import './App.css';
import Form from './Form';

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting === "hello")
            sendResponse({ farewell: "goodbye" });
    }
);

function App() {

    return (
        <>
          
            <Form />
        </>

    );
}

export default App;
