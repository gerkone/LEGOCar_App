#include <Servo.h>
#include <Stepper.h>
#include <SoftwareSerial.h>



SoftwareSerial master(11, 10);

byte gear; // numero 17, 34, 68; gradi: 1 = +1 giro, 2 = -1 giro, 3 = 0 giri
int oldGear = 1;
int str = 64;
byte masterCommands[] = {0, 0}

Stepper gearShifter = Stepper(str, 8, 9, 10, 11);

bool doGear(byte g) {
  if ((g>6) && (g< 24)) {
    gear = 1;
  } else if ((g>28) && (g<46)) {
    gear = 2;
  } else if ((g>54) && (g<76)) {
    gear = 3;
  } else {
    masterCommands[0] = oldGear;
    masterCommands[1] = 32; //errore
    return false;
  }
  if (gear != oldGear) {
    if (oldGear == 1 && gear == 2) {
      gearShifter.step(-2*str);
    } else if (oldGear == 1 && gear == 3) {
      gearShifter.step(-1*str);
    } else if (oldGear == 2 && gear == 3) {
      gearShifter.step(1*str);
    } else if (oldGear == 3 && gear == 2) {
      gearShifter.step(-1*str);
    } else if (oldGear == 3 && gear == 1) {
      gearShifter.step(1*str);
    } else if (oldGear == 2 && gear == 1) {
      gearShifter.step(2*str);
    }
  }
  oldGear = gear;
  masterCommands[0] = gear;
  masterCommands[1] = 192;  //OK
  return true;
}




void setup() {
  Serial.begin(9600);
  gearShifter.setSpeed(10);
}

void loop() {
  while(master.available()>=1) {
      gear = master.read();
        if(doGear(gear)) {
          master.write(masterCommands);   
        } else {
          masterCommands[0] = oldGear;
          masterCommands[1] = 32;  //KO
          master.write(masterCommands);
        }
  }
}







