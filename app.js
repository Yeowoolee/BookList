// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
      this.title = title;
      this.author = author;
      this.isbn = isbn;
    }
  }


// UI class
class UI{
    static displayBooks(){
        
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }
    static addBookToList(book){
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    }
    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('.book-form');
        container.insertBefore(div, form);
        //3초 후 사라지게하기
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFiled(){
        //리스트에 입력되었으니 input의 값들 지우기
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';

    }
}

// Store Class 저장소에 저장
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        } else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));

    }
    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}


// 책을 표시 이벤트
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// 책 추가 이벤트
const form = document.querySelector(".book-form");
form.addEventListener('submit', creatNewBook);

function creatNewBook(event){
    event.preventDefault();
    //값 얻어오기
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    
    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('책 정보를 입력해주세요!', 'danger');
    } else{
        // 책 클래스에 넣고 새 책 만들기
        const book = new Book(title, author, isbn);
        // 책 리스트에 추가하기
        UI.addBookToList(book);
        // 책 로컬 저장소에 저장하기
        Store.addBook(book);
        // 책 등록 성공 메시지
        UI.showAlert('책 등록에 성공했습니다!', 'success')

        // input에 입력된 값들 지우기
        UI.clearFiled();
    }
};

// 책 삭제 이벤트
document.querySelector('#book-list').addEventListener('click', delBook);

function delBook(event){
    //책 리스트에서 삭제
    UI.deleteBook(event.target);
    //책 로컬 저장소에서 삭제
    console.log(event.target.parentElement.previousElementSibling);
    Store.removeBook(event.target.parentElement.previousElementSibling.textContent);
    //삭제메시지
    UI.showAlert('책이 삭제되었습니다.!', 'warning')
}