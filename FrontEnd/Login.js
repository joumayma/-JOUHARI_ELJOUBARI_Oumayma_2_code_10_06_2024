document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("mail");
  const passwordInput = document.getElementById("password");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.token) {
          // Stocker le token dans le localStorage
          localStorage.setItem("authToken", data.token);

          console.log(localStorage.getItem("authToken"));
          // Rediriger vers la page d'accueil
          window.location.href = "index.html";
        } else {
          alert(
            "Les informations d'identification sont incorrectes. Veuillez réessayer."
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Une erreur est survenue. Veuillez réessayer.");
      });
  });
});
