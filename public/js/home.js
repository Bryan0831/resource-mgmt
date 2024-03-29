function viewResources() {
var response = '';
var request = new XMLHttpRequest();
request.open('GET', '/view-resources', true);
request.setRequestHeader('Content-Type', 'application/json');
request.onload = function () {
response = JSON.parse(request.responseText);
var html = ''
for (var i = 0; i < response.length; i++)
{
html += '<tr>' +
'<td>' + (i+1) + '</td>' +
'<td>' + response[i].name + '</td>' +
'<td>' + response[i].location + '</td>' +
'<td>' + response[i].description + '</td>' +
'<td>' + response[i].owner + '</td>' +
'<td>' +
'<button type="button" class="btn btn-warning" onclick="editResource(\'' + JSON.stringify(response[i]) + '\')">Edit </button> ' + '<button type="button" class="btn btn-danger" onclick="deleteResource(' + response[i].id + ')"> Delete</button>' + '</td>'+'</tr>'
}
document.getElementById('tableContent').innerHTML = html;
};
request.send();
}
function addResource() {
    var response = "";
    var jsonData = new Object();
    jsonData.name = document.getElementById("name").value;
    jsonData.location = document.getElementById("location").value;
    jsonData.description = document.getElementById("description").value;
    jsonData.owner = sessionStorage.getItem("email");
    if (jsonData.name == "" || jsonData.location == "" || jsonData.description == "") {
        document.getElementById("message").innerHTML = 'All fields are required!';
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }
    var request = new XMLHttpRequest();
    request.open("POST", "/add-resource", true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        console.log(response)
        if (response.message == undefined) {
            document.getElementById("message").innerHTML = 'Added Resouce: ' +
                jsonData.name + '!';
            document.getElementById("message").setAttribute("class", "text-success");
            document.getElementById("name").value = "";
            document.getElementById("location").value = "";
            document.getElementById("description").value = "";
        }
        else {
            document.getElementById("message").innerHTML = 'Unable to addresource!'; document.getElementById("message").setAttribute("class", "text-danger");
            document.getElementById("message").setAttribute("class", "text-danger");
        }
    };
    request.send(JSON.stringify(jsonData));
}

function editResource(data) {
    var selectedResource = JSON.parse(data);
    document.getElementById("editName").value = selectedResource.name;
    document.getElementById("editLocation").value = selectedResource.location;
    document.getElementById("editDescription").value = selectedResource.description;
    document.getElementById("updateButton").setAttribute("onclick", 'updateResource("' +
        selectedResource.id + '")');
    $('#editResourceModal').modal('show');
}
function updateResource(id) {
    console.log(id)
    var response = "";
    var jsonData = new Object();
    jsonData.name = document.getElementById("editName").value;
    jsonData.location = document.getElementById("editLocation").value;
    jsonData.description = document.getElementById("editDescription").value;
    if (jsonData.name == "" || jsonData.location == "" || jsonData.description == "") {
        document.getElementById("editMessage").innerHTML = 'All fields are required!';
        document.getElementById("editMessage").setAttribute("class", "text-danger");
        return;
    }
    var request = new XMLHttpRequest();
    request.open("PUT", "/edit-resource/" + id, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        if (response.message == "Resource modified successfully!") {
            document.getElementById("editMessage").innerHTML = 'Edited Resource: ' +
                jsonData.name + '!';
            document.getElementById("editMessage").setAttribute("class",
                "text-success");
            window.location.href = 'home.html';
        }
        else {
            document.getElementById("editMessage").innerHTML = 'Unable to edit resource!';
            document.getElementById("editMessage").setAttribute("class", "text-danger");
        }
    };
    request.send(JSON.stringify(jsonData));
}

function deleteResource(selectedId) {
    var response = "";
    var request = new XMLHttpRequest();
    request.open("DELETE", "/delete-resource/" + selectedId, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        if (response.message == "Resource deleted successfully!") {
            window.location.href = 'home.html';
        }
        else {
            alert('Unable to delete resource!');
        }
    };
    request.send();
}
