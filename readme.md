# Logge Loggelito
The only small and lightweight logger for Node.js that gives you a complimentary bike on gcp cloud run. 

### Why?
gcp cloud run gives you a lot out of the box, by just printing to stdout the logs will be exported to stackdriver and with the correct service labeled. This library will print to stdout, add a severity and a trace. It also lets you create child loggers 