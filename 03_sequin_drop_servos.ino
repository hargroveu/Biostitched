// BioStitched test 3: release one sequin at a time with two servos
//
// Two gates under the sequin magazine work as an escapement:
//   the lower gate holds up the stack,
//   the upper gate pins the stack just above the bottom sequin,
// so opening the lower gate lets exactly one sequin fall.
//
// Wiring: upper gate servo signal to D9, lower gate servo signal to D10.
//   On the CNC Shield these pins come out on the limit-switch headers; if you
//   have switches there, move the servos to free pins and change the numbers below.
// Power: run the servos from the 5 V UBEC, not the Arduino's 5V pin,
//   and connect the UBEC's ground to the Arduino's GND.
//
// Expected: one sequin drops every two seconds.
// Tune the OPEN and CLOSED angles to your printed gates. Keep them between
// 10 and 170 so the servos never strain against their end stops.

#include <Servo.h>

Servo upperGate;
Servo lowerGate;

const int UPPER_PIN = 9;
const int LOWER_PIN = 10;

const int UPPER_OPEN = 20;
const int UPPER_CLOSED = 110;
const int LOWER_OPEN = 20;
const int LOWER_CLOSED = 110;

const int SETTLE_MS = 300;   // time for a gate to finish moving

void releaseOneSequin() {
  upperGate.write(UPPER_CLOSED);   // 1. pin the stack above the bottom sequin
  delay(SETTLE_MS);
  lowerGate.write(LOWER_OPEN);     // 2. open the bottom: one sequin falls
  delay(SETTLE_MS);
  lowerGate.write(LOWER_CLOSED);   // 3. close the bottom again
  delay(SETTLE_MS);
  upperGate.write(UPPER_OPEN);     // 4. let the stack drop onto the closed lower gate
  delay(SETTLE_MS);
}

void setup() {
  upperGate.attach(UPPER_PIN);
  lowerGate.attach(LOWER_PIN);

  upperGate.write(UPPER_OPEN);     // starting position: stack resting on the lower gate
  lowerGate.write(LOWER_CLOSED);

  Serial.begin(9600);
  Serial.println("Test 3: sequin drop. Load the magazine and watch the gates.");
  delay(1000);
}

void loop() {
  releaseOneSequin();
  Serial.println("Sequin released");
  delay(2000);
}
