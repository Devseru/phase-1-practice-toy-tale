document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const toyFormContainer = document.querySelector(".container");
  const addBtn = document.querySelector("#new-toy-btn");
  const form = document.querySelector(".add-toy-form");

  // Function to create a toy card
  function createToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;
    toyCollection.appendChild(card);

    // Add event listener to the like button
    const likeBtn = card.querySelector(".like-btn");
    likeBtn.addEventListener("click", () => {
      updateLikes(toy.id, toy.likes + 1);
    });
  }

  // Function to fetch toys from the server and render them
  function fetchToys() {
    fetch("http://localhost:4000/toys")
      .then(response => response.json())
      .then(toys => {
        toyCollection.innerHTML = ""; // Clear existing toys
        toys.forEach(toy => createToyCard(toy));
      })
      .catch(error => console.error("Error fetching toys:", error));
  }

  // Function to add a new toy
  function addToy(name, image) {
    fetch("http://localhost:4000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        name: name,
        image: image,
        likes: 0
      })
    })
      .then(response => response.json())
      .then(toy => createToyCard(toy))
      .catch(error => console.error("Error adding toy:", error));
  }

  // Function to update the likes of a toy
  function updateLikes(toyId, newLikes) {
    fetch(`http://localhost:4000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
      .then(response => response.json())
      .then(toy => {
        const card = document.getElementById(toy.id).parentElement;
        card.querySelector("p").textContent = `${toy.likes} Likes`;
      })
      .catch(error => console.error("Error updating likes:", error));
  }

  // Event listener for the form submission
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const image = event.target.image.value;
    addToy(name, image);
    form.reset();
    toyFormContainer.style.display = "none"; // Hide the form
    addBtn.textContent = "Add a new toy!"; // Reset button text
    addToy = false; // Toggle form state
  });

  // Event listener for the add new toy button
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
      addBtn.textContent = "Hide form";
    } else {
      toyFormContainer.style.display = "none";
      addBtn.textContent = "Add a new toy!";
    }
  });

  // Fetch toys on page load
  fetchToys();
});
