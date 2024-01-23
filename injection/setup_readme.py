from jinja2 import Template
import requests

def fetch(url):
    response = requests.get(url)
    if response.status_code == 200:
        return response.text
    
    raise Exception(f"Failed to fetch {url}")
    return ""

def read_file(filename):
    with open(filename, 'r') as file:
        return file.read()
    
def write_file(filename, rendered_content):
    with open(filename, 'w') as file:
        file.write(rendered_content)

lane_readmes  = {
    'default': {
        "github": "https://raw.githubusercontent.com/skip-mev/block-sdk/main/lanes/base/README.md",
        "docs": "docs/chains/blocksdk/0-integrate-the-sdk.md"
    },
    'mev': {
        "github": "https://raw.githubusercontent.com/skip-mev/block-sdk/main/lanes/mev/README.md",
        "docs": "docs/chains/blocksdk/lanes/existing-lanes/1-mev.md"
    },
    'free': {
        "github": "https://raw.githubusercontent.com/skip-mev/block-sdk/main/lanes/free/README.md",
        "docs": "docs/chains/blocksdk/lanes/existing-lanes/2-free.md"
    },
    'build-your-own': {
        "github": "https://raw.githubusercontent.com/skip-mev/block-sdk/main/lanes/build-your-own/README.md",
        "docs": "docs/chains/blocksdk/lanes/1-build-your-own-lane.md"
    },
    'slinky-config': {
        "github": "https://raw.githubusercontent.com/skip-mev/slinky/main/oracle/config/README.md",
        "docs": "docs/chains/slinky/validator/1-validator-config.md"
    }
}

# TODO: Make this either a CI job that runs everytime we make an update to the
# Block SDK repo, or make it something that runs before every release with a fetch.
for lane in lane_readmes:
    github_url = lane_readmes[lane]['github']
    docs_path = lane_readmes[lane]['docs']

    # Read in the github readme
    readme = fetch(github_url)

    # Covert the template to a jinja2 template
    template_content = read_file(docs_path)
    template = Template(template_content)
    rendered_content = template.render(readme=readme)

    write_file(docs_path, rendered_content)
