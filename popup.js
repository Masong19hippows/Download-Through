
chrome.storage.sync.get(["servers"], function(result) {
    var servers = [];
    servers = result.servers;
    for(let i = 0; i < servers.length; i++){
        fetch(servers[i].baseURL + "/api/v1/tasks", {
            method: 'GET'
            }).then((responce) => {
                responce.text().then((result) => {
                    var downloadSize = JSON.parse(result).data;
                    var li = document.createElement('li');
                    var header = document.createElement("h1");
                    var downloads = document.createElement("p");
                    var divclass = document.createElement('div');
                    var deletebutton = document.createElement("button");
                    var deleteButtonImg = document.createElement("img");

                    
                    deletebutton.id = "deleteButton";
                    deletebutton.className += "deleteButton";
                    deleteButtonImg.src = "/icons/delete.png";
                    deletebutton.addEventListener("click", function(){
                        removeServer(servers[i]);
                        location.reload();
                    });
                    downloads.innerText =  downloadSize.length + " Downloads";
                    header.innerText = servers[i].name;
                    divclass.className += "listcontainer";
                    li.addEventListener("click", function(){toggleDownloads(servers[i].baseURL)})
                    

                    deletebutton.appendChild(deleteButtonImg);
                    li.appendChild(deletebutton);
                    li.appendChild(header);
                    li.appendChild(downloads);
                    divclass.appendChild(li);
                    document.getElementById("myList").appendChild(divclass);
                })
    
        });
    }
});


function addServer(name, baseURL){

    chrome.storage.sync.get(["servers"], function(result) {  

        var servers = result.servers;
        for(let i = 0; i < servers.length; i++){
            chrome.contextMenus.remove(servers[i].baseURL)
        }

        servers.push({"name": name, "baseURL": baseURL});
        chrome.storage.sync.set({servers: servers}).then(function(){


            for(i = 0; i < servers.length; i++){
                chrome.contextMenus.create({
            
                    title: servers[i].name,
                    id: servers[i].baseURL,
                    parentId: "Download-Through",
                    contexts: ["link"]
                
                });
            }
        });
    });

    
}

function removeServer(server){

    chrome.storage.sync.get(["servers"], function(result) {  
        var servers = result.servers;
        for(let i = 0; i < servers.length; i++){
            chrome.contextMenus.remove(servers[i].baseURL)
        }

        for(let i = 0; i < servers.length; i++){
            if(servers[i].name == server.name){
                servers.splice(i, 1);
                break;
            }
        }

        chrome.storage.sync.set({servers: servers}).then(function(){


            for(i = 0; i < servers.length; i++){
                chrome.contextMenus.create({
            
                    title: servers[i].name,
                    id: servers[i].baseURL,
                    parentId: "Download-Through",
                    contexts: ["link"]
                
                });
            }
        });
    });
}

function removeDownload(server, task){
    fetch(server + "/api/v1/tasks/" + task + "?force=true", {
        method: 'DELETE'
        }).then(loadDownloads(server));
}

function toggleForm() {

    if(document.getElementById("myForm").style.display == "block"){
        document.getElementById("myForm").style.display = "none";
    } else {
        document.getElementById("myForm").style.display = "block";
    }



    
}

function loadDownloads(server){
    document.getElementById("list").remove();
    var list = document.createElement("ul");


    for(let i = 0; i < list.length; i++){
        console.log(list[i]);
    }

    fetch(server + "/api/v1/tasks", {
        method: 'GET'
        }).then((responce) => {
            responce.text().then((result) => {

            var tasks = JSON.parse(result).data;
            
            for(let i = 0; i < tasks.length; i++){
                var li = document.createElement('li');
                var header = document.createElement("h2");
                var download = document.createElement("p");
                var divclass = document.createElement('div');
                var deleteButton = document.createElement('button');
                var deleteButtonImg = document.createElement('img')

                if(i == 0){
                    var backbutton = document.createElement("button");
                    var backButtonImg = document.createElement("img");
                    
                    list.id = "list";
                    backbutton.id = "backButton";
                    backbutton.className += "backButton";
                    backButtonImg.src = "/icons/backArrow.png";
                    backbutton.addEventListener("click", function(){toggleDownloads("backbutton")});
                
                    backbutton.appendChild(backButtonImg);
                    li.appendChild(backbutton);
                }
        
                header.innerText = tasks[i].meta.res.name;
                download.innerText =  tasks[i].status;
                divclass.className += "listcontainer1";
                deleteButton.className += "delete";
                deleteButtonImg.src = "/icons/delete.png";
                deleteButton.addEventListener("click", function(){
                    removeDownload(server, tasks[i].id);
                    location.reload();
                })

                deleteButton.appendChild(deleteButtonImg);
                li.appendChild(header);
                li.appendChild(deleteButton);
                li.appendChild(download);
                divclass.appendChild(li);
                list.appendChild(divclass);

                document.getElementById("downloads").appendChild(list);
            }
        })
            
    });
}

function toggleDownloads(server) {

    
    if(document.getElementById("downloads").style.display == "block"){
        document.getElementById("downloads").style.display = "none";
        document.getElementById("downloadslist").style.display = "block";
    } else {
        document.getElementById("downloadslist").style.display = "none";
        document.getElementById("downloads").style.display = "block";
    }

    if(server == "backbutton"){
        return;
    }
    loadDownloads(server);
}

window.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("formButton").addEventListener("click", toggleForm);
    
    var form = document.getElementById("myForm");
    form.addEventListener("submit", (event) => {
        toggleForm();
        event.preventDefault();
        var url = document.getElementById("url").value;
        var name = document.getElementById("name").value;
        addServer(name, url);
        name = "";
        url = "";
        location.reload();
      });

      chrome.storage.sync.get(["servers"], function(result) {  

          if(result.servers.length == 0){
              toggleForm();
          }
    });
});