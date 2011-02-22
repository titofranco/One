//Funcion que compara con los grados que hay entre un registro y otro.
//Se hace esto porque por ejemplo si el registro i tiene 22.5 grados y el registro
//(i-1) tiene 22 grados entonces a la hora de explicar va a decir que hay que voltear
//cuando en realidad debe seguir es derecho, se va tomar un valor base de +- 15 grados
function getNewDirection(prev_dir,curr_dir,prev_bearing,curr_bearing){
  var bearing_dif;
  var new_direction;

  bearing_dif = curr_bearing - prev_bearing;
  //Caso en el que el actual es MAYOR que el anterior
  if( (bearing_dif>0 && bearing_dif<=15) && (curr_dir != prev_dir) ){
     new_direction = prev_dir;
  }//Caso en el que el actual es MENOR que el anterior
  else if( (bearing_dif<0 && bearing_dif>=-15) && (curr_dir != prev_dir)){
     new_direction = prev_dir;
  }//Caso en el que no se cumple ninguna condicion
  else{
    new_direction = curr_dir;
  }
  //console.debug("dir actual " + curr_dir+ " la direccion retornada " + new_direction);
  return new_direction;
}

//Reasigna la nueva dirección al trayecto en base al metodo getNewDirection
function reAssingDirection(infoRouteHash,size){
  var prev_bearing;
  var curr_bearing;
  var prev_dir;
  var curr_dir;

  for (var i=1;i<size-1;i++){
      prev_dir = infoRouteHash[i-1].new_direction;
      prev_bearing = infoRouteHash[i-1].bearing;
      curr_bearing = infoRouteHash[i].bearing;
      curr_dir = getNewDirection(prev_dir,infoRouteHash[i].direction,prev_bearing,curr_bearing);
      infoRouteHash[i].new_direction=curr_dir;
  }
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
    turn = "en giro en U";
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
    turn = "en giro en U";
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
    turn = "en giro en U";
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
    turn = "en giro en U";
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
    turn = "en giro en U";
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
    turn = "en giro en U";
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
    turn = "en giro en U";
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
    turn = "en giro en U";
  }
  return turn;
}

