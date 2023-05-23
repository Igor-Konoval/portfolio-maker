import { DataProvider } from './chanse.js'
// // alert(DataProvider, ContentEditor);
// class DataPostProvider extends DataProvider {
//   postData() {
//     return new Promise((resolve, reject) => {
//       this.xhr.open('POST', this.url);
//       this.xhr.onload = () => {
//         if (this.xhr.status === 200) {
//           alert(`Загружено: ${this.xhr.response}`);//response array imgs
//           let dataImgs = this.xhr.response;//maybe trouble
//           resolve(dataImgs);
//         } else {
//           reject('img error');
//         }
//       };
//       this.xhr.send(this.fileImgs);
//     })
//   }

//   // displayStaticImg(imgElem) {
//   //   imgElem.style.visibility = 'visible';
//   // }

//   // findImgElements() {
//   //   this.Imgs = document.querySelectorAll('img[src]');
//   // }
// }

// class loadImgFiles {
//   constructor(DataPostProvider) {
//     this.DataPostProvider = DataPostProvider;
//   }
// }

// class DataPostProvider extends DataProvider {
//   postData() {
//     return new Promise((resolve, reject) => {
//       this.xhr.open('POST', this.url);
//       this.xhr.onload = () => {
//         if (this.xhr.status === 200) {
//           alert(`Загружено: ${this.xhr.response}`);//response array imgs
//           let dataImgs = this.xhr.response;//maybe trouble
//           resolve(dataImgs);
//         } else {
//           reject('img error');
//         }
//       };
//       this.xhr.send(this.fileImgs);
//     })
//   }

//   displayStaticImg(imgElem) {
//     imgElem.style.visibility = 'visible';
//   }

//   findImgElements() {
//     this.Imgs = document.querySelectorAll('img[src]');
//   }
// }

class GetImages {
  constructor(dataProvider) {
    this.dataProvider = dataProvider;
  }

  initialize() {
    return new Promise((resolve, reject) => {
      this.dataProvider.getData()
        .then((data) => { 
          console.log(data, 'type of data', typeof data);
          for (let x=0; x<data.length; x++) {
            let pos = data[x].split('_')[1];

            this.findImages().forEach((item, index) => {
              if (index == pos) {
                item.setAttribute('src', `https://storage.googleapis.com/img_bucket_trial/${data[x]}`);
              }
              this.displayStaticImg(item);
            })
          }
          resolve();
        })
    });
  }

  displayStaticImg(imgElem) {
    imgElem.style.visibility = 'visible';
  }

  findImages() {
    return document.querySelectorAll('img[src]');
  }

}

// function displayStaticImg(imgElem) {
//   imgElem.style.visibility = 'visible';
// }

// function loadPosts() {
//     const loadImgs = document.querySelectorAll('img[src]');
//     try {
//       fetch(`/upload?usernameExport=${usernameExport}`)
//       .then((res) => res.json())
//       .then((x) => {
//         for (let y = 0; y < x.length; y++) {
//           let pos = x[y].split('_')[1];
  
//           loadImgs.forEach((item, index) => {
//             if (index == pos) {
//               item.setAttribute('src', `https://storage.googleapis.com/img_bucket_trial/${x[y]}`);
//             }
//             displayStaticImg(item);
//           })
//         }
//       });
//     } catch (error) {
//       console.log(error);
//     }   
//   }


document.addEventListener('DOMContentLoaded', function () {
  let dataProvider = new DataProvider(`/upload?usernameExport=${usernameExport}`);
  // let contentEditor = new ContentEditor(dataProvider);
  let getImages = new GetImages(dataProvider);

  // let promise1 = contentEditor.initialize();
  let promise2 = getImages.initialize();
  
  Promise.all([promise2])
  // Promise.all([promise1])
    .then(() => {
      let contentContainer = document.getElementById('contentContainer');
      // contentContainer.style.visibility = 'visible';
    })
    .catch((error) => {
      console.error(`Ошибка при инициализации: ${error}`);
    });
});

  // window.addEventListener('load', loadPosts);

