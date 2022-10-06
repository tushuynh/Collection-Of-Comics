// Menu
const btnMenu = document.querySelector('#btnMenu');
const sidebar = document.querySelector('.sidebar');
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
let curCard = [...arrCard]

// Filter
const filter = document.querySelector('.filter');
filter.addEventListener('change', () => {
    let filterCard
    switch(filter.selectedIndex) {
        case 0:
            filterCard = curCard.sort((currentCard, nextCard) => {
                const current = currentCard.querySelector('.last-read .primary-text').innerHTML
                const next = nextCard.querySelector('.last-read .primary-text').innerHTML
                const dateCurrentCard = new Date(current.split('/').reverse().join('-'))
                const dateNextCard = new Date(next.split('/').reverse().join('-'))

                return dateCurrentCard - dateNextCard
            })
            renderComics(filterCard)
            break;

        case 1:
            filterCard = curCard.sort((currentCard, nextCard) => {
                const current = currentCard.querySelector('.last-read .primary-text').innerHTML
                const next = nextCard.querySelector('.last-read .primary-text').innerHTML
                const dateCurrentCard = new Date(current.split('/').reverse().join('-'))
                const dateNextCard = new Date(next.split('/').reverse().join('-'))

                return dateNextCard - dateCurrentCard
            })
            renderComics(filterCard)
            break;

        case 2:
            filterCard = curCard.sort((currentCard, nextCard) => {
                const currentCardChap = {
                    chapRead: currentCard.querySelector('.chapRead .primary-text').innerHTML,
                    chapPresent: currentCard.querySelector('.chapPresent .primary-text').innerHTML
                }
                const nextCardChap = {
                    chapRead: nextCard.querySelector('.chapRead .primary-text').innerHTML,
                    chapPresent: nextCard.querySelector('.chapPresent .primary-text').innerHTML
                }

                const unReadChapCurrentCard = currentCardChap.chapPresent - currentCardChap.chapRead
                const unReadChapNextCard = nextCardChap.chapPresent - nextCardChap.chapRead 
                return unReadChapCurrentCard - unReadChapNextCard
            })
            renderComics(filterCard)
            break;

        case 3:
            filterCard = curCard.sort((currentCard, nextCard) => {
                const currentCardChap = {
                    chapRead: currentCard.querySelector('.chapRead .primary-text').innerHTML,
                    chapPresent: currentCard.querySelector('.chapPresent .primary-text').innerHTML
                }
                const nextCardChap = {
                    chapRead: nextCard.querySelector('.chapRead .primary-text').innerHTML,
                    chapPresent: nextCard.querySelector('.chapPresent .primary-text').innerHTML
                }

                const unReadChapCurrentCard = currentCardChap.chapPresent - currentCardChap.chapRead
                const unReadChapNextCard = nextCardChap.chapPresent - nextCardChap.chapRead 
                return unReadChapNextCard - unReadChapCurrentCard
            })
            renderComics(filterCard)
            break;

        default:
            break;
    }
})

function getArrCard() {
    let arrCard = [...cardChilren];

    arrCard.forEach((card) => {
        // Add event double click for button edit for comic card
        const btnEdit = card.querySelector('.btn-edit');
        btnEdit.addEventListener('dblclick', () => {
            editModal.classList.add('modal-show');

            editForm.name.value = card.querySelector('.card-title').innerHTML;
            editForm.chap.value = card.querySelector(
                '.chapRead .primary-text'
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

        // Add event click comic's name redirect to page comic
        const comicName = card.querySelector('.card-title')
        comicName.addEventListener('click', () => {
            const paramUrl = removeAccents(comicName.innerHTML.toUpperCase()).split(' ').join('-')
            window.location.href = 'http://www.nettruyenme.com/truyen-tranh/' + paramUrl
        })

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
            filter.selectedIndex = 0
            switch (type) {
                case 'Manhwa':
                case 'Manhua':
                case 'Manga':
                case 'Others':
                    curCard = arrCard.filter((card) => {
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
                    curCard = arrCard.filter((card) => {
                        return card.getAttribute('data-status') === type;
                    });
                    break;
                default:
                    curCard = [...arrCard];
                    break;
            }

            renderComics(curCard);
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