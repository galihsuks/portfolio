<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Galih Sukmamukti</title>
        <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
            crossorigin="anonymous"
        />
        <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
        />
        <style>
            @import url("https://fonts.googleapis.com/css2?family=Comforter&display=swap");
            @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@100;300;400;500;700;900&display=swap");
            @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Comforter&display=swap");

            * {
                font-family: "Outfit", sans-serif;
                --merah: #db4444;
            }
            html {
                scroll-behavior: smooth;
            }
            body {
                background-color: whitesmoke;
                height: 100vh;
            }
            /* @media (orientation: portrait) {
                body {
                    -moz-transform: rotate(90deg);
                    -webkit-transform: rotate(90deg);
                    -o-transform: rotate(90deg);
                    -ms-transform: rotate(90deg);
                    transform: rotate(90deg);
                    height: 100vw;
                }
            } */
            #scrollable::-webkit-scrollbar {
                display: none;
            }
            #scrollable {
                width: 100vw;
                overflow-x: scroll;
                overflow-y: hidden;
                scroll-snap-type: x mandatory;
                display: flex;
                height: 100%;
            }
            #scrollable > div {
                min-width: 100vw;
                scroll-snap-align: center;
                display: grid;
                grid-template-areas: "stack";
            }
            #scrollable > div.akhir {
                min-width: 50vw;
                scroll-snap-align: end;
            }
            #scrollable > div > * {
                grid-area: stack;
            }
            /* @media (orientation: portrait) {
                #scrollable {
                    width: 100svh;
                    height: 100vw;
                }
                #scrollable > div {
                    min-width: 100svh;
                    height: 100vw;
                }
            } */

            .navbar {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100px;
                z-index: 99;
                padding: 2em;
                display: flex;
                justify-content: space-between;
                align-items: center;
                /* border: 1px solid brown; */
            }
            .navbar .logo {
                font-family: "Comforter", cursive;
                font-size: 3vw;
                margin: 0;
            }
            .navbar > div {
                gap: 2em;
            }
            .navbar .item-nav {
                display: block;
                border: none;
                outline: none;
                background: none;
                /* background-color: #db4444; */
            }
            .navbar .item-nav:hover {
                border-bottom: 1px solid black;
            }
            /* @media (orientation: portrait) {
                .navbar {
                    width: 100svh;
                    height: 80px;
                }
            } */
            @media (max-height: 400px) {
                .navbar {
                    height: 60px;
                    /* background-color: aqua; */
                    padding: 1em;
                }
                .navbar .item-nav {
                    scale: 0.8;
                }
                .navbar > div {
                    gap: 0;
                }
            }

            .container-logo {
                display: grid;
                /* width: 50vw; */
                height: 100%;
                grid-template-columns: repeat(4, 1fr);
                gap: 1em;
                /* background-color: aqua; */
                position: relative;
                transform: translateX(200px);
            }
            @media (max-width: 1160px) {
                .container-logo {
                    transform: translateX(130px);
                    gap: 2em;
                }
            }
            .container-logo .item-logo {
                aspect-ratio: 1 / 1;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 1em;
                /* background-color: red; */
                /* transform: scale(1); */
                border: 1px solid rgba(0, 0, 0, 0);
                transition: 0.2s;
            }
            .container-logo .item-logo img {
                width: 3vw;
                aspect-ratio: 1 / 1;
                object-fit: contain;
                transition: 0.2s;
                scale: 1;
                filter: saturate(0);
                /* background-color: red; */
            }
            .container-logo .item-logo > div {
                overflow: hidden;
                max-width: 0;
                transition: 0.2s;
                position: absolute;
                transform: translateY(5vw);
                background-color: white;
                z-index: 2;
            }
            .container-logo .item-logo:hover > div {
                transition: 1s;
                max-width: 300px;
            }
            .container-logo .item-logo .nama {
                margin-top: 0.3em;
                margin-inline: 1em;
                margin-bottom: 0;
                font-weight: bold;

                /* background-color: aqua; */
            }
            .container-logo .item-logo .tahun {
                margin-top: 0;
                margin-inline: 1em;
                margin-bottom: 0.3em;
                font-weight: bold;
                color: var(--merah);
                /* background-color: blue; */
            }
            .container-logo .item-logo:hover img {
                filter: saturate(1);
                transition: 0.2s;
                scale: 1.2;
            }

            .modal123 {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 0vh;
                overflow: hidden;
                background-color: white;
                z-index: 4;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
                transition: 1s;
            }
            .modal123.show {
                height: calc(100vh - 100px);
                transition: 1s;
            }
            @media (max-width: 1160px) {
                .modal123 p {
                    font-size: 1vw;
                }
            }

            #alert-custom {
                background-color: rgba(0, 0, 0, 0.5);
                width: 100vw;
                height: 100vh;
                position: fixed;
                top: 0;
                left: 0;
                z-index: 6;
                display: none;
                justify-content: center;
                align-items: center;
            }
            #alert-custom.show {
                display: flex;
            }
            .btn-lonjong {
                display: flex;
                justify-content: center;
                align-items: center;
                width: fit-content;
                text-decoration: none;
                color: white;
                gap: 0.6em;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 2em;
                padding: 0.3em 1em;
                transition: 0.2s ease-in-out;
                cursor: pointer;
            }
            .btn-lonjong:hover {
                color: black;
                background-color: white;
                transition: 0.2s ease-in-out;
            }
            @media (max-width: 1160px) {
                .btn-lonjong {
                    color: black;
                    background-color: white;
                    border: 1px solid rgba(255, 255, 255, 1);
                }
                .btn-lonjong p,
                .btn-lonjong i {
                    font-size: 10px;
                }
                .btn-lonjong:hover {
                    background-color: gainsboro;
                }
            }
            
            .must-landscape-alert {
                display: none;
            }
            @media (orientation: portrait) {
                .must-landscape-alert {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 100;
                    background-color: #1a1a1a;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    color: white;
                }
            }
        </style>
    </head>
    <body>
        <div class="must-landscape-alert">
            <img src="img/rotate_phone.png" alt="" class="mb-3" width="100px" />
            <p class="m-0">Putar handphone Anda</p>
        </div>
        <div id="alert-custom">
            <div
                style="
                    background-color: whitesmoke;
                    border-radius: 1em;
                    max-width: 400px;
                "
                class="p-4"
            >
                <p class="m-0">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Molestiae deleniti accusamus eveniet modi illo adipisci
                    animi alias voluptate? Repellendus a ipsam at tempora? Animi
                    id similique debitis recusandae, quos fugit dolore?
                    Blanditiis voluptas facere atque eius. Nobis obcaecati ea
                    fuga illum eum quas at adipisci vitae ab! Ea, mollitia unde.
                </p>
                <hr />
                <div class="d-flex justify-content-end gap-1">
                    <a href="" target="_blank" class="ok btn btn-outline-dark"
                        >Ok</a
                    >
                    <a
                        onclick="closeAlert()"
                        class="close btn btn-outline-danger"
                        >Batal</a
                    >
                </div>
            </div>
        </div>
        <div class="modal123">
            <div class="container py-4">
                <div
                    class="d-flex justify-content-end"
                    style="position: relative; height: 0px"
                >
                    <div
                        style="cursor: pointer; width: 30px; height: 30px"
                        class="d-flex justify-content-center align-items-center"
                        onclick="closeModal()"
                    >
                        x
                    </div>
                </div>
                <h2 class="mb-1">CV. Catur Bhakti Mandiri</h2>
                <h5 style="color: var(--merah)">23 Oktober 2024 - Sekarang</h5>
                <hr />
                <p class="m-0">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Perferendis, vitae nam sit est dolore, explicabo labore,
                    totam fugit cum alias a distinctio voluptatum tenetur
                    dignissimos sapiente id! Placeat, dolorum debitis. Lorem
                    ipsum dolor, sit amet consectetur adipisicing elit. Magnam
                    id aliquam vero maxime, fugit ullam veniam nesciunt vel
                    consectetur, incidunt, iusto et earum quidem aspernatur quas
                    consequuntur vitae veritatis necessitatibus debitis ducimus!
                    Autem commodi, reiciendis, quo voluptas odio ipsam minus
                    nobis quia esse, repellat ducimus vitae dolores incidunt
                    quasi impedit unde asperiores quis consequuntur. Est amet
                    eveniet possimus, obcaecati libero aliquam beatae! Nam
                    excepturi perspiciatis obcaecati dolores. Soluta, voluptas
                    sunt cumque rem cum provident a at? Maxime ea doloremque
                    reiciendis earum, quidem nemo aut ipsum exercitationem
                    similique est sit iure reprehenderit quis illo velit amet
                    tempora deserunt, debitis omnis. Necessitatibus.
                </p>
            </div>
        </div>
        <script>
            const modalElm = document.querySelector(".modal123");
            const modalJudulElm = document.querySelector(".modal123 h2");
            const modalTglElm = document.querySelector(".modal123 h5");
            const modalIsiElm = document.querySelector(".modal123 p");
            function closeModal() {
                modalElm.classList.remove("show");
            }
            function openModal(indexnya) {
                switch (indexnya) {
                    case 0:
                        modalJudulElm.innerHTML = "Indosat Ooredoo Hutchison";
                        modalTglElm.innerHTML = "18 April 2022 - 22 Juni 2022";
                        modalIsiElm.innerHTML =
                            "Puncak dari program Bangkit adalah kesempatan magang berharga yang saya jalani di perusahaan Indosat Ooredoo Hutchison. Selama masa magang ini, saya aktif terlibat dalam tim yang bertanggung jawab atas pengembangan sebuah chat aplications. Kolaborasi dengan rekan-rekan tim memungkinkan saya untuk berkontribusi dalam berbagai aspek pengembangan. Dalam konteks ini, peran saya terutama berfokus pada pengembangan bagian API dan manajemen Cloud Storage menggunakan Google Cloud Platform.";
                        break;
                    case 1:
                        modalJudulElm.innerHTML = "Final Project Assignment";
                        modalTglElm.innerHTML = "Februari 2023 - Juni 2023";
                        modalIsiElm.innerHTML =
                            "Projek yang saya bangun adalah aplikasi berbasis web untuk melatih pendengaran akor musik. Dalam pembangunannya, saya menggunakan ReactJS sebagai framework UI utama. Bagian back-end aplikasi diintegrasikan melalui layanan Firebase. Dalam hal ini, saya memanfaatkan layanan otentikasi, Firestore sebagai database, dan Hosting untuk menyiapkan proyek dalam lingkungan produksi.";
                        break;
                    case 2:
                        modalJudulElm.innerHTML = "CV. Catur Bhakti Mandiri";
                        modalTglElm.innerHTML = "Oktober 2023 - Now";
                        modalIsiElm.innerHTML =
                            "Saya bekerja full time di perusahaan CV. Catur Bhakti Mandiri. Selama bekerja di sana, saya telah mengembangkan dua situs e-commerce besar, yaitu untuk brand Lunarea dan Ilena. Dalam pengembangan proyek ini, saya menggunakan framework CodeIgniter dan mengintegrasikan sistem pembayaran melalui Midtrans.";
                        break;
                    default:
                        break;
                }
                modalElm.classList.add("show");
            }
        </script>
        <div class="navbar">
            <h1 class="logo">Galih</h1>
            <div class="d-flex">
                <button type="button" class="item-nav">Who Am I</button>
                <button type="button" class="item-nav">Ability</button>
                <button type="button" class="item-nav">Experience</button>
                <button type="button" class="item-nav">Projects</button>
                <button type="button" class="item-nav">Contact Me</button>
                <a
                    type="button"
                    class="item-nav fw-bold"
                    style="color: var(--merah); text-decoration: none"
                    href="https://drive.google.com/file/d/1mRQjHty8kRb-ASfN5KOkV7WuCY7kU0Mc/view?usp=sharing"
                    target="_blank"
                    >My Resume</a
                >
            </div>
        </div>
        <div id="scrollable">
            <div style="position: relative">
                <div
                    class="layer3 d-flex flex-column justify-content-center align-items-center"
                    style="width: 100vw; height: 100%; overflow: hidden"
                >
                    <style>
                        .hidaya {
                            transform: translateX(250px) translateY(100px);
                        }
                        @media (max-width: 1160px) {
                            .hidaya {
                                transform: translateX(200px) translateY(100px);
                            }
                        }
                    </style>
                    <h1
                        class="hidaya"
                        style="
                            width: fit-content;
                            font-weight: 700;
                            font-size: 13vw;
                            position: relative;
                            color: rgba(0, 0, 0, 0.1);
                            writing-mode: vertical-lr;
                            letter-spacing: -1px;
                            text-align: right;
                            line-height: 10vw;
                        "
                    >
                        HIDAYA
                    </h1>
                </div>
                <div
                    class="layer2 d-flex flex-column justify-content-center align-items-center"
                    style="width: 100vw; height: 80%"
                >
                    <style>
                        .sukmamukti {
                            transform: translateX(200px) translateY(100px);
                        }
                        @media (max-width: 1160px) {
                            .sukmamukti {
                                transform: translateX(100px) translateY(60px);
                            }
                        }
                    </style>
                    <h1
                        class="sukmamukti"
                        style="
                            width: fit-content;
                            font-weight: 100;
                            font-size: 20vh;
                            position: relative;
                            color: black;
                        "
                    >
                        Sukmamukti
                    </h1>
                </div>
                <div
                    style="
                        height: 100%;
                        width: 60vw;
                        position: relative;
                        overflow: hidden;
                    "
                    class="d-flex justify-content-center align-items-center"
                >
                    <img
                        src="fotoku1.png?v=1.0"
                        alt=""
                        style="position: absolute; object-fit: contain"
                        class="h-100 w-100"
                        id="gambar1"
                    />
                    <!-- <img
                        src="https://images.unsplash.com/photo-1598867388209-03eb4b65ac3c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt=""
                        style="position: absolute; object-fit: cover"
                        class="h-100 w-100"
                        id="gambar1"
                    /> -->
                </div>
                <div
                    class="layer1 d-flex flex-column justify-content-center align-items-center"
                    style="width: 100vw; height: 80%; z-index: 1"
                >
                    <div
                        class="d-flex flex-column align-items-end"
                        style="
                            position: relative;
                            transform: translateX(100px) translateY(-20px);
                        "
                    >
                        <h5 class="m-0" style="color: black">
                            <b style="color: var(--merah)">Full Stack</b>
                            Developer
                        </h5>
                        <h1
                            style="
                                width: fit-content;
                                font-weight: 900;
                                font-size: 10vw;
                                color: black;
                            "
                        >
                            Galih
                        </h1>
                    </div>
                </div>
                <div
                    class="layer3 d-flex flex-column justify-content-end align-items-center"
                    style="
                        width: 100vw;
                        height: 100%;
                        z-index: 1;
                        padding-bottom: 2em;
                    "
                >
                    <div
                        id="resume-mini"
                        style="
                            background-color: white;
                            overflow: hidden;
                            padding-inline: 30px;
                            position: relative;
                            z-index: 4;
                        "
                        class="py-3"
                    >
                        <p
                            style="font-size: 1vw; color: black; width: 70vw"
                            class="mb-1"
                        >
                            Saya adalah lulusan Sarjana Institut Teknologi
                            Sepuluh Nopember pada tahun 2023 dengan spesialisasi
                            sebagai full stack developer. Memiliki pengalaman
                            profesional selama 1 tahun sebagai full stack
                            developer, ditambah pengalaman magang selama 1
                            semester. Selama karier saya, saya telah
                            berkontribusi dalam pembuatan dua situs web
                            e-commerce untuk brand Lunarea Furniture dan Ilena
                            Furniture, di mana saya terlibat dalam pengembangan
                            end-to-end yang meliputi front-end dan back-end.
                            Saya siap membawa keahlian teknis dan kreativitas
                            saya untuk memberikan solusi terbaik pada proyek
                            berikutnya!
                        </p>
                    </div>
                </div>
                <div
                    class="layer2 d-flex flex-column justify-content-center align-items-center"
                    style="width: 100vw; z-index: 1; height: 100%"
                >
                    <div
                        style="
                            height: 2px;
                            width: 10vw;
                            background-color: black;
                            position: relative;
                            transform: translateX(500px) translateY(250px);
                        "
                    ></div>
                </div>
            </div>
            <div style="position: relative">
                <div
                    class="layer3 d-flex flex-column justify-content-end align-items-center"
                    style="width: 100%; height: 100%; overflow: hidden"
                >
                    <h1
                        style="
                            width: fit-content;
                            font-weight: 700;
                            font-size: 13vw;
                            position: relative;
                            color: rgba(0, 0, 0, 0.1);
                            letter-spacing: -1px;
                            text-align: right;
                        "
                    >
                        ABILITY
                    </h1>
                </div>
                <div
                    class="layer2 d-flex flex-column justify-content-center align-items-center"
                    style="width: 80vw; height: 55%"
                >
                    <h1
                        style="
                            width: fit-content;
                            font-weight: 900;
                            font-size: 9vw;
                            position: relative;
                            color: black;
                        "
                    >
                        Ability
                    </h1>
                </div>
                <div
                    class="layer1 d-flex flex-column justify-content-center align-items-center"
                    style="width: 30vw; height: 90%"
                >
                    <h1
                        style="
                            width: fit-content;
                            font-weight: 300;
                            font-size: 3vw;
                            position: relative;
                            transform: translateX(0px);
                            color: black;
                        "
                    >
                        Apa yang bisa saya lakukan?
                    </h1>
                </div>
                <div
                    class="layer2 d-flex flex-column justify-content-center align-items-center"
                    style="width: fit-content; z-index: 1; height: fit-content"
                >
                    <div
                        style="
                            height: 2px;
                            width: 20vw;
                            background-color: gray;
                            opacity: 0.3;
                            position: relative;
                            transform: translateX(400px) translateY(57svh);
                        "
                    ></div>
                </div>
                <div
                    class="layer1 d-flex flex-column justify-content-center align-items-center"
                    style="width: 75vw; height: 100%; padding-block: 6em"
                >
                    <div class="container-logo">
                        <div class="item-logo">
                            <img src="img/figma.png" alt="" />
                            <div>
                                <p class="nama">FIGMA</p>
                                <p class="tahun">2021</p>
                            </div>
                        </div>
                        <div class="item-logo">
                            <img src="img/html.png" alt="" />
                            <div>
                                <p class="nama">HTML</p>
                                <p class="tahun">2022</p>
                            </div>
                        </div>
                        <div class="item-logo">
                            <img src="img/css.png" alt="" />
                            <div>
                                <p class="nama">CSS</p>
                                <p class="tahun">2022</p>
                            </div>
                        </div>
                        <div class="item-logo">
                            <img src="img/js.png" alt="" />
                            <div>
                                <p class="nama">JAVASCRIPT</p>
                                <p class="tahun">2022</p>
                            </div>
                        </div>
                        <div class="item-logo">
                            <img src="img/php.png" alt="" />
                            <div>
                                <p class="nama">PHP</p>
                                <p class="tahun">2023</p>
                            </div>
                        </div>
                        <div class="item-logo">
                            <img src="img/express.png" alt="" />
                            <div>
                                <p class="nama">ExpressJs</p>
                                <p class="tahun">2022</p>
                            </div>
                        </div>
                        <div class="item-logo">
                            <img src="img/firebase.png" alt="" />
                            <div>
                                <p class="nama">Firebase</p>
                                <p class="tahun">2022</p>
                            </div>
                        </div>
                        <div class="item-logo">
                            <img src="img/mongo.png" alt="" />
                            <div>
                                <p class="nama">MongoDB</p>
                                <p class="tahun">2021</p>
                            </div>
                        </div>
                        <div class="item-logo">
                            <img src="img/mysql.png" alt="" />
                            <div>
                                <p class="nama">MySQL</p>
                                <p class="tahun">2023</p>
                            </div>
                        </div>
                        <div class="item-logo">
                            <img src="img/bootstrap.png" alt="" />
                            <div>
                                <p class="nama">Bootstrap</p>
                                <p class="tahun">2023</p>
                            </div>
                        </div>
                        <div class="item-logo">
                            <img src="img/react.png" alt="" />
                            <div>
                                <p class="nama">ReactJs</p>
                                <p class="tahun">2022</p>
                            </div>
                        </div>
                        <div class="item-logo">
                            <img src="img/ci.png" alt="" />
                            <div>
                                <p class="nama">CodeIgniter</p>
                                <p class="tahun">2023</p>
                            </div>
                        </div>
                        <div class="item-logo">
                            <img src="img/nextjs.png" alt="" />
                            <div>
                                <p class="nama">NextJs</p>
                                <p class="tahun">2024</p>
                            </div>
                        </div>
                        <div class="item-logo">
                            <img src="img/tailwind.png" alt="" />
                            <div>
                                <p class="nama">Tailwind</p>
                                <p class="tahun">2024</p>
                            </div>
                        </div>
                        <div class="item-logo">
                            <img src="img/ts.png" alt="" />
                            <div>
                                <p class="nama">Typescript</p>
                                <p class="tahun">2024</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="layer3 d-flex flex-column justify-content-center align-items-center"
                    style="width: fit-content; height: fit-content"
                >
                    <style>
                        .extra-skill-text {
                            transform: translateX(0px) translateY(60svh);
                        }
                        @media (max-width: 1160px) {
                            .extra-skill-text {
                                transform: translateX(0px) translateY(70svh);
                            }
                        }
                    </style>
                    <div
                        style="
                            width: fit-content;
                            position: relative;
                            color: var(--merah);
                        "
                        class="d-flex align-items-center gap-2 extra-skill-text"
                    >
                        <h1
                            style="font-weight: 600; font-size: 2vw"
                            class="m-0"
                        >
                            Extra Skills
                        </h1>
                        <i class="material-icons" style="font-size: 3vw"
                            >arrow_drop_down</i
                        >
                    </div>
                </div>
                <div
                    class="layer1 d-flex flex-column justify-content-end align-items-center"
                    style="width: fit-content; z-index: 1; height: fit-content"
                >
                    <style>
                        #extra-skill {
                            transform: translateY(70svh) translateX(-30px);
                        }
                        @media (max-width: 1160px) {
                            #extra-skill {
                                transform: translateY(80svh) translateX(-30px);
                            }
                        }
                    </style>
                    <div
                        id="extra-skill"
                        style="
                            background-color: white;
                            overflow: hidden;
                            padding-inline: 30px;
                        "
                        class="py-3"
                    >
                        <div
                            style="font-size: 1vw; color: black; width: 25vw"
                            class="m-0"
                        >
                            <ul class="m-0" style="text-wrap: nowrap">
                                <li class="m-0">Rest API</li>
                                <li class="m-0">Midtrans integration</li>
                                <li class="m-0">RajaOnkir integration</li>
                                <li class="m-0">WordPress</li>
                                <li class="m-0">JSON Web Token</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div style="position: relative">
                <div
                    class="layer2 d-flex flex-column justify-content-center align-items-center"
                    style="width: 100vw; height: fit-content"
                >
                    <style>
                        .myex1 {
                            transform: translateX(200px) translateY(100px);
                        }
                        .myex2 {
                            transform: translateX(320px) translateY(150px);
                        }
                        @media (max-width: 1160px) {
                            .myex1 {
                                transform: translateX(100px) translateY(30px);
                            }
                            .myex2 {
                                transform: translateX(140px) translateY(60px);
                            }
                        }
                    </style>
                    <p
                        class="myex1"
                        style="
                            font-family: 'Comforter', cursive;
                            font-size: 6vw;
                            margin: 0;
                            position: absolute;
                            z-index: 2;
                            color: var(--merah);
                        "
                    >
                        My
                    </p>
                    <h1
                        class="myex2"
                        style="
                            font-weight: 900;
                            font-size: 6vw;
                            position: relative;
                        "
                    >
                        Experience
                    </h1>
                </div>
                <style>
                    .item-experience {
                        /* border d-flex align-items-center p-5 */
                        flex: 1;
                        border: 1px solid rgb(190, 190, 190);
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        /* align-items: center; */
                        padding: 3em;
                        gap: 1em;
                        transition: 0.3s;
                        cursor: default;
                    }
                    .item-experience .status {
                        background-color: var(--merah);
                        color: white;
                        font-weight: bold;
                        padding: 0.5em 1em;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border-radius: 2em;
                        text-wrap: nowrap;
                        width: fit-content;
                    }
                    .item-experience:hover {
                        border: 1px solid black;
                        transition: 0.3s;
                    }
                    .item-experience i {
                        position: relative;
                        transform: translateX(-10px);
                        opacity: 0;
                        transition: 0.3s;
                    }
                    .item-experience:hover i {
                        transform: translateX(0px);
                        opacity: 1;
                        transition: 0.3s;
                    }

                    .container-item-experience {
                        transform: translateX(-300px) translateY(45svh);
                    }
                    @media (max-width: 1160px) {
                        .container-item-experience {
                            transform: translateX(-320px) translateY(45svh);
                            scale: 0.8;
                        }
                    }
                </style>
                <div
                    class="layer1 d-flex flex-column justify-content-center align-items-center"
                    style="
                        width: fit-content;
                        height: fit-content;
                        display: grid;
                        grid-template-columns: repeat();
                    "
                >
                    <div
                        class="d-flex gap-2 container-item-experience"
                        style="position: relative; width: 100%"
                    >
                        <div class="item-experience" onclick="openModal(0)">
                            <h3 class="m-0" style="font-weight: 600">
                                Indosat Ooredoo<br />Hutchison
                            </h3>
                            <div
                                class="d-flex align-items-center justify-content-between"
                            >
                                <div class="status">MAGANG</div>
                                <i
                                    class="material-icons"
                                    style="height: fit-content"
                                    >chevron_right</i
                                >
                            </div>
                        </div>
                        <div class="item-experience" onclick="openModal(1)">
                            <h3 class="m-0" style="font-weight: 600">
                                Final Project<br />Assignment
                            </h3>
                            <div
                                class="d-flex align-items-center justify-content-between"
                            >
                                <div class="status">SKRIPSI</div>
                                <i
                                    class="material-icons"
                                    style="height: fit-content"
                                    >chevron_right</i
                                >
                            </div>
                        </div>
                        <div class="item-experience" onclick="openModal(2)">
                            <h3 class="m-0" style="font-weight: 600">
                                CV. Catur Bhakti Mandiri
                            </h3>
                            <div
                                class="d-flex align-items-center justify-content-between"
                            >
                                <div class="status">FULL TIME</div>
                                <i
                                    class="material-icons"
                                    style="height: fit-content"
                                    >chevron_right</i
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="position: relative">
                <style>
                    .item-project {
                        display: block;
                        background-size: cover;
                        /* background-position: top; */
                        height: 100%;
                        transition: 0.5s ease-in-out;
                        color: white;
                        border-radius: 1em;
                        padding-block: 2em;
                        padding-inline: 0;
                        filter: saturate(0) contrast(1.2);
                        cursor: pointer;
                    }
                    .item-project .hide {
                        /* display: none; */
                        /* position: absolute; */

                        max-width: 10px;
                        overflow-x: hidden;
                        opacity: 0;
                        transition: 0.5s ease-in-out;
                    }
                    .item-project .show {
                        opacity: 1;
                        transition: 0.5s ease-in-out;
                        font-size: 2em;
                        /* display: block; */
                    }
                    input[name="project"] {
                        display: none;
                    }
                    input[name="project"]:checked + .item-project {
                        background-position: center;
                        /* background-color: blue; */
                        cursor: default;
                        padding-block: 2em;
                        padding-inline: 2em;
                        transition: 0.5s ease-in-out;
                        filter: saturate(1);
                        flex: 1;
                    }
                    input[name="project"]:checked + .item-project .hide {
                        /* display: block; */
                        transition: 1s ease-in-out;
                        max-width: 100vw;
                        opacity: 1;
                    }
                    input[name="project"]:checked + .item-project .show {
                        opacity: 0;
                        position: absolute;
                        transition: 0.5s ease-in-out;
                        /* display: none; */
                    }
                    @media (max-width: 1160px) {
                        .item-project .show {
                            font-size: 20px;
                        }
                        .item-project h1 {
                            font-size: 20px;
                        }
                        .item-project .hide > p {
                            font-size: 10px;
                            margin-bottom: 1em;
                        }
                        input[name="project"]:checked + .item-project {
                            background-position: top;
                        }
                    }
                </style>
                <div
                    class="layer4 d-flex flex-column justify-content-center align-items-center"
                    style="width: 100vw; height: 100svh"
                >
                    <style>
                        .container-projects {
                            height: 60svh;
                        }
                        @media (max-width: 1160px) {
                            .container-projects {
                                height: 75svh;
                                transform: translateY(15px);
                            }
                        }
                    </style>
                    <div
                        class="d-flex gap-2 container-projects"
                        style="width: 85vw; position: relative; z-index: 4"
                    >
                        <input
                            type="radio"
                            name="project"
                            id="project_omong"
                            checked
                        />
                        <label
                            for="project_omong"
                            style="background-image: url('img/omong.jpg')"
                            class="item-project"
                        >
                            <h1 class="show" style="writing-mode: vertical-lr">
                                OMONG
                            </h1>
                            <div class="hide">
                                <h1 class="mb-2">OMONG<br />Chat App</h1>
                                <p>NextJs | MongoDB | Tailwind</p>
                                <a
                                    href="https://ngomongo.galihsuks.com/"
                                    class="btn-lonjong"
                                    ><p class="m-0">Lihat Projek</p>
                                    <i class="material-icons d-block m-0"
                                        >arrow_forward</i
                                    ></a
                                >
                            </div>
                        </label>
                        <input
                            type="radio"
                            name="project"
                            id="project1"
                        />
                        <label
                            for="project1"
                            style="background-image: url('img/ilena.jpg')"
                            class="item-project"
                        >
                            <h1 class="show" style="writing-mode: vertical-lr">
                                ILENA
                            </h1>
                            <div class="hide">
                                <h1 class="mb-2">ILENA<br />Furniture</h1>
                                <p>Codeigniter | Bootstrap | Midtrans</p>
                                <a
                                    href="https://ilenafurniture.com/"
                                    class="btn-lonjong"
                                    ><p class="m-0">Lihat Projek</p>
                                    <i class="material-icons d-block m-0"
                                        >arrow_forward</i
                                    ></a
                                >
                            </div>
                        </label>
                        <input type="radio" name="project" id="project2" />
                        <label
                            for="project2"
                            style="background-image: url('img/lunarea.jpg')"
                            class="item-project"
                        >
                            <h1 class="show" style="writing-mode: vertical-lr">
                                LUNAREA
                            </h1>
                            <div class="hide">
                                <h1 class="mb-2">LUNAREA<br />Furniture</h1>
                                <p>Codeigniter | Bootstrap | Midtrans</p>
                                <a
                                    href="https://lunareafurniture.com/"
                                    class="btn-lonjong"
                                    ><p class="m-0">Lihat Projek</p>
                                    <i class="material-icons d-block m-0"
                                        >arrow_forward</i
                                    ></a
                                >
                            </div>
                        </label>
                        <input type="radio" name="project" id="project3" />
                        <label
                            for="project3"
                            style="background-image: url('img/TA.jpeg')"
                            class="item-project"
                        >
                            <h1 class="show" style="writing-mode: vertical-lr">
                                DEAKOR
                            </h1>
                            <div class="hide">
                                <h1 class="mb-2">DEAKOR<br />Tugas Akhir</h1>
                                <p>ReactJs | Firebase</p>
                                <a
                                    class="btn-lonjong"
                                    onclick="showAlert('Akun login:<br>email:galih@gmail.com<br>pass:12345678', 'https://tugasakhir-ku.web.app/')"
                                    ><p class="m-0">Lihat Projek</p>
                                    <i class="material-icons d-block m-0"
                                        >arrow_forward</i
                                    ></a
                                >
                            </div>
                        </label>
                        <input type="radio" name="project" id="project4" />
                        <label
                            for="project4"
                            style="background-image: url('img/oceria.jpg')"
                            class="item-project"
                        >
                            <h1 class="show" style="writing-mode: vertical-lr">
                                OCERIA
                            </h1>
                            <div class="hide">
                                <h1 class="mb-2">
                                    OCERIA<br />Patient Management
                                </h1>
                                <p>PHP | MySQL</p>
                                <a
                                    href="https://oceria.amagabar.com/"
                                    class="btn-lonjong"
                                    ><p class="m-0">Lihat Projek</p>
                                    <i class="material-icons d-block m-0"
                                        >arrow_forward</i
                                    ></a
                                >
                            </div>
                        </label>
                        <input type="radio" name="project" id="project5" />
                        <label
                            for="project5"
                            style="background-image: url('img/riset.jpg')"
                            class="item-project"
                        >
                            <h1 class="show" style="writing-mode: vertical-lr">
                                RESEARCH
                            </h1>
                            <div class="hide">
                                <h1 class="mb-2">
                                    RESEARCH<br />Project For Research
                                </h1>
                                <p>PHP | MySQL</p>
                                <a
                                    href="https://riset.amagabar.com/"
                                    class="btn-lonjong"
                                    ><p class="m-0">Lihat Projek</p>
                                    <i class="material-icons d-block m-0"
                                        >arrow_forward</i
                                    ></a
                                >
                            </div>
                        </label>
                        <input type="radio" name="project" id="project9" />
                        <label
                            for="project9"
                            style="background-image: url('img/backend.jpg')"
                            class="item-project"
                        >
                            <h1 class="show" style="writing-mode: vertical-lr">
                                REST API
                            </h1>
                            <div class="hide">
                                <h1 class="mb-2">
                                    REST API<br />Backend Chat Apps
                                </h1>
                                <p>Javascript | ExpressJs | Firebase</p>
                                <a
                                    href="https://github.com/bangkit-team/IOH-chat-app/tree/main/CloudComputing/backend"
                                    class="btn-lonjong"
                                    ><p class="m-0">Lihat Projek</p>
                                    <i class="material-icons d-block m-0"
                                        >arrow_forward</i
                                    ></a
                                >
                            </div>
                        </label>
                    </div>
                </div>
                <div
                    class="layer2 d-flex flex-column justify-content-center align-items-center"
                    style="width: fit-content; height: fit-content"
                >
                    <style>
                        .latest {
                            transform: translateX(1300px) translateY(82svh);
                        }
                        @media (max-width: 1160px) {
                            .latest {
                                transform: translateX(700px) translateY(94svh);
                            }
                        }
                    </style>
                    <h1
                        class="latest"
                        style="
                            width: fit-content;
                            font-weight: 700;
                            font-size: 2vw;
                            position: relative;
                        "
                    >
                        LATEST
                    </h1>
                </div>
                <div
                    class="layer1 d-flex flex-column justify-content-center align-items-center"
                    style="width: fit-content; height: fit-content"
                >
                    <style>
                        .projects {
                            transform: translateX(-390px) translateY(86svh);
                        }
                        @media (max-width: 1160px) {
                            .projects {
                                transform: translateX(-200px) translateY(98svh);
                            }
                        }
                    </style>
                    <h1
                        class="projects"
                        style="
                            width: fit-content;
                            font-weight: 300;
                            font-size: 4vw;
                            letter-spacing: 0.8em;
                            color: var(--merah);
                            position: relative;
                        "
                    >
                        PROJECTS
                    </h1>
                </div>
                <div
                    class="layer3 d-flex flex-column justify-content-center align-items-center"
                    style="width: fit-content; z-index: 1; height: fit-content"
                >
                    <style>
                        .garis-project {
                            display: block;
                        }
                        @media (max-width: 1160px) {
                            .garis-project {
                                display: none;
                            }
                        }
                    </style>
                    <div
                        class="garis-project"
                        style="
                            height: 2px;
                            width: 30vw;
                            background-color: black;
                            opacity: 0.3;
                            position: relative;
                            transform: translateX(-300px) translateY(16svh);
                        "
                    ></div>
                </div>
                <div
                    class="layer3 d-flex flex-column justify-content-end align-items-center"
                    style="width: fit-content; height: 40%"
                >
                    <h1
                        style="
                            width: fit-content;
                            font-weight: 700;
                            font-size: 13vw;
                            position: relative;
                            transform: translateX(-100px);
                            color: rgba(0, 0, 0, 0.1);
                            letter-spacing: -1px;
                            text-align: right;
                        "
                    >
                        PORTFOLIO
                    </h1>
                </div>
            </div>
            <style>
                @media (max-width: 1160px) {
                    .akhir {
                        font-size: small;
                    }
                }
            </style>
            <div
                style="
                    position: relative;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
                    background-color: whitesmoke;
                    display: flex;
                    flex-direction: column;
                "
                class="akhir"
            >
                <div style="flex: 1"></div>
                <div
                    style="height: fit-content"
                    class="d-flex flex-column align-items-start p-5 justify-content-center"
                >
                    <h3 class="mb-4">Mari diskusi dengan saya</h3>
                    <p class="m-0">Email</p>
                    <a
                        style="text-decoration: none; color: black"
                        href="mailto:galih8.4.2001@gmail.com"
                        ><p class="fw-bold">galih8.4.2001@gmail.com</p></a
                    >
                    <p class="m-0">No. HP</p>
                    <a
                        style="text-decoration: none; color: black"
                        href="https://api.whatsapp.com/send/?phone=081905266517&text=Halo%2C+Galih%21+Kami+ingin+mengajak+Anda+untuk+bekerja+bersama+kami&type=phone_number&app_absent=0"
                    >
                        <p class="fw-bold">0819-0526-6517</p>
                    </a>
                    <div
                        class="my-4"
                        style="
                            height: 1px;
                            width: 60%;
                            background-color: rgb(150, 150, 150);
                        "
                    ></div>
                    <p class="m-0">©2024. All Right Reserved</p>
                    <p class="m-0">Designed by <b>Galih Sukmamukti</b></p>
                </div>
            </div>
        </div>
        <script>
            const itemNavElm = document.querySelectorAll(".item-nav");
            const scrollableElm = document.getElementById("scrollable");
            const layer1Elm = document.querySelectorAll(".layer1");
            const layer2Elm = document.querySelectorAll(".layer2");
            const layer3Elm = document.querySelectorAll(".layer3");
            const gambar1Elm = document.getElementById("gambar1");
            const resumeMiniElm = document.getElementById("resume-mini");
            const extraSkillElm = document.getElementById("extra-skill");
            scrollableElm.onscroll = (e) => {
                let x = scrollableElm.scrollLeft;
                // console.log(scrollableElm.scrollLeft);
                // console.log(scrollableElm.scrollWidth);
                layer1Elm.forEach((element) => {
                    element.style.transform = "translateX(" + x / 6 + "px)";
                });
                layer2Elm.forEach((element) => {
                    element.style.transform = "translateX(-" + x / 6 + "px)";
                });
                layer3Elm.forEach((element) => {
                    element.style.transform = "translateX(" + x / 4 + "px)";
                    element.style.transform = "translateX(" + x / 4 + "px)";
                });
                gambar1Elm.style.transform =
                    "scale(" +
                    (1 + (x % window.innerWidth) / window.innerWidth) +
                    ")";

                //kecilin resume mini
                const widthResumeMini = (window.innerWidth * 70) / 100 + 60;
                resumeMiniElm.style.width = widthResumeMini - x / 2 + "px";
                const widthExtraSkill = (window.innerWidth * 25) / 100 + 60;
                extraSkillElm.style.width =
                    window.innerWidth + widthExtraSkill - x + "px";
            };
            itemNavElm.forEach((itemNav, indItem) => {
                itemNav.addEventListener("click", (e) => {
                    let position = Math.floor(
                        scrollableElm.scrollLeft / scrollableElm.clientWidth
                    );
                    let direction = indItem - position;
                    const scrollAmount = scrollableElm.clientWidth * direction;
                    scrollableElm.scrollBy({
                        left: scrollAmount,
                        behavior: "smooth",
                    });
                });
            });

            function showAlert(teks, link) {
                const alertCustomElm = document.getElementById("alert-custom");
                const alertCustomTextElm =
                    document.querySelector("#alert-custom p");
                const alertCustomOkElm =
                    document.querySelector("#alert-custom .ok");
                alertCustomTextElm.innerHTML = teks;
                alertCustomOkElm.href = link;
                alertCustomElm.classList.add("show");
            }
            function closeAlert() {
                const alertCustomElm = document.getElementById("alert-custom");
                alertCustomElm.classList.remove("show");
            }

            document.documentElement.requestFullscreen();
            //screen.orientation.lock("landscape");
        </script>
    </body>
</html>
