//Since Arduino can't https, we need to use Pushingbox API (uses http)to run 
//the Google Script (uses https). Alternatly use Ivan's SecureWifi encryption

#include <Arduino.h>
#include <TinyGPS++.h>
#include <WiFi101.h>

TinyGPSPlus gps;

const char WEBSITE[] = "www.something.com"; //pushingbox API server
//const String devid = "YOUR_DEVICEID"; //device ID on Pushingbox for our Scenario

const char* MY_SSID = "YOUR SSID";
const char* MY_PWD =  "YOUR WiFi PASSWORD";


int status = WL_IDLE_STATUS;
// if you don't want to use DNS (and reduce your sketch size)
// use the numeric IP instead of the name for the server:
//IPAddress server(74,125,232,128);
byte mac[6];

void setup() {
  //Initialize serial and wait for port to open:
  Serial.begin(9600);
  while (!Serial) 
  {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  // check for the presence of the shield:
  if (WiFi.status() == WL_NO_SHIELD) {
    Serial.println("WiFi shield not present");
    // don't continue:
    while (true);
  }

  // attempt to connect to Wifi network:
  while (status != WL_CONNECTED) 
  {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(MY_SSID);
    //Connect to WPA/WPA2 network.Change this line if using open/WEP network
    status = WiFi.begin(MY_SSID, MY_PWD);
    //status = WiFi.begin(MY_SSID); //for open networks

    // wait 10 seconds for connection:
    delay(10000);
  }
  
  Serial.println("Connected to wifi");
  printWifiStatus();
  
}

void loop() {

   // Wait between measurements.
  delay(10000);
  WiFi.macAddress(mac);
  //prefer to use float, but package size or float conversion isnt working
  //will revise in future with a string fuction or float conversion function
  if (gps.encode(Serial1.read())){
    String latitudeData = (String) gps.location.lat();
    String longitudeData = (String) gps.location.lng();

    String dateData = (String) gps.date.day();
    dateData + "/";
    dateData + (String) gps.date.month();
    dateData + "/";
    dateData + (String) gps.date.year();
        
    String timeData;
    if (gps.time.hour() < 10) timeData + "0";
          timeData + gps.time.hour();
          timeData + ":";
          if (gps.time.minute() < 10) timeData + "0";
          timeData + gps.time.minute();
          timeData + ":";
          if (gps.time.second() < 10) timeData + "0";
          timeData + gps.time.second();
          timeData + ".";
          if (gps.time.centisecond() < 10) timeData + "0";
          timeData + gps.time.centisecond();
  // Check if any reads failed and exit early (to try again).
  if ((latitudeData.length()==0) || (longitudeData.length()==0) || (dateData.length()==0) || (timeData.length()==0))
  {
    Serial.println("Failed to read from GPS sensor!");
    return;
  }
  
//Here!  
  Serial.print("Lat/Long: ");
  Serial.print(latitudeData);
  Serial.print(longitudeData);
  Serial.print(" \t");
  Serial.print("Date: ");
  Serial.print(dateData);
  Serial.print("Time: ");
  Serial.print(timeData);
  Serial.print(" \t");

Serial.println("\nSending Data to Server..."); 
  // if you get a connection, report back via serial:
WiFiClient client;  //Instantiate WiFi object, can scope from here or Globally
String macStr = mac2String(mac);
    //API service using WiFi Client through PushingBox then relayed to Google
    if (client.connect(WEBSITE, 80))
      { 
         client.print("POST /something?mac=" + macStr
       + "&latitudeData=" + (String) latitudeData
       + "&longitudeData="      + (String) longitudeData
       + "&dateData="     + (String) dateData
       + "&timeData="      + (String) timeData );

      // HTTP 1.1 provides a persistent connection, allowing batched requests
      // or pipelined to an output buffer
      client.println(" HTTP/1.1"); 
      client.print("Host: ");
      client.println(WEBSITE);
      client.println("User-Agent: MKR1000/1.0");
      //for MKR1000, unlike esp8266, do not close connection
      client.println();
      Serial.println("\nData Sent"); 
      }
      }
}


void printWifiStatus() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
}

String mac2String(byte ar[]){
  String s;
  for (byte i = 0; i < 6; ++i)
  {
    char buf[3];
    sprintf(buf, "%2X", ar[i]);
    s += buf;
    if (i < 5) s += ':';
  }
  return s;
}
