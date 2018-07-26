getwd()
setwd("C:/Temp/w209/final")


# gets the semi-clean manual data

library(data.table)

cas <- data.table( read.csv("causes.txt", sep="\t"))

head(cas)
str(cas)


val <- data.table( read.csv("values.txt", sep="\t", na.strings="-"))

head(val)
str(val)


cntry <- data.table( read.csv("countries.txt", sep="\t"))

head(cntry)
str(cntry)




# melts the values table
val.mlt <- melt(val, id.vars=c("GBD.code"), variable.name="X.WHO.Country.code", value.name="Value")

head(val.mlt)
str(val.mlt)





# combines the values and causes and countries tables

setkey(cntry, "X.WHO.Country.code")
setkey(val.mlt, "X.WHO.Country.code")
s1 <- merge(x=cntry, y=val.mlt)
s2 <- s1[,.(
    WHO.Country.code
    ,Country
    ,GBD.code
    ,Value
      )]


setkey(cas, "GBD.code")
setkey(s2, "GBD.code")
s3 <- merge(x=cas, y=s2)
s4 <- s3[order(Country,GBD.code)]




# writes final results to disk
write.table(s4, file="world_disease_2004_v2.txt", row.names=FALSE, fileEncoding="UTF-8", sep="\t")