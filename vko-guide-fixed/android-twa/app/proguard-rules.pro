# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.

# Keep TWA / androidbrowserhelper classes
-keep class com.google.androidbrowserhelper.** { *; }

# Keep AndroidX classes used at runtime
-keep class androidx.core.content.FileProvider { *; }
