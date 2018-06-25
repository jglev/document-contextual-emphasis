#!/bin/bash

# Render all 
# 
# This script does not expect any arguments. Settings can be changed below, in the "Settings" section.
# 
# The script will use markdown (*.md) files in introduction_directory and then content_directory in alphabetical order within
# each of those directories.
# 
# Example usage:
# scripts/content_processing/compile_faq_with_screen_reader_text.sh > example_rendered.html

# Settings --------------------------------------------------------------------------------

html_wrapper_location="html_wrappers"
scripts_location="scripts/content_processing"
introduction_directory="content/non-tagged_introduction_sections"
content_directory="content/tagged_document_sections"
yaml_file="content/faq_questions_list.yaml"

# Processing steps ------------------------------------------------------------------------

set -e  # Immediately exit and give an error if anything fails.

echo -e \
"$(cat "$html_wrapper_location/standalone_page_opening_html.html")" \
"\n"\
"$(cat "$html_wrapper_location/list_of_questions_opening_start_html.html")" \
"\n"\
"$(cat "$introduction_directory/"*.md | pandoc -f markdown -t html)" \
"\n"\
"$(cat "$html_wrapper_location/list_of_questions_opening_end_html.html")" \
"\n"\
"$(cat "$yaml_file" | python3.6 "$scripts_location/parse_faq_questions_yaml.py")" \
"\n"\
"$(cat "$html_wrapper_location/list_of_questions_closing_html.html")" \
"\n"\
"$(cat "$html_wrapper_location/tagged_content_opening_html.html")" \
"\n"\
"$(cat "$content_directory/"*.md | python3.6 "$scripts_location/parse_markdown_faq_tags.py" | pandoc -f markdown -t html)" \
"\n"\
"$(cat "$html_wrapper_location/tagged_content_closing_html.html")" \
"\n"\
"$(cat "$html_wrapper_location/standalone_page_closing_html.html")"
