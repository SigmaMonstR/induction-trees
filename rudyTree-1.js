//JavaScript for an ID3 Decision Tree


//rootNode: calculation of root entropy 
//Note: target value should be binary (0/1)
//Example: rootNode(examp, "target")
function rootNode(obj, target_var){
    var pos = 0;
    var neg = 0;
    for(var i = 0; i < obj.length; i++){
        if(obj[i][target_var] == 1){
            pos = pos + 1;
        } else {
            neg = neg + 1;
        }
    }
    tot = pos + neg;
    pos1 = Math.log2(pos/tot)*pos/tot
    neg1 = Math.log2(neg/tot)*neg/tot
    if(isNaN(pos1) || !isFinite(pos1)){
        pos1 = 0
    }
    if(isNaN(neg1) || !isFinite(neg1)){
        neg1 = 0
    }
    
    return  -(pos1 + neg1);
}

//unique -- get list of unique values
function uniqueList(obj, input_var){
    var temp = [];
   for(var i = 0; i < obj.length; i++){
       if(temp.indexOf(obj[i][input_var])==-1){
           temp.push(obj[i][input_var]);
       }
   }
    return(temp)
}

//giniIndex: calculate entropy with respect to variable, return 
function giniIndex(obj, target_var, input_var){
    
    rootEnt = rootNode(obj,target_var);

    //Variable breakage
    if(typeof(obj[input_var]=="number")){
        console.log("it's a number!");
        x = uniqueList(obj,input_var).sort();
        console.log(x);
        
        //Count aboves and belows
        info_gain = [];
        for(var k = 0; k < x.length; k++){ //use x-vals as thresholds

            var pos_above = 0;
            var neg_above = 0;
            var pos_below = 0;
            var neg_below = 0;
            var n_above = 0;
            var n_below = 0;
            
             for(var i = 0; i < obj.length; i++){ // go through each row
                    
                    if(obj[i][input_var] >= x[k]){
                        
                        n_above = n_above + 1;
                        
                        if(obj[i][target_var]>0){
                            pos_above = pos_above + 1;
                        } else{
                            neg_above = neg_above + 1;
                        }
                        
                    } else {
                        n_below = n_below + 1;
                        
                        if(obj[i][target_var]>0){
                            pos_below = pos_below + 1
                        } else{
                            neg_below = neg_below + 1
                        }
                    }
                     
             //Calculate weighted entropy       
                n = n_above + n_below;
                pos1 = Math.log2(pos_above/n_above)*pos_above/n_above;
                neg1 = Math.log2(neg_above/n_above)*neg_above/n_above;
                pos2 = Math.log2(pos_below/n_below)*pos_below/n_below;
                neg2 = Math.log2(neg_below/n_below)*neg_below/n_below;
                 
            //Check for NaN or Infine Errors
                if(isNaN(pos1) || !isFinite(pos1)){
                    pos1 = 0;
                }
                if(isNaN(pos2) || !isFinite(pos2)){
                    pos2 = 0;
                }
                  if(isNaN(neg2) || !isFinite(neg2)){
                    neg2 = 0;
                }
                if(isNaN(neg1) || !isFinite(neg1)){
                    neg1 = 0;
                }
            }
            gini=  rootEnt - (n_above/n)*(pos1 + neg1) - (n_below/n)*(pos2 + neg2) ; 
            console.log(gini);
            info_gain.push(gini);
        }

        //Returns value
        return {"var_name":input_var,"optimal": x[info_gain.indexOf(min(info_gain))], "info_gain":min(info_gain)} ;
    }
}

//Min of array
function min(numArray) {
  return Math.min.apply(null, numArray);
}

//Max of array
function max(numArray) {
  return Math.max.apply(null, numArray);
}

//Return min value of attribute in array
function returnMin(obj,input_var){
    temp = []
    for(i=0; i<inputs.length; i++){
        temp.push(obj[i][input_var])
    }
    
    return temp.indexOf(min(temp))
}

//Return min value of attribute in array
function returnMin(obj,input_var){
    temp = []
    for(i=0; i<inputs.length; i++){
        temp.push(obj[i][input_var])
    }
    
    return temp.indexOf(min(temp))
}


//Given an input vectors, find the best split 
//Input Values: input_vector, obj, target_var
//Output Values: 
function candidateSplit(obj, input_vector, target_var){
    comp = [];
    for(i=0; i<input_vector.length; i++){
        res = giniIndex(obj,target_var, input_vector[i]);
        comp.push(res);
    }
    opt = comp[returnMin(comp,"info_gain")]
    return opt
}


//Stats In Node
function nodeStats(obj,target_var){
    n = obj.length
    pr_true = 0
    for(i = 0; i < obj.length; i++){
        pr_true = obj[i][target_var] + pr_true
    }
    summary = {"n": n, "num_true": pr_true, "pr_true": pr_true/n}
    
    return summary
}


//Given the best candidate, split the data
//Input Values: obj, optimum
//Output Values: 
function nodeSplit(obj, optimum ){
    var left = [];
    var right = [];
    if(typeof(optimum.optimal)=="number"){
        for(i=0; i<obj.length; i++){
            if(obj[i][optimum.var_name]>optimum.optimal){
                left.push(obj[i]);
            } else{
                right.push(obj[i]);
            };
        };
    };
    
    nest =  {"l": left, "r": right};
    return nest
}

//Update object using dot notation
function nodeOverwrite(object, path, value){
  var stack = path.split('.');
  while(stack.length>1){
    object = object[stack.shift()];
  }
  object[stack.shift()] = value;
}

//binaryTree
function binaryTree(obj, input_vec, target_var, min_node){
     
    //placeholder
    output = {"stats":[], "data":[]};

    //first round: base split
    opt = candidateSplit(obj, inputs, target_var)
    
    //first split
    nested = nodeSplit(obj,opt);
    output.data = nested; // Slot in first data
    key_list = Object.keys(nested);
    stat = {"l": nodeStats(nested[key_list[0]],target_var),"r": nodeStats(nested[key_list[1]],target_var)}
    output.stats = stat //Slot in first stats
    
  
    //Grow tree
    counter = key_list.length;
    
    while (counter != 0) {
      console.log(key_list);
        //Check to see if node minimum has already been met
        if(eval("output.stats."+key_list[0]).n <= min_node ){
                key_list.splice(0,1);

            } else{
                //Calculate optimum split among variables
                    opt = candidateSplit(eval("output.data."+key_list[0]), inputs, target_var);

                //Split based on best
                    nested = nodeSplit(eval("output.data."+key_list[0]),opt);

                if(nested.l.length ==0 || nested.r.length ==0 || nested.r.length <= min_node){
                    key_list.splice(0,1);
                    console.log("end node")
                }  else {
                    //Pushed split arrays into output
                    nodeOverwrite(output,"data."+key_list[0],nested)

                //Update statistical summary
                    key_list2 = Object.keys(nested);
                    stat = {"l": nodeStats(nested[key_list2[0]],target_var),"r": nodeStats(nested[key_list2[1]],target_var)}
                    nodeOverwrite(output,"stats."+key_list[0],stat)

                    //Add new branches
                    key_list.push(key_list[0]+"."+key_list2[0])
                    key_list.push(key_list[0]+"."+key_list2[1])
                }
            }
        counter = key_list.length;
    }
    return output;
}
