# Mengenal REST

Sebagian dari kalian mungkin mengenal REST dengan sebutan RESTful API. RESTful merupakan sebutan untuk web services yang menerapkan arsitektur RESTREST juga merupakan API (application program interface) karena ia digunakan untuk menjembatani antara sistem yang berbeda (client dan server). 
API atau Application Program Interface merupakan antarmuka yang menjadi perantara antara sistem aplikasi yang berbeda. API tak hanya dalam bentuk Web Service, bisa saja berupa SDK (Software Development Kit) ataupun lainnya.

Sifat REST API :
1. **Hubungan Client - Server**. Server harus bisa merespons permintaan yang dilakukan client, baik itu respons berhasil ataupun gagal.
2. **Stateless**. REST API tidak boleh menyimpan keadaan (state) apa pun terkait client. Seluruh state harus tetap disimpan di client. Artinya, tidak ada session di REST API. Permintaan yang dilakukan client harus mengandung informasi yang jelas. Jangan berharap RESTful API akan menyimpan informasi dari permintaan sebelumnya untuk digunakan di permintaan selanjutnya.
3. **Cacheable**.
4. **Layered**. Client tak perlu tahu bagaimana server melayaninya

Untuk dapat membangun REST dengan baik, kita harus paham tentang :
1. Format request dan response.
    Format yang populer saat ini adalah JSON (`application/json`). Selain JSON ada juga XML (`application/json`).
2. HTTP Verbs/Methods.
    Method yang paling sering digunakan GET (Read), PUT (Update), DELETE, POST (Create). 
3. HTTP Response code.
    Response Code yang sering diberikan :
    + 200 (OK) - Permintaan client berhasil dijalankan oleh server.
    + 201 (Created) - Server berhasil membuat/menambahkan resource yang diminta client.
    + 400 (Bad Request) - Permintaan client gagal dijalankan karena proses validasi input dari client gagal.
    + 401 (Unauthorized) - Permintaan client gagal dijalankan. Biasanya ini disebabkan karena pengguna belum melakukan proses autentikasi.
    + 403 (Forbidden) - Permintaan client gagal dijalankan karena ia tidak memiliki hak akses ke resource yang diminta.
    + 404 (Not Found) - Permintaan client gagal dijalankan karena resource yang diminta tidak ditemukan.
    + 500 (Internal Server Error) -  Permintaan client gagal dijalankan karena server mengalami eror (membangkitkan Exception).
4. URL Design.
    Aturannya :
    + Gunakan kata jamak saat memberikan endpoint. Misal : *students*, *classes* dll
    + Hindari penggunaan kata kerja. Misal : *addStudents*, *updateStudents* dll
    + Gunakan endpoint berarti untuk resource yang saling berhubungan. Misal : *students/:id/addresses*