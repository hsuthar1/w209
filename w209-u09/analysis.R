setwd("C:/Users/yangyq/workspaces/ucbiyyq/w209/w209-u09")
getwd()

library(data.table)
dt <- data.table(  read.csv("C:/Temp/w209/vast-2017-1/Lekagul Sensor Data.csv") )

colnames(dt)

dt[gate.name=="entrance1",plot(car.type)]