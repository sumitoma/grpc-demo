const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo('localhost:4000', grpc.credentials.createInsecure());

client.createTodo({
    "id": -1,
    "text": "Do Laundry"
}, (err, response)=>{
    console.log(JSON.stringify(response));
});

client.readTodos({}, (err, response)=>{
    if(response && response.items)
        response.items.forEach(item =>{
            console.log(item.text);
        });
});

const call = client.readTodosStream();
call.on("data", item=>{
    console.log(`Received data from server ${JSON.stringify(item)}`);
});
call.on("end", e=> console.log("Stream ended!!"));