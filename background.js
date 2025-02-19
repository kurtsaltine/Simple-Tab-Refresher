let reloadIntervalIds = {};

function reloadTab(tabId, delayInSeconds) {
        if (reloadIntervalIds[tabId]) {
            clearInterval(reloadIntervalIds[tabId]);
        }
        reloadIntervalIds[tabId] = setInterval(() => {
            chrome.tabs.reload(tabId, () => {
                console.log(`Reloading tab: ${tabId}`);
            });
        }, delayInSeconds * 1000)
    }
function stopReloadingTab(tabId) {
    if (reloadIntervalIds[tabId]) {
        clearInterval(reloadIntervalIds[tabId]);
        delete reloadIntervalIds[tabId];
        console.log(`Stopped refreshing tab: ${tabId}`);
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message recieved', message);
    if (message.action === 'startReloading') {
        if (message.tabIds && Array.isArray(message.tabIds)){
            message.tabIds.forEach((tabId) => {
                if (tabId) {
                    reloadTab(tabId, message.delayInSeconds);
                    console.log(`Started refreshing tab ${tabId} every ${message.delayInSeconds} seconds.`)
                }
            });
        } else {
            console.error('No tab IDs provided.')
        }
    }  
    if (message.action ==='stopReloading') {
        if (message.tabId) {
        stopReloadingTab(message.tabId)
        }else {
            Object.keys(reloadIntervalIds).forEach((tabId) => {
                stopReloadingTab(Number(tabId));
            });
            console.log('Stopped refreshing all tabs.')
        }
    }
    if (message.action === 'getRefreshingTabs') {
        sendResponse({ refreshingTabs: reloadIntervalIds});
    }
});