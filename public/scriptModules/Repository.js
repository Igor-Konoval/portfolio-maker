



// cabinet

let relateValue = [];

const editBtn = document.querySelector('.edit-btn');
const saveBtn = document.querySelector('.save-btn');

function editValue(targ, index) {
    let area = document.createElement('textArea');
    area.className = "header_twosline_text_textArea";
    targ.replaceWith(area);
    area.value = relateValue[index];
    area.addEventListener('changeArea', () => {
        relateValue[index] = area.value;
        area.replaceWith(targ);
        targ.innerHTML = relateValue[index];
    })
}

let allElemEdit = document.querySelectorAll('[contenteditable]');
allElemEdit = Array.from(allElemEdit).filter(el => el.offsetParent !== null);

allElemEdit.forEach((el, index) => {
  let posL = el.pageXOffset + el.getBoundingClientRect().right + 10;
  let posT = el.pageYOffset + el.getBoundingClientRect().top + el.clientHeight / 2;
  el.setAttribute('indexEdit', index);
  let inp = document.createElement('input');
  document.body.append(inp);
  inp.type = 'number';
  inp.className = 'f_size'
  inp.style.display = 'none';
  inp.style.top = posT + 'px';
  inp.style.left = posL + 'px';
  
  inp.addEventListener('change', (event) => {
    el.style.fontSize = inp.value + 'px';
  });
});


editBtn.addEventListener('click', () => {
  const editableElements = document.querySelectorAll('[contenteditable]');
  const editInputs = document.querySelectorAll('.f_size');

  editableElements.forEach((el, index) => {
    el.setAttribute('contenteditable', 'true');

    el.onclick = function(event) {
      if (!event.target.contenteditable) return false;
      relateValue[index] = event.target.innerHTML;
      editValue(event.target, index);
    }

    el.classList.add('editing');
  });
  
  window.addEventListener('scroll', () => {
    editableElements.forEach((el, index) => {

      const posL = el.getBoundingClientRect().right + 10;
      const posT = el.getBoundingClientRect().top + el.clientHeight / 2 + window.pageYOffset;
      
      if (editInputs[index].style.display === 'none') {
        return;
      }
      
      editInputs[index].style.left = posL + 'px';
      editInputs[index].style.top = posT + 'px';  
      
    });
  });
  
  editableElements.forEach((el, index) => {
    const compSize = getComputedStyle(el);
    const posL = el.getBoundingClientRect().right + 10;
    const posT = el.getBoundingClientRect().top + el.clientHeight / 2 + window.pageYOffset;
    editInputs[index].style.left = posL + 'px';
    editInputs[index].style.top = posT + 'px';

    if (el.closest('[block0="true"], [block1="true"], [block2="true"], [block3="true"], [block4="true"], [block5="true"]')) {
      editInputs[index].style.display = 'none';
    } else {
      editInputs[index].style.display = 'block';
      editInputs[index].value = parseInt(compSize.fontSize);
    }
    
  });

  editBtn.setAttribute('disabled', true);
});

saveBtn.addEventListener('click', () => {
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    let editInputs = document.querySelectorAll('.f_size');
    editInputs.forEach(item => {
    item.style.display = 'none';
  })
    editableElements.forEach((el) => {
      el.setAttribute('contenteditable', 'false');
      el.classList.remove('editing');
      el.dispatchEvent(new Event('changeArea', {bubbles: true}));
    });
    editBtn.removeAttribute('disabled');
});


// client Function

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
    
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/upload");
        xhr.onload = function () {
          if (xhr.status === 200) {
            const result = xhr.responseText;
            if (result === "Success") {
              replaceInpImg(item, newFile);
            } else {
              console.error("Произошла ошибка при загрузке файла");
            }
          } else {
            console.error("Произошла ошибка при загрузке файла:", xhr.status);
          }
        };
        xhr.onerror = function () {
          console.error("Произошла ошибка при загрузке файла");
        };
        xhr.send(formData);
      });
    });
    });
  
//form function  

document.addEventListener("DOMContentLoaded", ()=> {
    let inp = document.getElementById('inp_submit_cabinet');
    const xhr = new XMLHttpRequest();

    inp.addEventListener('click', (event) => {
        event.preventDefault();
        let blocks = document.querySelectorAll('.check__content');
        
        let formCabinet = new FormData();
       
        
        const editableElements = document.querySelectorAll('[contenteditable]');

        for (let el = 0; el < editableElements.length; el++) {
            const compSize = getComputedStyle(editableElements[el]);
            formCabinet.append(`editEl${el}`, editableElements[el].textContent + '|$' + parseInt(compSize.fontSize));
        }

        let contError = document.querySelector('.container_info_error');
        
        blocks.forEach((item,index)=> {
          formCabinet.append(`block${index}`, item.parentElement.getAttribute(`block${index}`));
        })

        let editBtn = document.querySelector('.edit-btn');  
        if (editBtn.hasAttribute('disabled')) {
            contError.style.display = 'block';
            setTimeout(()=> contError.style.display = 'none', 1800);
        } else {
            contError.style.display = 'none';
            xhr.open('POST', 'http://localhost:3000/edit_cabinet');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.withCredentials = true;
            xhr.onload = function() {
                if (xhr.status === 200) {
                    contError.style.display = 'none';
                }
            };
            xhr.onerror = function() {
                console.log('Ошибка отправки запроса');
            };
            xhr.send(new URLSearchParams([...formCabinet.entries()]).toString());
        }
    })
});

//loadPostsFunction 

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

    // loginScript

    const usernameInput = document.querySelector('#regOne');
const loginSubmit = document.querySelector('#login_submit');
let form = document.querySelector('.login_form');

document.addEventListener('DOMContentLoaded', (event)=> {
    if (!localStorage.getItem('username')) return;
    usernameInput.value = localStorage.getItem('username');
})

form.onsubmit = function(event) {
    localStorage.removeItem('username');
    localStorage.setItem('username', usernameInput.value);
    event.preventDefault();
    form.submit();
}

//navigator

const navLinks = document.querySelectorAll('.upperNav > a');

for (let link of navLinks) {
  if (link.getAttribute('href').includes('http')) continue;
  link.addEventListener('click', e => {
    e.preventDefault();

    const href = link.getAttribute('href'); 

    const offsetTop = document.querySelector(href).offsetTop;

    window.scrollTo({
      top: offsetTop - 124,
      behavior: 'smooth'
    });
  });
}


//showHideButtons

document.addEventListener('DOMContentLoaded', ()=> {
    let allButShowHide = document.querySelectorAll('.check__content');
    let sizeElements = document.querySelectorAll('.f_size');
  
    function hideParent(parent, index) {
     parent.setAttribute(`block${index}`, true);
     parent.style.display = 'none';
    }
  
    function hideInput(ind) {
      return sizeElements[ind].style.display = 'none';
    }
  
    function showInput(ind) {
      return sizeElements[ind].style.display = 'block';
    }
  
  allButShowHide.forEach((el, index) => {
    
    el.addEventListener('click', (event) => {
      let target = event.target;    
      let parent = target.parentElement;
      
      parent.querySelectorAll('[contenteditable]').forEach(item => {
        let ind = item.getAttribute('indexEdit');
        
        hideInput(ind);
      })
  
      let elAttr = Boolean(target.getAttribute('show_block'));
      target.setAttribute('show_block', true);
      hideParent(parent, index);
    }); 
  });
  
  const resetBlocks = document.getElementById('return__blocks');
  
  resetBlocks.addEventListener('click', ()=> {
    document.querySelectorAll('.check__content').forEach((item, index) => {
      item.setAttribute('show_block', false);
      item.parentElement.setAttribute(`block${index}`, false);
      item.parentElement.style.display = 'block';
      item.parentElement.querySelectorAll('[contenteditable]').forEach(item =>{
        let ind = item.getAttribute('indexEdit');
        showInput(ind);
      })
    })
  })
  
  })
  

//upperNav

let buttonUp = document.querySelector('.buttonUp');
buttonUp.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 124) {
        buttonUp.parentElement.style.display = 'block';
    } else {
        buttonUp.parentElement.style.display = 'none';
    }
});
