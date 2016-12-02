##Sample data from Iris
df<-iris
colnames(df)<-gsub("\\.","_",colnames(df))
df <- df[,c(5,1:4)]
df$Species<-as.character(df$Species)

library(rjson)
library(RJSONIO)
x <- toJSON(unname(split(df, 1:nrow(df))))
write(x, "/Users/jeff/Documents/Github/rudy.js/iris.json")

