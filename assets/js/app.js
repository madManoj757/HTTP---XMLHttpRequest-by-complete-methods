const cl = console.log;

const postContainer = document.getElementById("postContainer")
const titleControl = document.getElementById("title")
const bodyControl = document.getElementById("body")
const userIdControl = document.getElementById("userId")
const postForm = document.getElementById("postForm")
const submitBtn = document.getElementById("submitBtn")
const updateBtn = document.getElementById("updateBtn")

let baseUrl = `https://jsonplaceholder.typicode.com`

let postUrl = `${baseUrl}/posts`;

let postArr = [];


// XMLHttpRequest >> constructor function
// POST >> CREATE
// GET >> READ
// PUT/PATCH >> PATCH/PUT
// DELETE >> DELETE


const templating = (arr) => {
    let result = ``;
    arr.forEach(post => {
        result += ` <div class="card mb-4" id="${post.id}">
                      <div class="card-header">
                        <h2>${post.title}</h2>
                      </div>
                      <div class="card-body">
                          <p>${post.body}</p>
                      </div>
                      <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-outline-primary" onClick ="onEdit(this)">Edit</button>
                        <button class="btn btn-outline-danger" onClick ="onDelete(this)">Delete</button>
                      </div>  
                   </div>  `
    });
    postContainer.innerHTML = result;
}


const createCardPost = (postObj) => {
    let card = document.createElement("div");
    card.className = "card mb-4"
    card.id = postObj.id;
    card.innerHTML = ` <div class="card-header">
                          <h2>${postObj.title}</h2>
                        </div>
                        <div class="card-body">
                          <p>${postObj.body}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                          <button class="btn btn-outline-primary" onClick ="onEdit(this)">Edit</button>
                          <button class="btn btn-outline-danger" onClick ="onDelete(this)">Delete</button>
                        </div>
                       `
    postContainer.append(card)
}    

const onEdit = (eve) => {
    // cl(eve)
    let getId = eve.closest(".card").id;
    cl(getId)

    localStorage.setItem("getID", getId)

    let getUrl = `${postUrl}/${getId}`;

    let xhr = new XMLHttpRequest();

    xhr.open("GET", getUrl, true)

    xhr.send()

    xhr.onload = function(){
        if(xhr.status === 200){
             let getObj = JSON.parse(xhr.response)
        
             titleControl.value = getObj.title,
             bodyControl.value = getObj.body,
             userIdControl.value = getObj.userId
             
             updateBtn.classList.remove("d-none")
             submitBtn.classList.add("d-none")

             function scroll() {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                  timer:100
                });
              }
              scroll()
        }
    }
}

const onUpdatePost = () => {
    let updatedObj = {
        title : titleControl.value,
        body : bodyControl.value,
        userId : userIdControl.value
    }
    cl(updatedObj)
    

    let updateId = localStorage.getItem("getID")
    // cl(updateId)

    let updateUrl = `${postUrl}/${updateId}`

    let xhr = new XMLHttpRequest();

    xhr.open("PATCH", updateUrl, true)

    xhr.send(JSON.stringify(updateId))

    xhr.onload = function () {
        if(xhr.status === 200){
            cl(xhr.response)
            let getFindIndexObj = postArr.findIndex(post => {
                return post.id == updateId
            })
            cl(getFindIndexObj)

            postArr[getFindIndexObj].title = updatedObj.title,
            postArr[getFindIndexObj].body = updatedObj.body,
            postArr[getFindIndexObj].userId = updatedObj.userId

            templating(postArr)
            postForm.reset()

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500
                
              });

            updateBtn.classList.add("d-none")
            submitBtn.classList.remove("d-none")
            
        }else{
            cl(`something went wrong !!!`)
        }
    }
}

updateBtn.addEventListener("click", onUpdatePost)


const onDelete = (ele) => {
    // cl(ele)
    let deleteId = ele.closest(".card").id;

    let deleteUrl = `${postUrl}/${deleteId}`

    let xhr = new XMLHttpRequest()

    xhr.open("DELETE", deleteUrl)

    xhr.send()

    xhr.onload = function(){
        
        if(xhr.status === 200){
            // cl(xhr.response)
            Swal.fire({
              title: "Are you sure?",
              text: "You won't be able to revert this!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, delete it!"
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire({
                  title: "Deleted!",
                  text: "Your file has been deleted.",
                  icon: "success",
                  timer : 1500
                });
                document.getElementById(deleteId).remove();
              }
            });
        }
    }
}


const createPost = (postObj) => {
    let xhr = new XMLHttpRequest();

    xhr.open("POST",postUrl,true);

    xhr.send(JSON.stringify(postObj))

    xhr.onload = function(){
        if(xhr.status === 200 || xhr.status === 201){
            // cl(xhr.response)
            postObj.id = JSON.parse(xhr.response).id;
            postArr.push(postObj);
            // templating(postArr)
            createCardPost(postObj)
            
            Swal.fire({
                position: "center",
                icon: "success",
                title: "New post added successfully",
                timer: 1500
              });
        }
    }
}

const onSubmitBtn = (eve) => {
    eve.preventDefault()
    let submitObj = {
        title : titleControl.value,
        body : bodyControl.value,
        userId : userIdControl.value,
    }
    postForm.reset()

    createPost(submitObj)
}

postForm.addEventListener("submit", onSubmitBtn)
    

const getAllPost = () => {
     // 1} create a instannce/object
     let xhr = new XMLHttpRequest();
     // 2} configuration :
     xhr.open("GET", postUrl, true);
     // instance.mehtod("methodName", url, asyncronous behaviour)
     xhr.send();
     xhr.onload = function() {
         // cl(xhr.response)
         if(xhr.status === 200){
           postArr = JSON.parse(xhr.response)
        // cl(data)
           templating(postArr)
         // cl(xhr.status)  
         }else{
             alert(`Something went wrong !!!`)
         }
     }
     
}

getAllPost();
