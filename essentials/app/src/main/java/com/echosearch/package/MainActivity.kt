package com.echosearch.app

import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val webView = WebView(this)
        setContentView(webView)

        val settings: WebSettings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.userAgentString =
            settings.userAgentString + " EchoSearchApp"

        webView.webViewClient = WebViewClient()

        val query = intent.getStringExtra("query")

        if (query != null) {
            webView.loadUrl(
                "https://echo-search.github.io/#gsc.tab=0&gsc.q=$query&gsc.sort="
            )
        } else {
            webView.loadUrl(
                "https://echo-search.github.io"
            )
        }
    }
}
