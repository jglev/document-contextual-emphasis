#!/bin/bash

# This script expects two arguments:
# 
# 1. A markdown file to parse and place in a larger context of files.
# 2. A YAML file defining FAQ shortcodes and text.
# 
# Example usage:
# scripts/content_processing/compile_faq_with_screen_reader_text.sh examples/example_markdown.md examples/faq_questions_list.yaml

html_wrapper_location="html_wrappers"
scripts_location="scripts/content_processing"

echo -e \
"$(cat "$html_wrapper_location/standalone_page_opening_html.html")" \
"\n"\
"$(cat "$html_wrapper_location/list_of_questions_opening_html.html")" \
"\n"\
"$(cat "$2" | "$scripts_location/parse_faq_questions_yaml.py")" \
"\n"\
"$(cat "$html_wrapper_location/list_of_questions_closing_html.html")" \
"\n"\
"$(cat "$html_wrapper_location/tagged_content_opening_html.html")" \
"\n"\
"$(cat "$1" | "$scripts_location/parse_markdown_faq_tags.py" | pandoc -f markdown -t html)" \
"\n"\
"$(cat "$html_wrapper_location/tagged_content_closing_html.html")" \
"\n"\
"$(cat "$html_wrapper_location/standalone_page_closing_html.html")"
