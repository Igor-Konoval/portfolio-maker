document.addEventListener("DOMContentLoaded", ()=> {
    let inp = document.getElementById('inp_submit_cabinet');
    const xhr = new XMLHttpRequest();

    inp.addEventListener('click', (event) => {
        event.preventDefault();
        let blocks = document.querySelectorAll('.check__content'); //buttons
        
        let formCabinet = new FormData();
       
        const editableElements = document.querySelectorAll('[contenteditable]');

        for (let el = 0; el < editableElements.length; el++) {
            const compSize = getComputedStyle(editableElements[el]);
            formCabinet.append(`editEl${el}`, editableElements[el].textContent + '|$' + parseInt(compSize.fontSize));
        }

        let contError = document.querySelector('.container_info_error');
        
        blocks.forEach((item,index)=> {
            console.log(`21 form_cabinet.js` ,item.parentElement.getAttribute(`block${index}`));
          formCabinet.append(`block${index}`, item.parentElement.getAttribute(`block${index}`));//
        })

        let editBtn = document.querySelector('.edit-btn');  
        if (editBtn.hasAttribute('disabled')) {
            contError.style.display = 'block';
            setTimeout(()=> contError.style.display = 'none', 1800);
        } else {
            contError.style.display = 'none';
            
            xhr.open('POST', `${window.location.origin}/edit_cabinet`);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            
            xhr.withCredentials = true;
            xhr.onload = function() {
                if (xhr.status === 200) {
                    contError.style.display = 'none';
                    window.location.href = `${window.location.origin}/cabinet/${usernameExport}`;
                }
            };
            xhr.onerror = function() {
                console.log('Ошибка отправки запроса');
            };
            xhr.send(new URLSearchParams([...formCabinet.entries()]).toString());
            let aHref = document.createElement('a');
            aHref.setAttribute('href', `${window.location.origin}/cabinet/${usernameExport}`);
            document.body.append(aHref);
            let ev = new Event('click');
            aHref.dispatchEvent(ev);
            
        }
        
    })

});
