// Menu
const btnMenu = document.querySelector("#btn");
const sidebar = document.querySelector(".sidebar");
const btnLogout = document.getElementById("log-out");

// Modal add
const btnAdd = document.getElementById("btnAdd");
const addModal = document.querySelector(".add-modal");
const addModalForm = document.querySelector('.add-modal .form');
const txtImg = document.getElementById('linkImgAddModal');
const img = document.getElementById('imgAddModal');

// Modal edit
const editModal = document.querySelector(".edit-modal");

// Modal delete
const deleteModal = document.querySelector(".delete-modal")
const btnCloseDeleteModal = document.getElementById("btnCloseDeleteModal")

btnMenu.onclick = function() {
    sidebar.classList.toggle("active");
}

btnLogout.onclick = function() {
    window.location = '/'
}

// Click add comic button
btnAdd.onclick = function() {
    addModal.classList.toggle("modal-show");
    
    addModalForm.name.value = '';
    addModalForm.chap.value = '';
    addModalForm.image.value = '';
    addModalForm.imgAddModal.src = '';
    if (img.getAttribute('src') == "")
        img.style.visibility = 'hidden';
}

// User click anywhere outside the modal
window.addEventListener("click", e => {
    if (e.target === addModal) {
        addModal.classList.remove("modal-show");
    }
    if (e.target == editModal) {
        history.back();
    }
    if (e.target == deleteModal) {
        history.back();
    }
})

// button close in delete modal on click
btnCloseDeleteModal.onclick = () => {
    history.back();
}

// Change text link img in add modal
txtImg.addEventListener('change', () => {
    if (txtImg.value != "") {
        img.style.visibility = 'visible';
        addModalForm.imgAddModal.src = txtImg.value;
    }
    else {
        img.style.visibility = 'hidden';
    }
});