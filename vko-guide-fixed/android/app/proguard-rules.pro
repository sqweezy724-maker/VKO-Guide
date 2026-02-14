# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see:
#   http://developer.android.com/guide/developing/tools/proguard.html

# Keep TWA / androidbrowserhelper classes
-keep class com.google.androidbrowserhelper.** { *; }

# Keep AndroidX classes used at runtime
-keep class androidx.core.content.FileProvider { *; }

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface class:
# -keepclassmembers class fqcn.of.javascript.interface.for.webview {
#    public *;
# }
