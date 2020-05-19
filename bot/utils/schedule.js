const CronJob = require('Cron').CronJob;

class Job {
    constructor(range, task) {
        this.range = range          // This is a string
        this.task = task
    }
    schedule() {

        return new CronJob(this.range,this.task)

    }
    task(){}
}




module.exports = Job;