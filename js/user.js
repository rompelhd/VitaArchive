document.addEventListener("DOMContentLoaded", () => {


    const params =
        new URLSearchParams(
            window.location.search
        );


    const username =
        params.get("user");



    const nameElement =
        document.getElementById("username");



    const descriptionElement =
        document.getElementById("user-description");



    const appsContainer =
        document.getElementById("user-apps");





    const TYPES = {

        1: "Original Game",

        2: "Game Port",

        4: "Utility",

        5: "Emulator"

    };





    function formatDate(date) {


        if (!date) return "-";


        const parts =
            date.split("-");


        if (parts.length !== 3) {

            return date;

        }



        const months = [

            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"

        ];



        return `${months[parseInt(parts[1]) - 1]} ${parseInt(parts[2])}, ${parts[0]}`;


    }





    function renderAuthors(author) {


        if (!author) {

            return "Unknown";

        }



        return author
            .split(",")
            .map(name => name.trim())
            .map(name => `

                <a href="user.html?user=${encodeURIComponent(name)}">

                    ${name}

                </a>

            `)
            .join(", ");

    }







    if (!username) {


        nameElement.textContent =
            "User not found";


        return;


    }




    nameElement.textContent =
        username;





    fetch("./data/apps.json")

        .then(response => {


            if (!response.ok) {


                throw new Error(
                    "Could not load apps.json"
                );


            }



            return response.json();


        })



        .then(apps => {



            const userApps = apps.filter(app => {


                if (!app.author) {

                    return false;

                }



                const authors = app.author
                    .split(",")
                    .map(name => name.trim().toLowerCase());



                return authors.includes(
                    username.toLowerCase()
                );


            });







            if (userApps.length === 0) {



                descriptionElement.textContent =
                    "This user has not published any applications yet.";



                return;



            }





            descriptionElement.textContent =

                `${userApps.length} published application(s) in VitaArchive`;







            userApps.forEach(app => {



                const card =
                    document.createElement("article");



                card.className =
                    "detail";





                card.innerHTML = `



                    ${app.icon

                        ? `<img src="${app.icon}" alt="${app.name}">`

                        : ""

                    }





                    <h3>

                        ${app.name}

                    </h3>





                    <p>

                        ${app.long_description || ""}

                    </p>





                    <div class="app-info">


                        <span>

                            Version:
                            ${app.version || "-"}

                        </span>



                        <span>

                            Type:
                            ${TYPES[app.type] || "Unknown"}

                        </span>



                        <span>

                            Added:
                            ${formatDate(app.date)}

                        </span>



                        <span>

                            Creator:
                            ${renderAuthors(app.author)}

                        </span>



                    </div>





                    ${app.url

                        ? `

                        <a class="download"

                           href="${app.url}"

                           target="_blank">


                            Download VPK


                        </a>


                        `

                        : ""

                    }





                    ${app.data

                        ? `

                        <a class="download"

                           href="${app.data}"

                           target="_blank">


                            Download Data


                        </a>


                        `

                        : ""

                    }




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

                    Error loading applications.

                </p>

            `;



        });



});
