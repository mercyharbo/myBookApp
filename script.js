// Book class
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');

        row.innerHTML = `
            <td> ${book.title} </td>
            <td> ${book.author} </td>
            <td> ${book.isbn} </td>
            <td> <img src="./delete.svg" alt="" class="delete-btn"> </td>
        `;

        list.appendChild(row);
    }

    //Delete book
    static deleteBook(el) {
        if(el.classList.contains(`delete-btn`)) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlertMessage(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Timeout
        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }

    // Clear Fields 
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

}

// LocalStorage 
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event to display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event to add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    
    e.preventDefault();

    //Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate 
    if (title === '' || author === "" || isbn === '') {
        UI.showAlertMessage('Please fill in all fields', 'danger');
    } else {
        //instatiate the books 
        const book = new Book(title, author, isbn);

        //add book to UI
        UI.addBookToList(book);

        //add book to localstorage
        Store.addBook(book);

        //Show success message 
        UI.showAlertMessage('Book Added Successfully', 'success');

        //clear fields 
        UI.clearFields();
    }
});


// Event to remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target);

    //Remove book from 
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlertMessage('Book Removed Successfully', 'success');
})