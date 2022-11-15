Server dapat menampung sebuah website, aplikasi, gambar, video, dan masih banyak lagi. Ketika server menampung website, mungkin beberapa data gambar, video, stylesheet biasanya diambil dari alamat server lain atau origin yang berbeda. Contohnya stylesheet yang diambil dari Bootstrap CDN ataupun gambar yang diperoleh dari server Unsplash. Hal ini wajar dan biasa dilakukan.

Namun apakah Anda tahu bahwa tidak semua data bisa diambil dari origin yang berbeda? Contohnya data JSON yang didapatkan melalui teknik XMLHTTPRequest atau fetch. Jika website meminta sesuatu menggunakan teknik tersebut dari luar origin-nya, maka permintaan tersebut akan ditolak. Itu disebabkan oleh kebijakan same-origin. Kasus ini terjadi pada aplikasi client dan web server yang kita buat.

Origin terdiri dari tiga hal: protokol, host, dan port number. Origin dari aplikasi client kita adalah

[http://notesapp-v1.dicodingacademy.com](http://notesapp-v1.dicodingacademy.com)

protokol => http
host => notesapp-v1.dicodingacademy.com
port => 80 (default)

Selama aplikasi client mengakses data dari origin yang sama, hal itu dapat dilakukan. Namun bila ada salah satu saja yang berbeda contohnya port 8001, maka permintaan itu akan ditolak.

Dengan begitu jelas yah, apa penyebab gagalnya aplikasi client ketika melakukan permintaan ke web server yang kita buat. Sudah jelas keduanya memiliki origin yang berbeda. Origin web server kita saat ini adalah http://localhost:5000/

Lalu, apa solusi agar keduanya dapat berinteraksi? Tenang, untungnya ada mekanisme yang dapat membuat mereka saling berinteraksi. Mekanisme tersebut disebut Cross-origin resource sharing (CORS). Pertanyaannya, bagaimana cara menerapkannya?

Cukup mudah! Pada web server, kita hanya perlu memberikan nilai header ‘Access-Control-Allow-Origin’ dengan nilai origin luar yang akan mengkonsumsi datanya (aplikasi client). Contoh :

```js
const response = h.response({ error: false, message: 'Catatan berhasil ditambahkan' });
 
response.header('Access-Control-Allow-Origin', 'http://notesapp-v1.dicodingacademy.com');
 
return response;
```

Good news! Penerapannya akan jauh lebih mudah bila Anda menggunakan Hapi. Dengan Hapi, CORS dapat ditetapkan pada spesifik route dengan menambahkan properti options.cors di konfigurasi route. Contohnya seperti ini:

```js
// server.js
{
  method: 'POST',
  path: '/notes',
  handler: addNoteHandler,
  options: {
    cors: {
      origin: ['*'],
    },
  },
},
```