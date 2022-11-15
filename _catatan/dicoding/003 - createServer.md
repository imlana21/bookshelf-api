# Membuat Aplikasi Node

```js
// #region Request Handling
const http = require('http');

// Buat fungsi dengan parameter request dan response
const requestListener = (req, res) => {
  response.setHeader('Content-Type', 'text/html');

  response.statusCode = 200;
  response.end('<h1>Halo HTTP Server!</h1>');
}

// Masukan fungsi tadi kedalam http.createServer
const server = http.createServer(requestListener);
```

Konsep dasarnya seperti diatas. Ketika kita ingin membuat aplikasi server dengan node js kita perlu module `http` untuk mengangani setiap requestnya. Kode di atas merupakan contoh logika yang bisa dituliskan di dalam request listener. Request listener akan menanggapi setiap permintaan dengan dokumen HTML, kode status 200, dan menampilkan konten “Halo HTTP Server!”.

Lalu, bagaimana caranya agar server selalu sedia menangani permintaan yang masuk? Setiap instance dari http.server juga memiliki method listen(). Method inilah yang membuat http.server selalu standby untuk menangani permintaan yang masuk dari client. Setiap kali ada permintaan yang masuk, request listener akan tereksekusi.

Method listen() dapat menerima 4 parameter, berikut detailnya:
1. port (number) : jalur yang digunakan untuk mengakses HTTP server.
2. hostname (string) : nama domain yang digunakan oleh HTTP server.
3. backlog (number) : maksimal koneksi yang dapat ditunda (pending) pada HTTP server.
4. listeningListener (function) : callback yang akan terpanggil ketika HTTP server sedang bekerja (listening).

Contoh : 

```js
// //#region Node App Handling
const port = 5000;
const host = 'localhost';
 
server.listen(port, host, () => {
    console.log(`Server berjalan pada http://${host}:${port}`);
});
```

## Verb/Method

Setiap request dari user biasanya membawa method. Method yang paling sering digunakan, yaitu : `POST` (Create), `GET` (Read), `PUT` (Update), `DELETE` (Delete). Method tersebut digunakan oleh server untuk menangani request dari client. Terus bagaimana cara mengetahui method yang dikirimkan oleh client, sehingga server bisa memberikan response yang sesuai?

Fungsi request listener menyediakan dua parameter yakni request dan response. Fokus ke parameter request, parameter ini merupakan instance dari http.ClientRequest yang memiliki banyak properti di dalamnya. 

Melalui properti-propertinya ini kita dapat mengetahui seperti apa karakteristik dari permintaan HTTP yang dilakukan oleh client. Seperti method yang digunakan, path atau alamat yang dituju, data yang dikirimkan (bila ada), dan informasi lain mengenai permintaan tersebut.

```js
const requestListener = (request, response) => {
    const { method } = request;
 
    if(method === 'GET') {
        // response ketika GET
    }
 
    if(method === 'POST') {
        // response ketika POST
    }
 
    // Anda bisa mengevaluasi tipe method lainnya
};
```

## Body Request

Ketika client melakukan permintaan dengan method POST atau PUT, biasanya permintaan tersebut memiliki sebuah data yang disimpan pada body request. Data pada body bisa berupa format teks, JSON, berkas gambar, atau format lainnya. Data tersebut nantinya digunakan oleh server untuk diproses di database atau disimpan dalam bentuk objek utuh.

Ketahuilah bahwa http.clientRequest merupakan turunan dari readable stream, yang di mana untuk mendapatkan data body akan sedikit sulit dibandingkan dengan mendapatkan data header. Data di body didapatkan dengan teknik stream, seperti yang sudah kita ketahui, teknik ini memanfaatkan EventEmitter untuk mengirimkan bagian-bagian datanya. Dalam kasus http.clientRequest event data dan end-lah yang digunakan untuk mendapatkan data body.

```js
const requestListener = (request, response) => {
    let body = [];
 
    request.on('data', (chunk) => {
        body.push(chunk);
    });
 
    request.on('end', () => {
        body = Buffer.concat(body).toString();
    });
};
```

Penjelasan Kode :
1. Pertama, kita deklarasikan variabel body dan inisialisasikan nilainya dengan array kosong. Ini berfungsi untuk menampung buffer pada stream. 
2. Lalu, ketika event data terjadi pada request, kita isi array body dengan chunk (potongan data) yang dibawa callback function pada event tersebut.
3. Terakhir, ketika proses stream berakhir, maka event end akan terbangkitkan. Di sinilah kita mengubah variabel body yang sebelumnya menampung buffer menjadi data sebenarnya dalam bentuk string melalui perintah Buffer.concat(body).toString().

## Routing Request

Kita bisa memanfaatkan http.clientRequest, untuk melakukan routing request dari user.

Contoh :

```js
const requestListener = (request, response) => {
    const { url, method } = request;
 
    if(url === '/') {
 
        if(method === 'GET') {
            // curl -X GET http://localhost:5000/
        }
 
        // curl -X <any> http://localhost:5000/
    }
 
    if(url === '/about') {
 
        if(method === 'GET') {
            // curl -X GET http://localhost:5000/about
        }
 
        if(method === 'POST') {
            // curl -X POST http://localhost:5000/about
        }
 
        // curl -X <any> http://localhost:5000/about
    }
 
    // curl -X <any> http://localhost:5000/<any>
};
```

## Response Header

Pada web server yang sudah kita buat, ia memberikan respons dengan format dokumen HTML. Dokumen ini digunakan oleh browser dalam menampilkan website. Anda bisa melihat ini ketika mengakses web server melalui browser. 

Sebenarnya, server bisa merespons dengan memberikan data dalam tipe (MIME types) lain, seperti XML, JSON, gambar, atau sekadar teks biasa. Apa pun MIME types yang digunakan, web server wajib memberi tahu pada client. 

Caranya, lampirkan property ‘Content-Type’ dengan nilai MIME types yang disisipkan pada header response. Untuk menyisipkan nilai pada header response, gunakanlah method setHeader(). [Detail](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types)

Anda bisa menetapkan data pada header sebanyak yang diinginkan. Method setHeader() menerima dua parameter, yakni nama properti dan nilai untuk headernya.

Jika Anda menetapkan header dengan properti yang tidak standar (lihat apa saja standard properti pada header) atau Anda buat nama propertinya secara mandiri, maka sangat disarankan untuk menambahkan huruf X di awal nama propertinya. 

Ketahuilah juga bahwa penulisan properti header dituliskan secara Proper Case atau setiap kata diawali dengan huruf kapital dan setiap katanya dipisahkan oleh tanda garis (-).


## Response Body

Header respons menampung informasi terkait respons yang diberikan oleh server. Informasi dapat berupa status respons, MIME types, tanggal, atau informasi lainnya yang mungkin dibutuhkan oleh client. 

Walaupun kita bisa memberikan informasi apa pun, namun tidak semua informasi cocok disimpan di header. Informasi pada header hanya sebagai metadata atau informasi yang menjelaskan tentang sebuah data lain (data utama).

Selain header, HTTP respons juga membawa body (Anda mengetahui ini pada materi pola komunikasi client dan server). Di dalam body inilah data utama (atau bisa kita sebut konten) seharusnya disimpan.

Ketahuilah bahwa objek response yang berada pada parameter fungsi request listener adalah instance dari http.serverResponse. Di mana ia merupakan WritableStream. Masih ingat cara menulis data pada WritableStream? Nah, cara itulah yang digunakan untuk menuliskan data pada body response.

Seperti objek WritableStream lainnya, untuk menuliskan data pada respons kita bisa gunakan method response.write() dan diakhiri dengan method response.end().





## Latihan 

```js
// Request Handling
const http = require('http');
 
const requestListener = (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('X-Powered-By', 'NodeJS');
 
    const { method, url } = request;
 
    if(url === '/') {
        if(method === 'GET') {
            response.statusCode = 200;
            response.end(JSON.stringify({
                message: 'Ini adalah homepage',
            }));
        } else {
            response.statusCode = 400;
            response.end(JSON.stringify({
                message: `Halaman tidak dapat diakses dengan ${method} request`,
            }));
        }
    } else if(url === '/about') {
        if(method === 'GET') {
            response.statusCode = 200;
            response.end(JSON.stringify({
                message: 'Halo! Ini adalah halaman about',
            }));
        } else if(method === 'POST') {
            let body = [];
    
            request.on('data', (chunk) => {
                body.push(chunk);
            });
 
            request.on('end', () => {
                body = Buffer.concat(body).toString();
                const { name } = JSON.parse(body);
                response.statusCode = 200;
                response.end(JSON.stringify({
                    message: `Halo, ${name}! Ini adalah halaman about`,
                }));
            });
        } else {
            response.statusCode = 400;
            response.end(JSON.stringify({
                message: `Halaman tidak dapat diakses menggunakan ${method}, request`
            }));
        }
    } else {
        response.statusCode = 404;
        response.end(JSON.stringify({
            message: 'Halaman tidak ditemukan!',
        }));
    }
};
 
// Node App Handling
const server = http.createServer(requestListener);
 
const port = 5000;
const host = 'localhost';
 
server.listen(port, host, () => {
    console.log(`Server berjalan pada http://${host}:${port}`);
}
```
