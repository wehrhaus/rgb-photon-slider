// This #include statement was automatically added by the Particle IDE.
#include "rgb-controls.h"

using namespace RGBControls;

// RGB led on PWN pins
Led led(D0, D1, D2); // RGB

void init()
{}

void sendMsg(String msgType, String msg)
{
    String message = msgType + " :: " + msg + " @";
    Serial.print(message);
    Serial.print(Time.timeStr());
}

void setup() {
    Serial.begin(9600);
    Particle.function("led", ledSwitcher);

}

void loop() {
    if (!Particle.connected())
    {
        sendMsg("ERROR", "Attempting to reconnect.");
        Particle.connect();
    }

}

long ledSwitcher(String command) {
    long hex = strtol(command, NULL, 16);

    int r = (hex >> 16) &0xFF;
    int g = (hex >> 8) &0xFF;
    int b = hex &0xFF;

    Color clr(r, g, b);

    led.setColor(clr);
    return 1;

}

STARTUP( init() );
