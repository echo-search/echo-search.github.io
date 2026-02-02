package com.echosearch.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews

class EchoSearchWidget : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (id in appWidgetIds) {
            val views = RemoteViews(
                context.packageName,
                R.layout.echosearch_widget
            )

            val openAppIntent =
                Intent(context, MainActivity::class.java).apply {
                    putExtra("query", "")
                }

            val openAppPI = PendingIntent.getActivity(
                context, 0, openAppIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val micIntent = Intent(context, VoiceSearchActivity::class.java)
            val micPI = PendingIntent.getActivity(
                context, 1, micIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            views.setOnClickPendingIntent(R.id.widget_root, openAppPI)
            views.setOnClickPendingIntent(R.id.mic, micPI)

            appWidgetManager.updateAppWidget(id, views)
        }
    }
}
