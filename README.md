# rudy.js - A ML library for JavaScript (in development)
*(Rudy: cause it might not be fun to do ML in JavaScript, but we just have to keep at it)*

###Example data
Some data for illustration
```javascript
var test_set = [{"id": 1, "target": 1, "input": 1, "input2": 2},
             {"id": 2, "target": 1, "input": 2, "input2": 3},
             {"id": 3, "target": 1, "input": 3, "input2": 4},
             {"id": 4, "target": 1, "input": 3, "input2": 4},
             {"id": 5, "target": 0, "input": 5, "input2": 5},
             {"id": 6, "target": 0, "input": 6, "input2": 6},
             {"id": 7, "target": 0, "input": 7, "input2": 7},
             {"id": 8, "target": 0, "input": 5, "input2": 8},
             {"id": 9, "target": 0, "input": 4, "input2": 3},
             {"id": 10, "target": 0, "input": 3, "input2": 5},
             {"id": 10, "target": 1, "input": 3, "input2": 6},
             {"id": 10, "target": 1, "input": 2, "input2": 8},
             {"id": 11, "target": 0, "input": 7, "input2": 9},
             {"id": 12, "target": 0, "input": 6, "input2": 0},
             {"id": 13, "target": 0, "input": 7, "input2": 4}
            ];
```

##Basic functionality - basics.js
###tab() - basic cross tabs 
- v1: given an array and user-specified attributes, returns an array of cross-tabs.
```javascript
tab(test_set,"input","target")
```

##Supervised Learning - decision-tree.js
###binaryTree() - for discrete tree learning
v1: A easy to use decision tree for binary targets and numeric input variables.
v2: In development will support discrete input variables and provide facility for ROC curves
```javascript
inputs = ["input","input2"];
output = binaryTree(test_set,inputs,"target",5)
```
