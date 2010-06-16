//Obtiene los grados que hay entre 2 pares lat-long
function getBearing(lat_start,long_start,lat_end,long_end){
  var toRad=Math.PI/180;
  var lat1 = lat_start*toRad;
  var long1 = long_start*toRad;
  var lat2 = lat_end*toRad;
  var long2 = long_end*toRad;

  var y = (Math.cos(lat1)*Math.sin(lat2))-( Math.sin(lat1)*Math.cos(lat2)*Math.cos(long2-long1))
  var x = Math.sin(long2-long1)*Math.cos(lat2);
  var brng = Math.atan2(x,y)%(2*Math.PI);
  brng  = brng*(180/Math.PI);
  if(brng < 0 ){brng = brng + 360;} //Convertir grados positivos a negativos
  return brng;
}

//Obtiene la cardinalidad dado los grados
function getDirection(bearing){
  var direction;

  if( (bearing >= 0 && bearing <= 22.5) || (bearing>337.5 && bearing<360))
  {direction="Norte"}
  else if (bearing > 22.5 && bearing <= 66.5 ){direction="Nororiente"}
  else if (bearing > 66.5 && bearing <= 117 ){direction="Oriente"}
  else if (bearing > 117 && bearing <= 157.5 ){direction="Suroriente"}
  else if (bearing > 157.5 && bearing <= 202.5 ){direction="Sur"}
  else if (bearing > 202.5 && bearing <= 247.5 ){direction="Suroccidente"}
  else if (bearing > 247.5 && bearing <= 292.5 ){direction="Occidente"}
  else if (bearing > 292.5 && bearing <=337.5  ){direction="Noroccidente"}

  return direction;
}


/*FUNCIONES PARA SABER QUE DIRECCION DEBO TOMAR DADO 2 PUNTOS CARDINALES*/
function eval_direction(comes_from, goes_to){
  var tell;

  if(comes_from == "Norte"){
    tell=where_to_turn_n(goes_to);
  }
  else if(comes_from == "Sur"){
    tell=where_to_turn_s(goes_to);
  }
  else if(comes_from == "Oriente"){
    tell=where_to_turn_e(goes_to);
  }
  else if(comes_from == "Occidente"){
    tell=where_to_turn_w(goes_to);
  }
  else if(comes_from == "Nororiente"){
    tell=where_to_turn_ne(goes_to);
  }
  else if(comes_from == "Noroccidente"){
    tell=where_to_turn_nw(goes_to);
  }
  else if(comes_from == "Suroriente"){
    tell=where_to_turn_se(goes_to);
  }
  else if(comes_from == "Suroccidente"){
    tell=where_to_turn_sw(goes_to);
  }
  return tell;
}

//NORTE
function where_to_turn_n(goes_to){
  var turn;

  if(goes_to=="Oriente"){
    turn = "a la derecha";
  }
  else if(goes_to=="Noroccidente" || goes_to=="Suroccidente"){
    turn = "ligeramente a la izquierda en dirección " + goes_to;
  }
  else if(goes_to=="Nororiente" || goes_to=="Suroriente"){
    turn = "ligeramente a la derecha en dirección " + goes_to;
  }
  else if(goes_to=="Occidente"){
    turn = "a la izquierda";
  }
  else if(goes_to=="Sur"){
    turn = "ALGO RARO PASA EN DIRECCION NORTE SUR";
  }
  return turn;
}

//OCCIDENTE
function where_to_turn_w(goes_to){
  var turn;

  if(goes_to=="Norte"){
    turn = "a la derecha";
  }
  else if(goes_to=="Noroccidente" || goes_to=="Nororiente"){
    turn = "ligeramente a la derecha en dirección " + goes_to;
  }
  else if(goes_to=="Sur"){
    turn = "a la izquierda";
  }
  else if(goes_to=="Suroccidente" || goes_to=="Suroriente"){
    turn = "ligeramente a la izquierda en dirección " + goes_to;
  }
  else if(goes_to=="Oriente"){
    turn = "ALGO RARO PASA EN DIRECCION OESTE ESTE";
  }
return turn;
}

//ORIENTE
function where_to_turn_e(goes_to){
  var turn;

  if(goes_to=="Norte"){
    turn = "a la izquierda";
  }
  else if(goes_to=="Noroccidente" || goes_to == "Nororiente"){
    turn = "ligeramente a la izquierda en dirección " + goes_to;
  }
  else if(goes_to=="Sur"){
    turn = "a la derecha";
  }
  else if(goes_to=="Suroccidente" || goes_to=="Suroriente"){
    turn = "ligeramente a la derecha en dirección " + goes_to;
  }
  else if(goes_to=="Occidente"){
    turn = "ALGO RARO PASA EN DIRECCION ESTE OESTE";
  }
  return turn;
}

//SUR
function where_to_turn_s(goes_to){
  var turn;

  if(goes_to=="Oriente"){
    turn = "a la izquierda";
  }
  else if(goes_to=="Noroccidente" || goes_to=="Suroccidente"){
    turn = "ligeramente a la derecha en dirección " + goes_to;
  }
  else if(goes_to=="Nororiente" || goes_to=="Suroriente"){
    turn = "ligeramente a la izquierda en dirección " + goes_to;
  }
  else if(goes_to=="Occidente"){
    turn = "a la derecha";
  }
  else if(goes_to=="Norte"){
    turn = "ALGO RARO PASA EN DIRECCION SUR NORTE";
  }
  return turn;
}

//SUROCCIDENTE
function where_to_turn_sw(goes_to){
  var turn;

  if(goes_to=="Norte"){
    turn = "a la derecha";
  }
  else if(goes_to=="Noroccidente" || goes_to=="Occidente"){
    turn = "ligeramente a la derecha en dirección " + goes_to;
  }
  else if(goes_to=="Sur" || goes_to=="Suroriente"){
    turn = "ligeramente a la izquierda en dirección " + goes_to;
  }
  else if(goes_to=="Oriente"){
    turn = "a la izquierda";
  }
  else if(goes_to=="Nororiente"){
    turn = "ALGO RARO PASA EN DIRECCION ESTE SUROESTE, NORESTE";
  }
  return turn;
}

//SURORIENTE
function where_to_turn_se(goes_to){
  var turn;
  if(goes_to=="Norte"){
    turn = "a la izquierda";
  }
  else if(goes_to=="Nororiente" || goes_to=="Oriente"){
    turn = "ligeramente a la izquierda en dirección " + goes_to;
  }
  else if(goes_to=="Sur" || goes_to=="Suroccidente"){
    turn = "ligeramente a la derecha en dirección " + goes_to;
  }
  else if(goes_to=="Occidente"){
    turn = "a la derecha";
  }
  else if(goes_to=="Noroccidente"){
    turn = "ALGO RARO PASA EN DIRECCION ESTE SUROESTE, NORESTE";
  }
  return turn;
}

//NOROCCIDENTE
function where_to_turn_nw(goes_to){
  var turn;

  if(goes_to=="Oriente"){
    turn = "a la derecha";
  }
  else if(goes_to=="Occidente" || goes_to=="Suroccidente"){
    turn = "ligeramente a la izquierda en dirección " + goes_to;
  }
  else if(goes_to=="Norte" || goes_to=="Nororiente"){
    turn = "ligeramente a la derecha en dirección " + goes_to;
  }
  else if(goes_to=="Sur"){
    turn = "a la izquierda";
  }
  else if(goes_to=="Suroriente"){
    turn = "ALGO RARO PASA EN DIRECCION NOROESTE SURESTE ";
  }
  return turn;
}

//NORORIENTE
function where_to_turn_ne(goes_to){
  var turn;

  if(goes_to=="Sur"){
    turn = "a la derecha";
  }
  else if(goes_to=="Norte" || goes_to=="Noroccidente"){
    turn = "ligeramente a la izquierda en dirección " + goes_to;
  }
  else if(goes_to=="Oriente" || goes_to=="Suroriente"){
    turn = "ligeramente a la derecha en dirección " + goes_to;
  }
  else if(goes_to=="Occidente"){
    turn = "a la izquierda";
  }
  else if(goes_to=="Suroccidente"){
    turn = "ALGO RARO PASA EN DIRECCION NORESTE SURESTE ";
  }
  return turn;
}

