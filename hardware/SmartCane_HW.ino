/*

 This example connects to an unencrypted Wifi network.
 Then it prints the  MAC address of the Wifi module,
 the IP address obtained, and other network details.

 created 13 July 2010
 by dlf (Metodo2 srl)
 modified 31 May 2012
 by Tom Igoe
 */

#include <SPI.h>
#include <WiFiNINA.h>
#include <ArduinoHttpClient.h>
#include <Arduino.h>
#include <TinyGPS++.h>
#include "arduino_secrets.h" 
///////please enter your sensitive data in the Secret tab/arduino_secrets.h

char ssid[] = SECRET_SSID;        // your network SSID (name)
char pass[] = SECRET_PASS;    // your network password (use for WPA, or use as key for WEP)

int status = WL_IDLE_STATUS;     // the Wifi radio's status
TinyGPSPlus gps;

const char WEBSITE[] = "rstd-smart-cane.herokuapp.com";
const char path[] = "/api/customers/location?";
int port = 8080;

WiFiClient client;
//HttpClient client = HttpClient(wifi, WEBSITE, port);
String response;
int statusCode = 0;

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
    Serial.print("MAC address: ");
    printMacAddress(mac);
// Print GPS data
  /*while (Serial1.available() > 0)
    if (gps.encode(Serial1.read())){
      // location
      Serial.print(F("Location: ")); 
      if (gps.location.isValid())
      {
        Serial.print(gps.location.lat(), 6);
        Serial.print(F(","));
        Serial.print(gps.location.lng(), 6);
        }
      else
      {
        Serial.print(F("INVALID"));
      }
      // date
      Serial.print(F("  Date/Time: "));
      if (gps.date.isValid())
      {
        Serial.print(gps.date.month());
        Serial.print(F("/"));
        Serial.print(gps.date.day());
        Serial.print(F("/"));
        Serial.print(gps.date.year());
      }
      else
      {
        Serial.print(F("INVALID"));
      }
      // time
      Serial.print(F(" "));
      if (gps.time.isValid())
      {
        if (gps.time.hour() < 10) Serial.print(F("0"));
        Serial.print(gps.time.hour());
        Serial.print(F(":"));
        if (gps.time.minute() < 10) Serial.print(F("0"));
        Serial.print(gps.time.minute());
        Serial.print(F(":"));
        if (gps.time.second() < 10) Serial.print(F("0"));
        Serial.print(gps.time.second());
        Serial.print(F("."));
        if (gps.time.centisecond() < 10) Serial.print(F("0"));
        Serial.print(gps.time.centisecond());
      }
      else
      {
        Serial.print(F("INVALID"));
      }
    Serial.println();
    } */
    String m = mac2String(mac);
// form postMessage
    /*if (client.connect(WEBSITE, 80)) {
      Serial.println("connected");
      String postMessage = "";
      while (Serial1.available() > 0)
      if (gps.encode(Serial1.read())){
      postMessage += "mac=123";
      postMessage += "&latitudeData=" + String(gps.location.lat())
      + "&longitudeData=" + gps.location.lng()
      + "&dateData=" + gps.date.day() + "/" + gps.date.month() + "/" + gps.date.year()
      + "&timeData=";
      if (gps.time.hour() < 10) postMessage = postMessage + "0";
          postMessage = postMessage + gps.time.hour();
          postMessage = postMessage + ":";
          if (gps.time.minute() < 10) postMessage = postMessage + "0";
          postMessage = postMessage + gps.time.minute();
          postMessage = postMessage + ":";
          if (gps.time.second() < 10) postMessage = postMessage + "0";
          postMessage = postMessage + gps.time.second();
          postMessage = postMessage + ".";
          if (gps.time.centisecond() < 10) postMessage = postMessage + "0";
          postMessage = postMessage + gps.time.centisecond();
      }

    }*/
// Make a HTTP request:
  Serial.println("making POST request");
  String postData = "mac=123&latitudeData=65.00&longitudeData=25.47&dateData=7/12/2018&timeData=21:21:27.00";

  if (client.connect(WEBSITE, 80)) {
    Serial.println("Connected to http client");
    client.println("POST /api/customers/location? HTTP/1.1");
    client.println("Host:  rstd-smart-cane.herokuapp.com");
    client.println("User-Agent: Arduino/1.0");
    client.println("Connection: close");
    client.println("Content-Type: application/json;");
    client.print("Content-Length: ");
    client.println(postData.length());
    client.println();
    client.println(postData);
    Serial.println("\nData sent");
  }
  /*statusCode = client.responseStatusCode();
  response = client.responseBody();
  Serial.print("Status code: ");
  Serial.println(statusCode);
  Serial.print("Response: ");
  Serial.println(response);*/
  
}

void printWifiData() {
  // print your board's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
  Serial.println(ip);

  // print your MAC address:
  byte mac[6];
  WiFi.macAddress(mac);
  Serial.print("MAC address: ");
  printMacAddress(mac);
}

void printCurrentNet() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print the MAC address of the router you're attached to:
  byte bssid[6];
  WiFi.BSSID(bssid);
  Serial.print("BSSID: ");
  printMacAddress(bssid);

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

void printMacAddress(byte mac[]) {
  for (int i = 5; i >= 0; i--) {
    if (mac[i] < 16) {
      Serial.print("0");
    }
    Serial.print(mac[i], HEX);
    if (i > 0) {
      Serial.print(":");
    }
  }
  Serial.println();
}

String mac2String(byte mac[]){
  char buf[20];
  snprintf(buf, sizeof(buf), "%02x:%02x:%02x:%02x:%02x:%02x",
           mac[5], mac[4], mac[3], mac[2], mac[1], mac[0]);
  return String(buf);
}
