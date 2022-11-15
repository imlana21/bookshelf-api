# Instalasi

# Routing

Routing pada Hapi tidak dilakukan di dalam request handler seperti cara native. Namun, ia memanfaatkan objek route configuration yang disimpan pada method server.route(). 

Contoh :

```js
const init = async () => {
 
    const server = Hapi.server({
        port: 5000,
        host: 'localhost'
    });
 
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Hello World!';
        }
    });
 
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};
```

Objek route configuration memiliki properti yang bisa dimanfaatkan untuk menspesifikasikan route yang diinginkan. Termasuk menspesifikasikan method, path, dan fungsi sebagai handler untuk menangani permintaan tersebut (request handler).

Tunggu, request handler dituliskan di dalam route configuration? Yap benar! Handler pada Hapi dipisahkan berdasarkan route yang ada. Setiap spesifikasi route memiliki handler-nya masing-masing. Dengan begitu, tentu kode akan lebih mudah dikelola. Anda bisa mengatakan selamat tinggal pada if else yang bersarang.

Lalu, bagaimana cara menetapkan lebih dari satu route configuration dalam method server.route()? Mudah! Sebenarnya, server.route() selain dapat menerima route configuration, ia juga dapat menerima array dari route configuration. Jadi, Anda bisa secara mudah menentukan banyak spesifikasi dalam 1 fungsi.

Kami merekomendasi untuk memisahkan seluruh routes configuration pada berkas JavaScript berbeda. Dengan begitu, satu berkas JavaScript hanya memiliki satu fungsi atau tanggung jawab saja (single responsibility principle).

```js
// route.js
const routes = [
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Homepage';
        },
    },
    {
        method: 'GET',
        path: '/about',
        handler: (request, h) => {
            return 'About page';
        },
    },
];
 
module.exports = routes;
```

```js
const Hapi = require('@hapi/hapi');
const routes = require('./routes');
 
const init = async () => {
    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
    });
 
    server.route(routes);
 
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};
 
init();
```

## Path Parameter

Mari kita berbicara mengenai teknik routing lebih lanjut. Path dalam routing bisa dikatakan sebagai alamat yang digunakan client untuk melakukan permintaan ke server. Alamat atau path yang dibuat biasanya merupakan teks verbal yang dapat dimengerti oleh client. Tak jarang hanya dengan membaca path dari sebuah tautan kita langsung mengerti apa yang client minta kepada server.

Sebagai contoh, ketika membaca tautan GitHub ini https://github.com/dicodingacademy, Anda pasti mengerti bahwa client ingin meminta server untuk menampilkan profil github dari username “dicodingacademy”. 

Contoh lain, dari alamat https://twitter.com/maudyayunda, coba Anda tebak kira-kira apa yang diminta client ke server? Jika Anda berpikir client meminta profil twitter kak Maudy Ayunda, yups, Anda tepat sekali!

Twitter dan Github menggunakan pendekatan yang sama dalam menampilkan halaman profil. Mereka memanfaatkan username sebagai bagian dari path untuk melakukan permintaan ke server. Terbayang tidak sih bagaimana mereka melakukannya? Di saat mereka memiliki pengguna yang banyak, apakah mereka menetapkan route secara satu per satu berdasarkan username untuk setiap penggunanya? Tentu tidak!

Untuk melakukan hal tersebut, Twitter dan Github menggunakan teknik path parameter. Di Hapi Framework teknik tersebut sangat mudah untuk diterapkan. Cukup dengan membungkus path dengan tanda { }. Sebagai contoh:

```js
server.route({
    method: 'GET',
    path: '/users/{username}',
    handler: (request, h) => {
        const { username } = request.params;
        return `Hello, ${username}!`;
    },
});
```

Seperti yang Anda lihat di atas, pada properti path terdapat bagian path yang ditulis {username}. Itu berarti, server memberikan bagian teks tersebut untuk client manfaatkan sebagai parameter. 

Nantinya parameter ini akan disimpan sebagai properti pada request.params yang dimiliki handler dengan nama sesuai yang Anda tetapkan (username). Sebagai contoh, bila Anda melakukan permintaan ke server dengan alamat ‘/users/harry’, maka server akan menanggapi dengan ‘Hello, harry!’.

Pada contoh kode di atas, nilai path parameter wajib diisi oleh client. Bila client mengabaikannya dengan melakukan permintaan pada alamat ‘/users’, maka server akan mengalami eror.

Tapi tenang, pada Hapi Anda dapat membuat path parameter bersifat opsional. Caranya dengan menambahkan tanda “?” di akhir nama parameternya. Berikut contoh yang sama namun dengan implementasi opsional path parameter:

```js
server.route({
    method: 'GET',
    path: '/users/{username?}',
    handler: (request, h) => {
        const { username = 'stranger' } = request.params;    
        return `Hello, ${username}!`;
    },
 });
```

Sekarang bila client meminta pada alamat ‘/users/dicoding’, server menanggapi dengan ‘Hello, dicoding!’; dan bila client meminta hanya pada path ‘/users’, server akan menanggapinya dengan ‘Hello, stranger!’.

Anda bisa menetapkan lebih dari satu path parameter. Namun, penting untuk Anda ketahui bahwa optional path parameter hanya dapat digunakan di akhir bagian path saja. Artinya, jika Anda menetapkan optional path di tengah-tengah path parameter lain contohnya /{one?}/{two}, maka path ini dianggap tidak valid oleh Hapi.

## Query Parameter

Selain path parameter, terdapat cara lain yang sering digunakan dalam mengirimkan data melalui URL, yakni dengan query parameter. Teknik ini umum digunakan pada permintaan yang membutuhkan kueri dari client, contohnya seperti pencarian dan filter data. 

Data yang dikirim melalui query memiliki format key=value. Contohnya: `localhost:5000?name=harry&location=bali`

```js
server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        const { name, location } = request.query;
        return `Hello, ${name} from ${location}`;
    },
 });
```

## Body/Payload

Ketika menggunakan Node.js, untuk mendapatkan data pada body request *meskipun datanya hanya sebatas teks* kita harus berurusan dengan Readable Stream. Di mana untuk mendapatkan data melalui stream tak semudah seperti kita menginisialisasikan sebuah nilai pada variabel. 

Good News! Ketika menggunakan Hapi, Anda tidak lagi berurusan dengan stream untuk mendapatkan datanya. Di balik layar, Hapi secara default akan mengubah payload JSON menjadi objek JavaScript. Dengan begitu, Anda tak lagi berurusan dengan JSON.parse()!

Kapan pun client mengirimkan payload berupa JSON, payload tersebut dapat diakses pada route handler melalui properti request.payload. Contohnya seperti ini:

```js
server.route({
    method: 'POST',
    path: '/login',
    handler: (request, h) => {
        const { username, password } = request.payload;
        return `Welcome ${username}!`;
    },
});
```

## Response Function

Fungsi handler pada Hapi memiliki dua parameters, yakni request dan h.

Sebagaimana yang sudah banyak kita bahas sebelumnya, request parameter merupakan objek yang menampung detail dari permintaan client, seperti path dan query parameters, payload, headers, dan sebagainya. [Lihat lebih lanjut](https://hapi.dev/api/?v=20.1.0#request-properties). 

Parameter yang kedua yaitu h (huruf inisial Hapi). Parameter ini merupakan response toolkit di mana ia adalah objek yang menampung banyak sekali method yang digunakan untuk menanggapi sebuah permintaan client. Objek ini serupa dengan objek response pada request handler ketika kita menggunakan Node.js native.

Seperti yang sudah Anda lihat pada contoh dan latihan sebelumnya, jika hanya ingin mengembalikan nilai pada sebuah permintaan yang datang, di Hapi Anda bisa secara langsung mengembalikan nilai dalam bentuk teks, teks HTML, JSON, steam, atau bahkan promise. 

```js
server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        return `Homepage`;
    },
});
```

Jika kita dapat mengembalikan permintaan secara singkat, lalu apa fungsi dari h? Kapan kita membutuhkannya? 

Bila kasusnya sederhana seperti di atas, memang lebih baik Anda langsung kembalikan dengan nilai secara eksplisit. Namun, ketahuilah bahwa dengan cara tersebut status response selalu bernilai 200 OK. Ketika Anda butuh mengubah nilai status response, di situlah Anda membutuhkan parameter h.

```js
// Detailed notation
const handler = (request, h) => {
    const response = h.response('success');
    response.type('text/plain');
    response.header('X-Custom', 'some-value');
    return response;
};
 
// Chained notation
const handler = (request, h) => {
    return h.response('success')
        .type('text/plain')
        .header('X-Custom', 'some-value');
};


server.route({
    method: 'POST',
    path: '/user',
    handler
});
```

