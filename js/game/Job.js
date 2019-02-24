class Job {
    constructor (name, description) {
        this.name = name;
        this.description = description;
        this.workerCount = 0;
        this.enabled = false;
    }
}

class ResourceJob extends Job {
    constructor (name, description, resourceType, income) {
        super(name, description, () => {});

        this.resourceType = resourceType;
        this.income = income;
    }
}