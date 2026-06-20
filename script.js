import { db } from "./firebase.js";

import {
    doc,
    setDoc,
    getDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ======================
// GENERATE CODE
// ======================

function generateCode() {

    const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let code = "";

    for(let i = 0; i < 10; i++){

        code += chars.charAt(
            Math.floor(
                Math.random() *
                chars.length
            )
        );

    }

    return code;
}


// ======================
// CREATE PROPOSAL
// ======================

export async function createProposal(){

    const proposer =
    document.getElementById("proposer").value.trim();

    const partner =
    document.getElementById("partner").value.trim();

    if(!proposer || !partner){

        alert(
            "Please enter both names."
        );

        return;
    }

    const code =
    generateCode();

    const proposal = {

        proposer: proposer,

        partner: partner,

        date:
        new Date()
        .toLocaleDateString()

    };

    try{

        console.log(
            "Saving proposal..."
        );

        await setDoc(

            doc(
                db,
                "proposals",
                code
            ),

            proposal

        );

        console.log(
            "Saved successfully"
        );

        document
        .getElementById(
            "proposalResult"
        )
        .innerHTML =

        `
        <h3>Share This Code</h3>
        <h2>${code}</h2>
        `;

    }

    catch(error){

        console.error(error);

        alert(
            "Firebase Error:\n" +
            error.message
        );

    }

}


// ======================
// VERIFY PROPOSAL
// ======================

export async function verifyProposal(){

    const code =
    document
    .getElementById(
        "proposalCode"
    )
    .value
    .trim()
    .toUpperCase();

    if(!code){

        alert(
            "Please enter a code."
        );

        return;
    }

    try{

        const docRef =
        doc(
            db,
            "proposals",
            code
        );

        const docSnap =
        await getDoc(
            docRef
        );

        if(
            !docSnap.exists()
        ){

            alert(
                "Invalid Proposal Code"
            );

            return;
        }

        localStorage.setItem(

            "selectedProposal",

            JSON.stringify(
                docSnap.data()
            )

        );

        window.location.href =
        "certificate.html";

    }

    catch(error){

        console.error(error);

        alert(
            "Something went wrong:\n" +
            error.message
        );

    }

}


// ======================
// LOAD CERTIFICATE
// ======================

export function loadCertificate(){

    const proposalData =

    localStorage.getItem(
        "selectedProposal"
    );

    if(!proposalData){

        alert(
            "Proposal not found."
        );

        return;
    }

    const proposal =
    JSON.parse(
        proposalData
    );

    document
    .getElementById(
        "name1"
    )
    .textContent =
    proposal.proposer;

    document
    .getElementById(
        "name2"
    )
    .textContent =
    proposal.partner;

    document
    .getElementById(
        "date"
    )
    .textContent =
    "Date: " +
    proposal.date;

}


// ======================
// LOVE LETTER
// ======================

export function goToLoveLetter(){

    const song =
    document.getElementById(
        "loveSong"
    );

    if(song){

        song.pause();

    }

    window.location.href =
    "loveletter.html";

}


// ======================
// SLIDESHOW
// ======================

export function startSlideshow(){

    const slide =
    document.getElementById(
        "slide"
    );

    const song =
    document.getElementById(
        "loveSong"
    );

    if(!slide){

        return;

    }

    const photos = [

        "images/photo1.jpg",

        "images/photo2.jpg",

        "images/photo3.jpg",

        "images/photo4.jpg",

        "images/photo5.jpg",

        "images/photo6.jpg",

        "images/photo7.jpg"

    ];

    let current = 0;

    setInterval(() => {

        current++;

        if(
            current >=
            photos.length
        ){

            current = 0;

        }

        slide.src =
        photos[current];

    }, 3000);

    if(song){

        song.play()
        .catch(() => {

            console.log(
                "Autoplay blocked by browser"
            );

        });

        song.addEventListener(

            "ended",

            goToLoveLetter

        );

    }

}