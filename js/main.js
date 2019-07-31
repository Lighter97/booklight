window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./serviceWorker.js');
  }
}

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  static addBookToList(book) {
    const bookList = document.getElementById('book-list');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete" style="text-decoration: none">❌</a></td>`;
    bookList.appendChild(newRow);
  }

  static deleteBook(target) {
    if (target.className === 'delete') {
      const row = target.parentElement.parentElement;
      row.remove();
    }
  }

  static clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }

  static showMessage(text, type) {
    const block = document.createElement('div');
    block.className = `button alert ${type} u-full-width`;
    block.appendChild(document.createTextNode(text));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(block, form);
    setTimeout(function () {
      block.remove();
    }, 3000);
  }
}

class Store {
  static getBooks() {
    if (localStorage.getItem('books') === null) {
      return [];
    }
    return JSON.parse(localStorage.getItem('books'));
  }

  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function(book) {
      UI.addBookToList(book);
    });
  }
  static addBook(newBook) {
    const books = Store.getBooks();
    books.push(newBook);
    localStorage.setItem('books', JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach(function(book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

document.addEventListener('DOMContentLoaded', function() {
  Store.displayBooks();
})

document.getElementById('book-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const isbn = document.getElementById('isbn').value;

  const book = new Book(title, author, isbn);

  if (title === '' || author === '' || isbn === '') {
    UI.showMessage('Please, fill in all fields', 'error')
    return;
  }
  UI.addBookToList(book);
  Store.addBook(book);
  UI.showMessage('Book successfully added', 'success');
  UI.clearFields();
});

document.getElementById('book-list').addEventListener('click', function(e) {
  e.preventDefault();

  UI.deleteBook(e.target);
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  UI.showMessage('Book successfully deleted', 'success');
})
