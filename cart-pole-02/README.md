# Cartpole experiment

## Details

This experiment uses Tensorflow.js in order to solve the cartpole problem using Policy Gradient Reinforcement learning.
* The Experiment is rendered using Phaser 3 game engine.
* Tfjs-vis is used for graph visualization.

![Alt text](data/cartpole_trained.gif?raw=true "trainedmodel")

3 algorithms are available:
* REINFORCE
* REINFORCE with baseline
* Actor Critic (A2C)

The Settings page allows to:
 * Configure the Hypermarameters of the Policy and Value models
 * Store the trained model in the Browser
 * Retrieve and use stored models

![Alt text](data/cartpole_settings.png?raw=true "settings")