from jinja2 import Template

def read_file(filename):
    with open(filename, 'r') as file:
        return file.read()

readme = read_file('../../POB/README.md')

template_content = read_file('../docs/chains/1-integrate-the-sdk.md')
template = Template(template_content)
rendered_content = template.render(readme=readme)

with open('../docs/chains/1-integrate-the-sdk.md', 'w') as file:
    file.write(rendered_content)