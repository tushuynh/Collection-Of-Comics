// Menu
const btnMenu = document.querySelector('#btnMenu');
const sidebar = document.querySelector('.sidebar');
const btnLogout = document.getElementById('log-out');
const btnAll = document.getElementById('btnAll');
const btnManhwa = document.getElementById('btnManhwa');
const btnManhua = document.getElementById('btnManhua');
const btnManga = document.getElementById('btnManga');
const btnOthers = document.getElementById('btnOthers');
const btnHot = document.getElementById('btnHot');
const btnEnd = document.getElementById('btnEnd');
const btnBlacklist = document.getElementById('btnBlacklist');
const btnDrop = document.getElementById('btnDrop');
const txtSearch = document.getElementById('searchTxt');

// Modal add
const btnAdd = document.getElementById('btnAdd');
const addModal = document.querySelector('.add-modal');
const addModalForm = document.querySelector('.add-modal .form');
const txtImg = document.getElementById('linkImgAddModal');
const img = document.getElementById('imgAddModal');

// Modal edit
const editModal = document.querySelector('.edit-modal');
const editForm = document.querySelector('.edit-modal .form');

// Modal delete
const deleteModal = document.querySelector('.delete-modal');
const deleteForm = document.querySelector('.delete-modal .form');

// Content
const cardContainer = document.querySelector('.card-container');
const cardChilren = cardContainer.children;
const arrCard = getArrCard();

function getArrCard() {
    let arrCard = [...cardChilren];

    arrCard.forEach((card) => {
        // Add event double click for button edit for comic card
        const btnEdit = card.querySelector('.btn-edit');
        btnEdit.addEventListener('dblclick', () => {
            editModal.classList.add('modal-show');

            editForm.name.value = card.querySelector('.card-title').innerHTML;
            editForm.chap.value = card.querySelector(
                '.chap .primary-text'
            ).innerHTML;
            editForm.image.value = card
                .querySelector('.btn-edit')
                .getAttribute('src');
            editForm.imgEditModal.src = card
                .querySelector('.btn-edit')
                .getAttribute('src');
            editForm.type.value = card.getAttribute('data-type');
            editForm.status.value = card.getAttribute('data-status');

            editForm.setAttribute(
                'action',
                `/comics/update/${card.getAttribute('data-id')}?_method=PUT`
            );
            editForm.setAttribute('method', 'POST');
        });

        // Add event click for button delete for comic card
        const btnDelete = card.querySelector('.btn-delete');
        btnDelete.addEventListener('click', () => {
            deleteForm.setAttribute(
                'action',
                `/comics/delete/${card.getAttribute('data-id')}?_method=DELETE`
            );
            deleteForm.setAttribute('method', 'POST');

            if (
                confirm('Are you sure you want to delete this comic?') == true
            ) {
                deleteForm.submit();
            }
        });
    });

    return arrCard;
}

btnMenu.onclick = function () {
    sidebar.classList.toggle('active');
};

btnLogout.onclick = function () {
    window.location = '/';
};

// Click add comic button
btnAdd.onclick = function () {
    addModal.classList.toggle('modal-show');

    addModalForm.name.value = '';
    addModalForm.chap.value = '';
    addModalForm.image.value = '';
    addModalForm.imgAddModal.src = '';
    if (img.getAttribute('src') == '') img.style.visibility = 'hidden';
};

// User click anywhere outside the modal
window.addEventListener('click', (e) => {
    if (e.target === addModal) {
        addModal.classList.remove('modal-show');
    }
    if (e.target == editModal) {
        // window.location = '/comics';
        editModal.classList.remove('modal-show');
    }
});

// Change text link img in add modal
txtImg.addEventListener('change', () => {
    if (txtImg.value != '') {
        img.style.visibility = 'visible';
        addModalForm.imgAddModal.src = txtImg.value;
    } else {
        img.style.visibility = 'hidden';
    }
});

// clear all card in content
function clearCardInContent() {
    while (cardContainer.firstChild) cardContainer.firstChild.remove();
}

// render comics to content
function renderComics(arrComics) {
    clearCardInContent();

    arrComics.forEach((card) => {
        cardContainer.appendChild(card);
    });
}

// Add event click for all buttons in menu sidebar
function addEventListenerForButton(arrButton) {
    arrButton.forEach((button) => {
        button.addEventListener('click', () => {
            const type = button.children[1].innerHTML;
            let arrComics;

            switch (type) {
                case 'Manhwa':
                case 'Manhua':
                case 'Manga':
                case 'Others':
                    arrComics = arrCard.filter((card) => {
                        return (
                            card.getAttribute('data-type') === type &&
                            (card.getAttribute('data-status') === 'Hot' ||
                                card.getAttribute('data-status') === 'None')
                        );
                    });
                    break;

                case 'Hot':
                case 'End':
                case 'Blacklist':
                case 'Drop':
                    arrComics = arrCard.filter((card) => {
                        return card.getAttribute('data-status') === type;
                    });
                    break;
                default:
                    arrComics = [...arrCard];
                    break;
            }

            renderComics(arrComics);
        });
    });
}
addEventListenerForButton([
    btnAll,
    btnManhwa,
    btnManhua,
    btnManga,
    btnOthers,
    btnHot,
    btnEnd,
    btnBlacklist,
    btnDrop,
]);

// Add event text search change
txtSearch.addEventListener('input', () => {
    clearCardInContent()

    let arrComics = arrCard.filter(card => {
        const name = card.querySelector('.card-title').innerHTML
        return removeAccents(name.toUpperCase()).includes(
            removeAccents(txtSearch.value.toUpperCase())
        );
    })

    renderComics(arrComics)
});

function removeAccents(str) {
    var AccentsMap = [
        'aàảãáạăằẳẵắặâầẩẫấậ',
        'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
        'dđ',
        'DĐ',
        'eèẻẽéẹêềểễếệ',
        'EÈẺẼÉẸÊỀỂỄẾỆ',
        'iìỉĩíị',
        'IÌỈĨÍỊ',
        'oòỏõóọôồổỗốộơờởỡớợ',
        'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
        'uùủũúụưừửữứự',
        'UÙỦŨÚỤƯỪỬỮỨỰ',
        'yỳỷỹýỵ',
        'YỲỶỸÝỴ',
    ];
    for (var i = 0; i < AccentsMap.length; i++) {
        var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
        var char = AccentsMap[i][0];
        str = str.replace(re, char);
    }
    return str;
}
