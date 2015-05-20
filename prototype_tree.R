
##BUILD TEST DATASET
##DESC: Create dataset with correlated binary values
corr_binary<-function(size,col){
  library(bindata)
  test <-data.frame(row.names=1:size)
  for(i in 1:(col/2)){
    rho <- runif(1)
    m <- matrix(c(1,rho,rho,1), ncol=2)   
    x <- rmvbin(size, margprob = c(0.5, 0.5), bincorr = m)
    test<-cbind(test,x)
  }
  colnames(test)<-paste("binary",seq(1,ncol(test),1),sep="")
  return(test)
}

##PRE-SCREEN THE DATASET
##This method assesses the base data, creates a log file that is built upon
pre_screening <- function(df, target,control_vec){
  
  #Setup
  test<-df
  control<-control_vec
  cell_min <-control[1]
  complex <- control[2]
  purity_hi <- control[3]
  purity_lo <- control[4]
  
  #Eval
  prob <- mean(test[,target],na.rm=T)
  n <- nrow(test)
  
  if(nrow(test)<=cell_min || prob<purity_lo || prob >purity_hi  ){
    stat <-"leaf"
  } else{
    stat <- "node"
  }
  log1 <- data.frame( id =0,
                      status=stat,
                      n = n,
                      split_var = as.character("/"),
                      split_side = NA, 
                      prob = prob,
                      num1 = 0,
                      var1 = as.character("_"),
                      num0 = 0,
                      var0 = as.character("_"),
                      parent_id= 0
  )
  for(l in c(1,3,5,6,7,9,11)){
    log1[,l] <- as.numeric(log1[,l])
  }
  return(list(log1,df))
}

##ENTROPY 
##Desc: For each iteration in the algorithm, entropy_hunt() will identify an
## unselected variable that maximizes the information gain criterion
entropy_hunt<-function(df,target,log,i){
  
  test<-df
  infogain <- c() 
  
  #Entropy(S)
  tot <- nrow(test)
  pos <- sum(test[,target])  
  neg <- nrow(test)-pos
  entropy_stat <- -(pos/tot)*log2(pos/tot) - (neg/tot)*log2(neg/tot)
  
  #infogain
  for(i in 1:ncol(test)){
    if(i == target){
      infogain<-rbind(infogain,NA)
    } else {
      #H1
      sub1 <- subset(test,test[,i]==1)
      tot1 <- nrow(sub1)
      pos1 <- sum(sub1[,target])
      neg1 <- tot1 - pos1
      h1 <- tot1/tot
      ent1 <- -(pos1/tot1)*log2(pos1/tot1) - (neg1/tot1)*log2(neg1/tot1)
      
      #H2
      sub2 <- subset(test,test[,i]==0)
      tot2 <- nrow(sub2)
      pos2 <- sum(sub2[,target])
      neg2 <- tot2-pos2
      h2 <- tot2/tot
      ent2 <- -(pos2/tot2)*log2(pos2/tot2) - (neg2/tot2)*log2(neg2/tot2)
      
      #Information gain
      info_gain <- entropy_stat  -(h1)*ent1 - (h2)*ent2
    }
    infogain <- rbind(infogain,info_gain)
  }
  
  
  info<-as.matrix(cbind(infogain,seq(1,nrow(infogain),1),rank(-infogain,ties.method = c("random")))) 
  info <- info[order(info[,3]),]
  info <- info[1:(nrow(info)-1),]
  
  clean<-0
  j <- 1
  while(clean==0 & j<=nrow(infogain)){
    
    if( length(grep(colnames(df)[info[j,2]],log$var1[i]))>0  || length(grep(colnames(df)[info[j,2]],log$var0[i]))>0 ){
      j<-j+1
    } else{
      clean <- 1
    }
  }
  
  return(info[j,2])
}


#DECISION()
#Desc: Function that induces a decision tree. 
#Parameters:
decision <- function(df,target_id,control_vec){
  
  #Unpack Dataframes
  test<-df
  control<-control_vec
  cell_min <-control[1]
  complex <- control[2]
  purity_hi <- control[3]
  purity_lo <- control[4]
  target<-target_id
  
  #Run Pre-screen
  templog <- pre_screening(test, target,control)
  
  #Unpack screening
  log <- data.frame(templog[1])
  data <- templog[2]
  
  #Split code
  i<-1
  loglength <- nrow(log)
  status <-"go"
  
  while(status == "go"){
    
    #If valid
    if(as.numeric(log$n[i]) > cell_min && as.numeric(log$num1[i])<= complex && !is.na(as.numeric(log$n[i])) && i <=loglength && as.numeric(log$prob[i]) > purity_lo && as.numeric(log$prob[i]) < purity_hi){
  
      #Import previous metrics
      print(i)
      id <- i
      parent_id <- log$id[i]
      num1 <- log$num1[i]
      num0 <- log$num0[i]
      var1 <- log$var1[i]
      var0 <- log$var0[i]
      
      #Run entropy search
      test1 <- as.data.frame(data[i])
      split_index <- entropy_hunt(test1,target,log,i)
      
      #make splits
      for(k in 1:2){
        split <- test1[test1[,split_index]==(k-1),]
        
        if(k==1){
          num1a = num1 
          num0a = num0+1
          var1a = var1
          var0a = paste(var0,colnames(split)[split_index],sep=", ")
        } else {
          num1a = num1 + 1
          num0a = num0 
          var1a =  paste(var1,colnames(split)[split_index],sep=", ")
          var0a = var0
        }
        
        prob<-mean(split[,target],na.rm=T)
        n<-nrow(split)
        
        if( n <= cell_min || num1 >= complex || prob>= purity_hi || prob <= purity_lo){
          stat <- "leaf"
        } else { 
          stat <- "node"
        }
        
        log0 <- data.frame( id = as.numeric(nrow(log)+1),
                            status=stat,
                            n = as.character(n),
                            split_var = colnames(split)[split_index],
                            split_side= k-1 , 
                            prob=as.character(prob),
                            num1 = num1a,
                            var1 = var1a,
                            num0 = num0a,
                            var0 = var0a,
                            parent_id= parent_id
        )
        log<-rbind(log,log0)
        data <- c(data,list(split))
        
      }
      i <- i + 1
      loglength<-nrow(log)
      
    
      } else {
      status <- "stop"
    }
  }
  for(l in c(1,3,5,6,7,9,11)){
    log[,l] <- as.numeric(log[,l])
  }

  log$status[!(log$id %in% unique(log$parent_id))]<-"leaf"
  log <- log[ as.numeric(log$n)>0,]
  
  return(log)
}

###########################
##Decision_split Example###
###########################

test<-corr_binary(100,30)
cell_min <- 5
complex <- 3
purity_hi <- 0.9
purity_lo <- 0.1

control<-c(cell_min,complex,purity_hi,purity_lo)

result <- decision(test,10,control)

##Check for terminus nodes
  sum(subset(result,result$status=="leaf")$n)
