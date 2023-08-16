from jinja2 import Template

def read_file(filename):
    with open(filename, 'r') as file:
        return file.read()
    
def write_file(filename, rendered_content):
    with open(filename, 'w') as file:
        file.write(rendered_content)

lane_readmes  = {
    'default': {
        "github": "../../POB/lanes/base/README.md",
        "docs": "../docs/chains/2-integrate-the-sdk.md"
    },
    'mev': {
        "github": "../../POB/lanes/mev/README.md",
        "docs": "../docs/chains/lanes/existing-lanes/1-mev.md"
    },
    'free': {
        "github": "../../POB/lanes/free/README.md",
        "docs": "../docs/chains/lanes/existing-lanes/2-free.md"
    },
    'build-your-own': {
        "github": "../../POB/lanes/build-your-own/README.md",
        "docs": "../docs/chains/lanes/1-build-your-own-lane.md"
    }
}

# TODO: Make this either a CI job that runs everytime we make an update to the
# Block SDK repo, or make it something that runs before every release with a fetch.
for lane in lane_readmes:
    github_path = lane_readmes[lane]['github']
    docs_path = lane_readmes[lane]['docs']

    # Read in the github readme
    readme = read_file(github_path)

    # Covert the template to a jinja2 template
    template_content = read_file(docs_path)
    template = Template(template_content)
    rendered_content = template.render(readme=readme)

    write_file(docs_path, rendered_content)