const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSAPP';
const THEME_KEY = 'SELECTED_THEME';
const ICON_KEY = 'SELECTED_ICON';

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, completed) {
  return {
    id,
    title,
    author,
    year: Number(year),
    completed,
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData(message) {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
  if (message) {
    alert(message);
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const { id, title, author, year, completed } = bookObject;

  const textTitle = document.createElement('h2');
  textTitle.classList.add('book-title');
  textTitle.innerText = title;

  const textAuthor = document.createElement('p');
  textAuthor.classList.add('book-desc');
  textAuthor.innerText = author;

  const textYear = document.createElement('p');
  textYear.classList.add('book-desc');
  textYear.innerText = year;

  const boxItem = document.createElement('div');
  boxItem.classList.add('box-item');
  boxItem.append(textTitle, textAuthor, textYear);

  boxItem.setAttribute('id', `book-${id}`);

  const btnGroup = document.createElement('div');
  btnGroup.classList.add('btn-group');

  if (completed) {
    const completedBtn = document.createElement('button');
    completedBtn.classList.add('btn-action');
    completedBtn.textContent = 'Belum dibaca';
    completedBtn.addEventListener('click', function () {
      removeBookCompleted(id);
    });

    const deleteCompletedBtn = document.createElement('button');
    deleteCompletedBtn.classList.add('btn-action', 'delete');
    deleteCompletedBtn.textContent = 'Hapus';
    deleteCompletedBtn.addEventListener('click', function () {
      deleteBook(id);
    });

    btnGroup.append(completedBtn, deleteCompletedBtn);
    boxItem.append(btnGroup);
  } else {
    const unCompletedBtn = document.createElement('button');
    unCompletedBtn.classList.add('btn-action');
    unCompletedBtn.textContent = 'Sudah dibaca';

    unCompletedBtn.addEventListener('click', function () {
      removeBookUnCompleted(id);
    });

    const deleteUncompletedBtn = document.createElement('button');
    deleteUncompletedBtn.classList.add('btn-action', 'delete');
    deleteUncompletedBtn.textContent = 'Hapus';

    deleteUncompletedBtn.addEventListener('click', function () {
      deleteBook(id);
    });

    btnGroup.append(unCompletedBtn, deleteUncompletedBtn);
    boxItem.append(btnGroup);
  }

  return boxItem;
}

function addBook(message) {
  const bookTitle = document.getElementById('title').value;
  const bookAuthor = document.getElementById('author').value;
  const bookYear = document.getElementById('year').value;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    bookTitle,
    bookAuthor,
    bookYear,
    false
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData(message);
}

function removeBookUnCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.completed = true;
  const message = 'Data dipindahkan';

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData(message);
}

function removeBookCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.completed = false;
  const message = 'Data dipindahkan';

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData(message);
}

function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);
  const message = 'Data dihapus';

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData(message);
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const message = 'Data buku berhasil di simpan';
    addBook(message);

    const inputs = form.querySelectorAll('input');

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].value = '';
    }
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data buku berhasil di simpan');
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById('uncompleted');
  const listBookCompleted = document.getElementById('completed');

  uncompletedBookList.innerHTML = '';
  listBookCompleted.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    bookItem.completed
      ? listBookCompleted.append(bookElement)
      : uncompletedBookList.append(bookElement);
  }
});

const toggleTheme = document.getElementById('toggleTheme');
const darkTheme = 'dark';
const iconTheme = 'ri-sun-line';

const selectedTheme = localStorage.getItem(THEME_KEY);
const selectedIconn = localStorage.getItem(ICON_KEY);

const currentTheme = () =>
  document.body.classList.contains(darkTheme) ? 'dark' : 'light';
const currentIcon = () =>
  document.body.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line';

if (selectedTheme) {
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](
    darkTheme
  );
  toggleTheme.classList[selectedTheme === 'ri-moon-line' ? 'add' : 'remove'](
    iconTheme
  );
}

toggleTheme.addEventListener('click', () => {
  document.body.classList.toggle(darkTheme);
  toggleTheme.classList.toggle(iconTheme);

  localStorage.setItem(THEME_KEY, currentTheme());
  localStorage.setItem(ICON_KEY, currentIcon());
});
