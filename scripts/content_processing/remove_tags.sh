#!/bin/bash

# This script expects one argument: a filename from which to remove tags (of the form '(tag( ... )tag)'.

# Remove all tags of the form "<#tag>" and "</#tag>"
cat "$1" | \
perl -p -e 's|(?<!(?<!\\)\\)<[^\/]?#([^\s#]*)>||g' | \
perl -p -e 's|(?<!(?<!\\)\\)<\/#([^\s#]*)>||g'
