#include <Servo.h>
#include <Stepper.h>
#include <SoftwareSerial.h>


SoftwareSerial esp(5, 6);

SoftwareSerial slave(9, 10); //porta seriale per arduino usato per cambio marce

byte command[] = {0, 0, 0, 0, 0};
byte slaveCommands[] = {0, 0};

bool idle;

byte gas; //numero tra 0 e 180
byte steer; //numero tra 0 e 100 dove 50 è dritto
byte gear; // numero 17, 34, 68; gradi: 1 = +1 giro, 2 = -1 giro, 3 = 0 giri

byte steerCorrectorFactor = 0; //moltiplicatore sterzo tra 0 e 100
/* Procedimento per trovare l'angolo di sterzo:
 *  prendere il fattore di correzione tra 0 e 100 e trovare il fattore di correzione: c=(5/ln(2))x+500/ln(2)
 *  se l'angolo di sterzo è maggiore di 50 allora i gradi di sterzo sono dati dalla formula: a=90e^((x-50)/(c*g))-90
 *  se l'angolo di sterzo è minore di 50 allora i gradi di sterzo sono dati dalla formula: a=-90e^(-((x-50)/(c*g)))+90
 *  dove g = 0.1 se la marcia è la 1, 0.15 se la marcia è la 2, 0.3 se la marcia è la 3
 */
byte gearSpeedUp = 100; //velocità di cambiata in salita tra 0 e 100
byte gearSpeedDown = 100; //velocità di cambiata in discesa tra 0 e 100

int oldGear = 1;
int str = 64;

Servo steerServo;

void setup() {

  Serial.begin(9600);
  esp.begin(115200); 
  steerServo.attach(11);
}
void doGas(byte g) {
  //Accelerare
  gas = g;
  Serial.print("Gas ---> ");
  Serial.println(g);
}

void doSteer(byte s, byte steerCorrectorFactor) {
  double c=(5/log(2))*steerCorrectorFactor+500/log(2);
  double a;
  double g;
  if (gear == 1) {
    g = 0.1;
    c = 500/log(2);
  } else if (gear == 2) {
    g = 0.15;
  } else if (gear == 3) {
    g = 0.3;
  }
  if (steer >= 50) {
    a=90*exp((s-50)/(c*g));
  } else {
    a=-1*90*exp(-1*((s-50)/(c*g)))+180;
  }
  //Sterzare di a gradi
  steer = a;
  steerServo.write(a);
  Serial.print("Steer ---> ");
  Serial.println(a);
}


bool doGear(byte gear) {
    slave.write(gear);
    idle = true;
    if (slave.available()>=2) {
      idle = false;
      for (int i=0; i<2; i++) {
        slaveCommands[i] = esp.read();
      }
      if(slaveCommands[1]>128) {
        oldGear = slaveCommands[0];
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
}

void updateGSU(byte gsu) {
  gearSpeedUp = gsu;
  Serial.print("GSU ---> ");
  Serial.println(gearSpeedUp);
}
void updateGSD(byte gsd) {
  gearSpeedDown = gsd;
  Serial.print("GSD ---> ");
  Serial.println(gearSpeedDown);
}
void updateSCF(byte scf) {
  steerCorrectorFactor = scf;
  Serial.print("SCF ---> ");
  Serial.println(steerCorrectorFactor);
  
}
void loop() {
  while (esp.available()>=5){
    
    //lettura dati da esp
    Serial.println("RECIEVING: ");
    for (int i=0; i<5; i++) {
      command[i] = esp.read();
      Serial.print("Reading ---> ");
      Serial.println(command[i]);
    }
    
    //controllo del crc con tolleranza 2 e della marcia
    boolean a;
    if (command[2] != 0) {
      byte tollerance = 2;
       a = (command[4] <=(command[1]+command[2]+command[3])/2+tollerance && command[4] >= (command[1]+command[2]+command[3])/2-tollerance);
    } else {
      a = false;
    }

    //elaborazione dati
    if (a) {
      Serial.println("---------   Valid commands  ---------");
      if (command[0] == 0) { //comandi drive
        Serial.println("DRIVING: ");
        doGas(command[1]);
        doSteer(command[3], steerCorrectorFactor);
        if(oldGear != command[2]) {
          bool res = doGear(command[2]);
          if(res && !idle) {
              esp.write(192); //tutto ok
          } else if (!res && !idle) {
            esp.write(80); //cambio marcia fallito
          }
        } else {
          if (idle) {
              esp.write(140); //marcia in attesa
            }else {
              esp.write(200);
            }
          }          
      } else { //comandi setup
        Serial.println("SETUP: ");
        updateGSU(command[1]);
        updateGSD(command[2]);
        updateSCF(command[3]);
        esp.write(192);
      }
    } else {
      esp.write(32);  //invalido
    }
  }
}
