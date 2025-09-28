# Step 1: Load existing suggestions
with open("suggestions.json", "r") as f:
    unique = [line.strip() for line in f if line.strip()]

# Step 2: Calculate how many more are needed
needed = 3000 - len(unique)

# Step 3: Define categories and actions
categories = [
    "AI", "anime", "apps", "books", "career", "coding", "comics", "design",
    "education", "fashion", "films", "fitness", "food", "gaming", "history",
    "language", "literature", "math", "music", "mythology", "philosophy",
    "photography", "poetry", "psychology", "science", "sports", "technology",
    "theatre", "writing", "art", "culture", "logic", "rhetoric", "debate",
    "programming", "engineering", "medicine", "law", "business", "economics"
]

actions = [
    "guides", "hacks", "lessons", "projects", "skills", "stories", "tips", "trends",
    "examples", "frameworks", "strategies", "principles", "tutorials", "insights",
    "methods", "patterns", "concepts", "tools", "experiments", "formulas"
]

# Step 4: Generate new suggestions
generated = []
existing_set = set(unique)

for c in categories:
    for a in actions:
        phrase = f"advanced {c.lower()} {a}"
        if phrase not in existing_set:
            generated.append(phrase)
            if len(generated) >= needed:
                break
    if len(generated) >= needed:
        break

# Step 5: Merge and save
final_suggestions = unique + generated[:needed]

with open("suggestions1.json", "w") as f:
    for suggestion in final_suggestions:
        f.write(suggestion + "\n")

print(f"✅ Done! Total suggestions: {len(final_suggestions)}")
