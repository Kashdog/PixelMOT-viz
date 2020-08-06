from flask import Flask, render_template, flash, redirect, url_for, session, request, logging, jsonify

import torch
import numpy as np
import json
from json import JSONEncoder
from models.blt import *

model = torch.load("BLTadd0.pt", map_location=torch.device('cpu'))

for param in model.parameters():
    param.requires_grad = False

inputs = torch.from_numpy(np.load("validation_inputs.npy")).float()
targets = torch.from_numpy(np.load("validation_targets.npy")).float()

trial = 0

inp = inputs[trial]
target = targets[trial]

inp = inp.unsqueeze(0)
inp.requires_grad = True


class NumpyArrayEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return JSONEncoder.default(self, obj)

grid_784 = []

for t in range(28):
    for p in range(28):
        print(28*t+p)
        out = model(inp)
        o1_, o2_ = out
        o1 = torch.stack(o1_).view(1,28,28)
        o1[:,t,p].backward() 
        gridData = []
        for timestep in range(28):
            for pixel in range(28):
                eachData = {}
                eachData['time'] = timestep+1
                eachData['pixel'] =  pixel+1
                eachData['value'] = inp.grad.data[0,timestep, pixel].numpy().copy()
                gridData.append(eachData)
        grid_784.append(gridData)
        inp.grad.data.zero_()

with open('gradients_1.json', 'w') as outfile:
    json.dump(grid_784, outfile, cls=NumpyArrayEncoder)


grid_784 = []

for t in range(28):
    for p in range(28):
        print(28*t+p)
        out = model(inp)
        o1_, o2_ = out
        o2 = torch.stack(o2_).view(1,28,28)
        o2[:,t,p].backward() 
        gridData = []
        for timestep in range(28):
            for pixel in range(28):
                eachData = {}
                eachData['time'] = timestep+1
                eachData['pixel'] =  pixel+1
                eachData['value'] = inp.grad.data[0,timestep, pixel].numpy().copy()
                gridData.append(eachData)
        grid_784.append(gridData)
        inp.grad.data.zero_()

with open('gradients_2.json', 'w') as outfile:
    json.dump(grid_784, outfile, cls=NumpyArrayEncoder)

gridData = []
for timestep in range(28):
    for pixel in range(28):
        o1 = torch.FloatTensor(28, 28)
        o1.zero_()
        o1.scatter_(1, targets[0,:,0].long().view(28,1), 1)
        eachData = {}
        eachData['time'] = timestep+1
        eachData['pixel'] =  pixel+1
        eachData['value'] = o1[timestep, pixel].numpy()
        gridData.append(eachData)
with open('tracker_1.json', 'w') as outfile:
    json.dump(gridData, outfile, cls=NumpyArrayEncoder)

gridData = []
for timestep in range(28):
    for pixel in range(28):
        o2 = torch.FloatTensor(28, 28)
        o2.zero_()
        o2.scatter_(1, targets[0,:,1].long().view(28,1), 1)
        eachData = {}
        eachData['time'] = timestep+1
        eachData['pixel'] =  pixel+1
        eachData['value'] = o2[timestep, pixel].numpy()
        gridData.append(eachData)
with open('tracker_2.json', 'w') as outfile:
    json.dump(gridData, outfile, cls=NumpyArrayEncoder)

app = Flask(__name__)



# Index
@app.route('/')
def index():

    return render_template('home.html')

@app.route('/get_tracking_data_1')
def get_tracking_data_1():
    gridData = []
    for timestep in range(28):
        for pixel in range(28):
            o1 = torch.FloatTensor(28, 28)
            o1.zero_()
            o1.scatter_(1, targets[0,:,0].long().view(28,1), 1)
            eachData = {}
            eachData['time'] = timestep+1
            eachData['pixel'] =  pixel+1
            eachData['value'] = o1[timestep, pixel].numpy()
            gridData.append(eachData)
    return json.dumps(gridData, cls=NumpyArrayEncoder)

@app.route('/get_tracking_data_2')
def get_tracking_data_2():
    gridData = []
    for timestep in range(28):
        for pixel in range(28):
            o2 = torch.FloatTensor(28, 28)
            o2.zero_()
            o2.scatter_(1, targets[0,:,1].long().view(28,1), 1)
            eachData = {}
            eachData['time'] = timestep+1
            eachData['pixel'] =  pixel+1
            eachData['value'] = o2[timestep, pixel].numpy()
            gridData.append(eachData)
    return json.dumps(gridData, cls=NumpyArrayEncoder)

@app.route('/get_grid_data')
def get_grid_data():
    gridData = []
    for timestep in range(28):
        for pixel in range(28):
            eachData = {}
            eachData['time'] = timestep+1
            eachData['pixel'] =  pixel+1
            eachData['value'] = inp.grad.data[0,timestep, pixel].numpy()
            gridData.append(eachData)
    return json.dumps(gridData, cls=NumpyArrayEncoder)

@app.route('/hover', methods=['POST']) 
def hover():
    if request.method == 'POST':
        inp.grad.data.zero_()
        time = request.get_json()['time']
        pixel = request.get_json()['pixel']
        out = model(inp)
        o1_, o2_ = out
        o1 = torch.stack(o1_).view(1,28,28)
        o1[:,time-1,pixel-1].view(1).backward()
        return jsonify({'hover':'ok'}),200
if __name__ == '__main__':
    app.run(debug=True)