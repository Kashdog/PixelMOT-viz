"""
Pytorch implementation of BLT Networks
"""

"""
imports
"""
from collections import OrderedDict
import torch
from torch import nn
from torch.nn import functional as F


device = torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")


class Flatten(nn.Module):

    """
    Helper module for flattening input tensor to 1-D for the use in Linear modules
    """

    def forward(self, x):
        return x.view(x.size(0), -1)


class Identity(nn.Module):

    """
    Helper module that stores the current tensor. Useful for accessing by name
    """

    def forward(self, x):
        return x

class Mish(nn.Module):
    def __init__(self):
        super().__init__()

    def forward(self, x):
        #inlining this saves 1 second per epoch (V100 GPU) vs having a temp x and then returning x(!)
        return x *( torch.tanh(F.softplus(x)))


class BLTblock(nn.Module):

    scale = 4  # scale of the bottleneck convolution channels

    def __init__(self, in_channels, out_channels, feedback_channels = None, kernel_size=3, stride=1, operation="add"):
        super().__init__()
        self.operation = operation
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.feedback_channels = feedback_channels
        
        self.stride = stride

        self.b_conv = nn.Conv1d(in_channels, out_channels, kernel_size=kernel_size,
                                    stride=stride, padding=kernel_size//2, bias=False)
        self.l_conv = nn.Conv1d(out_channels, out_channels,
                               kernel_size=kernel_size, padding=kernel_size//2, bias=False)
        if(feedback_channels is not None): self.t_conv = nn.Conv1d(feedback_channels, out_channels,
                               kernel_size=kernel_size, padding=kernel_size//2, bias=False)
        self.norm = nn.BatchNorm1d(out_channels)

        self.conv3 = nn.Conv1d(out_channels * self.scale, out_channels,
                               kernel_size=1, bias=False)
        #self.nonlin3 = Mish() nn.ReLU(inplace=True)

        self.nonlin = nn.ReLU(inplace=True)
        self.lrn = nn.LocalResponseNorm(5, alpha=5*1e-4, beta=0.5, k=1.)
        self.output = Identity()  # for an easy access to this block's output

    def forward(self, inp=None, state=None, feedback=None, downsample = None, skip = None):
        # Apply Bottom Up convolution
        inp = self.b_conv(inp)
        inp = self.norm(inp)
        if state is None:  # at t=0, state is initialized to 0
            state = 0
        else:
            # Apply Lateral convolution
            state = self.l_conv(state)
        if feedback is None:
            feedback = torch.zeros(inp.shape).to(device)
        else:
            # Apply Top Down convolution
            # followed by nearest neighbor upsampling
            feedback = self.t_conv(feedback)
            feedback =  F.interpolate(feedback, scale_factor=inp.size(2)//feedback.size(2), mode='nearest')
        
        if self.operation == "add":
            output = self.nonlin(inp + state + feedback)
            if downsample is not None:
              output = self.nonlin(inp + state + feedback + downsample)
            if skip is not None:
              output = self.nonlin(inp + state + feedback + skip)
        elif self.operation == "gate":
            # In the upper layer the feedback is 0, so sigmoid(feedback) is 0.5
            output = self.nonlin(inp * torch.sigmoid(feedback) + state  + torch.normal(mean=0, std = 2, size=inp.shape).to(device))
        elif self.operation == "mod":
            output = self.nonlin(inp * (1 + feedback) + state)
            if downsample is not None:
              output = self.nonlin(inp * (1 + feedback) + state + downsample)
            if skip is not None:
              output = self.nonlin(inp * (1 + feedback) + state + skip)
        elif self.operation == "sub":
            output = self.nonlin(x + state) - feedback
        elif self.operation == "div":
            output = self.nonlin(inp + state) / feedback.masked_fill((feedback < 0.1), 0.1)
      
        output = self.output(output)
        state = output
        return output, state


class BLTnet(nn.Module):

    

    def __init__(self, operation="add", scale=16 ):
        super().__init__()
        self.operation = operation
        self.scale = scale
        self.V1 = BLTblock(  1, self.scale, feedback_channels=self.scale*2, kernel_size=3, stride=1, operation=operation)
        self.V2 = BLTblock( self.V1.out_channels, 2 * self.V1.out_channels, feedback_channels=2*self.V1.feedback_channels,kernel_size=3, stride=1,operation=operation)
        self.V4 = BLTblock(  self.V2.out_channels, 2 * self.V2.out_channels, feedback_channels=2*self.V2.feedback_channels, stride=1,operation=operation)
        self.IT = BLTblock(  self.V4.out_channels, 2 * self.V4.out_channels, stride=1, operation=operation)

        self.IT_V2downsample = nn.Sequential(OrderedDict([
            ('downsample', nn.Conv1d(self.IT.out_channels, self.V2.out_channels,
                               kernel_size=1, padding=0, bias=False)),
            ('conv1', nn.Conv1d(self.V2.out_channels, self.V2.out_channels * 4,
                               kernel_size=1, bias=False)),
            ('nonlin1', nn.ReLU(inplace=True)),
            ('conv2', nn.Conv1d(self.V2.out_channels*4, self.V2.out_channels * 4,
                               kernel_size=3, padding=1, bias=False)),
            ('nonlin2', nn.ReLU(inplace=True)),
            ('conv3', nn.Conv1d(self.V2.out_channels*4, self.V2.out_channels,
                               kernel_size=1, bias=False)),
        ]))

        self.IT_V1downsample = nn.Sequential(OrderedDict([
            ('downsample', nn.Conv1d(self.IT.out_channels, self.V1.out_channels,
                               kernel_size=1, padding=0, bias=False)),
            ('conv1', nn.Conv1d(self.V1.out_channels, self.V1.out_channels * 4,
                               kernel_size=1, bias=False)),
            ('nonlin1', nn.ReLU(inplace=True)),
            ('conv2', nn.Conv1d(self.V1.out_channels*4, self.V1.out_channels * 4,
                               kernel_size=3, padding=1, bias=False)),
            ('nonlin2', nn.ReLU(inplace=True)),
            ('conv3', nn.Conv1d(self.V1.out_channels*4, self.V1.out_channels,
                               kernel_size=1, bias=False)),
        ]))

        self.V4_V1downsample = nn.Sequential(OrderedDict([
            ('downsample', nn.Conv1d(self.V4.out_channels, self.V1.out_channels,
                               kernel_size=1, padding=0, bias=False)),
            ('conv1', nn.Conv1d(self.V1.out_channels, self.V1.out_channels * 4,
                               kernel_size=1, bias=False)),
            ('nonlin1', nn.ReLU(inplace=True)),
            ('conv2', nn.Conv1d(self.V1.out_channels*4, self.V1.out_channels * 4,
                               kernel_size=3, padding=1, bias=False)),
            ('nonlin2', nn.ReLU(inplace=True)),
            ('conv3', nn.Conv1d(self.V1.out_channels*4, self.V1.out_channels,
                               kernel_size=1, bias=False)),
        ]))

        self.V1_ITskip = nn.Sequential(OrderedDict([
            ('skip', nn.Conv1d(self.V1.out_channels, self.IT.out_channels,
                               kernel_size=1, padding=0, bias=False)),
            ('conv1', nn.Conv1d(self.IT.out_channels, self.IT.out_channels * 4,
                               kernel_size=1, bias=False)),
            ('nonlin1', nn.ReLU(inplace=True)),
            ('conv2', nn.Conv1d(self.IT.out_channels*4, self.IT.out_channels * 4,
                               kernel_size=3, padding=1, bias=False)),
            ('nonlin2', nn.ReLU(inplace=True)),
            ('conv3', nn.Conv1d(self.IT.out_channels*4, self.IT.out_channels,
                               kernel_size=1, bias=False)),
        ]))

        self.V1_V4skip = nn.Sequential(OrderedDict([
            ('skip', nn.Conv1d(self.V1.out_channels, self.V4.out_channels,
                               kernel_size=1, padding=0, bias=False)),
            ('conv1', nn.Conv1d(self.V4.out_channels, self.V4.out_channels * 4,
                               kernel_size=1, bias=False)),
            ('nonlin1', nn.ReLU(inplace=True)),
            ('conv2', nn.Conv1d(self.V4.out_channels*4, self.V4.out_channels * 4,
                               kernel_size=3, padding=1, bias=False)),
            ('nonlin2', nn.ReLU(inplace=True)),
            ('conv3', nn.Conv1d(self.V4.out_channels*4, self.V4.out_channels,
                               kernel_size=1, bias=False)),
        ]))

        self.V2_ITskip = nn.Sequential(OrderedDict([
            ('skip', nn.Conv1d(self.V2.out_channels, self.IT.out_channels,
                               kernel_size=1, padding=0, bias=False)),
            ('conv1', nn.Conv1d(self.IT.out_channels, self.IT.out_channels * 4,
                               kernel_size=1, bias=False)),
            ('nonlin1', nn.ReLU(inplace=True)),
            ('conv2', nn.Conv1d(self.IT.out_channels*4, self.IT.out_channels * 4,
                               kernel_size=3, padding=1, bias=False)),
            ('nonlin2', nn.ReLU(inplace=True)),
            ('conv3', nn.Conv1d(self.IT.out_channels*4, self.IT.out_channels,
                               kernel_size=1, bias=False)),
        ]))

        self.decoder = nn.Sequential(OrderedDict([
            #('avgpool', nn.AdaptiveAvgPool1d(28,28)),
            ('flatten', Flatten())
        ]))
        self.o1 =  nn.Sequential(
              nn.Linear(self.IT.out_channels*28, 28)
        )
        self.o2 = nn.Sequential(
              nn.Linear(self.IT.out_channels*28, 28)
        )
        
        

    def forward(self, inp):
        pixels = inp.size(2)
        times = inp.size(1)
        batch_size = inp.size(0)

        outputs = {}
        states = {}
        blocks = ['inp', 'V1', 'V2', 'V4', 'IT']
        
        o1 = [None for t in range(times)]
        o2 = [None for t in range(times)]

        for t in range(times):
            outputs['inp'] = inp[:,t,:].view(batch_size, 1, pixels)
            for block in blocks[1:]:
                prev_block = blocks[blocks.index(block) - 1]
                prev_output = outputs[prev_block]
                if t == 0:
                    prev_state = None
                else:
                    prev_state = states[block]
                if blocks.index(block) < len(blocks)-1 and t > 0:
                    next_block =  blocks[blocks.index(block) + 1]
                    prev_feedback = states[next_block]
                else:
                    prev_feedback = None
                if block == 'V1' and t > 0:
                  downsample = self.V4_V1downsample(states['V4']) + self.IT_V1downsample(states['IT'])
                elif block == 'V2' and t > 0:
                  downsample = self.IT_V2downsample(states['IT'])
                else:
                  downsample = None
                if block == 'IT':
                  skip = self.V1_ITskip(outputs['V1']) + self.V2_ITskip(outputs['V2'])
                elif block == 'V4':
                  skip = self.V1_V4skip(outputs['V1'])
                else:
                  skip = None
                outputs[block], states[block] = getattr(self, block)(prev_output, prev_state, prev_feedback, downsample, skip)
            decoded = self.decoder(outputs['IT'])
            o1[t] = self.o1(decoded)
            o2[t] = self.o2(decoded)
        return o1, o2
