//menggunakan nanoid untuk id acak otomatis

const { nanoid } = require('nanoid');
//const notes = require('./books');
const books = require('./books');

//Handler untuk add new book
const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const addBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
      };

      if (!name) {
        const response = h.response({
          'status": "fail',
          'message": "Gagal menambahkan buku. Mohon isi nama buku',
        });

        response.code(400);
        return response;
      }

      if (readPage > pageCount) {
        const response = h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });

        response.code(400);
        return response;
      }

      books.push(addBook);

      //console.info(notes)

      const isSuccess = books.filter((book) => book.id === id).length > 0;

      if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        });

        response.code(201);
        return response;
      }

      // const response = h.response({
      //   status: 'error',
      //   message: 'Buku gagal ditambahkan',
      // });

      // response.code(500);
      // return response;
  };

//Handler untuk get all books
  const getAllBookHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    if (name) {
      const getNameBook = books.filter((book) => {
        const bookNameQuery = new RegExp(name, 'i');
        return bookNameQuery.test(book.name);
      });
      const response = h.response({
        status: 'success',
        data: {
          books:getNameBook.map ((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });

      response.code(200);
      return response;
    }
    
    if (reading) {
      const getReadingBook = books.filter((book) => Number(book.reading) === Number(reading));
      const response = h.response({
        status: 'success',
        data: {
          books: getReadingBook.map((book) => ({
            i: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
      response.code(200);
      return response;
    }

    if (finished) {
      const getFinishedBook = book.filter((book) => Number(book.finished) === Number(finished));
      const response = h.response({
        status: 'success',
        data: {
          books: getFinishedBook.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  };


//dapatkan buku dengan ID
  const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = book.filter((n) => n.id === bookId)[0];

    if (book) {
      const response = h.response({
        status: 'success',
        data: {
          book,
        },
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  };

//edit buku  dengan ID
const editBookDataByIdHandler = (response, h) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading, 
  } = request.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal Memperbarui Buku, Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = book.findIndex((book) => book.id === bookId);
  const updatedAt = new Date().toISOString();

  if (index !== -1) {
    books[index] = {
      ...books[index], name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt,
    };
    
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

//dellete
const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = book.findIndex((book) => book.id === bookId);

    if (index !== -1) {
      books.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
  addBookHandler, getAllBookHandler, getBookByIdHandler, editBookDataByIdHandler, deleteBookByIdHandler,
};