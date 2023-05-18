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
          })
        }
      });
    } catch (error) {
      console.log(error);
    }   
  }
  window.addEventListener('load', loadPosts);