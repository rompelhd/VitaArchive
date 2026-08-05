let apps = [];

const container = document.getElementById("apps");
const searchInput = document.getElementById("search");
const typeFilter = document.getElementById("type-filter");
const appCount = document.getElementById("app-count");


const CATALOG =
    "https://raw.githubusercontent.com/rompelhd/VitaArchive/main/data/apps.json";

const TYPES = {

    1: {
        slug: "game",
        label: "Original Game"
    },

    2: {
        slug: "port",
        label: "Game Port"
    },

    4: {
        slug: "utility",
        label: "Utility"
    },

    5: {
        slug: "emulator",
        label: "Emulator"
    }

};



function formatDate(date) {

    if (!date) return "-";

    const parts = date.split("-");

    if (parts.length !== 3) {
        return date;
    }


    const year = parts[0];
    const month = parts[1];
    const day = parts[2];


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


    return `${months[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;

}



async function loadApps() {


    try {


        const response = await fetch(CATALOG);


        if (!response.ok) {

            throw new Error("Catalog could not be loaded");

        }



        const json = await response.json();



        const list = Array.isArray(json)
            ? json
            : json.apps || [];




        apps = list

            .map(app => {


                const typeInfo =
                    TYPES[app.type] || {
                        slug: "unknown",
                        label: "Unknown"
                    };



                return {


                    name: app.name || "",


                    description:
                        app.long_description || "",



                    version:
                        app.version || "",



                    type:
                        typeInfo.slug,



                    typeLabel:
                        typeInfo.label,



                    author:
                        app.author || "Unknown",



                    icon:
                        app.icon || "",



                    download:
                        app.url || "#",



                    data:
                        app.data || "",



                    downloads:
                        app.downloads || "0",



                    date:
                        app.date || "",



                    source:
                        app.source || "",



                    release:
                        app.release_page || "",



                    changelog:
                        app.changelog || ""


                };


            })


            .sort((a, b) => {

                return new Date(b.date + "T00:00:00") -
                       new Date(a.date + "T00:00:00");

            });



        renderApps(apps);



    } catch(err) {


        console.error(err);


        container.innerHTML =
            "<p>Error loading store.</p>";


        appCount.textContent =
            "Error loading applications.";


    }


}





function renderApps(list) {


    container.innerHTML = "";



    appCount.textContent =
        `Showing ${list.length} of ${apps.length} applications`;



    if (list.length === 0) {


        container.innerHTML =
            "<p>No applications found.</p>";


        return;


    }




    list.forEach(app => {



        const card = document.createElement("article");


        card.className = "detail";



        card.innerHTML = `



            ${app.icon
                ? `<img src="${app.icon}" alt="${app.name}">`
                : ""
            }



            <h3>
                ${app.name}
            </h3>



            <p>
                ${app.description}
            </p>




            <div class="app-info">



                <span>
                    Version: ${app.version}
                </span>



                <span>
                    Type: ${app.typeLabel}
                </span>



                <span>
                    Downloads: ${app.downloads}
                </span>



                <span>
                    Added: ${formatDate(app.date)}
                </span>




                <span>

                    Creator:

                    <a href="user.html?user=${encodeURIComponent(app.author)}">

                        ${app.author}

                    </a>

                </span>



            </div>




            ${app.download !== "#"
                ? `

                <a class="download"
                   href="${app.download}"
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




            ${app.source
                ? `

                <a class="download"
                   href="${app.source}"
                   target="_blank">

                    Source Code

                </a>

                `
                : ""
            }




            ${app.release
                ? `

                <a class="download"
                   href="${app.release}"
                   target="_blank">

                    Release Page

                </a>

                `
                : ""
            }




        `;



        container.appendChild(card);



    });


}





function filterApps() {


    const text =
        searchInput.value.toLowerCase();



    const type =
        typeFilter.value;




    const filtered =
        apps.filter(app => {



            const matchesText =

                app.name.toLowerCase().includes(text) ||

                app.description.toLowerCase().includes(text);




            const matchesType =

                type === "all" ||

                app.type === type;



            return matchesText && matchesType;



        });




    renderApps(filtered);



}





searchInput.addEventListener(
    "input",
    filterApps
);


typeFilter.addEventListener(
    "change",
    filterApps
);


loadApps();
