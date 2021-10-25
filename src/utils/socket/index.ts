import { SocketIoConfig } from 'ngx-socket-io/src/config/socket-io.config';
import { environment } from 'src/environments/environment';

export const skIoConfig: SocketIoConfig = {
  url: environment.socketURL,
  options: {},
};
