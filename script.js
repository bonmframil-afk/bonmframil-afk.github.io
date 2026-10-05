/* =====================================================
   BAYANIHAN ALERT
   JAVASCRIPT
   ===================================================== */


/* =====================================================
   COMMUNITY REPORTS
   ===================================================== */

let map;


/* =====================================================
   GIS MAP
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    map = L.map("map").setView(
        [12.8797, 121.7740],
        6
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);


    /* =========================================
       EXISTING COMMUNITY REPORTS
       ========================================= */

    const cebuCommunity =
        L.marker([10.3157, 123.8854])
            .addTo(map);

    cebuCommunity.bindPopup(`
        <strong>Community Report</strong><br>
        Flooding reported in Cebu City.<br>
        <small>October 2, 2026</small>
    `);


    const davaoCommunity =
        L.marker([7.1907, 125.4553])
            .addTo(map);

    davaoCommunity.bindPopup(`
        <strong>Community Report</strong><br>
        Road obstruction reported in Davao City.<br>
        <small>October 1, 2026</small>
    `);


    const iloiloCommunity =
        L.marker([10.7202, 122.5621])
            .addTo(map);

    iloiloCommunity.bindPopup(`
        <strong>Community Report</strong><br>
        Damaged road reported in Iloilo.<br>
        <small>September 29, 2026</small>
    `);


    /* =========================================
       EXISTING OFFICIAL / NEWS INFORMATION
       ========================================= */

    const officialVisayas =
        L.marker([10.5, 123.5])
            .addTo(map);

    officialVisayas.bindPopup(`
        <strong>Official Information</strong><br>
        PAGASA weather monitoring affecting
        parts of the Visayas and Mindanao.<br>
        <small>October 2, 2026</small>
    `);


    /* =========================================
       HAZARD REFERENCE
       ========================================= */

    const hazardReference =
        L.circle(
            [10.3157, 123.8854],
            {
                radius: 45000,
                color: "#FE9179",
                fillColor: "#FDC1B4",
                fillOpacity: 0.25
            }
        ).addTo(map);

    hazardReference.bindPopup(`
        <strong>Visual Hazard Reference</strong><br>
        This area is shown for prototype
        visualization only. It is not a live
        hazard boundary.
    `);


    /* =========================================
       MAP LEGEND
       ========================================= */

    const legend =
        L.control({
            position: "bottomright"
        });

    legend.onAdd = function () {

        const div =
            L.DomUtil.create(
                "div",
                "map-legend"
            );

        div.innerHTML = `
            <strong>Bayanihan Alert</strong><br><br>

            <span style="
                display:inline-block;
                width:10px;
                height:10px;
                border-radius:50%;
                background:#FE9179;
                margin-right:6px;
            "></span>

            Community Report
            <br>

            <span style="
                display:inline-block;
                width:10px;
                height:10px;
                border-radius:50%;
                background:#72B0AB;
                margin-right:6px;
            "></span>

            Official Information
            <br>

            <span style="
                display:inline-block;
                width:10px;
                height:10px;
                border-radius:50%;
                background:#FDC1B4;
                margin-right:6px;
            "></span>

            Hazard Reference
        `;

        div.style.background = "#FFEDD1";
        div.style.padding = "12px";
        div.style.border = "2px solid #294442";
        div.style.borderRadius = "8px";
        div.style.fontFamily = "Arial, sans-serif";
        div.style.fontSize = "12px";

        return div;
    };

    legend.addTo(map);


    /* =========================================
       LOAD SAVED COMMUNITY REPORTS
       ========================================= */

    loadSavedReports();

});


/* =====================================================
   LOCATION COORDINATES
   ===================================================== */

const reportLocations = {

    "cebu city": [10.3157, 123.8854],

    "cebu": [10.3157, 123.8854],

    "quezon city": [14.6760, 121.0437],

    "davao city": [7.1907, 125.4553],

    "davao": [7.1907, 125.4553],

    "iloilo": [10.7202, 122.5621],

    "iloilo city": [10.7202, 122.5621],

    "antipolo": [14.5864, 121.1758],

    "antipolo city": [14.5864, 121.1758],

    "manila": [14.5995, 120.9842],

    "makati": [14.5547, 121.0244]

};


/* Find coordinates from location */

function getCoordinates(location) {

    const cleanLocation =
        location.trim().toLowerCase();

    return reportLocations[cleanLocation] || null;
}


/* =====================================================
   COMMUNITY REPORT FORM
   ===================================================== */

const reportForm = document.getElementById("reportForm");

if (reportForm) {
    reportForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title =
            document.getElementById("reportTitle").value.trim();

        const category =
            document.getElementById("reportCategory").value;

        const location =
            document.getElementById("reportLocation").value.trim();

        const date =
            document.getElementById("reportDate").value;

        const description =
            document.getElementById("reportDescription").value.trim();

        const report = {
            id: "report-" + Date.now(),
            title: title,
            category: category,
            location: location,
            date: date,
            description: description,
            witnesses: 0
        };

        /* SAVE REPORT */
        const savedReports =
            JSON.parse(
                localStorage.getItem("bayanihan-community-reports")
            ) || [];

        savedReports.push(report);

        localStorage.setItem(
            "bayanihan-community-reports",
            JSON.stringify(savedReports)
        );

        /* ADD REPORT CARD */
        addReportCard(report);

        /* ADD REPORT TO GIS */
        addReportToMap(report);

        alert(
            "Thank you! Your community report has been recorded in this prototype."
        );

        reportForm.reset();
    });
}

function addReportCard(report) {

    const carousel =
        document.getElementById("reportsCarousel");

    if (!carousel) return;

    const card =
        document.createElement("article");

    card.className = "report-card";

    card.dataset.reportId = report.id;

    const formattedDate =
        new Date(report.date + "T00:00:00")
            .toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric"
            })
            .toUpperCase();

    card.innerHTML = `
        <div class="card-top">

            <span class="category-tag">
                ${report.category.toUpperCase()}
            </span>

            <span class="date">
                ${formattedDate}
            </span>

        </div>

        <h3>${report.title}</h3>

        <p class="location">
            📍 ${report.location}
        </p>

        <p>
            ${report.description}
        </p>

        <div class="card-bottom">

            <span class="community-label">
                Community Report
            </span>

            <div class="witness-section">

                <button
                    class="witness-button"
                    onclick="confirmReport(this)"
                >
                    I witnessed this
                </button>

                <div
                    class="witness-count"
                    data-count="0"
                >
                    <span class="witness-number">0</span>
                    <span class="witness-text">witnesses</span>
                </div>

            </div>

        </div>
    `;

    /*
        Insert the new report BEFORE
        the first "More reports" placeholder.
    */

    const placeholder =
        carousel.querySelector(".placeholder-card");

    if (placeholder) {
        carousel.insertBefore(card, placeholder);
    } else {
        carousel.appendChild(card);
    }

    /*
        Make the new report visible
        after submitting.
    */

    card.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
    });
}


/* =====================================================
   CREATE REPORT CARD
   ===================================================== */

function addReportCard(report) {

    const carousel =
        document.getElementById(
            "reportsCarousel"
        );


    if (!carousel) {
        return;
    }


    /* Create article */

    const card =
        document.createElement("article");

    card.className =
        "report-card";


    /* Format date */

    let formattedDate =
        report.date;


    if (report.date) {

        const dateObject =
            new Date(
                report.date + "T00:00:00"
            );

        formattedDate =
            dateObject.toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    day: "2-digit",
                    year: "numeric"
                }
            ).toUpperCase();

    }


    /* Category class */

    let categoryClass =
        report.category
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-");


    /* Create card HTML */

    card.innerHTML = `

        <div class="card-top">

            <span class="category-tag ${categoryClass}">
                ${report.category.toUpperCase()}
            </span>

            <span class="date">
                ${formattedDate}
            </span>

        </div>


        <h3>
            ${report.title}
        </h3>


        <p class="location">
            📍 ${report.location}
        </p>


        <p>
            ${report.description}
        </p>


        <div class="card-bottom">

            <span class="community-label">
                Community Report
            </span>


            <div class="witness-section">

                <button
                    class="witness-button"
                    onclick="confirmReport(this)"
                >
                    I witnessed this
                </button>


                <div
                    class="witness-count"
                    data-count="${report.witnesses || 0}"
                >

                    <span class="witness-number">
                        ${report.witnesses || 0}
                    </span>

                    <span class="witness-text">
                        ${report.witnesses === 1
                            ? "witness"
                            : "witnesses"}
                    </span>

                </div>

            </div>

        </div>

    `;


    /* Remove placeholder cards */

    const placeholders =
        carousel.querySelectorAll(
            ".placeholder-card"
        );


    if (placeholders.length > 0) {

        placeholders[0].remove();

    }


    /* Add new card */

    carousel.appendChild(card);

}


/* =====================================================
   LOAD SAVED REPORTS
   ===================================================== */

function loadSavedReports() {

    const savedReports =
        JSON.parse(
            localStorage.getItem(
                "bayanihan-community-reports"
            )
        ) || [];

    savedReports.forEach(function (report) {

        addReportCard(report);

        addReportToMap(report);

    });
}


/* =====================================================
   ADD COMMUNITY REPORT TO GIS
   ===================================================== */

function addReportToMap(report) {

    if (!map) return;

    const locationText =
        report.location.toLowerCase();

    let coordinates = null;

    if (locationText.includes("cebu")) {

        coordinates = [10.3157, 123.8854];

    } else if (locationText.includes("quezon city")) {

        coordinates = [14.6760, 121.0437];

    } else if (locationText.includes("davao")) {

        coordinates = [7.1907, 125.4553];

    } else if (locationText.includes("iloilo")) {

        coordinates = [10.7202, 122.5621];

    } else if (locationText.includes("antipolo")) {

        coordinates = [14.5860, 121.1760];

    } else if (locationText.includes("makati")) {

        coordinates = [14.5547, 121.0244];

    } else if (locationText.includes("manila")) {

        coordinates = [14.5995, 120.9842];

    }

    if (!coordinates) {
        console.log(
            "Location not recognized:",
            report.location
        );
        return;
    }

    const marker =
        L.marker(coordinates).addTo(map);

    marker.bindPopup(`
        <strong>Community Report</strong><br>
        ${report.title}<br>
        <small>📍 ${report.location}</small><br>
        <small>${report.date}</small>
    `);
}


/* =====================================================
   WITNESS CONFIRMATION
   ===================================================== */

function confirmReport(button) {

    const reportCard =
        button.closest(
            ".report-card"
        );


    const reportId =
        reportCard
            ? reportCard.innerText.trim()
            : "report-" + Math.random();


    const storageKey =
        "bayanihan-witness-" +
        reportId;


    const alreadyWitnessed =
        localStorage.getItem(
            storageKey
        );


    if (
        alreadyWitnessed ===
        "true"
    ) {

        return;

    }


    const countElement =
        button.parentElement
            .querySelector(
                ".witness-count"
            );


    const numberElement =
        countElement.querySelector(
            ".witness-number"
        );


    const textElement =
        countElement.querySelector(
            ".witness-text"
        );


    let count =
        parseInt(
            countElement.dataset.count ||
            "0"
        );


    count++;


    countElement.dataset.count =
        count;


    numberElement.textContent =
        count;


    if (count === 1) {

        textElement.textContent =
            "witness";

    } else {

        textElement.textContent =
            "witnesses";

    }


    button.classList.add(
        "confirmed"
    );


    button.textContent =
        "I WITNESSED THIS ✓";


    button.disabled =
        true;


    button.parentElement.classList.add(
        "has-witness"
    );


    localStorage.setItem(
        storageKey,
        "true"
    );


    localStorage.setItem(
        storageKey + "-count",
        count
    );

}


/* =====================================================
   LOAD WITNESS CONFIRMATIONS
   ===================================================== */

function loadWitnessConfirmations() {

    const buttons =
        document.querySelectorAll(
            ".witness-button"
        );


    buttons.forEach(
        function(button) {

            const reportCard =
                button.closest(
                    ".report-card"
                );


            if (!reportCard) {
                return;
            }


            const reportId =
                reportCard.innerText.trim();


            const storageKey =
                "bayanihan-witness-" +
                reportId;


            const alreadyWitnessed =
                localStorage.getItem(
                    storageKey
                );


            const savedCount =
                localStorage.getItem(
                    storageKey +
                    "-count"
                );


            const countElement =
                button.parentElement
                    .querySelector(
                        ".witness-count"
                    );


            const numberElement =
                countElement.querySelector(
                    ".witness-number"
                );


            const textElement =
                countElement.querySelector(
                    ".witness-text"
                );


            if (savedCount) {

                const count =
                    parseInt(
                        savedCount
                    );


                countElement.dataset.count =
                    count;


                numberElement.textContent =
                    count;


                textElement.textContent =
                    count === 1
                        ? "witness"
                        : "witnesses";

            }


            if (
                alreadyWitnessed ===
                "true"
            ) {

                button.classList.add(
                    "confirmed"
                );


                button.textContent =
                    "I WITNESSED THIS ✓";


                button.disabled =
                    true;


                button.parentElement.classList.add(
                    "has-witness"
                );

            }

        }
    );

}


/* =====================================================
   CAROUSEL
   ===================================================== */

function moveCarousel(
    carouselId,
    direction
) {

    const carousel =
        document.getElementById(
            carouselId
        );


    if (!carousel) {
        return;
    }


    const amount =
        carousel.clientWidth *
        0.75;


    carousel.scrollBy({

        left:
            direction *
            amount,

        behavior:
            "smooth"

    });

}


/* =====================================================
   LOAD WITNESSES AFTER PAGE LOAD
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadWitnessConfirmations();

    }
);


/* =====================================================
   CONTACT FORM
   ===================================================== */

const contactCategory =
    document.getElementById(
        "contactCategory"
    );

const otherConcernGroup =
    document.getElementById(
        "otherConcernGroup"
    );

const otherConcern =
    document.getElementById(
        "otherConcern"
    );


/*
   Show "Write your concern" only
   when the user selects Other.
*/

if (contactCategory) {

    contactCategory.addEventListener(
        "change",
        function() {

            if (
                contactCategory.value === "other"
            ) {

                otherConcernGroup.classList.remove(
                    "hidden"
                );

                otherConcern.required = true;

            } else {

                otherConcernGroup.classList.add(
                    "hidden"
                );

                otherConcern.required = false;

                otherConcern.value = "";

            }

        }
    );

}


/* =====================================================
   CONTACT FORM SUBMISSION
   ===================================================== */

const contactForm =
    document.getElementById(
        "contactForm"
    );


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            alert(
                "Thank you! Your concern has been recorded in this prototype."
            );

            contactForm.reset();

            otherConcernGroup.classList.add(
                "hidden"
            );

            otherConcern.required = false;

        }
    );

}


