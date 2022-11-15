const {
  getBooks,
  addBooks,
  deleteBooks,
  updateBooks,
  getBooksById,
} = require('./pages/bookshelf/handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBooks,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBooksById,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getBooks,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBooks,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: updateBooks,
  },
  // {
  //   method: 'PUT',
  //   path: '/books/toggle_status',
  //   handler: toggleArchivedBooks,
  // },
];

module.exports = routes;
