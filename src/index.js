// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading.

// ELEMENTS //

const quoteList = document.getElementById('quote-list');
const quoteForm = document.getElementById('new-quote-form');
const sortBtn = document.getElementById('sort-btn');


// API //

const quoteUrl = "http://localhost:3000/quotes";


// SERVER FUNCTIONS //

const getData = url => fetch(url).then(resp => resp.json());
const deleteData = url => fetch(url, {method: "DELETE"}).then(resp => resp.json());

const sendData = (url, data, meth="POST") => {
    return fetch(url, {
        method: meth,
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(data)
    })
    .then(resp => resp.json());
};


// DISPLAY FUNCTIONS //

const displayQuote = quote => {
    const liEl = document.createElement('li');
    liEl.classList.add('quote-card');
    liEl.innerHTML = `
        <blockquote class="blockquote" data-q-id="${quote.id}">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
            <button type="button" class='btn-warning' data-toggle='modal' data-target="#editModal">Edit</button>
            <button class='btn-danger'>Delete</button>
        </blockquote>
    `;
    quoteList.append(liEl);
};

const displayQuotes = quotes => {
    quotes.forEach(displayQuote);
};


// EVENT LISTENERS //

quoteForm.addEventListener('submit', e => {
    e.preventDefault();
    const quote = document.getElementById('new-quote').value;
    const author = document.getElementById('author').value;
    quoteObj = {quote: quote, author: author, likes: 0};
    sendData(quoteUrl, quoteObj);
});

quoteList.addEventListener('click', e => {
    if (!e.target.classList.contains('btn-success')) return;
    e.preventDefault();
    let likeSpan = e.target.querySelector('span');
    let likes = parseInt(likeSpan.innerText);
    const id = parseInt(e.target.parentElement.dataset.qId);
    sendData(quoteUrl+`/${id}`, {likes: `${++likes}`}, 'PATCH')
        .then( resp => {
            if (resp.error) return;
            likeSpan.innerText = likes;
        });
});

quoteList.addEventListener('click', e => {
    if (!e.target.classList.contains('btn-danger')) return;
    e.preventDefault();
    const parent = e.target.closest('li');
    const id = parseInt(e.target.parentElement.dataset.qId);
    deleteData(quoteUrl+`/${id}`)
        .then( resp => {
            if (resp.error) return;
            parent.remove();
        });
});

quoteList.addEventListener('click', e => {
    if (!e.target.classList.contains('btn-warning')) return;
    
    const id = parseInt(e.target.parentElement.dataset.qId);
});

sortBtn.addEventListener('click', e => {
    quoteList.innerText = "";
    getData(quoteUrl).then(resp => displayQuotes(resp.sort(compare)));
});


// HELPER //

const compare = (a, b) => {
    // Use toUpperCase() to ignore character casing
    const authorA = a.author.toUpperCase();
    const authorB = b.author.toUpperCase();
  
    let comparison = 0;
    authorA > authorB ? comparison = 1 : comparison = -1;
    return comparison;
};


// PAGE LOAD //
window.addEventListener('DOMContentLoaded', () => {
    getData(quoteUrl).then(displayQuotes);
});