const { nanoid } = require('nanoid');
const books = require('./data');

function getReadingBook(reading) {
  const data = [];

  if (reading === '1') {
    books.map((d) => {
      if (d.reading) {
        data.push(d);
      }
    });
  } else if (reading === '0') {
    books.map((d) => {
      if (!d.reading) {
        data.push(d);
      }
    });
  }

  return data;
}

function getFinishedBook(finished) {
  const data = [];

  if (finished === '1') {
    books.map((d) => {
      if ((d.pageCount - d.readPage) < 1) {
        data.push(d);
      }
    });
  } else if (finished === '0') {
    books.map((d) => {
      if ((d.pageCount - d.readPage) > 0) {
        data.push(d);
      }
    });
  }

  return data;
}

function searchBook(text) {
  const data = [];

  books.map((d) => {
    if (d.name.includes(text)) {
      data.push(d);
    }
  });

  return data;
}

function getBooks(req, h) {
  if (Object.keys(req.query).length > 0) {
    const { reading, finished, name } = req.query;

    if (reading !== undefined) {
      const response = h.response({
        status: 'success',
        data: getReadingBook(reading),
      });
      response.code(200);

      return response;
    }

    if (finished !== undefined) {
      const response = h.response({
        status: 'success',
        data: getFinishedBook(finished),
      });
      response.code(200);

      return response;
    }

    if (name !== undefined) {
      const response = h.response({
        status: 'success',
        data: searchBook(name),
      });
      response.code(200);

      return response;
    }
  }

  const bookList = [];

  books.map((d) => {
    const { id, name, publisher } = d;

    bookList.push({
      id,
      name,
      publisher,
    });
  });

  const response = h.response({
    status: 'success',
    data: {
      books: bookList,
    },
  });
  response.code(200);

  return response;
}

function getBooksById(req, h) {
  const book = books.filter((n) => n.id === req.params.id);

  if (book.length < 1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',

    });
    response.code(404);

    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      book: book[0],
    },
  });

  response.code(200);

  return response;
}

function addBooks(req, h) {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  if (name === undefined || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
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

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = (pageCount - readPage) < 1;

  const bookArray = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(bookArray);

  const isSuccess = books.filter((n) => n.id === id).length > 0;

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

  const response = h.response({
    status: 'fail',
  });
  response.code(500);
  return response;
}

function deleteBooks(req, h) {
  const { id } = req.params;

  const index = books.findIndex((book) => book.id === id);

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
}

function updateBooks(req, h) {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  if (name === undefined || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
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

  const { id } = req.params;
  const updatedAt = new Date().toISOString();
  const finished = (pageCount - readPage) < 1;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
}

module.exports = {
  getBooks,
  addBooks,
  deleteBooks,
  updateBooks,
  getBooksById,
};
