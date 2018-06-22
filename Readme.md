# Policy documents + Transformation Scripts

## Contents

This repository contains the following files:

- top directory:
	- Example Markdown files, which can be rendered by GitLab CI to PDF, HTML, DOCX, etc. -- if with HTML, incorporating a built-in FAQ using the files further below:
		- `about-page.md`
		- `data-practices.md`
		- `privacy-policy.md`
	- HTML wrapper files, used in the scripts below:
		- HTML to wrap searchable FAQ lists:
			- `list_of_questions_closing_html.html`
			- `list_of_questions_opening_html.html`
		- HTML to wrap policy documents, making a section screen-reader friendly:
			- `policy_content_closing_html.html`
			- `policy_content_opening_html.html`
	- `faq_questions_list.yaml`: A list of the shortcodes and corresponding text for each question in the built-in FAQ that the scripts further below can render. These questions will be rendered into a searchable list by `parse_faq_questions_yaml.py`.
	- `.gitlab-ci.yml`: An example command file for GitLab Continuous Integration (CI). The example defines three jobs:
		- `build_pdf_and_docx`: On each commit to the master branch, find all Markdown (`.md`) files, and convert each into both DOCX and PDF formats. Save the results for 100 years (As of this writing, GitLab CI does not seem to have an option for saving forever, so we've used an arbitrary large number here).
		- `build_misc_html`: On each commit to the master branch, find the file `about-page.md`, parse it using the FAQ system provided in `./scripts/parse_markdown_faq_tags.py`, and export an HTML file. Save the results for 100 years.
		- `build_html_with_faq`: On each commit to the master branch, find the files `privacy-policy.md` and `data-practices.md`, parse each using the FAQ system provided in `./scripts/parse_markdown_faq_tags.py`, and export an HTML file for each. Save the results for 100 years.
- `examples`:
	- `example_markdown.md`: An example markdown file showing FAQ tagging markup, using the syntax `<#tag>...</#tag>` (See ["Use"](#use) below.)  
	This file can be rendered in Bash with `cat examples/example_markdown.md | ./scripts/parse_markdown_faq_tags.py`.
- `scripts`:
	- `compile_faq_with_screen_reader_text.sh`:  
		(E.g., `./scripts/compile_faq_with_screen_reader_text.sh ./examples/example_markdown.md`)  
		Take the HTML wrapper files listed above, and wrap them around a file, after parsing FAQ tags in that file using `scripts/parse_markdown_faq_tags.py`.
	- `parse_faq_questions_yaml.py`:  
		(E.g., `cat faq_questions_list.yaml | ./scripts/parse_faq_questions_yaml.py`)  
		Turn a YAML list in the format `shorcode-for-question: "Text of the question"` into an HTML list, which can be incorporated into the FAQ system rendered with `compile_faq_with_screen_reader_text.sh`.
	- `parse_markdown_faq_tags.py`:  
		(E.g., `cat examples/example_markdown.md | scripts/parse_markdown_faq_tags.py`)  
		Parse overlapping tagged sections, tagged using the syntax `<#tag>...</#tag>`, into HTML with `<span>` elements replacing tags on each line of a section. (See ["Use"](#use) below.)
	- `remove_tags.sh`:  
	  (E.g., `./scripts/remove_tags.sh examples/example_markdown.md`)  
	  Remove all FAQ tags from a markdown file, for easier reading.

## Use

Markdown rendered with the functions above may have additional "tag" markup, in this form: `<#tag-shortcode>...</#tag-shortcode>`. Tag shortcodes are expected to be listed in `faq_questions_list.yaml`.

**Unlike in XML/HTML, tags are allowed to overlap, even with themselves.** Overlapping tags (i.e., `<#a>Lorem<#a> ipsum dolor</#a> sit amet</#a>`) are read by `parse_markdown_faq_tags.py` as

```<#a(1st instance)>Lorem<#a(2nd instance)> ipsum dolor</#a(1st instance)> sit amet</#a(2nd instance)>```

rather than as in standard HTML, which would parse as

`<#a(1st instance)>Lorem<#a(2nd instance)> ipsum dolor</#a(2nd instance)> sit amet</#a(1st instance)>`

This allows increased flexibility when tagging a document, especially over time or by non-developers.

Thus, when run through `parse_markdown_faq_tags.py`, markdown like this:

```
<#scope-of-policy> This is Markdown.
<#law-enforcement>

### A third-level heading.

<#law-enforcement> A list of items: </#law-enforcement>

- <#types-of-data> List item 1 </#types-of-data>
- List item 2, </#law-enforcement> with additional content, </#scope-of-policy> and more.
- List item 3, <#partial-line> with a </#partial-line> [link](https://google.com).
```

becomes:

```
<span data-relevant-to-question="scope-of-policy" markdown=1> This is Markdown.</span><!-- scope-of-policy -->
<span data-relevant-to-question="scope-of-policy" markdown=1><span data-relevant-to-question="law-enforcement" markdown=1></span><!-- scope-of-policy --></span><!-- law-enforcement -->

### <span data-relevant-to-question="law-enforcement" markdown=1><span data-relevant-to-question="scope-of-policy" markdown=1>A third-level heading.</span><!-- scope-of-policy --></span><!-- law-enforcement -->

<span data-relevant-to-question="law-enforcement" markdown=1><span data-relevant-to-question="scope-of-policy" markdown=1><span data-relevant-to-question="law-enforcement" markdown=1> A list of items: </span><!-- law-enforcement --></span><!-- scope-of-policy --></span><!-- law-enforcement -->

- <span data-relevant-to-question="law-enforcement" markdown=1><span data-relevant-to-question="scope-of-policy" markdown=1><span data-relevant-to-question="types-of-data" markdown=1> List item 1 </span><!-- types-of-data --></span><!-- scope-of-policy --></span><!-- law-enforcement -->
- <span data-relevant-to-question="law-enforcement" markdown=1><span data-relevant-to-question="scope-of-policy" markdown=1>List item 2, </span><!-- law-enforcement --> with additional content, </span><!-- scope-of-policy --> and more.
- List item 3, <span data-relevant-to-question="partial-line" markdown=1> with a </span><!-- partial-line --> [link](https://google.com).
```

This rendered HTML is somewhat cumbersome to read; however, it is straightforward to read, as each closing `</span>` tag is given a comment explaining which tag it closes. Further, the HTML is derived from an original markdown document, which is easier to read and maintain!
