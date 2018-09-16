<?xml version="1.0" encoding="UTF-8"?>
<tileset name="rock_tileset" tilewidth="70" tileheight="70" tilecount="6" columns="0">
 <grid orientation="orthogonal" width="1" height="1"/>
 <tile id="5">
  <image width="70" height="70" source="rock_empty.png"/>
 </tile>
 <tile id="6">
  <image width="70" height="70" source="rock_full.png"/>
  <objectgroup draworder="index">
   <object id="1" x="0" y="0" width="70" height="70"/>
  </objectgroup>
 </tile>
 <tile id="7">
  <image width="70" height="70" source="rock_right_right.png"/>
  <objectgroup draworder="index">
   <object id="1" x="0" y="70">
    <polygon points="0,0 70,-70 70,0"/>
   </object>
  </objectgroup>
 </tile>
 <tile id="8">
  <image width="70" height="70" source="rock_right_left.png"/>
  <objectgroup draworder="index">
   <object id="1" x="0" y="0">
    <polygon points="0,0 70,0 0,70"/>
   </object>
  </objectgroup>
 </tile>
 <tile id="9">
  <image width="70" height="70" source="rock_left_right.png"/>
  <objectgroup draworder="index">
   <object id="2" x="0" y="0">
    <polygon points="0,0 70,0 70,70"/>
   </object>
  </objectgroup>
 </tile>
 <tile id="10">
  <image width="70" height="70" source="rock_left_left.png"/>
  <objectgroup draworder="index">
   <object id="1" x="0" y="0">
    <polygon points="0,0 70,70 0,70"/>
   </object>
  </objectgroup>
 </tile>
</tileset>
