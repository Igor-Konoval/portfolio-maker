import { DataProvider, ContentEditor } from './chanse.js'
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

class DataPostProvider extends DataProvider {
  postData() {
    return new Promise((resolve, reject) => {
      this.xhr.open('POST', this.url);
      this.xhr.onload = () => {
        if (this.xhr.status === 200) {
          alert(`Загружено: ${this.xhr.response}`);//response array imgs
          let dataImgs = this.xhr.response;//maybe trouble
          resolve(dataImgs);
        } else {
          reject('img error');
        }
      };
      this.xhr.send(this.fileImgs);
    })
  }

  displayStaticImg(imgElem) {
    imgElem.style.visibility = 'visible';
  }

  findImgElements() {
    this.Imgs = document.querySelectorAll('img[src]');
  }
}

function displayStaticImg(imgElem) {
  imgElem.style.visibility = 'visible';
}

function loadPosts() {
    const loadImgs = document.querySelectorAll('img[src]');
    try {
      fetch(`/upload?usernameExport=${usernameExport}`)
      .then((res) => res.json())
      .then((x) => {
        for (let y = 0; y < x.length; y++) {
          let pos = x[y].split('_')[1];
  
          loadImgs.forEach((item, index) => {
            if (index == pos) {
              item.setAttribute('src', `https://storage.googleapis.com/img_bucket_trial/${x[y]}`);
            }
            displayStaticImg(item);
          })
        }
      });
    } catch (error) {
      console.log(error);
    }   
  }
  window.addEventListener('load', loadPosts);

