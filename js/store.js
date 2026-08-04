let apps = [];

const container = document.getElementById("apps");
const searchInput = document.getElementById("search");
const typeFilter = document.getElementById("type-filter");
const appCount = document.getElementById("app-count");

const CATALOG =
    "https://raw.githubusercontent.com/rompelhd/VitaArchive/main/data/apps.json";

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

        const data = await Promise.all(

            list.map(async app => {

                let version = "Desconocida";
                let download = "#";

                if (app.repo) {

                    try {

                        const release = await fetch(
                            `https://api.github.com/repos/${app.repo}/releases/latest`
                        );

                        if (release.ok) {

                            const rel = await release.json();

                            version =
                                rel.tag_name ||
                                "Desconocida";


                            if (rel.assets) {

                                const asset = rel.assets.find(a =>
                                    a.name.toLowerCase().endsWith(".vpk")
                                );


                                if (asset) {

                                    download =
                                        asset.browser_download_url;

                                }

                            }

                        }

                    } catch (e) {

                        console.warn(
                            "No se pudo obtener la release de",
                            app.name
                        );

                    }

                }


                return {

                    name: app.name,

                    description: app.description || "",

                    version: version,

                    category: app.category || "Otros",

                    type: app.category || "Otros",

                    author: app.author || "Desconocido",

                    icon: app.icon || "",

                    download: download,

                    data: app.data || ""

                };

            })

        );


        apps = data.sort((a, b) =>
            a.name.localeCompare(b.name)
        );

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

                <span>Versión: ${app.version}</span>

                <span>Categoría: ${app.category}</span>

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
