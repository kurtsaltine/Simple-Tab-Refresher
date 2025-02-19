
let stopReloading =false;

document.getElementById('submitform').addEventListener('click', function(event) {
    event.preventDefault();
    const selectRadio = document.querySelector('input[name="frequency"]:checked');

    if (selectRadio) {
        const frequency = selectRadio.value;
        let delayInSeconds = 0;
        switch(frequency) {
            case "5":
                delayInSeconds = 5;
                break;
            case "15":
                delayInSeconds = 15;
                break;
            case "30":
                delayInSeconds = 30;
                break;
            case "60":
                delayInSeconds = 60;
                break;
            case "90":
                delayInSeconds = 90;
                break;
            case "300":
                delayInSeconds = 300;
                break;
                                                
        }
        chrome.tabs.query({active:true, currentWindow:true},function(tabs){
            if (tabs.length > 0) {
                const tabIds = tabs.map(tab => tab.id);
                chrome.runtime.sendMessage({
                    action: 'startReloading',
                    delayInSeconds,
                    tabIds
                });
            } else {
                console.error('no tabs found');
            }
        });
    } else {
        alert('Please select a refresh frequency');
    }
});

function updateRefreshingTabs() {
    chrome.runtime.sendMessage({ action: 'getRefreshingTabs'}, (response) =>{
        const tabsList = document.getElementById('tabs-list');
        tabsList.innerHTML = '';
        for (const tabId in response.refreshingTabs) {
            chrome.tabs.get(parseInt(tabId), function(tab) {
            const listItem = document.createElement('li');
            const tabName = tab.title || 'Untitled Tab';
            listItem.textContent = `${tabName}`;
            const stopButton = document.createElement('button');
            stopButton.textContent = ' Stop Refresh';
            stopButton.addEventListener('click', () => stopTabRefresh(tabId));
            listItem.appendChild(stopButton);
            tabsList.appendChild(listItem);
        });
    }
});
}
function stopTabRefresh(tabId) {
    chrome.runtime.sendMessage({ action: 'stopReloading', tabId});
    updateRefreshingTabs();
}
document.getElementById('stoprefresh').addEventListener('click',function(){
    chrome.runtime.sendMessage({ action: 'stopReloading'});
    updateRefreshingTabs();
})

document.addEventListener('DOMContentLoaded', updateRefreshingTabs);