// BioStitched test 5: one full stitch cycle, repeated
//
// Puts tests 2, 3 and 4 together: drop a sequin, pierce, rotate,
// retract, rotate back, then move on by one stitch length.
// Run tests 1 to 4 first, then copy your tuned angles and STEPS_PER_MM in here.
//
// Wiring is the same as in tests 2, 3 and 4:
//   X motors: X socket (D2, D5) and Y socket (D3, D6), enable D8
//   Sequin gates: D9 (upper) and D10 (lower)
//   Needle: Z servo D11, rotation servo D12
// Power: 12 V to the shield for the motors; 5 V UBEC for all four servos,
// with the grounds joined.
//
// Expected: STITCHES stitches, then the motors switch off.
// Press the Arduino's reset button to run it again.
//
// Needs the AccelStepper library.

#include <Servo.h>
#include <AccelStepper.h>

// ---- pins ----
const int ENABLE_PIN = 8;
const int UPPER_GATE_PIN = 9;
const int LOWER_GATE_PIN = 10;
const int Z_PIN = 11;
const int ROT_PIN = 12;

// ---- tuned values (copy yours from tests 2 to 4) ----
const int UPPER_OPEN = 20;
const int UPPER_CLOSED = 110;
const int LOWER_OPEN = 20;
const int LOWER_CLOSED = 110;
const int Z_UP = 30;
const int Z_DOWN = 120;
const int FACE_A = 10;
const int FACE_B = 170;
const int SETTLE_MS = 400;

const float STEPS_PER_MM = 80.0;
const float STITCH_LENGTH_MM = 3.0;   // also the sequin spacing
const int STITCHES = 10;
const bool INVERT_X2 = false;

Servo upperGate;
Servo lowerGate;
Servo zServo;
Servo rotServo;
AccelStepper x1(AccelStepper::DRIVER, 2, 5);
AccelStepper x2(AccelStepper::DRIVER, 3, 6);

int stitchCount = 0;

void settle() {
  delay(SETTLE_MS);
}

void dropSequin() {
  upperGate.write(UPPER_CLOSED); settle();
  lowerGate.write(LOWER_OPEN);   settle();
  lowerGate.write(LOWER_CLOSED); settle();
  upperGate.write(UPPER_OPEN);   settle();
}

void advance(float mm) {
  long target = x1.currentPosition() + (long)(mm * STEPS_PER_MM);
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

  x1.setMaxSpeed(800);
  x1.setAcceleration(400);
  x2.setMaxSpeed(800);
  x2.setAcceleration(400);
  x2.setPinsInverted(INVERT_X2, false, false);
  x1.setCurrentPosition(0);
  x2.setCurrentPosition(0);

  upperGate.attach(UPPER_GATE_PIN);
  lowerGate.attach(LOWER_GATE_PIN);
  zServo.attach(Z_PIN);
  rotServo.attach(ROT_PIN);

  upperGate.write(UPPER_OPEN);
  lowerGate.write(LOWER_CLOSED);
  zServo.write(Z_UP);
  rotServo.write(FACE_A);

  Serial.begin(9600);
  Serial.println("Test 5: stitch cycle. Hoop a scrap of fabric and thread the hook.");
  delay(3000);
}

void loop() {
  if (stitchCount >= STITCHES) {
    digitalWrite(ENABLE_PIN, HIGH);   // finished: switch the stepper drivers off
    return;
  }

  dropSequin();
  zServo.write(Z_DOWN);   settle();   // pierce
  rotServo.write(FACE_B); settle();   // rotate 180: the hook catches the thread
  zServo.write(Z_UP);     settle();   // retract: a loop comes up through the fabric
  rotServo.write(FACE_A); settle();   // rotate back to face A
  advance(STITCH_LENGTH_MM);          // move on by one stitch length

  stitchCount++;
  Serial.print("Stitch ");
  Serial.println(stitchCount);
}
