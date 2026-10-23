// BioStitched test 4: needle motion
//
// The Z servo drives the needle down through the fabric and back up.
// The rotation servo turns the needle 180 degrees so the hook catches the thread.
//
// Wiring: Z servo signal to D11, rotation servo signal to D12.
// Power: both servos from the 5 V UBEC, grounds joined to the Arduino.
// The sketch moves one servo at a time on purpose: two MG996R servos
// starting together can pull the supply down and reset the board.
//
// Expected: pierce, rotate, retract, rotate back, then a pause, over and over.
// Keep your fingers clear of the needle while this runs.

#include <Servo.h>

Servo zServo;
Servo rotServo;

const int Z_PIN = 11;
const int ROT_PIN = 12;

const int Z_UP = 30;      // tune: needle tip just clear of the fabric
const int Z_DOWN = 120;   // tune: needle tip through the fabric

// Pulled in from 0 and 180 so the servo doesn't stall at its end stops.
// Adjust until the hook faces exactly the opposite way at FACE_B.
const int FACE_A = 10;
const int FACE_B = 170;

const int SETTLE_MS = 500;

void setup() {
  zServo.attach(Z_PIN);
  rotServo.attach(ROT_PIN);
  zServo.write(Z_UP);
  rotServo.write(FACE_A);

  Serial.begin(9600);
  Serial.println("Test 4: needle motion. Keep fingers clear.");
  delay(1500);
}

void loop() {
  zServo.write(Z_DOWN);
  Serial.println("Pierce");
  delay(SETTLE_MS);

  rotServo.write(FACE_B);
  Serial.println("Rotate 180");
  delay(SETTLE_MS);

  zServo.write(Z_UP);
  Serial.println("Retract");
  delay(SETTLE_MS);

  rotServo.write(FACE_A);
  Serial.println("Rotate back");
  delay(SETTLE_MS);

  delay(1500);
}
