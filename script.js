const data = [
    {
        titre: "Créer un CV professionnel",
        description: "Guide pour créer un bon CV.",
        mot: "cv"
    },
    {
        titre: "Formations gratuites",
        description: "Découvrir des ressources pour apprendre.",
        mot: "formation"
    },
    {
        titre: "Programmation web",
        description: "Apprendre HTML, CSS et JavaScript.",
        mot: "code"
    }
];

function search() {
    let query = document.getElementById("search").value.toLowerCase();
    let result = document.getElementById("result");

    let found = data.filter(item => 
        item.mot.includes(query)
    );

    if(found.length > 0) {
        result.innerHTML = found.map(item =>
            `<h3>${item.titre}</h3>
             <p>${item.description}</p>`
        ).join("");
    } else {
        result.innerHTML = "Aucun résultat trouvé";
    }
                                     }
