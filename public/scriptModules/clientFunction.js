// // const jwt = require('jsonwebtoken');
// const uuidv4 = require('../../GStorage/uuidv4.js');
// // const controller = require('../../Controllers/mainController.js');
// let username = usernameExport; 

// document.querySelectorAll('[name="imgfile"]').forEach((item, index)=>{
//     item.addEventListener("input", (event) => {
//     let postid = uuidv4();
//     // let inputElem = document.getElementById("imgfile"); //this.target //this.input
//     let inputElem = event.target;
//     let file = inputElem.files[0];
    
//     let blob = file.slice(0, file.size, "image/jpeg");
//     newFile = new File([blob], `${username}_${index}_${postid}_post.jpeg`, { type: "image/jpeg" });
    
//     let formData = new FormData();
//     formData.append("imgfile", newFile);
//     fetch("/upload", {
//       method: "POST",
//       body: formData,
//     })
//       .then((res) => res.text());
//     //   .then(loadPosts());
//   });
// })

// function loadPosts() {
//     fetch("/upload")
//         .then((res) => res.json())
//         .then((x) => {
//             for (y = 0; y < x[0].length; y++) {
//                 console.log(x[0][y]);
//                 const newimg = document.createElement("img");
//                 newimg.setAttribute(
//                 "src",
//                 "https://storage.googleapis.com/img_bucket_trial/" + x[0][y].id);
//                 newimg.setAttribute("width", 50);
//                 newimg.setAttribute("height", 50);
//                 document.getElementById("images").appendChild(newimg);
//             }
//         });
// }

// const uuidv4 = require('../../GStorage/uuidv4.js');
// import uuidv4 from "../../GStorage/uuidv4";
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

// function createImg(imgFile) {
//   let imgUpload = document.createElement('img');
//   imgUpload.setAttribute('src', imgFile.name);
// }

function replaceInpImg(curentInp, imgFileName) {
  const imgTarget = curentInp.parentElement.previousElementSibling;
  console.log(imgTarget);
  console.log(`https://storage.googleapis.com/img_bucket_trial/${imgFileName.name}`);
  imgTarget.setAttribute('src', `https://storage.googleapis.com/img_bucket_trial/${imgFileName.name}`)
}

document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('input[name="imgfile"]').forEach((item, index) => {
    item.addEventListener("input", (event) => {
      let postid = uuidv4();
      let inputElem = event.target;
      let file = inputElem.files[0];

      let blob = file.slice(0, file.size, "image/jpeg");
      let newFile = new File([blob], `${usernameExport}_${index}_${postid}_post.jpeg`, { type: "image/jpeg" });
      replaceInpImg(item, newFile);

      let formData = new FormData();
      formData.append("imgfile", newFile);
      fetch("/upload", {
        method: "POST",
        body: formData,
      })
      .then((res) => res.text());
      //   .then(loadPosts());
    });
  });
});

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
