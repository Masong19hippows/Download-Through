


function pushToServer(server, link){

    responce = fetch(server + "/api/v1/tasks", {
        method: 'POST',
        body: `{
           "req": {"url": "` + link + `"}
          }`,
        });
}

function loadToContext(servers){
    for(i = 0; i < servers.length; i++){
        chrome.contextMenus.create({
    
            title: servers[i].name,
            id: servers[i].baseURL,
            parentId: "Download-Through",
            contexts: ["link"]
        
        });
    }
}

chrome.contextMenus.onClicked.addListener(
    function (event){
        pushToServer(event.menuItemId, event.linkUrl);
    }
);


chrome.runtime.onInstalled.addListener(function (object) {

    chrome.contextMenus.create({

        title: "Download-Through",
        id: "Download-Through",
        contexts: ["link"]
    
    });
    
    var servers = [];
    chrome.storage.sync.set({servers: servers}).then(function() {
        chrome.storage.sync.get(["servers"], function(result) {        
            servers = result.servers;
            loadToContext(servers);
        });
    });
});