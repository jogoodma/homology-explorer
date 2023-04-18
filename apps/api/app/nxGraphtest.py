import networkx as nx
import json

with open('app/response.json', 'r') as file:
    data = json.load(file)

edgelist = [ tuple(d.values()) for d in data ]

g = nx.DiGraph()
g.add_edges_from(edgelist)

pagerank = nx.pagerank(g, alpha=0.85, weight='weight')

newnodeattr = [
    {'key':key,'attributes':{'pagerank':value}}
    for key, value in pagerank.items()
]

with open('app/nodeattrs.json', 'r') as file:
    nodeattrs = json.load(file)

newnodelist = []
for node in nodeattrs:
    for new in newnodeattr:
        if node['key'] == new['key']:
            merged_attributes = {**node['attributes'], **new['attributes']}
            merged_dict = {'key': node['key'], 'attributes': merged_attributes}
            newnodelist.append(merged_dict)

print(newnodelist)






