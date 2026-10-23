// BioStitched test 1: flash test
//
// Checks that the Arduino Uno, the USB cable and the Arduino IDE all work
// before anything else is connected. Run it with the CNC Shield off the board
// and the 12 V supply unplugged.
//
// Upload: Tools > Board > Arduino Uno, Tools > Port > your board, then Upload.
// Expected: the small LED marked "L" blinks once a second, and the
// Serial Monitor (set to 9600 baud) counts each blink.

int blinkCount = 0;

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("BioStitched flash test: the upload worked.");
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(500);
  digitalWrite(LED_BUILTIN, LOW);
  delay(500);

  blinkCount++;
  Serial.print("Blink ");
  Serial.println(blinkCount);
}
