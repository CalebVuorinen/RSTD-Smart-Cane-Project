
#include <SPI.h>
#include <WiFiNINA.h>
#include <Arduino.h>
#include <TinyGPS++.h>
#include "arduino_secrets.h" 
///////please enter your sensitive data in the Secret tab/arduino_secrets.h

char ssid[] = SECRET_SSID;    // your network SSID (name)
char pass[] = SECRET_PASS;    // your network password (use for WPA, or use as key for WEP)

int status = WL_IDLE_STATUS;     // the Wifi radio's status
TinyGPSPlus gps;
WiFiClient client;

const char WEBSITE[] = "rstd-smart-cane.herokuapp.com";

void setup() {
  //Initialize serial and wait for port to open:
  Serial.begin(9600);
  Serial1.begin(9600); //GPS
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  // check for the WiFi module:
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    // don't continue
    while (true);
  }

  String fv = WiFi.firmwareVersion();
  if (fv < "1.0.0") {
    Serial.println("Please upgrade the firmware");
  }

  // attempt to connect to Wifi network:
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to WPA SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network:
    status = WiFi.begin(ssid, pass);

    // wait 10 seconds for connection:
    delay(10000);
  }

  // you're connected now, so print out the data:
  Serial.print("You're connected to the network");
  printCurrentNet();
  printWifiData();

}

void loop() {
// print your MAC address:
    byte mac[6];
    WiFi.macAddress(mac);
    String m = mac2String(mac);
    Serial.print("MAC address: ");
    Serial.print(m);
// form postMessage
    if (client.connect(WEBSITE, 80)) {
      Serial.println("connected to client");
      String postMessage = "api/customers/location?mac=";
      while (Serial1.available() > 0)
      if (gps.encode(Serial1.read())){
      postMessage += m;
      postMessage += "&latitudeData=" + (String) gps.location.lat()
      + "&longitudeData=" + (String) gps.location.lng()
      + "&dateData=" + (String) gps.date.day() + "/" + (String) gps.date.month() + "/" + (String) gps.date.year()
      + "&timeData=";
      if (gps.time.hour() < 10) postMessage = postMessage + "0";
          postMessage = postMessage + (String) gps.time.hour();
          postMessage = postMessage + ":";
          if (gps.time.minute() < 10) postMessage = postMessage + "0";
          postMessage = postMessage + (String) gps.time.minute();
          postMessage = postMessage + ":";
          if (gps.time.second() < 10) postMessage = postMessage + "0";
          postMessage = postMessage + (String) gps.time.second();
          postMessage = postMessage + ".";
          if (gps.time.centisecond() < 10) postMessage = postMessage + "0";
          postMessage = postMessage + (String) gps.time.centisecond();

    }
// Make a HTTP request:
      Serial.println("making POST request");
      client.print("POST "); client.print(postMessage); client.println(" HTTP/1.1");
      client.println("Host: rstd-smart-cane.herokuapp.com");
      client.println("User-Agent: Arduino/1.0");
      client.println("Connection: keep-alive");
      client.println("Content-Type: text/plain; charset=utf-8");
      client.print("Content-Length: ");
      client.println(postMessage.length());
      client.println();
      client.println(postMessage);
      Serial.println("\nData sent");

// response
      char c; String dataStr;
      while(client.connected() || client.available()) {
        c = client.read();    //read first character
        dataStr += c;
      }
      Serial.println(dataStr);

  }
  
}

void printWifiData() {
  // print your board's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
  Serial.println(ip);

}

void printCurrentNet() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.println(rssi);

  // print the encryption type:
  byte encryption = WiFi.encryptionType();
  Serial.print("Encryption Type:");
  Serial.println(encryption, HEX);
  Serial.println();
}

String mac2String(byte mac[]){
  char buf[20];
  snprintf(buf, sizeof(buf), "%02x:%02x:%02x:%02x:%02x:%02x",
           mac[5], mac[4], mac[3], mac[2], mac[1], mac[0]);
  return String(buf);
}
