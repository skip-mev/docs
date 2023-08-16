from jinja2 import Template

def read_file(filename):
    with open(filename, 'r') as file:
        return file.read()

# TODO: Make this either a CI job that runs everytime we make an update to the
# Block SDK repo, or make it something that runs before every release with a fetch.
file_path_default_gh_readme = '../../POB/lanes/base/README.md'
file_path_default_docs_readme = '../docs/chains/lanes/existing-lanes/0-default.md'

default_readme = read_file(file_path_default_gh_readme)

template_content = read_file(file_path_default_docs_readme)
template = Template(template_content)
rendered_content = template.render(default_readme=default_readme)

with open(file_path_default_docs_readme, 'w') as file:
    file.write(rendered_content)