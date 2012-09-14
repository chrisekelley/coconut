#!/bin/bash
echo 
echo "************"
echo "Uninstalling"
echo "************"
adb uninstall com.couchbase.callback
echo
echo "**********"
echo "Installing"
echo "**********"
adb install bin/Coconut-debug.apk
echo
echo "**********"
echo "Backing up to $HOME/$BACKUP"
echo "**********"

#adb shell am start -n com.couchbase.callback/.AndroidCouchbaseCallback
