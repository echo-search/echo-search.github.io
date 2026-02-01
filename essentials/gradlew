#!/usr/bin/env sh

##############################################################################
# Gradle start up script for UN*X
##############################################################################

APP_NAME="Gradle"
APP_BASE_NAME=`basename "$0"`

DEFAULT_JVM_OPTS=""

MAX_FD="maximum"

warn () {
    echo "$*"
}

die () {
    echo
    echo "$*"
    echo
    exit 1
}

OS=`uname`
case "$OS" in
  CYGWIN* ) CYGWIN=true ;;
  Darwin* ) DARWIN=true ;;
  MINGW* ) MSYS=true ;;
esac

CLASSPATH=$APP_HOME/gradle/wrapper/gradle-wrapper.jar

exec java $DEFAULT_JVM_OPTS -classpath "$CLASSPATH" org.gradle.wrapper.GradleWrapperMain "$@"
