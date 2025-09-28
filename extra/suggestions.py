# We need 3000 unique suggestions. The file only had ~1827 and after filtering ~1768 remain.
# We'll expand by generating synthetic but valid, non-duplicate, non-location/time suggestions.

needed = 3000 - len(unique)

# Strategy: Generate new suggestions based on combinatorial expansion of categories and actions.
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

# Generate combinations
generated = []
for c in categories:
    for a in actions:
        phrase = f"advanced {c.lower()} {a}"
        if phrase not in unique:
            generated.append(phrase)
        if len(generated) >= needed:
            break
    if len(generated) >= needed:
        break

# Merge back
final_suggestions = unique + generated[:needed]

len(final_suggestions)
