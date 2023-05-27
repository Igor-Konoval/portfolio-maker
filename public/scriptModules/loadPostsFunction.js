import { DataProvider } from './chanse.js'
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


