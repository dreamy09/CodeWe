import Config from "/js/dev/config.js";
import Debug from "/js/dev/utils/debug.js";

export class Socket{
    constructor(doc_id, interval=1000) {
        this.doc_id = doc_id;
        this.socket = io();
        this.join();
        this.stack = {'update text': []};
        this.preprocess = [];

        this.socket.on("text updated", data => {
            for(const request of data['requests']){
                Debug.debug('RECEIVE', request['type'], request['data']);
                const room = data['room'];
                const event = new CustomEvent('socket.receive.' + request['type'], { detail: {request, room}});
                document.dispatchEvent(event);
            }
        });

        document.addEventListener('socket.send', e => {
            if(e.detail.hasOwnProperty('request')) this.stack['update text'].push(e.detail.request);
            if(e.detail.hasOwnProperty('requests')) this.stack['update text'].push(...e.detail.requests);
        })

        document.addEventListener('socket.send_now', e => {
            this.send(e.detail.name, e.detail.requests);
        });

        document.addEventListener('socket.preprocess', e => {
            const name = e.detail[0];
            let args = e.detail[1];
            if(name === undefined) return;
            if(args === undefined) args = [];
            const tab = [name, args];
            if(!this.preprocess.includes(tab)){
                this.preprocess.push(tab);
                Debug.debug('New socket.preprocess', tab);
            }
        });

        setInterval(() => {
            for(const func of this.preprocess){
                func[0](...func[1]);
            }
            if(this.stack['update text'].length){
                this.send('update text', this.stack['update text'].splice(0, this.stack['update text'].length));
            }
        }, interval);

    }

    send(name, requests) {
        if(Config.isDebug() && Array.isArray(requests)){
            for(const request of requests){
                Debug.debug('SEND to \'' + name + '\' with type \'' + request['type'] + '\'', request['data']);
            }
        }
        this.socket.emit(name, {
            room: this.doc_id,
            requests: requests
        });
    }

    join() {
        this.send("join", {room: this.doc_id})
    }
}