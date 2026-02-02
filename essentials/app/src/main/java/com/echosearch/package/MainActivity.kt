package com.echosearch.app

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // setContentView(R.layout.activity_main) // uncomment and set your layout

        val query = intent.getStringExtra("query")
        if (query != null) {
            performSearch(query)
        }
    }

    // Minimal placeholder — replace with your real search implementation
    fun performSearch(query: String) {
        // TODO: implement actual search behavior: update UI / call search API / show results
    }
}
