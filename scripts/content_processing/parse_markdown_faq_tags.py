#!/usr/bin/python3.6.5
"""Parse markdown for a command shortcode

Description:
  Parse markdown with the command shortcode
      <#name-of-question> ... </#name-of-question>
  into
      <span relevant-to-question="name-of-question"> ... </span>
  This is intended to be an algorithm proof-of-concept.

Date:
  2018

Author:
  Jacob Levernier, University of Pennsylvania Libraries

Usage:
  cat markdown_file | this_script.py <input>
"""

# from docopt import docopt
import re

# Note that these are also coded in several places below:
# You can find them by searching this file for "# Tag definition"
opening_regex = re.compile(
        '(?<!(?<!\\\)\\\)<[^\/]?#([^\s#]*)>')  # <$example>  # Tag definition
closing_regex = re.compile(
        '(?<!(?<!\\\)\\\)<\/#([^\s#]*)>')  # </#example>  # Tag definition

# =============================================================================
# example_text = '''<#scope-of-policy> This is Markdown.
# <#law-enforcement>
#
# ### A third-level heading.
#
# <#law-enforcement> A list of items: </#law-enforcement>
#
# - <#types-of-data> List item 1 </#types-of-data>
# - List item 2, </#law-enforcement> with additional content, </#scope-of-policy> and more.
# - List item 3, <#partial-line> with a </#partial-line> [link](https://google.com).'''
# =============================================================================

# Note the for fstrings below, to print literal curly braces, they need to be
# doubled up, per https://stackoverflow.com/a/5466478


def opening_key_present(key, string_to_search_through):
    return re.search(
                f'(?<!(?<!\\\)\\\)<[^\/]?#{key}>',  # Tag definition
                string_to_search_through)


def closing_key_present(key, string_to_search_through):
    return re.search(
                f'(?<!(?<!\\\)\\\)<\/#{key}>',  # Tag definition
                string_to_search_through)


def replace_opening_key(key, string_to_search_through):
    output = re.sub(
                f'(?<!(?<!\\\)\\\)<[^\/]?#{key}>',  # Tag definition
                fr'<span data-relevant-to-question="{key}" markdown=1>',
                string_to_search_through)
    return output


def replace_closing_key(key, string_to_search_through):
    output = re.sub(
                f'(?<!(?<!\\\)\\\)<\/#{key}>',  # Tag definition
                fr'</span><!-- {key} -->',
                string_to_search_through)
    return output


def parse_markdown_for_question_tags(string):
    string_list = string.split('\n')

    # See https://stackoverflow.com/a/14819189/1940466:
    opening_tags_unformatted = [[re.findall(opening_regex, x), i] for i, x
                                in enumerate(string_list)
                                if re.search(opening_regex, x)]

    opening_tags = []
    for tag_line in opening_tags_unformatted:
        for tag in tag_line[0]:
            opening_tags.append([tag, tag_line[1]])

    closing_tags_unformatted = [[re.findall(closing_regex, x), i] for i, x
                                in enumerate(string_list)
                                if re.search(closing_regex, x)]

    closing_tags = []
    for tag_line in closing_tags_unformatted:
        for tag in tag_line[0]:
            closing_tags.append([tag, tag_line[1]])

    opening_tag_names = list(set([line[0] for line in opening_tags]))

    start_and_closing_lines_of_tags = {}

    for tag in opening_tag_names:
        opening_lines_for_tag = [line[1] for line in opening_tags
                                 if line[0] == tag]
        closing_lines_for_tag = [line[1] for line in closing_tags
                                 if line[0] == tag]
        start_and_closing_lines_of_tags[tag] = [
                x for x in zip(opening_lines_for_tag, closing_lines_for_tag)]

    for key, value_lists in start_and_closing_lines_of_tags.items():
        for value_list in value_lists:
            range_of_line_numbers = range(value_list[0], value_list[1] + 1)
            for line_number in range_of_line_numbers:
                # if opening_key_present(key, string_list[line_number]):
                if string_list[line_number] != "":
                    if line_number == range_of_line_numbers[0]:
                        string_list[line_number] = replace_opening_key(
                                key, string_list[line_number])
                    else:
                        string_list[line_number] = re.sub(
                                r'^([-+*0-9#=]*\.{0,1}\s)*',
                                # Explanation of the regex above:
                                # -,+,*: Unordered lists
                                # [0-9]*\.: Ordered lists
                                # \#,=,-: Headings
                                (fr'\1<span data-relevant-to-question="{key}" '
                                 fr'markdown=1>'),
                                string_list[line_number])

                    # if closing_key_present(key, string_list[line_number]):
                    if line_number == range_of_line_numbers[-1]:
                        string_list[line_number] = replace_closing_key(
                                key, string_list[line_number])
                    else:
                        string_list[line_number] = re.sub(
                                f'$',
                                fr'</span><!-- {key} -->',
                                string_list[line_number])

    return '\n'.join(string_list)

if __name__ == '__main__':
    # arguments = docopt(__doc__, version='0.0.1')
    import sys
    string_to_parse = ''.join(sys.stdin.readlines())
    print(parse_markdown_for_question_tags(string_to_parse))
