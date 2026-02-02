package com.echosearch.app

import android.content.Intent
import android.os.Bundle
import android.speech.RecognizerIntent
import androidx.appcompat.app.AppCompatActivity

class VoiceSearchActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(
                RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                RecognizerIntent.LANGUAGE_MODEL_FREE_FORM
            )
            putExtra(RecognizerIntent.EXTRA_PROMPT, "Search EchoSearch")
        }

        startActivityForResult(intent, 1)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == 1 && resultCode == RESULT_OK) {
            val query = data
                ?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)
                ?.firstOrNull()

            if (query != null) {
                val searchIntent = Intent(this, MainActivity::class.java)
                searchIntent.putExtra("query", query)
                startActivity(searchIntent)
            }
        }
        finish()
    }
}
