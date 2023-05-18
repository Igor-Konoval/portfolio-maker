function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

function replaceInpImg(curentInp, imgFileName) {
  const imgTarget = curentInp.parentElement.previousElementSibling;
  imgTarget.setAttribute('src', `https://storage.googleapis.com/img_bucket_trial/${imgFileName.name}`);
}

document.addEventListener("DOMContentLoaded", function () {

  document.querySelectorAll('input[name="imgfile"]').forEach((item, index) => {
    item.addEventListener("input", async (event) => {
      let postid = uuidv4();
      let inputElem = event.target;
      let file = inputElem.files[0];

      let blob = file.slice(0, file.size, "image/jpeg");
      let newFile = new File([blob], `${usernameExport}_${index}_${postid}_post.jpeg`, { type: "image/jpeg" });
      let formData = new FormData();
      formData.append("imgfile", newFile);

      try {
        const response = await fetch("/upload", {
          method: "POST",
          body: formData,
        });
        const result = await response.text();

        // Проверяем, что загрузка была успешной
        if (result === "Success") {
          // Устанавливаем картинку после успешной загрузки
          replaceInpImg(item, newFile);
        } else {
          console.error("Произошла ошибка при загрузке файла");
        }
      } catch (error) {
        console.error("Произошла ошибка при загрузке файла:", error);
      }
    });
  });
});

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