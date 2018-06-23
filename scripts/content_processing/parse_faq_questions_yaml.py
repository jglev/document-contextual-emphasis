#!/usr/bin/python3
"""Parse a yaml list into an HTML list of links.

Description:
  Parse yaml with the format
      - question-code: "Question text"
  into
      <ul class="list">
        <li><a class="question" question-id="question-code" href="">Question text</a></li>
      </ul>

Date:
  2018

Author:
  Jacob Levernier, University of Pennsylvania Libraries

Usage:
  cat yaml_file | this_script.py <input>
"""

import yaml


def translate_yaml_into_faq_question_list(yaml_string):
    # with open('faq_questions_list.html', 'r') as questions_file:
    #     questions_yaml = yaml.safe_load(questions_file)
    questions_yaml = yaml.safe_load(yaml_string)

    output_string = '<ul class="list">'

    for line in questions_yaml:
        for question_key in line:
            output_string = output_string + (
                    f'\n<li><a class="question" question-id="{question_key}"'
                    f' href="">{line[question_key]}</a></li>')

    output_string = output_string + '\n</ul>'
    # print(output_string)

    return output_string

if __name__ == '__main__':
    # arguments = docopt(__doc__, version='0.0.1')
    import sys
    string_to_parse = '\n'.join(sys.stdin.readlines())
    print(translate_yaml_into_faq_question_list(string_to_parse))
