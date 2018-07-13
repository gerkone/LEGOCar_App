#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>

const char* ssid = "Lego Car";
const char* password = "VincioGay";

int cont=0;

byte gas; //numero tra 0 e 1000
byte steer; //numero tra 0 e 100 dove 50 è dritto
byte gear; // numero 1, 2, 3; gradi: 1 = +1 giro, 2 = -1 giro, 3 = 0 giri
byte steerCorrectorFactor = 0; //moltiplicatore sterzo tra 0 e 100
/* Procedimento per trovare l'angolo di sterzo:
 *  prendere il fattore di correzione tra 0 e 100 e trovare il fattore di correzione: c=(5/ln(2))x+500/ln(2)
 *  se l'angolo di sterzo è maggiore di 50 allora i gradi di sterzo sono dati dalla formula: a=90e^((x-50)/(c*g))-90
 *  se l'angolo di sterzo è minore di 50 allora i gradi di sterzo sono dati dalla formula: a=-90e^(-((x-50)/(c*g)))+90
 *  dove g = 0.1 se la marcia è la 1, 0.15 se la marcia è la 2, 0.3 se la marcia è la 3
 */
byte gearSpeedUp = 100; //velocità di cambiata in salita tra 0 e 100
byte gearSpeedDown = 100; //velocità di cambiata in discesa tra 0 e 100

ESP8266WebServer server(80);

byte doGas(int gas) {
  return (180*gas/1000);
}

byte doGear(int g) {
  if (g == 1) {
    return 17;
  } else if (g == 2) {
    return 34;
  } else if (g == 3) {
    return 68;
  }
}

void drive() {
  //elaboro le risposte
  gas = doGas(server.arg(2).toInt());
  steer = server.arg(1).toInt();
  gear = doGear(server.arg(0).toInt());

  //calcolo il crc
  byte crc = (gas+gear+steer)/2;
  byte values[] = {0, gas, gear, steer, crc};
  
  //invio al server
  Serial.write(values, sizeof(values));
  Serial.flush();
  
  //ASPETTO LA RISPOSTA DA ARDUINO
  while (Serial.available()<1) {}
  byte response = Serial.read();
  if (response >= 128) {
    server.send(200,"text/plain", "OK");
  } else {
    server.send(500,"text/plain", "KO");
  }
  
}
void setupCar() {
  //elaboro le risposte
  gearSpeedUp = server.arg(1).toInt(); //velocità cambiata in salita
  gearSpeedDown = server.arg(0).toInt(); //velocità cambiata in discesa
  steerCorrectorFactor = server.arg(2).toInt(); //valore tra 0 e 100
  
  //calcolo il crc
  byte crc = (gearSpeedUp+gearSpeedDown+steerCorrectorFactor)/2;
  byte values[] = {1, gearSpeedUp, gearSpeedDown, steerCorrectorFactor, crc};
  
  //invio al server
  Serial.write(values, sizeof(values));
  Serial.flush();
  
  //ASPETTO LA RISPOSTA DA ARDUINO
  while (Serial.available()<1) {}
  byte response = Serial.read();
  if (response >= 128) {
    server.send(200,"text/plain", "OK");
  } else {
    server.send(500,"text/plain", "KO");
  }
}

void check() {
  server.send(200,"text/plain", "Checked");
}

void setup() {
  
  Serial.begin(115200);

  gas = 0;
  gear = 1;

  Serial.print("Setting soft-AP ... ");
  WiFi.softAP(ssid, password, 9) ? "Ready" : "Failed!";
  IPAddress assignedIP = WiFi.softAPIP();
  Serial.print("Car IP address: ");
  Serial.println(assignedIP);
  server.on("/check", check);
  server.on("/drive", drive);
  server.on("/setupCar", setupCar);
  server.begin();
  Serial.println("Car server started!");
  
}

void loop() {
  byte values[] = {0, 0, 1, 50, 25}; //crc = floor(somma / 2);
  byte values1[] = {1, 100, 50, 100, 125}; //crc = floor(somma / 2);
  if (WiFi.softAPgetStationNum() == 1) {
    server.handleClient();
    if (cont == 1) {
      cont = 0;
    }
  } else {
    if (cont == 0) {
      Serial.write(values, sizeof(values));
      Serial.write(values1, sizeof(values1));
      cont = 1;
    }
  }
  delay(20);
}
