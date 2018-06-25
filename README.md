# "Document Contextual Emphasis"

Embed a searchable FAQ in a document such as a privacy policy 

This repository is a fork-able template for creating a web page for a document that has an embedded FAQ in it, and automatically publishing that page through [GitHub Pages](https://pages.github.com/).

For an example of this, see [here](https://publicus.github.io/document-contextual-emphasis/).

![Example screencast](example_screencast.gif)

## Setup

### Create a copy of this repository

1. In GitHub, click "Fork" to create a copy of this repository

### Create a "Personal Access Token"

1. Go to https://github.com/settings/tokens
1. Click "Generate new token"
1. Under "Token description," you can type any name -- for example, "document-contextual-emphasis Travis CI"
1. Under "Select scopes," check:
	-  `repo:status`
	-  `repo_deployment`
	-  `public_repo`
	-  `write:repo_hook`
	-  `read:repo_hook`
1. Click "Generate token"

### Give that token to Travis CI

1. Go to https://travis-ci.org/profile/publicus
	1. You may need to sign in through GitHub, and click through a screen to give Travis CI access to parts of your account.
1. Look for your copy of the repository ("document-contextual-emphasis"). Click the slider next to it, so that it becomes a check mark.
1. Click "Settings" next to the check mark you just clicked.
1. In the Settings page:
	- Make sure that "Build pushed branches" is checked
	- Under environment variables, add the following:
		- Name: `t`
		- Value: [Your GitHub "Personal Access Token" from above]
		- Make sure that "Display value in build log" is an X, **not a check mark.**

### Make a change

1. In GitHub, in the `master` branch of your forked copy of the repository, try making and committing a change to any of the files in the `content` (or `html_wrappers` -- really, any) directories.
1. If you didn't make the change directly in GitHub's interface, push the changes to the `master` branch on GitHub.
1. Go back to the Travis CI Settings page for the repository (for example, https://travis-ci.org/publicus/document-contextual-emphasis/settings).
	1. Click "Build History." If all is working, you should see a status update about a build happening.
	1. You can view the output of the build by clicking on it, to check whether any errors occurred.

### View the rendered page

If your repository is at https://github.com/publicus/document-contextual-emphasis/, go to https://publicus.github.io/document-contextual-emphasis/ to see your rendered document.

## Contents

This repository contains the following files:

- top directory:
	- `content`: Markdown files, which can be rendered by GitLab CI to PDF, HTML, DOCX, etc. -- if with HTML, incorporating a built-in FAQ using the files further below.
		- `faq_questions_list.yaml`: A list of the shortcodes and corresponding text for each question in the built-in FAQ that the scripts further below can render. These questions will be rendered into a searchable list by `parse_faq_questions_yaml.py`.
	- `html_wrappers`: HTML wrapper files, used in the scripts below:
		- HTML to wrap searchable FAQ lists:
			- `list_of_questions_closing_html.html`
			- `list_of_questions_opening_html.html`
		- HTML to wrap policy documents, making a section screen-reader friendly:
			- `policy_content_closing_html.html`
			- `policy_content_opening_html.html`
		- HTML to wrap the above in a standalone webpage:
			- `standalone_page_opening_html.html`
			- `standalone_page_closing_html.html`
	- `.travis.yml`: An example command file for Travis Continuous Integration (CI). The example will take all commits to the `master` branch of the repository pushed to GitHub, render them into a single page, and publish them using [GitHub Pages](https://pages.github.com/).
- `examples`:
	- `example_markdown.md`: An example markdown file showing FAQ tagging markup, using the syntax `<#tag>...</#tag>` (See ["Use"](#use) below.)  
	This file can be rendered in Bash with `cat examples/example_markdown.md | ./scripts/parse_markdown_faq_tags.py`.
- `scripts`:
	- `content_processing`:
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
	- `javascript`: Scripts for rendering the searchable list of questions (through [List.js](http://listjs.com/)) and fading effect for the document content.

## Use

When compiling the output webpage, the Travis CI job defined above will take all Markdown (`.md`) files placed in `content/non-tagged_document_sections` and render them in alphabetical order. It will then take all Markdown files placed in `content/tagged_document_sections` and render those in alphabetical order.

Markdown rendered with the functions above and placed in `content/tagged_document_sections` may have additional "tag" markup, in this form: `<#tag-shortcode>...</#tag-shortcode>`. Tag shortcodes are expected to be listed in `faq_questions_list.yaml`.

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

# Example

You can manually render the markdown using (from Bash):

```
scripts/content_processing/compile_faq_with_screen_reader_text.sh > index.html
```

You can adjust settings in the top of that script file.
