$(document).ready( function()
{
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

    const host = `${window.location.hostname}:3000`;
    console.log(`Connecting to ${host}`);
    var socket = io.connect(host, {
        upgrade: false,
        transports: ['websocket']
    });
    
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
