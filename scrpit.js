const carousel = document.querySelector('.carousel');
let sliders = [];
let slideIndex = 0;

const createSlide = () => {
    if (slideIndex >= movies.length) {
        slideIndex = 0;
    }

    let slide = document.createElement('div');
    let imgElement = document.createElement('img');
    let content = document.createElement('div');
    let h1 = document.createElement('h1');
    let p = document.createElement('p');

    h1.textContent = movies[slideIndex].name;
    p.textContent = movies[slideIndex].des;
    imgElement.src = movies[slideIndex].image;

    content.appendChild(h1);
    content.appendChild(p);
    slide.appendChild(content);
    slide.appendChild(imgElement);
    carousel.appendChild(slide);

    slide.className = 'slider';
    content.className = 'slide-content';
    h1.className = 'movie-title';
    p.className = 'movie-des';

    sliders.push(slide);

    if (sliders.length > 1) {
        sliders[0].style.marginLeft = `calc(-${100 * (sliders.length - 1)}% - ${30 * (sliders.length - 1)}px)`;
    }

    slideIndex++;
};

for (let i = 0; i < 3; i++) {
    createSlide();
}

setInterval(() => {
    createSlide();
}, 3000);

// 🔍 SEARCH FUNCTIONALITY FIX (Auto Reload on Clear)
const searchInput = document.querySelector('.search-data');
const movieItems = document.querySelectorAll('.movie-items .column');
const movieContainer = document.querySelector('.movie-items');

searchInput.addEventListener('keyup', function () {
    let query = searchInput.value.toLowerCase();
    let visibleCount = 0;

    if (query === "") {
        location.reload(); // ✅ Reloads the page when search is cleared
        return;
    }

    movieItems.forEach(item => {
        let title = item.querySelector('h4').textContent.toLowerCase();
        if (title.includes(query)) {
            item.style.display = "block";
            visibleCount++;
        } else {
            item.style.display = "none";
        }
    });

    movieContainer.style.minHeight = visibleCount === 0 ? "100px" : "auto";
});
document.addEventListener("DOMContentLoaded", () => {
    const profileContainer = document.querySelector(".profile-container");

    profileContainer.addEventListener("click", () => {
        profileContainer.classList.toggle("active");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
        if (!profileContainer.contains(event.target)) {
            profileContainer.classList.remove("active");
        }
    });
});

function logout() {
    alert("Logged out successfully!");
    // Here, you can add actual logout functionality (like clearing session storage)
}





