import torch
import numpy as np
import json
from json import JSONEncoder
from models.blt import *

model = BLTnet("add")
checkpoint = torch.load('gaussian_noise2_latest_checkpoint.pth.tar', map_location=torch.device('cpu'))
model.load_state_dict(checkpoint['state_dict'])

for param in model.parameters():
    param.requires_grad = False

inputs = torch.from_numpy(np.load("gaussian_noise2_validation_inputs.npy")).float()
targets = torch.from_numpy(np.load("gaussian_noise2_validation_inputs.npy")).float()

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

with open('noise2_gradients1.json', 'w') as outfile:
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

with open('noise2_gradients2.json', 'w') as outfile:
    json.dump(grid_784, outfile, cls=NumpyArrayEncoder)