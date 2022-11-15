# Memulai Project

## Package

1. nodemon => Tool yang wajib digunakan dalam pengembangan. Pasalnya, dengan tools ini kita tak perlu menjalankan ulang server ketika terjadi perubahan pada berkas JavaScript. Nodemon akan mendeteksi perubahan kode JavaScript dan mengeksekusi ulang secara otomatis. `yarn add nodemon --dev`
2. eslint => Tools yang kedua adalah ESLint, ia dapat membantu atau membimbing Anda untuk selalu menuliskan kode JavaScript dengan gaya yang konsisten. Seperti yang Anda tahu, JavaScript tidak memiliki aturan yang baku untuk gaya penulisan kode, bahkan penggunaan semicolon. Karena itu, terkadang kita jadi tidak konsisten dalam menuliskannya. `yarn add eslint --dev`
3. hapi => [Lihat disini](005%20-%20Hapi%20Framework.md). `yarn add @hapi/hapi`


## Step

1. Install nodemon
2. Buat file server.js (untuk handle server). 
3. Untuk proses awal isi server.js dengan kode dibawah.

  ```js
  console.log('Hallo kita akan membuat RESTful API');
  ```

4. Buka package.json buat npm runner untuk menjalankan script

  ```json
    "scripts": {
      "start": "nodemon ./src/server.js",
      "lint": "eslint ./src"
    }, 
  ```

5. Install eslint melalui node dan install plugin nya di vscode

# Project

## Menampilkan Catatan

```js
const routes = [
  {
    method: 'POST',
    path: '/notes',
    handler: addNoteHandler,
  },
  {
    method: 'GET',
    path: '/notes',
    handler: () => {},
  },
];
```