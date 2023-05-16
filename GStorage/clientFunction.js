const uuidv4 = require('./uuidv4.js');
const username = window.location.pathname.split('/')[2];

document.querySelectorAll('[name="imgfile"]').forEach((item, index)=>{
    item.addEventListener("click", (event) => {
    let postid = uuidv4();
    // let inputElem = document.getElementById("imgfile"); //this.target //this.input
    let inputElem = event.target;
    let file = inputElem.files[0];
    
    let blob = file.slice(0, file.size, "image/jpeg");
    newFile = new File([blob], `${username}_${index}_${postid}_post.jpeg`, { type: "image/jpeg" });
    
    let formData = new FormData();
    formData.append("imgfile", newFile);
    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.text());
    //   .then(loadPosts());
  });
})

function loadPosts() {
    fetch("/upload")
        .then((res) => res.json())
        .then((x) => {
            for (y = 0; y < x[0].length; y++) {
                console.log(x[0][y]);
                const newimg = document.createElement("img");
                newimg.setAttribute(
                "src",
                "https://storage.googleapis.com/img_bucket_trial/" + x[0][y].id);
                newimg.setAttribute("width", 50);
                newimg.setAttribute("height", 50);
                document.getElementById("images").appendChild(newimg);
            }
        });
}