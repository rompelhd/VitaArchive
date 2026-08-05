let apps = [];

const container = document.getElementById("apps");
const searchInput = document.getElementById("search");
const typeFilter = document.getElementById("type-filter");
const appCount = document.getElementById("app-count");

const CATALOG =
    "https://raw.githubusercontent.com/rompelhd/VitaArchive/main/data/apps.json";


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
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre"
    ];

    return `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;

}


async function loadApps() {

    try {

        const response = await fetch(CATALOG);

        if (!response.ok) {
            throw new Error("No se pudo cargar el catálogo");
        }


        const json = await response.json();


        const list = Array.isArray(json)
            ? json
            : json.apps || [];


        apps = list
            .map(app => ({

                name: app.name || "",

                description: app.long_description || "",

                version: app.version || "",

                category: app.type || "",

                type: app.type || "",

                author: app.author || "Desconocido",

                icon: app.icon || "",

                download: app.url || "#",

                data: app.data || "",

                downloads: app.downloads || "0",

                size: app.size || "0",

                date: app.date || "",

                source: app.source || "",

                release: app.release_page || "",

                changelog: app.changelog || ""

            }))

            .sort((a, b) => {

                return new Date(b.date + "T00:00:00") -
                       new Date(a.date + "T00:00:00");

            });


        renderApps(apps);


    } catch (err) {

        console.error(err);

        container.innerHTML =
            "<p>Error cargando la tienda.</p>";

        appCount.textContent =
            "Error al cargar las aplicaciones.";

    }

}



function renderApps(list) {

    container.innerHTML = "";


    appCount.textContent =
        `Mostrando ${list.length} de ${apps.length} aplicaciones`;


    if (list.length === 0) {

        container.innerHTML =
            "<p>No hay aplicaciones encontradas.</p>";

        return;

    }


    list.forEach(app => {


        const card = document.createElement("article");


        card.className = "detail";


        card.innerHTML = `

            ${app.icon
                ? `<img src="${app.icon}" alt="${app.name}">`
                : ""}


            <h3>${app.name}</h3>


            <p>${app.description}</p>


            <div class="app-info">


                <span>
                    Versión: ${app.version}
                </span>


                <span>
                    Tipo: ${app.type}
                </span>


                <span>
                    Descargas: ${app.downloads}
                </span>


                <span>
                    Añadido: ${formatDate(app.date)}
                </span>


                <span>
                    Creador:
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

                    Descargar VPK

                </a>
                `
                : ""
            }



            ${app.data
                ? `
                <a class="download"
                   href="${app.data}"
                   target="_blank">

                    Descargar Data

                </a>
                `
                : ""
            }



            ${app.source
                ? `
                <a class="download"
                   href="${app.source}"
                   target="_blank">

                    Código fuente

                </a>
                `
                : ""
            }



            ${app.release
                ? `
                <a class="download"
                   href="${app.release}"
                   target="_blank">

                    Release

                </a>
                `
                : ""
            }


        `;


        container.appendChild(card);


    });


}



function filterApps() {


    const text = searchInput.value.toLowerCase();

    const type = typeFilter.value;



    const filtered = apps.filter(app => {


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



searchInput.addEventListener("input", filterApps);

typeFilter.addEventListener("change", filterApps);


loadApps();
