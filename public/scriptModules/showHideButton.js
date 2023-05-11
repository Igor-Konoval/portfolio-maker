document.addEventListener('DOMContentLoaded', ()=> {
  let allButShowHide = document.querySelectorAll('.check__content');
  let sizeElements = document.querySelectorAll('.f_size');

  function hideParent(parent, index) {
   parent.setAttribute(`block${index}`, true);
   parent.style.display = 'none';
   console.log(parent.getAttribute(`block${index}`));
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
    
    parent.querySelectorAll('[contenteditable]').forEach(item => {//parent
      let ind = item.getAttribute('indexEdit');
      
      hideInput(ind);
    })

    let elAttr = Boolean(target.getAttribute('show_block'));
    // target.setAttribute('show_block', !elAttr);//true
    target.setAttribute('show_block', true);//true
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
