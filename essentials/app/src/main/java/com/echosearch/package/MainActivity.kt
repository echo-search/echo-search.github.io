val query = intent.getStringExtra("query")
if (query != null) {
    performSearch(query)
}
