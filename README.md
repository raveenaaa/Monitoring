# HW 4: Monitoring

In this homework we have constructed a basic monitoring infrastructure and recorded some metrics.

## Setup

Clone this repository:
```
git clone https://github.ncsu.edu/rmdcosta/HW4.git
```

Pull the following bakerx images.

```bash
# Updated to allow redis access from remote hosts
bakerx pull CSC-DevOps/Images#Spring2020 queues
bakerx pull CSC-DevOps/Images#Spring2020 alpine-node
```

Bring up the infrastructure.

```bash
cd Monitoring/servers
npm install
node index up
```

Inspect the console output for any errors, then confirm VMs have started in VirtualBox.

![vbox](img/vbox.png)

Open a terminal dedicated to the monitor instance and ssh into machine, `bakerx ssh monitor`.
Change into dashboard directory (which will be mounted at `/bakerx`), install packages, and start dashboard service.

```bash
cd /bakerx
npm install
node bin/www
```

Visit the monitoring dashboard at http://192.168.44.92:8080/. Confirm you can see the dashboard running.


## Task 1: Add memory/cpu metrics.

We have modified the `function memoryLoad()` to calculate the amount of memory currently used by the system as a percentage. We have used the `os` package for this.

Also we have modified `function cpuAverage()` to calculate the amount of load the cpu is under as a percentage using [`systeminformation.currentLoad`](https://www.npmjs.com/package/systeminformation#8-current-load-processes--services).


Test it out by registering your computer as client. Simply run the agent as follows:

```
cd agent/
node index.js computer
```

You should be able to verify your metrics being displayed in the dashboard. Recall, you should have `node bin/www` running inside the monitor VM.

#### Install agent on servers.

You can deploy this agent to run on your servers by using the `push` command provided in the driver:

```bash
cd servers/
node index.js push
```

You should see memory/cpu information being displayed in the dashboard for all the servers, including your computer.

## Task 2: Latency and HTTP status codes.

We have collected latency using the `Date` module. The HTTP status code can be taken from the server's response.

Restart the monitoring service, you should see the dashboard display latency information.

## Task 3: Calculate and display server health.

We make an overall assessment of a server's health by using our four metrics to calculate an overall health score (4 being good healthy and 0 being unhealthy).

The code is inside `dashboard/metrics/index.js#updateHealth(server)`.

The weight of each metric is 1. They contribute equally to the final score.

You should see the dashboard reflect the health of your servers in the server status field, as well as sparkline update to indicate the changes in score's trend per server.

## Task 4: Load services.

From your host computer, you should be able to visit `http://localhost:9001/work` in your browser, or make a curl request `curl http://localhost:9001/work` and see corresponding changes in the metrics from your dashboard.

Notice the impact of the workload based on hitting different endpoints:

* http://localhost:9001/
* http://localhost:9001/stackless
* http://localhost:9001/work


#### Can we create a even bigger load?

Siege is a tool for performing load testing of a site.

```
vagrant@ubuntu-bionic:/bakerx/metrics$ siege -b -t30s http://192.168.56.1:9001/
** SIEGE 4.0.4
** Preparing 25 concurrent users for battle.
The server is now under siege...
Lifting the server siege...
Transactions:                  34088 hits
Availability:                 100.00 %
Elapsed time:                  29.10 secs
Data transferred:               0.39 MB
Response time:                  0.02 secs
Transaction rate:            1171.41 trans/sec
Throughput:                     0.01 MB/sec
Concurrency:                   24.63
Successful transactions:       34088
Failed transactions:               0
Longest transaction:            0.53
Shortest transaction:           0.00
```

#### Installing siege

Mac: `brew install siege`  
Linux: `apt-get install siege`  
Windows: Install inside the monitor server (`bakerx ssh monitor`). Note: You should use the ip of your host computer (see dashboard/metrics/ip.txt) instead of localhost to create the desired effect.

Experiment with loading the server by hitting different endpoints. Can you cause the service to timeout?
```
siege -b -t30s http://localhost:9001/
siege -b -t30s http://localhost:9001/stackless
siege -b -t30s http://localhost:9001/work
```

## Task 5: New metric.

We have added [CPU Speed] as the new metric. For this following changes were made:
* Agent: [agent/index.js] the agent's message contains the cpu speed obtained using the [systeminformation] module
* Metrics: [dashboard/metrics/index.js] the metric was extracted from agent's message and added to the server.
* Display: [dashboard/www/index.html] here the metric was displayed.

## Conceptual Deployment Questions

**1. Compare a channel deployment model with a ring deployment model:**

In channel deployment changes are promoted to the next channel (alpha, beta, etc.) unless a release engineer decides to fast track a specific change.

In ring deployment changes are promoted from internal users to early adopters and subsequently to wider groups of users. Any change can stay in a ring for weeks. For a change to leave a ring it may have to be manually signed off and/or paass a more advanced testing. 

**2. Identify 2 situations where an expand/contract deployment could be useful:**

* If we want to implement a feature change immediately, without affecting existing functionalities.
* Updates to a database without affecting availability of old data.

**3. What are some tradeoffs associated with dark launches?**

Advantages:
* It can eliminate the need to support long-running release branch and reduce merge issues
* It allows for stability and experimentation as developers can test in production
* It improves the speed of disaster recovery as there is no rollback involved, just simply turn off the feature.

Disadvantages:
* Removing flags is a highly variable practice and reusing old flags can lead to unprecedented changes.
* Inconsistent user experiences.
* Supporting mulitple combinations of flags can lead to increase in engineering costs and reduce stability.

**4. Describe the Netflix style green-blue deployment. What can canary analysis tell us?**
	
A blue-green deployment strategy involves two duplicate instances of production infrastructure, one instance receives active traffic while one instance remains dormant and on stand-by. There will be a proxy that routes the traffic between the instances. In case of any error or failure, the proxy will switch the traffic over to the standby.

Canary analysis can tell us if there is a significant difference between the canary and the baseline metrics. The canary score is calcuated as the ratio of metrics classified as Pass our of the total.

## Screencast

* https://drive.google.com/file/d/1uvqANZ6PbxwAyeOHt1sNlxrNQFGaDxmT/view?usp=sharing

