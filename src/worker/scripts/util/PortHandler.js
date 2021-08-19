const PORTS = new Set;

class PortHandler extends EventTarget {

    constructor() {
        super();
        self.addEventListener("connect", event => {
            const port = event.ports[0];
            PORTS.add(port);
            port.addEventListener("message", event => {
                const ev = new Event("message");
                ev.port = port;
                ev.data = event.data;
                this.dispatchEvent(ev);
            });
            port.start();
        });
        self.addEventListener("disconnect", event => {
            PORTS.remove(event.ports[0]);
        });
    }

    sendOne(port, msg) {
        port.postMessage(msg);
    }

    sendAll(msg) {
        for (const p of PORTS) {
            p.postMessage(msg);
        }
    }
    
    sendAllButOne(port, msg) {
        for (const p of PORTS) {
            if (p == port) continue;
            p.postMessage(msg);
        }
    }

}

self.PortHandler = new PortHandler();
