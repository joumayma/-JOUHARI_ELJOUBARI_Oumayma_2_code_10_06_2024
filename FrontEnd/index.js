async function fetchWorks() {
  try {
    const fetchWorks = await fetch("http://localhost:5678/api/works");

    if (!fetchWorks.ok) {
      throw new Error("il y a un soucis avec l'API");
    }
    const works = await fetchWorks.json();
    console.log("affichage des données : ");
    return works;
  } catch (error) {
    console.error("*", error.message);
    return null;
  }
}

async function fetchCategories() {
  try {
    const fetchCategories = await fetch("http://localhost:5678/api/categories");
    if (!fetchCategories.ok) {
      throw new Error("il y a un soucis avec l'API");
    }
    const categories = await fetchCategories.json();
    console.log("affichage des données : ");
    return categories;
  } catch (error) {
    console.error("*", error.message);
    return null;
  }
}

async function displayWorks() {
  let works = null;
  await fetchWorks().then((data) => {
    if (data) {
      works = data;
      console.log("works :", works);
    }
  });

  const gallery = document.querySelector(".gallery");
  const modalGallery = document.querySelector(".modale-gallery");
  gallery.innerHTML = "";
  modalGallery.innerHTML = "";
  works.forEach((work) => {
    /// Gallery
    const figure = document.createElement("figure");
    figure.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}" />
      <figcaption>${work.title}</figcaption>
    `;
    gallery.appendChild(figure);

    // Modale Gallery
    const modalFigure = document.createElement("figure");
    const deleteLink = document.createElement("a");
    deleteLink.className = "modale-icon icon-delete";
    deleteLink.href = "#";
    deleteLink.innerHTML = `<img src="./assets/icons/Trash.png" srcset="./assets/icons/Trash@2x.png 2x" alt="Delete">`;
    deleteLink.addEventListener("click", async function (event) {
      event.preventDefault();
      // delete image function
      deleteImage(work.id);
    });

    // Append elements directly
    modalFigure.appendChild(deleteLink);
    // Append deleteLink and other elements to modalFigure
    modalFigure.appendChild(deleteLink);
    const imgElement = document.createElement("img");
    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;
    modalFigure.appendChild(imgElement);

    const figcaption = document.createElement("figcaption");
    const editLink = document.createElement("a");
    editLink.href = "#";
    editLink.textContent = "éditer";
    figcaption.appendChild(editLink);
    modalFigure.appendChild(figcaption);

    // Add event listener after appending

    modalGallery.appendChild(modalFigure);
  });
}

displayWorks();
displayCategories();
async function displayCategories(works) {
  let categories = null;
  await fetchCategories().then((data) => {
    if (data) {
      categories = data;
      console.log("categories:", categories);
    }
  });

  const categoryButtons = document.getElementById("filters");
  const allButton = document.createElement("allButton");
  allButton.innerHTML = `
    <a href="#allButton"><span id="allButton">Tous</span></a>
  `;
  allButton.addEventListener("click", () => displayWorks(works));

  categoryButtons.appendChild(allButton);

  const formSelectCategory = document.getElementById("category");
  formSelectCategory.innerHTML = "<option></option>";

  categories.forEach((category) => {
    const filterButton = document.createElement("filterButton");
    filterButton.innerHTML = `
      <a href="#filterButton${category.id}"><span id="button${category.id}">${category.name}</span></a>
    `;

    filterButton.addEventListener("click", () =>
      displayWorks(works.filter((work) => work.categoryId == category.id))
    );
    categoryButtons.appendChild(filterButton);

    // Image Form Categories

    formSelectCategory.innerHTML += `
      <option value="${category.id}">${category.name}</option>
    `;
  });
}

//modale//
document.addEventListener("DOMContentLoaded", (event) => {
  // Sélectionner les éléments de la modale
  const modale = document.querySelector(".modale");
  const openModaleBtn = document.querySelector(".modify");
  const closeModaleBtn = document.querySelector(".close-button");
  const backButton = document.querySelector(".back-button");

  // Ouvrir la modale
  openModaleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modale.classList.remove("hidden");
  });
  // Fermer la modale
  closeModaleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modale.classList.add("hidden");
  });

  // Fermer la modale en cliquant en dehors du contenu de la modale
  window.addEventListener("click", (e) => {
    if (e.target === modale) {
      modale.classList.add("hidden");
    }
  });
  document.querySelector(".add-button").addEventListener("click", function () {
    document.querySelector(".modale-addphoto").classList.remove("hidden");
    document.querySelector(".modale-main").classList.add("hidden");
  });

  let file = null;

  document
    .getElementById("image")
    .addEventListener("change", async function (event) {
      file = event.target.files[0]; // Obtenir le premier fichier sélectionné
      document.querySelector(".image-unselected").classList.add("hidden");
      document.querySelector(".image-selected").src = URL.createObjectURL(file);
      document.querySelector(".image-selected").classList.remove("hidden");
    });

  document
    .getElementById("addphoto-form")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      // Obtenir le premier fichier sélectionné

      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", document.getElementById("title").value);
        formData.append("category", document.getElementById("category").value);
        console.log("Bearer " + localStorage.getItem("authToken"));
        const response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("authToken"),
            accept: "application/json",
          },
          body: formData,
        });

        if (response.ok) {
          const storedImage = await response.json();
          console.log("store ok", storedImage);
          displayWorks();
        } else {
          console.log("store ko", file);
          console.log(response);
        }
      } else {
        document.getElementById("file-info").innerHTML =
          "Aucun fichier sélectionné.";
      }
    });
});
function displayWorksModale() {
  // Récupère dans le DOM l'emplacement de la gallerie
  const modaleGalleryElem = document.querySelector(".modale-gallery");
  // Efface le contenu de la gallerie de la modale
  modaleGalleryElem.innerHTML = "";

  // Crée dans le DOM les cards et ajoute les petits icones déplacement (pour le 1er élément) et suppression
  works.forEach(function (work, index) {
    const figureElem = document.createElement("figure");

    // Crée l'image du projet
    const imageElem = document.createElement("img");
    imageElem.crossOrigin = "anonymous";
    imageElem.src = work.imageUrl;
    imageElem.alt = work.title;
    figureElem.appendChild(imageElem);

    if (index === 0) {
      // Ajoute l'icône se déplacer pour le premier projet de la liste.
      const aMoveElem = document.createElement("a");
      aMoveElem.href = "#";
      aMoveElem.classList.add("modale-icon", "icon-move");

      const imageIconMoveElem = document.createElement("img");
      imageIconMoveElem.src = "./assets/icons/Move.png";
      imageIconMoveElem.srcset = "./assets/icons/Move@2x.png 2x";
      aMoveElem.appendChild(imageIconMoveElem);
      figureElem.appendChild(aMoveElem);
    }

    // Ajoute l'icône de la suppression du projet
    const aDeleteElem = document.createElement("a");
    aDeleteElem.addEventListener("click", function (event) {
      event.preventDefault();
      deleteWork(work.id, index).then((success) => {
        if (success) {
          // Rafraichit l'affichage de la modale et de la gallerie
          displayWorks();
          displayWorksModale();
        }
      });
    });
    aDeleteElem.href = "#";
    aDeleteElem.classList.add("modale-icon", "icon-delete");

    const imageIconDeleteElem = document.createElement("img");
    imageIconDeleteElem.src = "./assets/icons/Trash.png";
    imageIconDeleteElem.srcset = "./assets/icons/Trash@2x.png 2x";
    aDeleteElem.appendChild(imageIconDeleteElem);
    figureElem.appendChild(aDeleteElem);

    // Ajoute un lien d'édition non fonctionnel
    const figcaptionElem = document.createElement("figcaption");
    const aFigcaptionElem = document.createElement("a");
    aFigcaptionElem.href = "#";
    aFigcaptionElem.innerText = "éditer";
    figcaptionElem.appendChild(aFigcaptionElem);
    figureElem.appendChild(figcaptionElem);

    modaleGalleryElem.appendChild(figureElem);
  });
}

// Image delete function by id
async function deleteImage(id) {
  console.log("Deletion of the image");
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("authToken"),
      accept: "application/json",
    },
  });
  // Handle response if needed

  if (response.ok) {
    console.log("delete ok");
    displayWorks();
  } else {
    console.log("delete ko");
    console.log(response);
  }
}
