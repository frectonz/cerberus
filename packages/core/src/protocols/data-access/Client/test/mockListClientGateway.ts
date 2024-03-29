import { ListClientGateway } from "../ListClientGateway";
import { makeClient } from "@cerberus/core/entities/Client/test";

export class ListClientGatewaySpy implements ListClientGateway {
  called: boolean = false;

  listClients() {
    this.called = true;
    return Promise.resolve([
      makeClient({
        id: "id",
        name: "client_name",
      }),
    ]);
  }
}
