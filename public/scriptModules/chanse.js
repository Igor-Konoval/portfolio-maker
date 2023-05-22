// class HttpClient {
//     constructor() {
//       this.xhr = new XMLHttpRequest();
//     }
  
//     get(url) {
//       this.xhr.open('GET', url);
//     }
  
//     post(url) {
//       this.xhr.open('POST', url);
//     }
  
//     send(formData) {
//       this.xhr.send(formData);
//     }
//   }
  
//   class ImageUploader {
//     constructor(username) {
//       this.username = username;
//       this.httpClient = new HttpClient();
//     }
  
//     uploadImage(file, index) {
//       return new Promise((resolve, reject) => {
//         const postid = this.generateUUID();
//         const blob = file.slice(0, file.size, 'image/jpeg');
//         const newFile = new File([blob], `${this.username}_${index}_${postid}_post.jpeg`, { type: 'image/jpeg' });
//         const formData = new FormData();
//         formData.append('imgfile', newFile);
  
//         this.httpClient.open('POST', '/upload');
//         this.httpClient.onload = () => {
//           if (this.httpClient.xhr.status === 200) {
//             const result = this.httpClient.xhr.responseText;
//             if (result === 'Success') {
//               resolve();
//             } else {
//               reject('Произошла ошибка при загрузке файла');
//             }
//           } else {
//             reject(`Произошла ошибка при загрузке файла: ${this.httpClient.xhr.status}`);
//           }
//         };
//         this.httpClient.onerror = () => {
//           reject('Произошла ошибка при загрузке файла');
//         };
//         this.httpClient.send(formData);
//       });
//     }
  
//     generateUUID() {
//       return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
//         (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))) .toString(16)
//       );
//     }
//   }
  
//   class ContentEditor {
//     constructor(username) {
//       this.username = username;
//       this.imageUploader = new ImageUploader(username);
//       this.httpClient = new HttpClient();
//     }
  
//     initialize() {
//       document.addEventListener('DOMContentLoaded', () => {
//         this.sendAjaxRequest();
//       });
//     }
  
//     sendAjaxRequest() {
//       this.httpClient.get(`http://localhost:3000/edit_elem_cabinet/${this.username}`);
//       this.httpClient.onload = () => {
//         if (this.httpClient.xhr.status === 200) {
//           const data = JSON.parse(this.httpClient.xhr.responseText);
//           const dataBlocks = data.dataTwo;
//           const dataElements = data.dataOne.map(item => item.split('|$')[0]);
//           const dataFSize = data.dataOne.map(item => item.split('|$')[1]);
//           if (dataElements.length || dataFSize.length) {
//             this.updateBlocks(dataBlocks);
//             this.updateEditableElements(dataElements, dataFSize);
//           }
//         } else {
//           console.error('Ошибка получения данных: ' + this.httpClient.xhr.status);
//         }
//       };
//       this.httpClient.send();
//     }
  
//     updateBlocks(dataBlocks) {
//       const blocks = document.querySelectorAll('.check__content');
//       blocks.forEach((el, index) => {
//         el.parentElement.setAttribute(`block${index}`, dataBlocks[index]);
//         el.setAttribute('show_block', dataBlocks[index]);
//         if (el.parentElement.getAttribute(`block${index}`) === 'true') {
//           el.parentElement.style.display = 'none';
//         } else {
//           el.parentElement.style.display = 'block';
//         }
//       });
//     }
  
//     updateEditableElements(dataElements, dataFSize) {
//       const editableElements = document.querySelectorAll('[contenteditable]');
//       editableElements.forEach((el, index) => {
//         el.textContent = dataElements[index];
//         el.style.fontSize = dataFSize[index] + 'px';
//       });
//     }
//   }
  
//   const username = window.location.pathname.split('/')[2];
//   const url = `http://localhost:3000/cabinet/edit_elem_cabinet/${username ? username : ''}`;
  
//   const contentEditor = new ContentEditor(username);
//   contentEditor.initialize();
  
class DataProvider {
  constructor(url) {
    this.url = url;
    this.xhr = new XMLHttpRequest();
  }

  getData() {
    return new Promise((resolve, reject) => {
      this.xhr.open('GET', this.url);
      this.xhr.onload = () => {
        if (this.xhr.status === 200) {
          const data = JSON.parse(this.xhr.response);
          resolve(data);
        } else {
          reject(`Ошибка получения данных: ${this.xhr.status}`);
        }
      };
      this.xhr.send();
    });
  }
}

class ContentEditor {
  constructor(dataProvider) {
    this.dataProvider = dataProvider;
  }

  initialize() {
    return new Promise((resolve, reject) => {
      this.dataProvider.getData()
        .then((data) => {
          let dataBlocks = data.dataTwo;
          let dataElements = data.dataOne.map(item => item.split('|$')[0]);
          let dataFSize = data.dataOne.map(item => item.split('|$')[1]);
          if (dataElements.length || dataFSize.length) {
            this.updateBlocks(dataBlocks);
            this.updateEditableElements(dataElements, dataFSize);
          }
          resolve(); // Резолвим промис при успешной инициализации
        })
        .catch((error) => {
          reject(`Ошибка получения данных: ${error}`); // Реджектим промис в случае ошибки
        });
    });
  }

  updateBlocks(dataBlocks) {
    let blocks = document.querySelectorAll('.check__content');
    blocks.forEach((el, index) => {
      el.parentElement.setAttribute(`block${index}`, dataBlocks[index]);
      el.setAttribute('show_block', dataBlocks[index]);
      if (el.parentElement.getAttribute(`block${index}`) === 'true') {
        el.parentElement.style.display = 'none';
      } else {
        el.parentElement.style.display = 'block';
      }
    });
  }

  updateEditableElements(dataElements, dataFSize) {
    let editableElements = document.querySelectorAll('[contenteditable]');
    editableElements.forEach((el, index) => {
      el.textContent = dataElements[index];
      el.style.fontSize = dataFSize[index] + 'px';
    });
  }
}


class ImageUploader {
  constructor(username) {
    this.username = username;
    this.handleImageUpload = this.handleImageUpload.bind(this);
  }

  generateUuid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

  replaceImage(currentInput, imgFileName) {
    const imgTarget = currentInput.parentElement.previousElementSibling;
    imgTarget.setAttribute('src', `https://storage.googleapis.com/img_bucket_trial/${imgFileName.name}`);
  }

  handleImageUpload(inputElement, index) {
    return new Promise((resolve, reject) => {
      let postid = this.generateUuid();
      let file = inputElement.files[0];
      console.log(file, ' file finded');
      let blob = file.slice(0, file.size, 'image/jpeg');
      let newFile = new File([blob], `${this.username}_${index}_${postid}_post.jpeg`, { type: 'image/jpeg' });
      let formData = new FormData();
      console.log(newFile);
      console.log(this.username);
      formData.append('imgfile', newFile);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/upload');
      xhr.onload = function () {
        if (xhr.status === 200) {
          const result = xhr.responseText;
          if (result === 'Success') {
            resolve(newFile);
          } else {
            reject('Произошла ошибка при загрузке файла');
          }
        } else {
          reject(`Произошла ошибка при загрузке файла: ${xhr.status}`);
        }
      };
      xhr.onerror = function () {
        reject('Произошла ошибка при загрузке файла');
      };
      xhr.send(formData);
    });
  }

  initialize() {
    document.querySelectorAll('input[name="imgfile"]').forEach((item, index) => {
      item.addEventListener('input', async (event) => {
        try {
          const inputElem = event.target;
          const newFile = await this.handleImageUpload(inputElem, index);
          this.replaceImage(item, newFile);
        } catch (error) {
          console.error(error);
        }
      });
    });
  }
}

// document.addEventListener('DOMContentLoaded', function () {
//   const username = window.location.pathname.split('/')[2];
//   // const url = `http://localhost:3000/edit_elem_cabinet/${username ? username : ''}`;
//   const url = `http://localhost:3000/edit_elem_cabinet/${username}`;
//   let dataProvider = new DataProvider(url);
//   let contentEditor = new ContentEditor(dataProvider);
//   // contentEditor.initialize();

//   let imageUploader = new ImageUploader(username);
//   // imageUploader.initialize();
//   let arr = [contentEditor.initialize(),  imageUploader.initialize()]
//   Promise.all(arr).then(() => container.style.display = 'block');
// });

// function uuidv4() {
//   return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
//     (
//       c ^
//       (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
//     ).toString(16)
//   );
// }

// function replaceInpImg(curentInp, imgFileName) {
//   const imgTarget = curentInp.parentElement.previousElementSibling;
//   imgTarget.setAttribute('src', `https://storage.googleapis.com/img_bucket_trial/${imgFileName.name}`);
// }

// document.addEventListener("DOMContentLoaded", function () {

// document.querySelectorAll('input[name="imgfile"]').forEach((item, index) => {
//   item.addEventListener("input", async (event) => {
//     let postid = uuidv4();
//     let inputElem = event.target;
//     let file = inputElem.files[0];

//     let blob = file.slice(0, file.size, "image/jpeg");
//     let newFile = new File([blob], `${usernameExport}_${index}_${postid}_post.jpeg`, { type: "image/jpeg" });
//     let formData = new FormData();
//     formData.append("imgfile", newFile);

//     const xhr = new XMLHttpRequest();
//     xhr.open("POST", "/upload");
//     xhr.onload = function () {
//       if (xhr.status === 200) {
//         const result = xhr.responseText;
//         if (result === "Success") {
//           replaceInpImg(item, newFile);
//         } else {
//           console.error("Произошла ошибка при загрузке файла");
//         }
//       } else {
//         console.error("Произошла ошибка при загрузке файла:", xhr.status);
//       }
//     };
//     xhr.onerror = function () {
//       console.error("Произошла ошибка при загрузке файла");
//     };
//     xhr.send(formData);
//   });
// });
// });


document.addEventListener('DOMContentLoaded', function () {
  const username = window.location.pathname.split('/')[2];
  console.log(username, ' eventListener back');
  const url = `http://localhost:3000/edit_elem_cabinet/${username}`;
  let dataProvider = new DataProvider(url);
  let contentEditor = new ContentEditor(dataProvider);
  let imageUploader = new ImageUploader(usernameExport);

  let promise1 = contentEditor.initialize();
  let promise2 = imageUploader.initialize();
  
  Promise.all([promise1, promise2])
  // Promise.all([promise1])
    .then(() => {
      let contentContainer = document.getElementById('contentContainer');
      contentContainer.style.visibility = 'visible';
    })
    .catch((error) => {
      console.error(`Ошибка при инициализации: ${error}`);
    });
});

export {DataProvider, ContentEditor}; 