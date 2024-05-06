document.addEventListener('DOMContentLoaded', function() {
    fetchRandomMeal();
    document.getElementById('searchButton').addEventListener('click', function() {
        let searchTerm = document.getElementById('searchBar').value;
        searchMeals(searchTerm);
    });
});

function fetchRandomMeal() {
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => displayRandomMeal(data.meals[0]))
        .catch(error => console.error('Error fetching random meal:', error));
}

function displayRandomMeal(meal) {
    let randomMealSection = document.getElementById('randomMealSection');
    randomMealSection.innerHTML = `
        <div class="meal-item" onclick="showIngredientsModal('${meal.idMeal}')">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width: 200px; height: 200px;">
            <p>${meal.strMeal}</p>
        </div>
    `;
}

function searchMeals(category) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then(response => response.json())
        .then(data => displayMealList(data.meals))
        .catch(error => console.error('Error searching meals:', error));
}

function displayMealList(meals) {
    let mealListSection = document.getElementById('mealListSection');
    let mealList = document.getElementById('mealList');
    mealList.innerHTML = ''; // Clear previous results

    meals.forEach(meal => {
        mealList.innerHTML += `
            <div class="meal-item" onclick="showIngredientsModal('${meal.idMeal}')">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width: 200px; height: 200px;">
                <p>${meal.strMeal}</p>
            </div>
        `;
    });

    mealListSection.style.display = 'block';
}

function showIngredientsModal(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => {
            let meal = data.meals[0];
            let ingredientsList = document.getElementById('ingredientsList');
            let mealImage = document.getElementById('mealImage');
            ingredientsList.innerHTML = ''; // Clear previous ingredients
            mealImage.innerHTML = `
            <div class="image-container">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <p>${meal.strMeal}</p>
                </div>
            `;
            for (let i = 1; i <= 20; i++) {
                if (meal[`strIngredient${i}`]) {
                    ingredientsList.innerHTML += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
                }
            }

            let modal = document.getElementById('ingredientsModal');
            modal.style.display = 'block';

            let closeBtn = document.getElementsByClassName('close')[0];
            closeBtn.onclick = function() {
                modal.style.display = 'none';
            }
        })
        .catch(error => console.error('Error fetching meal ingredients:', error));
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
    let modal = document.getElementById('ingredientsModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}