// BioStitched test 2: drive both X-axis motors together
//
// Board: Arduino Uno with a CNC Shield V3 and two A4988 or TMC2208 drivers.
//   X motor 1 in the shield's X socket (STEP D2, DIR D5)
//   X motor 2 in the shield's Y socket (STEP D3, DIR D6)
// Power: 12 V to the shield's power terminals. Never 5 V: the motors will
// only buzz. Set each driver's current limit (Vref) before you start.
//
// Expected: both motors move the gantry 50 mm forward, pause, come back,
// and repeat, in step with each other.
//
// Needs the AccelStepper library: Sketch > Include Library > Manage Libraries,
// search for AccelStepper and install it.

#include <AccelStepper.h>

const int ENABLE_PIN = 8;   // shared enable pin on the CNC Shield; LOW turns the drivers on

// Steps per mm = (motor steps per turn x microsteps) / mm travelled per turn.
//   GT2 belt, 20-tooth pulley, 1/16 microstepping:  (200 x 16) / 40 = 80
//   TR8x2 lead screw, 1/16 microstepping:           (200 x 16) / 2  = 1600
// With a lead screw, also drop TEST_DISTANCE_MM to about 5 so the test stays short.
const float STEPS_PER_MM = 80.0;
const float TEST_DISTANCE_MM = 50.0;

// If the two motors face each other, one will turn the wrong way. Set this to true.
const bool INVERT_X2 = false;

AccelStepper x1(AccelStepper::DRIVER, 2, 5);   // STEP, DIR
AccelStepper x2(AccelStepper::DRIVER, 3, 6);

void moveBoth(long target) {
  x1.moveTo(target);
  x2.moveTo(target);
  while (x1.distanceToGo() != 0 || x2.distanceToGo() != 0) {
    x1.run();
    x2.run();
  }
}

void setup() {
  pinMode(ENABLE_PIN, OUTPUT);
  digitalWrite(ENABLE_PIN, LOW);

  // Identical settings keep the two motors in step. Start slow; raise later.
  x1.setMaxSpeed(800);       // steps per second
  x1.setAcceleration(400);   // steps per second, per second
  x2.setMaxSpeed(800);
  x2.setAcceleration(400);
  x2.setPinsInverted(INVERT_X2, false, false);

  x1.setCurrentPosition(0);
  x2.setCurrentPosition(0);

  Serial.begin(9600);
  Serial.println("Test 2: dual X-axis. Clear the gantry's path.");
  delay(2000);
}

void loop() {
  long steps = (long)(TEST_DISTANCE_MM * STEPS_PER_MM);

  Serial.println("Forward");
  moveBoth(steps);
  delay(1000);

  Serial.println("Back");
  moveBoth(0);
  delay(1000);
}
