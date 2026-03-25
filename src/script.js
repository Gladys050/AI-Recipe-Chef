const form = document.querySelector("#recipe-form");
const recipeOutput = document.querySelector("#recipe-output");
const recipeContent = document.querySelector("#recipe-content");

function showGenerating(dish) {
  recipeOutput.classList.remove("hidden");
  recipeContent.innerHTML = `
    <div class="generating">
      <div class="spinner"></div>
      Cooking up a recipe for "${dish}"…
    </div>`;
}

function displayRecipe(response) {
  const raw = response.data.answer;

  // Clean up HTML fences if AI wraps in ```html ... ```
  const cleaned = raw
    .replace(/```html/gi, "")
    .replace(/```/g, "")
    .trim();

  recipeContent.innerHTML = cleaned;
}

function generateRecipe(event) {
  event.preventDefault();

  const dish = document.querySelector("#dish-name").value.trim();
  const ingredients = document.querySelector("#ingredients").value.trim();
  const dietary = document.querySelector("#dietary").value;

  const apiKey = "a880btbb9f646f5672ca3c2bc8e4o564";

  const context = `You are an expert chef and recipe writer. 
When given a dish and optional ingredients or dietary preferences, you generate a clear, delicious recipe.
Always respond with valid HTML using EXACTLY this structure — no extra commentary, no markdown fences:

<h2>[Recipe Title]</h2>
<div class="meta">
  <span>⏱ [Prep + Cook time]</span>
  <span>🍽 [Servings]</span>
  <span>🔥 [Difficulty: Easy / Medium / Hard]</span>
</div>

<h3>🛒 Ingredients</h3>
<ul>
  <li>[ingredient 1]</li>
  <li>[ingredient 2]</li>
  ...
</ul>

<h3>👨‍🍳 Steps</h3>
<ol>
  <li>[Step 1]</li>
  <li>[Step 2]</li>
  ...
</ol>

<div class="tip"><strong>💡 Chef's Tip:</strong> [One useful tip]</div>

Respond ONLY with this HTML. No extra text before or after.`;

  let prompt = `Generate a recipe for: ${dish}.`;
  if (ingredients)
    prompt += ` I have these ingredients available: ${ingredients}.`;
  if (dietary) prompt += ` Dietary preference: ${dietary}.`;

  const apiUrl = `https://api.shecodes.io/ai/v1/generate?prompt=${encodeURIComponent(prompt)}&context=${encodeURIComponent(context)}&key=${apiKey}`;

  showGenerating(dish);

  const submitBtn = document.querySelector(".submit-btn");
  submitBtn.disabled = true;

  axios
    .get(apiUrl)
    .then(displayRecipe)
    .catch(() => {
      recipeContent.innerHTML = `<p style="color:#c8500a; text-align:center; padding: 20px 0;">
        ⚠️ Something went wrong. Please check your API key or try again.
      </p>`;
    })
    .finally(() => {
      submitBtn.disabled = false;
    });
}

form.addEventListener("submit", generateRecipe);
