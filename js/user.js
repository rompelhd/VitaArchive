document.addEventListener("DOMContentLoaded", () => {


    const params = new URLSearchParams(
        window.location.search
    );


    const username = params.get("user");


    const nameElement =
        document.getElementById("username");


    const descriptionElement =
        document.getElementById("user-description");


    const appsContainer =
        document.getElementById("user-apps");



    if (!username) {

        nameElement.textContent = "Usuario no encontrado";

        return;

    }



    nameElement.textContent = username;



    fetch("./data/apps.json")


        .then(response => {


            if (!response.ok) {

                throw new Error(
                    "No se pudo cargar apps.json"
                );

            }


            return response.json();


        })


        .then(apps => {



            console.log("Apps cargadas:", apps);

            console.log("Buscando usuario:", username);



            const userApps = apps.filter(app =>

                app.author.toLowerCase() === username.toLowerCase()

            );



            console.log("Apps del usuario:", userApps);




            if (userApps.length === 0) {


                descriptionElement.textContent =
                    "Este usuario todavía no tiene publicaciones.";


                return;

            }



            descriptionElement.textContent =

                `${userApps.length} publicación(es) en Vita Homebrew Store`;




            userApps.forEach(app => {



                const card = document.createElement("article");


                card.className = "detail";



                card.innerHTML = `


                    <h3>
                        ${app.name}
                    </h3>


                    <p>
                        ${app.description}
                    </p>


                    <p>

                        Categoría:
                        ${app.category}

                        <br>

                        Versión:
                        ${app.version}

                    </p>


                    <a class="download"
                    href="${app.download}">

                        Descargar VPK

                    </a>


                `;



                appsContainer.appendChild(card);



            });



        })


        .catch(error => {


            console.error(
                "Error:",
                error
            );


            appsContainer.innerHTML = `

                <p>
                Error cargando aplicaciones.
                </p>

            `;


        });



});