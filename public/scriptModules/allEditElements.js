document.addEventListener('DOMContentLoaded', ()=> {
  const username = window.location.pathname.split('/')[2];
  const url = `http://localhost:3000/cabinet/edit_elem_cabinet/${username ? username : ''}`;
  
  const xhr = new XMLHttpRequest();

  xhr.open('GET', `http://localhost:3000/edit_elem_cabinet/${username}`);
  xhr.onload = function () {
   
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      let dataBlocks = data.dataTwo;
      
      let dataElements = data.dataOne.map(item => {
          return item.split('|$')[0];
      });
  
      let dataFSize = data.dataOne.map(item => {
          return item.split('|$')[1];
      })
      if (dataElements.length || dataFSize.length) {
        let blocks = document.querySelectorAll('.check__content');
      
        blocks.forEach((el, index)=> {
          el.parentElement.setAttribute(`block${index}`, dataBlocks[index]);
          el.setAttribute('show_block', dataBlocks[index]);

          if (el.parentElement.getAttribute(`block${index}`) === 'true') {
              el.parentElement.style.display = 'none';
          } else {
              el.parentElement.style.display = 'block';
          }
      })
  
      let editableElements = document.querySelectorAll('[contenteditable]');
      editableElements.forEach((el, index)=> {
          el.textContent = dataElements[index];
          el.style.fontSize = dataFSize[index] + 'px';
      })}
      
    } else {
      console.error('Ошибка получения данных: ' + xhr.status);
    }
  };
  xhr.send();
})


