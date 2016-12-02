//Cross tab
//example: tab(json, "input","target")
function tab(obj, input_var, target_var) {
    var result = [];
    var skip = [];
    for(var i = 0; i< obj.length; i++){
        if(skip.indexOf(i)==-1){
            //console.log("part1: "+i)
            x = obj[i][target_var];
            y = obj[i][input_var];
            
            count = [];
            for(var j = 0; j< obj.length; j++){
                //console.log(j)
                if(x == obj[j][target_var] && y == obj[j][input_var]){
                    //console.log("part1: "+i+j)
                    count++;
                    skip.push(j);
                } 
            }
            result.push({"target": x, "input": y, "count": count});
        }
    
    }
    return result;
}

// sumCol -- takes tab obj and obtains column sum for a given input value 
function sumColGroup(table, input_var, value){
    var sum = 0
    for(var i = 0; i < input_var.length; i++){
        if(table[i][input_var] == value){
             sum = table[i]["count"] + sum
        }
    }
    return sum
}

// sumCol -- takes tab obj and obtains column sum for a given input value 
function sumCol(table, input_var){
    var sum = 0
    for(var i = 0; i < input_var.length; i++){
             sum = table[i]["count"] + sum
    }
    return sum
}

<<<<<<< Updated upstream

//unique -- get list of unique values
function unique(obj, input_var){
    var temp = [];
   for(var i = 0; i < obj.length; i++){
       if(temp.indexOf(obj[i][input_var])==-1){
           temp.push(obj[i][input_var]);
       }
   }
    return(temp)
}

//print
function print(obj){
    return JSON.stringify(obj, null, "\t")
=======
//bin_var() -- Create binary var
function binVar(obj, input_var,level){
    
    for(i = 0; i < obj.length; i++){
        if(obj[i][input_var]==level){
            obj[i]["bin_"+level] = 1
        } else {
            obj[i]["bin_"+level] = 0
        }
            
    }
    

>>>>>>> Stashed changes
}
