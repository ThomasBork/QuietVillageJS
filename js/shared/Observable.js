class Observable {
    constructor () {
        this.subscriptions = [];
    }

    removeSubscription (subscriber) {
        if (subscriber !== undefined) {
            this.subscriptions = this.subscriptions.filter(s => s.subscriber !== subscriber);
        }
    }

    addSubscription (callback, subscriber) {
        this.subscriptions.push ({subscriber: subscriber, callback: callback});
    }

    notify (...args) {
        this.subscriptions.forEach(subscription => subscription.callback.apply(subscription.subscriber, args));
    }
}