// var StatusModel = function(clients) {
//     var self = this;
//     self.clients = ko.observableArray();

//     self.addClient = function(client) {
//         self.clients.push(
//             new ClientModel(client)
//         );
//     };
 
//     self.removeClient = function(client) {
//         self.clients.remove(client);
//     };
 
//     self.updateClient = function(heartbeat) 
//     {
//         for(var i = 0 ; i < heartbeat.length ; i++)
//         {
//             let item = heartbeat[i];
//             if(self.clients()[i].name() === item.name)
//             {
//                 var koObj = self.clients()[i];
//                 koObj.cpu(item.cpu);
//                 koObj.memoryLoad(item.memoryLoad);
//                 koObj.status(item.status);
//             }
//         }
//     };

//     // initialize first time.
//     for( var i = 0; i < clients.length; i++)
//     {
//         self.addClient( clients[i] );
//     }
// };

// var ClientModel = function(client)
// {
//     var self = this;
//     self.cpu = ko.observable(client.cpu);
//     self.memoryLoad = ko.observable(client.memoryLoad);
//     self.name = ko.observable(client.name);
//     self.status = ko.observable(client.status);
// }
 
// var viewModel = new StatusModel(clients);
$(document).ready( function()
{
    // ko.applyBindings(viewModel);
    $('#statusTable').DataTable( { "paging":   false, "info":     false });

    var clients = [
        { 
            name: "us-east-alpine-001", cpu: "1.00%", memoryLoad: "0%",
            status: "#ab3fdd", recentData : [0, 9, 1, 10, 10, 10, 1, 1, 0, 0, 9, 8, 7, 8, 9]
        },
        { 
            name: "us-east-alpine-002", cpu: "1.00%", memoryLoad: "0%",
            status: "#ab3fdd", recentData : [0, 9, 1, 10, 10, 10, 1, 1, 0, 0, 9, 8, 7, 8, 9]
        },
        { 
            name: "us-east-alpine-003", cpu: "1.00%", memoryLoad: "0%",
            status: "#ab3fdd", recentData : [0, 9, 1, 10, 10, 10, 1, 1, 0, 0, 9, 8, 7, 8, 9]
        }
    ];

    let statusBars = new Vue({
        el: "#statusColors",
        data: function data(){
            return {clients: clients,componentKey:0};
        },
        methods: 
        {
            forceRerender() {
                this.componentKey += 1;  
            }
        }        
    })

    let table = new Vue({
        el: '#statusTable',
        data: function data()
        {
            return {
                clients: clients,
                componentKey: 0,
            };
        },
        methods: 
        {
            forceRerender() {
                this.componentKey += 1;  
            }
        }
    });

    var socket = io.connect(`${window.location.hostname}:3000`);
    console.log(socket);

    socket.on("heartbeat", function(heartbeat) 
    {
        console.log(JSON.stringify(heartbeat));
        //viewModel.updateClient(heartbeat);
        for( var client of heartbeat)
        {
            client.recentData = [0, 9, 1, 10, 10, 10, 1, 1, 0, 0, 9, 8, 7, 8, 9]
        }
        
        table.clients = heartbeat;
        statusBars.clients = heartbeat;

        // table.forceRerender();
        // statusBars.forceRerender();
    });
}); 
