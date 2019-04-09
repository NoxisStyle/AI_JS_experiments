# TODO

 * train the value model (OK)
 * Use value model to predict reward in episodeStateValues (OK)
 * create new function to compute normalized reward without normalization (OK)
 * compute advantage by removing the baseline (OK)

ex: https://github.com/thibo73800/metacar/blob/master/demo/webapp/public/js/policy_monte_carlo/policy_agent.js

TO ANALYZE

Échec du chargement pour l’élément <script> dont la source est « https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-vis@1.0.2 ». localhost:8000:10:1
     Phaser v3.11 (WebGL | Web Audio)  https://phaser.io phaser.min.js:1:529195
Scene launched in RL_TRAIN mode game.js:105:9
Object { unreliable: false, numBytesInGPU: 0, numTensors: 0, numDataBuffers: 0, numBytes: 0 }
game.js:106:9
Init PolicyBasedAgent policybased.js:7:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 0, numTensors: 34, numDataBuffers: 34, numBytes: 2364 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 1776, numTensors: 34, numDataBuffers: 34, numBytes: 2364 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 2592, numTensors: 34, numDataBuffers: 34, numBytes: 2364 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 2592, numTensors: 34, numDataBuffers: 34, numBytes: 2364 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 2592, numTensors: 34, numDataBuffers: 34, numBytes: 2364 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 2592, numTensors: 34, numDataBuffers: 34, numBytes: 2364 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 2592, numTensors: 34, numDataBuffers: 34, numBytes: 2364 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 2592, numTensors: 34, numDataBuffers: 34, numBytes: 2364 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 2592, numTensors: 34, numDataBuffers: 34, numBytes: 2364 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 2592, numTensors: 34, numDataBuffers: 34, numBytes: 2364 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 2592, numTensors: 34, numDataBuffers: 34, numBytes: 2364 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 2592, numTensors: 34, numDataBuffers: 34, numBytes: 2364 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 2592, numTensors: 34, numDataBuffers: 34, numBytes: 2364 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 2592, numTensors: 34, numDataBuffers: 34, numBytes: 2364 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 2592, numTensors: 34, numDataBuffers: 34, numBytes: 2364 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 2592, numTensors: 34, numDataBuffers: 34, numBytes: 2364 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 2592, numTensors: 34, numDataBuffers: 34, numBytes: 2364 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 2592, numTensors: 34, numDataBuffers: 34, numBytes: 2364 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 2592, numTensors: 34, numDataBuffers: 34, numBytes: 2364 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 2592, numTensors: 34, numDataBuffers: 34, numBytes: 2364 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 2592, numTensors: 34, numDataBuffers: 34, numBytes: 2364 }
game.js:565:9
Episode over -- about to learn game.js:589:17
disc rw 5.298162187499999,4.524381249999999,3.709875,2.8525,1.95,1,0 policybased.js:60:13
predicted disc rw 0.02681950479745865,0.11292767524719238,0.17136992514133453,0.22613899409770966,0.26616400480270386,0.2622908353805542,0.2725042700767517 game.js:601:17
adv 5.2713426827025405,4.411453574752807,3.5385050748586653,2.6263610059022904,1.683835995197296,0.7377091646194458,-0.2725042700767517 game.js:611:17
before train game.js:616:13
Object { unreliable: false, numBytesInGPU: 2592, numTensors: 34, numDataBuffers: 34, numBytes: 2364 }
game.js:617:13
train A game.js:641:17
Object { unreliable: false, numBytesInGPU: 2592, numTensors: 38, numDataBuffers: 38, numBytes: 2560 }
game.js:642:17
train after actions 0,0,0,0,0,0,0 game.js:645:21
train B game.js:653:17
Object { unreliable: false, numBytesInGPU: 2592, numTensors: 39, numDataBuffers: 38, numBytes: 2560 }
game.js:654:17
actions 2 Tensor
    [0, 0, 0, 0, 0, 0, 0] policybased.js:247:17
neglogprob = 0.39998796582221985 - loss = 1.0283520221710205 logProbV2 = -0.5980477929115295,-0.5280117988586426,-0.46309927105903625,-0.3962867856025696,-0.3273847997188568,-0.2684774100780487,-0.21860802173614502 lossV2 = 8.851034164428711 policybased.js:273:17
log_prob_v3 = 0.5980477929115295,0.5280117988586426,0.46309927105903625,0.3962867856025696,0.3273847997188568,0.2684774100780487,0.21860802173614502 - loss_v3 = 8.851034164428711 policybased.js:274:17
Epoch 0 - policy entropy = 4.289877414703369 policybased.js:181:29
train C game.js:659:17
Object { unreliable: false, numBytesInGPU: 4256, numTensors: 51, numDataBuffers: 50, numBytes: 4016 }
game.js:660:17
after train game.js:663:13
Object { unreliable: false, numBytesInGPU: 4256, numTensors: 46, numDataBuffers: 46, numBytes: 3820 }
game.js:664:13
====================== game.js:680:17
Episode 0 game.js:681:17
  episode reward : 6 game.js:682:17
  mean reward    : 6 game.js:683:17
  max reward    : 6 game.js:684:17
====================== game.js:685:17
Scene launched in RL_TRAIN mode game.js:105:9
Object { unreliable: false, numBytesInGPU: 7984, numTensors: 68, numDataBuffers: 68, numBytes: 6980 }
game.js:106:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 7984, numTensors: 68, numDataBuffers: 68, numBytes: 6980 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 7984, numTensors: 68, numDataBuffers: 68, numBytes: 6980 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 7984, numTensors: 68, numDataBuffers: 68, numBytes: 6980 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:565:9
Episode over -- about to learn game.js:589:17
disc rw 8.623998154470799,8.02526121523242,7.395011805507812,6.731591374218749,6.033254078124999,5.298162187499999,4.524381249999999,3.709875,2.8525,1.95,1,0 policybased.js:60:13
predicted disc rw 0.018895909190177917,0.055940307676792145,0.11327417194843292,0.1441289633512497,0.1829340159893036,0.22815808653831482,0.27994126081466675,0.3349919021129608,0.39385664463043213,0.4570253789424896,0.5319066047668457,0.6144586801528931 game.js:601:17
adv 8.605102245280621,7.969320907555629,7.281737633559379,6.5874624108674995,5.850320062135696,5.070004100961684,4.244439989185333,3.374883097887039,2.458643355369568,1.4929746210575103,0.4680933952331543,-0.6144586801528931 game.js:611:17
before train game.js:616:13
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:617:13
train A game.js:641:17
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 73, numDataBuffers: 73, numBytes: 7296 }
game.js:642:17
train after actions 0,0,0,0,0,0,0,0,0,0,0,0 game.js:645:21
train B game.js:653:17
Object { unreliable: false, numBytesInGPU: 7988, numTensors: 74, numDataBuffers: 73, numBytes: 7296 }
game.js:654:17
actions 2 Tensor
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] policybased.js:247:17
neglogprob = 0.14630118012428284 - loss = 0.6435852646827698 logProbV2 = -0.4633015990257263,-0.3460141718387604,-0.2565881013870239,-0.19265615940093994,-0.14353467524051666,-0.10616510361433029,-0.07797813415527344,-0.05691805109381676,-0.042121969163417816,-0.031018566340208054,-0.022732336074113846,-0.016584524884819984 lossV2 = 11.933148384094238 policybased.js:273:17
log_prob_v3 = 0.4633015990257263,0.3460141718387604,0.2565881013870239,0.19265615940093994,0.14353467524051666,0.10616510361433029,0.07797813415527344,0.05691805109381676,0.042121969163417816,0.031018566340208054,0.022732336074113846,0.016584524884819984 - loss_v3 = 11.933148384094238 policybased.js:274:17
Epoch 0 - policy entropy = 3.962918281555176 policybased.js:181:29
train C game.js:659:17
Object { unreliable: false, numBytesInGPU: 7992, numTensors: 74, numDataBuffers: 73, numBytes: 7296 }
game.js:660:17
after train game.js:663:13
Object { unreliable: false, numBytesInGPU: 7992, numTensors: 69, numDataBuffers: 69, numBytes: 6960 }
game.js:664:13
====================== game.js:680:17
Episode 1 game.js:681:17
  episode reward : 11 game.js:682:17
  mean reward    : 8.5 game.js:683:17
  max reward    : 11 game.js:684:17
====================== game.js:685:17
Scene launched in RL_TRAIN mode game.js:105:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 71, numDataBuffers: 71, numBytes: 7012 }
game.js:106:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 71, numDataBuffers: 71, numBytes: 7012 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 71, numDataBuffers: 71, numBytes: 7012 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 71, numDataBuffers: 71, numBytes: 7012 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:565:9
Episode over -- about to learn game.js:589:17
disc rw 9.192798246747259,8.623998154470799,8.02526121523242,7.395011805507812,6.731591374218749,6.033254078124999,5.298162187499999,4.524381249999999,3.709875,2.8525,1.95,1,0 policybased.js:60:13
predicted disc rw 0.14811712503433228,0.15760856866836548,0.22796471416950226,0.15644019842147827,0.2265113890171051,0.28214430809020996,0.22643892467021942,0.28622129559516907,0.371724009513855,0.4577483534812927,0.5477586984634399,0.637247622013092,0.7269541621208191 game.js:601:17
adv 9.044681121712927,8.466389585802434,7.7972965010629185,7.2385716070863335,6.505079985201644,5.751109770034789,5.07172326282978,4.23815995440483,3.338150990486145,2.3947516465187073,1.40224130153656,0.36275237798690796,-0.7269541621208191 game.js:611:17
before train game.js:616:13
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:617:13
train A game.js:641:17
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 74, numDataBuffers: 74, numBytes: 7328 }
game.js:642:17
train after actions 0,0,1,0,0,1,0,0,0,0,0,0,0 game.js:645:21
train B game.js:653:17
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 75, numDataBuffers: 74, numBytes: 7328 }
game.js:654:17
actions 2 Tensor
    [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0] policybased.js:247:17
neglogprob = 0.4452533423900604 - loss = 2.0852911472320557 logProbV2 = -0.6313913464546204,-0.4933137595653534,-1.2272417545318604,-0.49266934394836426,-0.344635546207428,-1.5161772966384888,-0.3441287875175476,-0.24683542549610138,-0.17634712159633636,-0.12479326874017715,-0.08760463446378708,-0.061073534190654755,-0.04208168387413025 lossV2 = 37.777679443359375 policybased.js:273:17
log_prob_v3 = 0.6313913464546204,0.4933137595653534,1.2272417545318604,0.49266934394836426,0.344635546207428,1.5161772966384888,0.3441287875175476,0.24683542549610138,0.17634712159633636,0.12479326874017715,0.08760463446378708,0.061073534190654755,0.04208168387413025 - loss_v3 = 37.777679443359375 policybased.js:274:17
Epoch 0 - policy entropy = 6.379911422729492 policybased.js:181:29
train C game.js:659:17
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 75, numDataBuffers: 74, numBytes: 7328 }
game.js:660:17
after train game.js:663:13
Object { unreliable: false, numBytesInGPU: 8240, numTensors: 70, numDataBuffers: 70, numBytes: 6964 }
game.js:664:13
====================== game.js:680:17
Episode 2 game.js:681:17
  episode reward : 12 game.js:682:17
  mean reward    : 9.666666666666666 game.js:683:17
  max reward    : 12 game.js:684:17
====================== game.js:685:17
Scene launched in RL_TRAIN mode game.js:105:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 72, numDataBuffers: 72, numBytes: 7020 }
game.js:106:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 72, numDataBuffers: 72, numBytes: 7020 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 72, numDataBuffers: 72, numBytes: 7020 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 72, numDataBuffers: 72, numBytes: 7020 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:565:9
Episode over -- about to learn game.js:589:17
disc rw 10.2465004176894,9.733158334409895,9.192798246747259,8.623998154470799,8.02526121523242,7.395011805507812,6.731591374218749,6.033254078124999,5.298162187499999,4.524381249999999,3.709875,2.8525,1.95,1,0 policybased.js:60:13
predicted disc rw 0.2602103352546692,0.3524293303489685,0.2509556710720062,0.3421752452850342,0.24696692824363708,0.33266177773475647,0.42349177598953247,0.5006371140480042,0.5784157514572144,0.6717170476913452,0.7674373984336853,0.8697624802589417,0.9745293259620667,1.0808005332946777,1.1896802186965942 game.js:601:17
adv 9.986290082434731,9.380729004060926,8.941842575675253,8.281822909185765,7.778294286988784,7.062350027773055,6.308099598229217,5.532616964076995,4.719746436042785,3.852664202308654,2.9424376015663145,1.9827375197410584,0.9754706740379333,-0.08080053329467773,-1.1896802186965942 game.js:611:17
before train game.js:616:13
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:617:13
train A game.js:641:17
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 75, numDataBuffers: 75, numBytes: 7388 }
game.js:642:17
train after actions 0,1,0,1,0,0,0,0,0,0,0,0,0,0,0 game.js:645:21
train B game.js:653:17
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 76, numDataBuffers: 75, numBytes: 7388 }
game.js:654:17
actions 2 Tensor
    [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] policybased.js:247:17
neglogprob = 0.3323476016521454 - loss = 1.6944104433059692 logProbV2 = -0.4627664089202881,-1.2602370977401733,-0.4732997715473175,-1.2417190074920654,-0.4820334017276764,-0.34719595313072205,-0.2353152483701706,-0.15887022018432617,-0.1103423610329628,-0.07599133253097534,-0.051939573138952255,-0.0352509543299675,-0.023763597011566162,-0.01591583713889122,-0.010573171079158783 lossV2 = 40.56950378417969 policybased.js:273:17
log_prob_v3 = 0.4627664089202881,1.2602370977401733,0.4732997715473175,1.2417190074920654,0.4820334017276764,0.34719595313072205,0.2353152483701706,0.15887022018432617,0.1103423610329628,0.07599133253097534,0.051939573138952255,0.0352509543299675,0.023763597011566162,0.01591583713889122,0.010573171079158783 - loss_v3 = 40.56950378417969 policybased.js:274:17
Epoch 0 - policy entropy = 5.918691635131836 policybased.js:181:29
train C game.js:659:17
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 76, numDataBuffers: 75, numBytes: 7388 }
game.js:660:17
after train game.js:663:13
Object { unreliable: false, numBytesInGPU: 8504, numTensors: 71, numDataBuffers: 71, numBytes: 6968 }
game.js:664:13
====================== game.js:680:17
Episode 3 game.js:681:17
  episode reward : 14 game.js:682:17
  mean reward    : 10.75 game.js:683:17
  max reward    : 14 game.js:684:17
====================== game.js:685:17
Scene launched in RL_TRAIN mode game.js:105:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7032 }
game.js:106:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7032 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7032 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7032 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:565:9
Episode over -- about to learn game.js:589:17
disc rw 17.680355573999872,17.558269025263023,17.42975686869792,17.294480914418862,17.15208517307249,17.002194919023673,16.844415704235445,16.67833232024784,16.503507705524044,16.319481795288468,16.125770310829967,15.921863485084177,15.70722472114124,15.481289180148673,15.243462294893341,14.993118205150886,14.729598110685144,14.45220853756331,14.160219513224538,13.852862645499515,13.529329100525807,13.188767474237693,12.83028155182915,12.452927949293844,12.055713630835626,11.63759329561645,11.197466626964683,10.73417539680493,10.2465004176894,9.733158334409895,9.192798246747259,8.623998154470799,8.02526121523242,7.395011805507812,6.731591374218749,6.033254078124999,5.298162187499999,4.524381249999999,3.709875,2.8525,1.95,1,0 policybased.js:60:13
predicted disc rw 0.2818847894668579,0.3514273762702942,0.4395256042480469,0.35400164127349854,0.30239176750183105,0.3543049097061157,0.30329006910324097,0.37128084897994995,0.3038284182548523,0.3519328236579895,0.4387465715408325,0.35524773597717285,0.4425033926963806,0.5315002202987671,0.4503632187843323,0.3611714839935303,0.45673203468322754,0.5471007823944092,0.4653019309043884,0.558760941028595,0.47091972827911377,0.3784201145172119,0.33023500442504883,0.3874654769897461,0.48919516801834106,0.3985409140586853,0.3731374144554138,0.3578389286994934,0.4362695813179016,0.543675422668457,0.40533560514450073,0.5271803140640259,0.6223635077476501,0.7159416675567627,0.8236117362976074,0.6993412971496582,0.7941016554832458,0.9109095931053162,1.0293439626693726,1.1497986316680908,1.2727595567703247,1.3986279964447021,1.5276936292648315 game.js:601:17
adv 17.398470784533014,17.20684164899273,16.99023126444987,16.940479273145364,16.849693405570658,16.647890009317557,16.541125635132204,16.30705147126789,16.19967928726919,15.967548971630478,15.687023739289135,15.566615749107005,15.264721328444859,14.949788959849906,14.793099076109009,14.631946721157355,14.272866076001916,13.9051077551689,13.69491758232015,13.29410170447092,13.058409372246693,12.810347359720481,12.500046547404102,12.065462472304098,11.566518462817285,11.239052381557764,10.82432921250927,10.376336468105437,9.810230836371499,9.189482911741438,8.787462641602758,8.096817840406773,7.402897707484771,6.679070137951049,5.907979637921142,5.333912780975341,4.504060532016753,3.613471656894683,2.6805310373306273,1.7027013683319092,0.6772404432296752,-0.39862799644470215,-1.5276936292648315 game.js:611:17
before train game.js:616:13
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:617:13
train A game.js:641:17
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 76, numDataBuffers: 76, numBytes: 8176 }
game.js:642:17
train after actions 1,1,0,0,1,0,0,1,1,1,0,1,1,0,0,1,1,0,1,0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0 game.js:645:21
train B game.js:653:17
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 77, numDataBuffers: 76, numBytes: 8176 }
game.js:654:17
actions 2 Tensor
    [1, 1, 0, ..., 0, 0, 0] policybased.js:247:17
neglogprob = 0.5795291066169739 - loss = 6.4692864418029785 logProbV2 = -0.8312658071517944,-0.8777828812599182,-0.4949660897254944,-0.5395632386207581,-0.8401750326156616,-0.5403805375099182,-0.5657860040664673,-1.0396702289581299,-0.8355070352554321,-0.8722547292709351,-0.49373993277549744,-0.8723609447479248,-0.943414032459259,-0.45244506001472473,-0.4923813045024872,-0.8802269101142883,-0.9453828930854797,-0.4512033462524414,-0.9466089010238647,-0.4504813551902771,-0.49034103751182556,-0.5137060880661011,-0.8767542243003845,-0.9089968800544739,-0.4895172715187073,-0.5155807733535767,-0.5184464454650879,-0.5458227396011353,-0.42377638816833496,-1.336151123046875,-0.45115551352500916,-0.3271264433860779,-0.23714764416217804,-0.1617240458726883,-2.2451350688934326,-0.17315609753131866,-0.11887841671705246,-0.08074694871902466,-0.0542943961918354,-0.03615757077932358,-0.023853203281760216,-0.015589804388582706,-0.010095777921378613 lossV2 = 324.1623229980469 policybased.js:273:17
log_prob_v3 = 0.8312658071517944,0.8777828812599182,0.4949660897254944,0.5395632386207581,0.8401750326156616,0.5403805375099182,0.5657860040664673,1.0396702289581299,0.8355070352554321,0.8722547292709351,0.49373993277549744,0.8723609447479248,0.943414032459259,0.45244506001472473,0.4923813045024872,0.8802269101142883,0.9453828930854797,0.4512033462524414,0.9466089010238647,0.4504813551902771,0.49034103751182556,0.5137060880661011,0.8767542243003845,0.9089968800544739,0.4895172715187073,0.5155807733535767,0.5184464454650879,0.5458227396011353,0.42377638816833496,1.336151123046875,0.45115551352500916,0.3271264433860779,0.23714764416217804,0.1617240458726883,2.2451350688934326,0.17315609753131866,0.11887841671705246,0.08074694871902466,0.0542943961918354,0.03615757077932358,0.023853203281760216,0.015589804388582706,0.010095777921378613 - loss_v3 = 324.1623229980469 policybased.js:274:17
Epoch 0 - policy entropy = 24.241405487060547 policybased.js:181:29
train C game.js:659:17
Object { unreliable: false, numBytesInGPU: 9496, numTensors: 77, numDataBuffers: 76, numBytes: 8176 }
game.js:660:17
after train game.js:663:13
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 72, numDataBuffers: 72, numBytes: 6972 }
game.js:664:13
====================== game.js:680:17
Episode 4 game.js:681:17
  episode reward : 42 game.js:682:17
  mean reward    : 17 game.js:683:17
  max reward    : 42 game.js:684:17
====================== game.js:685:17
Scene launched in RL_TRAIN mode game.js:105:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:106:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:565:9
TypeError: this.tensorInfo.get(...) is undefined[En savoir plus] tfjs@1.0.0:2:41280
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:565:9
Episode over -- about to learn game.js:589:17
disc rw 7.395011805507812,6.731591374218749,6.033254078124999,5.298162187499999,4.524381249999999,3.709875,2.8525,1.95,1,0 policybased.js:60:13
predicted disc rw 0.24086765944957733,0.3143264055252075,0.4288859963417053,0.5488640666007996,0.6716886758804321,0.7946107387542725,0.7011904120445251,0.8269259929656982,0.9508978128433228,1.0788692235946655 game.js:601:17
adv 7.1541441460582345,6.417264968693542,5.604368081783294,4.7492981208992,3.8526925741195672,2.9152642612457274,2.151309587955475,1.1230740070343017,0.049102187156677246,-1.0788692235946655 game.js:611:17
before train game.js:616:13
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:617:13
train A game.js:641:17
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 77, numDataBuffers: 77, numBytes: 7424 }
game.js:642:17
train after actions 0,0,0,0,0,1,0,0,0,0 game.js:645:21
train B game.js:653:17
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 78, numDataBuffers: 77, numBytes: 7424 }
game.js:654:17
actions 2 Tensor
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0] policybased.js:247:17
neglogprob = 0.43686896562576294 - loss = 1.43894362449646 logProbV2 = -0.5533919930458069,-0.4024730324745178,-0.2736958861351013,-0.18357285857200623,-0.12318982928991318,-2.5441012382507324,-0.12207130342721939,-0.08019126206636429,-0.052229318767786026,-0.03377225250005722 lossV2 = 17.15770149230957 policybased.js:273:17
log_prob_v3 = 0.5533919930458069,0.4024730324745178,0.2736958861351013,0.18357285857200623,0.12318982928991318,2.5441012382507324,0.12207130342721939,0.08019126206636429,0.052229318767786026,0.03377225250005722 - loss_v3 = 17.15770149230957 policybased.js:274:17
Epoch 0 - policy entropy = 3.92857027053833 policybased.js:181:29
train C game.js:659:17
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 78, numDataBuffers: 77, numBytes: 7424 }
game.js:660:17
after train game.js:663:13
Object { unreliable: false, numBytesInGPU: 8808, numTensors: 73, numDataBuffers: 73, numBytes: 7144 }
game.js:664:13
====================== game.js:680:17
Episode 5 game.js:681:17
  episode reward : 9 game.js:682:17
  mean reward    : 15.666666666666666 game.js:683:17
  max reward    : 42 game.js:684:17
====================== game.js:685:17
Scene launched in RL_TRAIN mode game.js:105:9
Object { unreliable: false, numBytesInGPU: 9012, numTensors: 75, numDataBuffers: 75, numBytes: 7188 }
game.js:106:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 9012, numTensors: 75, numDataBuffers: 75, numBytes: 7188 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 9012, numTensors: 75, numDataBuffers: 75, numBytes: 7188 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 9012, numTensors: 75, numDataBuffers: 75, numBytes: 7188 }
game.js:565:9
Erreur dans les liens source : request failed with status 404
URL de la ressource : https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0
URL du lien source : tf.min.js.map[En savoir plus]
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 9012, numTensors: 74, numDataBuffers: 74, numBytes: 7148 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 9012, numTensors: 74, numDataBuffers: 74, numBytes: 7148 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 9012, numTensors: 74, numDataBuffers: 74, numBytes: 7148 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 9012, numTensors: 74, numDataBuffers: 74, numBytes: 7148 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 9012, numTensors: 74, numDataBuffers: 74, numBytes: 7148 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 9012, numTensors: 74, numDataBuffers: 74, numBytes: 7148 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 9012, numTensors: 74, numDataBuffers: 74, numBytes: 7148 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 9012, numTensors: 74, numDataBuffers: 74, numBytes: 7148 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 9012, numTensors: 74, numDataBuffers: 74, numBytes: 7148 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 9012, numTensors: 74, numDataBuffers: 74, numBytes: 7148 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 9012, numTensors: 74, numDataBuffers: 74, numBytes: 7148 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 9012, numTensors: 74, numDataBuffers: 74, numBytes: 7148 }
game.js:565:9
before value model predict game.js:533:9
Object { unreliable: false, numBytesInGPU: 9012, numTensors: 74, numDataBuffers: 74, numBytes: 7148 }
game.js:534:9
before policy model predict game.js:546:9
Object { unreliable: false, numBytesInGPU: 9012, numTensors: 74, numDataBuffers: 74, numBytes: 7148 }
game.js:547:9
after policy model predict game.js:564:9
Object { unreliable: false, numBytesInGPU: 9012, numTensors: 74, numDataBuffers: 74, numBytes: 7148 }