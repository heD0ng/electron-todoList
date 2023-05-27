import {app} from 'electron';
import {PROTOCOL} from '../config';

export const registerProtocol = () => {
    app.removeAsDefaultProtocolClient(PROTOCOL);
    // 检测伪协议;
    if (!app.isDefaultProtocolClient(PROTOCOL)) {
        app.setAsDefaultProtocolClient(PROTOCOL);
    }
}
